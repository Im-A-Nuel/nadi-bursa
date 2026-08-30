// lib/radar/anomalyDetector.ts - flags unusual price/volume vs sector baseline
export type Anomaly = {
  symbol: string;
  type: 'price_surge' | 'price_drop' | 'volume_spike' | 'volume_drop';
  severity: 'high' | 'medium' | 'low';
  message: string;
  deviation: number;
};

const SECTOR_AVG_VOLUME: Record<string, number> = {
  'Financials': 35000000,
  'Technology': 150000000,
  'Consumer Staples': 8000000,
  'Telecommunications': 15000000,
  'Industrials': 12000000,
  'Energy': 30000000,
  'Materials': 10000000,
  'Healthcare': 5000000,
  'Properties': 8000000,
};

const SECTOR_AVG_CHANGE: Record<string, number> = {
  'Financials': 0.5,
  'Technology': 1.2,
  'Consumer Staples': 0.3,
  'Telecommunications': 0.4,
  'Industrials': 0.6,
  'Energy': 1.5,
  'Materials': 0.8,
  'Healthcare': 0.7,
  'Properties': 0.9,
};

export function detectAnomalies(tickers: { symbol: string; sector: string; changePercent: number; volume: number; close: number }[]): Anomaly[] {
  const anomalies: Anomaly[] = [];

  tickers.forEach(t => {
    const avgVol = SECTOR_AVG_VOLUME[t.sector] || 10000000;
    const avgChange = SECTOR_AVG_CHANGE[t.sector] || 0.5;
    const volDeviation = (t.volume - avgVol) / avgVol;
    const priceDeviation = Math.abs(t.changePercent - avgChange);

    if (t.changePercent > avgChange * 3 || t.changePercent > 5) {
      anomalies.push({
        symbol: t.symbol,
        type: 'price_surge',
        severity: t.changePercent > 5 ? 'high' : 'medium',
        message: `${t.symbol} surged +${t.changePercent.toFixed(1)}% vs sector avg ${avgChange.toFixed(1)}%`,
        deviation: priceDeviation,
      });
    }
    if (t.changePercent < -avgChange * 3 || t.changePercent < -5) {
      anomalies.push({
        symbol: t.symbol,
        type: 'price_drop',
        severity: t.changePercent < -5 ? 'high' : 'medium',
        message: `${t.symbol} dropped ${t.changePercent.toFixed(1)}% vs sector avg ${avgChange.toFixed(1)}%`,
        deviation: priceDeviation,
      });
    }
    if (volDeviation > 2) {
      anomalies.push({
        symbol: t.symbol,
        type: 'volume_spike',
        severity: volDeviation > 4 ? 'high' : 'medium',
        message: `${t.symbol} volume ${((t.volume / avgVol) * 100).toFixed(0)}% of sector avg - unusual activity`,
        deviation: volDeviation,
      });
    }
    if (volDeviation < -0.6) {
      anomalies.push({
        symbol: t.symbol,
        type: 'volume_drop',
        severity: 'low',
        message: `${t.symbol} volume at ${((t.volume / avgVol) * 100).toFixed(0)}% of sector avg - thin trading`,
        deviation: volDeviation,
      });
    }
  });

  return anomalies.sort((a, b) => b.deviation - a.deviation);
}
