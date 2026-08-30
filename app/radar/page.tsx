'use client';
import { useEffect, useState } from 'react';
import { getScreener, getTopChanges, getIdxTotal, type ScreenerItem, type TopChangeItem, type IdxTotal } from '@/lib/sectors/client';
import { detectAnomalies, type Anomaly } from '@/lib/radar/anomalyDetector';
import { MockDataBadge } from '@/components/common/MockDataBadge';
import { useLang } from '@/components/layout/LanguageProvider';

export default function RadarPage() {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [movers, setMovers] = useState<TopChangeItem[]>([]);
  const [tickers, setTickers] = useState<ScreenerItem[]>([]);
  const [idx, setIdx] = useState<IdxTotal | null>(null);
  const { t } = useLang();

  useEffect(() => {
    Promise.all([getScreener(), getTopChanges(), getIdxTotal()]).then(([s, m, i]) => {
      setTickers(s);
      setAnomalies(detectAnomalies(s));
      setMovers(m);
      setIdx(i);
    });
  }, []);

  const high = anomalies.filter((a) => a.severity === 'high');
  const med = anomalies.filter((a) => a.severity === 'medium');
  const low = anomalies.filter((a) => a.severity === 'low');

  return (
    <div className="animate-slide-up space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">{t('Anomaly Radar', 'Radar Anomali')}</h1>
          <p className="mt-1 text-sm text-slate-400">{t('Unusual price and volume versus sector baseline', 'Harga dan volume tidak biasa versus baseline sektor')}</p>
        </div>
        <MockDataBadge />
      </div>

      {idx && (
        <div className="card flex flex-wrap items-baseline gap-3">
          <span className="kicker">IHSG</span>
          <span className="text-lg font-bold tabular-nums text-white">{idx.close.toLocaleString()}</span>
          <span className={`text-sm font-semibold tabular-nums ${idx.changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{idx.changePercent >= 0 ? '+' : ''}{idx.changePercent}%</span>
          <span className="ml-auto text-xs text-slate-500">{t('Scanned', 'Dipindai')} {tickers.length} tickers</span>
        </div>
      )}

      {high.length > 0 && (
        <div className="card border-red-500/15">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-red-500" aria-hidden="true" />
            <h2 className="text-sm font-semibold text-red-400">{t('High Severity', 'Tingkat Tinggi')} • {high.length}</h2>
          </div>
          <div className="space-y-2">
            {high.map((a) => (
              <div key={`${a.symbol}-${a.type}`} className="flex items-center gap-3 rounded-xl border border-red-500/15 bg-red-500/8 px-4 py-3">
                <span className="text-sm font-bold text-red-400" aria-hidden="true">!</span>
                <span className="text-sm font-semibold text-white">{a.symbol}</span>
                <span className="flex-1 text-sm text-slate-300">{a.message}</span>
                <span className="hidden sm:inline text-xs px-2 py-1 rounded-full bg-red-500/15 text-red-300 border border-red-500/20">{a.type.replace('_', ' ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {med.length > 0 && (
        <div className="card border-amber-500/15">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-amber-500" aria-hidden="true" />
            <h2 className="text-sm font-semibold text-amber-400">{t('Medium', 'Sedang')} • {med.length}</h2>
          </div>
          <div className="space-y-2">
            {med.map((a) => (
              <div key={`${a.symbol}-${a.type}`} className="flex items-center gap-3 rounded-xl border border-amber-500/15 bg-amber-500/8 px-4 py-3">
                <span className="text-sm font-bold text-amber-400" aria-hidden="true">•</span>
                <span className="text-sm font-semibold text-white">{a.symbol}</span>
                <span className="flex-1 text-sm text-slate-300">{a.message}</span>
                <span className="hidden sm:inline text-xs px-2 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/20">{a.type.replace('_', ' ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {low.length > 0 && (
        <div className="card">
          <h2 className="text-sm font-semibold text-slate-400 mb-3">{t('Low', 'Rendah')} • {low.length}</h2>
          <div className="space-y-2">
            {low.map((a) => (
              <div key={`${a.symbol}-${a.type}`} className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/2 px-4 py-3">
                <span className="text-sm font-bold text-slate-500" aria-hidden="true">-</span>
                <span className="text-sm font-semibold text-white">{a.symbol}</span>
                <span className="flex-1 text-sm text-slate-400">{a.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <h2 className="text-sm font-semibold text-white mb-3">{t('All Top Movers', 'Semua Pergerakan Terbesar')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {movers.map((m) => (
            <div key={m.symbol} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/2 px-4 py-3">
              <div>
                <div className="text-sm font-semibold text-white">{m.symbol}</div>
                <div className="text-xs text-slate-500 truncate max-w-28">{m.name}</div>
              </div>
              <span className={`text-sm font-bold tabular-nums ${m.changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{m.changePercent >= 0 ? '+' : ''}{m.changePercent}%</span>
            </div>
          ))}
        </div>
      </div>

      {anomalies.length === 0 && tickers.length > 0 && (
        <div className="card text-center py-10">
          <div className="mx-auto w-10 h-10 rounded-full bg-emerald-500/12 border border-emerald-500/20 grid place-items-center text-emerald-400 mb-3" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <p className="text-sm font-medium text-white">{t('No anomalies detected', 'Tidak ada anomali terdeteksi')}</p>
          <p className="text-xs text-slate-500 mt-1">{t('Market is calm versus sector baseline', 'Pasar tenang dibanding baseline sektor')}</p>
        </div>
      )}

      {tickers.length === 0 && <div className="card text-sm text-slate-500">{t('Loading...', 'Memuat...')}</div>}
    </div>
  );
}
