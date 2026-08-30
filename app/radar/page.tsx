'use client';
import { useEffect, useState } from 'react';
import { getScreener, getTopChanges, getIdxTotal, type ScreenerItem, type TopChangeItem, type IdxTotal } from '@/lib/sectors/client';
import { detectAnomalies, type Anomaly } from '@/lib/radar/anomalyDetector';
import { MockDataBadge } from '@/components/common/MockDataBadge';
import { useLang } from '@/components/layout/LanguageProvider';

export default function RadarPage() {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [movers, setMovers] = useState<TopChangeItem[]>([]);
  const [idx, setIdx] = useState<IdxTotal | null>(null);
  const { t } = useLang();

  useEffect(() => {
    Promise.all([getScreener(), getTopChanges(), getIdxTotal()]).then(([s, m, i]) => {
      setAnomalies(detectAnomalies(s));
      setMovers(m);
      setIdx(i);
    });
  }, []);

  const highAnomalies = anomalies.filter(a => a.severity === 'high');
  const medAnomalies = anomalies.filter(a => a.severity === 'medium');
  const lowAnomalies = anomalies.filter(a => a.severity === 'low');

  const sevColor = (s: string) => s === 'high' ? '#EF4444' : s === 'medium' ? '#F59E0B' : '#6B7280';
  const typeIcon = (type: string) => {
    if (type.includes('surge')) return '\u2191';
    if (type.includes('drop')) return '\u2193';
    if (type.includes('spike')) return '\u2B06\uFE0F';
    return '\u2B07\uFE0F';
  };

  return (
    <div className="animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">{t('Anomaly Radar', 'Radar Anomali')}</h1>
          <p className="text-gray-400 text-sm mt-1">{t('Unusual price/volume vs sector baseline', 'Harga/volume tidak biasa vs baseline sektor')}</p>
        </div>
        <MockDataBadge />
      </div>

      {idx && (
        <div className="card mb-6">
          <div className="flex items-baseline gap-4">
            <span className="text-gray-400 text-sm">IHSG</span>
            <span className="text-xl font-bold text-white">{idx.close.toLocaleString()}</span>
            <span className={`font-semibold ${idx.changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {idx.changePercent >= 0 ? '+' : ''}{idx.changePercent}%
            </span>
          </div>
        </div>
      )}

      {highAnomalies.length > 0 && (
        <div className="card border-red-500/20 mb-4">
          <h3 className="text-sm font-semibold text-red-400 mb-3">{t('High Severity', 'Tingkat Tinggi')} ({highAnomalies.length})</h3>
          <div className="space-y-2">
            {highAnomalies.map(a => (
              <div key={`${a.symbol}-${a.type}`} className="flex items-center gap-3 bg-red-900/20 rounded-lg px-4 py-2.5">
                <span className="text-lg">{typeIcon(a.type)}</span>
                <span className="text-white font-medium">{a.symbol}</span>
                <span className="text-gray-300 text-sm flex-1">{a.message}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-red-900/40 text-red-300">{a.type.replace('_', ' ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {medAnomalies.length > 0 && (
        <div className="card border-amber-500/20 mb-4">
          <h3 className="text-sm font-semibold text-amber-400 mb-3">{t('Medium Severity', 'Tingkat Sedang')} ({medAnomalies.length})</h3>
          <div className="space-y-2">
            {medAnomalies.map(a => (
              <div key={`${a.symbol}-${a.type}`} className="flex items-center gap-3 bg-amber-900/20 rounded-lg px-4 py-2.5">
                <span className="text-lg">{typeIcon(a.type)}</span>
                <span className="text-white font-medium">{a.symbol}</span>
                <span className="text-gray-300 text-sm flex-1">{a.message}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-amber-900/40 text-amber-300">{a.type.replace('_', ' ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {lowAnomalies.length > 0 && (
        <div className="card mb-4">
          <h3 className="text-sm font-semibold text-gray-400 mb-3">{t('Low Severity', 'Tingkat Rendah')} ({lowAnomalies.length})</h3>
          <div className="space-y-2">
            {lowAnomalies.map(a => (
              <div key={`${a.symbol}-${a.type}`} className="flex items-center gap-3 bg-gray-800/30 rounded-lg px-4 py-2.5">
                <span className="text-lg">{typeIcon(a.type)}</span>
                <span className="text-white font-medium">{a.symbol}</span>
                <span className="text-gray-400 text-sm flex-1">{a.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card mt-6">
        <h3 className="text-sm font-semibold text-gold mb-3">{t('All Top Movers', 'Semua Pergerakan Terbesar')}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {movers.map(m => (
            <div key={m.symbol} className="flex items-center justify-between bg-navy-dark/40 rounded-lg px-4 py-2.5">
              <div>
                <span className="text-white font-semibold">{m.symbol}</span>
                <span className="text-gray-500 text-xs ml-2">{m.name}</span>
              </div>
              <span className={`font-semibold ${m.changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {m.changePercent >= 0 ? '+' : ''}{m.changePercent}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {anomalies.length === 0 && (
        <div className="card text-center py-12">
          <div className="text-4xl mb-3">{'\u2714\uFE0F'}</div>
          <p className="text-gray-400">{t('No anomalies detected — market is calm', 'Tidak ada anomali terdeteksi — pasar tenang')}</p>
        </div>
      )}
    </div>
  );
}
