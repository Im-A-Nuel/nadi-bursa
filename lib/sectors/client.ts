// lib/sectors/client.ts - core Sectors REST API v2 client with transparent mock fallback
import {
  MOCK_TICKERS, MOCK_DAILY, MOCK_FOREIGN_FLOW,
  MOCK_BROKER_SUMMARY, MOCK_IDX_TOTAL, MOCK_TOP_MOVERS,
  MOCK_IDX_HISTORY,
} from './mockData';

export type DataSource = {
  source: 'live' | 'demo';
  fetchedAt: string | null;
};

let dataSource: DataSource = { source: 'demo', fetchedAt: null };

export function isMockMode(): boolean {
  return dataSource.source === 'demo';
}

export function getUsingFallback(): boolean {
  return dataSource.source === 'demo' && dataSource.fetchedAt !== null;
}

export function getDataSource(): DataSource {
  return dataSource;
}

async function fetchSectors<T>(resource: string, params: Record<string, string> = {}): Promise<T | null> {
  try {
    const query = new URLSearchParams({ resource, ...params });
    const res = await fetch(`/api/sectors?${query.toString()}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const payload = await res.json() as { source?: 'live' | 'demo'; data?: T; fetchedAt?: string };
    dataSource = { source: payload.source === 'live' && payload.data ? 'live' : 'demo', fetchedAt: payload.fetchedAt ?? new Date().toISOString() };
    return dataSource.source === 'live' ? payload.data ?? null : null;
  } catch {
    dataSource = { source: 'demo', fetchedAt: new Date().toISOString() };
    return null;
  }
}

export type ScreenerItem = { symbol: string; name: string; sector: string; close: number; changePercent: number; volume: number; marketCap: number; pe: number; pb: number; dividendYield: number; freeFloat: number; eps: number; roe: number; debtToEquity: number };

export async function getScreener(): Promise<ScreenerItem[]> {
  const live = await fetchSectors<ScreenerItem[]>('screener');
  return live || MOCK_TICKERS;
}

export async function getTickerData(symbol: string): Promise<ScreenerItem | null> {
  const live = await fetchSectors<ScreenerItem>('companyReport', { symbol });
  return live || MOCK_TICKERS.find(t => t.symbol === symbol) || null;
}

export async function getDaily(symbol: string): Promise<{ open: number; high: number; low: number; close: number; volume: number; date: string } | null> {
  const live = await fetchSectors<{ open: number; high: number; low: number; close: number; volume: number; date: string }>('daily', { symbol });
  return live || MOCK_DAILY[symbol] || null;
}

export type ForeignFlow = { netInflow: number; buyValue: number; sellValue: number; history: { date: string; net: number }[] };

export async function getForeignFlow(symbol: string): Promise<ForeignFlow | null> {
  const live = await fetchSectors<ForeignFlow>('foreignFlow', { symbol });
  return live || MOCK_FOREIGN_FLOW[symbol] || null;
}

export type BrokerSummary = { topBuyers: { broker: string; value: number }[]; topSellers: { broker: string; value: number }[] };

export async function getBrokerSummary(symbol: string): Promise<BrokerSummary | null> {
  const live = await fetchSectors<BrokerSummary>('brokerSummary', { symbol });
  return live || MOCK_BROKER_SUMMARY[symbol] || null;
}

export type IdxTotal = { close: number; change: number; changePercent: number; volume: number; value: number };

export async function getIdxTotal(): Promise<IdxTotal | null> {
  const live = await fetchSectors<IdxTotal>('idxTotal');
  return live || MOCK_IDX_TOTAL;
}

export type IndexHistoryPoint = { date: string; price: number };

export async function getIdxHistory(): Promise<IndexHistoryPoint[]> {
  const live = await fetchSectors<IndexHistoryPoint[]>('indexDaily');
  return live?.length ? live : MOCK_IDX_HISTORY;
}

export type TopChangeItem = { symbol: string; name: string; sector: string; changePercent: number; close: number; volume: number };

export async function getTopChanges(): Promise<TopChangeItem[]> {
  const live = await fetchSectors<TopChangeItem[]>('topChanges');
  return live || MOCK_TOP_MOVERS;
}
