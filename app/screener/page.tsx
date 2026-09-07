'use client';
import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { getScreener, type ScreenerItem } from '@/lib/sectors/client';
import { computeAllScores } from '@/lib/healthScores';
import { MockDataBadge } from '@/components/common/MockDataBadge';
import { WatchlistButton } from '@/components/common/WatchlistButton';
import { TickerLogo } from '@/components/common/TickerLogo';
import { useLang } from '@/components/layout/LanguageProvider';

type SortKey = 'symbol' | 'close' | 'changePercent' | 'volume' | 'pe' | 'dividendYield' | 'overall';

export default function ScreenerPage() {
  const [tickers, setTickers] = useState<ScreenerItem[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>('overall');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'healthy' | 'watch'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { t } = useLang();

  const load = () => {
    setLoading(true);
    setError(false);
    getScreener().then(setTickers).catch(() => setError(true)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const sorted = useMemo(() => {
    let filtered = tickers.filter((tk) => {
      const q = search.toLowerCase();
      return tk.symbol.toLowerCase().includes(q) || tk.name.toLowerCase().includes(q);
    });
    if (statusFilter === 'healthy') filtered = filtered.filter((tk) => computeAllScores(tk).overall >= 60);
    if (statusFilter === 'watch') filtered = filtered.filter((tk) => computeAllScores(tk).overall < 60 || Math.abs(tk.changePercent) >= 2);
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

  if (loading) {
    return <div className="desk p-8 text-center"><span className="led led-live animate-soft-pulse" /><p className="mono mt-3 text-xs text-[var(--muted)]">{t('Loading screener...', 'Memuat saringan...')}</p></div>;
  }

  if (error) {
    return <div className="desk p-8 text-center"><span className="led led-fail" /><p className="mt-3 text-sm text-white">{t('Screener data failed to load.', 'Data saringan gagal dimuat.')}</p><button onClick={load} className="btn-line mt-4">{t('Try again', 'Coba lagi')}</button></div>;
  }

  return (
    <div className="animate-slide-up space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-white">{t('Screener', 'Saringan')}</h1>
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
            className="min-h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-base text-white placeholder:text-[var(--faint)] focus:border-live/50 focus:outline-none"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'healthy', 'watch'] as const).map((f) => (
            <button key={f} onClick={() => setStatusFilter(f)} aria-pressed={statusFilter === f} className={`rounded-xl px-3 py-2 text-xs font-semibold border min-h-11 ${statusFilter === f ? 'bg-live/15 border-live/30 text-[#9BE8FF]' : 'border-white/10 text-[var(--muted)] hover:text-white hover:bg-white/5'}`}>
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
<th key={k} aria-sort={sortKey === k ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'} className={`whitespace-nowrap px-4 py-3 text-xs font-semibold tracking-wide text-slate-400 ${k === 'symbol' ? 'sticky left-0 z-20 bg-[#0A0E18]' : ''}`}>
                    <button onClick={() => toggleSort(k as SortKey)} className="inline-flex min-h-11 items-center gap-1 hover:text-white transition-colors">
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
                const healthColor = sc.overall >= 70 ? '#00D68F' : sc.overall >= 50 ? '#22D3EE' : sc.overall >= 35 ? '#E7B44A' : '#FF4D5E';
                return (
                  <tr key={tk.symbol} className="border-b border-white/5 last:border-0 hover:bg-white/3">
                    <td className="sticky left-0 z-10 bg-panel px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <TickerLogo symbol={tk.symbol} name={tk.name} sector={tk.sector} size={32} />
                        <div>
                          <Link href={`/ticker/${tk.symbol}`} className="font-semibold text-white hover:text-cyan-400 transition-colors">{tk.symbol}</Link>
                          <div className="text-xs text-slate-500 truncate max-w-32">{tk.name}</div>
                        </div>
                      </div>
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
                  <td colSpan={8} className="px-4 py-10 text-center text-sm text-slate-500">
                    {t('No results. Try a different filter.', 'Tidak ada hasil. Coba filter lain.')}{' '}
                    <button onClick={() => { setSearch(''); setStatusFilter('all'); }} className="inline-flex min-h-11 items-center gap-1 text-gold hover:text-white transition-colors">{t('Reset filters', 'Reset filter')} →</button>
                  </td>
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
