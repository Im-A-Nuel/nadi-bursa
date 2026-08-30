'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getScreener, getIdxTotal, type ScreenerItem, type IdxTotal } from '@/lib/sectors/client';
import { computeAllScores } from '@/lib/healthScores';
import { MockDataBadge } from '@/components/common/MockDataBadge';
import { ScoreRing } from '@/components/common/ScoreRing';
import { useLang } from '@/components/layout/LanguageProvider';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

function MiniSpark({ color }: { color: string }) {
  const data = Array.from({ length: 12 }, (_, i) => ({ v: 8 + Math.sin(i * 0.9) * 4 + Math.random() * 2 }));
  return (
    <ResponsiveContainer width="100%" height={48}>
      <AreaChart data={data}>
        <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.8} fill={color} fillOpacity={0.14} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default function HomePage() {
  const [tickers, setTickers] = useState<ScreenerItem[]>([]);
  const [idx, setIdx] = useState<IdxTotal | null>(null);
  const { t } = useLang();

  useEffect(() => {
    Promise.all([getScreener(), getIdxTotal()]).then(([s, i]) => {
      setTickers(s);
      setIdx(i);
    });
  }, []);

  const top3 = [...tickers].sort((a, b) => computeAllScores(b).overall - computeAllScores(a).overall).slice(0, 3);

  return (
    <div className="animate-slide-up space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">Sinyal Hari Ini</h1>
          <p className="mt-2 max-w-2xl text-sm sm:text-base text-slate-400">
            {t('IDX intelligence for retail investors. Health scores, anomaly radar, foreign flow and broker signals, daily brief 08:30 WIB.', 'Inteligensi IDX untuk investor ritel. Skor kesehatan, radar anomali, sinyal asing dan broker, brief harian 08:30 WIB.')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <MockDataBadge />
          <Link href="/dashboard" className="btn-primary">Buka Dashboard</Link>
        </div>
      </div>

      {idx && (
        <div className="card-glass flex flex-wrap items-baseline gap-4">
          <span className="kicker">IHSG</span>
          <span className="text-2xl font-bold text-white tabular-nums">{idx.close.toLocaleString()}</span>
          <span className={`text-sm font-semibold tabular-nums ${idx.changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{idx.changePercent >= 0 ? '+' : ''}{idx.changePercent}%</span>
          <span className="text-xs text-slate-500 ml-auto">{idx.volume.toLocaleString()} vol</span>
          <span className="text-xs text-slate-500">• Powered by Sectors API v2</span>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold tracking-wide text-white">{t('Top Scoring Assets', 'Aset Skor Tertinggi')}</h2>
          <Link href="/screener" className="text-xs font-medium text-cyan-400 hover:text-cyan-300">Lihat saringan</Link>
        </div>
        <div className="grid-staking">
          {top3.map((tk) => {
            const sc = computeAllScores(tk);
            const col = sc.overall >= 70 ? '#22C55E' : sc.overall >= 50 ? '#06B6D4' : '#EC4899';
            return (
              <div key={tk.symbol} className="card card-hover relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" aria-hidden="true" />
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs font-semibold tracking-widest text-slate-500 uppercase">{tk.symbol}</div>
                    <div className="text-xs text-slate-500 truncate max-w-32">{tk.name}</div>
                  </div>
                  <ScoreRing score={sc.overall} size={44} strokeWidth={3} />
                </div>
                <div className="mt-3">
                  <div className="text-2xl font-bold tracking-tight tabular-nums" style={{ color: col }}>{sc.overall}</div>
                  <div className="kicker -mt-1">health score</div>
                </div>
                <div className="mt-2 -mx-1">
                  <MiniSpark color={col} />
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs tabular-nums">
                  <span className={tk.changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}>{tk.changePercent >= 0 ? '+' : ''}{tk.changePercent}%</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400">{tk.close.toLocaleString()}</span>
                </div>
              </div>
            );
          })}
          {top3.length === 0 && (
            <div className="card text-sm text-slate-500">Memuat data...</div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {[
          { href: '/screener', title: t('Screener', 'Saringan'), desc: t('Filter and sort by health, price and volume', 'Filter dan urut berdasar skor, harga dan volume'), dot: 'bg-cyan-400' },
          { href: '/radar', title: t('Anomaly Radar', 'Radar Anomali'), desc: t('Price and volume vs sector baseline', 'Harga dan volume vs baseline sektor'), dot: 'bg-pink-500' },
          { href: '/brief', title: t('Daily Brief 08:30', 'Brief Harian 08:30'), desc: t('Personalized for your watchlist', 'Dipersonalisasi untuk watchlist'), dot: 'bg-emerald-400' },
        ].map((c) => (
          <Link key={c.href} href={c.href} className="card card-hover group">
            <div className="flex items-center gap-2 mb-2">
              <span className={`w-2 h-2 rounded-full ${c.dot}`} aria-hidden="true" />
              <h3 className="text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors">{c.title}</h3>
            </div>
            <p className="text-xs text-slate-400">{c.desc}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white">{t('How it works', 'Cara kerja')}</h3>
            <Link href="/about" className="text-xs text-cyan-400 hover:text-cyan-300">Tentang</Link>
          </div>
          <ol className="space-y-2 text-sm text-slate-300">
            <li className="flex gap-3"><span className="w-6 h-6 rounded-full bg-white/5 border border-white/10 grid place-items-center text-xs font-bold text-slate-300">1</span><span>{t('Scores computed from Sectors v2: dividend, value, liquidity', 'Skor dihitung dari Sectors v2: dividen, valuasi, likuiditas')}</span></li>
            <li className="flex gap-3"><span className="w-6 h-6 rounded-full bg-white/5 border border-white/10 grid place-items-center text-xs font-bold text-slate-300">2</span><span>{t('Foreign flow and broker divergence become a single signal', 'Arus asing dan divergensi broker jadi satu sinyal')}</span></li>
            <li className="flex gap-3"><span className="w-6 h-6 rounded-full bg-white/5 border border-white/10 grid place-items-center text-xs font-bold text-slate-300">3</span><span>{t('Watchlist triggers your 08:30 briefing', 'Watchlist memicu briefing 08:30 untukmu')}</span></li>
          </ol>
        </div>
        <div className="card card-glow">
          <h3 className="text-sm font-semibold text-white mb-2">{t('Automation evidence', 'Bukti otomasi')}</h3>
          <p className="text-xs text-slate-400 mb-3">{t('Every brief runs before market open. See the log for proof.', 'Setiap brief jalan sebelum buka pasar. Lihat log sebagai bukti.')}</p>
          <Link href="/scheduler" className="btn-outline w-full justify-center text-xs">Lihat Scheduler Log</Link>
        </div>
      </div>
    </div>
  );
}
