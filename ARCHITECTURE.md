# SYSTEM ARCHITECTURE: BHARAT MARKET INTELLIGENCE

**Platform Name:** Bharat Market Intelligence (BMI)  
**Target:** Indian Equity Markets (NSE & BSE)  
**Standard:** Professional Institutional-Grade Retail Research Terminal  
**Timezone:** `Asia/Kolkata` (IST)  
**License:** Free & Open-Source (MIT Compatible)

---

## 1. High-Level System Architecture Diagram

```mermaid
flowchart TD
    subgraph Data Layer ["Data Ingestion & Provider Layer"]
        NSE[NSE India Adapter\nBhavcopy & Index Feeds]
        BSE[BSE India Adapter\nCorporate Filings]
        TEJ[TejHQ Bhavcopy Parquet\nHistorical Datasets]
        YF[Yahoo Finance Fallback\nOHLCV & Secondary Ratios]
        RSS[Financial RSS Feeds\nRBI, SEBI, News & Filings]
    end

    subgraph Core Engine ["Data Quality, Storage & Processing"]
        VAL[Data Validation Engine\nOHLC Rules, Jump Detection]
        MGR[Provider Manager & Health Monitor\nCaching, Retries & Fallbacks]
        SQLITE[(SQLite DB\nWatchlists, Portfolios, Reports)]
        DUCK[(DuckDB & Parquet\nTime-Series OHLCV & Bhavcopies)]
        CAL[IST Trading Calendar\nHolidays, Muhurat & Timings]
    end

    subgraph Analytical Core ["Quantitative & Fundamental Engines"]
        TECH[Technical Indicator Engine\nSMA, EMA, RSI, MACD, BB, ATR, ADX, Supertrend, VWAP]
        FUND[Fundamental Research Engine\nROE, ROCE, D/E, FCF, Margins, Valuation]
        SECT[Sector & Heatmap Engine\n16 Sectors, Relative Strength, Breadth]
        INST[FII / DII Flow Engine\nCash Market, 5D/20D Rolling, Streaks]
        SCAN[Discovery & Screener Engine\nMomentum, Breakout, Reversal, Quality, Value, Volume]
        BACK[Backtesting Engine\nIndian Cost Modeling: STT, Stamp, Brokerage, GST]
    end

    subgraph Intelligence & AI ["Insight & Narrative Synthesis"]
        OBS[Intraday Observation Engine\nBreakouts, Spikes, Breadth Shifts]
        AI_ROUTER[AI Engine Router]
        RULE_AI[Rule-Based Deterministic Analyst\nNo API Key Required - Always On]
        GEMINI[Google Gemini 2.5/Flash\nOptional Free API Key]
        OLLAMA[Local Ollama LLM\nOptional Offline LLM]
        REP_GEN[Daily Report Generator\nMorning, Intraday, Evening, PDF/CSV Export]
    end

    subgraph Scheduling ["Automated Cycles (Asia/Kolkata)"]
        SCHED[APScheduler Daemon]
        T_MORN[08:30 IST: Pre-Market]
        T_INTRA[09:15-15:30 IST: 15-Min Monitor]
        T_EVE[15:45-21:00 IST: Closing Report]
        T_SCAN[Daily 18:00 IST: Screener Refresh]
    end

    subgraph Frontend ["Next.js 15 PWA Interface"]
        UI_DASH[Executive Terminal Dashboard]
        UI_PRE[Pre-Market Intelligence]
        UI_LIVE[Live Market Monitor & Charts]
        UI_SECT[Sector Heatmap & Breadth]
        UI_INST[FII / DII Institutional Flows]
        UI_SCAN[Multi-Factor Screener]
        UI_STOCK[Deep Stock Research Dossier]
        UI_NEWS[Curated Event Newsroom]
        UI_PORT[Local Portfolio & Watchlists]
        UI_QUAL[Visible Data Quality Panel]
        UI_REP[Report Archive & Export]
    end

    %% Data Connections
    Data Layer --> MGR
    MGR --> VAL
    VAL --> DUCK
    VAL --> SQLITE
    CAL --> SCHED

    %% Analytics Connections
    DUCK --> TECH
    DUCK --> FUND
    DUCK --> SECT
    DUCK --> INST
    TECH --> SCAN
    FUND --> SCAN
    TECH --> BACK

    %% Intelligence Connections
    TECH --> OBS
    SECT --> OBS
    OBS --> AI_ROUTER
    TECH --> AI_ROUTER
    FUND --> AI_ROUTER
    AI_ROUTER --> RULE_AI
    AI_ROUTER --> GEMINI
    AI_ROUTER --> OLLAMA
    AI_ROUTER --> REP_GEN

    %% Scheduling Connections
    SCHED --> T_MORN
    SCHED --> T_INTRA
    SCHED --> T_EVE
    SCHED --> T_SCAN
    T_MORN --> REP_GEN
    T_INTRA --> OBS
    T_EVE --> REP_GEN
    T_SCAN --> SCAN

    %% Frontend Connections
    DUCK -.-> Frontend
    SQLITE -.-> Frontend
    REP_GEN -.-> Frontend
    VAL -.-> UI_QUAL
```

