// lib/sectors/client.ts - core Sectors REST API v2 client with transparent mock fallback
import { ENDPOINTS, SECTORS_BASE } from './endpoints';
import {
  MOCK_TICKERS, MOCK_DAILY, MOCK_FOREIGN_FLOW,
  MOCK_BROKER_SUMMARY, MOCK_IDX_TOTAL, MOCK_TOP_MOVERS,
  MOCK_IDX_HISTORY,
} from './mockData';

const API_KEY = process.env.NEXT_PUBLIC_SECTORS_API_KEY || '';

let apiFallbackActive = false;

export function isMockMode(): boolean {
  return !API_KEY;
}

export function getUsingFallback(): boolean {
  return apiFallbackActive;
}

async function fetchSectors<T>(endpoint: string, params: Record<string, string> = {}): Promise<T | null> {
  if (!API_KEY) return null;
  try {
    const url = new URL(`${SECTORS_BASE}${endpoint}`);
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${API_KEY}` },
      next: { revalidate: 300 },
    });
    if (!res.ok) {
      apiFallbackActive = true;
      return null;
    }
    return res.json();
  } catch {
    apiFallbackActive = true;
    return null;
  }
}

export type ScreenerItem = { symbol: string; name: string; sector: string; close: number; changePercent: number; volume: number; marketCap: number; pe: number; pb: number; dividendYield: number; freeFloat: number; eps: number; roe: number; debtToEquity: number };

export async function getScreener(): Promise<ScreenerItem[]> {
  const live = await fetchSectors<ScreenerItem[]>(ENDPOINTS.screener);
  return live || MOCK_TICKERS;
}

export async function getTickerData(symbol: string): Promise<ScreenerItem | null> {
  const live = await fetchSectors<ScreenerItem>(ENDPOINTS.companyReport, { symbol });
  return live || MOCK_TICKERS.find(t => t.symbol === symbol) || null;
}

export async function getDaily(symbol: string): Promise<{ open: number; high: number; low: number; close: number; volume: number; date: string } | null> {
  const live = await fetchSectors<{ open: number; high: number; low: number; close: number; volume: number; date: string }>(ENDPOINTS.daily, { symbol });
  return live || MOCK_DAILY[symbol] || null;
}

export type ForeignFlow = { netInflow: number; buyValue: number; sellValue: number; history: { date: string; net: number }[] };

export async function getForeignFlow(symbol: string): Promise<ForeignFlow | null> {
  const live = await fetchSectors<ForeignFlow>(ENDPOINTS.foreignFlow, { symbol });
  return live || MOCK_FOREIGN_FLOW[symbol] || null;
}

export type BrokerSummary = { topBuyers: { broker: string; value: number }[]; topSellers: { broker: string; value: number }[] };

export async function getBrokerSummary(symbol: string): Promise<BrokerSummary | null> {
  const live = await fetchSectors<BrokerSummary>(ENDPOINTS.brokerSummary, { symbol });
  return live || MOCK_BROKER_SUMMARY[symbol] || null;
}

export type IdxTotal = { close: number; change: number; changePercent: number; volume: number; value: number };

export async function getIdxTotal(): Promise<IdxTotal | null> {
  const live = await fetchSectors<IdxTotal>(ENDPOINTS.idxTotal);
  return live || MOCK_IDX_TOTAL;
}

export type IndexHistoryPoint = { date: string; price: number };

export async function getIdxHistory(): Promise<IndexHistoryPoint[]> {
  const live = await fetchSectors<IndexHistoryPoint[]>(ENDPOINTS.indexDaily);
  return live?.length ? live : MOCK_IDX_HISTORY;
}

export type TopChangeItem = { symbol: string; name: string; sector: string; changePercent: number; close: number; volume: number };

export async function getTopChanges(): Promise<TopChangeItem[]> {
  const live = await fetchSectors<TopChangeItem[]>(ENDPOINTS.topChanges);
  return live || MOCK_TOP_MOVERS;
}
