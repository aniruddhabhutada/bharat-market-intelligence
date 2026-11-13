# DATA DICTIONARY: BHARAT MARKET INTELLIGENCE

**Version:** 1.0.0  
**Scope:** Core Data Models, Indicators, Ratios, Scoring Schemas & Transaction Cost Constants

---

## 1. Market Data Objects

### A. Quote / Candle Object
- `symbol` (str): NSE ticker symbol (e.g., `RELIANCE`, `TCS`, `HDFCBANK`).
- `exchange` (str): `NSE` or `BSE`.
- `timestamp` (datetime): Exchange execution timestamp (IST, `Asia/Kolkata`).
- `open` (float): Opening price for the period in INR (₹).
- `high` (float): Highest price for the period in INR (₹).
- `low` (float): Lowest price for the period in INR (₹).
- `close` (float): Closing or last traded price (LTP) in INR (₹).
- `volume` (int): Number of shares traded.
- `turnover` (float): Total traded value in INR Crores (₹ Cr).
- `vwap` (float, optional): Volume Weighted Average Price for the session.
- `delivery_qty` (int, optional): Number of shares marked for delivery.
- `delivery_pct` (float, optional): Ratio of delivery volume to total traded volume (`0.0` to `100.0%`).
- `status` (str): `LIVE`, `DELAYED`, `LAST AVAILABLE`, `STALE`, or `UNAVAILABLE`.
- `provider` (str): Originating data adapter name (e.g., `NSE_OFFICIAL`, `YAHOO_FALLBACK`).

---

## 2. Technical Indicators & Mathematical Formulations

### A. Moving Averages
- **SMA (Simple Moving Average):**
  $$SMA_n = \frac{1}{n} \sum_{i=1}^n Close_i$$
  Calculated for periods: $n = 20, 50, 100, 200$.
- **EMA (Exponential Moving Average):**
  $$EMA_t = Close_t \cdot \alpha + EMA_{t-1} \cdot (1 - \alpha), \quad \alpha = \frac{2}{n + 1}$$
  Calculated for periods: $n = 9, 20$.

### B. Momentum & Oscillators
- **RSI 14 (Relative Strength Index):**
  $$RS = \frac{\text{Average Gain over 14 bars}}{\text{Average Loss over 14 bars}}$$
  $$RSI = 100 - \frac{100}{1 + RS}$$
  Smoothed using Wilder's smoothing technique.
- **MACD (12, 26, 9):**
  $$MACD\text{ Line} = EMA_{12}(Close) - EMA_{26}(Close)$$
  $$Signal\text{ Line} = EMA_9(MACD\text{ Line})$$
  $$Histogram = MACD\text{ Line} - Signal\text{ Line}$$

### C. Volatility & Trend Channels
- **Bollinger Bands (20, 2):**
  $$Middle\text{ Band} = SMA_{20}(Close)$$
  $$Upper\text{ Band} = Middle\text{ Band} + 2 \cdot \sigma_{20}$$
  $$Lower\text{ Band} = Middle\text{ Band} - 2 \cdot \sigma_{20}$$
