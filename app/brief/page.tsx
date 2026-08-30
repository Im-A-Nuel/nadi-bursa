'use client';
import { useEffect, useState } from 'react';
import { getScreener, getIdxTotal, getForeignFlow, getBrokerSummary, type ScreenerItem, type ForeignFlow, type BrokerSummary, type IdxTotal } from '@/lib/sectors/client';
import { generateBrief, formatBriefText, type DailyBrief } from '@/lib/briefGenerator';
import { getWatchlist } from '@/lib/watchlist';
import { MockDataBadge } from '@/components/common/MockDataBadge';
import { SignalBadge } from '@/components/common/SignalBadge';
import { ScoreRing } from '@/components/common/ScoreRing';
import { useLang } from '@/components/layout/LanguageProvider';

export default function BriefPage() {
  const [brief, setBrief] = useState<DailyBrief | null>(null);
  const [briefText, setBriefText] = useState('');
  const [copied, setCopied] = useState(false);
  const { t } = useLang();

  useEffect(() => {
    (async () => {
      const [tickers, idx] = await Promise.all([getScreener(), getIdxTotal()]);
      const foreignData: Record<string, ForeignFlow | null> = {};
      const brokerData: Record<string, BrokerSummary | null> = {};
      await Promise.all(
        tickers.map(async (tk) => {
          const [f, b] = await Promise.all([getForeignFlow(tk.symbol), getBrokerSummary(tk.symbol)]);
          foreignData[tk.symbol] = f;
          brokerData[tk.symbol] = b;
        })
      );
      const wl = getWatchlist();
      const b = generateBrief(tickers, foreignData, brokerData, wl.length ? wl : tickers.slice(0, 3).map((tk) => tk.symbol), idx!);
      setBrief(b);
      setBriefText(formatBriefText(b));
    })();
  }, []);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(briefText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

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
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">{t('Daily Brief', 'Rangkuman Harian')}</h1>
          <p className="mt-1 text-sm text-slate-400">{t('Automated 08:30 WIB morning briefing', 'Rangkuman pagi otomatis 08:30 WIB')}</p>
        </div>
        <MockDataBadge />
      </div>

      <div className="card-glass">
        <div className="flex flex-wrap items-baseline gap-3">
          <span className="text-sm font-semibold text-cyan-400">{brief.date}</span>
          <span className="text-xs text-slate-500">{brief.timestamp}</span>
        </div>
        <div className="mt-3 flex flex-wrap items-baseline gap-3">
          <span className="kicker">IHSG</span>
          <span className="text-xl font-bold tabular-nums text-white">{brief.idxSummary.close.toLocaleString()}</span>
          <span className={`text-sm font-semibold tabular-nums ${brief.idxSummary.changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{brief.idxSummary.changePercent >= 0 ? '+' : ''}{brief.idxSummary.changePercent}%</span>
        </div>
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
              <div key={h.symbol} className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/2 px-4 py-3">
                <ScoreRing score={h.scores.overall} size={44} strokeWidth={3} />
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
            <div key={m.symbol} className="rounded-xl border border-white/5 bg-white/2 px-3 py-2.5 text-center">
              <div className="text-sm font-semibold text-white">{m.symbol}</div>
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
        <pre className="whitespace-pre-wrap rounded-xl border border-white/5 bg-[#0A0F1F] p-4 text-xs leading-relaxed font-mono text-slate-300 max-h-96 overflow-auto">{briefText}</pre>
      </div>
    </div>
  );
}
