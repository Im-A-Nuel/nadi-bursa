'use client';

import { useEffect, useState } from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, YAxis } from 'recharts';
import { getIdxHistory, getIdxTotal, type IdxTotal, type IndexHistoryPoint } from '@/lib/sectors/client';
import { isMockMode } from '@/lib/sectors/client';

export function IHSGMarketStrip() {
  const [idx, setIdx] = useState<IdxTotal | null>(null);
  const [history, setHistory] = useState<IndexHistoryPoint[]>([]);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    Promise.all([getIdxTotal(), getIdxHistory()])
      .then(([summary, points]) => {
        setIdx(summary);
        setHistory(points);
      })
      .catch(() => setFailed(true));
  }, []);

  const positive = (idx?.changePercent ?? 0) >= 0;
  const chartColor = positive ? '#00D68F' : '#FF4D5E';

  return (
    <section className="border-b border-rule bg-ink" aria-label="IHSG market summary">
      <div className="mx-auto grid max-w-6xl grid-cols-[auto_minmax(90px,1fr)_auto] items-center gap-3 px-4 py-2.5 sm:grid-cols-[auto_minmax(180px,1fr)_auto] sm:gap-5 sm:px-6">
        <div className="flex items-center gap-2.5 whitespace-nowrap">
          <span className="field-label text-[var(--muted)]">IHSG</span>
          {failed ? (
            <span className="mono text-sm text-[var(--muted)]">Data unavailable</span>
          ) : idx ? (
            <>
              <span className="mono text-lg font-semibold tracking-tight text-white sm:text-2xl">{idx.close.toLocaleString()}</span>
              <span className={`mono inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold sm:text-xs ${positive ? 'badge-buy' : 'badge-sell'}`}>
                {positive ? '+' : ''}{idx.changePercent}%
              </span>
            </>
          ) : (
            <span className="h-6 w-24 animate-pulse rounded bg-panel-2" aria-label="Loading IHSG" />
          )}
        </div>

        <div className="h-10 min-w-0 sm:h-11" aria-label="IHSG 20 session trend">
          {history.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history} margin={{ top: 5, right: 2, left: 2, bottom: 0 }}>
                <defs>
                  <linearGradient id="ihsg-strip-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={chartColor} stopOpacity={0.20} />
                    <stop offset="100%" stopColor={chartColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <YAxis domain={['dataMin - 20', 'dataMax + 20']} hide />
                <Tooltip cursor={{ stroke: '#2A3348', strokeDasharray: '3 3' }} contentStyle={{ background: '#0A0E18', border: '1px solid #2A3348', borderRadius: 5, fontSize: 11, color: '#E8ECF4' }} labelFormatter={(label) => `IHSG / ${label}`} formatter={(value: number) => [value.toLocaleString(), 'Close']} />
                <Area type="monotone" dataKey="price" stroke={chartColor} strokeWidth={1.6} fill="url(#ihsg-strip-fill)" dot={false} activeDot={{ r: 3, fill: chartColor, stroke: '#05070D', strokeWidth: 1 }} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full w-full animate-pulse rounded bg-panel-2" />
          )}
        </div>

        <div className="flex items-center justify-end gap-3 whitespace-nowrap text-xs text-[var(--muted)]">
          {idx && <span className="mono hidden sm:inline">{(idx.volume / 1e9).toFixed(1)}B vol</span>}
          <span className="hidden h-1 w-1 rounded-full bg-rule-2 sm:block" aria-hidden="true" />
          <span className="inline-flex items-center gap-1.5 rounded border border-rule bg-panel-2 px-2 py-1">
            <span className={`led ${failed ? 'led-fail' : isMockMode() ? 'led-warn' : 'led-on'}`} aria-hidden="true" />
            <span className="mono text-[10px]">{failed ? 'OFFLINE' : isMockMode() ? 'DEMO' : 'LIVE'}</span>
          </span>
        </div>
      </div>
    </section>
  );
}
