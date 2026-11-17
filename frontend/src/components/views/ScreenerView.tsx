"use client";

import React, { useEffect, useState } from "react";
import {
  SearchCheck,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  AlertCircle,
  ChevronRight,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Star,
  BarChart3,
  Zap,
  ShieldCheck,
} from "lucide-react";
import { api } from "@/lib/api";
import { useExperienceMode } from "@/context/ExperienceModeContext";

interface ScreenerViewProps {
  onSelectStock: (symbol: string) => void;
}

const BEGINNER_CARDS = [
  {
    id: "QUALITY",
    icon: ShieldCheck,
    title: "Find financially strong companies",
    description: "Companies with solid profits, manageable debt and efficient use of capital.",
    color: "blue",
  },
  {
    id: "MOMENTUM",
    icon: TrendingUp,
    title: "Find fast-growing companies",
    description: "Companies whose share prices show improving momentum recently.",
    color: "emerald",
  },
  {
    id: "VALUE",
    icon: Star,
    title: "Find undervalued companies",
    description: "Companies trading at potentially lower valuations relative to their earnings.",
    color: "violet",
  },
  {
    id: "BREAKOUT",
    icon: ArrowUpRight,
    title: "Find stocks near new highs",
    description: "Stocks approaching or breaking past recent price highs — often a sign of strength.",
    color: "amber",
  },
  {
    id: "REVERSAL",
    icon: TrendingDown,
    title: "Find beaten-down stocks",
    description: "Stocks that have fallen significantly and may be due for recovery research.",
    color: "rose",
  },
  {
    id: "VOLUME",
    icon: Zap,
    title: "Find unusually active stocks",
    description: "Stocks seeing much higher trading volume than normal — worth investigating why.",
    color: "cyan",
  },
];

const ADVANCED_TABS = [
  { id: "MOMENTUM", label: "Momentum", desc: "MA Stack & RSI" },
  { id: "BREAKOUT", label: "Breakout", desc: "Near 52W Highs" },
  { id: "REVERSAL", label: "Mean Reversion", desc: "Oversold RSI < 38" },
  { id: "QUALITY", label: "Quality Moat", desc: "ROE > 15%, ROCE > 18%" },
  { id: "VALUE", label: "Fair Value", desc: "PE < 24 & Positive CFO" },
  { id: "VOLUME", label: "Volume Shock", desc: "RVOL > 1.4x Surge" },
];

const COLOR_MAP: Record<string, { card: string; icon: string; active: string }> = {
  blue:    { card: "border-blue-200 bg-blue-50",    icon: "bg-blue-100 text-blue-600",    active: "border-blue-500 bg-blue-50 ring-2 ring-blue-400 ring-offset-1" },
  emerald: { card: "border-emerald-200 bg-emerald-50", icon: "bg-emerald-100 text-emerald-600", active: "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-400 ring-offset-1" },
  violet:  { card: "border-violet-200 bg-violet-50",  icon: "bg-violet-100 text-violet-600",  active: "border-violet-500 bg-violet-50 ring-2 ring-violet-400 ring-offset-1" },
  amber:   { card: "border-amber-200 bg-amber-50",    icon: "bg-amber-100 text-amber-600",    active: "border-amber-500 bg-amber-50 ring-2 ring-amber-400 ring-offset-1" },
  rose:    { card: "border-rose-200 bg-rose-50",      icon: "bg-rose-100 text-rose-600",      active: "border-rose-500 bg-rose-50 ring-2 ring-rose-400 ring-offset-1" },
  cyan:    { card: "border-cyan-200 bg-cyan-50",      icon: "bg-cyan-100 text-cyan-600",      active: "border-cyan-500 bg-cyan-50 ring-2 ring-cyan-400 ring-offset-1" },
};

const UNIVERSE_OPTIONS = [
  { value: "NIFTY 50",  label: "Top 50 Largest Companies (NIFTY 50)" },
  { value: "NIFTY 100", label: "Top 100 Largest Companies (NIFTY 100)" },
  { value: "NIFTY 500", label: "Top 500 Largest Companies (NIFTY 500)" },
];

