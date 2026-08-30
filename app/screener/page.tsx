'use client';
import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { getScreener, type ScreenerItem } from '@/lib/sectors/client';
import { computeAllScores, getHealthBand } from '@/lib/healthScores';
import { MockDataBadge } from '@/components/common/MockDataBadge';
import { WatchlistButton } from '@/components/common/WatchlistButton';
import { useLang } from '@/components/layout/LanguageProvider';

type SortKey = 'symbol' | 'close' | 'changePercent' | 'volume' | 'pe' | 'dividendYield' | 'overall';

export default function ScreenerPage() {
  const [tickers, setTickers] = useState<ScreenerItem[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>('overall');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [search, setSearch] = useState('');
  const { t } = useLang();

  useEffect(() => { getScreener().then(setTickers); }, []);

  const sorted = useMemo(() => {
    const filtered = tickers.filter(t => t.symbol.toLowerCase().includes(search.toLowerCase()) || t.name.toLowerCase().includes(search.toLowerCase()));
    return filtered.sort((a, b) => {
      let va: number, vb: number;
      if (sortKey === 'overall') {
        va = computeAllScores(a).overall;
        vb = computeAllScores(b).overall;
      } else if (sortKey === 'symbol') {
        return sortDir === 'asc' ? a.symbol.localeCompare(b.symbol) : b.symbol.localeCompare(a.symbol);
      } else {
        va = (a as any)[sortKey] || 0;
        vb = (b as any)[sortKey] || 0;
      }
      return sortDir === 'asc' ? va - vb : vb - va;
    });
  }, [tickers, sortKey, sortDir, search]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const arrow = (key: SortKey) => sortKey === key ? (sortDir === 'asc' ? ' \u2191' : ' \u2193') : '';

  return (
    <div className="animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">{t('Screener', 'Saringan')}</h1>
          <p className="text-gray-400 text-sm mt-1">{t('Filter and sort IDX stocks', 'Filter dan urutkan saham IDX')}</p>
        </div>
        <MockDataBadge />
      </div>
      <div className="card mb-4">
        <input type="text" placeholder={t('Search ticker or name...', 'Cari ticker atau nama...')} value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-navy-dark/60 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:border-gold/50 outline-none" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-400 text-left border-b border-white/5">
              {[
                ['symbol', 'Ticker'], ['close', t('Price', 'Harga')], ['changePercent', t('Change', 'Perubahan')],
                ['volume', t('Volume', 'Volume')], ['pe', 'P/E'], ['dividendYield', 'DIV%'],
                ['overall', t('Health', 'Kesehatan')],
              ].map(([k, l]) => (
                <th key={k} className="pb-3 pr-4 cursor-pointer hover:text-gold select-none" onClick={() => toggleSort(k as SortKey)}>
                  {l}{arrow(k as SortKey)}
                </th>
              ))}
              <th className="pb-3"></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(ticker => {
              const scores = computeAllScores(ticker);
              const band = getHealthBand(scores.overall);
              return (
                <tr key={ticker.symbol} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="py-3 pr-4">
                    <Link href={`/ticker/${ticker.symbol}`} className="text-white font-semibold hover:text-gold">{ticker.symbol}</Link>
                    <div className="text-gray-500 text-xs">{ticker.name}</div>
                  </td>
                  <td className="py-3 pr-4 text-white font-medium">{ticker.close.toLocaleString()}</td>
                  <td className={`py-3 pr-4 font-semibold ${ticker.changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {ticker.changePercent >= 0 ? '+' : ''}{ticker.changePercent}%
                  </td>
                  <td className="py-3 pr-4 text-gray-300">{(ticker.volume / 1e6).toFixed(1)}M</td>
                  <td className="py-3 pr-4 text-gray-300">{ticker.pe > 0 ? ticker.pe.toFixed(1) : '-'}</td>
                  <td className="py-3 pr-4 text-gray-300">{ticker.dividendYield > 0 ? ticker.dividendYield.toFixed(1) + '%' : '-'}</td>
                  <td className="py-3 pr-4">
                    <span className="badge" style={{ backgroundColor: `${band.color}20`, color: band.color, border: `1px solid ${band.color}40` }}>
                      {scores.overall}
                    </span>
                  </td>
                  <td className="py-3"><WatchlistButton symbol={ticker.symbol} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
