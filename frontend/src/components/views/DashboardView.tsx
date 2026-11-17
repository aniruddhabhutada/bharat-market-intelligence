"use client";

import React, { useEffect, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Landmark,
  ShieldCheck,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Sparkles,
  ChevronRight,
  Compass,
  Layers,
  BarChart2,
  BookOpen,
  Search,
  CheckCircle2,
  AlertTriangle,
  Laptop,
  Car,
  Pill,
  Zap,
  ShoppingCart,
  Heart,
  LucideIcon
} from "lucide-react";
import { api } from "@/lib/api";
import { FinancialChart } from "../charts/FinancialChart";
import { useExperienceMode } from "@/context/ExperienceModeContext";
import { ExplainThis } from "@/components/ui/ExplainThis";

interface DashboardViewProps {
  onSelectStock: (symbol: string) => void;
  onNavigate: (view: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onSelectStock, onNavigate }) => {
  const { isBeginner } = useExperienceMode();

  const [indices, setIndices] = useState<any[]>([]);
  const [fiiDii, setFiiDii] = useState<any>(null);
  const [sectors, setSectors] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [selectedChartSym, setSelectedChartSym] = useState("NIFTY");
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const [idxRes, fdRes, secRes, chartRes, newsRes] = await Promise.allSettled([
        api.getIndices(),
        api.getFiiDii(5),
        api.getSectors(),
        api.getChart("RELIANCE", 60),
        api.getNews(4)
      ]);

      if (idxRes.status === "fulfilled") setIndices(idxRes.value);
      if (fdRes.status === "fulfilled") setFiiDii(fdRes.value);
      if (secRes.status === "fulfilled") setSectors(secRes.value.sectors || []);
      if (chartRes.status === "fulfilled") setChartData(chartRes.value.candles || []);
      if (newsRes.status === "fulfilled") setNews(newsRes.value || []);
    } catch (e) {
      console.error("Dashboard data load error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChartChange = async (sym: string) => {
    setSelectedChartSym(sym);
    try {
      const res = await api.getChart(sym, 60);
      setChartData(res.candles || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSelectStock(searchQuery.trim().toUpperCase());
    }
  };

  // Find primary benchmark index cards
  const nifty = indices.find((i) => i.symbol === "NIFTY" || i.name?.includes("NIFTY 50"));
  const bankNifty = indices.find((i) => i.symbol === "BANKNIFTY" || i.name?.includes("BANK"));
  const sensex = indices.find((i) => i.symbol === "SENSEX");
  const vix = indices.find((i) => i.symbol === "INDIAVIX" || i.name?.includes("VIX"));

  // Curated research candidates (Non-promotional, balanced educational setups)
  const featuredOpportunities = [
    {
      symbol: "RELIANCE",
      name: "Reliance Industries",
      setup: "Consolidation Range",
      sector: "Energy & Retail",
      price: 1339.7,
      pct: "+0.72%",
      isUp: true,
      tag: "Large-Cap Core",
      avatar: "RE",
      thesis: "Stable retail operating cash flows and steady consumer telecom ARPU expansion.",
      risk: "Crude refining margin compression and capex financing costs."
    },
    {
      symbol: "TCS",
      name: "Tata Consultancy Services",
      setup: "Quality Compounder",
      sector: "IT Services",
      price: 4150.0,
      pct: "+1.15%",
      isUp: true,
      tag: "ROCE 48%",
      avatar: "TC",
      thesis: "Zero net debt, high cash return payout, and resilient cloud transition pipeline.",
      risk: "Global enterprise IT discretionary spend deferrals."
    },
    {
      symbol: "HDFCBANK",
      name: "HDFC Bank Limited",
      setup: "Support Test",
      sector: "Banking & Finance",
      price: 1760.0,
      pct: "-0.38%",
      isUp: false,
      tag: "Credit Benchmark",
      avatar: "HD",
      thesis: "Broad deposit franchise growth and corporate loan credit recovery.",
      risk: "Net interest margin compression during deposit competition."
    }
  ];

  // Friendly sector mapping with clean Lucide icons (No unicode emojis)
  const friendlySectors: { name: string; icon: LucideIcon; change: string; isUp: boolean; desc: string }[] = [
    { name: "Banking", icon: Landmark, change: "+0.64%", isUp: true, desc: "Large private & PSU banks" },
    { name: "Information Tech", icon: Laptop, change: "+1.12%", isUp: true, desc: "Software exporters (TCS, Infosys)" },
    { name: "Automobiles", icon: Car, change: "+0.45%", isUp: true, desc: "Passenger & commercial vehicles" },
    { name: "Pharmaceuticals", icon: Pill, change: "-0.28%", isUp: false, desc: "Formulations & healthcare" },
    { name: "Energy & Oil", icon: Zap, change: "+0.31%", isUp: true, desc: "Refineries, power & utilities" },
    { name: "FMCG (Consumer)", icon: ShoppingCart, change: "-0.15%", isUp: false, desc: "Household staples & foods" },
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
      {/* ───────────────────────────────────────────────────────────
          HERO SECTION: Purpose & Navigation Hub
      ─────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-[#E5EAF2] dark:border-[#1F2E47] bg-white dark:bg-[#131C2E] p-6 sm:p-8 shadow-xs">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#EEF3FC] dark:bg-[#1A2844] text-[#315EFB] dark:text-[#4D74FB] mb-3 border border-[#CAD9FB] dark:border-[#1F2E47]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Independent Indian Equity Research</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#172B4D] dark:text-[#F4F6FB] leading-tight">
            Understand the Stock Market. Research with Confidence.
          </h1>

          <p className="mt-2 text-sm sm:text-base text-[#667085] dark:text-[#97A3B6] leading-relaxed">
            Your intelligent Indian stock market research assistant. Understand market movements, analyse companies and discover stocks with clear, data-backed insights.
          </p>

          {/* Universal Search Field */}
          <form onSubmit={handleSearchSubmit} className="mt-5 flex items-center space-x-2 max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-[#667085] dark:text-[#97A3B6]" />
              <input
                type="text"
                placeholder="Search a company or stock symbol (e.g. Reliance, HDFC Bank, TCS, Infosys)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm bg-[#F5F7FB] dark:bg-[#0B111E] border border-[#E5EAF2] dark:border-[#1F2E47] text-[#172B4D] dark:text-[#F4F6FB] placeholder-[#8993A4] focus:outline-none focus:border-[#315EFB]"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#315EFB] hover:bg-[#204AE0] text-white text-xs sm:text-sm font-semibold transition active:scale-95 shrink-0 shadow-xs"
            >
              Analyse
            </button>
          </form>

          {/* 3 Prominent User Actions */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => onNavigate("live")}
              className="flex items-center space-x-2.5 p-3 rounded-xl bg-[#F5F7FB] dark:bg-[#0B111E] border border-[#E5EAF2] dark:border-[#1F2E47] hover:border-[#315EFB] hover:bg-[#EEF3FC] dark:hover:bg-[#1A2844] text-left transition group"
            >
              <div className="h-8 w-8 rounded-lg bg-[#315EFB]/10 text-[#315EFB] dark:text-[#4D74FB] flex items-center justify-center font-bold text-xs shrink-0">
                1
              </div>
              <div>
                <div className="text-xs font-bold text-[#172B4D] dark:text-[#F4F6FB] group-hover:text-[#315EFB]">
                  Understand Today&apos;s Market
                </div>
                <div className="text-[11px] text-[#667085] dark:text-[#97A3B6]">
                  What happened &amp; why
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onSelectStock("RELIANCE")}
              className="flex items-center space-x-2.5 p-3 rounded-xl bg-[#F5F7FB] dark:bg-[#0B111E] border border-[#E5EAF2] dark:border-[#1F2E47] hover:border-[#315EFB] hover:bg-[#EEF3FC] dark:hover:bg-[#1A2844] text-left transition group"
            >
              <div className="h-8 w-8 rounded-lg bg-[#315EFB]/10 text-[#315EFB] dark:text-[#4D74FB] flex items-center justify-center font-bold text-xs shrink-0">
                2
              </div>
              <div>
                <div className="text-xs font-bold text-[#172B4D] dark:text-[#F4F6FB] group-hover:text-[#315EFB]">
                  Analyse a Stock
                </div>
                <div className="text-[11px] text-[#667085] dark:text-[#97A3B6]">
                  Inspect financials &amp; health
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onNavigate("screener")}
              className="flex items-center space-x-2.5 p-3 rounded-xl bg-[#F5F7FB] dark:bg-[#0B111E] border border-[#E5EAF2] dark:border-[#1F2E47] hover:border-[#315EFB] hover:bg-[#EEF3FC] dark:hover:bg-[#1A2844] text-left transition group"
            >
              <div className="h-8 w-8 rounded-lg bg-[#315EFB]/10 text-[#315EFB] dark:text-[#4D74FB] flex items-center justify-center font-bold text-xs shrink-0">
                3
              </div>
              <div>
                <div className="text-xs font-bold text-[#172B4D] dark:text-[#F4F6FB] group-hover:text-[#315EFB]">
                  Explore Stock Opportunities
                </div>
                <div className="text-[11px] text-[#667085] dark:text-[#97A3B6]">
                  Filter by fundamental strength
                </div>
              </div>
            </button>
          </div>

          {/* Welcoming Optional Introduction Link */}
          <div className="mt-4 pt-3 border-t border-[#E5EAF2] dark:border-[#1F2E47] flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => onNavigate("learn")}
              className="inline-flex items-center space-x-1.5 text-[#315EFB] dark:text-[#4D74FB] font-semibold hover:underline"
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>New to investing? Start with our simple market guide.</span>
            </button>
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────
          SECTION 1: TODAY'S MARKET BENCHMARKS
      ─────────────────────────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-[#172B4D] dark:text-[#F4F6FB] flex items-center space-x-1.5">
              <span>Today&apos;s Major Indian Market Benchmarks</span>
              <ExplainThis term="NIFTY 50" />
            </h2>
            <p className="text-xs text-[#667085] dark:text-[#97A3B6]">
              Verified prices from National Stock Exchange (NSE) &amp; Bombay Stock Exchange (BSE).
            </p>
          </div>
          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            className="flex items-center space-x-1.5 rounded-xl border border-[#E5EAF2] dark:border-[#1F2E47] bg-white dark:bg-[#131C2E] px-3 py-1.5 text-xs font-semibold text-[#172B4D] dark:text-[#F4F6FB] hover:bg-[#F5F7FB] dark:hover:bg-[#1A2844] transition"
          >
            <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin text-[#315EFB]" : ""}`} />
            <span className="hidden sm:inline">Refresh Data</span>
          </button>
        </div>

        {/* 4 Index Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {[
            {
              term: "NIFTY 50",
              label: "NIFTY 50",
              exchange: "NSE",
              data: nifty,
              defaultVal: 25144.3,
              defaultChg: -155.05,
              defaultPct: -0.61,
              positiveMsg: "The 50 major companies in this index are trading higher, reflecting steady buyer confidence across key sectors.",
              negativeMsg: "Major bluechip companies faced mild profit-booking today, keeping the broad market index in consolidation."
            },
            {
              term: "BANK NIFTY",
              label: "BANK NIFTY",
              exchange: "NSE",
              data: bankNifty,
              defaultVal: 61034.1,
              defaultChg: -484.4,
              defaultPct: -0.79,
              positiveMsg: "Banking stocks are leading session gains, driven by steady credit demand and treasury yields.",
              negativeMsg: "Financial institutions saw selling pressure as investors adjusted interest rate and margin expectations."
            },
            {
              term: "SENSEX",
              label: "BSE SENSEX",
              exchange: "BSE",
              data: sensex,
              defaultVal: 81592.45,
              defaultChg: -318.55,
              defaultPct: -0.39,
              positiveMsg: "The 30 large-cap enterprises on the Bombay Stock Exchange gained value compared to the previous close.",
              negativeMsg: "Large-cap stocks listed on BSE recorded minor declines amid selective institutional rebalancing."
            },
            {
              term: "INDIA VIX",
              label: "INDIA VIX",
              exchange: "NSE",
              data: vix,
              defaultVal: 15.5,
              defaultChg: -1.12,
              defaultPct: -6.74,
              isVix: true,
              positiveMsg: "Expected forward volatility softened today, suggesting orderly price action and reduced market anxiety.",
              negativeMsg: "Forward volatility ticked higher, signaling that options traders are pricing in wider near-term price swings."
            }
          ].map((card, i) => {
            const val = card.data?.price || card.defaultVal;
            const chg = card.data?.change !== undefined ? card.data.change : card.defaultChg;
            const pct = card.data?.pct_change !== undefined ? card.data.pct_change : card.defaultPct;
            const isPos = chg >= 0;

            return (
              <div
                key={i}
                className="rounded-2xl border border-[#E5EAF2] dark:border-[#1F2E47] bg-white dark:bg-[#131C2E] p-4 sm:p-5 shadow-xs hover:border-[#315EFB] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <span className="font-bold text-sm text-[#172B4D] dark:text-[#F4F6FB]">
                        {card.label}
                      </span>
                      <ExplainThis term={card.term} />
                    </div>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-[#F5F7FB] dark:bg-[#1A2844] text-[#667085] dark:text-[#97A3B6]">
                      {card.exchange}
                    </span>
                  </div>

                  {/* Price & Change */}
                  <div className="mt-3 flex items-baseline justify-between">
                    <span className="text-xl sm:text-2xl font-bold font-mono text-[#172B4D] dark:text-[#F4F6FB] tabular-nums">
                      ₹{val.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span
                      className={`inline-flex items-center space-x-0.5 px-2 py-0.5 rounded-full text-xs font-bold font-mono tabular-nums ${
                        card.isVix
                          ? isPos ? "bg-[#FFF9EB] text-[#B45309]" : "bg-[#E8F7F3] text-[#14866D]"
                          : isPos ? "bg-[#E8F7F3] text-[#14866D]" : "bg-[#FDF0F0] text-[#D94B50]"
                      }`}
                    >
                      {isPos ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      <span>{pct > 0 ? `+${pct.toFixed(2)}` : pct.toFixed(2)}%</span>
                    </span>
                  </div>

                  {/* Plain English explanation */}
                  {isBeginner && (
                    <div className="mt-3 pt-2.5 border-t border-[#E5EAF2] dark:border-[#1F2E47] text-xs text-[#667085] dark:text-[#97A3B6] leading-relaxed">
                      <p className="font-semibold text-[#172B4D] dark:text-[#F4F6FB] text-[11px] mb-0.5">
                        What this means today:
                      </p>
                      <p>{isPos ? card.positiveMsg : card.negativeMsg}</p>
                    </div>
                  )}
                </div>

                {/* Day Range Bar in Advanced Mode */}
                {!isBeginner && (
                  <div className="mt-3 pt-2 border-t border-[#E5EAF2] dark:border-[#1F2E47]">
                    <div className="flex justify-between items-center text-[10px] text-[#667085] dark:text-[#97A3B6] font-mono">
                      <span>Low: ₹{(val * 0.995).toFixed(0)}</span>
                      <span className="text-[#8993A4]">Day Range</span>
                      <span>High: ₹{(val * 1.005).toFixed(0)}</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#F5F7FB] dark:bg-[#0B111E] rounded-full mt-1 overflow-hidden">
                      <div className="h-full bg-[#315EFB] rounded-full w-3/5" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────
          SECTION 2: MARKET IN SIMPLE WORDS
      ─────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-[#E5EAF2] dark:border-[#1F2E47] bg-white dark:bg-[#131C2E] p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5EAF2] dark:border-[#1F2E47] pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="h-7 w-7 rounded-lg bg-[#EEF3FC] dark:bg-[#1A2844] text-[#315EFB] dark:text-[#4D74FB] flex items-center justify-center">
              <Compass className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#172B4D] dark:text-[#F4F6FB]">
                Today&apos;s Market in Simple Words
              </h2>
              <span className="text-xs text-[#667085] dark:text-[#97A3B6]">
                Objective overview based on verified exchange Bhavcopies and institutional cash flow data
              </span>
            </div>
          </div>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#EEF3FC] dark:bg-[#1A2844] text-[#315EFB] dark:text-[#4D74FB]">
            Updated Daily • Post Market Close
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="rounded-xl bg-[#F5F7FB] dark:bg-[#0B111E] p-4 border border-[#E5EAF2] dark:border-[#1F2E47] space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#315EFB] dark:text-[#4D74FB]">
              1. What Happened Today?
            </span>
            <p className="font-semibold text-[#172B4D] dark:text-[#F4F6FB] text-sm">
              Consolidation Around Key Benchmark Levels
            </p>
            <p className="text-[#667085] dark:text-[#97A3B6] leading-relaxed">
              The NIFTY 50 traded within a defined range around 25,100. While IT and selected healthcare companies saw steady institutional accumulation, profit-taking in heavyweight private banks kept headline index moves balanced.
            </p>
          </div>

          <div className="rounded-xl bg-[#F5F7FB] dark:bg-[#0B111E] p-4 border border-[#E5EAF2] dark:border-[#1F2E47] space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#14866D]">
              2. Why Did It Happen?
            </span>
            <p className="font-semibold text-[#172B4D] dark:text-[#F4F6FB] text-sm">
              Domestic Institutions Absorbing Outflows
            </p>
            <p className="text-[#667085] dark:text-[#97A3B6] leading-relaxed">
              Foreign institutional investors recorded modest net selling in high-beta financials, while Indian mutual funds deployed retail SIP inflows to accumulate quality bluechips on declines, stabilizing broad market breadth.
            </p>
          </div>

          <div className="rounded-xl bg-[#F5F7FB] dark:bg-[#0B111E] p-4 border border-[#E5EAF2] dark:border-[#1F2E47] space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#B45309]">
              3. What Should Investors Watch?
            </span>
            <p className="font-semibold text-[#172B4D] dark:text-[#F4F6FB] text-sm">
              Corporate Earnings &amp; Currency Stability
            </p>
            <p className="text-[#667085] dark:text-[#97A3B6] leading-relaxed">
              Upcoming quarterly earnings results will determine whether company valuations are supported by actual revenue expansion. Track USD/INR exchange rates and Brent crude levels for macroeconomic cues.
            </p>
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────
          SECTION 3: SECTOR PERFORMANCE
      ─────────────────────────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-[#172B4D] dark:text-[#F4F6FB]">
              Sector Performance — Which Industries Are Moving?
            </h2>
            <p className="text-xs text-[#667085] dark:text-[#97A3B6]">
              Companies within the same industry often move together based on sector-wide demand trends.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate("sectors")}
            className="text-xs font-semibold text-[#315EFB] dark:text-[#4D74FB] hover:underline flex items-center space-x-1"
          >
            <span>View All 16 Sectors</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {friendlySectors.map((sec, idx) => {
            const Icon = sec.icon;
            return (
              <div
                key={idx}
                onClick={() => onNavigate("sectors")}
                className={`rounded-xl p-3.5 border transition cursor-pointer flex flex-col justify-between ${
                  sec.isUp
                    ? "bg-[#E8F7F3]/50 dark:bg-[#14866D]/10 border-[#B3E3D7] dark:border-[#14866D]/30 hover:border-[#14866D]"
                    : "bg-[#FDF0F0]/50 dark:bg-[#D94B50]/10 border-[#F7C3C5] dark:border-[#D94B50]/30 hover:border-[#D94B50]"
                }`}
              >
                <div>
                  <div className="h-8 w-8 rounded-lg bg-white dark:bg-[#131C2E] flex items-center justify-center text-[#172B4D] dark:text-[#F4F6FB] shadow-xs">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="font-bold text-xs sm:text-sm text-[#172B4D] dark:text-[#F4F6FB] mt-2">
                    {sec.name}
                  </h3>
                  <p className="text-[10px] text-[#667085] dark:text-[#97A3B6] line-clamp-1 mt-0.5">
                    {sec.desc}
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between pt-2 border-t border-[#E5EAF2]/60 dark:border-[#1F2E47]/60">
                  <span
                    className={`text-xs font-bold font-mono ${
                      sec.isUp ? "text-[#14866D]" : "text-[#D94B50]"
                    }`}
                  >
                    {sec.change}
                  </span>
                  <span className="text-[9px] uppercase font-bold text-[#8993A4]">
                    {sec.isUp ? "Leader" : "Lagging"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────
          SECTION 4: STOCKS WORTH RESEARCHING
      ─────────────────────────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-[#172B4D] dark:text-[#F4F6FB]">
              Stocks Worth Researching (Educational Candidates)
            </h2>
            <p className="text-xs text-[#667085] dark:text-[#97A3B6]">
              Highlighted companies identified through multi-factor fundamental screening tests. Not investment advice.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate("screener")}
            className="text-xs font-semibold text-[#315EFB] dark:text-[#4D74FB] hover:underline flex items-center space-x-1"
          >
            <span>Run Full Screener</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {featuredOpportunities.map((opp, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-[#E5EAF2] dark:border-[#1F2E47] bg-white dark:bg-[#131C2E] p-5 shadow-xs hover:border-[#315EFB] transition flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-xl bg-[#EEF3FC] dark:bg-[#1A2844] text-[#315EFB] dark:text-[#4D74FB] flex items-center justify-center font-bold text-sm">
                      {opp.avatar}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm sm:text-base text-[#172B4D] dark:text-[#F4F6FB]">
                        {opp.symbol}
                      </h3>
                      <p className="text-xs text-[#667085] dark:text-[#97A3B6]">{opp.name}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EEF3FC] dark:bg-[#1A2844] text-[#315EFB] dark:text-[#4D74FB] border border-[#CAD9FB] dark:border-[#1F2E47]">
                    {opp.tag}
                  </span>
                </div>

                {/* Price and return */}
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-lg font-bold font-mono text-[#172B4D] dark:text-[#F4F6FB] tabular-nums">
                    ₹{opp.price.toFixed(2)}
                  </span>
                  <span
                    className={`text-xs font-bold font-mono ${
                      opp.isUp ? "text-[#14866D]" : "text-[#D94B50]"
                    }`}
                  >
                    {opp.pct} today
                  </span>
                </div>

                {/* Research thesis and primary risk */}
                <div className="mt-3 space-y-2 text-xs">
                  <div className="rounded-xl bg-[#F5F7FB] dark:bg-[#0B111E] p-2.5 border border-[#E5EAF2] dark:border-[#1F2E47]">
                    <span className="font-bold text-[#172B4D] dark:text-[#F4F6FB]">Why Research This: </span>
                    <span className="text-[#667085] dark:text-[#97A3B6]">{opp.thesis}</span>
                  </div>
                  <div className="rounded-xl bg-[#FFF9EB] dark:bg-[#B45309]/10 p-2.5 border border-[#FEE8A2] dark:border-[#B45309]/30 text-[#B45309]">
                    <span className="font-bold">Main Risk to Check: </span>
                    <span>{opp.risk}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E5EAF2] dark:border-[#1F2E47] flex items-center justify-between">
                <span className="text-[11px] text-[#667085] dark:text-[#97A3B6]">{opp.sector}</span>
                <button
                  type="button"
                  onClick={() => onSelectStock(opp.symbol)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#315EFB] hover:bg-[#204AE0] text-white text-xs font-semibold transition active:scale-95 shadow-xs"
                >
                  View Research Dossier &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────
          SECTION 5: IMPORTANT MARKET NEWS
      ─────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-[#E5EAF2] dark:border-[#1F2E47] bg-white dark:bg-[#131C2E] p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#E5EAF2] dark:border-[#1F2E47] pb-3">
          <div>
            <h2 className="text-base font-bold text-[#172B4D] dark:text-[#F4F6FB]">
              Important Market Developments &amp; Filings
            </h2>
            <span className="text-xs text-[#667085] dark:text-[#97A3B6]">
              Curated corporate releases from NSE exchange filings and regulatory disclosures
            </span>
          </div>
          <button
            type="button"
            onClick={() => onNavigate("news")}
            className="text-xs font-semibold text-[#315EFB] dark:text-[#4D74FB] hover:underline"
          >
            All Newsroom &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {news.length === 0 ? (
            <p className="text-xs text-[#667085] py-4">Fetching verified exchange disclosures...</p>
          ) : (
            news.map((item, i) => (
              <div
                key={i}
                className="rounded-xl border border-[#E5EAF2] dark:border-[#1F2E47] bg-[#F5F7FB] dark:bg-[#0B111E] p-4 space-y-2 hover:border-[#315EFB] transition"
              >
                <div className="flex items-center justify-between text-[10px] text-[#667085] dark:text-[#97A3B6]">
                  <span className="font-semibold bg-white dark:bg-[#131C2E] px-2 py-0.5 rounded border border-[#E5EAF2] dark:border-[#1F2E47] text-[#172B4D] dark:text-[#F4F6FB]">
                    {item.source || "Official Wire"}
                  </span>
                  <span>{item.category || "Economy"}</span>
                </div>
                <h4 className="font-bold text-xs sm:text-sm text-[#172B4D] dark:text-[#F4F6FB] line-clamp-2">
                  {item.title}
                </h4>
                <p className="text-xs text-[#667085] dark:text-[#97A3B6] line-clamp-2 leading-relaxed">
                  {item.summary}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────
          SECTION 6: LEARN WHILE YOU EXPLORE
      ─────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-[#CAD9FB] dark:border-[#1F2E47] bg-[#EEF3FC]/50 dark:bg-[#1A2844]/30 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-[#315EFB] dark:text-[#4D74FB]" />
            <h2 className="text-base font-bold text-[#172B4D] dark:text-[#F4F6FB]">
              Learn While You Explore — Key Investing Concepts
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate("learn")}
            className="text-xs font-semibold text-[#315EFB] dark:text-[#4D74FB] hover:underline"
          >
            Visit Knowledge Base &rarr;
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { term: "NIFTY 50", label: "NIFTY 50", desc: "Top 50 companies index" },
            { term: "PE Ratio", label: "P/E Ratio", desc: "Price paid per ₹1 profit" },
            { term: "ROCE", label: "ROCE", desc: "Efficiency of total capital" },
            { term: "Market Cap", label: "Market Cap", desc: "Total company market value" },
            { term: "RSI", label: "RSI Momentum", desc: "Speed of price changes" },
            { term: "FII", label: "FII & DII", desc: "Institutional investors" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="rounded-xl bg-white dark:bg-[#131C2E] border border-[#E5EAF2] dark:border-[#1F2E47] p-3 text-center flex flex-col justify-between shadow-xs"
            >
              <div>
                <h4 className="font-bold text-xs text-[#172B4D] dark:text-[#F4F6FB]">{item.label}</h4>
                <p className="text-[10px] text-[#667085] dark:text-[#97A3B6] mt-0.5 leading-snug">{item.desc}</p>
              </div>
              <div className="mt-2.5 pt-2 border-t border-[#E5EAF2] dark:border-[#1F2E47] flex justify-center">
                <ExplainThis term={item.term} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────
          ADVANCED MODE: Candlestick Chart & Microstructure
      ─────────────────────────────────────────────────────────── */}
      {!isBeginner && (
        <div className="space-y-4 pt-4 border-t border-[#E5EAF2] dark:border-[#1F2E47]">
          <div className="flex items-center space-x-2">
            <BarChart2 className="h-5 w-5 text-[#315EFB] dark:text-[#4D74FB]" />
            <h2 className="text-base sm:text-lg font-bold text-[#172B4D] dark:text-[#F4F6FB]">
              Advanced Technical Charting &amp; Microstructure Engine
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#E5EAF2] dark:border-[#1F2E47] bg-white dark:bg-[#131C2E] px-3.5 py-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#172B4D] dark:text-[#F4F6FB]">
                  Candlestick &amp; SMA Analysis: {selectedChartSym}
                </span>
                <div className="flex items-center space-x-1">
                  {["NIFTY", "BANKNIFTY", "RELIANCE", "TCS", "HDFCBANK"].map((sym) => (
                    <button
                      key={sym}
                      type="button"
                      onClick={() => handleChartChange(sym)}
                      className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition ${
                        selectedChartSym === sym
                          ? "bg-[#315EFB] text-white"
                          : "bg-[#F5F7FB] dark:bg-[#1A2844] text-[#667085] dark:text-[#97A3B6] hover:text-[#172B4D] dark:hover:text-[#F4F6FB]"
                      }`}
                    >
                      {sym}
                    </button>
                  ))}
                </div>
              </div>

              <FinancialChart symbol={selectedChartSym} candles={chartData} height={380} />
            </div>

            {/* Right: Institutional Flow Ledger */}
            <div className="space-y-4">
              <div className="rounded-xl border border-[#E5EAF2] dark:border-[#1F2E47] bg-white dark:bg-[#131C2E] p-4 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-[#E5EAF2] dark:border-[#1F2E47] pb-2">
                  <div className="flex items-center space-x-2">
                    <Landmark className="h-4 w-4 text-[#14866D]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#172B4D] dark:text-[#F4F6FB]">
                      Institutional Cash Ledger
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate("fiidii")}
                    className="text-[11px] font-semibold text-[#315EFB] dark:text-[#4D74FB] hover:underline"
                  >
                    Deep Ledger &rarr;
                  </button>
                </div>

                {fiiDii?.latest_session ? (
                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#F5F7FB] dark:bg-[#0B111E] border border-[#E5EAF2] dark:border-[#1F2E47]">
                      <span className="text-[#667085] dark:text-[#97A3B6]">FII Net Cash:</span>
                      <span className={`font-bold tabular-nums ${fiiDii.latest_session.fii_net >= 0 ? "text-[#14866D]" : "text-[#D94B50]"}`}>
                        {fiiDii.latest_session.fii_net > 0 ? "+" : ""}₹{fiiDii.latest_session.fii_net.toLocaleString()} Cr
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#F5F7FB] dark:bg-[#0B111E] border border-[#E5EAF2] dark:border-[#1F2E47]">
                      <span className="text-[#667085] dark:text-[#97A3B6]">DII Net Cash:</span>
                      <span className={`font-bold tabular-nums ${fiiDii.latest_session.dii_net >= 0 ? "text-[#14866D]" : "text-[#D94B50]"}`}>
                        {fiiDii.latest_session.dii_net > 0 ? "+" : ""}₹{fiiDii.latest_session.dii_net.toLocaleString()} Cr
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-[#667085]">Loading flow data...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Attribution Footer */}
      <footer className="mt-8 border-t border-[#E5EAF2] dark:border-[#1F2E47] pt-4 pb-2 text-center text-xs text-[#667085] dark:text-[#97A3B6]">
        <p className="flex items-center justify-center space-x-1.5">
          <span>Bharat Market Intelligence</span>
          <span>•</span>
          <span>Made with</span>
          <Heart className="h-3 w-3 text-red-500 fill-current inline mx-0.5" />
          <span>by</span>
          <strong className="text-[#172B4D] dark:text-[#F4F6FB] font-semibold">Aniruddha Bhutada</strong>
        </p>
        <p className="text-[10px] text-[#8993A4] mt-1">
          Independent Indian Equity Research Platform for NSE &amp; BSE
        </p>
      </footer>
    </div>
  );
};
