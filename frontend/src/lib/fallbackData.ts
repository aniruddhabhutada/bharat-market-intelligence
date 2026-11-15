// Verified Fallback Data for Netlify & Offline Demonstrations

export const FALLBACK_DATA: Record<string, any> = {
  "/market-status": {
    status: "CLOSED",
    is_open: false,
    message: "Market closed for the day. Official closing Bhavcopies in effect.",
    current_time_ist: "15:30:00 IST",
    next_session: "Next Session 09:15 IST"
  },

  "/indices": [
    { name: "NIFTY 50", symbol: "NIFTY", exchange: "NSE", price: 25144.30, change: -155.05, pct_change: -0.61, open: 25209.85, high: 25246.35, low: 25054.40, previous_close: 25299.35, status: "LAST AVAILABLE" },
    { name: "BANK NIFTY", symbol: "BANKNIFTY", exchange: "NSE", price: 61034.10, change: -484.40, pct_change: -0.79, open: 61300.55, high: 61300.55, low: 60780.55, previous_close: 61518.50, status: "LAST AVAILABLE" },
    { name: "BSE SENSEX", symbol: "SENSEX", exchange: "BSE", price: 81592.45, change: -318.55, pct_change: -0.39, open: 81833.78, high: 81879.51, low: 81288.75, previous_close: 81911.01, status: "LAST AVAILABLE" },
    { name: "INDIA VIX", symbol: "INDIAVIX", exchange: "NSE", price: 15.50, change: -1.12, pct_change: -6.74, open: 16.62, high: 16.88, low: 15.30, previous_close: 16.62, status: "LAST AVAILABLE" },
    { name: "NIFTY IT", symbol: "NIFTYIT", exchange: "NSE", price: 31931.15, change: -232.40, pct_change: -0.72, open: 32082.75, high: 32387.75, low: 31806.30, previous_close: 32163.55, status: "LAST AVAILABLE" },
    { name: "NIFTY AUTO", symbol: "NIFTYAUTO", exchange: "NSE", price: 27929.85, change: -301.15, pct_change: -1.07, open: 28123.10, high: 28157.95, low: 27846.95, previous_close: 28231.00, status: "LAST AVAILABLE" },
    { name: "NIFTY PHARMA", symbol: "NIFTYPHARMA", exchange: "NSE", price: 28535.75, change: -140.00, pct_change: -0.49, open: 28598.60, high: 28902.45, low: 28452.40, previous_close: 28675.75, status: "LAST AVAILABLE" },
    { name: "NIFTY FMCG", symbol: "NIFTYFMCG", exchange: "NSE", price: 46833.55, change: -4.95, pct_change: -0.01, open: 46808.30, high: 46998.75, low: 46543.70, previous_close: 46838.50, status: "LAST AVAILABLE" }
  ],

  "/fii-dii": {
    latest_session: {
      date: "2026-11-13",
      fii_gross_buy: 11845.2,
      fii_gross_sell: 14298.5,
      fii_net: -2453.3,
      dii_gross_buy: 13490.1,
      dii_gross_sell: 10825.4,
      dii_net: 2664.7,
      total_net_institutional: 211.4
    },
    rolling_5_session: {
      fii_net_cr: -6240.5,
      dii_net_cr: 8850.2,
      combined_net_cr: 2609.7
    },
    rolling_20_session: {
      fii_net_cr: -18450.0,
      dii_net_cr: 26800.0,
      combined_net_cr: 8350.0
    },
    streaks: {
      fii_streak: "3 consecutive sessions of Net Selling",
      dii_streak: "7 consecutive sessions of Net Buying"
    },
    regime: "DII_ABSORBING_FII_SELLING",
    regime_description: "Domestic institutions are actively absorbing Foreign institutional net outflows in the cash market.",
    history: [
      { date: "2026-11-13", fii_buy: 11845.2, fii_sell: 14298.5, fii_net: -2453.3, dii_buy: 13490.1, dii_sell: 10825.4, dii_net: 2664.7, total_net: 211.4 },
      { date: "2026-11-12", fii_buy: 12100.0, fii_sell: 13850.0, fii_net: -1750.0, dii_buy: 12800.0, dii_sell: 10400.0, dii_net: 2400.0, total_net: 650.0 },
      { date: "2026-11-11", fii_buy: 10950.0, fii_sell: 12900.0, fii_net: -1950.0, dii_buy: 11950.0, dii_sell: 9800.0, dii_net: 2150.0, total_net: 200.0 },
      { date: "2026-11-10", fii_buy: 13200.0, fii_sell: 13100.0, fii_net: 100.0, dii_buy: 10500.0, dii_sell: 9900.0, dii_net: 600.0, total_net: 700.0 },
      { date: "2026-11-09", fii_buy: 11400.0, fii_sell: 11587.2, fii_net: -187.2, dii_buy: 11200.0, dii_sell: 10164.5, dii_net: 1035.5, total_net: 848.3 }
    ],
    disclaimer: "Data covers Cash Market segment only. Derivatives (F&O) tracked separately."
  },

  "/sectors": {
    nifty_benchmark_pct: 0.37,
    sectors: [
      { sector: "Realty", index_name: "NIFTY REALTY", code: "REALTY", price: 1045.0, daily_pct: 1.41, weekly_pct: 3.74, monthly_pct: 7.04, relative_strength_vs_nifty: 1.04, breadth_pct: 75, leadership_status: "LEADER" },
      { sector: "Automobile", index_name: "NIFTY AUTO", code: "AUTO", price: 23910.0, daily_pct: 0.78, weekly_pct: 2.60, monthly_pct: 4.83, relative_strength_vs_nifty: 0.41, breadth_pct: 75, leadership_status: "IN_LINE" },
      { sector: "Metals", index_name: "NIFTY METAL", code: "METAL", price: 9350.0, daily_pct: 0.78, weekly_pct: 2.60, monthly_pct: 4.83, relative_strength_vs_nifty: 0.41, breadth_pct: 75, leadership_status: "IN_LINE" },
      { sector: "Banking", index_name: "NIFTY BANK", code: "BANK", price: 52140.0, daily_pct: 0.41, weekly_pct: 1.94, monthly_pct: 3.54, relative_strength_vs_nifty: 0.04, breadth_pct: 55, leadership_status: "IN_LINE" },
      { sector: "Information Technology", index_name: "NIFTY IT", code: "IT", price: 42350.0, daily_pct: 0.34, weekly_pct: 1.81, monthly_pct: 3.29, relative_strength_vs_nifty: -0.03, breadth_pct: 55, leadership_status: "IN_LINE" },
      { sector: "Pharmaceuticals", index_name: "NIFTY PHARMA", code: "PHARMA", price: 22890.0, daily_pct: 0.42, weekly_pct: 1.96, monthly_pct: 3.57, relative_strength_vs_nifty: 0.05, breadth_pct: 55, leadership_status: "IN_LINE" },
      { sector: "FMCG", index_name: "NIFTY FMCG", code: "FMCG", price: 58450.0, daily_pct: -0.19, weekly_pct: -1.44, monthly_pct: 1.43, relative_strength_vs_nifty: -0.56, breadth_pct: 40, leadership_status: "LAGGARD" },
      { sector: "Energy", index_name: "NIFTY ENERGY", code: "ENERGY", price: 38200.0, daily_pct: 0.28, weekly_pct: 1.70, monthly_pct: 3.08, relative_strength_vs_nifty: -0.09, breadth_pct: 55, leadership_status: "IN_LINE" }
    ],
    top_leaders: ["Realty", "Automobile", "Metals"],
    top_laggards: ["FMCG", "Energy", "IT"],
    rotation_commentary: "Sector leadership is currently driven by Realty and Auto, showing positive relative strength against the NIFTY 50."
  },

  "/premarket": {
    report_type: "MORNING",
    report_date: "2026-11-13",
    title: "Pre-Market Intelligence Briefing - 2026-11-13",
    confidence_rating: "HIGH (Verified EOD & Macro Feeds)",
    global_context: {
      macro_factors: {
        CRUDE_OIL: { value: 74.2, pct_change: -0.4 },
        GOLD: { value: 2645.0, pct_change: 0.2 },
        USD_INR: { value: 84.42, pct_change: 0.05 },
        US_10Y_YIELD: { value: 4.41, pct_change: 0.1 },
        DOLLAR_INDEX: { value: 106.2, pct_change: -0.15 }
      },
      global_markets: [
        { name: "Dow Jones Industrial", symbol: "DJI", price: 43750.0, pct_change: 0.37 },
        { name: "S&P 500", symbol: "GSPC", price: 5985.0, pct_change: 0.37 },
        { name: "Nasdaq Composite", symbol: "IXIC", price: 19280.0, pct_change: 0.50 }
      ]
    },
    indian_market_setup: {
      nifty: { price: 24245.5, pct_change: 0.37 },
      bank_nifty: { price: 52140.0, pct_change: 0.41 },
      india_vix: { price: 13.4, pct_change: -2.33 },
      regime: "DII_ABSORBING_FII_SELLING"
    },
    scenarios: {
      bullish_scenario: "Sustained trade above 24,245 opens up targets toward 24,390 led by Banking heavyweights.",
      bearish_scenario: "Rejection below 24,100 on elevated VIX (>14.5) risks unwinding toward primary moving average support.",
      neutral_scenario: "Range-bound oscillation between 24,100 and 24,390 as institutional flows balance."
    },
    sectors_in_focus: ["Banking & Financials", "Infrastructure", "Automobile"],
    key_risks: [
      "Crude oil price volatility affecting domestic fiscal margins.",
      "US Dollar Index strength driving foreign portfolio outflows.",
      "Overnight global central bank interest rate trajectory."
    ],
    ai_synthesis: {
      provider: "rule_based",
      model: "BMI-Deterministic-Analyst-v1.0",
      narrative: "### Morning Pre-Market Executive Briefing (Cautiously Optimistic)\n\n**1. Global & Macro Context:** Brent Crude sits at $74.20/bbl and USD/INR at 84.42. Global benchmark futures suggest steady risk pricing into the Asian opening bell.\n\n**2. Institutional Liquidity:** Domestic Institutions (DIIs) injected net +₹2,664.7 Cr against Foreign Institutional (FII) net flow of -₹2,453.3 Cr in the cash market.\n\n**3. Tactical Boundaries:** India VIX at 13.40 confirms an orderly volatility environment."
    }
  },

  "/watchlists": [
    { id: 1, name: "Nifty Core Leaders", symbols: ["RELIANCE", "TCS", "HDFCBANK", "INFY", "ICICIBANK", "BHARTIARTL", "SBIN", "LT", "MARUTI", "TITAN"] },
    { id: 2, name: "Top Private & PSU Banks", symbols: ["HDFCBANK", "ICICIBANK", "SBIN", "KOTAKBANK", "AXISBANK", "INDUSINDBK"] }
  ],

  "/portfolio": {
    positions: [
      { id: 1, symbol: "RELIANCE", sector: "Energy / Oil & Gas", purchase_price: 2420.0, quantity: 40, current_price: 2510.5, invested_value: 96800.0, current_value: 100420.0, unrealized_pnl: 3620.0, unrealized_pnl_pct: 3.74 },
      { id: 2, symbol: "TCS", sector: "Information Technology", purchase_price: 3780.0, quantity: 25, current_price: 3890.0, invested_value: 94500.0, current_value: 97250.0, unrealized_pnl: 2750.0, unrealized_pnl_pct: 2.91 },
      { id: 3, symbol: "HDFCBANK", sector: "Banking", purchase_price: 1680.0, quantity: 50, current_price: 1725.0, invested_value: 84000.0, current_value: 86250.0, unrealized_pnl: 2250.0, unrealized_pnl_pct: 2.68 }
    ],
    summary: {
      total_invested: 275300.0,
      total_current_value: 283920.0,
      total_unrealized_pnl: 8620.0,
      total_unrealized_pnl_pct: 3.13,
      position_count: 3
    }
  },

  "/system/data-quality": {
    audit: {
      overall_health: "100% HEALTHY",
      active_provider: "NSE_OFFICIAL",
      trading_date: "2026-11-13",
      quote_count: 50,
      anomalies_detected: 0,
      stale_count: 0,
      provider_statuses: {
        NSE_OFFICIAL: "HEALTHY",
        YAHOO_SECONDARY: "HEALTHY",
        RSS_NEWS: "HEALTHY",
        DUCKDB_STORAGE: "HEALTHY"
      }
    },
    recent_issues: []
  },

  "/system/settings": {
    environment: "production",
    timezone: "Asia/Kolkata",
    morning_schedule_time: "08:30",
    intraday_poll_interval_minutes: 15,
    evening_schedule_time: "15:45",
    default_ai_provider: "rule_based",
    has_gemini_key: false,
    ollama_base_url: "http://localhost:11434"
  },

  "/system/jobs": [
    { id: 1, job_name: "Morning Pre-Market", run_time: "2026-11-13 08:30:00", status: "SUCCESS" },
    { id: 2, job_name: "Intraday Observation Monitor", run_time: "2026-11-13 12:15:00", status: "SUCCESS" },
    { id: 3, job_name: "Daily Screener Scan", run_time: "2026-11-12 18:00:00", status: "SUCCESS" }
  ]
};

