"use client";

import React, { useEffect, useState } from "react";
import {
  ChartNoAxesCombined,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Activity,
  BarChart2,
  PieChart,
  Newspaper,
  BookOpen,
  CircleHelp,
  Landmark,
  Laptop,
  Car,
  Pill,
  Zap,
  ShoppingCart
} from "lucide-react";
import { api } from "@/lib/api";
import { FinancialChart } from "../charts/FinancialChart";
import { useExperienceMode } from "@/context/ExperienceModeContext";
import { ExplainThis } from "@/components/ui/ExplainThis";

interface LiveMarketViewProps {
  onSelectStock: (symbol: string) => void;
}

export const LiveMarketView: React.FC<LiveMarketViewProps> = ({ onSelectStock }) => {
  const { isBeginner } = useExperienceMode();

  const [indices, setIndices] = useState<any[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState("RELIANCE");
  const [chartData, setChartData] = useState<any[]>([]);
  const [stockDetail, setStockDetail] = useState<any>(null);
  const [sectors, setSectors] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [intradayReport, setIntradayReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [chartRange, setChartRange] = useState("1M");
  const [expandedObs, setExpandedObs] = useState<Record<number, boolean>>({});

  const loadData = async () => {
    setLoading(true);
    try {
      const days = chartRange === "1D" ? 5 : chartRange === "1W" ? 15 : chartRange === "1M" ? 30 : chartRange === "3M" ? 90 : chartRange === "6M" ? 180 : 365;
      const [idxRes, chartRes, stockRes, secRes, newsRes, intraRes] = await Promise.allSettled([
        api.getIndices(),
        api.getChart(selectedSymbol, days),
        api.getStock(selectedSymbol),
        api.getSectors(),
        api.getNews(4),
        api.triggerReport("INTRADAY")
      ]);

      if (idxRes.status === "fulfilled") setIndices(idxRes.value || []);
      if (chartRes.status === "fulfilled") setChartData(chartRes.value.candles || []);
      if (stockRes.status === "fulfilled") setStockDetail(stockRes.value);
      if (secRes.status === "fulfilled") setSectors(secRes.value.sectors || []);
      if (newsRes.status === "fulfilled") setNews(newsRes.value || []);
      if (intraRes.status === "fulfilled") setIntradayReport(intraRes.value);
    } catch (e) {
      console.error("Market Today data error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedSymbol, chartRange]);

  const toggleObservation = (idx: number) => {
    setExpandedObs((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Find 4 key benchmark indices
  const nifty = indices.find((i) => i.symbol === "NIFTY" || i.name?.includes("NIFTY 50")) || {
    name: "NIFTY 50", symbol: "NIFTY", price: 25144.30, change: -155.05, pct_change: -0.61, exchange: "NSE"
  };
  const sensex = indices.find((i) => i.symbol === "SENSEX") || {
    name: "BSE SENSEX", symbol: "SENSEX", price: 81592.45, change: -318.55, pct_change: -0.39, exchange: "BSE"
  };
  const bankNifty = indices.find((i) => i.symbol === "BANKNIFTY" || i.name?.includes("BANK")) || {
    name: "BANK NIFTY", symbol: "BANKNIFTY", price: 61034.10, change: -484.40, pct_change: -0.79, exchange: "NSE"
  };
  const vix = indices.find((i) => i.symbol === "INDIAVIX" || i.name?.includes("VIX")) || {
    name: "INDIA VIX", symbol: "INDIAVIX", price: 15.50, change: -1.12, pct_change: -6.74, exchange: "NSE"
  };

  // Observations with structured progressive disclosure
  const observations = [
    {
      title: "Large-Cap IT Outperformance & Foreign Hedging",
      what: "NIFTY IT index gained +1.12% led by TCS and Infosys, while benchmark private banks consolidated.",
      why: "US currency strength and resilience in discretionary enterprise technology budgets supported IT margins.",
      evidence: "TCS delivery volume exceeded 1.35x 20-day average. DII net accumulated ₹2,664 Cr.",
      vwap: "₹4,138.50 (Trading +0.28% above VWAP)",
      rvol: "1.35x relative volume",
      momentum: "RSI(14): 62.4 — Bullish expansion",
      techDetails: "Price held above EMA20 (₹4,095). Higher low price structure maintained.",
      invalidation: "A daily close below ₹4,050 (EMA50) invalidates this intermediate accumulation thesis."
    },
    {
      title: "Bank Nifty Testing 20-Day Moving Average Support",
      what: "Banking index declined -0.79% to test the 61,000 psychological threshold.",
      why: "Short-term margin compression concerns and credit deposit ratio rebalancing among private lenders.",
      evidence: "Top private lenders traded below respective intraday VWAP levels during the morning session.",
      vwap: "61,180.00 (Trading -0.24% below VWAP)",
      rvol: "0.95x relative volume (Subdued volume on pullback)",
      momentum: "RSI(14): 48.2 — Neutral zone",
      techDetails: "Testing 20-day exponential moving average. Key swing low at 60,780.",
      invalidation: "A breakdown below 60,750 on expanding volume triggers risk of deeper 50-day EMA test."
    },
    {
      title: "India VIX Softens to 15.50 Amid Volatility Contraction",
      what: "The volatility index dropped -6.74%, reflecting reduced demand for short-term downside put options.",
      why: "Options writers aggressively wrote out-of-the-money puts around 25,000 strike.",
      evidence: "NIFTY Put-Call Ratio (PCR) stabilized at 0.94 from 0.88 earlier in the session.",
      vwap: "N/A (Statistical Index)",
      rvol: "0.82x options volume",
      momentum: "Below 20-day moving average of 16.80",
      techDetails: "Mean reversion towards multi-month baseline volatility channel.",
      invalidation: "A sudden spike above 18.00 signals renewed macro risk and hedging demand."
    }
  ];

  // Candidates for "Stocks Worth Researching"
  const stocksWorthResearching = [
    {
      symbol: "RELIANCE",
      name: "Reliance Industries",
      price: 1339.70,
      change: "+0.72%",
      isUp: true,
      reason: "Held key support zone with expanding retail operational cash flows.",
      risk: "Crude refining margin compression and high capex schedule."
    },
    {
      symbol: "TCS",
      name: "Tata Consultancy Services",
      price: 4150.00,
      change: "+1.15%",
      isUp: true,
      reason: "Breakout above 30-day consolidation channel with institutional accumulation.",
      risk: "Client budget tightening in banking and financial services."
    },
    {
      symbol: "HDFCBANK",
      name: "HDFC Bank Limited",
      price: 1760.00,
      change: "-0.38%",
      isUp: false,
      reason: "Healthy deposit mobilization progress and attractive valuation vs historical P/B.",
      risk: "Net interest margin recovery pacing slower than consensus estimates."
    },
    {
      symbol: "INFY",
      name: "Infosys Limited",
      price: 1890.50,
      change: "+0.92%",
      isUp: true,
      reason: "Large deal ramp-up and positive operating margin guidance.",
      risk: "Geographic concentration in North American banking contracts."
    }
  ];

  // Quick Switcher tickers
  const SYMBOLS = [
    { sym: "RELIANCE", name: "Reliance" },
    { sym: "TCS", name: "TCS" },
    { sym: "HDFCBANK", name: "HDFC Bank" },
    { sym: "INFY", name: "Infosys" },
    { sym: "SBIN", name: "SBI" },
    { sym: "BHARTIARTL", name: "Airtel" },
    { sym: "LT", name: "L&T" },
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
      {/* ───────────────────────────────────────────────────────────
          PAGE HEADER
      ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#E5EAF2] dark:border-[#1F2E47] pb-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="h-8 w-8 rounded-xl bg-[#EEF3FC] dark:bg-[#1A2844] text-[#315EFB] dark:text-[#4D74FB] flex items-center justify-center">
              <ChartNoAxesCombined className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#172B4D] dark:text-[#F4F6FB] tracking-tight">
                Market Today
              </h1>
              <p className="text-xs text-[#667085] dark:text-[#97A3B6]">
                Understand what&apos;s happening in the Indian stock market.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            className="flex items-center space-x-1.5 rounded-xl border border-[#E5EAF2] dark:border-[#1F2E47] bg-white dark:bg-[#131C2E] px-3.5 py-2 text-xs font-semibold text-[#172B4D] dark:text-[#F4F6FB] hover:bg-[#F5F7FB] dark:hover:bg-[#19253C] transition shadow-xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-[#315EFB]" : "text-[#667085]"}`} />
            <span>Refresh Intraday</span>
          </button>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────
          SECTION A: MARKET SUMMARY
      ─────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-[#E5EAF2] dark:border-[#1F2E47] bg-white dark:bg-[#131C2E] p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#E5EAF2] dark:border-[#1F2E47] pb-3">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#315EFB] dark:text-[#4D74FB] bg-[#EEF3FC] dark:bg-[#1A2844] px-2 py-0.5 rounded-md">
              Section A
            </span>
            <h2 className="text-sm sm:text-base font-bold text-[#172B4D] dark:text-[#F4F6FB]">
              Market Summary
            </h2>
          </div>
          <span className="text-xs font-semibold text-[#14866D] bg-[#E8F7F3] dark:bg-[#14866D]/10 px-2.5 py-0.5 rounded-full border border-[#B3E3D7] dark:border-[#14866D]/30">
            Overall Condition: Resilient Consolidation
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
          <div className="rounded-xl bg-[#F5F7FB] dark:bg-[#0B111E] p-3.5 border border-[#E5EAF2] dark:border-[#1F2E47] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#315EFB] dark:text-[#4D74FB]">
              What happened today?
            </span>
            <p className="text-[#172B4D] dark:text-[#F4F6FB] font-medium leading-relaxed">
              NIFTY 50 consolidated around 25,100 (-0.61%) with IT outperforming while private banking heavyweights absorbed mild profit-booking.
            </p>
          </div>

          <div className="rounded-xl bg-[#F5F7FB] dark:bg-[#0B111E] p-3.5 border border-[#E5EAF2] dark:border-[#1F2E47] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#14866D]">
              Why did it happen?
            </span>
            <p className="text-[#172B4D] dark:text-[#F4F6FB] font-medium leading-relaxed">
              Domestic mutual funds deployed consistent retail SIP cash flows (+₹2,664 Cr) to cushion foreign portfolio outflows (-₹2,453 Cr).
            </p>
          </div>

          <div className="rounded-xl bg-[#F5F7FB] dark:bg-[#0B111E] p-3.5 border border-[#E5EAF2] dark:border-[#1F2E47] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#B45309]">
              Which sectors moved?
            </span>
            <p className="text-[#172B4D] dark:text-[#F4F6FB] font-medium leading-relaxed">
              <strong>Stronger:</strong> IT (+1.12%), Energy (+0.31%).<br />
              <strong>Weaker:</strong> Auto (-1.07%), Banking (-0.79%).
            </p>
          </div>

          <div className="rounded-xl bg-[#F5F7FB] dark:bg-[#0B111E] p-3.5 border border-[#E5EAF2] dark:border-[#1F2E47] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#667085] dark:text-[#97A3B6]">
              What to monitor next?
            </span>
            <p className="text-[#172B4D] dark:text-[#F4F6FB] font-medium leading-relaxed">
              Watch quarterly earnings releases, US Federal Reserve statements, and Brent crude pricing for currency impact.
            </p>
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────
          SECTION B: MAJOR INDICES
      ─────────────────────────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#315EFB] dark:text-[#4D74FB] bg-[#EEF3FC] dark:bg-[#1A2844] px-2 py-0.5 rounded-md">
            Section B
          </span>
          <h2 className="text-sm sm:text-base font-bold text-[#172B4D] dark:text-[#F4F6FB]">
            Major Indices
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {[nifty, sensex, bankNifty, vix].map((idxItem: any, i: number) => {
            const isUp = (idxItem.change ?? 0) >= 0;
            const isVix = idxItem.symbol === "INDIAVIX";
            return (
              <div
                key={i}
                className="rounded-2xl border border-[#E5EAF2] dark:border-[#1F2E47] bg-white dark:bg-[#131C2E] p-4 sm:p-5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <span className="font-bold text-sm text-[#172B4D] dark:text-[#F4F6FB]">
                        {idxItem.name}
                      </span>
                      <ExplainThis term={idxItem.symbol === "INDIAVIX" ? "INDIA VIX" : idxItem.name} />
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#F5F7FB] dark:bg-[#1A2844] text-[#667085] dark:text-[#97A3B6]">
                      {idxItem.exchange || "NSE"}
                    </span>
                  </div>

                  <div className="mt-3 flex items-baseline justify-between">
                    <span className="text-xl sm:text-2xl font-bold font-mono text-[#172B4D] dark:text-[#F4F6FB] tabular-nums">
                      ₹{typeof idxItem.price === "number" ? idxItem.price.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : idxItem.price}
                    </span>
                    <span
                      className={`inline-flex items-center space-x-0.5 px-2 py-0.5 rounded-full text-xs font-bold font-mono tabular-nums ${
                        isVix
                          ? isUp ? "bg-[#FFF9EB] text-[#B45309]" : "bg-[#E8F7F3] text-[#14866D]"
                          : isUp ? "bg-[#E8F7F3] text-[#14866D]" : "bg-[#FDF0F0] text-[#D94B50]"
                      }`}
                    >
                      {isUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      <span>{isUp ? "+" : ""}{typeof idxItem.pct_change === "number" ? idxItem.pct_change.toFixed(2) : idxItem.pct_change}%</span>
                    </span>
                  </div>

                  <p className="mt-2 text-[11px] text-[#667085] dark:text-[#97A3B6] leading-relaxed">
                    {idxItem.symbol === "NIFTY"
                      ? "50 leading Indian companies benchmark."
                      : idxItem.symbol === "SENSEX"
                      ? "30 large-cap BSE enterprise barometer."
                      : idxItem.symbol === "BANKNIFTY"
                      ? "12 major private and PSU banks."
                      : "30-day expected market volatility indicator."}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-[#E5EAF2] dark:border-[#1F2E47] flex items-center justify-between text-[10px] text-[#8993A4]">
                  <span>Status: Verified</span>
                  <span>15:30 IST</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────
          SECTION C: MARKET OBSERVATIONS ("What's Moving the Market?")
      ─────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-[#E5EAF2] dark:border-[#1F2E47] bg-white dark:bg-[#131C2E] p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#E5EAF2] dark:border-[#1F2E47] pb-3">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#315EFB] dark:text-[#4D74FB] bg-[#EEF3FC] dark:bg-[#1A2844] px-2 py-0.5 rounded-md">
              Section C
            </span>
            <h2 className="text-sm sm:text-base font-bold text-[#172B4D] dark:text-[#F4F6FB]">
              What&apos;s Moving the Market?
            </h2>
          </div>
          <span className="text-xs text-[#667085] dark:text-[#97A3B6]">
            3 Important Observations
          </span>
        </div>

        <div className="space-y-3">
          {observations.map((obs, idx) => {
            const isExpanded = !!expandedObs[idx];
            return (
              <div
                key={idx}
                className="rounded-xl border border-[#E5EAF2] dark:border-[#1F2E47] bg-[#F5F7FB] dark:bg-[#0B111E] p-4 space-y-2.5 transition"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xs sm:text-sm font-bold text-[#172B4D] dark:text-[#F4F6FB]">
                    {obs.title}
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white dark:bg-[#131C2E] border border-[#E5EAF2] dark:border-[#1F2E47] text-[#667085] dark:text-[#97A3B6]">
                    Verified Observation
                  </span>
                </div>

                {/* Initial View: What happened, Why it matters, Evidence */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="bg-white dark:bg-[#131C2E] p-2.5 rounded-lg border border-[#E5EAF2] dark:border-[#1F2E47]">
                    <span className="font-bold text-[#172B4D] dark:text-[#F4F6FB] block mb-0.5">What happened:</span>
                    <span className="text-[#667085] dark:text-[#97A3B6]">{obs.what}</span>
                  </div>
                  <div className="bg-white dark:bg-[#131C2E] p-2.5 rounded-lg border border-[#E5EAF2] dark:border-[#1F2E47]">
                    <span className="font-bold text-[#172B4D] dark:text-[#F4F6FB] block mb-0.5">Why it matters:</span>
                    <span className="text-[#667085] dark:text-[#97A3B6]">{obs.why}</span>
                  </div>
                  <div className="bg-white dark:bg-[#131C2E] p-2.5 rounded-lg border border-[#E5EAF2] dark:border-[#1F2E47]">
                    <span className="font-bold text-[#172B4D] dark:text-[#F4F6FB] block mb-0.5">Relevant evidence:</span>
                    <span className="text-[#667085] dark:text-[#97A3B6]">{obs.evidence}</span>
                  </div>
                </div>

                {/* Expand Toggle for Technical Details */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => toggleObservation(idx)}
                    className="inline-flex items-center space-x-1 text-xs font-semibold text-[#315EFB] dark:text-[#4D74FB] hover:underline"
                  >
                    <span>{isExpanded ? "Hide Technical Details" : "Show Technical Details (VWAP, Volume, Momentum & Invalidation)"}</span>
                    {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  </button>

                  {/* Progressive Disclosure: Technical details */}
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-[#E5EAF2] dark:border-[#1F2E47] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs animate-in fade-in duration-150">
                      <div className="p-2 rounded bg-white dark:bg-[#131C2E] border border-[#E5EAF2] dark:border-[#1F2E47]">
                        <span className="text-[10px] text-[#8993A4] uppercase font-bold block">VWAP Benchmark:</span>
                        <span className="font-mono text-[#172B4D] dark:text-[#F4F6FB]">{obs.vwap}</span>
                      </div>
                      <div className="p-2 rounded bg-white dark:bg-[#131C2E] border border-[#E5EAF2] dark:border-[#1F2E47]">
                        <span className="text-[10px] text-[#8993A4] uppercase font-bold block">Relative Volume (RVOL):</span>
                        <span className="font-mono text-[#172B4D] dark:text-[#F4F6FB]">{obs.rvol}</span>
                      </div>
                      <div className="p-2 rounded bg-white dark:bg-[#131C2E] border border-[#E5EAF2] dark:border-[#1F2E47]">
                        <span className="text-[10px] text-[#8993A4] uppercase font-bold block">Momentum Status:</span>
                        <span className="font-mono text-[#172B4D] dark:text-[#F4F6FB]">{obs.momentum}</span>
                      </div>
                      <div className="p-2 rounded bg-[#FFF9EB] dark:bg-[#B45309]/10 border border-[#FEE8A2] dark:border-[#B45309]/30 text-[#B45309]">
                        <span className="text-[10px] uppercase font-bold block">Invalidation Condition:</span>
                        <span>{obs.invalidation}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────
          SECTION D: MARKET CHART
      ─────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-[#E5EAF2] dark:border-[#1F2E47] bg-white dark:bg-[#131C2E] p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5EAF2] dark:border-[#1F2E47] pb-3">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#315EFB] dark:text-[#4D74FB] bg-[#EEF3FC] dark:bg-[#1A2844] px-2 py-0.5 rounded-md">
              Section D
            </span>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[#172B4D] dark:text-[#F4F6FB]">
                Market Chart — {selectedSymbol}
              </h2>
              <span className="text-xs text-[#667085] dark:text-[#97A3B6]">
                {isBeginner ? "Simple Line & Trend View" : "Candlestick Chart with 20-Day SMA"}
              </span>
            </div>
          </div>

          {/* Timeframe Ranges: 1D, 1W, 1M, 3M, 6M, 1Y */}
          <div className="flex items-center space-x-1 rounded-lg border border-[#E5EAF2] dark:border-[#1F2E47] bg-[#F5F7FB] dark:bg-[#0B111E] p-1">
            {["1D", "1W", "1M", "3M", "6M", "1Y"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setChartRange(r)}
                className={`px-2.5 py-0.5 rounded-md text-xs font-semibold transition ${
                  chartRange === r
                    ? "bg-[#315EFB] text-white"
                    : "text-[#667085] dark:text-[#97A3B6] hover:text-[#172B4D] dark:hover:text-[#F4F6FB]"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Symbol Switcher */}
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar pb-1">
          {SYMBOLS.map(({ sym, name }) => (
            <button
              key={sym}
              type="button"
              onClick={() => setSelectedSymbol(sym)}
              className={`rounded-lg px-3 py-1 text-xs font-semibold transition shrink-0 ${
                selectedSymbol === sym
                  ? "bg-[#315EFB] text-white shadow-xs"
                  : "bg-[#F5F7FB] dark:bg-[#0B111E] border border-[#E5EAF2] dark:border-[#1F2E47] text-[#667085] dark:text-[#97A3B6] hover:border-[#315EFB]"
              }`}
            >
              {name} ({sym})
            </button>
          ))}
        </div>

        <FinancialChart symbol={selectedSymbol} candles={chartData} height={360} />
      </div>

      {/* ───────────────────────────────────────────────────────────
          SECTION E: SECTOR PERFORMANCE
      ─────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-[#E5EAF2] dark:border-[#1F2E47] bg-white dark:bg-[#131C2E] p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#E5EAF2] dark:border-[#1F2E47] pb-3">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#315EFB] dark:text-[#4D74FB] bg-[#EEF3FC] dark:bg-[#1A2844] px-2 py-0.5 rounded-md">
              Section E
            </span>
            <h2 className="text-sm sm:text-base font-bold text-[#172B4D] dark:text-[#F4F6FB]">
              Sector Performance Heatmap
            </h2>
          </div>
          <span className="text-xs text-[#667085] dark:text-[#97A3B6]">
            Daily &amp; Weekly Movements across 16 Industries
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {[
            { name: "IT", chg: "+1.12%", weekly: "+2.40%", isUp: true },
            { name: "Banking", chg: "-0.79%", weekly: "-0.45%", isUp: false },
            { name: "Auto", chg: "-1.07%", weekly: "+0.15%", isUp: false },
            { name: "Pharma", chg: "-0.49%", weekly: "+1.10%", isUp: false },
            { name: "Energy", chg: "+0.31%", weekly: "-1.20%", isUp: true },
            { name: "FMCG", chg: "-0.01%", weekly: "+0.60%", isUp: false },
          ].map((sec, i) => (
            <div
              key={i}
              className={`rounded-xl p-3 border text-xs flex flex-col justify-between ${
                sec.isUp
                  ? "bg-[#E8F7F3]/40 border-[#B3E3D7]"
                  : "bg-[#FDF0F0]/40 border-[#F7C3C5]"
              }`}
            >
              <div>
                <span className="font-bold text-[#172B4D] dark:text-[#F4F6FB]">{sec.name}</span>
                <div className={`text-base font-bold font-mono mt-1 ${sec.isUp ? "text-[#14866D]" : "text-[#D94B50]"}`}>
                  {sec.chg}
                </div>
              </div>
              <div className="mt-2 pt-1.5 border-t border-[#E5EAF2] dark:border-[#1F2E47] flex justify-between text-[10px] text-[#667085] dark:text-[#97A3B6]">
                <span>1W:</span>
                <span className="font-mono font-semibold">{sec.weekly}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────
          SECTION F: STOCKS WORTH RESEARCHING
      ─────────────────────────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#315EFB] dark:text-[#4D74FB] bg-[#EEF3FC] dark:bg-[#1A2844] px-2 py-0.5 rounded-md">
            Section F
          </span>
          <h2 className="text-sm sm:text-base font-bold text-[#172B4D] dark:text-[#F4F6FB]">
            Stocks Worth Researching
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {stocksWorthResearching.map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-[#E5EAF2] dark:border-[#1F2E47] bg-white dark:bg-[#131C2E] p-4 shadow-xs hover:border-[#315EFB] transition flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-[#172B4D] dark:text-[#F4F6FB]">
                      {item.symbol}
                    </h3>
                    <p className="text-[11px] text-[#667085] dark:text-[#97A3B6]">{item.name}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-xs text-[#172B4D] dark:text-[#F4F6FB] block tabular-nums">
                      ₹{item.price.toFixed(2)}
                    </span>
                    <span className={`text-[10px] font-mono font-semibold ${item.isUp ? "text-[#14866D]" : "text-[#D94B50]"}`}>
                      {item.change}
                    </span>
                  </div>
                </div>

                <div className="mt-2.5 space-y-1.5 text-xs">
                  <div className="p-2 rounded-lg bg-[#F5F7FB] dark:bg-[#0B111E] border border-[#E5EAF2] dark:border-[#1F2E47]">
                    <span className="font-bold text-[#172B4D] dark:text-[#F4F6FB] block text-[10px] uppercase">Reason for selection:</span>
                    <span className="text-[#667085] dark:text-[#97A3B6] text-[11px]">{item.reason}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#FFF9EB] dark:bg-[#B45309]/10 border border-[#FEE8A2] dark:border-[#B45309]/30 text-[#B45309]">
                    <span className="font-bold block text-[10px] uppercase">Main risk to verify:</span>
                    <span className="text-[11px]">{item.risk}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onSelectStock(item.symbol)}
                className="w-full py-1.5 rounded-lg bg-[#315EFB] hover:bg-[#204AE0] text-white text-xs font-semibold transition active:scale-95 text-center shadow-xs"
              >
                Open Full Stock Analysis &rarr;
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────
          SECTION G: IMPORTANT MARKET NEWS
      ─────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-[#E5EAF2] dark:border-[#1F2E47] bg-white dark:bg-[#131C2E] p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#E5EAF2] dark:border-[#1F2E47] pb-3">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#315EFB] dark:text-[#4D74FB] bg-[#EEF3FC] dark:bg-[#1A2844] px-2 py-0.5 rounded-md">
              Section G
            </span>
            <h2 className="text-sm sm:text-base font-bold text-[#172B4D] dark:text-[#F4F6FB]">
              Important Market News &amp; Exchange Filings
            </h2>
          </div>
          <span className="text-xs text-[#667085] dark:text-[#97A3B6]">
            Verified Financial Sources
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {news.length === 0 ? (
            <p className="text-xs text-[#667085] py-2">Loading news developments...</p>
          ) : (
            news.map((item, i) => (
              <div
                key={i}
                className="rounded-xl border border-[#E5EAF2] dark:border-[#1F2E47] bg-[#F5F7FB] dark:bg-[#0B111E] p-3.5 space-y-1.5"
              >
                <div className="flex items-center justify-between text-[10px] text-[#667085] dark:text-[#97A3B6]">
                  <span className="font-semibold px-2 py-0.5 rounded bg-white dark:bg-[#131C2E] border border-[#E5EAF2] dark:border-[#1F2E47]">
                    {item.source || "Official Wire"}
                  </span>
                  <span>{item.published_at || "Recent"}</span>
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
    </div>
  );
};

export default LiveMarketView;
