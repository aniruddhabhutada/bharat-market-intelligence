"use client";

import React, { useState, useEffect, useRef } from "react";

interface ExplainEntry {
  what: string;
  care: string;
  interpret: string;
  limitation: string;
}

const EXPLAIN_DICT: Record<string, ExplainEntry> = {
  "NIFTY 50": {
    what: "NIFTY 50 is an index that tracks the performance of the 50 largest companies listed on the National Stock Exchange (NSE) of India.",
    care: "It is the most widely watched benchmark for the Indian stock market. When NIFTY rises, most large companies are doing well on that day.",
    interpret: "A positive percentage means the index closed higher than the previous day. Changes above 1% in either direction are considered notable.",
    limitation: "NIFTY 50 only represents large companies. It does not capture the performance of thousands of smaller companies or specific sectors.",
  },
  "SENSEX": {
    what: "SENSEX is an index that tracks the 30 largest companies listed on the Bombay Stock Exchange (BSE). It was India's first major stock index.",
    care: "Like NIFTY 50, SENSEX is a benchmark for the overall Indian market.",
    interpret: "When SENSEX rises, it generally means large-cap Indian companies are doing well. A fall means broad selling.",
    limitation: "With only 30 stocks, SENSEX is less representative than NIFTY 50.",
  },
  "RSI": {
    what: "RSI (Relative Strength Index) is a number between 0 and 100 that measures how quickly a stock's price has been moving recently.",
    care: "RSI helps you understand if a stock has moved up or down too fast. Very high RSI may mean the stock is 'overbought'; very low may mean it's 'oversold'.",
    interpret: "Above 70: stock has risen quickly — caution. Below 30: stock has fallen quickly — could be a recovery opportunity. 40–60 is neutral.",
    limitation: "RSI is based only on price, not company fundamentals. A stock can stay overbought or oversold for extended periods.",
  },
  "MACD": {
    what: "MACD (Moving Average Convergence Divergence) shows the relationship between two moving averages of a stock's price.",
    care: "It is used to spot changes in the direction, momentum, and duration of a trend.",
    interpret: "When the MACD line crosses above the signal line, it may signal a buying opportunity. A cross below may signal selling.",
    limitation: "MACD is a lagging indicator — it reacts after the price has already moved. It can generate false signals in choppy markets.",
  },
  "PE Ratio": {
    what: "PE Ratio (Price-to-Earnings) tells you how much you are paying for every ₹1 of annual profit a company earns.",
    care: "It is one of the most basic ways to judge if a stock is cheap or expensive relative to its earnings.",
    interpret: "PE of 15 means you pay ₹15 for ₹1 of profit. India's market average PE is roughly 20–25. Higher PE can mean high growth expectations.",
    limitation: "PE alone doesn't tell the full story. A low PE might mean a struggling business; a high PE might be justified by strong growth.",
  },
  "ROCE": {
    what: "ROCE (Return on Capital Employed) shows how much operating profit a company generates for every ₹100 of capital invested in the business.",
    care: "It measures how efficiently a company uses both its own money and borrowed money to generate profit.",
    interpret: "ROCE above 15% is generally considered healthy. Above 20% is excellent. Compare with the company's cost of borrowing.",
    limitation: "ROCE can be distorted by old, fully-depreciated assets or by seasonal businesses with fluctuating capital needs.",
  },
  "ROE": {
    what: "ROE (Return on Equity) measures how much profit a company generates for every ₹100 of shareholders' money.",
    care: "High ROE generally means management is using shareholder capital efficiently.",
    interpret: "ROE above 15% is typically considered good. Compare across companies in the same sector.",
    limitation: "High debt can artificially inflate ROE. Always look at ROE alongside debt levels.",
  },
  "EPS": {
    what: "EPS (Earnings Per Share) is the portion of a company's profit allocated to each outstanding share of stock.",
    care: "Rising EPS over time generally means the company is growing its profits, which often leads to a rising stock price.",
    interpret: "Compare EPS growth year-over-year. Consistent EPS growth of 15–20%+ is a positive sign.",
    limitation: "Companies can boost EPS by buying back shares without actually growing profits. Always check the source of EPS growth.",
  },
  "FII": {
    what: "FII (Foreign Institutional Investors) are large overseas funds — mutual funds, pension funds, insurance companies — that invest in Indian stocks.",
    care: "FII flows significantly influence the Indian market. Heavy FII buying pushes markets up; heavy selling pulls them down.",
    interpret: "Net FII buying is a positive signal for the market in the short term. Sustained selling can pressure indices.",
    limitation: "FII moves are driven by global factors (US Fed policy, dollar strength) that may have nothing to do with India's fundamentals.",
  },
  "DII": {
    what: "DII (Domestic Institutional Investors) are large Indian funds — mutual funds, insurance companies, banks — that invest in Indian stocks.",
    care: "DIIs often act as a counterbalance to FIIs. When FIIs sell, DIIs may buy, stabilizing the market.",
    interpret: "Net DII buying during FII selloffs is a positive sign for market stability.",
    limitation: "DII flows are partly driven by retail investors' SIP contributions and may not reflect pure institutional conviction.",
  },
  "Market Cap": {
    what: "Market Cap (Market Capitalisation) is the total value of all shares of a company in the stock market.",
    care: "It tells you the size of the company as valued by the market. Large-cap companies are generally more stable; small-caps can grow faster.",
    interpret: "In India: Large-cap > ₹20,000 Cr. Mid-cap: ₹5,000–20,000 Cr. Small-cap < ₹5,000 Cr.",
    limitation: "Market cap reflects what investors are willing to pay today, not the company's actual asset value or future earnings.",
  },
  "Dividend Yield": {
    what: "Dividend Yield is the percentage of the stock price that a company pays out as dividends each year.",
    care: "Dividends provide regular income. High dividend yield stocks are attractive to income investors.",
    interpret: "A yield of 2–4% is considered decent for Indian stocks. Very high yields (>6%) might signal a falling stock price, not generosity.",
    limitation: "Companies can cut dividends if profits fall. Past dividends don't guarantee future dividends.",
  },
  "Debt/Equity": {
    what: "Debt/Equity ratio compares how much a company has borrowed vs. how much shareholders have invested.",
    care: "High debt means the company pays interest regardless of profits — risky in downturns.",
    interpret: "Below 0.5 is low risk. 0.5–1.5 is moderate. Above 2 is high — the company borrows more than twice its equity.",
    limitation: "Some industries (banking, real estate) naturally operate with higher debt. Compare within the same sector.",
  },
  "Volume": {
    what: "Volume is the number of shares traded in a stock during a given day or period.",
    care: "High volume alongside a price move confirms the move has strong participation. Low-volume price moves may be less reliable.",
    interpret: "Above-average volume on an up day is bullish confirmation. High volume on a down day is bearish confirmation.",
    limitation: "Volume alone doesn't tell you direction — you must combine it with price action.",
  },
  "Moving Average": {
    what: "A Moving Average (MA) smooths out price data by calculating the average price over a set number of days (e.g., 20-day, 50-day, 200-day).",
    care: "MAs help identify the direction of a trend and potential support/resistance levels.",
    interpret: "Price above its 50-day MA is generally considered in an uptrend. A 'golden cross' (50-day crossing above 200-day) is a bullish signal.",
    limitation: "MAs are lagging indicators — they react after the price has moved. They work poorly in sideways/choppy markets.",
  },
  "Support": {
    what: "Support is a price level where a stock has historically stopped falling and bounced back up.",
    care: "Support levels help traders decide where to buy, set stop-losses, or look for reversal opportunities.",
    interpret: "If the price approaches a known support level and holds, it may be a buying opportunity. A break below support is bearish.",
    limitation: "Support levels are based on past price data and can break unexpectedly, especially during major news events.",
  },
  "Resistance": {
    what: "Resistance is a price level where a stock has historically stopped rising and pulled back.",
    care: "Resistance helps identify potential selling zones and price targets.",
    interpret: "If a stock breaks above resistance on high volume, it may continue higher. Failing at resistance repeatedly is a bearish sign.",
    limitation: "Like support, resistance levels can be broken. They work best when confirmed by multiple touches.",
  },
};

