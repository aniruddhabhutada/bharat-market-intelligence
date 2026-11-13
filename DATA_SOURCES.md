# DATA SOURCES SPECIFICATION: BHARAT MARKET INTELLIGENCE

**Version:** 1.0.0  
**Scope:** NSE / BSE Equities, Sectoral Indices, Macro Indicators, Institutional Flows  
**Priority Philosophy:** Primary Official Sources First, Secondary Fallbacks Transparently Disclosed

---

## 1. Provider Priority Hierarchy

Bharat Market Intelligence enforces a strict priority hierarchy for all data retrieval:

```
[Level 1: Official Exchanges]
  ├── NSE India (Official Bhavcopy, Indices, FII/DII cash, Corporate Filings)
  └── BSE India (Official Corporate Announcements, Results)
        ↓ (fallback on network block / closure)
[Level 2: Open Historical Repositories]
  └── TejHQ / Indian Markets (Historical Parquet Bhavcopies, point-in-time universe)
        ↓ (fallback on missing history)
[Level 3: Secondary Market Providers]
  └── Yahoo Finance (Personal research OHLCV, Global Indices, Forex & Commodities)
        ↓ (contextual news)
[Level 4: Verified Public News Feeds]
  └── RBI, SEBI, LiveMint, Economic Times, Business Standard RSS Feeds
```

---

## 2. Source-by-Source Specifications

### A. National Stock Exchange of India (NSE)
* **Website:** https://www.nseindia.com/
* **Role:** Primary source for official Indian equity data.
* **Retrieved Data:**
  1. **Daily Bhavcopy (`cm{dd}{mon}{yyyy}bhav.csv.zip` or modern SecBhav format):**
     - Symbol, Series, Open, High, Low, Close, Last, Previous Close, Total Traded Quantity, Total Traded Value, Total Trades.
  2. **NSE Index Feed:**
     - NIFTY 50, NIFTY BANK, NIFTY IT, NIFTY AUTO, NIFTY PHARMA, NIFTY FMCG, NIFTY METAL, NIFTY REALTY, NIFTY MEDIA, NIFTY ENERGY, NIFTY INFRA, INDIA VIX.
  3. **FII / DII Cash Activity:**
     - Gross Buy, Gross Sell, Net Institutional Value for current trading session.
  4. **Corporate Announcements & Financial Disclosures:**
     - Earnings press releases, board meetings, dividend declarations, stock splits.
* **Access Method:** Permitted public endpoints with session cookie management, rate-limiting (maximum 1 req/sec), and standard user-agent rotation.
* **Failure Handling:** Switch to TejHQ historical archive for EOD or Yahoo Finance fallback for active quotes.

### B. Bombay Stock Exchange (BSE)
* **Website:** https://www.bseindia.com/
* **Role:** Secondary exchange source & BSE SENSEX benchmark.
* **Retrieved Data:**
  - BSE SENSEX OHLCV and market turnover.
  - S&P BSE 500 constituents and corporate action filings.

### C. TejHQ Open Data Repository
* **Source:** https://github.com/tejhq/tej-bazaar / Hugging Face Parquet Mirror
* **Role:** Point-in-time historical EOD archive.
* **Retrieved Data:**
  - Back-adjusted historical prices (split and bonus adjustments cleanly separated from raw cash Bhavcopy).
  - Point-in-time universe lists to ensure survivorship-bias-free backtesting.
* **Format:** Compressed Parquet (`zstd`).

### D. Yahoo Finance (Personal Research Fallback)
* **Role:** Secondary fallback provider for live quotes, global indices, macro indicators, and multi-timeframe intraday bars.
* **Retrieved Data:**
  - **Indian Equities:** Symbols formatted with `.NS` (NSE) and `.BO` (BSE).
  - **Global Indices:** `^DJI` (Dow Jones), `^GSPC` (S&P 500), `^IXIC` (Nasdaq), `^N225` (Nikkei 225), `^HSI` (Hang Seng), `^FTSE` (FTSE 100).
  - **Gift Nifty / SGX Proxy:** Benchmark tracking for Indian market pre-open sentiment.
  - **Commodities & Forex:** `CL=F` (Crude Oil Brent/WTI), `GC=F` (Gold), `INR=X` (USD/INR exchange rate), `^TNX` (US 10-Year Treasury Yield), `DX-Y.NYB` (US Dollar Index).
* **Compliance:** Used exclusively for personal local research without commercial redistribution.

### E. Financial News and Regulatory Feeds
* **Sources:**
  - Reserve Bank of India (RBI) Press Releases (RSS).
  - Securities and Exchange Board of India (SEBI) Orders & Circulars (RSS).
  - Major Financial News Feeds: Economic Times, LiveMint, Business Standard.
* **Processing:**
  - Ingestion, deduplication, entity extraction (matching against NIFTY 500 symbol dictionaries), classification by sentiment and topic.

---

## 3. Data Freshness Taxonomy

Every data object presented in Bharat Market Intelligence must display one of the following badge statuses:

| Status Badge | Criteria | Permitted Display |
| :--- | :--- | :--- |
| **`LIVE`** | Timestamp is within 60 seconds of current IST time during open market hours (09:15–15:30 IST) from an active stream. | Green badge with pulsing dot. |
| **`DELAYED`** | Exchange-confirmed 15-minute delayed stream during open market hours. | Amber badge with delay indicator `[15m DELAYED]`. |
| **`LAST AVAILABLE`** | Final closing quote or official Bhavcopy after 15:30 IST or on non-trading days/weekends. | Slate/Blue badge with trading date `[EOD: YYYY-MM-DD]`. |
| **`STALE`** | Quote timestamp is older than 30 minutes during active market hours, or EOD is older than the last completed trading day. | Warning Orange badge `[STALE]`. |
| **`UNAVAILABLE`** | Provider failed, endpoint timed out, or trading suspended. | Crimson badge `[UNAVAILABLE]`. Never displays synthetic values. |

---

## 4. Rate Limiting, Caching, and Backoff Policies

1. **Request Throttling:**
   - Maximum 1 concurrent request per public exchange host.
   - Jittered delay between requests: 1.0s – 2.5s.
2. **Caching TTLs:**
   - Intraday Quotes: 30 seconds during market hours.
   - Bhavcopy / EOD Prices: 24 hours (immutable once published).
   - Historical Financial Statements: 7 days.
   - News Feeds: 5 minutes.
3. **Exponential Backoff:**
   - Retry sequence on failure: 2s, 4s, 8s, up to 3 attempts.
   - Upon 3rd failure, gracefully switch to secondary provider and flag in the Data Quality Panel.

