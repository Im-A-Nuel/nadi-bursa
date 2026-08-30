'use client';
import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { getScreener, type ScreenerItem } from '@/lib/sectors/client';
import { computeAllScores } from '@/lib/healthScores';
import { MockDataBadge } from '@/components/common/MockDataBadge';
import { WatchlistButton } from '@/components/common/WatchlistButton';
import { useLang } from '@/components/layout/LanguageProvider';

type SortKey = 'symbol' | 'close' | 'changePercent' | 'volume' | 'pe' | 'dividendYield' | 'overall';

export default function ScreenerPage() {
  const [tickers, setTickers] = useState<ScreenerItem[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>('overall');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'healthy' | 'watch'>('all');
  const { t } = useLang();

  useEffect(() => {
    getScreener().then(setTickers);
  }, []);

  const sorted = useMemo(() => {
    let filtered = tickers.filter((tk) => {
      const q = search.toLowerCase();
      return tk.symbol.toLowerCase().includes(q) || tk.name.toLowerCase().includes(q);
    });
    if (statusFilter === 'healthy') filtered = filtered.filter((tk) => computeAllScores(tk).overall >= 60);
    return filtered.sort((a, b) => {
      let va: number, vb: number;
      if (sortKey === 'overall') {
        va = computeAllScores(a).overall;
        vb = computeAllScores(b).overall;
      } else if (sortKey === 'symbol') {
        const cmp = a.symbol.localeCompare(b.symbol);
        return sortDir === 'asc' ? cmp : -cmp;
      } else {
        va = (a as unknown as Record<string, number>)[sortKey] || 0;
        vb = (b as unknown as Record<string, number>)[sortKey] || 0;
      }
      return sortDir === 'asc' ? va - vb : vb - va;
    });
  }, [tickers, sortKey, sortDir, search, statusFilter]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const arrow = (key: SortKey) => (sortKey === key ? (sortDir === 'asc' ? ' ↑' : ' ↓') : '');

  return (
    <div className="animate-slide-up space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">{t('Screener', 'Saringan')}</h1>
          <p className="mt-1 text-sm text-slate-400">{t('Filter and sort IDX stocks by derived health', 'Filter dan urutkan saham IDX berdasar skor turunan')}</p>
        </div>
        <MockDataBadge />
      </div>

      <div className="card flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <label htmlFor="screener-search" className="sr-only">{t('Search ticker or name', 'Cari ticker atau nama')}</label>
          <input
            id="screener-search"
            type="text"
            placeholder={t('Search ticker or name...', 'Cari ticker atau nama...')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400/50 focus:outline-none"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'healthy', 'watch'] as const).map((f) => (
            <button key={f} onClick={() => setStatusFilter(f)} className={`rounded-xl px-3 py-2 text-xs font-semibold border min-h-10 ${statusFilter === f ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300' : 'border-white/10 text-slate-400 hover:text-white hover:bg-white/5'}`}>
              {f === 'all' ? t('All', 'Semua') : f === 'healthy' ? t('Healthy 60+', 'Sehat 60+') : t('Watch idea', 'Ide Watch')}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-white/2 text-left">
                {[
                  ['symbol', 'Ticker'],
                  ['close', t('Price', 'Harga')],
                  ['changePercent', t('Change', 'Perubahan')],
                  ['volume', t('Volume', 'Volume')],
                  ['pe', 'P/E'],
                  ['dividendYield', 'DIV%'],
                  ['overall', t('Health', 'Kesehatan')],
                ].map(([k, label]) => (
                  <th key={k} className="whitespace-nowrap px-4 py-3 text-xs font-semibold tracking-wide text-slate-400">
                    <button onClick={() => toggleSort(k as SortKey)} className="hover:text-white transition-colors">
                      {label}
                      {arrow(k as SortKey)}
                    </button>
                  </th>
                ))}
                <th className="px-4 py-3 text-xs font-semibold tracking-wide text-slate-400">Watch</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((tk) => {
                const sc = computeAllScores(tk);
                const healthColor = sc.overall >= 70 ? '#22C55E' : sc.overall >= 50 ? '#06B6D4' : sc.overall >= 35 ? '#F59E0B' : '#EF4444';
                return (
                  <tr key={tk.symbol} className="border-b border-white/5 last:border-0 hover:bg-white/3">
                    <td className="px-4 py-3">
                      <Link href={`/ticker/${tk.symbol}`} className="font-semibold text-white hover:text-cyan-400 transition-colors">{tk.symbol}</Link>
                      <div className="text-xs text-slate-500 truncate max-w-32">{tk.name}</div>
                    </td>
                    <td className="px-4 py-3 font-medium tabular-nums text-white">{tk.close.toLocaleString()}</td>
                    <td className={`px-4 py-3 font-semibold tabular-nums ${tk.changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{tk.changePercent >= 0 ? '+' : ''}{tk.changePercent}%</td>
                    <td className="px-4 py-3 tabular-nums text-slate-300">{(tk.volume / 1e6).toFixed(1)}M</td>
                    <td className="px-4 py-3 tabular-nums text-slate-300">{tk.pe > 0 ? tk.pe.toFixed(1) : '-'}</td>
                    <td className="px-4 py-3 tabular-nums text-slate-300">{tk.dividendYield > 0 ? `${tk.dividendYield.toFixed(1)}%` : '-'}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border" style={{ backgroundColor: `${healthColor}14`, color: healthColor, borderColor: `${healthColor}22` }}>{sc.overall}</span>
                    </td>
                    <td className="px-4 py-3">
                      <WatchlistButton symbol={tk.symbol} />
                    </td>
                  </tr>
                );
              })}
              {sorted.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-sm text-slate-500">{t('No results. Try a different filter.', 'Tidak ada hasil. Coba filter lain.')}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-slate-500">{t('Showing', 'Menampilkan')} {sorted.length} {t('of', 'dari')} {tickers.length} tickers • {t('Scores are derived, not raw data', 'Skor adalah turunan, bukan data mentah')}</p>
    </div>
  );
}
