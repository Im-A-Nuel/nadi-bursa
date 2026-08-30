// lib/briefGenerator.ts - Personalized 08:30 WIB briefing generator
import { computeAllScores, getHealthBand } from './healthScores';
import { computeDerivedSignal, getSignalDisplay } from './signals';
import type { ScreenerItem, ForeignFlow, BrokerSummary } from './sectors/client';

export type BriefHighlight = {
  symbol: string;
  scores: ReturnType<typeof computeAllScores>;
  signal: ReturnType<typeof computeDerivedSignal>;
};

export type DailyBrief = {
  date: string;
  timestamp: string;
  idxSummary: { close: number; change: number; changePercent: number };
  highlights: BriefHighlight[];
  watchlistHighlights: BriefHighlight[];
  topMovers: { symbol: string; changePercent: number; name: string }[];
  alerts: string[];
};

export function generateBrief(
  tickers: ScreenerItem[],
  foreignData: Record<string, ForeignFlow | null>,
  brokerData: Record<string, BrokerSummary | null>,
  watchlistSymbols: string[],
  idxTotal: { close: number; change: number; changePercent: number }
): DailyBrief {
  const now = new Date();
  const jakarta = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
  const dateStr = jakarta.toISOString().split('T')[0];
  const timeStr = jakarta.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }) + ' WIB';

  const highlights: BriefHighlight[] = tickers.map(t => {
    const scores = computeAllScores(t);
    const signal = computeDerivedSignal(t.symbol, t, foreignData[t.symbol], brokerData[t.symbol]);
    return { symbol: t.symbol, scores, signal };
  });

  const watchlistHighlights = highlights.filter(h => watchlistSymbols.includes(h.symbol));

  const alerts: string[] = [];
  highlights.forEach(h => {
    if (h.signal.combinedSignal === 'strong_buy') alerts.push(`${h.symbol}: Strong buy signal - foreign + broker alignment`);
    if (h.signal.combinedSignal === 'strong_sell') alerts.push(`${h.symbol}: Strong sell signal - watch for exit`);
    if (h.scores.dividendHealth >= 80) alerts.push(`${h.symbol}: Dividend Health ${h.scores.dividendHealth}/100 - high yield sustainable`);
    if (h.scores.dividendHealth <= 20 && h.scores.dividendHealth > 0) alerts.push(`${h.symbol}: Dividend trap risk - Health ${h.scores.dividendHealth}/100`);
  });

  const topMovers = [...tickers]
    .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
    .slice(0, 5)
    .map(t => ({ symbol: t.symbol, changePercent: t.changePercent, name: t.name }));

  return {
    date: dateStr,
    timestamp: timeStr,
    idxSummary: { close: idxTotal.close, change: idxTotal.change, changePercent: idxTotal.changePercent },
    highlights,
    watchlistHighlights,
    topMovers,
    alerts,
  };
}

export function formatBriefText(brief: DailyBrief): string {
  let text = `SINYAL HARI INI - ${brief.date} ${brief.timestamp}\n`;
  text += `IHSG: ${brief.idxSummary.close} (${brief.idxSummary.changePercent >= 0 ? '+' : ''}${brief.idxSummary.changePercent}%)\n\n`;
  text += `TOP MOVERS:\n`;
  brief.topMovers.forEach(m => { text += `  ${m.symbol} ${m.changePercent >= 0 ? '+' : ''}${m.changePercent}%\n`; });
  text += `\nALERTS:\n`;
  brief.alerts.forEach(a => { text += `  ${a}\n`; });
  if (brief.watchlistHighlights.length) {
    text += `\nYOUR WATCHLIST:\n`;
    brief.watchlistHighlights.forEach(h => {
      const band = getHealthBand(h.scores.overall);
      text += `  ${h.symbol}: ${band.label} (${h.scores.overall}/100) - ${getSignalDisplay(h.signal.combinedSignal).label}\n`;
    });
  }
  text += `\nDisclaimer: Not financial advice. Information tool only.`;
  return text;
}
