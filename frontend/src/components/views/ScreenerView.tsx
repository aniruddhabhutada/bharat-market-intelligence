"use client";

import React, { useEffect, useState } from "react";
import { SearchCheck, Filter, ArrowUpRight, ArrowDownRight, RefreshCw, AlertCircle, ChevronRight, CheckCircle2, SlidersHorizontal, Sparkles, ShieldAlert } from "lucide-react";
import { api } from "@/lib/api";

interface ScreenerViewProps {
  onSelectStock: (symbol: string) => void;
}

export const ScreenerView: React.FC<ScreenerViewProps> = ({ onSelectStock }) => {
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

  const TABS = [
    { id: "MOMENTUM", label: "Momentum", desc: "MA Stack & RSI" },
    { id: "BREAKOUT", label: "Breakout", desc: "Near 52W Highs" },
    { id: "REVERSAL", label: "Mean Reversion", desc: "Oversold RSI < 38" },
    { id: "QUALITY", label: "Quality Moat", desc: "ROE > 15%, ROCE > 18%" },
    { id: "VALUE", label: "Fair Value", desc: "PE < 24 & Positive CFO" },
    { id: "VOLUME", label: "Volume Shock", desc: "RVOL > 1.4x Surge" }
  ];

  return (
    <div className="space-y-5 p-3 sm:p-5 max-w-7xl mx-auto">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
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

        {/* Universe Selector & Scan Trigger */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={universe}
            onChange={(e) => setUniverse(e.target.value)}
            className="rounded-xl bg-gray-900/80 border border-white/[0.1] px-3 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-blue-500 cursor-pointer shadow-sm"
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
        {TABS.map((tab) => {
          const active = scanType === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setScanType(tab.id)}
              className={`flex-shrink-0 rounded-xl border px-3.5 py-2 text-left transition active:scale-95 ${
                active
                  ? "border-blue-500/80 bg-blue-600/10 dark:bg-blue-950/40 text-blue-300 shadow-md shadow-blue-500/10"
                  : "border-white/[0.06] bg-gray-900/60 dark:bg-gray-900/60 text-gray-400 hover:border-white/20 hover:text-gray-200"
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
          Evaluated <strong className="text-gray-200 font-mono">{results?.total_screened || 50}</strong> instruments in <strong className="text-gray-200">{universe}</strong>
        </span>
        <span className="flex items-center space-x-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span>Shortlisted: <strong className="text-emerald-400 font-mono">{candidates.length} setups</strong></span>
        </span>
      </div>

      {/* Candidates Grid or Honest Empty State */}
      {loading ? (
        <div className="flex flex-col h-56 items-center justify-center rounded-2xl border border-white/[0.08] glass-card">
          <RefreshCw className="h-7 w-7 animate-spin text-blue-400" />
          <span className="mt-3 text-xs font-medium text-gray-400">Evaluating multi-factor technical & fundamental criteria...</span>
        </div>
      ) : candidates.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.1] bg-gray-950/40 py-14 px-4 text-center">
          <AlertCircle className="h-10 w-10 text-amber-400 mb-3 opacity-80" />
          <h3 className="text-sm font-bold text-gray-200 tracking-wide uppercase">
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
                className="group glass-card rounded-2xl border border-white/[0.08] p-4 sm:p-5 shadow-xl hover:border-blue-500/40 transition space-y-4"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/30 flex items-center justify-center font-bold text-sm text-blue-300 font-mono">
                      {cand.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-base font-bold text-gray-100 group-hover:text-blue-300 transition tracking-tight">
                          {cand.symbol}
                        </span>
                        <span className="rounded-full bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-[10px] font-bold text-blue-300">
                          {cand.category?.replace(/_/g, " ") || scanType}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{cand.company_name}</p>
                      <p className="text-[11px] text-gray-500">{cand.sector}</p>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <p className="text-base font-bold text-gray-100 tabular-nums">
                      ₹{Number(cand.price).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p className={`text-xs font-semibold tabular-nums ${isPos ? "text-emerald-400" : "text-rose-400"}`}>
                      {isPos ? `+${cand.pct_change.toFixed(2)}%` : `${cand.pct_change.toFixed(2)}%`}
                    </p>
                  </div>
                </div>

                {/* Score Gauges */}
                <div className="grid grid-cols-3 gap-2 rounded-xl bg-gray-950/60 p-2.5 border border-white/[0.06] text-center text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400">Overall</span>
                    <p className="font-mono font-bold text-blue-400 text-sm mt-0.5 tabular-nums">
                      {cand.overall_score}/100
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400">Technical</span>
                    <p className="font-mono font-bold text-emerald-400 text-sm mt-0.5 tabular-nums">
                      {cand.technical_score}/100
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400">Fundamental</span>
                    <p className="font-mono font-bold text-indigo-400 text-sm mt-0.5 tabular-nums">
                      {cand.fundamental_score}/100
                    </p>
                  </div>
                </div>

                {/* Thesis & Catalysts */}
                <div className="space-y-2 text-xs">
                  <p className="text-gray-300 leading-relaxed">
                    <strong className="text-gray-400">Thesis: </strong>
                    {cand.shortlist_reason}
                  </p>

                  {cand.catalysts && cand.catalysts.length > 0 && (
                    <div className="flex items-start space-x-1.5 text-emerald-400 text-[11px]">
                      <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                      <span>{cand.catalysts[0]}</span>
                    </div>
                  )}

                  <div className="rounded-xl bg-amber-500/[0.08] border border-amber-500/20 p-2.5 text-[11px] text-amber-300/90 leading-tight">
                    <strong className="text-amber-200">Invalidation Bound: </strong>
                    {cand.invalidation_condition}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="text-[10px] font-mono text-gray-500">Live Valuation Model</span>
                  <button
                    onClick={() => onSelectStock(cand.symbol)}
                    className="flex items-center space-x-1 text-xs font-semibold text-blue-400 hover:text-blue-300 transition"
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
