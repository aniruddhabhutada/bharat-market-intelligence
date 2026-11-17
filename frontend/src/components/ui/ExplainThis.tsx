"use client";

import React, { useState, useEffect, useRef } from "react";
import { BookOpen, Lightbulb, BarChart3, AlertTriangle, CircleHelp, X } from "lucide-react";

interface ExplainEntry {
  what: string;
  care: string;
  interpret: string;
  limitation: string;
}

const EXPLAIN_DICT: Record<string, ExplainEntry> = {
  "NIFTY 50": {
    what: "NIFTY 50 is an index tracking the 50 largest and most actively traded companies listed on the National Stock Exchange of India (NSE).",
    care: "It acts as the primary barometer of the Indian economy. When NIFTY rises, the broad equity market is generally performing well.",
    interpret: "A positive daily percentage indicates index gain compared to previous close. A move exceeding 1% in either direction represents high volatility.",
    limitation: "NIFTY 50 represents only top blue-chip firms. It does not measure the health of thousands of mid-cap and small-cap enterprises.",
  },
  "SENSEX": {
    what: "SENSEX is an index tracking 30 financially sound, established companies listed on the Bombay Stock Exchange (BSE).",
    care: "It is India's oldest stock market benchmark, closely watched by domestic and global institutional investors.",
    interpret: "Rising SENSEX reflects strong large-cap sentiment. A decline signals institutional or broad-market selling pressure.",
    limitation: "Tracking only 30 stocks means it has a narrower sector diversification compared to broader indices like NIFTY 500.",
  },
  "BANK NIFTY": {
    what: "BANK NIFTY is a sectoral index tracking the 12 most liquid and capitalized Indian banking stocks from both private and PSU sectors.",
    care: "Banking is the financial backbone of India. Movements in BANK NIFTY heavily dictate the trajectory of the broader NIFTY 50.",
    interpret: "Credit expansion, RBI repo rate announcements, and corporate NPA cycles directly move this index.",
    limitation: "High sensitivity to interest rate cycles makes it significantly more volatile than broad diversified market indices.",
  },
  "INDIA VIX": {
    what: "INDIA VIX measures the market's expectation of 30-day forward volatility computed from NIFTY options order book prices.",
    care: "Commonly referred to as the 'Fear Gauge'. High readings indicate high expected price swings and investor anxiety.",
    interpret: "Readings below 13 denote a calm, trending market. Readings above 18 denote heightened volatility and elevated downside risk.",
    limitation: "VIX measures expected price dispersion, not market direction. The market can rally or decline during high VIX environments.",
  },
  "RSI": {
    what: "Relative Strength Index (RSI) is an oscillator measuring the speed and magnitude of recent price changes on a scale of 0 to 100.",
    care: "Helps identify whether a stock has moved upwards or downwards too rapidly over the lookback period (typically 14 periods).",
    interpret: "Readings above 70 indicate strong upward momentum with overbought risk. Readings below 30 denote oversold territory. 40 to 60 is neutral.",
    limitation: "During strong structural trends, stocks can remain persistently overbought or oversold without reversing. Fundamental context is required.",
  },
  "MACD": {
    what: "Moving Average Convergence Divergence (MACD) demonstrates the relationship between two exponential moving averages of a security's price.",
    care: "Used by technical analysts to identify turning points in directional momentum and assess trend acceleration.",
    interpret: "A MACD line crossing above its 9-day signal line denotes bullish momentum. A crossover below indicates weakening momentum.",
    limitation: "MACD is inherently lagging because it is derived from historical prices. It produces frequent false whipsaws in sideways consolidations.",
  },
  "VWAP": {
    what: "Volume Weighted Average Price (VWAP) is the true average price a stock has traded at throughout the day, weighted by trading volume.",
    care: "Institutional desks use VWAP to evaluate trade execution efficiency and establish intraday fair value benchmarks.",
    interpret: "Trading above VWAP reflects intraday buyer dominance. Trading below VWAP indicates intraday institutional selling pressure.",
    limitation: "VWAP is strictly an intraday measure and resets at the market open each trading morning.",
  },
  "PE Ratio": {
    what: "Price-to-Earnings (P/E) ratio compares a company's current share price to its annual earnings per share (EPS).",
    care: "A core valuation metric showing how many rupees investors are willing to pay today for every one rupee of corporate net profit.",
    interpret: "A lower P/E relative to industry peers may indicate undervaluation. A higher P/E implies premium expectations of future earnings expansion.",
    limitation: "P/E fails for cyclical companies at peak earnings and cannot be calculated for loss-making enterprises.",
  },
  "ROCE": {
    what: "Return on Capital Employed (ROCE) measures how efficiently a company generates operating profit from total capital (equity plus debt).",
    care: "Reveals management's capital allocation skill regardless of financial leverage or capital structure choices.",
    interpret: "A sustained ROCE exceeding 15% demonstrates competitive moat. Above 20% indicates superior capital compounding ability.",
    limitation: "Capital-intensive businesses with older, depreciated assets can display artificially inflated ROCE ratios.",
  },
  "ROE": {
    what: "Return on Equity (ROE) measures how much net profit a company generates for each rupee of shareholder equity.",
    care: "Directly illustrates the compounding efficiency of equity shareholder funds over multi-year business cycles.",
    interpret: "An ROE consistently above 15% is considered healthy across Indian non-financial corporations.",
    limitation: "Excessive corporate debt artificially inflates ROE. Always examine Debt-to-Equity alongside ROE.",
  },
  "EPS": {
    what: "Earnings Per Share (EPS) represents the net profit of a company divided by its total outstanding common shares.",
    care: "The primary driver of stock prices over long horizons. Rising EPS is the fundamental prerequisite for sustainable share appreciation.",
    interpret: "Look for steady 12% to 20%+ annual EPS expansion over 3 to 5 rolling fiscal years.",
    limitation: "Accounting adjustments, exceptional one-off gains, or aggressive buybacks can temporarily distort headline EPS figures.",
  },
  "FII": {
    what: "Foreign Institutional Investors (FII) are foreign mutual funds, sovereign wealth funds, and hedge funds allocating capital to Indian equities.",
    care: "FIIs command large capital pools. Their sustained buying or liquidation cycles create major multi-month market trends.",
    interpret: "Net monthly FII accumulation supports index valuation; persistent FII outflows create headwinds for large-cap equities.",
    limitation: "FII decisions are often dictated by US Federal Reserve rate cycles and global risk sentiment rather than Indian corporate health.",
  },
  "DII": {
    what: "Domestic Institutional Investors (DII) are Indian mutual funds, insurance companies, banks, and pension managers.",
    care: "Supported by structural monthly retail SIP inflows, DIIs provide persistent domestic liquidity and stabilize market corrections.",
    interpret: "Strong DII buying during foreign institutional selloffs indicates domestic institutional conviction and resilient liquidity support.",
    limitation: "DII inflows are partly driven by mandatory retail retirement savings and may continue even during valuation extremes.",
  },
  "Market Cap": {
    what: "Market Capitalisation is the total market value of a company's outstanding shares (Share Price × Total Shares).",
    care: "Categorises company size and risk profile. Indian benchmarks: Large-Cap (>₹20,000 Cr), Mid-Cap (₹5,000–₹20,000 Cr), Small-Cap (<₹5,000 Cr).",
    interpret: "Large-caps offer balance sheet resilience and lower volatility. Small-caps offer higher potential growth alongside elevated downside risk.",
    limitation: "Market cap fluctuates daily with stock prices and does not equal the tangible liquidation value of corporate assets.",
  },
  "Debt/Equity": {
    what: "Debt-to-Equity ratio compares total interest-bearing corporate liabilities to total shareholders' equity.",
    care: "Measures solvency risk. Heavily indebted companies must service fixed debt interest obligations regardless of operational revenue downturns.",
    interpret: "Ratios under 0.5 denote conservative, low-risk capital structures. Above 1.5 warrants scrutiny, particularly during high interest rate regimes.",
    limitation: "Capital-intensive sectors such as commercial banking, power utilities, and real estate naturally operate with elevated leverage.",
  },
  "Free Cash Flow": {
    what: "Free Cash Flow (FCF) is the actual cash left over after paying for day-to-day operating expenses and necessary capital investments.",
    care: "Unlike reported accounting profits, cash cannot be fabricated. FCF is used for dividends, debt repayment, and acquisitions.",
    interpret: "Consistent positive and expanding FCF confirms corporate earnings quality and operational self-sufficiency.",
    limitation: "Companies undergoing aggressive multi-year factory construction or expansion can show temporarily depressed or negative FCF.",
  },
  "Volume": {
    what: "Volume represents the total number of shares traded on the exchange during a specific time interval or trading day.",
    care: "Validates the institutional conviction behind a price movement. Price breakouts accompanied by high volume have greater follow-through.",
    interpret: "Volume significantly exceeding the 20-day average confirms strong accumulation or institutional distribution.",
    limitation: "High volume during sudden news releases can result from algorithmic churning rather than strategic long-term accumulation.",
  },
  "Moving Average": {
    what: "A Moving Average smooths price series by computing average prices over rolling intervals (e.g., 20-day, 50-day, 200-day).",
    care: "Helps investors filter out daily noise and objectively identify prevailing medium-to-long term trends.",
    interpret: "Price trading above the upward-sloping 50-day and 200-day moving averages confirms an established structural bull market.",
    limitation: "Moving averages lag live price developments and generate delayed signals during whipsaw consolidations.",
  },
  "Support": {
    what: "Support is a technical price level where buying interest has historically emerged to halt further downward price movement.",
    care: "Assists traders and investors in defining low-risk entry zones and placing structured stop-loss orders.",
    interpret: "If a stock tests a key support level and forms bullish reversal candlestick patterns, risk-to-reward for entry is favorable.",
    limitation: "Support levels are historical observations. Unexpected negative earnings or macro catalysts can cause immediate support failure.",
  },
  "Resistance": {
    what: "Resistance is a technical price level where selling pressure has historically overwhelmed buying volume, capping further advances.",
    care: "Marks logical profit-taking objectives and areas where overhead supply from trapped sellers is concentrated.",
    interpret: "A decisive breakout above resistance on expanding volume signals that buyers are willing to absorb supply at higher valuations.",
    limitation: "Resistance zones can be breached during strong momentum rallies. Combining with volume and RSI prevents premature exits.",
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
        className="inline-flex items-center justify-center p-0.5 rounded-full text-[#667085] hover:text-[#315EFB] dark:text-[#97A3B6] dark:hover:text-[#4D74FB] transition ml-1 shrink-0 active:scale-95"
        type="button"
        title={`What is ${term}? Click for plain-English explanation`}
      >
        <CircleHelp className="h-3.5 w-3.5" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
        >
          <div
            ref={modalRef}
            className="bg-white dark:bg-[#131C2E] border border-[#E5EAF2] dark:border-[#1F2E47] rounded-2xl shadow-xl max-w-lg w-full p-5 space-y-4 max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-[#E5EAF2] dark:border-[#1F2E47] pb-3">
              <div className="flex items-center space-x-2">
                <div className="h-7 w-7 rounded-lg bg-[#EEF3FC] dark:bg-[#1A2844] text-[#315EFB] dark:text-[#4D74FB] flex items-center justify-center">
                  <BookOpen className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#172B4D] dark:text-[#F4F6FB] tracking-tight">
                    {children || term}
                  </h3>
                  <span className="text-[11px] text-[#667085] dark:text-[#97A3B6]">
                    Plain-English Financial Terminology Guide
                  </span>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded-lg text-[#667085] hover:text-[#172B4D] dark:hover:text-[#F4F6FB] transition"
                aria-label="Close explanation"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {entry ? (
              <div className="space-y-3 text-xs leading-relaxed">
                {/* 1. What it means */}
                <div className="bg-[#F5F7FB] dark:bg-[#1A2844]/60 border border-[#E5EAF2] dark:border-[#1F2E47] rounded-xl p-3.5">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-[#315EFB] dark:text-[#4D74FB] uppercase tracking-wider mb-1">
                    <BookOpen className="h-3.5 w-3.5" />
                    <span>What does it mean?</span>
                  </div>
                  <p className="text-[#172B4D] dark:text-[#F4F6FB]">{entry.what}</p>
                </div>

                {/* 2. Why it matters */}
                <div className="bg-[#E8F7F3] dark:bg-[#14866D]/10 border border-[#B3E3D7] dark:border-[#14866D]/30 rounded-xl p-3.5">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-[#14866D] uppercase tracking-wider mb-1">
                    <Lightbulb className="h-3.5 w-3.5" />
                    <span>Why should you care?</span>
                  </div>
                  <p className="text-[#172B4D] dark:text-[#F4F6FB]">{entry.care}</p>
                </div>

                {/* 3. How to interpret it */}
                <div className="bg-[#FFF9EB] dark:bg-[#B45309]/10 border border-[#FEE8A2] dark:border-[#B45309]/30 rounded-xl p-3.5">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-[#B45309] uppercase tracking-wider mb-1">
                    <BarChart3 className="h-3.5 w-3.5" />
                    <span>How to interpret it?</span>
                  </div>
                  <p className="text-[#172B4D] dark:text-[#F4F6FB]">{entry.interpret}</p>
                </div>

                {/* 4. Limitations */}
                <div className="bg-gray-50 dark:bg-gray-900/60 border border-[#E5EAF2] dark:border-[#1F2E47] rounded-xl p-3.5">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-[#667085] dark:text-[#97A3B6] uppercase tracking-wider mb-1">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    <span>What it does NOT tell us</span>
                  </div>
                  <p className="text-[#667085] dark:text-[#97A3B6]">{entry.limitation}</p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-[#667085] dark:text-[#97A3B6]">
                Plain-English definition for &quot;{term}&quot; is currently being compiled by the research desk.
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ExplainThis;