---

## 2. Core Architectural Pillars

### A. Free-First & Zero Paid Dependencies
- **Strictly No Paid APIs:** Zero reliance on Bloomberg, Refinitiv, or paid vendor subscriptions.
- **Pure Local Execution:** Runs completely on the user's computer with persistent local storage.
- **Transparent AI:** The deterministic rule-based analyst runs 100% locally with zero API key. Optional free-tier Gemini API and local Ollama integrations are supported for enhanced natural language narratives.

### B. Truthful Data Engine & Freshness Taxonomy
All data served to the terminal is tagged with one of five immutable statuses:
1. `LIVE`: Genuine real-time quote confirmed by an active exchange session.
2. `DELAYED`: Sourced from a compliant delayed exchange feed (typically 15-min delayed).
3. `LAST AVAILABLE`: Most recent valid official closing Bhavcopy / EOD data.
4. `STALE`: Cached data exceeding the configured freshness threshold.
5. `UNAVAILABLE`: Explicit truthful failure state. No synthetic candles or prices are ever manufactured.

### C. Data Quality & Anti-Hallucination Framework
- **Price Integrity Checks:**
  - $High \ge \max(Open, Close, Low)$
  - $Low \le \min(Open, Close, High)$
  - $Volume \ge 0$
  - Jump/circuit spike validation against previous close
- **Anti-Hallucination Barrier:** The AI layer receives *only* pre-calculated numerical values and verified corporate filings. The AI is strictly barred from calculating prices, indicators, or ratios.

### D. Dual Storage Architecture
1. **SQLite (`market_intel.db`):** Transactional application data including user watchlists, portfolio positions, scheduled job history, report archives, and user settings.
2. **DuckDB + Parquet (`data/historical/`):** Columnar, compressed analytical storage for multi-year daily Bhavcopies, 5-minute intraday snapshots, and historical financial statement metrics.

---

## 3. Technology Stack

| Layer | Selected Technology | Rationale |
| :--- | :--- | :--- |
| **Frontend Framework** | Next.js (App Router, React 19) | Server-rendered pages, lightning-fast static generation, responsive PWA |
| **Styling & Components** | Tailwind CSS + shadcn/ui + Lucide Icons | Polished Bloomberg/Refinitiv-inspired navy dark aesthetic with crisp financial typography |
| **Charting Engine** | TradingView Lightweight Charts + Recharts | Production-grade candlestick charts with zero subscription fees |
| **Backend API** | FastAPI (Python 3.14+) | High-throughput asynchronous endpoints with auto-generated OpenAPI documentation |
| **Numerical Engine** | NumPy + Pandas + SciPy | Vectorized calculation of moving averages, oscillators, regression channels, and volatility |
| **Job Scheduling** | APScheduler | Cron-like IST scheduling for morning (08:30), intraday (15-min), and closing (15:45-21:00) cycles |
| **Document Export** | ReportLab + CSV Exporters | Client-downloadable PDF research reports and CSV data extracts |