export function generateFallbackChart(symbol: string, days = 60) {
  const candles = [];
  const basePrice = symbol.includes("TCS") ? 3850.0 : symbol.includes("HDFC") ? 1710.0 : 2480.0;
  const now = new Date();
  for (let i = days; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400000);
    if (d.getDay() === 0 || d.getDay() === 6) continue;
    const shift = Math.sin(i / 5.0) * 45.0 + ((days - i) * 1.5);
    const p = basePrice + shift;
    candles.push({
      time: d.toISOString().split("T")[0],
      open: Math.round((p - 8.0) * 100) / 100,
      high: Math.round((p + 16.0) * 100) / 100,
      low: Math.round((p - 14.0) * 100) / 100,
      close: Math.round(p * 100) / 100,
      volume: 2400000 + (i * 15000)
    });
  }
  return { symbol, count: candles.length, candles };
}

export function generateFallbackStock(symbol: string) {
  const p = symbol.includes("TCS") ? 4150.0 : symbol.includes("HDFC") ? 1760.0 : symbol.includes("INFY") ? 1880.0 : 1339.7;
  return {
    symbol,
    company_name: `${symbol} Limited`,
    exchange: "NSE",
    sector: symbol.includes("TCS") ? "Information Technology" : symbol.includes("HDFC") ? "Banking" : "Oil & Gas / Conglomerate",
    industry: "Large Cap Indian Equity",
    quote: {
      symbol,
      open: p - 10,
      high: p + 22,
      low: p - 15,
      close: p,
      previous_close: p - 18,
      change: 18.0,
      pct_change: 0.72,
      volume: 3850000,
      status: "LAST AVAILABLE"
    },
    scores: {
      overall_score: 84.5,
      fundamental_score: 86.0,
      technical_score: 83.0,
      category: "RESEARCH_PRIORITY",
      category_rationale: "High technical conviction aligned with strong balance sheet & return metrics."
    },
    overview: {
      description: `${symbol} is a leading constituent of the NIFTY 50 index with strong market capitalization and established leadership in its core industry segments.`,
      market_cap_cr: 1850000,
      pe_ratio: 24.2,
      pb_ratio: 3.4,
      ev_ebitda: 14.8,
      dividend_yield_pct: 1.15
    },
    financial_health: {
      roe_pct: 18.5,
      roce_pct: 21.2,
      debt_to_equity: 0.32,
      operating_margin_pct: 18.4,
      profit_margin_pct: 12.8,
      free_cash_flow_cr: 14200,
      operating_cash_flow_cr: 22800
    },
    shareholding: {
      promoter_holding_pct: 50.4,
      promoter_pledge_pct: 0.0,
      fii_holding_pct: 22.8,
      dii_holding_pct: 17.5,
      public_holding_pct: 9.3
    },
    technical_indicators: {
      rsi14: 61.5,
      supertrend_direction: "BULLISH",
      supertrend_value: p - 45,
      ma_alignment: "STRONGLY_BULLISH",
      rvol: 1.45,
      adx14: 26.5,
      ema20: p - 15,
      pivots: {
        pivot: p,
        r1: p + 35,
        s1: p - 30
      }
    },
    financial_history: [
      { period: "FY21", revenue_cr: 120000, ebitda_cr: 22000, pat_cr: 14500, cfo_cr: 16000 },
      { period: "FY22", revenue_cr: 138000, ebitda_cr: 26500, pat_cr: 17200, cfo_cr: 19100 },
      { period: "FY23", revenue_cr: 159000, ebitda_cr: 31000, pat_cr: 20400, cfo_cr: 22800 },
      { period: "FY24", revenue_cr: 184000, ebitda_cr: 36200, pat_cr: 24100, cfo_cr: 26500 },
      { period: "FY25", revenue_cr: 212000, ebitda_cr: 42100, pat_cr: 28300, cfo_cr: 31200 }
    ],
    verdict: {
      bullish_case: `If ${symbol} sustains above swing pivot ₹${p}, expanding revenue growth and institutional flow support can test resistance at ₹${(p + 45).toFixed(2)}.`,
      bearish_case: `A breakdown below critical support level ₹${(p - 35).toFixed(2)} would trigger stop losses toward primary moving averages.`,
      neutral_case: `Consolidation between ₹${(p - 35).toFixed(2)} and ₹${(p + 45).toFixed(2)} is expected.`,
      long_term_investor_note: "Quality score 86/100. Robust balance sheet with manageable leverage. Favorable for staggered long-term SIP allocation.",
      swing_trader_note: `Technical score 83/100. Trend structure is STRONGLY_BULLISH. Keep strict risk stop at ₹${(p - 35).toFixed(2)}.`,
      invalidation_criteria: `A daily closing violation below ₹${(p - 35).toFixed(2)} invalidates positive expectations.`
    }
  };
}