- **ATR 14 (Average True Range):**
  $$TR = \max(High - Low, |High - Close_{prev}|, |Low - Close_{prev}|)$$
  $$ATR_{14} = \text{Wilder's 14-period smoothed } TR$$
- **Supertrend (10, 3):**
  $$Basic Upper Band = \frac{High + Low}{2} + 3 \cdot ATR_{10}$$
  $$Basic Lower Band = \frac{High + Low}{2} - 3 \cdot ATR_{10}$$
  Trend trailing state flips when price closes outside opposite band.
- **ADX 14 (Average Directional Index):**
  Directional movement index measuring trend strength ($0-100$). Values $> 25$ indicate strong directional trend.

### D. Intraday Microstructure & Volume
- **VWAP (Volume-Weighted Average Price):**
  $$VWAP = \frac{\sum (Typical Price \cdot Volume)}{\sum Volume}, \quad Typical Price = \frac{High + Low + Close}{3}$$
- **Time-Matched RVOL (Relative Volume):**
  Ratio of cumulative volume at minute $t$ today compared to the 20-day historical mean cumulative volume at minute $t$.

---

## 3. Fundamental Financial Ratios

- **ROE (Return on Equity):** $\frac{\text{Net Income}}{\text{Shareholders' Equity}} \times 100$
- **ROCE (Return on Capital Employed):** $\frac{\text{EBIT}}{\text{Total Assets} - \text{Current Liabilities}} \times 100$
- **Debt-to-Equity (D/E):** $\frac{\text{Total Debt}}{\text{Total Shareholders' Equity}}$
- **Interest Coverage Ratio:** $\frac{\text{EBIT}}{\text{Finance Costs}}$
- **CFO to Net Profit:** $\frac{\text{Cash Flow from Operations}}{\text{Net Profit after Tax}}$ (Tests earnings quality; $> 1.0$ is high quality).
- **Free Cash Flow (FCF):** $CFO - \text{Capital Expenditures (CapEx)}$
- **P/E (Price-to-Earnings):** $\frac{\text{Current Market Price}}{\text{Diluted TTM EPS}}$
- **P/B (Price-to-Book):** $\frac{\text{Current Market Price}}{\text{Book Value per Share}}$
- **EV/EBITDA:** $\frac{\text{Enterprise Value (Market Cap + Debt - Cash)}}{\text{TTM EBITDA}}$

---

## 4. Multi-Factor Research Scoring Framework

Every stock evaluated in Bharat Market Intelligence receives two transparent sub-scores ($0-100$) and one composite score ($0-100$):

### A. Technical Score ($S_{Tech}$) - Weights
1. **Trend Structure (25%):** Alignment of $EMA_9 > EMA_{20} > SMA_{50} > SMA_{200}$.
2. **Momentum (20%):** $RSI_{14}$ in bullish zone ($55-70$) without extreme overbought status ($>80$).
3. **Relative Strength (15%):** Outperformance vs. NIFTY 50 over 20-day and 60-day windows.
4. **Volume Confirmation (15%):** Time-matched RVOL $> 1.5x$ and delivery percentage $> 40\%$.
5. **Liquidity (15%):** Average daily turnover $> ₹25$ Cr with tight bid-ask spreads.
6. **Risk/Volatility (10%):** ATR expansion within reasonable limits; not overextended from VWAP ($< 1.2x$ ATR).

### B. Fundamental Score ($S_{Fund}$) - Weights
1. **Growth (20%):** 3-year and 5-year Revenue and EPS CAGR $> 12\%$.
2. **Profitability & Returns (25%):** $ROCE > 18\%$ and $ROE > 15\%$ consistently.
3. **Balance Sheet Quality (15%):** $D/E < 0.5$ (or prudent capital adequacy for financial institutions).
4. **Cash Flow Quality (15%):** Positive $CFO$ and $FCF$; $CFO / PAT \ge 0.85$.
5. **Valuation Attractiveness (15%):** Current P/E compared to historical 5-year median and industry peers.
6. **Governance & Pledging (10%):** Zero or decreasing promoter pledge ($< 5\%$); stable promoter shareholding.

### C. Verdict Categorization
- **Research Priority:** $S_{Tech} \ge 75$ AND $S_{Fund} \ge 70$.
- **Watchlist:** $S_{Tech} \ge 65$ OR $S_{Fund} \ge 65$.
- **Developing Setup:** Technical momentum building, pending volume confirmation.
- **Avoid / High Risk:** High debt, deteriorating CFO, negative momentum, or high promoter pledge.
- **Truthful Empty State:** When no stock satisfies strict criteria: *"NO HIGH-QUALITY SETUP FOUND TODAY."*

---

## 5. Indian Transaction Cost Modeling Constants

For backtesting and execution modeling, the following statutory Indian market costs are applied:

| Fee Component | Rate / Rule (Intraday Equity) | Rate / Rule (Delivery Equity) |
| :--- | :--- | :--- |
| **Brokerage** | Flat ₹20 per executed order (or 0.05%, whichever is lower) | Flat ₹20 (or zero for discount broker models) |
| **STT (Securities Transaction Tax)** | 0.025% on Sell value only | 0.1% on Buy and Sell value |
| **Exchange Turnover Fee (NSE)** | 0.00325% | 0.00325% |
| **SEBI Turnover Charges** | ₹10 per Crore (0.0001%) | ₹10 per Crore (0.0001%) |
| **Stamp Duty** | 0.003% on Buy value only | 0.015% on Buy value only |
| **GST (Goods & Services Tax)** | 18% on (Brokerage + Exchange Turnover + SEBI) | 18% on (Brokerage + Exchange Turnover + SEBI) |
| **Estimated Slippage** | 0.03% - 0.05% of trade value (based on liquid Nifty 100) | 0.05% of trade value |

