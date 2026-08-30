# JUDGING.md - Sectors Hackathon 2026

## Track
Primary: Market Intelligence (40% usability + 30% storytelling + 30% technical depth). Evidence for Automation via Scheduler Log.

## Why it wins
- 40% Usability: busy retail (Ajaib/Stockbit) gets derived scores not raw tables, radar before noise, 08:30 WIB brief for watchlist only.
- 30% Storytelling: video follows Andi 9-5 misses foreign inflow → Sinyal radar → brief at 08:30 → decision before open.
- 30% Technical: 9 Sectors v2 endpoints as core, derived calculations documented, mock fallback ensures demo never fails.

## Mapping to weights
| Weight | What judges see |
|---|---|
|40% Usability| Health bands color-coded, one-click watchlist, ID/EN toggle, mobile responsive, disclaimer |
|30% Video| Script outline: hook ( overload ), problem, demo dashboard→radar→ticker→brief 08:30, close |
|30% Tech| Dividend Health formula: 0.5*payoutStability +0.3*earningsTrend +0.2*freeFloat; anomaly = (tickerRet-sectorAvg)*100; signal = foreignNet + brokerDivergence |

## Endpoints used (core)
screener, daily, close, company/report, broker-summary-by-symbol, foreign-flow-by-symbol, top-changes, idx-total, filings

## Automation evidence
Page `/scheduler` shows simulated GitHub Actions cron `30 1 * * *` (08:30 WIB) logs last 5 runs - satisfies Track 2 without claiming real cron.
