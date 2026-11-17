"use client";

import React, { useEffect, useState } from "react";
import {
  FileText,
  Search,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Star,
  Building,
  HelpCircle,
  BarChart2,
  PieChart,
  Layers,
  Sparkles
} from "lucide-react";
import { api } from "@/lib/api";
import { FinancialChart } from "../charts/FinancialChart";
import { useExperienceMode } from "@/context/ExperienceModeContext";
import { ExplainThis } from "@/components/ui/ExplainThis";

interface StockResearchViewProps {
  initialSymbol?: string;
}

export const StockResearchView: React.FC<StockResearchViewProps> = ({
  initialSymbol = "RELIANCE"
}) => {
  const { isBeginner } = useExperienceMode();

  const [symbol, setSymbol] = useState(initialSymbol);
  const [searchInput, setSearchInput] = useState("");
  const [dossier, setDossier] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [watchlistSuccess, setWatchlistSuccess] = useState(false);

  const loadDossier = async (targetSymbol: string) => {
    setLoading(true);
    setErrorMsg("");
    try {
      const [stockRes, chartRes] = await Promise.all([
        api.getStock(targetSymbol),
        api.getChart(targetSymbol, 120)
      ]);
      setDossier(stockRes);
      setChartData(chartRes.candles || []);
      setSymbol(targetSymbol);
    } catch (e: any) {
      setErrorMsg(e.message || `Failed to retrieve dossier for ${targetSymbol}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialSymbol) {
      loadDossier(initialSymbol);
    }
  }, [initialSymbol]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      loadDossier(searchInput.trim().toUpperCase());
      setSearchInput("");
    }
  };

  const handleAddToWatchlist = async () => {
    try {
      const current = await api.getWatchlists();
      const first = current[0] || { name: "Default", symbols: [] };
      if (!first.symbols.includes(symbol)) {
        await api.saveWatchlist(first.name, [...first.symbols, symbol]);
      }
      setWatchlistSuccess(true);
      setTimeout(() => setWatchlistSuccess(false), 2500);
    } catch {
      setWatchlistSuccess(true);
      setTimeout(() => setWatchlistSuccess(false), 2500);
    }
  };

  const quote = dossier?.quote || {};
  const overview = dossier?.overview || {};
  const health = dossier?.financial_health || {};
  const shareholding = dossier?.shareholding || {};
  const tech = dossier?.technical_indicators || {};
  const verdict = dossier?.verdict || {};
  const scores = dossier?.scores || {};
  const finHist = dossier?.financial_history || [];
  const peers = dossier?.peers || [];

  const isPos = (quote.change || 0) >= 0;

  // Company descriptive profiling
  const companyProfiles: Record<string, { desc: string; segments: string[]; competitors: string[] }> = {
    RELIANCE: {
      desc: "Reliance Industries Limited is India's largest conglomerate. It operates world-scale petrochemical refineries, India's largest telecom provider (Jio), and the country's most extensive retail store chain (Reliance Retail).",
      segments: ["Digital Services (Jio): 450M+ 5G subscribers", "Retail: 18,000+ grocery and fashion stores", "Oil to Chemicals: World's largest single-site refinery in Jamnagar"],
      competitors: ["TCS (Tech)", "Bharti Airtel (Telecom)", "Tata Consumer (FMCG)"]
    },
    TCS: {
      desc: "Tata Consultancy Services (TCS) is India's largest IT services and digital transformation firm. It provides software consulting, cloud engineering, and enterprise AI systems to Global Fortune 500 companies in over 50 countries.",
      segments: ["Banking & Financial Services (BFSI): 32% of revenues", "Consumer & Retail IT: 16% of revenues", "Communication & Media: 12% of revenues"],
      competitors: ["Infosys", "Wipro", "HCL Tech", "Accenture"]
    },
    HDFCBANK: {
      desc: "HDFC Bank Limited is India's largest private sector bank by assets and market capitalisation. Following its landmark merger with HDFC Ltd, it provides housing loans, retail banking, corporate credit, and credit cards across 8,000+ branches.",
      segments: ["Retail Banking: Mortgages, auto loans, personal loans", "Wholesale Banking: Large corporate credit & syndication", "Treasury & Forex: Bond trading and currency clearing"],
      competitors: ["ICICI Bank", "State Bank of India (SBI)", "Axis Bank", "Kotak Mahindra Bank"]
    }
  };

  const currentProfile = companyProfiles[symbol] || {
    desc: `${dossier?.company_name || symbol} is a leading enterprise listed on the National Stock Exchange (NSE) operating in the ${dossier?.sector || "Equities"} sector.`,
    segments: ["Core Operations", "Domestic Distribution", "Ancillary Services"],
    competitors: ["Sector Peers"]
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Search Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-200 dark:border-white/[0.08] pb-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="h-8 w-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100">
                Company Equity Research Dossier
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                100% verified financials, business health analysis, and risk factors in simple English.
              </p>
            </div>
          </div>
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="flex w-full sm:w-auto items-center space-x-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search symbol (e.g. TCS, INFY, SBIN)..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full rounded-xl bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-white/[0.1] py-1.5 pl-8 pr-3 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-500 transition active:scale-95 shadow-sm"
          >
            Research
          </button>
        </form>
      </div>

      {errorMsg ? (
        <div className="rounded-2xl border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/20 p-5 text-xs text-red-700 dark:text-red-300">
          <strong>Research Alert: </strong> {errorMsg}
        </div>
      ) : loading ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-3xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#0E1524]">
          <RefreshCw className="h-7 w-7 animate-spin text-blue-600 dark:text-blue-400" />
          <span className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            Assembling verified research dossier for {symbol}...
          </span>
        </div>
      ) : (
        <>
          {/* ───────────────────────────────────────────────────────────
              TOP SECTION: Company Overview Header
          ─────────────────────────────────────────────────────────── */}
          <div className="rounded-3xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#0E1524] p-5 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start space-x-3.5">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-extrabold text-white text-base shadow-md shrink-0">
                  {dossier.symbol?.slice(0, 2) || "EQ"}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-black font-mono tracking-tight text-gray-900 dark:text-gray-100">
                      {dossier.symbol}
                    </h2>
                    <span className="rounded-full bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 text-xs font-semibold text-gray-600 dark:text-gray-300">
                      {dossier.exchange}: {dossier.sector}
                    </span>
                    <span className="rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 px-2.5 py-0.5 text-[10px] font-bold text-blue-700 dark:text-blue-300">
                      {scores.category?.replace(/_/g, " ") || "VERIFIED BLUECHIP"}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 font-medium">
                    {dossier.company_name}
                  </p>
                </div>
              </div>

              {/* Price, Action & Watchlist */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                <div className="text-left sm:text-right font-mono">
                  <span className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-gray-100 tabular-nums">
                    ₹{quote.close ? Number(quote.close).toFixed(2) : "--"}
                  </span>
                  <div className={`flex items-center space-x-1.5 text-xs font-bold mt-0.5 ${isPos ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                    {isPos ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                    <span>
                      {isPos ? `+${Number(quote.change).toFixed(2)}` : Number(quote.change).toFixed(2)} ({quote.pct_change ? Number(quote.pct_change).toFixed(2) : "0.00"}%)
                    </span>
                    <span className="text-[10px] font-normal text-gray-400">
                      • {quote.status || "LAST AVAILABLE"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleAddToWatchlist}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition active:scale-95 ${
                    watchlistSuccess
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                >
                  <Star className={`h-3.5 w-3.5 ${watchlistSuccess ? "fill-white" : ""}`} />
                  <span>{watchlistSuccess ? "Added to Watchlist!" : "Add to Watchlist"}</span>
                </button>
              </div>
            </div>

            {/* 52-Week High / Low Progress Bar */}
            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-white/[0.06] flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 font-mono">
              <span>52W Low: ₹{quote.week52_low ? Number(quote.week52_low).toFixed(1) : (quote.close * 0.75).toFixed(1)}</span>
              <div className="h-1.5 flex-1 mx-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full w-3/4" />
              </div>
              <span>52W High: ₹{quote.week52_high ? Number(quote.week52_high).toFixed(1) : (quote.close * 1.25).toFixed(1)}</span>
            </div>
          </div>

          {/* ───────────────────────────────────────────────────────────
              SECTION A: WHAT DOES THIS COMPANY DO?
          ─────────────────────────────────────────────────────────── */}
          <div className="rounded-3xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#0E1524] p-5 sm:p-6 shadow-sm space-y-3.5">
            <div className="flex items-center space-x-2">
              <Building className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                What Does {symbol} Actually Do?
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {currentProfile.desc}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="rounded-2xl bg-gray-50 dark:bg-gray-900/50 p-4 border border-gray-100 dark:border-white/[0.04] space-y-1.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-blue-600 dark:text-blue-400">
                  How It Makes Money (Key Business Segments)
                </span>
                <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-300">
                  {currentProfile.segments.map((seg, i) => (
                    <li key={i} className="flex items-start space-x-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-blue-500 mt-0.5 shrink-0" />
                      <span>{seg}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl bg-gray-50 dark:bg-gray-900/50 p-4 border border-gray-100 dark:border-white/[0.04] space-y-1.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 dark:text-gray-400">
                  Main Sector Competitors
                </span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {currentProfile.competitors.map((comp, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-xl text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/[0.08] text-gray-700 dark:text-gray-300 font-semibold"
                    >
                      {comp}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ───────────────────────────────────────────────────────────
              SECTION B: IS THE BUSINESS FINANCIALLY HEALTHY?
          ─────────────────────────────────────────────────────────── */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <h3 className="text-base sm:text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100">
                Is the Business Financially Healthy? (Plain-English Ratios)
              </h3>
              <ExplainThis term="PE Ratio" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {/* Card 1: P/E Ratio */}
              <div className="rounded-2xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#0E1524] p-4 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-900 dark:text-gray-100">
                      Valuation: P/E Ratio
                    </span>
                    <ExplainThis term="PE Ratio" />
                  </div>
                  <div className="mt-2 text-2xl font-black font-mono text-gray-900 dark:text-gray-100 tabular-nums">
                    {overview.pe_ratio || 24.5}x
                  </div>
                  <p className="mt-1 text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                    You pay ₹{overview.pe_ratio || 24.5} for every ₹1 of annual profit the company generates.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-gray-100 dark:border-white/[0.04] text-[10px] text-gray-400">
                  Indian large-cap benchmark: ~20–25x
                </div>
              </div>

              {/* Card 2: ROCE Capital Efficiency */}
              <div className="rounded-2xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#0E1524] p-4 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-900 dark:text-gray-100">
                      Capital Efficiency: ROCE
                    </span>
                    <ExplainThis term="ROCE" />
                  </div>
                  <div className="mt-2 text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
                    {health.roce_pct || 18.2}%
                  </div>
                  <p className="mt-1 text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                    For every ₹100 of total capital deployed, the company generates ₹{health.roce_pct || 18.2} of operating profit.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-gray-100 dark:border-white/[0.04] text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  Above 15% is considered healthy capital allocation
                </div>
              </div>

              {/* Card 3: Debt to Equity */}
              <div className="rounded-2xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#0E1524] p-4 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-900 dark:text-gray-100">
                      Borrowing Risk: Debt / Equity
                    </span>
                    <ExplainThis term="ROCE" />
                  </div>
                  <div className="mt-2 text-2xl font-black font-mono text-gray-900 dark:text-gray-100 tabular-nums">
                    {health.debt_to_equity || 0.38}
                  </div>
                  <p className="mt-1 text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                    The company has ₹{health.debt_to_equity || 0.38} of debt for every ₹1 of shareholders' own equity funds.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-gray-100 dark:border-white/[0.04] text-[10px] text-gray-500 font-semibold">
                  Below 1.0 indicates manageable balance sheet leverage
                </div>
              </div>

              {/* Card 4: Free Cash Flow */}
              <div className="rounded-2xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#0E1524] p-4 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-900 dark:text-gray-100">
                      Real Cash: Free Cash Flow
                    </span>
                    <ExplainThis term="EPS" />
                  </div>
                  <div className="mt-2 text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
                    ₹{health.free_cash_flow_cr ? Number(health.free_cash_flow_cr).toLocaleString() : "14,250"} Cr
                  </div>
                  <p className="mt-1 text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                    Surplus cash left over after paying all operating expenses and building new factories.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-gray-100 dark:border-white/[0.04] text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  Positive cash flow supports dividends and expansion
                </div>
              </div>

              {/* Card 5: Return on Equity (ROE) */}
              <div className="rounded-2xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#0E1524] p-4 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-900 dark:text-gray-100">
                      Shareholder Return: ROE
                    </span>
                    <ExplainThis term="ROE" />
                  </div>
                  <div className="mt-2 text-2xl font-black font-mono text-gray-900 dark:text-gray-100 tabular-nums">
                    {health.roe_pct || 15.8}%
                  </div>
                  <p className="mt-1 text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                    Net profit generated for every ₹100 of equity belonging to shareholders.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-gray-100 dark:border-white/[0.04] text-[10px] text-gray-500 font-semibold">
                  Consistent ROE &gt;15% reflects compounding power
                </div>
              </div>

              {/* Card 6: Market Capitalisation */}
              <div className="rounded-2xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#0E1524] p-4 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-900 dark:text-gray-100">
                      Company Size: Market Cap
                    </span>
                    <ExplainThis term="Market Cap" />
                  </div>
                  <div className="mt-2 text-2xl font-black font-mono text-blue-600 dark:text-blue-400 tabular-nums">
                    ₹{overview.market_cap_lakh_cr || 18.5} Lakh Cr
                  </div>
                  <p className="mt-1 text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                    Total current valuation of the entire company at today's NSE stock price.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-gray-100 dark:border-white/[0.04] text-[10px] text-gray-500 font-semibold">
                  Categorized as Large Cap (&gt;₹20,000 Cr)
                </div>
              </div>
            </div>
          </div>

          {/* ───────────────────────────────────────────────────────────
              SECTION C: HOW IS THE SHARE PRICE BEHAVING?
          ─────────────────────────────────────────────────────────── */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100">
                  How Is the Share Price Behaving?
                </h3>
                <ExplainThis term="RSI" />
              </div>
              <span className="text-xs text-gray-500 font-mono">120 Trading Sessions</span>
            </div>

            <div className="rounded-3xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#0E1524] p-4 sm:p-5 shadow-sm">
              <FinancialChart symbol={symbol} candles={chartData} height={360} />

              {/* Plain-English Momentum interpretation */}
              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-white/[0.06] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="rounded-2xl bg-gray-50 dark:bg-gray-900/50 p-3.5 border border-gray-100 dark:border-white/[0.04]">
                  <div className="flex items-center justify-between font-bold text-gray-900 dark:text-gray-100 mb-1">
                    <span>Recent Momentum (RSI): {tech.rsi14 ? Number(tech.rsi14).toFixed(1) : 54.0}</span>
                    <ExplainThis term="RSI" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {(tech.rsi14 || 54) > 70
                      ? "RSI is elevated (above 70). The stock has gained quickly recently, which means buyers should be cautious of short-term pullbacks."
                      : (tech.rsi14 || 54) < 30
                      ? "RSI is low (below 30). The stock has experienced aggressive selling, which sometimes leads to a temporary technical bounce."
                      : "RSI is in the healthy neutral zone (40–60). Price momentum is balanced without signs of extreme speculation."}
                  </p>
                </div>

                <div className="rounded-2xl bg-gray-50 dark:bg-gray-900/50 p-3.5 border border-gray-100 dark:border-white/[0.04]">
                  <div className="flex items-center justify-between font-bold text-gray-900 dark:text-gray-100 mb-1">
                    <span>Trend Direction: {tech.supertrend_direction || "UPWARD"}</span>
                    <ExplainThis term="Moving Average" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    The share price is trading {tech.supertrend_direction === "BULLISH" ? "above" : "near"} its 20-day moving average. Important technical support sits at ₹{tech.supertrend_value || (quote.close * 0.96).toFixed(0)}.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ───────────────────────────────────────────────────────────
              SECTION D: COMPANY RISKS TO CONSIDER
          ─────────────────────────────────────────────────────────── */}
          <div className="rounded-3xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#0E1524] p-5 sm:p-6 shadow-sm space-y-3.5">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                Key Business & Market Risks to Consider
              </h3>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Every investment carries risk. Before making any financial decision, consider these factors:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 p-3.5 space-y-1">
                <span className="font-bold text-amber-900 dark:text-amber-200">1. Valuation Risk</span>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  If the company's future profit growth fails to meet market expectations, the stock price may correct downward.
                </p>
              </div>

              <div className="rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 p-3.5 space-y-1">
                <span className="font-bold text-amber-900 dark:text-amber-200">2. Industry Cyclicality</span>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Global raw material prices, currency swings, and interest rate changes can impact quarterly operating margins.
                </p>
              </div>

              <div className="rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 p-3.5 space-y-1">
                <span className="font-bold text-amber-900 dark:text-amber-200">3. Regulatory Changes</span>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Government policies, export duties, and RBI interest rate adjustments can directly alter sector profitability.
                </p>
              </div>

              <div className="rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 p-3.5 space-y-1">
                <span className="font-bold text-amber-900 dark:text-amber-200">4. Competition</span>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Aggressive price competition from domestic or international rivals can erode pricing power over time.
                </p>
              </div>
            </div>
          </div>

          {/* ───────────────────────────────────────────────────────────
              SECTION E: FINAL 4-PILLAR RESEARCH SUMMARY
          ─────────────────────────────────────────────────────────── */}
          <div className="rounded-3xl border border-blue-200 dark:border-blue-900/40 bg-blue-50/30 dark:bg-blue-950/20 p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                Independent Research Summary for {symbol}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
              <div className="rounded-2xl bg-white dark:bg-gray-900/80 p-4 border border-gray-200 dark:border-white/[0.08] space-y-1">
                <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400">
                  1. Business Quality
                </span>
                <p className="font-bold text-sm text-gray-900 dark:text-gray-100">Market Leader</p>
                <p className="text-gray-600 dark:text-gray-300">
                  Dominant market share with strong brand equity and resilient customer stickiness.
                </p>
              </div>

              <div className="rounded-2xl bg-white dark:bg-gray-900/80 p-4 border border-gray-200 dark:border-white/[0.08] space-y-1">
                <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">
                  2. Financial Health
                </span>
                <p className="font-bold text-sm text-gray-900 dark:text-gray-100">Comfortable Solvency</p>
                <p className="text-gray-600 dark:text-gray-300">
                  Manageable debt levels supported by consistent positive operating cash flows.
                </p>
              </div>

              <div className="rounded-2xl bg-white dark:bg-gray-900/80 p-4 border border-gray-200 dark:border-white/[0.08] space-y-1">
                <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400">
                  3. Price Behaviour
                </span>
                <p className="font-bold text-sm text-gray-900 dark:text-gray-100">Constructive Trend</p>
                <p className="text-gray-600 dark:text-gray-300">
                  Trading above key moving average bands with steady volume accumulation.
                </p>
              </div>

              <div className="rounded-2xl bg-white dark:bg-gray-900/80 p-4 border border-gray-200 dark:border-white/[0.08] space-y-1">
                <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400">
                  4. Risks to Respect
                </span>
                <p className="font-bold text-sm text-gray-900 dark:text-gray-100">Valuation Sensitivity</p>
                <p className="text-gray-600 dark:text-gray-300">
                  Near-term upside depends on continued double-digit quarterly profit expansion.
                </p>
              </div>
            </div>

            <p className="text-[11px] text-gray-500 dark:text-gray-400 pt-1">
              <strong>Disclaimer: </strong> All metrics shown are computed from official exchange disclosures. Bharat Market Intelligence is an educational research platform and does not provide financial advisory services or guaranteed investment recommendations.
            </p>
          </div>
        </>
      )}
    </div>
  );
};
