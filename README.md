# Sinyal Hari Ini — IDX Market Intelligence & Daily Brief Automation

> **Track:** Market Intelligence (primary) + Automation Workflows (evidence)
> **Hackathon:** Sectors Hackathon 2026

## What It Does

Sinyal Hari Ini is an IDX market intelligence dashboard for Indonesian retail investors (age 20-45, using Ajaib/Stockbit) who face information overload. It translates raw Sectors API v2 data into derived insights:

- **Health Scores (0-100)** — Dividend Health (5yr payout sustainability, free float, earnings trend), Value Quality, Liquidity per ticker
- **Anomaly Radar** — Detects unusual price/volume moves vs sector baseline
- **Foreign Flow & Broker Accumulation** — Net foreign inflow + broker divergence → actionable buy/sell pressure signals
- **Watchlist + Daily Brief** — One-click watchlist, automated 08:30 WIB morning briefing with alerts
- **Screener** — Filter, sort, and compare all 10 seeded IDX tickers

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. (Optional) Add your Sectors API key
cp .env.example .env.local
# Edit .env.local and add: NEXT_PUBLIC_SECTORS_API_KEY=your_key_here

# 3. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**No API key? No problem.** The app runs in Demo Mode with seeded mock data for 10 IDX tickers (BBCA, BBRI, BMRI, TLKM, ASII, ADRO, UNVR, ICBP, GOTO, BRPT).

## Pages

| Page | Route | Purpose |
|------|-------|---------|
| Dashboard | `/dashboard` or `/` | Health scores overview |
| Screener | `/screener` | Filter & sort stocks |
| Radar | `/radar` | Anomaly detection |
| Ticker Detail | `/ticker/[symbol]` | Deep dive per stock |
| Daily Brief | `/brief` | 08:30 WIB morning briefing |
| Scheduler | `/scheduler` | Automation evidence log |
| About | `/about` | Architecture & credits |

## Tech Stack

- **Framework:** Next.js 14 App Router
- **Styling:** Tailwind CSS (navy/gold/teal design system)
- **Charts:** Recharts (LineChart, AreaChart, BarChart)
- **Data:** Sectors REST API v2 with transparent mock fallback
- **Language:** TypeScript + React 18

## API Integration

The app uses these Sectors REST API v2 endpoints:
- `v2/companies/screener` — stock screening data
- `v2/daily` — daily OHLCV bars
- `v2/close` — closing prices
- `v2/company/report` — company fundamentals
- `v2/broker-summary-by-symbol` — broker buy/sell summary
- `v2/foreign-flow-by-symbol` — foreign trading flow
- `v2/top-changes` — top gainers/losers
- `v2/idx-total` — IHSG index total
- `v2/filings` — company filings

## Features

- **Indonesian/English toggle** — Full ID/EN language support
- **Mobile responsive** — Works on all screen sizes
- **Watchlist persistence** — localStorage-based one-click watchlist
- **Mock data badge** — Transparent indicator when running in demo mode
- **Score visualization** — Ring charts, bar indicators, trend lines

## Project Structure

```
sinyal-hari-ini/
├── app/
│   ├── layout.tsx          # Root layout with nav
│   ├── page.tsx            # Home/landing
│   ├── globals.css         # Tailwind + design tokens
│   ├── dashboard/page.tsx  # Health scores dashboard
│   ├── screener/page.tsx   # Stock screener
│   ├── radar/page.tsx      # Anomaly radar
│   ├── ticker/[symbol]/page.tsx  # Ticker detail
│   ├── brief/page.tsx      # Daily brief
│   ├── scheduler/page.tsx  # Scheduler log
│   └── about/page.tsx      # About page
├── components/
│   ├── layout/             # Navbar, LanguageProvider
│   └── common/             # ScoreRing, SignalBadge, etc.
├── lib/
│   ├── sectors/            # API client, endpoints, mock data
│   ├── healthScores.ts     # Score computation
│   ├── signals.ts          # Signal analysis
│   ├── watchlist.ts        # Watchlist persistence
│   ├── briefGenerator.ts   # Brief generation
│   └── radar/              # Anomaly detection
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── .env.example
```

## Disclaimer

**Not financial advice.** This is an information tool only. All data comes from Sectors API v2. Always do your own research before making investment decisions.

## License

MIT — Built for Sectors Hackathon 2026
