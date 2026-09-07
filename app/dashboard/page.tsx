'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getScreener, getTopChanges, type ScreenerItem, type TopChangeItem } from '@/lib/sectors/client';
import { computeAllScores } from '@/lib/healthScores';
import { ScoreRing } from '@/components/common/ScoreRing';
import { TickerLogo } from '@/components/common/TickerLogo';
import { MockDataBadge } from '@/components/common/MockDataBadge';
import { useLang } from '@/components/layout/LanguageProvider';

export default function DashboardPage() {
  const [tickers, setTickers] = useState<ScreenerItem[]>([]);
  const [topMovers, setTopMovers] = useState<TopChangeItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLang();

  const load = () => {
    setLoading(true);
    setError(null);
    Promise.all([getScreener(), getTopChanges()])
      .then(([s, m]) => {
        setTickers(s);
        setTopMovers(m);
      })
      .catch(() => setError(t('Failed to load market data. Try again.', 'Gagal memuat data pasar. Coba lagi.')))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  if (loading) {
    return (
      <div className="animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-white">{t('Dashboard', 'Dasbor')}</h1>
            <p className="mt-1 text-sm text-[var(--muted)]">{t('Derived health scores for IDX stocks', 'Skor kesehatan turunan untuk saham IDX')}</p>
          </div>
          <MockDataBadge />
        </div>
        <div className="desk p-8 text-center">
          <span className="led led-live animate-soft-pulse inline-block" aria-hidden="true" />
          <p className="mono mt-3 text-xs text-[var(--muted)]">{t('Syncing the desk...', 'Menyinkronkan meja...')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-slide-up">
        <div className="desk p-8 text-center">
          <span className="led led-fail inline-block" aria-hidden="true" />
          <p className="mt-3 text-sm text-white">{error}</p>
          <button onClick={load} className="btn-line mt-4">{t('Try again', 'Coba lagi')}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-slide-up space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-white">{t('Dashboard', 'Dasbor')}</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">{t('Derived health scores for IDX stocks', 'Skor kesehatan turunan untuk saham IDX')}</p>
        </div>
        <MockDataBadge />
      </div>

      {/* Instruments, not hero metrics */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-white">{t('Top Scoring Assets', 'Aset Skor Tertinggi')}</h2>
          <Link href="/screener" className="mono text-xs text-gold hover:text-white transition-colors">Saring →</Link>
        </div>
        <div className="grid-staking">
          {[...tickers]
            .sort((a, b) => computeAllScores(b).overall - computeAllScores(a).overall)
            .slice(0, 3)
            .map((tk) => {
              const sc = computeAllScores(tk);
              return (
                <Link key={tk.symbol} href={`/ticker/${tk.symbol}`} className="card card-hover block">
                  <div className="flex items-center gap-2.5">
                    <TickerLogo symbol={tk.symbol} name={tk.name} sector={tk.sector} size={34} />
                    <div className="min-w-0">
                      <div className="mono text-xs font-semibold tracking-tight text-white">{tk.symbol}</div>
                      <div className="text-xs text-[var(--faint)] truncate">{tk.name}</div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-4">
                    <ScoreRing score={sc.overall} size={64} />
                    <div className="flex-1 grid grid-cols-1 gap-1.5">
                      {[['DIV', sc.dividendHealth], ['VAL', sc.valueQuality], ['LIQ', sc.liquidity]].map(([l, v]) => (
                        <div key={l as string} className="flex items-center gap-2">
                          <span className="mono text-[10px] text-[var(--faint)] w-8">{l}</span>
                          <div className="flex-1 h-1 bg-rule rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${v}%`, background: (v as number) >= 65 ? '#00D68F' : (v as number) >= 35 ? '#E7B44A' : '#FF4D5E' }} />
                          </div>
                          <span className="mono text-[10px] text-[var(--muted)] w-6 text-right">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-rule flex items-center justify-between text-xs">
                    <span className={`mono tabular-nums ${tk.changePercent >= 0 ? 'text-mint' : 'text-coral'}`}>{tk.changePercent >= 0 ? '+' : ''}{tk.changePercent}%</span>
                    <span className="mono text-[var(--muted)]">{tk.close.toLocaleString()}</span>
                  </div>
                </Link>
              );
            })}
        </div>
      </div>

      {topMovers.length > 0 && (
        <div className="card">
          <h3 className="text-sm font-semibold text-white mb-3">{t('Top Movers', 'Pergerakan Terbesar')}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {topMovers.slice(0, 4).map((m) => (
              <div key={m.symbol} className="rounded-xl border border-rule bg-panel-2 px-3 py-3 flex items-center gap-2.5">
                <TickerLogo symbol={m.symbol} name={m.name} sector={m.sector} size={30} />
                <div className="flex-1 min-w-0">
                  <div className="mono text-xs font-semibold text-white">{m.symbol}</div>
                  <div className={`mono text-sm font-bold tabular-nums ${m.changePercent >= 0 ? 'text-mint' : 'text-coral'}`}>{m.changePercent >= 0 ? '+' : ''}{m.changePercent}%</div>
                  <div className="text-xs text-[var(--faint)] truncate">{m.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">{t('All Stocks - Health Scores', 'Semua Saham - Skor Kesehatan')}</h3>
        <span className="field-label">{tickers.length} tickers</span>
      </div>
      <div className="space-y-2.5">
        {[...tickers]
          .sort((a, b) => computeAllScores(b).overall - computeAllScores(a).overall)
          .map((tk) => {
            const sc = computeAllScores(tk);
            return (
              <Link key={tk.symbol} href={`/ticker/${tk.symbol}`} className="card card-hover flex items-center gap-3">
                <TickerLogo symbol={tk.symbol} name={tk.name} sector={tk.sector} size={38} />
                <ScoreRing score={sc.overall} size={40} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="mono text-sm font-semibold text-white">{tk.symbol}</span>
                    <span className="hidden sm:inline text-xs text-[var(--faint)] truncate">{tk.name}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-xs">
                    <span className="px-1.5 py-0.5 rounded border text-xs font-medium" style={{ borderColor: sc.dividendHealth >= 60 ? 'rgba(0,214,143,0.25)' : 'var(--rule-2)', color: sc.dividendHealth >= 60 ? '#6EE7C3' : 'var(--muted)', background: sc.dividendHealth >= 60 ? 'rgba(0,214,143,0.10)' : 'transparent' }}>DIV {sc.dividendHealth}</span>
                    <span className="px-1.5 py-0.5 rounded border text-xs font-medium" style={{ borderColor: sc.valueQuality >= 60 ? 'rgba(231,180,74,0.30)' : 'var(--rule-2)', color: sc.valueQuality >= 60 ? '#E7B44A' : 'var(--muted)', background: sc.valueQuality >= 60 ? 'rgba(231,180,74,0.08)' : 'transparent' }}>VAL {sc.valueQuality}</span>
                    <span className="hidden sm:inline-flex px-1.5 py-0.5 rounded border text-xs font-medium" style={{ borderColor: sc.liquidity >= 60 ? 'rgba(184,199,220,0.30)' : 'var(--rule-2)', color: sc.liquidity >= 60 ? '#B8C7DC' : 'var(--muted)', background: sc.liquidity >= 60 ? 'rgba(184,199,220,0.08)' : 'transparent' }}>LIQ {sc.liquidity}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="mono text-sm font-semibold text-white">{tk.close.toLocaleString()}</div>
                  <div className={`mono text-xs tabular-nums ${tk.changePercent >= 0 ? 'text-mint' : 'text-coral'}`}>{tk.changePercent >= 0 ? '+' : ''}{tk.changePercent}%</div>
                </div>
              </Link>
            );
          })}
      </div>
    </div>
  );
}
