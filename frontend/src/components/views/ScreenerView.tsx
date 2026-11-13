"use client";

import React, { useEffect, useState } from "react";
import { SearchCheck, Filter, ArrowUpRight, ArrowDownRight, RefreshCw, AlertCircle, ChevronRight, CheckCircle2 } from "lucide-react";
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

  return (
    <div className="space-y-4 p-4 max-w-7xl mx-auto">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-800 pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <SearchCheck className="h-5 w-5 text-blue-400" />
            <h1 className="text-base font-bold uppercase tracking-wider text-gray-100">
              Quantitative & Fundamental Stock Screener
            </h1>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Transparent multi-factor scoring. Strict zero-fabrication criteria with clear invalidation bounds.
          </p>
        </div>

        {/* Universe & Scan Selector */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Universe Selector */}
          <select
            value={universe}
            onChange={(e) => setUniverse(e.target.value)}
            className="rounded bg-gray-900 border border-gray-800 px-2.5 py-1 text-xs text-gray-200 focus:outline-none focus:border-blue-500"
          >
            <option value="NIFTY 50">Universe: NIFTY 50</option>
            <option value="NIFTY 100">Universe: NIFTY 100</option>
            <option value="NIFTY 500">Universe: NIFTY 500 Liquid</option>
          </select>

          <button
            onClick={runScan}
            disabled={loading}
            className="flex items-center space-x-1 rounded bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-500 transition"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Run Scanner</span>
          </button>
        </div>
      </div>

      {/* Scanner Category Tabs */}
      <div className="flex overflow-x-auto space-x-1.5 pb-1">
        {[
          { id: "MOMENTUM", label: "Momentum Scanner", desc: "MA alignment & RSI" },
          { id: "BREAKOUT", label: "Breakout Scanner", desc: "Near 52W High" },
          { id: "REVERSAL", label: "Reversal Scanner", desc: "Oversold RSI < 38" },
          { id: "QUALITY", label: "Fundamental Quality", desc: "ROE > 15%, ROCE > 18%" },
          { id: "VALUE", label: "Value Scanner", desc: "PE < 24 with positive CFO" },
          { id: "VOLUME", label: "Volume Scanner", desc: "RVOL > 1.4x surge" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setScanType(tab.id)}
            className={`flex-shrink-0 rounded-md border px-3 py-2 text-left transition ${
              scanType === tab.id
                ? "border-blue-500 bg-blue-950/40 text-blue-200"
                : "border-gray-800 bg-[#111827] text-gray-400 hover:border-gray-700 hover:text-gray-200"
            }`}
          >
            <p className="text-xs font-bold">{tab.label}</p>
            <p className="text-[10px] text-gray-500 mt-0.5">{tab.desc}</p>
          </button>
        ))}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>
          Screened <strong>{results?.total_screened || 0}</strong> instruments in <strong>{universe}</strong>
        </span>
        <span>
          Shortlisted: <strong>{candidates.length} candidates</strong>
        </span>
      </div>

      {/* Candidates List or Truthful Empty State */}
      {loading ? (
        <div className="flex h-48 items-center justify-center rounded-lg border border-gray-800 bg-[#111827]">
          <RefreshCw className="h-6 w-6 animate-spin text-blue-500" />
          <span className="ml-2 text-xs text-gray-400">Executing quantitative scans...</span>
        </div>
      ) : candidates.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-800 bg-[#111827]/60 py-12 px-4 text-center">
          <AlertCircle className="h-8 w-8 text-amber-500 mb-2" />
          <h3 className="text-sm font-bold text-gray-200 tracking-wide uppercase">
            {emptyMessage || "NO HIGH-QUALITY SETUP FOUND TODAY."}
          </h3>
          <p className="text-xs text-gray-400 mt-1 max-w-md">
            The market criteria were strictly evaluated without forcing synthetic candidates. Try expanding your universe or switching the scanner type.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {candidates.map((cand: any) => {
            const isPos = cand.pct_change >= 0;
            return (
              <div
                key={cand.symbol}
                className="rounded-lg border border-gray-800 bg-[#111827] p-4 shadow transition hover:border-blue-500/80"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-gray-100">{cand.symbol}</span>
                      <span className="rounded bg-blue-950/80 border border-blue-800/40 px-1.5 py-0.2 text-[9px] font-bold text-blue-300">
                        {cand.category?.replace(/_/g, " ")}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">{cand.company_name}</p>
                    <p className="text-[10px] text-gray-500">{cand.sector}</p>
                  </div>

                  <div className="text-right font-mono">
                    <p className="text-sm font-bold text-gray-100">₹{cand.price.toFixed(2)}</p>
                    <p className={`text-xs font-semibold ${isPos ? "text-emerald-400" : "text-red-400"}`}>
                      {isPos ? `+${cand.pct_change.toFixed(2)}%` : `${cand.pct_change.toFixed(2)}%`}
                    </p>
                  </div>
                </div>

                {/* Transparent Score Bar */}
                <div className="mt-3 grid grid-cols-3 gap-2 border-y border-gray-800/80 py-2 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-gray-500">Overall Score</span>
                    <p className="font-mono font-bold text-blue-400">{cand.overall_score}/100</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500">Technical Score</span>
                    <p className="font-mono font-bold text-emerald-400">{cand.technical_score}/100</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500">Fundamental Score</span>
                    <p className="font-mono font-bold text-indigo-400">{cand.fundamental_score}/100</p>
                  </div>
                </div>

                {/* Shortlist Rationale & Catalysts */}
                <div className="mt-2.5 space-y-1.5 text-xs">
                  <p className="text-gray-300">
                    <strong className="text-gray-400">Shortlist Thesis: </strong>
                    {cand.shortlist_reason}
                  </p>
                  {cand.catalysts && cand.catalysts.length > 0 && (
                    <div className="flex items-start space-x-1.5 text-emerald-400 text-[11px]">
                      <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                      <span>{cand.catalysts[0]}</span>
                    </div>
                  )}
                  <div className="rounded bg-gray-900/80 p-2 text-[10px] text-gray-400">
                    <strong className="text-gray-300">Invalidation Bound: </strong>
                    {cand.invalidation_condition}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={() => onSelectStock(cand.symbol)}
                    className="flex items-center space-x-1 text-xs font-semibold text-blue-400 hover:text-blue-300 transition"
                  >
                    <span>Full Equity Research Dossier</span>
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

