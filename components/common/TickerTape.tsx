'use client';
import { useEffect, useState } from 'react';
import { getScreener, type ScreenerItem } from '@/lib/sectors/client';

export function TickerTape({ limit = 10 }: { limit?: number }) {
  const [tickers, setTickers] = useState<ScreenerItem[]>([]);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    getScreener().then((s) => setTickers(s.slice(0, limit)));
  }, [limit]);

  if (tickers.length === 0) {
    return <div className="h-9 border-b border-rule bg-panel-2" aria-hidden="true" />;
  }

  const items = [...tickers, ...tickers];

  return (
    <div className="tape-mask relative border-b border-rule bg-panel-2/60" role="region" aria-label="Ticker pergerakan saham">
      <div className={`tape-track ${paused ? 'tape-paused' : ''}`}>
        {items.map((tk, i) => (
          <span key={`${tk.symbol}-${i}`} className="inline-flex items-center gap-2 px-4 py-2 text-xs">
            <span className="mono font-semibold text-white tracking-tight">{tk.symbol}</span>
            <span className="mono tabular-nums text-[var(--muted)]">{tk.close.toLocaleString()}</span>
            <span className={`mono tabular-nums font-medium ${tk.changePercent >= 0 ? 'text-mint' : 'text-coral'}`}>
              {tk.changePercent >= 0 ? '+' : ''}{tk.changePercent}%
            </span>
            <span className="text-[var(--rule-2)] ml-2" aria-hidden="true">|</span>
          </span>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setPaused((value) => !value)}
        aria-pressed={paused}
        aria-label={paused ? 'Putar ticker tape' : 'Jeda ticker tape'}
        className="absolute right-2 top-1/2 z-10 inline-flex min-h-11 min-w-11 -translate-y-1/2 items-center justify-center rounded border border-rule bg-panel px-2 text-[var(--muted)] shadow-lg transition-colors hover:border-rule-2 hover:text-white"
      >
        <span className="mono text-[10px]">{paused ? 'PLAY' : 'PAUSE'}</span>
      </button>
    </div>
  );
}
