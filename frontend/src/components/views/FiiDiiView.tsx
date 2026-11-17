"use client";

import React, { useEffect, useState } from "react";
import { Landmark, ArrowUpRight, ArrowDownRight, RefreshCw, Info, AlertTriangle, TrendingUp, TrendingDown, Layers, HelpCircle } from "lucide-react";
import { api } from "@/lib/api";
import { useExperienceMode } from "@/context/ExperienceModeContext";
import { ExplainThis } from "@/components/ui/ExplainThis";

export const FiiDiiView: React.FC = () => {
  const { isBeginner } = useExperienceMode();
  const [data, setData] = useState<any>(null);
  const [sessions, setSessions] = useState(30);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.getFiiDii(sessions);
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [sessions]);

  const history = data?.history || [];
  const latest = data?.latest_session || {};
  const roll5 = data?.rolling_5_session || {};
  const roll20 = data?.rolling_20_session || {};
  const streaks = data?.streaks || {};

  const formatCr = (val: number | undefined) => {
    if (val === undefined || val === null) return "--";
    const sign = val > 0 ? "+" : "";
    return `${sign}₹${Math.abs(val).toLocaleString("en-IN", { maximumFractionDigits: 1 })} Cr`;
  };

  const isFiiBullish = (latest.fii_net || 0) >= 0;
  const isDiiBullish = (latest.dii_net || 0) >= 0;
  const isCombBullish = ((latest.fii_net || 0) + (latest.dii_net || 0)) >= 0;

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-200 dark:border-white/[0.08] pb-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="h-8 w-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Landmark className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100">
                  Institutional Cash Market Flows (FII & DII)
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">
                  BSE/NSE OFFICIAL CASH
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Official cash market purchases and sales in INR Crores. F&O positioning tracked separately.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-gray-100 dark:bg-gray-900/60 p-0.5 rounded-xl border border-gray-200 dark:border-white/[0.08]">
            {[10, 20, 30].map((s) => (
              <button
                key={s}
                onClick={() => setSessions(s)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition active:scale-95 ${
                  sessions === s
                    ? "bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {s}D
              </button>
            ))}
          </div>
          <button
            onClick={loadData}
            disabled={loading}
            className="flex items-center space-x-1 rounded-xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-gray-800 px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition active:scale-95 shadow-sm"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-blue-600" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Beginner Explanatory Banner */}
      {isBeginner && (
        <div className="rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/40 p-4 text-xs text-gray-700 dark:text-gray-300 space-y-2">
          <div className="flex items-center space-x-2 font-bold text-blue-900 dark:text-blue-200 text-sm">
            <HelpCircle className="h-4 w-4 text-blue-600" />
            <span>Why Do FII & DII Flows Matter?</span>
          </div>
          <p className="leading-relaxed">
            <strong>Foreign Institutional Investors (FII)</strong> are large international funds. When they buy Indian stocks aggressively, prices usually rise. When they sell, markets can face pressure.
          </p>
          <p className="leading-relaxed">
            <strong>Domestic Institutional Investors (DII)</strong> are Indian mutual funds and LIC. They often act as market stabilizers, buying shares when foreign funds are selling.
          </p>
        </div>
      )}

      {/* Top 3 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* Latest Session */}
        <div className="rounded-3xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#0E1524] p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Latest Session ({latest.date || "Today"})
            </span>
            <span
              className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isCombBullish
                  ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20"
                  : "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20"
              }`}
            >
              {isCombBullish ? "NET BUYERS" : "NET SELLERS"}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <span className="text-gray-600 dark:text-gray-400">Foreign (FII) Net Cash:</span>
                <ExplainThis term="FII" />
              </div>
              <span className={`font-mono font-bold tabular-nums ${isFiiBullish ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                {formatCr(latest.fii_net)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <span className="text-gray-600 dark:text-gray-400">Domestic (DII) Net Cash:</span>
                <ExplainThis term="DII" />
              </div>
              <span className={`font-mono font-bold tabular-nums ${isDiiBullish ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                {formatCr(latest.dii_net)}
              </span>
            </div>
            <div className="pt-2 border-t border-gray-100 dark:border-white/[0.08] flex items-center justify-between">
              <span className="font-semibold text-gray-800 dark:text-gray-300">Combined Net Flow:</span>
              <span className={`font-mono font-bold tabular-nums text-sm ${isCombBullish ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                {formatCr((latest.fii_net || 0) + (latest.dii_net || 0))}
              </span>
            </div>
          </div>
        </div>

        {/* Rolling 5-Session */}
        <div className="rounded-3xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#0E1524] p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Rolling 5-Session Cumulative
            </span>
            <span className="text-[10px] font-mono text-gray-400">Weekly Pulse</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">FII 5D Cumulative:</span>
              <span className={`font-mono font-bold tabular-nums ${(roll5.fii_net || 0) >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                {formatCr(roll5.fii_net)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">DII 5D Cumulative:</span>
              <span className={`font-mono font-bold tabular-nums ${(roll5.dii_net || 0) >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                {formatCr(roll5.dii_net)}
              </span>
            </div>
            <div className="pt-2 border-t border-gray-100 dark:border-white/[0.08] flex items-center justify-between">
              <span className="font-semibold text-gray-800 dark:text-gray-300">Net Institutional Balance:</span>
              <span className={`font-mono font-bold tabular-nums text-sm ${((roll5.fii_net || 0) + (roll5.dii_net || 0)) >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                {formatCr((roll5.fii_net || 0) + (roll5.dii_net || 0))}
              </span>
            </div>
          </div>
        </div>

        {/* Rolling 20-Session / Streaks */}
        <div className="rounded-3xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#0E1524] p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Active Institutional Bias
            </span>
            <span className="text-[10px] font-mono text-gray-400">Monthly</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">FII Buying/Selling Streak:</span>
              <span className="font-mono font-bold text-gray-800 dark:text-gray-200">
                {streaks.fii_streak || "Mixed Flow"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">DII Absorption Streak:</span>
              <span className="font-mono font-bold text-gray-800 dark:text-gray-200">
                {streaks.dii_streak || "Continuous Inflows"}
              </span>
            </div>
            <div className="pt-2 border-t border-gray-100 dark:border-white/[0.08] flex items-center justify-between">
              <span className="font-semibold text-gray-800 dark:text-gray-300">20D Net Balance:</span>
              <span className={`font-mono font-bold tabular-nums text-sm ${((roll20.fii_net || 0) + (roll20.dii_net || 0)) >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                {formatCr((roll20.fii_net || 0) + (roll20.dii_net || 0))}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Historical Ledger Table */}
      <div className="rounded-3xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#0E1524] shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-200 dark:border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Layers className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <h2 className="text-sm font-bold tracking-tight text-gray-900 dark:text-gray-100">
              Historical Day-by-Day Cash Flows Ledger
            </h2>
          </div>
          <span className="text-[11px] font-mono text-gray-500">
            All Values in ₹ Crores (Cr)
          </span>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-gray-50 dark:bg-gray-900/60 border-b border-gray-200 dark:border-white/[0.08] text-[10px] uppercase font-bold tracking-wider text-gray-500 dark:text-gray-400">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">FII Buy</th>
                <th className="py-3 px-4 text-right">FII Sell</th>
                <th className="py-3 px-4 text-right">FII Net</th>
                <th className="py-3 px-4 text-right">DII Buy</th>
                <th className="py-3 px-4 text-right">DII Sell</th>
                <th className="py-3 px-4 text-right">DII Net</th>
                <th className="py-3 px-4 text-right">Combined Net</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/[0.04]">
              {history.map((row: any, idx: number) => {
                const fiiNet = row.fii_net || 0;
                const diiNet = row.dii_net || 0;
                const combNet = fiiNet + diiNet;
                return (
                  <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition">
                    <td className="py-3 px-4 font-mono font-medium text-gray-700 dark:text-gray-300">
                      {row.date}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-gray-500 dark:text-gray-400">
                      ₹{Number(row.fii_buy || 0).toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-gray-500 dark:text-gray-400">
                      ₹{Number(row.fii_sell || 0).toLocaleString("en-IN")}
                    </td>
                    <td className={`py-3 px-4 text-right font-mono font-bold tabular-nums ${fiiNet >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                      {formatCr(fiiNet)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-gray-500 dark:text-gray-400">
                      ₹{Number(row.dii_buy || 0).toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-gray-500 dark:text-gray-400">
                      ₹{Number(row.dii_sell || 0).toLocaleString("en-IN")}
                    </td>
                    <td className={`py-3 px-4 text-right font-mono font-bold tabular-nums ${diiNet >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                      {formatCr(diiNet)}
                    </td>
                    <td className={`py-3 px-4 text-right font-mono font-bold tabular-nums ${combNet >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                      {formatCr(combNet)}
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
