'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getScreener, getIdxTotal, getTopChanges, type ScreenerItem, type IdxTotal, type TopChangeItem } from '@/lib/sectors/client';
import { computeAllScores, getHealthBand } from '@/lib/healthScores';
import { computeDerivedSignal } from '@/lib/signals';
import { ScoreRing, ScoreBadge } from '@/components/common/ScoreRing';
import { SignalBadge } from '@/components/common/SignalBadge';
import { MockDataBadge } from '@/components/common/MockDataBadge';
import { useLang } from '@/components/layout/LanguageProvider';

export default function DashboardPage() {
  const [tickers, setTickers] = useState<ScreenerItem[]>([]);
  const [idx, setIdx] = useState<IdxTotal | null>(null);
  const [topMovers, setTopMovers] = useState<TopChangeItem[]>([]);
  const { t } = useLang();

  useEffect(() => {
    Promise.all([getScreener(), getIdxTotal(), getTopChanges()]).then(([s, i, m]) => {
      setTickers(s); setIdx(i); setTopMovers(m);
    });
  }, []);

  return (
    <div className="animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">{t('Dashboard', 'Dasbor')}</h1>
          <p className="text-gray-400 text-sm mt-1">{t('Derived health scores for IDX stocks', 'Skor kesehatan turunan untuk saham IDX')}</p>
        </div>
        <MockDataBadge />
      </div>

      {idx && (
        <div className="card glow-gold mb-6">
          <div className="flex items-baseline gap-4">
            <span className="text-gray-400 text-sm">IHSG</span>
            <span className="text-2xl font-bold text-white">{idx.close.toLocaleString()}</span>
            <span className={`font-semibold ${idx.changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {idx.changePercent >= 0 ? '+' : ''}{idx.changePercent}%
            </span>
            <span className="text-gray-500 text-xs ml-auto">{idx.volume.toLocaleString()} vol</span>
          </div>
        </div>
      )}

      {topMovers.length > 0 && (
        <div className="card mb-6">
          <h3 className="text-sm font-semibold text-gold mb-3">{t('Top Movers', 'Pergerakan Terbesar')}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {topMovers.slice(0, 4).map(m => (
              <div key={m.symbol} className="bg-navy-dark/40 rounded-lg p-3">
                <div className="text-white font-semibold text-sm">{m.symbol}</div>
                <div className={`text-lg font-bold ${m.changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {m.changePercent >= 0 ? '+' : ''}{m.changePercent}%
                </div>
                <div className="text-gray-500 text-xs">{m.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <h3 className="text-sm font-semibold text-gold mb-3">{t('All Stocks — Health Scores', 'Semua Saham — Skor Kesehatan')}</h3>
      <div className="space-y-2">
        {tickers.map(ticker => {
          const scores = computeAllScores(ticker);
          return (
            <Link key={ticker.symbol} href={`/ticker/${ticker.symbol}`} className="card card-hover flex items-center gap-4 group">
              <ScoreRing score={scores.overall} size={52} strokeWidth={4} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-white font-semibold">{ticker.symbol}</span>
                  <span className="text-gray-500 text-xs truncate hidden sm:inline">{ticker.name}</span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <ScoreBadge score={scores.dividendHealth} />
                  <ScoreBadge score={scores.valueQuality} />
                  <ScoreBadge score={scores.liquidity} />
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-semibold">{ticker.close.toLocaleString()}</div>
                <div className={`text-sm font-medium ${ticker.changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {ticker.changePercent >= 0 ? '+' : ''}{ticker.changePercent}%
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
