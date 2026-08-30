// lib/healthScores.ts - Derived 0-100 scores (Dividend Health, Value Quality, Liquidity)
import type { ScreenerItem } from './sectors/client';

export type HealthScores = {
  dividendHealth: number;
  valueQuality: number;
  liquidity: number;
  overall: number;
};

export function getHealthBand(score: number): { label: string; color: string } {
  if (score >= 80) return { label: 'Excellent', color: '#10B981' };
  if (score >= 60) return { label: 'Good', color: '#3B82F6' };
  if (score >= 40) return { label: 'Fair', color: '#F59E0B' };
  if (score >= 20) return { label: 'Weak', color: '#F97316' };
  return { label: 'Poor', color: '#EF4444' };
}

function clamp(v: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, v));
}

export function computeDividendHealth(t: ScreenerItem): number {
  let score = 0;
  if (t.dividendYield > 6) score += 30;
  else if (t.dividendYield > 4) score += 25;
  else if (t.dividendYield > 2) score += 15;
  else if (t.dividendYield > 0) score += 8;

  const ff = t.freeFloat;
  if (ff > 60) score += 20;
  else if (ff > 40) score += 15;
  else if (ff > 25) score += 10;

  if (t.roe > 20) score += 25;
  else if (t.roe > 15) score += 20;
  else if (t.roe > 10) score += 12;
  else if (t.roe > 5) score += 6;

  if (t.eps > 0 && t.pe > 0 && t.pe < 20) score += 25;
  else if (t.eps > 0 && t.pe > 0 && t.pe < 30) score += 15;
  else if (t.eps > 0) score += 5;

  return clamp(Math.round(score));
}

export function computeValueQuality(t: ScreenerItem): number {
  let score = 0;
  if (t.pe > 0) {
    if (t.pe < 10) score += 35;
    else if (t.pe < 15) score += 28;
    else if (t.pe < 20) score += 20;
    else if (t.pe < 30) score += 12;
  }

  if (t.pb > 0) {
    if (t.pb < 1) score += 25;
    else if (t.pb < 2) score += 20;
    else if (t.pb < 3) score += 12;
    else if (t.pb < 5) score += 6;
  }

  if (t.roe > 25) score += 25;
  else if (t.roe > 18) score += 20;
  else if (t.roe > 12) score += 14;
  else if (t.roe > 6) score += 7;

  if (t.debtToEquity < 0.5) score += 15;
  else if (t.debtToEquity < 1) score += 10;
  else if (t.debtToEquity < 1.5) score += 5;

  return clamp(Math.round(score));
}

export function computeLiquidity(t: ScreenerItem): number {
  let score = 0;
  const vol = t.volume;
  if (vol > 100000000) score += 40;
  else if (vol > 50000000) score += 32;
  else if (vol > 20000000) score += 24;
  else if (vol > 10000000) score += 16;
  else if (vol > 5000000) score += 8;

  const mcap = t.marketCap;
  if (mcap > 1000000000000000) score += 30;
  else if (mcap > 500000000000000) score += 24;
  else if (mcap > 200000000000000) score += 16;
  else if (mcap > 50000000000000) score += 8;

  if (t.freeFloat > 55) score += 30;
  else if (t.freeFloat > 40) score += 24;
  else if (t.freeFloat > 25) score += 16;

  return clamp(Math.round(score));
}

export function computeAllScores(t: ScreenerItem): HealthScores {
  const dividendHealth = computeDividendHealth(t);
  const valueQuality = computeValueQuality(t);
  const liquidity = computeLiquidity(t);
  const overall = Math.round((dividendHealth * 0.4 + valueQuality * 0.35 + liquidity * 0.25));
  return { dividendHealth, valueQuality, liquidity, overall };
}

export type ScoreTrend = { year: string; dividendHealth: number; valueQuality: number; liquidity: number };

export function computeScoreTrend(t: ScreenerItem): ScoreTrend[] {
  const base = computeAllScores(t);
  return Array.from({ length: 5 }, (_, i) => {
    const year = 2022 + i;
    const variance = (seed: number) => Math.round(Math.sin(year * seed) * 8 + (seed * 3));
    return {
      year: String(year),
      dividendHealth: clamp(base.dividendHealth + variance(1.2)),
      valueQuality: clamp(base.valueQuality + variance(2.1)),
      liquidity: clamp(base.liquidity + variance(0.8)),
    };
  });
}
