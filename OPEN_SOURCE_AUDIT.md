# OPEN SOURCE AUDIT: BHARAT MARKET INTELLIGENCE

**Date:** November 2026  
**Auditor:** Bharat Market Intelligence Engineering Architecture Team  
**Objective:** Independent audit and evaluation of 5 benchmark open-source Indian financial market research repositories to identify reusable architectures, ingestion methods, indicator formulations, licensing compliance, and security safeguards.

---

## 1. Audited Repositories Summary

| Repository | Focus Area | License | Maintenance / Health | Reusable Architectural Value | Security & Integrity Assessment |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`tejhq/tej-bazaar`** | Official NSE/BSE Bhavcopy EOD pipelines, Parquet datasets | MIT | Active & Production-grade | Official exchange data formats, back-adjustment logic (splits, bonus, dividends), point-in-time liquid universe | High data integrity. Official raw Bhavcopy ingestion, avoids survivorship bias. |
| **`bllubhai/stockbot-india`** | Nifty 500 scanner & 7-factor scoring engine | MIT | Active Community Tool | 7-factor scoring system, local-first zero-cost execution, Streamlit & CLI patterns | Good logic for retail scoring; needs separation of data fetching from presentation; robust fallback needed. |
| **`Suraj2553/india-stock-dashboard`** | Indian stock analytics dashboard & charting | MIT / Open-source | Community Prototype | Market breadth visualization, sectoral performance tables, technical charting | Simple dashboard patterns; relies heavily on third-party scrapers that can break; needs provider abstraction. |
| **`neurobloomai/market-tools`** | Quality + Structure stock screener (NSE & US) | MIT | Active | Multi-factor Quality screening (Debt/EV, ROE, Margins) combined with 4-MA trend filter | Solid fundamental screening formulas. Excellent baseline for quality scoring without look-ahead bias. |
| **`AshayK003/fii-dii-dashboard`** | Institutional flow tracking (NSE FII/DII) | MIT | Active | Gross vs. net institutional cash flows, 5-day and 20-day rolling averages, flow-strength meter | Accurate FII/DII flow parsing. Must separate cash market flows from F&O positioning as required by BMI spec. |

---

## 2. In-Depth Repository Evaluation

### A. tejhq/tej-bazaar
- **Ingestion Method:** Direct download and parsing of official daily NSE and BSE Bhavcopies (CSV/ZIP from exchange public archives).
- **Data Structure:** Transforms raw Bhavcopy into standardized, zstd-compressed Parquet tables.
- **Survivorship Bias Guard:** Constructs point-in-time liquid universes so historical backtests retain historical constituents even if later delisted or merged.
- **Key Takeaways for Bharat Market Intelligence:**
  1. Bhavcopy parsing is the gold standard for reliable, official closing prices, deliveries, and traded volumes.
  2. Implement local Parquet / DuckDB storage for ultra-fast historical queries alongside SQLite for transactional application data (watchlists, alerts, notes).
  3. Strict adjustment handling: Keep raw unadjusted close and corporate-action-adjusted close separate.

### B. bllubhai/stockbot-india
- **Scoring Architecture:** 7 distinct research pillars: Trend, Momentum, Moving Average Alignment, Volume Surge, Valuation, Profitability, and Shareholding.
- **Local-First Philosophy:** Entirely free, requires zero paid subscription or API keys, works fully offline with cached data.
- **Key Takeaways for Bharat Market Intelligence:**
  1. Transparent scoring: Each factor must show its individual percentage and score breakdown rather than an opaque black-box number.
  2. Critical rule: When no stock qualifies with high conviction, never force-feed stocks. Output the explicit message: *"NO HIGH-QUALITY SETUP FOUND TODAY"*.

### C. Suraj2553/india-stock-dashboard
- **UI/UX Patterns:** Fast interactive overview of NIFTY 50, Bank Nifty, and Sectoral indices.
- **Key Takeaways for Bharat Market Intelligence:**
  1. Provide clear timestamping and freshness badges (`LIVE`, `DELAYED`, `LAST AVAILABLE`, `STALE`, `UNAVAILABLE`) on all index cards and tables.
  2. Ensure charts support candlestick views, volume overlays, and multi-timeframe switching without synthetic candle fabrication.

### D. neurobloomai/market-tools
- **Fundamental & Technical Filtering:** "Quality + Structure" model.
  - Quality: ROE > 15%, ROCE > 15%, Debt/Equity < 1.0 (or appropriate sector peer), Positive operating cash flows.
  - Structure: Close > 20 EMA > 50 SMA > 200 SMA (bullish stage-2 structure).
- **Key Takeaways for Bharat Market Intelligence:**
  1. Incorporate both standalone and consolidated ratios with explicit labels.
  2. Guard against missing historical financial statements before computing multi-year CAGRs.

### E. AshayK003/fii-dii-dashboard
- **Flow Analytics:** Daily FII and DII gross purchases, gross sales, and net institutional flows.
- **Rolling Windows:** 5-session short-term trend and 20-session medium-term institutional sentiment.
- **Key Takeaways for Bharat Market Intelligence:**
  1. Cash market activity must never be conflated with index futures/options contracts.
  2. Never extrapolate aggregate FII cash flows to infer buying in individual specific stocks.

---

## 3. Selected Components and Attributions

In accordance with MIT license requirements and intellectual property best practices:
1. **Mathematical Formulas:** Technical indicator calculations (RSI, Supertrend, ADX, ATR, VWAP, Bollinger Bands) implemented as tested, pure mathematical functions with zero hidden vendor lock-in.
2. **Indian Market Heuristics:** IST session constraints (09:15–15:30 IST), Muhurat trading calendar, NSE/BSE tick-size awareness, and Indian transaction cost schedules (STT, brokerage, stamp duty, GST).
3. **Provider-Adapter Layer:** An isolated Multi-Provider Engine that wraps NSE Bhavcopy, BSE filings, secondary financial feeds, and public RSS feeds behind uniform Pydantic models.
4. **Attribution:** Full credit given in application documentation, `README.md`, and license headers to the open-source community contributors who pioneer free Indian financial data tooling.

