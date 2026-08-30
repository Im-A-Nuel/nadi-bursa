// lib/sectors/mockData.ts - seeded mock for 10 IDX tickers for offline judging
export const MOCK_TICKERS = [
  { symbol: 'BBCA', name: 'Bank Central Asia', sector: 'Financials', close: 9450, changePercent: 1.2, volume: 28500000, marketCap: 11340000000000000, pe: 22.1, pb: 4.8, dividendYield: 1.1, freeFloat: 63.0, eps: 428, roe: 24.5, debtToEquity: 0.8 },
  { symbol: 'BBRI', name: 'Bank Rakyat Indonesia', sector: 'Financials', close: 4680, changePercent: -0.8, volume: 42100000, marketCap: 5820000000000000, pe: 12.3, pb: 2.1, dividendYield: 5.8, freeFloat: 40.0, eps: 380, roe: 18.2, debtToEquity: 1.2 },
  { symbol: 'BMRI', name: 'Bank Mandiri', sector: 'Financials', close: 6320, changePercent: 0.5, volume: 35600000, marketCap: 7590000000000000, pe: 11.8, pb: 1.9, dividendYield: 6.2, freeFloat: 38.5, eps: 536, roe: 16.8, debtToEquity: 1.1 },
  { symbol: 'TLKM', name: 'Telkom Indonesia', sector: 'Telecommunications', close: 2680, changePercent: -1.5, volume: 18900000, marketCap: 2640000000000000, pe: 16.5, pb: 3.2, dividendYield: 4.5, freeFloat: 45.0, eps: 162, roe: 19.8, debtToEquity: 0.5 },
  { symbol: 'ASII', name: 'Astra International', sector: 'Industrials', close: 5120, changePercent: 2.1, volume: 22400000, marketCap: 2060000000000000, pe: 13.2, pb: 2.5, dividendYield: 3.8, freeFloat: 50.0, eps: 388, roe: 19.5, debtToEquity: 0.6 },
  { symbol: 'ADRO', name: 'Adaro Energy Indonesia', sector: 'Energy', close: 2340, changePercent: 3.8, volume: 65200000, marketCap: 1280000000000000, pe: 8.5, pb: 1.4, dividendYield: 8.2, freeFloat: 35.0, eps: 275, roe: 16.2, debtToEquity: 0.4 },
  { symbol: 'UNVR', name: 'Unilever Indonesia', sector: 'Consumer Staples', close: 4250, changePercent: -0.3, volume: 12800000, marketCap: 1960000000000000, pe: 28.5, pb: 8.2, dividendYield: 2.8, freeFloat: 55.0, eps: 149, roe: 28.9, debtToEquity: 0.2 },
  { symbol: 'ICBP', name: 'Indofood CBP Sukses Makmur', sector: 'Consumer Staples', close: 12450, changePercent: 0.8, volume: 4500000, marketCap: 1480000000000000, pe: 25.2, pb: 7.5, dividendYield: 1.5, freeFloat: 42.0, eps: 494, roe: 29.8, debtToEquity: 0.3 },
  { symbol: 'GOTO', name: 'GoTo Gojek Tokopedia', sector: 'Technology', close: 65, changePercent: -4.2, volume: 320000000, marketCap: 420000000000000, pe: -15.0, pb: 2.8, dividendYield: 0, freeFloat: 70.0, eps: -4.3, roe: -8.5, debtToEquity: 2.1 },
  { symbol: 'BRPT', name: 'Barito Pacific', sector: 'Materials', close: 1580, changePercent: 1.9, volume: 15600000, marketCap: 320000000000000, pe: 18.5, pb: 1.2, dividendYield: 3.2, freeFloat: 48.0, eps: 85, roe: 6.8, debtToEquity: 1.8 },
];

export const MOCK_DAILY: Record<string, { open: number; high: number; low: number; close: number; volume: number; date: string }> = {};
MOCK_TICKERS.forEach(t => {
  MOCK_DAILY[t.symbol] = {
    open: t.close * (1 - (Math.random() * 0.04 - 0.02)),
    high: t.close * (1 + Math.random() * 0.03),
    low: t.close * (1 - Math.random() * 0.03),
    close: t.close,
    volume: t.volume,
    date: '2026-08-29',
  };
});

export const MOCK_FOREIGN_FLOW: Record<string, { netInflow: number; buyValue: number; sellValue: number; history: { date: string; net: number }[] }> = {};
MOCK_TICKERS.forEach(t => {
  const net = (Math.random() - 0.4) * 200000000000;
  const history = Array.from({ length: 20 }, (_, i) => ({
    date: `2026-08-${String(i + 10).padStart(2, '0')}`,
    net: (Math.random() - 0.45) * 150000000000,
  }));
  MOCK_FOREIGN_FLOW[t.symbol] = {
    netInflow: net,
    buyValue: Math.abs(net) * (1 + Math.random()),
    sellValue: Math.abs(net) * (0.8 + Math.random() * 0.4),
    history,
  };
});

export const MOCK_BROKER_SUMMARY: Record<string, { topBuyers: { broker: string; value: number }[]; topSellers: { broker: string; value: number }[] }> = {};
const BROKERS = ['CLSA', 'CGS-CIMB', 'Mandiri Sekuritas', 'BNI Sekuritas', 'Trimegah', 'Danareksa', 'Indo Premier', 'Macquarie', 'UBS', 'Credit Suisse'];
MOCK_TICKERS.forEach(t => {
  const shuffledBuyers = [...BROKERS].sort(() => Math.random() - 0.5).slice(0, 5);
  const shuffledSellers = [...BROKERS].sort(() => Math.random() - 0.5).slice(0, 5);
  MOCK_BROKER_SUMMARY[t.symbol] = {
    topBuyers: shuffledBuyers.map(b => ({ broker: b, value: Math.random() * 100000000000 })),
    topSellers: shuffledSellers.map(b => ({ broker: b, value: Math.random() * 100000000000 })),
  };
});

export const MOCK_IDX_TOTAL = { close: 7285.4, change: 32.5, changePercent: 0.45, volume: 18500000000, value: 12800000000000 };

export const MOCK_TOP_MOVERS = [
  { symbol: 'ADRO', name: 'Adaro Energy', sector: 'Energy', changePercent: 3.8, close: 2340, volume: 65200000 },
  { symbol: 'ASII', name: 'Astra International', sector: 'Industrials', changePercent: 2.1, close: 5120, volume: 22400000 },
  { symbol: 'BRPT', name: 'Barito Pacific', sector: 'Materials', changePercent: 1.9, close: 1580, volume: 15600000 },
  { symbol: 'BBCA', name: 'Bank Central Asia', sector: 'Financials', changePercent: 1.2, close: 9450, volume: 28500000 },
  { symbol: 'GOTO', name: 'GoTo Gojek Tokopedia', sector: 'Technology', changePercent: -4.2, close: 65, volume: 320000000 },
  { symbol: 'TLKM', name: 'Telkom Indonesia', sector: 'Telecommunications', changePercent: -1.5, close: 2680, volume: 18900000 },
  { symbol: 'BBRI', name: 'Bank Rakyat Indonesia', sector: 'Financials', changePercent: -0.8, close: 4680, volume: 42100000 },
  { symbol: 'UNVR', name: 'Unilever Indonesia', sector: 'Consumer Staples', changePercent: -0.3, close: 4250, volume: 12800000 },
];