export const ScreenerView: React.FC<ScreenerViewProps> = ({ onSelectStock }) => {
  const { isBeginner } = useExperienceMode();
  const [scanType, setScanType] = useState("MOMENTUM");
  const [universe, setUniverse] = useState("NIFTY 50");
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runScan = async () => {
    setLoading(true);
    try {
      const res = await api.runScreener(scanType, universe);
      setResults(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runScan();
  }, [scanType, universe]);

  const candidates = results?.candidates || [];
  const emptyMessage = results?.message || "";

  /* ───── BEGINNER MODE ───── */
  if (isBeginner) {
    return (
      <div className="space-y-8 p-4 sm:p-6 max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="text-center space-y-2 pt-2">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-blue-100 text-blue-600 mb-2">
            <SearchCheck className="h-6 w-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Find Stocks to Research
          </h1>
          <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Use our screens to discover companies worth investigating. These are starting points for research — <span className="font-semibold text-gray-700">not investment recommendations.</span>
          </p>
        </div>

        {/* Preset Question Cards */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
            What would you like to find?
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {BEGINNER_CARDS.map((card) => {
              const isActive = scanType === card.id;
              const colors = COLOR_MAP[card.color];
              const Icon = card.icon;
              return (
                <button
                  key={card.id}
                  onClick={() => setScanType(card.id)}
                  className={`w-full text-left rounded-2xl border-2 p-4 transition-all active:scale-[0.98] shadow-sm hover:shadow-md ${
                    isActive ? colors.active : `${colors.card} hover:border-gray-300`
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colors.icon}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className={`font-semibold text-sm leading-snug ${isActive ? "text-gray-900" : "text-gray-800"}`}>
                        {card.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                        {card.description}
                      </p>
                    </div>
                    {isActive && (
                      <CheckCircle2 className="h-5 w-5 text-blue-500 ml-auto flex-shrink-0 mt-0.5" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Universe Selector */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 space-y-3">
          <p className="text-sm font-semibold text-gray-700">
            Look in which group of companies?
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            {UNIVERSE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setUniverse(opt.value)}
                className={`flex-1 rounded-xl border-2 px-3 py-2.5 text-sm font-medium transition-all active:scale-95 ${
                  universe === opt.value
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-3">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
            <p className="text-sm text-gray-500">Searching for matching companies...</p>
          </div>
        ) : candidates.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 py-14 px-4 text-center">
            <AlertCircle className="h-10 w-10 text-amber-400 mb-3" />
            <h3 className="text-base font-bold text-gray-700">
              {emptyMessage || "No companies matched today"}
            </h3>
            <p className="text-sm text-gray-500 mt-1 max-w-md">
              The market conditions don't match this screen right now. Try a different category or expand your company group.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Found <strong className="text-gray-900">{candidates.length}</strong> companies matching your search
              </p>
              <button
                onClick={runScan}
                disabled={loading}
                className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Refresh
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {candidates.map((cand: any) => {
                const isPos = (cand.pct_change || 0) >= 0;
                const scoreWidth = Math.min(100, Math.max(0, cand.overall_score || 0));
                return (
                  <div
                    key={cand.symbol}
                    className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all p-5 space-y-4"
                  >
                    {/* Company Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center font-bold text-sm text-blue-700">
                            {cand.symbol.slice(0, 2)}
                          </div>
                          <div>
                            <p className="text-base font-bold text-gray-900 leading-tight">
                              {cand.company_name || cand.symbol}
                            </p>
                            <p className="text-xs text-gray-400 font-mono">{cand.symbol}</p>
                          </div>
                        </div>
                        {cand.sector && (
                          <p className="text-xs text-gray-400 mt-1 ml-12">{cand.sector}</p>
                        )}
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-lg font-bold text-gray-900 tabular-nums">
                          ₹{Number(cand.price).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        <p className={`text-sm font-semibold flex items-center justify-end gap-0.5 ${isPos ? "text-emerald-600" : "text-rose-600"}`}>
                          {isPos ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                          {isPos ? "+" : ""}{cand.pct_change?.toFixed(2)}% today
                        </p>
                      </div>
                    </div>

                    {/* Research Score */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Research Score</span>
                        <span className="text-sm font-bold text-blue-600">{cand.overall_score}/100</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all"
                          style={{ width: `${scoreWidth}%` }}
                        />
                      </div>
                    </div>

                    {/* Why this appeared */}
                    <div className="rounded-xl bg-blue-50 border border-blue-100 p-3 space-y-1">
                      <p className="text-xs font-bold text-blue-700 uppercase tracking-wide">Why this appeared</p>
                      <p className="text-sm text-gray-700 leading-relaxed">{cand.shortlist_reason}</p>
                    </div>

                    {/* Main Risk */}
                    <div className="rounded-xl bg-amber-50 border border-amber-100 p-3 space-y-1">
                      <p className="text-xs font-bold text-amber-700 uppercase tracking-wide">Main risk to watch</p>
                      <p className="text-sm text-gray-700 leading-relaxed">{cand.invalidation_condition}</p>
                    </div>

                    {/* Footer */}
                    <div className="pt-1 border-t border-gray-100 flex items-center justify-between">
                      <p className="text-xs text-gray-400">For research purposes only</p>
                      <button
                        onClick={() => onSelectStock(cand.symbol)}
                        className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 transition"
                      >
                        Learn More
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ───── ADVANCED MODE ───── */
  return (
    <div className="space-y-5 p-3 sm:p-5 max-w-7xl mx-auto">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-200 dark:border-white/[0.08] pb-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="h-8 w-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <SearchCheck className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100">
                  Quantitative & Fundamental Equity Screener
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  SEBI/NSE UNIVERSE
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Transparent multi-factor scoring with clear thesis criteria and mathematical invalidation boundaries.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={universe}
            onChange={(e) => setUniverse(e.target.value)}
            className="rounded-xl bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-white/[0.1] px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 focus:outline-none focus:border-blue-500 cursor-pointer shadow-sm"
          >
            <option value="NIFTY 50">Universe: NIFTY 50</option>
            <option value="NIFTY 100">Universe: NIFTY 100</option>
            <option value="NIFTY 500">Universe: NIFTY 500 Liquid</option>
          </select>

          <button
            onClick={runScan}
            disabled={loading}
            className="flex items-center space-x-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 px-3.5 py-1.5 text-xs font-semibold text-white transition active:scale-95 shadow-lg shadow-blue-500/20"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Run Scanner</span>
          </button>
        </div>
      </div>

      {/* Scanner Category Ribbon */}
      <div className="flex overflow-x-auto space-x-2 pb-1 no-scrollbar">
        {ADVANCED_TABS.map((tab) => {
          const active = scanType === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setScanType(tab.id)}
              className={`flex-shrink-0 rounded-xl border px-3.5 py-2 text-left transition active:scale-95 ${
                active
                  ? "border-blue-500/80 bg-blue-600/10 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 shadow-md shadow-blue-500/10"
                  : "border-gray-200 dark:border-white/[0.06] bg-white dark:bg-gray-900/60 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-white/20"
              }`}
            >
              <p className="text-xs font-bold tracking-tight">{tab.label}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">{tab.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Screening Status Bar */}
      <div className="flex items-center justify-between text-xs text-gray-400 px-1">
        <span>
          Evaluated <strong className="text-gray-700 dark:text-gray-200 font-mono">{results?.total_screened || 50}</strong> instruments in <strong className="text-gray-700 dark:text-gray-200">{universe}</strong>
        </span>
        <span className="flex items-center space-x-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span>Shortlisted: <strong className="text-emerald-600 dark:text-emerald-400 font-mono">{candidates.length} setups</strong></span>
        </span>
      </div>

      {/* Candidates Grid */}
      {loading ? (
        <div className="flex flex-col h-56 items-center justify-center rounded-2xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-gray-900/40">
          <RefreshCw className="h-7 w-7 animate-spin text-blue-400" />
          <span className="mt-3 text-xs font-medium text-gray-400">Evaluating multi-factor technical & fundamental criteria...</span>
        </div>
      ) : candidates.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 dark:border-white/[0.1] bg-gray-50 dark:bg-gray-950/40 py-14 px-4 text-center">
          <AlertCircle className="h-10 w-10 text-amber-400 mb-3 opacity-80" />
          <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200 tracking-wide uppercase">
            {emptyMessage || "NO SETUP PASSED STRICT FILTER TODAY"}
          </h3>
          <p className="text-xs text-gray-400 mt-1 max-w-md">
            Market criteria are strictly enforced without synthesizing artificial trades. Try expanding your universe or switching the scan strategy.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {candidates.map((cand: any) => {
            const isPos = (cand.pct_change || 0) >= 0;
            return (
              <div
                key={cand.symbol}
                className="group bg-white dark:bg-gray-900/60 rounded-2xl border border-gray-200 dark:border-white/[0.08] p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-blue-200 dark:hover:border-blue-500/40 transition space-y-4"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/30 flex items-center justify-center font-bold text-sm text-blue-600 dark:text-blue-300 font-mono">
                      {cand.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-base font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition tracking-tight">
                          {cand.symbol}
                        </span>
                        <span className="rounded-full bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-[10px] font-bold text-blue-600 dark:text-blue-300">
                          {cand.category?.replace(/_/g, " ") || scanType}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{cand.company_name}</p>
                      <p className="text-[11px] text-gray-400">{cand.sector}</p>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <p className="text-base font-bold text-gray-900 dark:text-gray-100 tabular-nums">
                      ₹{Number(cand.price).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p className={`text-xs font-semibold tabular-nums ${isPos ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                      {isPos ? `+${cand.pct_change.toFixed(2)}%` : `${cand.pct_change.toFixed(2)}%`}
                    </p>
                  </div>
                </div>

                {/* Score Gauges */}
                <div className="grid grid-cols-3 gap-2 rounded-xl bg-gray-50 dark:bg-gray-950/60 p-2.5 border border-gray-100 dark:border-white/[0.06] text-center text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400">Overall</span>
                    <p className="font-mono font-bold text-blue-600 dark:text-blue-400 text-sm mt-0.5 tabular-nums">
                      {cand.overall_score}/100
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400">Technical</span>
                    <p className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm mt-0.5 tabular-nums">
                      {cand.technical_score}/100
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400">Fundamental</span>
                    <p className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-sm mt-0.5 tabular-nums">
                      {cand.fundamental_score}/100
                    </p>
                  </div>
                </div>

                {/* Thesis & Catalysts */}
                <div className="space-y-2 text-xs">
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    <strong className="text-gray-500 dark:text-gray-400">Thesis: </strong>
                    {cand.shortlist_reason}
                  </p>

                  {cand.catalysts && cand.catalysts.length > 0 && (
                    <div className="flex items-start space-x-1.5 text-emerald-600 dark:text-emerald-400 text-[11px]">
                      <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                      <span>{cand.catalysts[0]}</span>
                    </div>
                  )}

                  <div className="rounded-xl bg-amber-50 dark:bg-amber-500/[0.08] border border-amber-200 dark:border-amber-500/20 p-2.5 text-[11px] text-amber-700 dark:text-amber-300/90 leading-tight">
                    <strong className="text-amber-800 dark:text-amber-200">Invalidation Bound: </strong>
                    {cand.invalidation_condition}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-2 border-t border-gray-100 dark:border-white/[0.06] flex items-center justify-between">
                  <span className="text-[10px] font-mono text-gray-400">Live Valuation Model</span>
                  <button
                    onClick={() => onSelectStock(cand.symbol)}
                    className="flex items-center space-x-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition"
                  >
                    <span>Full Research Dossier</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
