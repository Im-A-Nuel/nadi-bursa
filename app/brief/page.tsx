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
  const { t } = useLang();

  useEffect(() => {
    (async () => {
      const [tickers, idx] = await Promise.all([getScreener(), getIdxTotal()]);
      const foreignData: Record<string, ForeignFlow | null> = {};
      const brokerData: Record<string, BrokerSummary | null> = {};
      await Promise.all(tickers.map(async tk => {
        const [f, b] = await Promise.all([getForeignFlow(tk.symbol), getBrokerSummary(tk.symbol)]);
        foreignData[tk.symbol] = f;
        brokerData[tk.symbol] = b;
      }));
      const wl = getWatchlist();
      const b = generateBrief(tickers, foreignData, brokerData, wl.length ? wl : tickers.slice(0, 3).map(t => t.symbol), idx!);
      setBrief(b);
      setBriefText(formatBriefText(b));
    })();
  }, []);

  if (!brief) return <div className="card text-center py-12 text-gray-400">{t('Generating brief...', 'Membuat rangkuman...')}</div>;

  return (
    <div className="animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">{t('Daily Brief', 'Rangkuman Harian')}</h1>
          <p className="text-gray-400 text-sm mt-1">{t('Automated 08:30 WIB morning briefing', 'Rangkuman pagi otomatis 08:30 WIB')}</p>
        </div>
        <MockDataBadge />
      </div>

      <div className="card glow-teal mb-6">
        <div className="flex items-baseline gap-4 mb-2">
          <span className="text-gold font-semibold">{brief.date}</span>
          <span className="text-gray-400 text-sm">{brief.timestamp}</span>
        </div>
        <div className="flex items-baseline gap-3">
          <span className="text-gray-400 text-sm">IHSG</span>
          <span className="text-xl font-bold text-white">{brief.idxSummary.close.toLocaleString()}</span>
          <span className={`font-semibold ${brief.idxSummary.changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {brief.idxSummary.changePercent >= 0 ? '+' : ''}{brief.idxSummary.changePercent}%
          </span>
        </div>
      </div>

      {brief.alerts.length > 0 && (
        <div className="card border-amber-500/20 mb-6">
          <h3 className="text-sm font-semibold text-amber-400 mb-3">{t('Alerts', 'Peringatan')}</h3>
          <div className="space-y-2">
            {brief.alerts.map((a, i) => (
              <div key={i} className="flex items-center gap-2 bg-amber-900/20 rounded-lg px-3 py-2">
                <span className="text-amber-400">{'\u26A0\uFE0F'}</span>
                <span className="text-gray-200 text-sm">{a}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {brief.watchlistHighlights.length > 0 && (
        <div className="card mb-6">
          <h3 className="text-sm font-semibold text-gold mb-3">{t('Your Watchlist', 'Watchlist Anda')}</h3>
          <div className="space-y-3">
            {brief.watchlistHighlights.map(h => (
              <div key={h.symbol} className="flex items-center gap-4 bg-navy-dark/40 rounded-lg px-4 py-3">
                <ScoreRing score={h.scores.overall} size={44} strokeWidth={3} />
                <div className="flex-1">
                  <div className="text-white font-semibold">{h.symbol}</div>
                  <div className="text-gray-400 text-xs mt-0.5">{h.signal.summary}</div>
                </div>
                <SignalBadge signal={h.signal.combinedSignal} compact />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card mb-6">
        <h3 className="text-sm font-semibold text-gold mb-3">{t('Top Movers', 'Pergerakan Terbesar')}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {brief.topMovers.map(m => (
            <div key={m.symbol} className="bg-navy-dark/40 rounded-lg px-3 py-2 text-center">
              <div className="text-white font-semibold text-sm">{m.symbol}</div>
              <div className={`font-bold ${m.changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {m.changePercent >= 0 ? '+' : ''}{m.changePercent}%
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gold">{t('Full Brief Text', 'Teks Rangkuman Lengkap')}</h3>
          <button onClick={() => navigator.clipboard?.writeText(briefText)} className="btn-outline text-xs px-3 py-1">
            {t('Copy', 'Salin')}
          </button>
        </div>
        <pre className="text-gray-300 text-xs font-mono whitespace-pre-wrap bg-navy-dark/40 rounded-lg p-4 max-h-96 overflow-y-auto">{briefText}</pre>
      </div>
    </div>
  );
}
