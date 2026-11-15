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
  SearchCheck,
  BarChart2,
  Zap,
  SlidersHorizontal
} from "lucide-react";
import { api } from "@/lib/api";
import { FinancialChart } from "../charts/FinancialChart";

interface DashboardViewProps {
  onSelectStock: (symbol: string) => void;
  onNavigate: (view: any) => void;
}

// Mini SVG Sparkline for index cards
const MiniSparkline: React.FC<{ isPositive: boolean; trendPoints?: number[] }> = ({
  isPositive,
  trendPoints = [10, 15, 12, 18, 14, 22, 19, 25, 28, 26, 32]
}) => {
  const points = isPositive ? trendPoints : trendPoints.slice().reverse();
  const min = Math.min(...points);
  const max = Math.max(...points);
  const width = 80;
  const height = 28;
  const step = width / (points.length - 1);

  const coords = points.map((p, i) => {
    const x = i * step;
    const y = height - ((p - min) / (max - min || 1)) * (height - 6) - 3;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const path = `M ${coords.join(" L ")}`;
  const color = isPositive ? "#10B981" : "#EF4444";

  return (
    <svg width={width} height={height} className="overflow-visible select-none">
      <path d={path} fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const DashboardView: React.FC<DashboardViewProps> = ({ onSelectStock, onNavigate }) => {
  const [indices, setIndices] = useState<any[]>([]);
  const [fiiDii, setFiiDii] = useState<any>(null);
  const [sectors, setSectors] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [selectedChartSym, setSelectedChartSym] = useState("NIFTY");
  const [premarketBrief, setPremarketBrief] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [idxRes, fdRes, secRes, chartRes, preRes] = await Promise.allSettled([
        api.getIndices(),
        api.getFiiDii(5),
        api.getSectors(),
        api.getChart("RELIANCE", 60),
        api.getPremarket()
      ]);

      if (idxRes.status === "fulfilled") setIndices(idxRes.value);
      if (fdRes.status === "fulfilled") setFiiDii(fdRes.value);
      if (secRes.status === "fulfilled") setSectors(secRes.value.sectors || []);
      if (chartRes.status === "fulfilled") setChartData(chartRes.value.candles || []);
      if (preRes.status === "fulfilled") setPremarketBrief(preRes.value);
    } catch (e) {
      console.error(e);
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

  // Find primary benchmark index cards
  const nifty = indices.find((i) => i.symbol === "NIFTY" || i.name?.includes("NIFTY 50"));
  const bankNifty = indices.find((i) => i.symbol === "BANKNIFTY" || i.name?.includes("BANK"));
  const sensex = indices.find((i) => i.symbol === "SENSEX");
  const vix = indices.find((i) => i.symbol === "INDIAVIX" || i.name?.includes("VIX"));

  // High conviction setups
  const featuredOpportunities = [
    {
      symbol: "RELIANCE",
      name: "Reliance Industries",
      setup: "Consolidation Breakout",
      sector: "Energy / Retail",
      price: 1339.7,
      pct: "+0.72%",
      isUp: true,
      tag: "52W HIGH PROXIMITY",
      badgeBg: "from-emerald-600 to-teal-500",
      avatar: "RE"
    },
    {
      symbol: "TCS",
      name: "Tata Consultancy",
      setup: "Quality Compounder",
      sector: "IT Services",
      price: 4150.0,
      pct: "+1.15%",
      isUp: true,
      tag: "HIGH ROCE (48%)",
      badgeBg: "from-blue-600 to-cyan-500",
      avatar: "TC"
    },
    {
      symbol: "HDFCBANK",
      name: "HDFC Bank Limited",
      setup: "EMA 20 Support",
      sector: "Banking / Fin",
      price: 1760.0,
      pct: "-0.38%",
      isUp: false,
      tag: "INSTITUTIONAL ACCUMULATION",
      badgeBg: "from-indigo-600 to-purple-500",
      avatar: "HD"
    }
  ];

  return (
    <div className="space-y-4 p-3 sm:p-5 max-w-7xl mx-auto">
      {/* 1. Hero Radar: Market Sentiment & Breadth Bar */}
      <div className="glass-card rounded-2xl p-4 sm:p-5 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left: Regime & Macro Commentary */}
          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center space-x-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 px-2.5 py-0.5 text-[11px] font-bold tracking-wide text-blue-400">
                <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                <span>INSTITUTIONAL REGIME</span>
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-200">
                {fiiDii?.regime ? fiiDii.regime.replace(/_/g, " ") : "DOMESTIC ABSORPTION OF FOREIGN OUTFLOWS"}
              </span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed max-w-3xl">
              {fiiDii?.regime_description ||
                "Domestic institutions (DII) are actively absorbing foreign selling in cash markets. Key support at NIFTY 25,050 holds while benchmark indices consolidate."}
            </p>
          </div>

          {/* Right: Breadth Visual Ratio & Quick Sync */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            {/* Advance / Decline Progress Meter */}
            <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-2.5 min-w-[200px]">
              <div className="flex justify-between text-[11px] font-semibold mb-1">
                <span className="text-emerald-400 font-mono">32 Advances</span>
                <span className="text-gray-400 font-mono text-[10px]">64% Bullish</span>
                <span className="text-red-400 font-mono">18 Declines</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-red-900/60 flex">
                <div className="h-full bg-emerald-500 rounded-l-full" style={{ width: "64%" }} />
                <div className="h-full bg-red-500 rounded-r-full" style={{ width: "36%" }} />
              </div>
            </div>

            <button
              onClick={loadData}
              disabled={loading}
              className="flex items-center justify-center space-x-1.5 rounded-xl border border-gray-700 bg-gray-800/80 px-3.5 py-2.5 text-xs font-semibold text-gray-200 hover:bg-gray-700 hover:text-white transition active:scale-95"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>Sync Feeds</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Elevated Benchmark Cards (4 Major Indices) */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
        {[
          {
            label: "NIFTY 50",
            data: nifty,
            defaultVal: 25144.3,
            defaultChg: -155.05,
            defaultPct: -0.61,
            low: "25,054",
            high: "25,246",
            accent: "from-blue-500/10 via-transparent to-transparent",
            borderAccent: "hover:border-blue-500/40"
          },
          {
            label: "BANK NIFTY",
            data: bankNifty,
            defaultVal: 61034.1,
            defaultChg: -484.4,
            defaultPct: -0.79,
            low: "60,780",
            high: "61,300",
            accent: "from-indigo-500/10 via-transparent to-transparent",
            borderAccent: "hover:border-indigo-500/40"
          },
          {
            label: "BSE SENSEX",
            data: sensex,
            defaultVal: 81592.45,
            defaultChg: -318.55,
            defaultPct: -0.39,
            low: "81,288",
            high: "81,879",
            accent: "from-purple-500/10 via-transparent to-transparent",
            borderAccent: "hover:border-purple-500/40"
          },
          {
            label: "INDIA VIX",
            data: vix,
            defaultVal: 15.5,
            defaultChg: -1.12,
            defaultPct: -6.74,
            low: "15.30",
            high: "16.88",
            isVix: true,
            accent: "from-amber-500/10 via-transparent to-transparent",
            borderAccent: "hover:border-amber-500/40"
          }
        ].map((card, i) => {
          const val = card.data?.price || card.defaultVal;
          const chg = card.data?.change !== undefined ? card.data.change : card.defaultChg;
          const pct = card.data?.pct_change !== undefined ? card.data.pct_change : card.defaultPct;
          const isPos = chg >= 0;

          return (
            <div
              key={i}
              className={`glass-card glass-card-hover rounded-2xl p-3 sm:p-4 bg-gradient-to-b ${card.accent} ${card.borderAccent} cursor-pointer`}
              onClick={() => {
                if (card.label.includes("NIFTY 50")) handleChartChange("NIFTY");
                else if (card.label.includes("BANK")) handleChartChange("BANKNIFTY");
              }}
            >
              {/* Card Header: Label & Status */}
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span className="font-bold text-gray-300 tracking-wide">{card.label}</span>
                <span className="text-[9px] font-mono rounded bg-gray-800/80 px-1.5 py-0.5 text-gray-400">
                  {card.data?.status || "LAST AVAILABLE"}
                </span>
              </div>

              {/* Price & Sparkline Row */}
              <div className="mt-2 flex items-center justify-between">
                <div>
                  <div className="text-lg sm:text-2xl font-black font-mono tracking-tight text-white">
                    {val.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div
                    className={`flex items-center space-x-1 text-xs font-bold font-mono mt-0.5 ${
                      card.isVix
                        ? isPos ? "text-amber-400" : "text-emerald-400"
                        : isPos ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {isPos ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                    <span>{pct > 0 ? `+${pct.toFixed(2)}` : pct.toFixed(2)}%</span>
                  </div>
                </div>

                {/* Inline Trend Sparkline */}
                <div className="opacity-80">
                  <MiniSparkline isPositive={isPos} />
                </div>
              </div>

              {/* Day Low / High Range Bar */}
              <div className="mt-2.5 pt-2 border-t border-gray-800/60 flex items-center justify-between text-[10px] text-gray-500 font-mono">
                <span>L: ₹{card.low}</span>
                <div className="h-1 flex-1 mx-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500/70 rounded-full w-2/3" />
                </div>
                <span>H: ₹{card.high}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Main Workspace: Chart & Institutional Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left 2 Cols: Interactive Financial Chart & Symbol Tabs */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-gray-800 bg-[#111827] px-3.5 py-2">
            <div className="flex items-center space-x-2">
              <BarChart2 className="h-4 w-4 text-blue-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-gray-200">
                Interactive Technical Chart
              </span>
            </div>

            {/* Quick Switcher Ticker Pills */}
            <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar">
              {["NIFTY", "BANKNIFTY", "RELIANCE", "TCS", "HDFCBANK"].map((sym) => (
                <button
                  key={sym}
                  onClick={() => handleChartChange(sym)}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition ${
                    selectedChartSym === sym
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                      : "bg-gray-800/80 text-gray-400 hover:bg-gray-700 hover:text-gray-200"
                  }`}
                >
                  {sym}
                </button>
              ))}
            </div>
          </div>

          <FinancialChart symbol={selectedChartSym} candles={chartData} height={350} />

          {/* Quick Hub Navigation Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {[
              { label: "Pre-Market", view: "premarket", desc: "Global & Gift Nifty", icon: Compass, color: "text-amber-400" },
              { label: "FII / DII Flows", view: "fiidii", desc: "Institutional Cash", icon: Landmark, color: "text-emerald-400" },
              { label: "Sector Radar", view: "sectors", desc: "16 Sectors Heatmap", icon: Layers, color: "text-purple-400" },
              { label: "Stock Screener", view: "screener", desc: "6 Multi-Factor Scans", icon: SearchCheck, color: "text-blue-400" }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => onNavigate(item.view)}
                  className="flex flex-col text-left rounded-xl border border-gray-800/80 bg-gray-900/60 p-3 transition hover:border-blue-500/50 hover:bg-gray-800/80 group"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-gray-200">
                    <div className="flex items-center space-x-1.5">
                      <Icon className={`h-3.5 w-3.5 ${item.color}`} />
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-gray-500 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1 font-medium">{item.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Col: Institutional Cash Flow & Sector Breadth */}
        <div className="space-y-4">
          {/* Institutional Cash Flow Card */}
          <div className="glass-card rounded-2xl p-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-gray-800 pb-2.5 mb-3">
              <div className="flex items-center space-x-2">
                <Landmark className="h-4 w-4 text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-gray-200">
                  Institutional Cash Flow
                </span>
              </div>
              <button
                onClick={() => onNavigate("fiidii")}
                className="text-[11px] font-semibold text-blue-400 hover:text-blue-300"
              >
                Deep View &rarr;
              </button>
            </div>

            {fiiDii?.latest_session ? (
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center rounded-xl bg-gray-900/80 p-2.5 border border-gray-800/60">
                  <span className="text-gray-400 font-medium">Foreign (FII) Net:</span>
                  <span
                    className={`font-mono font-bold ${
                      fiiDii.latest_session.fii_net >= 0 ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {fiiDii.latest_session.fii_net > 0 ? "+" : ""}
                    ₹{fiiDii.latest_session.fii_net.toLocaleString()} Cr
                  </span>
                </div>
                <div className="flex justify-between items-center rounded-xl bg-gray-900/80 p-2.5 border border-gray-800/60">
                  <span className="text-gray-400 font-medium">Domestic (DII) Net:</span>
                  <span
                    className={`font-mono font-bold ${
                      fiiDii.latest_session.dii_net >= 0 ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {fiiDii.latest_session.dii_net > 0 ? "+" : ""}
                    ₹{fiiDii.latest_session.dii_net.toLocaleString()} Cr
                  </span>
                </div>
                <div className="flex justify-between items-center pt-1 text-[11px] text-gray-400 px-1 font-mono">
                  <span>5-Day Cumulative Net:</span>
                  <span className="font-bold text-gray-100">
                    ₹{fiiDii.rolling_5_session?.combined_net_cr?.toLocaleString() || 0} Cr
                  </span>
                </div>
                <div className="rounded-xl bg-blue-950/40 border border-blue-900/40 p-2 text-[10px] text-blue-300 font-medium leading-relaxed">
                  {fiiDii.streaks?.fii_streak} • {fiiDii.streaks?.dii_streak}
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-500">Loading verified flows...</p>
            )}
          </div>

          {/* Sector Momentum Snapshot */}
          <div className="glass-card rounded-2xl p-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-gray-800 pb-2.5 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-200">
                Top Sector Momentum
              </span>
              <button
                onClick={() => onNavigate("sectors")}
                className="text-[11px] font-semibold text-blue-400 hover:text-blue-300"
              >
                All 16 &rarr;
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {sectors.slice(0, 6).map((sec, idx) => {
                const isPos = sec.daily_pct >= 0;
                return (
                  <div
                    key={idx}
                    className={`rounded-xl border p-2.5 transition cursor-pointer ${
                      isPos
                        ? "border-emerald-900/40 bg-emerald-950/20 text-emerald-400 hover:border-emerald-700"
                        : "border-red-900/40 bg-red-950/20 text-red-400 hover:border-red-700"
                    }`}
                  >
                    <div className="text-[11px] font-bold text-gray-200 truncate">
                      {sec.name}
                    </div>
                    <div className="flex justify-between items-baseline mt-1">
                      <span className="text-[10px] text-gray-400 font-mono">₹{sec.price}</span>
                      <span className="font-mono font-bold text-xs">
                        {isPos ? `+${sec.daily_pct}%` : `${sec.daily_pct}%`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 4. High-Conviction Research Opportunities */}
      <div className="space-y-2.5 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Zap className="h-4 w-4 text-amber-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-200">
              Today's Quantitative High-Conviction Setups
            </h3>
          </div>
          <button
            onClick={() => onNavigate("screener")}
            className="text-[11px] font-semibold text-blue-400 hover:underline"
          >
            Launch Multi-Factor Screener &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {featuredOpportunities.map((opp, idx) => (
            <div
              key={idx}
              onClick={() => onSelectStock(opp.symbol)}
              className="glass-card glass-card-hover rounded-2xl p-4 cursor-pointer transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div
                      className={`h-9 w-9 rounded-xl bg-gradient-to-tr ${opp.badgeBg} flex items-center justify-center font-bold text-white text-xs shadow-md`}
                    >
                      {opp.avatar}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-gray-100 tracking-tight">{opp.symbol}</h4>
                      <p className="text-[10px] text-gray-400">{opp.name}</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-[9px] font-bold text-blue-400">
                    {opp.setup}
                  </span>
                </div>

                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-base font-bold font-mono text-gray-100">
                    ₹{opp.price.toFixed(2)}
                  </span>
                  <span
                    className={`text-xs font-bold font-mono ${
                      opp.isUp ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {opp.pct}
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-gray-800/60 flex items-center justify-between text-[10px]">
                <span className="text-gray-400 font-medium">{opp.sector}</span>
                <span className="font-semibold text-amber-400">{opp.tag}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Platform Attribution Footer */}
      <footer className="mt-8 border-t border-gray-800/80 pt-4 pb-2 text-center text-xs text-gray-400">
        <p className="flex items-center justify-center space-x-1.5">
          <span>Bharat Market Intelligence</span>
          <span>•</span>
          <span>Made with</span>
          <span className="text-red-500">❤️</span>
          <span>by</span>
          <strong className="text-gray-200 font-semibold hover:text-blue-400 transition">Aniruddha Bhutada</strong>
        </p>
        <p className="text-[10px] text-gray-500 mt-1">
          Free & Open-Source Indian Equity Research Terminal for NSE & BSE
        </p>
      </footer>
    </div>
  );
};
