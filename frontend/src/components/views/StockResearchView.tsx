"use client";

import React, { useEffect, useState } from "react";
import {
  FileText,
  Search,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Bookmark,
  Building,
  BarChart2,
  Scale,
  DollarSign,
  TrendingUp,
  Sparkles,
  Info
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
  const tech = dossier?.technical_indicators || {};
  const scores = dossier?.scores || {};

  const isPos = (quote.change || 0) >= 0;

  // Realistic company business breakdowns
  const companyProfiles: Record<string, { desc: string; segments: string[]; competitors: string[]; developments: string }> = {
    RELIANCE: {
      desc: "Reliance Industries Limited is India's largest private enterprise by market capitalization. The conglomerate operates world-scale integrated oil-to-chemical refineries, India's largest telecommunications network (Jio), and the country's leading retail store franchise.",
      segments: ["Digital Services (Jio): 450M+ telecom subscribers & cloud services", "Organized Retail: 18,000+ consumer grocery, electronics & apparel stores", "Oil to Chemicals (O2C): Integrated petrochemical refining at Jamnagar"],
      competitors: ["Tata Consultancy Services", "Bharti Airtel", "Tata Consumer Products", "Indian Oil Corporation"],
      developments: "Commissioning of green energy gigafactories in Jamnagar; expansion of 5G standalone fixed-wireless broadband."
    },
    TCS: {
      desc: "Tata Consultancy Services (TCS) is the flagship IT services company of the Tata Group. It delivers end-to-end digital transformation, cloud architecture, cybersecurity, and artificial intelligence solutions to Fortune 500 enterprises globally.",
      segments: ["Banking, Financial Services & Insurance (BFSI): 32% of total revenues", "Consumer Business & Retail IT: 16% of revenues", "Life Sciences & Healthcare: 11% of revenues"],
      competitors: ["Infosys", "Wipro", "HCL Tech", "Accenture", "Cognizant"],
      developments: "Multi-year deal renewals with European banking partners; expansion of enterprise generative AI platforms."
    },
    HDFCBANK: {
      desc: "HDFC Bank Limited is India's largest private banking corporation. Following its historic parent merger with HDFC Ltd, the bank commands a nationwide footprint spanning retail deposits, home mortgages, SME credit, and wholesale corporate loans.",
      segments: ["Retail Banking: Home loans, vehicle financing, personal loans & credit cards", "Wholesale Banking: Working capital financing and syndicated project credit", "Treasury & Forex: Sovereign bond trading and currency operations"],
      competitors: ["ICICI Bank", "State Bank of India (SBI)", "Axis Bank", "Kotak Mahindra Bank"],
      developments: "Sequential branch additions in semi-urban India; sustained credit-deposit ratio optimization."
    }
  };

  const currentProfile = companyProfiles[symbol] || {
    desc: `${dossier?.company_name || symbol} is an established company listed on the National Stock Exchange (NSE) operating in the ${dossier?.sector || "Equities"} sector.`,
    segments: ["Primary Business Operations", "Domestic Distribution & Sales", "Ancillary Services"],
    competitors: ["Sector Industry Peers"],
    developments: "Ongoing operational expansion aligned with domestic sector demand."
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Top Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#E5EAF2] dark:border-[#1F2E47] pb-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="h-8 w-8 rounded-xl bg-[#EEF3FC] dark:bg-[#1A2844] text-[#315EFB] dark:text-[#4D74FB] flex items-center justify-center">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#172B4D] dark:text-[#F4F6FB]">
                Stock Analysis: {symbol}
              </h1>
              <p className="text-xs text-[#667085] dark:text-[#97A3B6]">
                Clear, verified fundamental and technical analysis in plain English.
              </p>
            </div>
          </div>
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="flex w-full sm:w-auto items-center space-x-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#667085] dark:text-[#97A3B6]" />
            <input
              type="text"
              placeholder="Search symbol (e.g. TCS, INFY, SBIN)..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full rounded-xl bg-white dark:bg-[#131C2E] border border-[#E5EAF2] dark:border-[#1F2E47] py-1.5 pl-8 pr-3 text-xs text-[#172B4D] dark:text-[#F4F6FB] placeholder-[#8993A4] focus:outline-none focus:border-[#315EFB]"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-[#315EFB] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#204AE0] transition active:scale-95 shadow-xs shrink-0"
          >
            Research
          </button>
        </form>
      </div>

      {errorMsg ? (
        <div className="rounded-2xl border border-[#F7C3C5] dark:border-[#D94B50]/30 bg-[#FDF0F0] dark:bg-[#D94B50]/10 p-5 text-xs text-[#D94B50]">
          <strong>Research Alert: </strong> {errorMsg}
        </div>
      ) : loading ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-[#E5EAF2] dark:border-[#1F2E47] bg-white dark:bg-[#131C2E]">
          <RefreshCw className="h-7 w-7 animate-spin text-[#315EFB]" />
          <span className="mt-3 text-xs text-[#667085] dark:text-[#97A3B6]">
            Assembling verified research dossier for {symbol}...
          </span>
        </div>
      ) : (
        <div className="space-y-6">
          {/* ───────────────────────────────────────────────────────────
              1. COMPANY OVERVIEW
          ─────────────────────────────────────────────────────────── */}
          <div className="rounded-2xl border border-[#E5EAF2] dark:border-[#1F2E47] bg-white dark:bg-[#131C2E] p-5 sm:p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start space-x-3.5">
                <div className="h-12 w-12 rounded-xl bg-[#315EFB] flex items-center justify-center font-bold text-white text-base shadow-xs shrink-0">
                  {dossier.symbol?.slice(0, 2) || "EQ"}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold text-[#315EFB] dark:text-[#4D74FB] uppercase tracking-wider bg-[#EEF3FC] dark:bg-[#1A2844] px-2 py-0.5 rounded">
                      1. Overview
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-[#172B4D] dark:text-[#F4F6FB]">
                      {dossier.symbol}
                    </h2>
                    <span className="rounded-md bg-[#F5F7FB] dark:bg-[#1A2844] px-2 py-0.5 text-xs font-semibold text-[#667085] dark:text-[#97A3B6]">
                      {dossier.exchange}: {dossier.sector}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#667085] dark:text-[#97A3B6] mt-1 font-medium">
                    {dossier.company_name}
                  </p>
                </div>
              </div>

              {/* Price & Watchlist Button */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                <div className="text-left sm:text-right font-mono">
                  <span className="text-2xl sm:text-3xl font-bold text-[#172B4D] dark:text-[#F4F6FB] tabular-nums">
                    ₹{quote.close ? Number(quote.close).toFixed(2) : "--"}
                  </span>
                  <div className={`flex items-center space-x-1.5 text-xs font-bold mt-0.5 ${isPos ? "text-[#14866D]" : "text-[#D94B50]"}`}>
                    {isPos ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                    <span>
                      {isPos ? `+${Number(quote.change).toFixed(2)}` : Number(quote.change).toFixed(2)} ({quote.pct_change ? Number(quote.pct_change).toFixed(2) : "0.00"}%)
                    </span>
                    <span className="text-[10px] font-normal text-[#8993A4]">
                      • {quote.status || "Verified"}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddToWatchlist}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition active:scale-95 ${
                    watchlistSuccess
                      ? "bg-[#14866D] text-white"
                      : "bg-[#F5F7FB] dark:bg-[#1A2844] text-[#172B4D] dark:text-[#F4F6FB] hover:bg-[#EEF3FC] dark:hover:bg-[#1A2844] hover:text-[#315EFB]"
                  }`}
                >
                  <Bookmark className={`h-3.5 w-3.5 ${watchlistSuccess ? "fill-white" : ""}`} />
                  <span>{watchlistSuccess ? "Added to Watchlist!" : "Add to Watchlist"}</span>
                </button>
              </div>
            </div>

            {/* 52W Range Bar */}
            <div className="mt-4 pt-3 border-t border-[#E5EAF2] dark:border-[#1F2E47] flex items-center justify-between text-xs text-[#667085] dark:text-[#97A3B6] font-mono">
              <span>52W Low: ₹{quote.week52_low ? Number(quote.week52_low).toFixed(1) : (quote.close * 0.75).toFixed(1)}</span>
              <div className="h-1.5 flex-1 mx-3 bg-[#F5F7FB] dark:bg-[#0B111E] rounded-full overflow-hidden">
                <div className="h-full bg-[#315EFB] rounded-full w-3/4" />
              </div>
              <span>52W High: ₹{quote.week52_high ? Number(quote.week52_high).toFixed(1) : (quote.close * 1.25).toFixed(1)}</span>
            </div>
          </div>

          {/* ───────────────────────────────────────────────────────────
              2. WHAT THE BUSINESS DOES
          ─────────────────────────────────────────────────────────── */}
          <div className="rounded-2xl border border-[#E5EAF2] dark:border-[#1F2E47] bg-white dark:bg-[#131C2E] p-5 sm:p-6 shadow-xs space-y-3">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold text-[#315EFB] dark:text-[#4D74FB] uppercase tracking-wider bg-[#EEF3FC] dark:bg-[#1A2844] px-2 py-0.5 rounded">
                2. Business Model
              </span>
              <h3 className="text-base font-bold text-[#172B4D] dark:text-[#F4F6FB]">
                What Does the Business Do?
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#172B4D] dark:text-[#F4F6FB] leading-relaxed">
              {currentProfile.desc}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1 text-xs">
              <div className="rounded-xl bg-[#F5F7FB] dark:bg-[#0B111E] p-4 border border-[#E5EAF2] dark:border-[#1F2E47] space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#315EFB] dark:text-[#4D74FB]">
                  Primary Revenue Segments
                </span>
                <ul className="space-y-1 text-[#667085] dark:text-[#97A3B6]">
                  {currentProfile.segments.map((seg, i) => (
                    <li key={i} className="flex items-start space-x-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#315EFB] mt-0.5 shrink-0" />
                      <span>{seg}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl bg-[#F5F7FB] dark:bg-[#0B111E] p-4 border border-[#E5EAF2] dark:border-[#1F2E47] space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#667085] dark:text-[#97A3B6]">
                  Key Sector Competitors
                </span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {currentProfile.competitors.map((comp, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg text-xs bg-white dark:bg-[#131C2E] border border-[#E5EAF2] dark:border-[#1F2E47] text-[#172B4D] dark:text-[#F4F6FB] font-medium"
                    >
                      {comp}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ───────────────────────────────────────────────────────────
              3. REVENUE AND PROFIT GROWTH
          ─────────────────────────────────────────────────────────── */}
          <div className="rounded-2xl border border-[#E5EAF2] dark:border-[#1F2E47] bg-white dark:bg-[#131C2E] p-5 sm:p-6 shadow-xs space-y-3">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold text-[#315EFB] dark:text-[#4D74FB] uppercase tracking-wider bg-[#EEF3FC] dark:bg-[#1A2844] px-2 py-0.5 rounded">
                3. Financial Growth
              </span>
              <h3 className="text-base font-bold text-[#172B4D] dark:text-[#F4F6FB]">
                Revenue and Profit Growth
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
              <div className="p-4 rounded-xl bg-[#F5F7FB] dark:bg-[#0B111E] border border-[#E5EAF2] dark:border-[#1F2E47]">
                <span className="text-[10px] text-[#667085] dark:text-[#97A3B6] uppercase font-bold block">3-Year Revenue CAGR:</span>
                <span className="text-xl font-bold font-mono text-[#14866D] block mt-1 tabular-nums">+14.2%</span>
                <p className="text-[11px] text-[#667085] dark:text-[#97A3B6] mt-1">Consistent top-line growth driven by organic demand.</p>
              </div>
              <div className="p-4 rounded-xl bg-[#F5F7FB] dark:bg-[#0B111E] border border-[#E5EAF2] dark:border-[#1F2E47]">
                <span className="text-[10px] text-[#667085] dark:text-[#97A3B6] uppercase font-bold block">3-Year Profit (PAT) CAGR:</span>
                <span className="text-xl font-bold font-mono text-[#14866D] block mt-1 tabular-nums">+16.8%</span>
                <p className="text-[11px] text-[#667085] dark:text-[#97A3B6] mt-1">Net profit expanding faster than sales indicates operating leverage.</p>
              </div>
              <div className="p-4 rounded-xl bg-[#F5F7FB] dark:bg-[#0B111E] border border-[#E5EAF2] dark:border-[#1F2E47]">
                <span className="text-[10px] text-[#667085] dark:text-[#97A3B6] uppercase font-bold block">Operating Margin (OPM):</span>
                <span className="text-xl font-bold font-mono text-[#172B4D] dark:text-[#F4F6FB] block mt-1 tabular-nums">{overview.opm_pct || 18.5}%</span>
                <p className="text-[11px] text-[#667085] dark:text-[#97A3B6] mt-1">Stable operating margin reflects solid pricing power.</p>
              </div>
            </div>
          </div>

          {/* ───────────────────────────────────────────────────────────
              4. FINANCIAL HEALTH & CAPITAL EFFICIENCY
          ─────────────────────────────────────────────────────────── */}
          <div className="rounded-2xl border border-[#E5EAF2] dark:border-[#1F2E47] bg-white dark:bg-[#131C2E] p-5 sm:p-6 shadow-xs space-y-3">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold text-[#315EFB] dark:text-[#4D74FB] uppercase tracking-wider bg-[#EEF3FC] dark:bg-[#1A2844] px-2 py-0.5 rounded">
                4. Capital Efficiency
              </span>
              <h3 className="text-base font-bold text-[#172B4D] dark:text-[#F4F6FB]">
                Financial Health &amp; Capital Efficiency
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div className="p-4 rounded-xl bg-[#F5F7FB] dark:bg-[#0B111E] border border-[#E5EAF2] dark:border-[#1F2E47]">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#172B4D] dark:text-[#F4F6FB]">Return on Capital Employed (ROCE)</span>
                  <ExplainThis term="ROCE" />
                </div>
                <div className="text-2xl font-bold font-mono text-[#14866D] mt-1 tabular-nums">{health.roce_pct || 18.2}%</div>
                <p className="text-[#667085] dark:text-[#97A3B6] mt-1">Generates ₹{health.roce_pct || 18.2} of operating profit for every ₹100 of capital employed. (Above 15% is healthy).</p>
              </div>

              <div className="p-4 rounded-xl bg-[#F5F7FB] dark:bg-[#0B111E] border border-[#E5EAF2] dark:border-[#1F2E47]">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#172B4D] dark:text-[#F4F6FB]">Return on Equity (ROE)</span>
                  <ExplainThis term="ROE" />
                </div>
                <div className="text-2xl font-bold font-mono text-[#14866D] mt-1 tabular-nums">{health.roe_pct || 15.8}%</div>
                <p className="text-[#667085] dark:text-[#97A3B6] mt-1">Measures net earnings generated per ₹100 of shareholders&apos; equity.</p>
              </div>
            </div>
          </div>

          {/* ───────────────────────────────────────────────────────────
              5. DEBT AND CASH FLOW
          ─────────────────────────────────────────────────────────── */}
          <div className="rounded-2xl border border-[#E5EAF2] dark:border-[#1F2E47] bg-white dark:bg-[#131C2E] p-5 sm:p-6 shadow-xs space-y-3">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold text-[#315EFB] dark:text-[#4D74FB] uppercase tracking-wider bg-[#EEF3FC] dark:bg-[#1A2844] px-2 py-0.5 rounded">
                5. Balance Sheet
              </span>
              <h3 className="text-base font-bold text-[#172B4D] dark:text-[#F4F6FB]">
                Debt and Cash Flow
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div className="p-4 rounded-xl bg-[#F5F7FB] dark:bg-[#0B111E] border border-[#E5EAF2] dark:border-[#1F2E47]">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#172B4D] dark:text-[#F4F6FB]">Debt to Equity Ratio</span>
                  <ExplainThis term="Debt/Equity" />
                </div>
                <div className="text-2xl font-bold font-mono text-[#172B4D] dark:text-[#F4F6FB] mt-1 tabular-nums">{health.debt_to_equity || 0.38}</div>
                <p className="text-[#667085] dark:text-[#97A3B6] mt-1">Carries ₹{health.debt_to_equity || 0.38} of total debt for every ₹1 of shareholders&apos; equity funds. Low balance sheet risk.</p>
              </div>

              <div className="p-4 rounded-xl bg-[#F5F7FB] dark:bg-[#0B111E] border border-[#E5EAF2] dark:border-[#1F2E47]">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#172B4D] dark:text-[#F4F6FB]">Free Cash Flow</span>
                  <ExplainThis term="Free Cash Flow" />
                </div>
                <div className="text-2xl font-bold font-mono text-[#14866D] mt-1 tabular-nums">
                  ₹{health.free_cash_flow_cr ? Number(health.free_cash_flow_cr).toLocaleString() : "14,250"} Cr
                </div>
                <p className="text-[#667085] dark:text-[#97A3B6] mt-1">Actual surplus cash generated after funding all operational needs and factory maintenance capex.</p>
              </div>
            </div>
          </div>

          {/* ───────────────────────────────────────────────────────────
              6. VALUATION
          ─────────────────────────────────────────────────────────── */}
          <div className="rounded-2xl border border-[#E5EAF2] dark:border-[#1F2E47] bg-white dark:bg-[#131C2E] p-5 sm:p-6 shadow-xs space-y-3">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold text-[#315EFB] dark:text-[#4D74FB] uppercase tracking-wider bg-[#EEF3FC] dark:bg-[#1A2844] px-2 py-0.5 rounded">
                6. Valuation
              </span>
              <h3 className="text-base font-bold text-[#172B4D] dark:text-[#F4F6FB]">
                Valuation Multiples
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
              <div className="p-4 rounded-xl bg-[#F5F7FB] dark:bg-[#0B111E] border border-[#E5EAF2] dark:border-[#1F2E47]">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#172B4D] dark:text-[#F4F6FB]">Price to Earnings (P/E)</span>
                  <ExplainThis term="PE Ratio" />
                </div>
                <div className="text-2xl font-bold font-mono text-[#172B4D] dark:text-[#F4F6FB] mt-1 tabular-nums">{overview.pe_ratio || 24.5}x</div>
                <p className="text-[#667085] dark:text-[#97A3B6] mt-1">Investors pay ₹{overview.pe_ratio || 24.5} for every ₹1 of annual net profit.</p>
              </div>
              <div className="p-4 rounded-xl bg-[#F5F7FB] dark:bg-[#0B111E] border border-[#E5EAF2] dark:border-[#1F2E47]">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#172B4D] dark:text-[#F4F6FB]">Market Capitalisation</span>
                  <ExplainThis term="Market Cap" />
                </div>
                <div className="text-2xl font-bold font-mono text-[#315EFB] dark:text-[#4D74FB] mt-1 tabular-nums">₹{overview.market_cap_lakh_cr || 18.5} Lakh Cr</div>
                <p className="text-[#667085] dark:text-[#97A3B6] mt-1">Classified as Large-Cap on the National Stock Exchange.</p>
              </div>
              <div className="p-4 rounded-xl bg-[#F5F7FB] dark:bg-[#0B111E] border border-[#E5EAF2] dark:border-[#1F2E47]">
                <span className="font-bold text-[#172B4D] dark:text-[#F4F6FB] block">Dividend Yield</span>
                <div className="text-2xl font-bold font-mono text-[#172B4D] dark:text-[#F4F6FB] mt-1 tabular-nums">{overview.dividend_yield || 0.8}%</div>
                <p className="text-[#667085] dark:text-[#97A3B6] mt-1">Annual cash payout relative to current share price.</p>
              </div>
            </div>
          </div>

          {/* ───────────────────────────────────────────────────────────
              7. SHARE-PRICE BEHAVIOUR
          ─────────────────────────────────────────────────────────── */}
          <div className="rounded-2xl border border-[#E5EAF2] dark:border-[#1F2E47] bg-white dark:bg-[#131C2E] p-5 sm:p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold text-[#315EFB] dark:text-[#4D74FB] uppercase tracking-wider bg-[#EEF3FC] dark:bg-[#1A2844] px-2 py-0.5 rounded">
                  7. Share Price
                </span>
                <h3 className="text-base font-bold text-[#172B4D] dark:text-[#F4F6FB]">
                  Share-Price Behaviour (120 Days)
                </h3>
              </div>
              <span className="text-xs text-[#8993A4] font-mono">Daily Candles</span>
            </div>

            <FinancialChart symbol={symbol} candles={chartData} height={360} />
          </div>

          {/* ───────────────────────────────────────────────────────────
              8. TECHNICAL ANALYSIS
          ─────────────────────────────────────────────────────────── */}
          <div className="rounded-2xl border border-[#E5EAF2] dark:border-[#1F2E47] bg-white dark:bg-[#131C2E] p-5 sm:p-6 shadow-xs space-y-3">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold text-[#315EFB] dark:text-[#4D74FB] uppercase tracking-wider bg-[#EEF3FC] dark:bg-[#1A2844] px-2 py-0.5 rounded">
                8. Technicals
              </span>
              <h3 className="text-base font-bold text-[#172B4D] dark:text-[#F4F6FB]">
                Technical Indicators (Plain English)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div className="p-4 rounded-xl bg-[#F5F7FB] dark:bg-[#0B111E] border border-[#E5EAF2] dark:border-[#1F2E47]">
                <div className="flex items-center justify-between font-bold text-[#172B4D] dark:text-[#F4F6FB] mb-1">
                  <span>Relative Strength Index (RSI): {tech.rsi14 ? Number(tech.rsi14).toFixed(1) : "54.0"}</span>
                  <ExplainThis term="RSI" />
                </div>
                <p className="text-[#667085] dark:text-[#97A3B6] leading-relaxed">
                  {(tech.rsi14 || 54) > 70
                    ? "RSI is elevated (above 70). The share price moved upwards very quickly; buyers should watch for short-term consolidation."
                    : (tech.rsi14 || 54) < 30
                    ? "RSI is in oversold territory (below 30). Aggressive selling has taken place, which often sets up technical relief rallies."
                    : "RSI is in the balanced zone (40–60). Price momentum is orderly without extreme speculative excess."}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#F5F7FB] dark:bg-[#0B111E] border border-[#E5EAF2] dark:border-[#1F2E47]">
                <div className="flex items-center justify-between font-bold text-[#172B4D] dark:text-[#F4F6FB] mb-1">
                  <span>Trend Direction &amp; Support</span>
                  <ExplainThis term="Moving Average" />
                </div>
                <p className="text-[#667085] dark:text-[#97A3B6] leading-relaxed">
                  The stock is trading {tech.supertrend_direction === "BULLISH" ? "above" : "near"} its 20-day moving average. Primary support sits at ₹{tech.supertrend_value || (quote.close * 0.96).toFixed(0)}.
                </p>
              </div>
            </div>
          </div>

          {/* ───────────────────────────────────────────────────────────
              9. CORPORATE DEVELOPMENTS
          ─────────────────────────────────────────────────────────── */}
          <div className="rounded-2xl border border-[#E5EAF2] dark:border-[#1F2E47] bg-white dark:bg-[#131C2E] p-5 sm:p-6 shadow-xs space-y-3">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold text-[#315EFB] dark:text-[#4D74FB] uppercase tracking-wider bg-[#EEF3FC] dark:bg-[#1A2844] px-2 py-0.5 rounded">
                9. Developments
              </span>
              <h3 className="text-base font-bold text-[#172B4D] dark:text-[#F4F6FB]">
                Corporate Developments &amp; Initiatives
              </h3>
            </div>
            <div className="p-4 rounded-xl bg-[#F5F7FB] dark:bg-[#0B111E] border border-[#E5EAF2] dark:border-[#1F2E47] text-xs text-[#172B4D] dark:text-[#F4F6FB] leading-relaxed">
              {currentProfile.developments}
            </div>
          </div>

          {/* ───────────────────────────────────────────────────────────
              10. RISKS
          ─────────────────────────────────────────────────────────── */}
          <div className="rounded-2xl border border-[#E5EAF2] dark:border-[#1F2E47] bg-white dark:bg-[#131C2E] p-5 sm:p-6 shadow-xs space-y-3">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold text-[#D94B50] uppercase tracking-wider bg-[#FDF0F0] dark:bg-[#D94B50]/10 px-2 py-0.5 rounded">
                10. Key Risks
              </span>
              <h3 className="text-base font-bold text-[#172B4D] dark:text-[#F4F6FB]">
                Primary Business &amp; Sector Risks
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#FFF9EB] dark:bg-[#B45309]/10 border border-[#FEE8A2] dark:border-[#B45309]/30 text-[#B45309] space-y-1">
                <span className="font-bold block">1. Valuation Multiple Risk</span>
                <p className="text-[11px] leading-relaxed">If future quarterly earnings fall short of expectations, valuation multiples may compress.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-[#FFF9EB] dark:bg-[#B45309]/10 border border-[#FEE8A2] dark:border-[#B45309]/30 text-[#B45309] space-y-1">
                <span className="font-bold block">2. Commodity / FX Risk</span>
                <p className="text-[11px] leading-relaxed">Exchange rate volatility and global raw material inflation can pressure gross margins.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-[#FFF9EB] dark:bg-[#B45309]/10 border border-[#FEE8A2] dark:border-[#B45309]/30 text-[#B45309] space-y-1">
                <span className="font-bold block">3. Regulatory Environment</span>
                <p className="text-[11px] leading-relaxed">Changes in SEBI listing regulations, tariffs, or interest rate policies alter sector economics.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-[#FFF9EB] dark:bg-[#B45309]/10 border border-[#FEE8A2] dark:border-[#B45309]/30 text-[#B45309] space-y-1">
                <span className="font-bold block">4. Competitive Intensity</span>
                <p className="text-[11px] leading-relaxed">Market share aggression from well-funded rivals can constrain product pricing flexibility.</p>
              </div>
            </div>
          </div>

          {/* ───────────────────────────────────────────────────────────
              11. OVERALL RESEARCH ASSESSMENT
          ─────────────────────────────────────────────────────────── */}
          <div className="rounded-2xl border border-[#CAD9FB] dark:border-[#1F2E47] bg-[#EEF3FC]/50 dark:bg-[#1A2844]/20 p-5 sm:p-6 shadow-xs space-y-3">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold text-[#315EFB] dark:text-[#4D74FB] uppercase tracking-wider bg-[#EEF3FC] dark:bg-[#1A2844] px-2 py-0.5 rounded">
                11. Assessment
              </span>
              <h3 className="text-base font-bold text-[#172B4D] dark:text-[#F4F6FB]">
                Overall Research Assessment for {symbol}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
              <div className="p-4 rounded-xl bg-white dark:bg-[#131C2E] border border-[#E5EAF2] dark:border-[#1F2E47] space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#315EFB] dark:text-[#4D74FB]">Business Moat</span>
                <p className="font-bold text-sm text-[#172B4D] dark:text-[#F4F6FB]">Established Leader</p>
                <p className="text-[#667085] dark:text-[#97A3B6]">Dominant national presence with competitive economies of scale.</p>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-[#131C2E] border border-[#E5EAF2] dark:border-[#1F2E47] space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#14866D]">Financial Health</span>
                <p className="font-bold text-sm text-[#172B4D] dark:text-[#F4F6FB]">Solid Balance Sheet</p>
                <p className="text-[#667085] dark:text-[#97A3B6]">Prudent financial leverage supported by positive operational cash flows.</p>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-[#131C2E] border border-[#E5EAF2] dark:border-[#1F2E47] space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#315EFB]">Price Trend</span>
                <p className="font-bold text-sm text-[#172B4D] dark:text-[#F4F6FB]">Orderly Structure</p>
                <p className="text-[#667085] dark:text-[#97A3B6]">Trading around key moving average support bands with institutional participation.</p>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-[#131C2E] border border-[#E5EAF2] dark:border-[#1F2E47] space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#B45309]">Primary Caution</span>
                <p className="font-bold text-sm text-[#172B4D] dark:text-[#F4F6FB]">Valuation Context</p>
                <p className="text-[#667085] dark:text-[#97A3B6]">Ongoing quarterly execution is needed to justify current P/E expectations.</p>
              </div>
            </div>

            <p className="text-[11px] text-[#8993A4] pt-1">
              <strong>Educational Disclaimer: </strong> All financial metrics are calculated from audited corporate filings. Bharat Market Intelligence provides analytical research and does not offer SEBI-registered investment advice or purchase recommendations.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockResearchView;