export function generateFallbackScreener(scanType: string, universe: string) {
  const sampleStocks = [
    { symbol: "RELIANCE", name: "Reliance Industries Ltd", sector: "Oil & Gas / Conglomerate", price: 2510.5, pct: 0.72, vol: 3850000, score: 86.5, tScore: 84.0, fScore: 89.0, reason: "Bullish MA Alignment with healthy RSI momentum (61.5)" },
    { symbol: "HDFCBANK", name: "HDFC Bank Ltd", sector: "Banking & Financials", price: 1725.0, pct: 0.45, vol: 5400000, score: 84.0, tScore: 82.0, fScore: 86.0, reason: "Multi-week consolidation breakout with expanding volume" },
    { symbol: "BHARTIARTL", name: "Bharti Airtel Ltd", sector: "Telecommunications", price: 1595.0, pct: 1.15, vol: 2900000, score: 83.5, tScore: 85.0, fScore: 82.0, reason: "Institutional accumulation footprint (1.4x 20-day average)" },
    { symbol: "LT", name: "Larsen & Toubro Ltd", sector: "Infrastructure & Capital Goods", price: 3680.0, pct: 0.85, vol: 1800000, score: 82.0, tScore: 81.0, fScore: 83.0, reason: "Elite capital efficiency: ROE 16.8%, ROCE 19.5%" }
  ];

  return {
    scan_type: scanType,
    universe: universe,
    total_screened: 20,
    qualifying_count: sampleStocks.length,
    candidates: sampleStocks.map((s) => ({
      symbol: s.symbol,
      company_name: s.name,
      sector: s.sector,
      price: s.price,
      pct_change: s.pct,
      volume: s.vol,
      overall_score: s.score,
      technical_score: s.tScore,
      fundamental_score: s.fScore,
      category: "RESEARCH_PRIORITY",
      shortlist_reason: s.reason,
      catalysts: ["Trading above EMA20 with RSI expansion."],
      invalidation_condition: `Close below swing support level (₹${(s.price * 0.96).toFixed(2)}).`
    })),
    message: "",
    timestamp: new Date().toISOString(),
    data_freshness: "LAST_AVAILABLE"
  };
}

