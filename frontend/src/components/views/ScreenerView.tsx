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
  Star,
  Zap,
  ShieldCheck,
  Filter
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
    title: "Financially strong companies",
    description: "Companies with solid profits, manageable debt and efficient use of capital.",
    color: "blue",
  },
  {
    id: "MOMENTUM",
    icon: TrendingUp,
    title: "Growing companies",
    description: "Companies with expanding sales revenues and healthy operational cash flows.",
    color: "emerald",
  },
  {
    id: "VOLUME",
    icon: ArrowUpRight,
    title: "Stocks showing positive momentum",
    description: "Stocks demonstrating sustained upward price action and healthy buyer participation.",
    color: "violet",
  },
  {
    id: "VALUE",
    icon: Star,
    title: "Stocks with relatively low valuations",
    description: "Companies trading at sensible price-to-earnings multiples relative to historic earnings.",
    color: "amber",
  },
  {
    id: "BREAKOUT",
    icon: Zap,
    title: "Stocks near 52-week highs",
    description: "Stocks trading near or breaking out of 52-week price highs, reflecting institutional conviction.",
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

const UNIVERSE_OPTIONS = [
  { value: "NIFTY 50",  label: "NIFTY 50 (Top 50 Bluechips)" },
  { value: "NIFTY 100", label: "NIFTY 100 (Large Caps)" },
  { value: "NIFTY 500", label: "NIFTY 500 (Broad Market)" },
];

export const ScreenerView: React.FC<ScreenerViewProps> = ({ onSelectStock }) => {
  const { isBeginner } = useExperienceMode();
  const [scanType, setScanType] = useState("QUALITY");
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
      <div className="space-y-6 p-4 sm:p-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-2 pt-2">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-[#EEF3FC] dark:bg-[#1A2844] text-[#315EFB] dark:text-[#4D74FB] mb-1">
            <SearchCheck className="h-6 w-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#172B4D] dark:text-[#F4F6FB] tracking-tight">
            Explore Stock Opportunities
          </h1>
          <p className="text-[#667085] dark:text-[#97A3B6] text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Use preset research screens to discover companies worth investigating. These are starting points for research — <span className="font-semibold text-[#172B4D] dark:text-[#F4F6FB]">not investment advice.</span>
          </p>
        </div>

        {/* 5 Preset Search Cards */}
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#667085] dark:text-[#97A3B6] mb-3">
            What would you like to explore?
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {BEGINNER_CARDS.map((card) => {
              const isActive = scanType === card.id;
              const Icon = card.icon;
              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => setScanType(card.id)}
                  className={`w-full text-left rounded-2xl border p-4 transition-all active:scale-[0.98] shadow-xs hover:border-[#315EFB] ${
                    isActive
                      ? "border-[#315EFB] bg-[#EEF3FC] dark:bg-[#1A2844] ring-1 ring-[#315EFB]"
                      : "border-[#E5EAF2] dark:border-[#1F2E47] bg-white dark:bg-[#131C2E]"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isActive
                          ? "bg-[#315EFB] text-white"
                          : "bg-[#F5F7FB] dark:bg-[#0B111E] text-[#315EFB] dark:text-[#4D74FB]"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-bold text-xs sm:text-sm leading-snug ${isActive ? "text-[#315EFB] dark:text-[#4D74FB]" : "text-[#172B4D] dark:text-[#F4F6FB]"}`}>
                        {card.title}
                      </p>
                      <p className="text-[11px] text-[#667085] dark:text-[#97A3B6] mt-1 leading-relaxed">
                        {card.description}
                      </p>
                    </div>
                    {isActive && (
                      <CheckCircle2 className="h-4 w-4 text-[#315EFB] shrink-0 mt-0.5" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Universe Selector */}
        <div className="bg-white dark:bg-[#131C2E] rounded-2xl border border-[#E5EAF2] dark:border-[#1F2E47] shadow-xs p-4 space-y-2.5">
          <p className="text-xs font-bold text-[#172B4D] dark:text-[#F4F6FB] uppercase tracking-wider">
            Select Company Universe
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            {UNIVERSE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setUniverse(opt.value)}
                className={`flex-1 rounded-xl border px-3 py-2 text-xs font-semibold transition-all active:scale-95 ${
                  universe === opt.value
                    ? "border-[#315EFB] bg-[#EEF3FC] dark:bg-[#1A2844] text-[#315EFB] dark:text-[#4D74FB]"
                    : "border-[#E5EAF2] dark:border-[#1F2E47] bg-[#F5F7FB] dark:bg-[#0B111E] text-[#667085] dark:text-[#97A3B6] hover:border-[#315EFB]"
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
            <RefreshCw className="h-8 w-8 animate-spin text-[#315EFB]" />
            <p className="text-xs text-[#667085] dark:text-[#97A3B6]">Screening verified exchange data...</p>
          </div>
        ) : candidates.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#E5EAF2] dark:border-[#1F2E47] bg-white dark:bg-[#131C2E] py-14 px-4 text-center">
            <AlertCircle className="h-10 w-10 text-amber-500 mb-2" />
            <h3 className="text-sm font-bold text-[#172B4D] dark:text-[#F4F6FB]">
              {emptyMessage || "No companies currently matched this screen"}
            </h3>
            <p className="text-xs text-[#667085] dark:text-[#97A3B6] mt-1 max-w-md">
              Current market valuations do not meet all criteria. Try another preset or expand the company universe.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-[#667085] dark:text-[#97A3B6]">
                Identified <strong className="text-[#172B4D] dark:text-[#F4F6FB]">{candidates.length}</strong> qualifying companies
              </p>
              <button
                type="button"
                onClick={runScan}
                disabled={loading}
                className="flex items-center gap-1.5 text-xs font-semibold text-[#315EFB] dark:text-[#4D74FB] hover:underline"
              >
                <RefreshCw className="h-3 w-3" />
                Refresh Screen
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {candidates.map((cand: any) => {
                const isPos = (cand.pct_change || 0) >= 0;
                const scoreWidth = Math.min(100, Math.max(0, cand.overall_score || 0));
                return (
                  <div
                    key={cand.symbol}
                    className="bg-white dark:bg-[#131C2E] rounded-2xl border border-[#E5EAF2] dark:border-[#1F2E47] shadow-xs hover:border-[#315EFB] transition-all p-5 space-y-3.5"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="h-10 w-10 rounded-xl bg-[#EEF3FC] dark:bg-[#1A2844] flex items-center justify-center font-bold text-xs text-[#315EFB] dark:text-[#4D74FB]">
                          {cand.symbol.slice(0, 2)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#172B4D] dark:text-[#F4F6FB] leading-tight">
                            {cand.company_name || cand.symbol}
                          </p>
                          <p className="text-xs text-[#667085] dark:text-[#97A3B6] font-mono">{cand.symbol} • {cand.sector || "Equities"}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-base font-bold font-mono text-[#172B4D] dark:text-[#F4F6FB] tabular-nums">
                          ₹{Number(cand.price).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        <p className={`text-xs font-semibold flex items-center justify-end gap-0.5 font-mono tabular-nums ${isPos ? "text-[#14866D]" : "text-[#D94B50]"}`}>
                          {isPos ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                          {isPos ? "+" : ""}{cand.pct_change?.toFixed(2)}%
                        </p>
                      </div>
                    </div>

                    {/* Research Score Bar */}
                    <div>
                      <div className="flex items-center justify-between mb-1 text-xs">
                        <span className="font-semibold text-[#667085] dark:text-[#97A3B6]">Research Score</span>
                        <span className="font-bold text-[#315EFB] dark:text-[#4D74FB] font-mono">{cand.overall_score}/100</span>
                      </div>
                      <div className="h-1.5 bg-[#F5F7FB] dark:bg-[#0B111E] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#315EFB] rounded-full transition-all"
                          style={{ width: `${scoreWidth}%` }}
                        />
                      </div>
                    </div>

                    {/* Why this appeared */}
                    <div className="rounded-xl bg-[#F5F7FB] dark:bg-[#0B111E] border border-[#E5EAF2] dark:border-[#1F2E47] p-2.5 space-y-0.5 text-xs">
                      <p className="text-[10px] font-bold text-[#315EFB] dark:text-[#4D74FB] uppercase tracking-wider">Why it qualified</p>
                      <p className="text-[#172B4D] dark:text-[#F4F6FB] leading-relaxed">{cand.shortlist_reason}</p>
                    </div>

                    {/* Main Risk */}
                    <div className="rounded-xl bg-[#FFF9EB] dark:bg-[#B45309]/10 border border-[#FEE8A2] dark:border-[#B45309]/30 p-2.5 space-y-0.5 text-xs text-[#B45309]">
                      <p className="text-[10px] font-bold uppercase tracking-wider">Main risk to verify</p>
                      <p className="leading-relaxed">{cand.invalidation_condition}</p>
                    </div>

                    {/* Footer button */}
                    <div className="pt-2 border-t border-[#E5EAF2] dark:border-[#1F2E47] flex items-center justify-between">
                      <span className="text-[10px] text-[#8993A4]">Verified exchange figures</span>
                      <button
                        type="button"
                        onClick={() => onSelectStock(cand.symbol)}
                        className="flex items-center gap-1 text-xs font-semibold text-[#315EFB] dark:text-[#4D74FB] hover:underline"
                      >
                        <span>Analyze Dossier</span>
                        <ChevronRight className="h-3.5 w-3.5" />
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
    <div className="space-y-5 p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#E5EAF2] dark:border-[#1F2E47] pb-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="h-8 w-8 rounded-xl bg-[#EEF3FC] dark:bg-[#1A2844] text-[#315EFB] dark:text-[#4D74FB] flex items-center justify-center">
              <SearchCheck className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-[#172B4D] dark:text-[#F4F6FB]">
                  Quantitative &amp; Fundamental Equity Screener
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-[#EEF3FC] dark:bg-[#1A2844] text-[#315EFB] dark:text-[#4D74FB] border border-[#CAD9FB] dark:border-[#1F2E47]">
                  NSE UNIVERSE
                </span>
              </div>
              <p className="text-xs text-[#667085] dark:text-[#97A3B6] mt-0.5">
                Transparent multi-factor scoring with clear thesis criteria and mathematical invalidation boundaries.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={universe}
            onChange={(e) => setUniverse(e.target.value)}
            className="rounded-xl bg-white dark:bg-[#131C2E] border border-[#E5EAF2] dark:border-[#1F2E47] px-3 py-1.5 text-xs text-[#172B4D] dark:text-[#F4F6FB] focus:outline-none focus:border-[#315EFB] cursor-pointer shadow-xs"
          >
            <option value="NIFTY 50">Universe: NIFTY 50</option>
            <option value="NIFTY 100">Universe: NIFTY 100</option>
            <option value="NIFTY 500">Universe: NIFTY 500</option>
          </select>

          <button
            type="button"
            onClick={runScan}
            disabled={loading}
            className="flex items-center space-x-1.5 rounded-xl border border-[#E5EAF2] dark:border-[#1F2E47] bg-white dark:bg-[#131C2E] px-3 py-1.5 text-xs font-semibold text-[#172B4D] dark:text-[#F4F6FB] hover:bg-[#F5F7FB] dark:hover:bg-[#1A2844] transition shadow-xs"
          >
            <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin text-[#315EFB]" : "text-[#667085]"}`} />
            <span>Rescan</span>
          </button>
        </div>
      </div>

      {/* Advanced Strategy Filter Ribbon */}
      <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar pb-1">
        {ADVANCED_TABS.map((tab) => {
          const active = scanType === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setScanType(tab.id)}
              className={`rounded-xl px-3.5 py-2 text-left transition shrink-0 ${
                active
                  ? "bg-[#315EFB] text-white shadow-xs"
                  : "bg-white dark:bg-[#131C2E] border border-[#E5EAF2] dark:border-[#1F2E47] text-[#667085] dark:text-[#97A3B6] hover:border-[#315EFB]"
              }`}
            >
              <div className="text-xs font-bold leading-tight">{tab.label}</div>
              <div className={`text-[10px] mt-0.5 ${active ? "text-white/80" : "text-[#8993A4]"}`}>
                {tab.desc}
              </div>
            </button>
          );
        })}
      </div>

      {/* Results Table */}
      {loading ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-[#E5EAF2] dark:border-[#1F2E47] bg-white dark:bg-[#131C2E]">
          <RefreshCw className="h-6 w-6 animate-spin text-[#315EFB]" />
          <span className="mt-2 text-xs text-[#667085] dark:text-[#97A3B6]">
            Executing {scanType} scan across {universe}...
          </span>
        </div>
      ) : candidates.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#E5EAF2] dark:border-[#1F2E47] bg-white dark:bg-[#131C2E] py-14 text-center">
          <AlertCircle className="h-8 w-8 text-[#8993A4] mb-2" />
          <p className="text-xs text-[#667085] dark:text-[#97A3B6]">
            {emptyMessage || "No candidates qualified under the current statistical threshold."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[#E5EAF2] dark:border-[#1F2E47] bg-white dark:bg-[#131C2E] shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#E5EAF2] dark:border-[#1F2E47] bg-[#F5F7FB] dark:bg-[#0B111E] text-[10px] font-bold uppercase tracking-wider text-[#667085] dark:text-[#97A3B6]">
              <tr>
                <th className="px-4 py-3">Symbol / Company</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Change</th>
                <th className="px-4 py-3">Score</th>
                <th className="px-4 py-3">Qualification Thesis</th>
                <th className="px-4 py-3">Invalidation Boundary</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5EAF2] dark:divide-[#1F2E47]">
              {candidates.map((cand: any) => {
                const isPos = (cand.pct_change || 0) >= 0;
                return (
                  <tr key={cand.symbol} className="hover:bg-[#F5F7FB] dark:hover:bg-[#1A2844] transition-colors">
                    <td className="px-4 py-3 font-semibold text-[#172B4D] dark:text-[#F4F6FB]">
                      <div className="font-mono">{cand.symbol}</div>
                      <div className="text-[10px] text-[#667085] dark:text-[#97A3B6]">{cand.company_name}</div>
                    </td>
                    <td className="px-4 py-3 font-mono font-medium text-[#172B4D] dark:text-[#F4F6FB] tabular-nums">
                      ₹{cand.price ? Number(cand.price).toFixed(2) : "--"}
                    </td>
                    <td className={`px-4 py-3 font-mono font-semibold tabular-nums ${isPos ? "text-[#14866D]" : "text-[#D94B50]"}`}>
                      {isPos ? "+" : ""}{cand.pct_change ? cand.pct_change.toFixed(2) : "0.00"}%
                    </td>
                    <td className="px-4 py-3 font-mono text-[#315EFB] dark:text-[#4D74FB] font-bold tabular-nums">
                      {cand.overall_score || "--"}/100
                    </td>
                    <td className="px-4 py-3 text-[#172B4D] dark:text-[#F4F6FB] max-w-xs">
                      {cand.shortlist_reason}
                    </td>
                    <td className="px-4 py-3 text-[#B45309] text-[11px] max-w-xs">
                      {cand.invalidation_condition}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => onSelectStock(cand.symbol)}
                        className="rounded-lg bg-[#315EFB] hover:bg-[#204AE0] px-3 py-1 text-xs font-semibold text-white transition active:scale-95 shadow-xs"
                      >
                        Dossier
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ScreenerView;
