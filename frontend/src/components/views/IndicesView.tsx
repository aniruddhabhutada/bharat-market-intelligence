"use client";

import React, { useEffect, useState } from "react";
import { TrendingUp, ArrowUpRight, ArrowDownRight, RefreshCw, BarChart2, ShieldCheck } from "lucide-react";
import { api } from "@/lib/api";

export const IndicesView: React.FC = () => {
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
    <div className="space-y-5 p-3 sm:p-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="h-8 w-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100">
                  NSE & BSE Broad Market Indices
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
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
          className="flex items-center space-x-1.5 rounded-xl border border-white/[0.1] bg-gray-900/40 hover:bg-gray-800/60 dark:bg-gray-800/50 dark:hover:bg-gray-700/60 px-3.5 py-2 text-xs font-semibold text-gray-200 transition active:scale-95 shadow-sm"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-blue-400" : "text-gray-400"}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Benchmark Summary Cards */}
      {topIndices.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {topIndices.map((idx, i) => {
            const isPos = (idx.change || 0) >= 0;
            return (
              <div key={i} className="glass-card rounded-2xl p-4 border border-white/[0.08] shadow-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-200 tracking-tight">{idx.name}</span>
                  <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-white/[0.04] text-gray-400">
                    {idx.exchange}
                  </span>
                </div>
                <p className="text-lg font-bold font-mono text-gray-100 tabular-nums">
                  ₹{Number(idx.price).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <div className={`flex items-center space-x-1 text-xs font-mono font-bold tabular-nums ${isPos ? "text-emerald-400" : "text-rose-400"}`}>
                  {isPos ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                  <span>{isPos ? `+${idx.pct_change.toFixed(2)}%` : `${idx.pct_change.toFixed(2)}%`}</span>
                  <span className="text-gray-500 text-[10px]">({isPos ? `+${idx.change.toFixed(2)}` : idx.change.toFixed(2)})</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Main Table */}
      <div className="glass-card rounded-2xl border border-white/[0.08] shadow-xl overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-gray-900/60 dark:bg-gray-950/70 border-b border-white/[0.08] text-[10px] uppercase font-bold tracking-wider text-gray-400">
              <tr>
                <th className="py-3 px-4">Index Name</th>
                <th className="py-3 px-3">Exchange</th>
                <th className="py-3 px-3 text-right">CMP (LTP)</th>
                <th className="py-3 px-3 text-right">Net Change</th>
                <th className="py-3 px-3 text-right">% Change</th>
                <th className="py-3 px-3 text-right">Open</th>
                <th className="py-3 px-3 text-right">High</th>
                <th className="py-3 px-3 text-right">Low</th>
                <th className="py-3 px-3 text-right">Prev Close</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {indices.map((idx, i) => {
                const isPos = idx.change >= 0;
                return (
                  <tr key={i} className="hover:bg-white/[0.02] transition">
                    <td className="py-3 px-4 font-bold text-gray-100 flex items-center space-x-2">
                      <span>{idx.name}</span>
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-gray-400">
                      {idx.exchange}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold tabular-nums text-gray-100">
                      ₹{Number(idx.price).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td
                      className={`py-3 px-3 text-right font-mono font-bold tabular-nums ${
                        isPos ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {isPos ? `+${idx.change.toFixed(2)}` : idx.change.toFixed(2)}
                    </td>
                    <td
                      className={`py-3 px-3 text-right font-mono font-bold tabular-nums ${
                        isPos ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {isPos ? `+${idx.pct_change.toFixed(2)}%` : `${idx.pct_change.toFixed(2)}%`}
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums text-gray-400">
                      {Number(idx.open || idx.price).toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums text-gray-400">
                      {Number(idx.high || idx.price).toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums text-gray-400">
                      {Number(idx.low || idx.price).toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums text-gray-400">
                      {Number(idx.prev_close || idx.price).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                        LIVE
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
