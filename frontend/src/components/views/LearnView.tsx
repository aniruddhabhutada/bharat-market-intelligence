"use client";

import React, { useState } from "react";
import { BookOpen, Search, Sparkles, ShieldCheck } from "lucide-react";
import { ExplainThis } from "@/components/ui/ExplainThis";

interface Topic {
  id: string;
  term: string;
  title: string;
  category: "Basics" | "Valuation" | "Technical" | "Institutions";
  summary: string;
  simpleAnalogy: string;
}

const TOPICS: Topic[] = [
  {
    id: "nifty-50",
    term: "NIFTY 50",
    title: "NIFTY 50 Index",
    category: "Basics",
    summary: "The flagship barometer of the Indian stock market representing the 50 largest companies listed on the National Stock Exchange (NSE).",
    simpleAnalogy: "Think of NIFTY 50 like the Indian national cricket squad: it brings together the top 50 players representing the overall health of India's corporate economy."
  },
  {
    id: "sensex",
    term: "SENSEX",
    title: "BSE SENSEX",
    category: "Basics",
    summary: "India's oldest benchmark index tracking the 30 largest and most actively traded companies on the Bombay Stock Exchange (BSE).",
    simpleAnalogy: "Like NIFTY, SENSEX gives an instant snapshot of how India's biggest bluechip businesses performed today."
  },
  {
    id: "market-cap",
    term: "Market Cap",
    title: "Market Capitalisation",
    category: "Basics",
    summary: "The total market value of all a company's shares. Calculated as (Current Share Price × Total Number of Shares).",
    simpleAnalogy: "If you wanted to buy every single share of Reliance or TCS today, the Market Cap is the price tag of the entire company."
  },
  {
    id: "pe-ratio",
    term: "PE Ratio",
    title: "Price-to-Earnings (P/E)",
    category: "Valuation",
    summary: "Compares a company's current share price to its annual profit per share. Tells you how many rupees you pay for ₹1 of earnings.",
    simpleAnalogy: "If a local shop earns ₹10 Lakhs profit a year and the owner asks ₹1.5 Crore to sell it to you, the P/E ratio is 15."
  },
  {
    id: "roce",
    term: "ROCE",
    title: "Return on Capital Employed",
    category: "Valuation",
    summary: "Measures how efficiently a company turns all its capital (both equity from shareholders and borrowed debt) into operating profits.",
    simpleAnalogy: "If you give two chefs ₹10,000 to cook and one makes ₹3,000 profit (30% ROCE) while the other makes ₹500 (5% ROCE), the first chef is far more capital-efficient."
  },
  {
    id: "eps",
    term: "EPS",
    title: "Earnings Per Share",
    category: "Valuation",
    summary: "Total net profit divided by the total number of shares. Shows the profit attributable to each single share you hold.",
    simpleAnalogy: "If a pizza has 8 slices (shares) and ₹800 worth of toppings (profit), each slice gets ₹100 worth of value (EPS)."
  },
  {
    id: "fii",
    term: "FII",
    title: "Foreign Institutional Investors (FII)",
    category: "Institutions",
    summary: "Global hedge funds, sovereign wealth funds, and mutual funds based outside India that invest heavily in the Indian market.",
    simpleAnalogy: "When international financial giants pour money into India, stock prices generally receive strong upward support."
  },
  {
    id: "dii",
    term: "DII",
    title: "Domestic Institutional Investors (DII)",
    category: "Institutions",
    summary: "Indian institutions like LIC, SBI Mutual Fund, HDFC Mutual Fund, and pension funds that invest domestic Indian savings into the stock market.",
    simpleAnalogy: "India's own financial shock absorber. When foreign funds sell, domestic SIP inflows help stabilize and buy the dip."
  },
  {
    id: "rsi",
    term: "RSI",
    title: "Relative Strength Index (RSI)",
    category: "Technical",
    summary: "A momentum oscillator (scaled 0 to 100) measuring how fast and aggressively a stock's price has been rising or falling recently.",
    simpleAnalogy: "Like a speedometer in a car. Above 70 means the car has sped up very quickly (overbought); below 30 means it has slowed down abruptly (oversold)."
  },
  {
    id: "macd",
    term: "MACD",
    title: "Moving Average Convergence Divergence",
    category: "Technical",
    summary: "A trend-following momentum indicator that shows the relationship between two moving averages of a stock's price.",
    simpleAnalogy: "Helps you see if the wind is blowing at the stock's back (bullish momentum) or in its face (bearish momentum)."
  },
  {
    id: "support-resistance",
    term: "Support",
    title: "Support & Resistance Levels",
    category: "Technical",
    summary: "Support is the price floor where buyers historically step in. Resistance is the price ceiling where sellers tend to take profits.",
    simpleAnalogy: "Like a bouncy ball in a room: Support is the hard floor it bounces off, Resistance is the ceiling it bumps against."
  },
  {
    id: "volume",
    term: "Volume",
    title: "Trading Volume",
    category: "Technical",
    summary: "The actual count of shares bought and sold during a trading session. Validates the strength of any price movement.",
    simpleAnalogy: "A rally supported by heavy volume confirms real institutional interest and participation."
  }
];

