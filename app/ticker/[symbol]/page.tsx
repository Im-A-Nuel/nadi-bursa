'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getTickerData, getForeignFlow, getBrokerSummary, getDaily, type ScreenerItem, type ForeignFlow, type BrokerSummary } from '@/lib/sectors/client';
import { computeAllScores, computeScoreTrend, getHealthBand, type HealthScores, type ScoreTrend } from '@/lib/healthScores';
import { computeDerivedSignal, type DerivedSignal } from '@/lib/signals';
import { ScoreRing, ScoreBadge } from '@/components/common/ScoreRing';
import { SignalBadge } from '@/components/common/SignalBadge';
import { WatchlistButton } from '@/components/common/WatchlistButton';
import { MockDataBadge } from '@/components/common/MockDataBadge';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { useLang } from '@/components/layout/LanguageProvider';

export default function TickerPage() {
  const params = useParams();
  const symbol = (params.symbol as string).toUpperCase();
  const [ticker, setTicker] = useState<ScreenerItem | null>(null);
  const [foreign, setForeign] = useState<ForeignFlow | null>(null);
  const [broker, setBroker] = useState<BrokerSummary | null>(null);
  const [daily, setDaily] = useState<any>(null);
  const { t } = useLang();

  useEffect(() => {
    if (!symbol) return;
    Promise.all([getTickerData(symbol), getForeignFlow(symbol), getBrokerSummary(symbol), getDaily(symbol)])
      .then(([tk, fl, br, d]) => { setTicker(tk); setForeign(fl); setBroker(br); setDaily(d); });
  }, [symbol]);

  if (!ticker) return <div className="card text-center py-12 text-gray-400">{t('Loading...', 'Memuat...')}</div>;

  const scores = computeAllScores(ticker);
  const trend = computeScoreTrend(ticker);
  const signal = computeDerivedSignal(symbol, ticker, foreign, broker);

  return (
    <div className="animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/screener" className="text-gray-400 hover:text-gold text-sm">{'\u2190'} {t('Back', 'Kembali')}</Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-white">{ticker.symbol}</h1>
              <SignalBadge signal={signal.combinedSignal} />
              <MockDataBadge />
            </div>
            <p className="text-gray-400 text-sm">{ticker.name} — {ticker.sector}</p>
          </div>
        </div>
        <WatchlistButton symbol={symbol} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: t('Price', 'Harga'), value: ticker.close.toLocaleString(), sub: `${ticker.changePercent >= 0 ? '+' : ''}${ticker.changePercent}%`, color: ticker.changePercent >= 0 ? 'text-emerald-400' : 'text-red-400' },
          { label: 'P/E', value: ticker.pe > 0 ? ticker.pe.toFixed(1) : '-', sub: 'Price/Earnings', color: 'text-gray-300' },
          { label: 'P/B', value: ticker.pb.toFixed(1), sub: 'Price/Book', color: 'text-gray-300' },
          { label: 'DIV%', value: ticker.dividendYield > 0 ? ticker.dividendYield.toFixed(1) + '%' : '-', sub: 'Dividend Yield', color: 'text-gold' },
        ].map(c => (
          <div key={c.label} className="card text-center">
            <div className="text-gray-400 text-xs mb-1">{c.label}</div>
            <div className={`text-xl font-bold ${c.color}`}>{c.value}</div>
            <div className="text-gray-500 text-[10px] mt-0.5">{c.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="card lg:col-span-2">
          <h3 className="text-sm font-semibold text-gold mb-3">{t('5-Year Score Trend', 'Tren Skor 5 Tahun')}</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trend}>
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#6B7280' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#6B7280' }} />
              <Tooltip contentStyle={{ background: '#122B52', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }} />
              <Line type="monotone" dataKey="dividendHealth" stroke="#C6A664" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="valueQuality" stroke="#0E8074" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="liquidity" stroke="#3B82F6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2 justify-center">
            {[['#C6A664', 'Dividend'], ['#0E8074', 'Value'], ['#3B82F6', 'Liquidity']].map(([c, l]) => (
              <div key={l} className="flex items-center gap-1.5 text-xs text-gray-400">
                <span className="w-3 h-0.5 rounded" style={{ backgroundColor: c }}></span>{l}
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <h3 className="text-sm font-semibold text-gold mb-3">{t('Health Scores', 'Skor Kesehatan')}</h3>
          <div className="flex flex-col items-center gap-4">
            <ScoreRing score={scores.overall} size={80} strokeWidth={6} />
            <div className="w-full space-y-3">
              {[['Dividend Health', scores.dividendHealth], ['Value Quality', scores.valueQuality], ['Liquidity', scores.liquidity]].map(([l, s]) => (
                <div key={l as string}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">{l as string}</span>
                    <span className="text-gray-300">{s as number}/100</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${s}%`, backgroundColor: getHealthBand(s as number).color }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="card">
          <h3 className="text-sm font-semibold text-gold mb-3">{t('Foreign Flow (20 days)', 'Arus Asing (20 hari)')}</h3>
          {foreign ? (
            <>
              <div className="flex items-baseline gap-3 mb-3">
                <span className={`text-lg font-bold ${foreign.netInflow >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {foreign.netInflow >= 0 ? '+' : ''}{(foreign.netInflow / 1e9).toFixed(1)}B
                </span>
                <span className="text-gray-500 text-xs">{t('Net Inflow', 'Arus Masuk Bersih')}</span>
              </div>
              <ResponsiveContainer width="100%" height={150}>
                <AreaChart data={foreign.history}>
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#6B7280' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#6B7280' }} tickFormatter={v => `${(v / 1e9).toFixed(0)}B`} />
                  <Tooltip contentStyle={{ background: '#122B52', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 11 }} formatter={(v: any) => `${(v / 1e9).toFixed(1)}B`} />
                  <Area type="monotone" dataKey="net" stroke="#0E8074" fill="#0E8074" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </>
          ) : <p className="text-gray-500 text-sm">{t('No data', 'Tidak ada data')}</p>}
        </div>
        <div className="card">
          <h3 className="text-sm font-semibold text-gold mb-3">{t('Broker Summary', 'Ringkasan Broker')}</h3>
          {broker ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-emerald-400 text-xs font-semibold mb-2">{t('Top Buyers', 'Pembeli Teratas')}</div>
                {broker.topBuyers.slice(0, 4).map(b => (
                  <div key={b.broker} className="flex justify-between text-xs py-1 border-b border-white/5">
                    <span className="text-gray-300">{b.broker}</span>
                    <span className="text-gray-400">{(b.value / 1e9).toFixed(1)}B</span>
                  </div>
                ))}
              </div>
              <div>
                <div className="text-red-400 text-xs font-semibold mb-2">{t('Top Sellers', 'Penjual Teratas')}</div>
                {broker.topSellers.slice(0, 4).map(b => (
                  <div key={b.broker} className="flex justify-between text-xs py-1 border-b border-white/5">
                    <span className="text-gray-300">{b.broker}</span>
                    <span className="text-gray-400">{(b.value / 1e9).toFixed(1)}B</span>
                  </div>
                ))}
              </div>
            </div>
          ) : <p className="text-gray-500 text-sm">{t('No data', 'Tidak ada data')}</p>}
        </div>
      </div>

      <div className="card">
        <h3 className="text-sm font-semibold text-gold mb-3">{t('Derived Signal Analysis', 'Analisis Sinyal Turunan')}</h3>
        <div className="flex items-center gap-4 mb-3">
          <SignalBadge signal={signal.foreignSignal} />
          <span className="text-gray-500">+</span>
          <SignalBadge signal={signal.brokerSignal} />
          <span className="text-gray-500">=</span>
          <SignalBadge signal={signal.combinedSignal} />
        </div>
        <p className="text-gray-300 text-sm">{signal.summary}</p>
        <div className="mt-3 flex items-center gap-2">
          <span className="text-gray-400 text-xs">{t('Confidence', 'Kepercayaan')}:</span>
          <div className="h-1.5 w-32 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-gold rounded-full" style={{ width: `${signal.confidence}%` }}></div>
          </div>
          <span className="text-gray-300 text-xs">{signal.confidence}%</span>
        </div>
      </div>
    </div>
  );
}
