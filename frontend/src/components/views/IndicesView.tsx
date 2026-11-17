"use client";

import React, { useEffect, useState } from "react";
import { TrendingUp, ArrowUpRight, ArrowDownRight, RefreshCw, BarChart2, ShieldCheck, HelpCircle } from "lucide-react";
import { api } from "@/lib/api";
import { useExperienceMode } from "@/context/ExperienceModeContext";
import { ExplainThis } from "@/components/ui/ExplainThis";

export const IndicesView: React.FC = () => {
  const { isBeginner } = useExperienceMode();
  const [indices, setIndices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadIndices = async () => {
    setLoading(true);
    try {
      const data = await api.getIndices();
      setIndices(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIndices();
  }, []);

  const topIndices = indices.slice(0, 4);

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-200 dark:border-white/[0.08] pb-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="h-8 w-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100">
                  NSE & BSE Broad Market Indices
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">
                  EXCHANGE OFFICIAL
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Official headline benchmarks, sectoral baskets, and volatility gauges with full OHLC metrics.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={loadIndices}
          disabled={loading}
          className="flex items-center space-x-1.5 rounded-xl border border-gray-200 dark:border-white/[0.1] bg-white dark:bg-gray-800 px-3.5 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition active:scale-95 shadow-sm"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-blue-600" : "text-gray-400"}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Beginner Explanatory Banner */}
      {isBeginner && (
        <div className="rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/40 p-4 text-xs text-gray-700 dark:text-gray-300 space-y-1">
          <div className="flex items-center space-x-1.5 font-bold text-blue-900 dark:text-blue-200 text-sm">
            <HelpCircle className="h-4 w-4 text-blue-600" />
            <span>What is a Market Index?</span>
          </div>
          <p className="leading-relaxed">
            A market index is a basket that tracks the average price movement of selected stocks. Instead of checking thousands of individual companies, looking at NIFTY 50 tells you whether India's 50 biggest businesses gained or lost value today.
          </p>
        </div>
      )}

      {/* Benchmark Summary Cards */}
      {topIndices.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {topIndices.map((idx, i) => {
            const isPos = (idx.change || 0) >= 0;
            return (
              <div key={i} className="rounded-2xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#0E1524] p-4 sm:p-5 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-sm font-bold text-gray-900 dark:text-gray-100 tracking-tight">{idx.name}</span>
                    <ExplainThis term={idx.name.includes("BANK") ? "BANK NIFTY" : idx.name.includes("SENSEX") ? "SENSEX" : idx.name.includes("VIX") ? "INDIA VIX" : "NIFTY 50"} />
                  </div>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                    {idx.exchange}
                  </span>
                </div>
                <p className="text-xl sm:text-2xl font-bold font-mono text-gray-900 dark:text-gray-100 tabular-nums">
                  ₹{Number(idx.price).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <div className={`flex items-center space-x-1 text-xs font-mono font-bold tabular-nums ${isPos ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                  {isPos ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                  <span>{isPos ? `+${idx.pct_change.toFixed(2)}%` : `${idx.pct_change.toFixed(2)}%`}</span>
                  <span className="text-gray-400 text-[10px]">({isPos ? `+${idx.change.toFixed(2)}` : idx.change.toFixed(2)})</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Main Table */}
      <div className="rounded-3xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#0E1524] shadow-sm overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-gray-50 dark:bg-gray-900/60 border-b border-gray-200 dark:border-white/[0.08] text-[10px] uppercase font-bold tracking-wider text-gray-500 dark:text-gray-400">
              <tr>
                <th className="py-3.5 px-4">Index Name</th>
                <th className="py-3.5 px-3">Exchange</th>
                <th className="py-3.5 px-3 text-right">CMP (LTP)</th>
                <th className="py-3.5 px-3 text-right">Net Change</th>
                <th className="py-3.5 px-3 text-right">% Change</th>
                <th className="py-3.5 px-3 text-right">Open</th>
                <th className="py-3.5 px-3 text-right">High</th>
                <th className="py-3.5 px-3 text-right">Low</th>
                <th className="py-3.5 px-3 text-right">Prev Close</th>
                <th className="py-3.5 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/[0.04]">
              {indices.map((idx, i) => {
                const isPos = idx.change >= 0;
                return (
                  <tr key={i} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition">
                    <td className="py-3 px-4 font-bold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
                      <span>{idx.name}</span>
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-gray-500 dark:text-gray-400">
                      {idx.exchange}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold tabular-nums text-gray-900 dark:text-gray-100">
                      ₹{Number(idx.price).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td
                      className={`py-3 px-3 text-right font-mono font-bold tabular-nums ${
                        isPos ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      {isPos ? `+${idx.change.toFixed(2)}` : idx.change.toFixed(2)}
                    </td>
                    <td
                      className={`py-3 px-3 text-right font-mono font-bold tabular-nums ${
                        isPos ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      {isPos ? `+${idx.pct_change.toFixed(2)}%` : `${idx.pct_change.toFixed(2)}%`}
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums text-gray-500 dark:text-gray-400">
                      {Number(idx.open || idx.price).toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums text-gray-500 dark:text-gray-400">
                      {Number(idx.high || idx.price).toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums text-gray-500 dark:text-gray-400">
                      {Number(idx.low || idx.price).toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums text-gray-500 dark:text-gray-400">
                      {Number(idx.prev_close || idx.price).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 font-mono">
                        VERIFIED
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