interface ExplainThisProps {
  term: string;
  children?: React.ReactNode;
}

export const ExplainThis: React.FC<ExplainThisProps> = ({ term, children }) => {
  const [open, setOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const entry = EXPLAIN_DICT[term];

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label={`Explain ${term}`}
        className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-[10px] font-bold hover:bg-blue-200 transition ml-1 shrink-0 border border-blue-200"
        type="button"
      >
        ?
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true">
          <div
            ref={modalRef}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-5 space-y-4 max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900">{children || term}</h2>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xl leading-none"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {entry ? (
              <div className="space-y-3 text-sm">
                <div className="bg-blue-50 rounded-xl p-3">
                  <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">📖 What does it mean?</p>
                  <p className="text-gray-700">{entry.what}</p>
                </div>
                <div className="bg-green-50 rounded-xl p-3">
                  <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1">💡 Why should you care?</p>
                  <p className="text-gray-700">{entry.care}</p>
                </div>
                <div className="bg-amber-50 rounded-xl p-3">
                  <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1">📊 How to interpret it?</p>
                  <p className="text-gray-700">{entry.interpret}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">⚠️ What it does NOT tell us</p>
                  <p className="text-gray-600">{entry.limitation}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-600">No explanation available for "{term}" yet.</p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ExplainThis;
