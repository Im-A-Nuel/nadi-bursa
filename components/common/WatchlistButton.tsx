'use client';
import { useEffect, useState } from 'react';
import { getWatchlist, addToWatchlist, removeFromWatchlist } from '@/lib/watchlist';

export function WatchlistButton({ symbol }: { symbol: string }) {
  const [inList, setInList] = useState(false);

  useEffect(() => { setInList(getWatchlist().includes(symbol)); }, [symbol]);

  const toggle = () => {
    if (inList) removeFromWatchlist(symbol);
    else addToWatchlist(symbol);
    setInList(!inList);
  };

  return (
    <button onClick={toggle} className={`btn-outline text-xs px-3 py-1.5 ${inList ? 'bg-gold/20 border-gold' : ''}`}>
      {inList ? '\u2605 ' + (inList ? 'Watching' : 'Watch') : '\u2606 Watch'}
    </button>
  );
}
