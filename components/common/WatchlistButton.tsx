'use client';
import { useEffect, useState } from 'react';
import { getWatchlist, addToWatchlist, removeFromWatchlist } from '@/lib/watchlist';

export function WatchlistButton({ symbol }: { symbol: string }) {
  const [inList, setInList] = useState(false);

  useEffect(() => {
    setInList(getWatchlist().includes(symbol));
  }, [symbol]);

  const toggle = () => {
    if (inList) removeFromWatchlist(symbol);
    else addToWatchlist(symbol);
    setInList(!inList);
  };

  return (
    <button
      onClick={toggle}
      aria-pressed={inList}
      aria-label={inList ? `Remove ${symbol} from watchlist` : `Add ${symbol} to watchlist`}
      className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold border transition-colors min-h-9 ${inList ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300' : 'border-white/10 text-slate-400 hover:text-white hover:border-white/15 hover:bg-white/5'}`}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill={inList ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M12 17.5l-6.2 3.3 1.2-7.2L2 8.7l7-1 3-6.2 3 6.2 7 1-5 4.9 1.2 7.2z" strokeLinejoin="round" /></svg>
      {inList ? 'Watching' : 'Watch'}
    </button>
  );
}
