'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getScreener, getIdxTotal, getTopChanges, type ScreenerItem, type IdxTotal, type TopChangeItem } from '@/lib/sectors/client';
import { computeAllScores } from '@/lib/healthScores';
import { ScoreRing } from '@/components/common/ScoreRing';
import { MockDataBadge } from '@/components/common/MockDataBadge';
import { useLang } from '@/components/layout/LanguageProvider';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

function Spark({ seed }: { seed: number }) {
  const data = Array.from({ length: 14 }, (_, i) => ({ v: 10 + Math.sin(i * 0.8 + seed) * 3 + (seed % 3) }));
  const color = seed % 3 === 0 ? '#22C55E' : seed % 3 === 1 ? '#06B6D4' : '#EC4899';
  return (
    <ResponsiveContainer width="100%" height={36}>
      <AreaChart data={data}>
        <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.6} fill={color} fillOpacity={0.12} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default function DashboardPage() {
  const [tickers, setTickers] = useState<ScreenerItem[]>([]);
  const [idx, setIdx] = useState<IdxTotal | null>(null);
  const [topMovers, setTopMovers] = useState<TopChangeItem[]>([]);
  const { t } = useLang();

  useEffect(() => {
    Promise.all([getScreener(), getIdxTotal(), getTopChanges()]).then(([s, i, m]) => {
      setTickers(s);
      setIdx(i);
      setTopMovers(m);
    });
  }, []);

  if (tickers.length === 0) {
    return <div className="card text-sm text-slate-400">{t('Loading market data...', 'Memuat data pasar...')}</div>;
  }

  return (
    <div className="animate-slide-up space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">{t('Dashboard', 'Dasbor')}</h1>
          <p className="mt-1 text-sm text-slate-400">{t('Derived health scores for IDX stocks', 'Skor kesehatan turunan untuk saham IDX')}</p>
        </div>
        <MockDataBadge />
      </div>

      {idx && (
        <div className="card-glass flex flex-wrap items-baseline gap-3">
          <span className="kicker">IHSG</span>
          <span className="text-xl font-bold tabular-nums text-white">{idx.close.toLocaleString()}</span>
          <span className={`text-sm font-semibold tabular-nums ${idx.changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{idx.changePercent >= 0 ? '+' : ''}{idx.changePercent}%</span>
          <span className="ml-auto text-xs text-slate-500">{idx.volume.toLocaleString()} vol</span>
          <span className="text-xs text-slate-600">• Sectors v2</span>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-white">{t('Top Scoring Assets', 'Aset Skor Tertinggi')}</h2>
          <Link href="/screener" className="text-xs font-medium text-cyan-400 hover:text-cyan-300">Saring</Link>
        </div>
        <div className="grid-staking">
          {[...tickers]
            .sort((a, b) => computeAllScores(b).overall - computeAllScores(a).overall)
            .slice(0, 3)
            .map((tk) => {
              const sc = computeAllScores(tk);
              const col = sc.overall >= 68 ? '#22C55E' : sc.overall >= 48 ? '#06B6D4' : '#EC4899';
              return (
                <Link key={tk.symbol} href={`/ticker/${tk.symbol}`} className="card card-hover block">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs font-semibold tracking-widest text-slate-500 uppercase">{tk.symbol}</div>
                      <div className="text-xs text-slate-500 truncate max-w-28">{tk.name}</div>
                    </div>
                    <ScoreRing score={sc.overall} size={42} strokeWidth={3} />
                  </div>
                  <div className="mt-3 text-2xl font-bold tabular-nums" style={{ color: col }}>{sc.overall}</div>
                  <div className="kicker -mt-1">health</div>
                  <div className="mt-2 -mx-1"><Spark seed={sc.overall} /></div>
                  <div className="mt-1 text-xs tabular-nums flex items-center gap-2">
                    <span className={tk.changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}>{tk.changePercent >= 0 ? '+' : ''}{tk.changePercent}%</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-400">{tk.close.toLocaleString()}</span>
                  </div>
                </Link>
              );
            })}
        </div>
      </div>

      {topMovers.length > 0 && (
        <div className="card">
          <h3 className="text-sm font-semibold text-white mb-3">{t('Top Movers', 'Pergerakan Terbesar')}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {topMovers.slice(0, 4).map((m) => (
              <div key={m.symbol} className="rounded-xl border border-white/5 bg-white/2 px-3 py-3">
                <div className="text-xs font-semibold tracking-widest text-slate-500 uppercase">{m.symbol}</div>
                <div className={`text-lg font-bold tabular-nums ${m.changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{m.changePercent >= 0 ? '+' : ''}{m.changePercent}%</div>
                <div className="text-xs text-slate-500 truncate">{m.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">{t('All Stocks - Health Scores', 'Semua Saham - Skor Kesehatan')}</h3>
        <span className="kicker">{tickers.length} tickers</span>
      </div>
      <div className="space-y-2.5">
        {[...tickers]
          .sort((a, b) => computeAllScores(b).overall - computeAllScores(a).overall)
          .map((tk) => {
            const sc = computeAllScores(tk);
            return (
              <Link key={tk.symbol} href={`/ticker/${tk.symbol}`} className="card card-hover flex items-center gap-4">
                <ScoreRing score={sc.overall} size={48} strokeWidth={3.5} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">{tk.symbol}</span>
                    <span className="hidden sm:inline text-xs text-slate-500 truncate">{tk.name}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-xs">
                    <span className="px-1.5 py-0.5 rounded-full border text-xs font-medium" style={{ borderColor: sc.dividendHealth >= 60 ? 'rgba(34,197,94,0.22)' : 'rgba(148,163,184,0.18)', color: sc.dividendHealth >= 60 ? '#4ADE80' : '#94A3B8', background: sc.dividendHealth >= 60 ? 'rgba(34,197,94,0.10)' : 'rgba(148,163,184,0.08)' }}>DIV {sc.dividendHealth}</span>
                    <span className="px-1.5 py-0.5 rounded-full border text-xs font-medium" style={{ borderColor: sc.valueQuality >= 60 ? 'rgba(6,182,212,0.22)' : 'rgba(148,163,184,0.18)', color: sc.valueQuality >= 60 ? '#22D3EE' : '#94A3B8', background: sc.valueQuality >= 60 ? 'rgba(6,182,212,0.10)' : 'rgba(148,163,184,0.08)' }}>VAL {sc.valueQuality}</span>
                    <span className="hidden sm:inline-flex px-1.5 py-0.5 rounded-full border text-xs font-medium" style={{ borderColor: sc.liquidity >= 60 ? 'rgba(192,132,252,0.22)' : 'rgba(148,163,184,0.18)', color: sc.liquidity >= 60 ? '#C084FC' : '#94A3B8', background: sc.liquidity >= 60 ? 'rgba(192,132,252,0.10)' : 'rgba(148,163,184,0.08)' }}>LIQ {sc.liquidity}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-semibold tabular-nums text-white">{tk.close.toLocaleString()}</div>
                  <div className={`text-xs font-medium tabular-nums ${tk.changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{tk.changePercent >= 0 ? '+' : ''}{tk.changePercent}%</div>
                </div>
              </Link>
            );
          })}
      </div>
    </div>
  );
}
