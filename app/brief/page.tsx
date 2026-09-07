'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getScreener, getIdxTotal, getForeignFlow, getBrokerSummary, type ScreenerItem, type ForeignFlow, type BrokerSummary, type IdxTotal } from '@/lib/sectors/client';
import { generateBrief, formatBriefText, type DailyBrief } from '@/lib/briefGenerator';
import { getWatchlist } from '@/lib/watchlist';
import { MockDataBadge } from '@/components/common/MockDataBadge';
import { SignalBadge } from '@/components/common/SignalBadge';
import { ScoreRing } from '@/components/common/ScoreRing';
import { TickerLogo } from '@/components/common/TickerLogo';
import { useLang } from '@/components/layout/LanguageProvider';

export default function BriefPage() {
  const [brief, setBrief] = useState<DailyBrief | null>(null);
  const [briefText, setBriefText] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);
  const [emptyWatchlist, setEmptyWatchlist] = useState(false);
  const { t } = useLang();

  useEffect(() => {
    (async () => {
      try {
        const [tickers, idx] = await Promise.all([getScreener(), getIdxTotal()]);
        const wl = getWatchlist();
        if (!wl.length) {
          setEmptyWatchlist(true);
          return;
        }
        const foreignData: Record<string, ForeignFlow | null> = {};
        const brokerData: Record<string, BrokerSummary | null> = {};
        await Promise.all(
          tickers.map(async (tk) => {
            const [f, b] = await Promise.all([getForeignFlow(tk.symbol), getBrokerSummary(tk.symbol)]);
            foreignData[tk.symbol] = f;
            brokerData[tk.symbol] = b;
          })
        );
        const b = generateBrief(tickers, foreignData, brokerData, wl, idx!);
        setBrief(b);
        setBriefText(formatBriefText(b));
      } catch {
        setError(true);
      }
    })();
  }, []);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(briefText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  if (error)
    return <div className="desk p-8 text-center"><span className="led led-fail" /><p className="mt-3 text-sm text-white">{t('Brief data failed to load.', 'Data brief gagal dimuat.')}</p><button onClick={() => window.location.reload()} className="btn-line mt-4">{t('Try again', 'Coba lagi')}</button></div>;

  if (emptyWatchlist)
    return <div className="desk p-8 text-center"><span className="led led-warn" /><p className="mt-3 text-sm font-medium text-white">{t('Your watchlist is empty.', 'Watchlist Anda masih kosong.')}</p><p className="mt-1 text-sm text-[var(--muted)]">{t('Add a ticker first, then this brief will focus on your names.', 'Tambahkan ticker dulu, lalu brief ini akan fokus pada emiten pilihan Anda.')}</p><Link href="/screener" className="btn-primary mt-5">{t('Choose tickers', 'Pilih ticker')}</Link></div>;

  if (!brief)
    return (
      <div className="card text-center py-10">
        <div className="mx-auto w-6 h-6 rounded-full border-2 border-white/15 border-t-cyan-400 animate-spin" aria-hidden="true" />
        <p className="mt-3 text-sm text-slate-400">{t('Generating brief...', 'Membuat rangkuman...')}</p>
      </div>
    );

  return (
    <div className="animate-slide-up space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-white">{t('Daily Brief', 'Rangkuman Harian')}</h1>
          <p className="mt-1 text-sm text-slate-400">{t('Automated 08:30 WIB morning briefing', 'Rangkuman pagi otomatis 08:30 WIB')}</p>
        </div>
        <MockDataBadge />
      </div>

      {brief.alerts.length > 0 && (
        <div className="card border-amber-500/15">
          <h2 className="text-sm font-semibold text-amber-400 mb-3">{t('Alerts', 'Peringatan')}</h2>
          <div className="space-y-2">
            {brief.alerts.map((a, i) => (
              <div key={i} className="flex items-start gap-2 rounded-xl border border-amber-500/15 bg-amber-500/8 px-3 py-2.5">
                <span className="mt-0.5 text-amber-400" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 9v4M12 17h.01M10.3 3.7l-8 14A1 1 0 003.2 19h17.6a1 1 0 00.9-1.4l-8-14a1 1 0 00-1.7 0z" strokeLinejoin="round" /></svg>
                </span>
                <span className="text-sm text-slate-200">{a}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {brief.watchlistHighlights.length > 0 && (
        <div className="card">
          <h2 className="text-sm font-semibold text-white mb-3">{t('Your Watchlist', 'Watchlist Anda')}</h2>
          <div className="space-y-3">
            {brief.watchlistHighlights.map((h) => (
              <div key={h.symbol} className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/2 px-4 py-3">
                <TickerLogo symbol={h.symbol} size={36} />
                <ScoreRing score={h.scores.overall} size={36} strokeWidth={3} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-white">{h.symbol}</div>
                  <div className="text-xs text-slate-400 truncate">{h.signal.summary}</div>
                </div>
                <SignalBadge signal={h.signal.combinedSignal} compact />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <h2 className="text-sm font-semibold text-white mb-3">{t('Top Movers', 'Pergerakan Terbesar')}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {brief.topMovers.map((m) => (
            <div key={m.symbol} className="rounded-xl border border-white/5 bg-white/2 px-3 py-2.5 flex flex-col items-center gap-1">
              <TickerLogo symbol={m.symbol} size={28} />
              <div className="text-xs font-semibold tracking-widest text-slate-200 uppercase">{m.symbol}</div>
              <div className={`text-sm font-bold tabular-nums ${m.changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{m.changePercent >= 0 ? '+' : ''}{m.changePercent}%</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <h2 className="text-sm font-semibold text-white">{t('Full Brief Text', 'Teks Rangkuman Lengkap')}</h2>
          <button onClick={onCopy} className="btn-outline text-xs px-3 py-1.5 min-h-8" aria-label="Copy brief text">
            {copied ? t('Copied', 'Tersalin') : t('Copy', 'Salin')}
          </button>
        </div>
        <pre className="whitespace-pre-wrap rounded-xl border border-white/5 bg-[#070A12] p-4 text-xs leading-relaxed font-mono text-slate-300 max-h-96 overflow-auto">{briefText}</pre>
      </div>
    </div>
  );
}
