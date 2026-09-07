// lib/signals.ts - Derived signal logic for REQ-3
// Combines net foreign inflow + broker divergence into actionable buy/sell pressure indicators
import type { ScreenerItem, ForeignFlow, BrokerSummary } from './sectors/client';

export type SignalStrength = 'strong_buy' | 'buy' | 'neutral' | 'sell' | 'strong_sell';

export type DerivedSignal = {
  symbol: string;
  foreignSignal: SignalStrength;
  brokerSignal: SignalStrength;
  combinedSignal: SignalStrength;
  confidence: number;
  foreignScore: number;
  brokerScore: number;
  summary: string;
};

export function classifyForeign(netInflow: number): { score: number; signal: SignalStrength } {
  const bn = netInflow / 1e9;
  if (bn > 50) return { score: 90, signal: 'strong_buy' };
  if (bn > 20) return { score: 75, signal: 'buy' };
  if (bn > 5) return { score: 60, signal: 'neutral' };
  if (bn > -5) return { score: 50, signal: 'neutral' };
  if (bn > -20) return { score: 35, signal: 'sell' };
  if (bn > -50) return { score: 20, signal: 'strong_sell' };
  return { score: 10, signal: 'strong_sell' };
}

export function classifyBroker(broker: BrokerSummary): { score: number; signal: SignalStrength } {
  const totalBuy = broker.topBuyers.reduce((s, b) => s + b.value, 0);
  const totalSell = broker.topSellers.reduce((s, b) => s + b.value, 0);
  const ratio = totalBuy / (totalSell || 1);
  if (ratio > 2.5) return { score: 85, signal: 'strong_buy' };
  if (ratio > 1.5) return { score: 70, signal: 'buy' };
  if (ratio > 1.1) return { score: 55, signal: 'neutral' };
  if (ratio > 0.8) return { score: 45, signal: 'neutral' };
  if (ratio > 0.5) return { score: 30, signal: 'sell' };
  return { score: 15, signal: 'strong_sell' };
}

const SIGNAL_LABELS: Record<SignalStrength, string> = {
  strong_buy: 'Strong Buy Pressure',
  buy: 'Buy Pressure',
  neutral: 'Neutral',
  sell: 'Sell Pressure',
  strong_sell: 'Strong Sell Pressure',
};

const SIGNAL_DISPLAY: Record<SignalStrength, { emoji: string; bg: string; text: string }> = {
  strong_buy: { emoji: '\u2B06\uFE0F', bg: '#065F46', text: '#00D68F' },
  buy: { emoji: '\u2197\uFE0F', bg: '#064E3B', text: '#6EE7C3' },
  neutral: { emoji: '\u27A1\uFE0F', bg: '#374151', text: '#9CA3AF' },
  sell: { emoji: '\u2198\uFE0F', bg: '#7C2D12', text: '#FF8A96' },
  strong_sell: { emoji: '\u2B07\uFE0F', bg: '#991B1B', text: '#FF4D5E' },
};

export function getSignalDisplay(signal: SignalStrength) {
  return { ...SIGNAL_DISPLAY[signal], label: SIGNAL_LABELS[signal] };
}

export function computeDerivedSignal(symbol: string, ticker: ScreenerItem, foreign: ForeignFlow | null, broker: BrokerSummary | null): DerivedSignal {
  const foreignResult = foreign ? classifyForeign(foreign.netInflow) : { score: 50, signal: 'neutral' as SignalStrength };
  const brokerResult = broker ? classifyBroker(broker) : { score: 50, signal: 'neutral' as SignalStrength };

  const combinedScore = Math.round(foreignResult.score * 0.55 + brokerResult.score * 0.45);
  let combinedSignal: SignalStrength = 'neutral';
  if (combinedScore >= 80) combinedSignal = 'strong_buy';
  else if (combinedScore >= 65) combinedSignal = 'buy';
  else if (combinedScore >= 40) combinedSignal = 'neutral';
  else if (combinedScore >= 25) combinedSignal = 'sell';
  else combinedSignal = 'strong_sell';

  const confidence = Math.min(95, Math.max(30, 50 + Math.abs(combinedScore - 50)));

  const summary = `${SIGNAL_LABELS[combinedSignal]} on ${symbol} - foreign flow ${SIGNAL_LABELS[foreignResult.signal].toLowerCase()}, broker ${SIGNAL_LABELS[brokerResult.signal].toLowerCase()}.`;

  return { symbol, foreignSignal: foreignResult.signal, brokerSignal: brokerResult.signal, combinedSignal, confidence, foreignScore: foreignResult.score, brokerScore: brokerResult.score, summary };
}