export const LearnView: React.FC = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "Basics", "Valuation", "Institutions", "Technical"];

  const filteredTopics = TOPICS.filter((t) => {
    const matchesCat = selectedCategory === "All" || t.category === selectedCategory;
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.summary.toLowerCase().includes(search.toLowerCase()) ||
      t.term.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="border-b border-[#E5EAF2] dark:border-[#1F2E47] pb-5">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-[#EEF3FC] dark:bg-[#1A2844] text-[#315EFB] dark:text-[#4D74FB] flex items-center justify-center">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#172B4D] dark:text-[#F4F6FB]">
              Investing Knowledge Base in Simple English
            </h1>
            <p className="text-xs sm:text-sm text-[#667085] dark:text-[#97A3B6] mt-0.5">
              No financial jargon. Learn how the Indian stock market works with clear real-world analogies.
            </p>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex overflow-x-auto no-scrollbar space-x-1.5 pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition active:scale-95 ${
                selectedCategory === cat
                  ? "bg-[#315EFB] text-white shadow-xs"
                  : "bg-white dark:bg-[#131C2E] border border-[#E5EAF2] dark:border-[#1F2E47] text-[#667085] dark:text-[#97A3B6] hover:text-[#172B4D] dark:hover:text-[#F4F6FB]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#667085] dark:text-[#97A3B6]" />
          <input
            type="text"
            placeholder="Search concepts (e.g. PE, RSI, NIFTY)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs bg-white dark:bg-[#131C2E] border border-[#E5EAF2] dark:border-[#1F2E47] text-[#172B4D] dark:text-[#F4F6FB] placeholder-[#8993A4] focus:outline-none focus:border-[#315EFB]"
          />
        </div>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTopics.map((topic) => (
          <div
            key={topic.id}
            className="rounded-2xl border border-[#E5EAF2] dark:border-[#1F2E47] bg-white dark:bg-[#131C2E] p-5 shadow-xs hover:border-[#315EFB] transition-all space-y-3.5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#315EFB] dark:text-[#4D74FB] bg-[#EEF3FC] dark:bg-[#1A2844] px-2 py-0.5 rounded-md border border-[#CAD9FB] dark:border-[#1F2E47]">
                    {topic.category}
                  </span>
                  <h3 className="text-base font-bold text-[#172B4D] dark:text-[#F4F6FB] mt-1.5">
                    {topic.title}
                  </h3>
                </div>
                <ExplainThis term={topic.term} />
              </div>

              <p className="text-xs text-[#667085] dark:text-[#97A3B6] leading-relaxed mt-2">
                {topic.summary}
              </p>

              {/* Simple Analogy Box */}
              <div className="mt-3 rounded-xl bg-[#FFF9EB] dark:bg-[#B45309]/10 border border-[#FEE8A2] dark:border-[#B45309]/30 p-3 text-xs text-[#B45309] leading-relaxed">
                <span className="font-bold flex items-center space-x-1.5 mb-1">
                  <Sparkles className="h-3.5 w-3.5 text-[#B45309]" />
                  <span>Real-World Analogy</span>
                </span>
                {topic.simpleAnalogy}
              </div>
            </div>

            <div className="pt-2 border-t border-[#E5EAF2] dark:border-[#1F2E47] flex items-center justify-between text-[11px] text-[#667085] dark:text-[#97A3B6]">
              <span>Click help icon for structured 4-part breakdown</span>
              <ExplainThis term={topic.term} />
            </div>
          </div>
        ))}
      </div>

      {/* Safety & Education Note */}
      <div className="rounded-2xl bg-[#EEF3FC] dark:bg-[#1A2844]/30 border border-[#CAD9FB] dark:border-[#1F2E47] p-5 flex items-start space-x-3.5">
        <ShieldCheck className="h-6 w-6 text-[#315EFB] dark:text-[#4D74FB] shrink-0 mt-0.5" />
        <div className="text-xs text-[#172B4D] dark:text-[#F4F6FB] space-y-1">
          <p className="font-bold text-sm">
            Guiding Philosophy: Research Over Speculation
          </p>
          <p className="text-[#667085] dark:text-[#97A3B6] leading-relaxed">
            Bharat Market Intelligence never provides unsolicited BUY or SELL advice or promises guaranteed returns. Real investing success comes from understanding company fundamentals, verifying financial health, and respecting risk boundaries.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LearnView;
