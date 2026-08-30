'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getTickerData, getForeignFlow, getBrokerSummary, type ScreenerItem, type ForeignFlow, type BrokerSummary } from '@/lib/sectors/client';
import { computeAllScores, computeScoreTrend, getHealthBand } from '@/lib/healthScores';
import { computeDerivedSignal } from '@/lib/signals';
import { ScoreRing } from '@/components/common/ScoreRing';
import { SignalBadge } from '@/components/common/SignalBadge';
import { WatchlistButton } from '@/components/common/WatchlistButton';
import { MockDataBadge } from '@/components/common/MockDataBadge';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useLang } from '@/components/layout/LanguageProvider';

export default function TickerPage() {
  const params = useParams();
  const symbol = (params.symbol as string).toUpperCase();
  const [ticker, setTicker] = useState<ScreenerItem | null>(null);
  const [foreign, setForeign] = useState<ForeignFlow | null>(null);
  const [broker, setBroker] = useState<BrokerSummary | null>(null);
  const { t } = useLang();

  useEffect(() => {
    if (!symbol) return;
    Promise.all([getTickerData(symbol), getForeignFlow(symbol), getBrokerSummary(symbol)]).then(([tk, fl, br]) => {
      setTicker(tk);
      setForeign(fl);
      setBroker(br);
    });
  }, [symbol]);

  if (!ticker) return <div className="card text-center py-10 text-sm text-slate-400">{t('Loading...', 'Memuat...')}</div>;

  const scores = computeAllScores(ticker);
  const trend = computeScoreTrend(ticker);
  const signal = computeDerivedSignal(symbol, ticker, foreign, broker);

  return (
    <div className="animate-slide-up space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link href="/screener" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            {t('Back', 'Kembali')}
          </Link>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">{ticker.symbol}</h1>
              <SignalBadge signal={signal.combinedSignal} />
              <MockDataBadge />
            </div>
            <p className="text-sm text-slate-400">{ticker.name} • {ticker.sector}</p>
          </div>
        </div>
        <WatchlistButton symbol={symbol} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: t('Price', 'Harga'), value: ticker.close.toLocaleString(), sub: `${ticker.changePercent >= 0 ? '+' : ''}${ticker.changePercent}%`, tone: ticker.changePercent >= 0 ? 'text-emerald-400' : 'text-red-400' },
          { label: 'P/E', value: ticker.pe > 0 ? ticker.pe.toFixed(1) : '-', sub: 'Price/Earnings', tone: 'text-slate-300' },
          { label: 'P/B', value: ticker.pb.toFixed(1), sub: 'Price/Book', tone: 'text-slate-300' },
          { label: 'DIV%', value: ticker.dividendYield > 0 ? `${ticker.dividendYield.toFixed(1)}%` : '-', sub: 'Dividend yield', tone: 'text-cyan-400' },
        ].map((c) => (
          <div key={c.label} className="card text-center">
            <div className="kicker">{c.label}</div>
            <div className={`mt-1 text-xl font-bold tabular-nums ${c.tone}`}>{c.value}</div>
            <div className="text-xs text-slate-500 mt-1">{c.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card lg:col-span-2">
          <h2 className="text-sm font-semibold text-white mb-3">{t('5 Year Score Trend', 'Tren Skor 5 Tahun')}</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trend}>
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#0E1223', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, fontSize: 12, color: '#F8FAFC' }} />
              <Line type="monotone" dataKey="dividendHealth" stroke="#C6A664" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="valueQuality" stroke="#06B6D4" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="liquidity" stroke="#8B5CF6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-3 flex flex-wrap gap-4 justify-center text-xs">
            <span className="inline-flex items-center gap-1.5 text-slate-400"><span className="w-3 h-0.5 rounded" style={{ background: '#C6A664' }} /> Dividend</span>
            <span className="inline-flex items-center gap-1.5 text-slate-400"><span className="w-3 h-0.5 rounded" style={{ background: '#06B6D4' }} /> Value</span>
            <span className="inline-flex items-center gap-1.5 text-slate-400"><span className="w-3 h-0.5 rounded" style={{ background: '#8B5CF6' }} /> Liquidity</span>
          </div>
        </div>

        <div className="card">
          <h2 className="text-sm font-semibold text-white mb-3">{t('Health Scores', 'Skor Kesehatan')}</h2>
          <div className="flex flex-col items-center gap-4">
            <ScoreRing score={scores.overall} size={84} strokeWidth={6} />
            <div className="w-full space-y-3">
              {[
                ['Dividend Health', scores.dividendHealth],
                ['Value Quality', scores.valueQuality],
                ['Liquidity', scores.liquidity],
              ].map(([label, val]) => (
                <div key={label as string}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">{label as string}</span>
                    <span className="font-medium tabular-nums text-slate-200">{val as number}/100</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${val}%`, background: getHealthBand(val as number).color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card">
          <h2 className="text-sm font-semibold text-white mb-3">{t('Foreign Flow 20 days', 'Arus Asing 20 hari')}</h2>
          {foreign ? (
            <>
              <div className="flex items-baseline gap-2 mb-3">
                <span className={`text-lg font-bold tabular-nums ${foreign.netInflow >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{foreign.netInflow >= 0 ? '+' : ''}{(foreign.netInflow / 1e9).toFixed(1)}B</span>
                <span className="text-xs text-slate-500">{t('Net inflow', 'Arus bersih')}</span>
              </div>
              <ResponsiveContainer width="100%" height={150}>
                <AreaChart data={foreign.history}>
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1e9).toFixed(0)}B`} />
                  <Tooltip contentStyle={{ background: '#0E1223', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, fontSize: 11 }} formatter={(v: number) => `${(v / 1e9).toFixed(1)}B`} />
                  <Area type="monotone" dataKey="net" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.14} strokeWidth={1.8} />
                </AreaChart>
              </ResponsiveContainer>
            </>
          ) : (
            <p className="text-sm text-slate-500">{t('No data', 'Tidak ada data')}</p>
          )}
        </div>

        <div className="card">
          <h2 className="text-sm font-semibold text-white mb-3">{t('Broker Summary', 'Ringkasan Broker')}</h2>
          {broker ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-semibold text-emerald-400 mb-2">{t('Top Buyers', 'Pembeli Teratas')}</div>
                {broker.topBuyers.slice(0, 4).map((b) => (
                  <div key={b.broker} className="flex justify-between gap-2 text-xs py-1.5 border-b border-white/5 last:border-0">
                    <span className="text-slate-300 truncate">{b.broker}</span>
                    <span className="tabular-nums text-slate-400">{(b.value / 1e9).toFixed(1)}B</span>
                  </div>
                ))}
              </div>
              <div>
                <div className="text-xs font-semibold text-red-400 mb-2">{t('Top Sellers', 'Penjual Teratas')}</div>
                {broker.topSellers.slice(0, 4).map((b) => (
                  <div key={b.broker} className="flex justify-between gap-2 text-xs py-1.5 border-b border-white/5 last:border-0">
                    <span className="text-slate-300 truncate">{b.broker}</span>
                    <span className="tabular-nums text-slate-400">{(b.value / 1e9).toFixed(1)}B</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500">{t('No data', 'Tidak ada data')}</p>
          )}
        </div>
      </div>

      <div className="card">
        <h2 className="text-sm font-semibold text-white mb-3">{t('Derived Signal', 'Sinyal Turunan')}</h2>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <SignalBadge signal={signal.foreignSignal} />
          <span className="text-slate-600" aria-hidden="true">+</span>
          <SignalBadge signal={signal.brokerSignal} />
          <span className="text-slate-600" aria-hidden="true">=</span>
          <SignalBadge signal={signal.combinedSignal} />
        </div>
        <p className="text-sm leading-relaxed text-slate-300">{signal.summary}</p>
        <div className="mt-4 flex items-center gap-3">
          <span className="text-xs text-slate-500">{t('Confidence', 'Kepercayaan')}</span>
          <div className="h-1.5 w-32 rounded-full bg-white/5 overflow-hidden">
            <div className="h-full rounded-full bg-cyan-400" style={{ width: `${signal.confidence}%` }} />
          </div>
          <span className="text-xs font-medium tabular-nums text-slate-200">{signal.confidence}%</span>
        </div>
      </div>
    </div>
  );
}
