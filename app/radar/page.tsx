'use client';
import { useEffect, useState } from 'react';
import { getScreener, getTopChanges, type ScreenerItem, type TopChangeItem } from '@/lib/sectors/client';
import { detectAnomalies, type Anomaly } from '@/lib/radar/anomalyDetector';
import { MockDataBadge } from '@/components/common/MockDataBadge';
import { TickerLogo } from '@/components/common/TickerLogo';
import { useLang } from '@/components/layout/LanguageProvider';

export default function RadarPage() {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [movers, setMovers] = useState<TopChangeItem[]>([]);
  const [tickers, setTickers] = useState<ScreenerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { t } = useLang();

  const load = () => {
    setLoading(true);
    setError(false);
    Promise.all([getScreener(), getTopChanges()])
      .then(([s, m]) => {
        setTickers(s);
        setAnomalies(detectAnomalies(s));
        setMovers(m);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const high = anomalies.filter((a) => a.severity === 'high');
  const med = anomalies.filter((a) => a.severity === 'medium');
  const low = anomalies.filter((a) => a.severity === 'low');

  return (
    <div className="animate-slide-up space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-white">{t('Anomaly Radar', 'Radar Anomali')}</h1>
          <p className="mt-1 text-sm text-slate-400">{t('Unusual price and volume versus sector baseline', 'Harga dan volume tidak biasa versus baseline sektor')}</p>
        </div>
        <MockDataBadge />
      </div>

      {!loading && !error && (
        <section className="radar-command" aria-label={t('Radar scan summary', 'Ringkasan pemindaian radar')}>
          <div className="radar-command-copy">
            <div className="field-label">{t('Sector-relative scan', 'Pemindaian relatif sektor')}</div>
            <h2>{anomalies.length ? t('See what needs attention.', 'Lihat yang perlu perhatian.') : t('Baseline is holding.', 'Baseline masih terjaga.')}</h2>
            <p>{t('Each marker is compared against its sector baseline before it enters the review queue.', 'Setiap penanda dibandingkan dengan baseline sektornya sebelum masuk antrean tinjauan.')}</p>
          </div>
          <dl className="radar-command-stats">
            <div><dt>{t('High', 'Tinggi')}</dt><dd className="text-coral">{high.length}</dd></div>
            <div><dt>{t('Watch', 'Pantau')}</dt><dd className="text-gold">{med.length}</dd></div>
            <div><dt>{t('In range', 'Dalam rentang')}</dt><dd className="text-mint">{Math.max(tickers.length - anomalies.length, 0)}</dd></div>
          </dl>
          <svg className="radar-command-scope" viewBox="0 0 180 120" fill="none" aria-hidden="true">
            <circle cx="88" cy="60" r="46" stroke="currentColor" strokeOpacity=".18" strokeDasharray="3 6" />
            <circle cx="88" cy="60" r="30" stroke="currentColor" strokeOpacity=".22" />
            <path d="M88 60L139 26A62 62 0 0 1 148 76Z" fill="currentColor" fillOpacity=".08" />
            <path d="M88 60L139 26" stroke="currentColor" strokeOpacity=".55" />
            <circle cx="88" cy="60" r="4" fill="#00D68F" />
            <circle cx="122" cy="39" r="5" fill="#FF4D5E" /><circle cx="53" cy="78" r="4" fill="#E7B44A" /><circle cx="130" cy="84" r="3" fill="#00D68F" />
          </svg>
        </section>
      )}

      {loading && <div className="desk p-8 text-center"><span className="led led-live animate-soft-pulse" /><p className="mono mt-3 text-xs text-[var(--muted)]">{t('Scanning sector baselines...', 'Memindai baseline sektor...')}</p></div>}
      {error && <div className="desk p-8 text-center"><span className="led led-fail" /><p className="mt-3 text-sm text-white">{t('Radar data failed to load.', 'Data radar gagal dimuat.')}</p><button onClick={load} className="btn-line mt-4">{t('Try again', 'Coba lagi')}</button></div>}

      {!loading && !error && high.length > 0 && (
        <div className="card border-red-500/15">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-red-500" aria-hidden="true" />
            <h2 className="text-sm font-semibold text-red-400">{t('High Severity', 'Tingkat Tinggi')} • {high.length}</h2>
          </div>
          <div className="space-y-2">
            {high.map((a) => (
              <div key={`${a.symbol}-${a.type}`} className="flex items-center gap-3 rounded-xl border border-red-500/15 bg-red-500/8 px-4 py-3">
                <TickerLogo symbol={a.symbol} size={32} />
                <span className="text-sm font-semibold text-white">{a.symbol}</span>
                <span className="flex-1 text-sm text-slate-300">{a.message}</span>
                <span className="hidden sm:inline text-xs px-2 py-1 rounded-full bg-red-500/15 text-red-300 border border-red-500/20">{a.type.replace('_', ' ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && !error && med.length > 0 && (
        <div className="card border-amber-500/15">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-amber-500" aria-hidden="true" />
            <h2 className="text-sm font-semibold text-amber-400">{t('Medium', 'Sedang')} • {med.length}</h2>
          </div>
          <div className="space-y-2">
            {med.map((a) => (
              <div key={`${a.symbol}-${a.type}`} className="flex items-center gap-3 rounded-xl border border-amber-500/15 bg-amber-500/8 px-4 py-3">
                <TickerLogo symbol={a.symbol} size={32} />
                <span className="text-sm font-semibold text-white">{a.symbol}</span>
                <span className="flex-1 text-sm text-slate-300">{a.message}</span>
                <span className="hidden sm:inline text-xs px-2 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/20">{a.type.replace('_', ' ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && !error && low.length > 0 && (
        <div className="card">
          <h2 className="text-sm font-semibold text-slate-400 mb-3">{t('Low', 'Rendah')} • {low.length}</h2>
          <div className="space-y-2">
            {low.map((a) => (
              <div key={`${a.symbol}-${a.type}`} className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/2 px-4 py-3">
                <TickerLogo symbol={a.symbol} size={32} />
                <span className="text-sm font-semibold text-white">{a.symbol}</span>
                <span className="flex-1 text-sm text-slate-400">{a.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && !error && <div className="card">
        <h2 className="text-sm font-semibold text-white mb-3">{t('All Top Movers', 'Semua Pergerakan Terbesar')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {movers.map((m) => (
            <div key={m.symbol} className="flex items-center gap-2.5 rounded-xl border border-white/5 bg-white/2 px-4 py-3">
              <TickerLogo symbol={m.symbol} name={m.name} size={32} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-white">{m.symbol}</div>
                <div className="text-xs text-slate-500 truncate max-w-28">{m.name}</div>
              </div>
              <span className={`text-sm font-bold tabular-nums shrink-0 ${m.changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{m.changePercent >= 0 ? '+' : ''}{m.changePercent}%</span>
            </div>
          ))}
        </div>
      </div>}

      {!loading && !error && anomalies.length === 0 && tickers.length > 0 && (
        <div className="card text-center py-10">
          <div className="mx-auto w-10 h-10 rounded-full bg-emerald-500/12 border border-emerald-500/20 grid place-items-center text-emerald-400 mb-3" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <p className="text-sm font-medium text-white">{t('No anomalies detected', 'Tidak ada anomali terdeteksi')}</p>
          <p className="text-xs text-slate-500 mt-1">{t('Market is calm versus sector baseline', 'Pasar tenang dibanding baseline sektor')}</p>
        </div>
      )}

    </div>
  );
}
