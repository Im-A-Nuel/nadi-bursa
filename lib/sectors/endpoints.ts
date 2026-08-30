// lib/sectors/endpoints.ts - typed wrappers for Sectors REST API v2
export const SECTORS_BASE = 'https://api.sectors.app/v2';

export const ENDPOINTS = {
  screener: '/companies/screener',
  daily: '/daily',
  close: '/close',
  companyReport: '/company/report',
  brokerSummary: '/broker-summary-by-symbol',
  foreignFlow: '/foreign-flow-by-symbol',
  topChanges: '/top-changes',
  idxTotal: '/idx-total',
  filings: '/filings',
} as const;

export type SectorEndpoint = keyof typeof ENDPOINTS;

export function buildUrl(endpoint: SectorEndpoint, params: Record<string, string> = {}): string {
  const url = new URL(`${SECTORS_BASE}${ENDPOINTS[endpoint]}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  return url.toString();
}
