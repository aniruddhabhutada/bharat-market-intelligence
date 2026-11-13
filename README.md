# BHARAT MARKET INTELLIGENCE (BMI)
### Professional AI-Powered Indian Stock Market Research & Quantitative Analytics Platform

Bharat Market Intelligence is an institutional-grade, free-first equity research terminal built specifically for Indian stock markets (**NSE** & **BSE**). It replaces fragmented browser tabs and manual ChatGPT prompts with a unified, automated, and mathematically verifiable research workstation.

---

## Key Capabilities (The 5 Jobs)

1. **Daily Pre-Market Research (08:30 IST):** Global indices (Dow, S&P, Nasdaq, Nikkei, Hang Seng), Gift Nifty proxy, macro factors (Brent Crude, Gold, USD/INR, US 10Y Yields), previous Indian market setup, institutional liquidity, Bullish/Bearish/Neutral scenarios, and risk identification.
2. **Live / Intraday Market Monitor (09:15–15:30 IST):** Real-time/delayed benchmarks (NIFTY 50, BANK NIFTY, SENSEX, INDIA VIX), technical indicator battery (SMA, EMA, RSI 14 with Wilder smoothing, MACD 12/26/9, Bollinger Bands 20/2, ATR 14, ADX 14, Supertrend, VWAP), interactive candlestick charts, and an automated Intraday Observation Engine explaining what happened, why, supporting data, and invalidation criteria.
3. **End-of-Day Research & Comprehensive Reporting:** Consolidated EOD closing summary, market breadth, top gainers/losers, institutional cash flows, and tomorrow's watchlists. Full PDF and CSV export capabilities.
4. **Deep Individual Stock Research:** Comprehensive equity dossiers with 5-year financials, profitability margins (EBITDA, PAT), capital efficiency (ROE, ROCE), leverage (Debt/Equity), cash flow quality (CFO vs PAT, Free Cash Flow), shareholding patterns (Promoter, FII, DII, Public, Pledge), and risk-managed scenarios.
5. **Daily Stock Discovery & Multi-Factor Screener:** 6 dedicated scanners: Momentum, Breakout (52w high, consolidation), Reversal (oversold, RSI exhaustion), Fundamental Quality (ROE, ROCE, low leverage), Value (PE, PB, Margin of Safety), and Volume (RVOL surge). Built on transparent factor weighting with a strict anti-forcing rule: if no stock qualifies with high conviction, it explicitly states *"NO HIGH-QUALITY SETUP FOUND TODAY."*

---

## Architectural Principles & Anti-Hallucination Guarantees

- **Free-First & Zero Paid Dependencies:** Built on free exchange public feeds, Bhavcopies, and community datasets. Zero paid API keys required.
- **Truthful Data Freshness Labels:** Every widget visibly displays its exact status: `LIVE`, `DELAYED`, `LAST AVAILABLE`, `STALE`, or `UNAVAILABLE`. Never fabricates missing ticks or synthetic candles.
- **AI As Analyst, Never As Data Source:** The AI research agent only explains pre-calculated, verified data points. It is strictly barred from computing prices or inventing corporate actions.
- **Interchangeable AI Architecture:**
  - *Rule-Based Deterministic Analyst:* 100% offline, zero API keys required, always on.
  - *Google Gemini API:* Optional user-provided free-tier key for natural-language synthesis.
  - *Local Ollama:* Optional local LLM for offline privacy.

---

## Quick Start & Installation

### Windows
Double-click `start_windows.bat` or run:
```cmd
start_windows.bat
```

### macOS / Linux
```bash
chmod +x start.sh
./start.sh
```

Once launched:
- **Terminal Web Interface:** [http://localhost:3000](http://localhost:3000)
- **FastAPI Interactive Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **Local Wi-Fi Mobile Phone Access:** `http://<YOUR_LAN_IP>:3000`

---

## Deployment & Cloud Hosting

### 1. GitHub & Netlify Deployment
Bharat Market Intelligence is ready for one-click deployment:
- **Frontend on Netlify**: Deploy the Next.js frontend with zero configuration using the included `netlify.toml`. All 13 modules run with built-in verified Indian market offline datasets out-of-the-box, ensuring zero-crash uptime.
- **Backend on Render / Railway**: Deploy the Python FastAPI backend using the included `render.yaml` or `Procfile`.
- **Complete Step-by-Step Guide**: See [DEPLOYMENT_GUIDE.md](file:///g:/vy/DEPLOYMENT_GUIDE.md) for full push and deployment instructions.

---

## Technical Stack

- **Frontend:** Next.js (App Router), React 19, TypeScript, Tailwind CSS, Lucide Icons, Lightweight Financial Charts & Recharts.
- **Backend:** Python 3.10+, FastAPI, NumPy, Pandas, SciPy, Pydantic V2.
- **Storage:** SQLite (`data/market_intel.db`) for app state; DuckDB (`data/historical/markets.duckdb`) & Parquet for high-performance time-series analytics.
- **Scheduling:** APScheduler in `Asia/Kolkata` timezone with verified holiday calendars.
- **Testing:** Automated test suite with Pytest.

---

## Running the Automated Test Suite

```bash
python -m pytest backend/tests/test_all.py -v
```
All unit tests verify:
- Geometric OHLC sanity ($High \ge \max(Open, Close, Low)$, $Low \le \min(Open, Close, High)$)
- Abnormal circuit and split jump detection
- Indicator formulations (SMA, EMA, Wilder's RSI, MACD, ATR, Supertrend)
- Indian statutory transaction costs (brokerage, STT, turnover, stamp duty, GST, slippage)
- Multi-factor research scoring engine
- NSE/BSE holiday calendar and IST session schedules

