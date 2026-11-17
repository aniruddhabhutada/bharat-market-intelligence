"use client";

import React, { useEffect, useState } from "react";
import { PieChart, TrendingUp, TrendingDown, RefreshCw, BarChart2, Compass, Sparkles, HelpCircle } from "lucide-react";
import { api } from "@/lib/api";
import { useExperienceMode } from "@/context/ExperienceModeContext";

export const SectorView: React.FC = () => {
  const { isBeginner } = useExperienceMode();
  const [data, setData] = useState<any>(null);
  const [metric, setMetric] = useState<"daily_pct" | "weekly_pct" | "monthly_pct">("daily_pct");
  const [loading, setLoading] = useState(true);

  const loadSectors = async () => {
    setLoading(true);
    try {
      const res = await api.getSectors();
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSectors();
  }, []);

  const sectors = data?.sectors || [];
  const niftyBenchmark = data?.nifty_benchmark_pct || 0.0;

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-200 dark:border-white/[0.08] pb-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="h-8 w-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <PieChart className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100">
                  Sector Performance & Relative Strength Rotation
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20">
                  NSE SECTORS
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Relative performance of 16 industries measured against the NIFTY 50 benchmark ({niftyBenchmark > 0 ? "+" : ""}{niftyBenchmark}%).
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Metric Selector Pills */}
          <div className="flex bg-gray-100 dark:bg-gray-900/60 p-0.5 rounded-xl border border-gray-200 dark:border-white/[0.08]">
            {[
              { id: "daily_pct", label: "Daily" },
              { id: "weekly_pct", label: "Weekly" },
              { id: "monthly_pct", label: "Monthly" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setMetric(tab.id as any)}
                className={`rounded-lg px-3 py-1 text-xs font-semibold transition active:scale-95 ${
                  metric === tab.id
                    ? "bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={loadSectors}
            disabled={loading}
            className="rounded-xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-gray-800 p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition active:scale-95 shadow-sm"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-blue-600" : ""}`} />
          </button>
        </div>
      </div>

      {/* Beginner Explanation */}
      {isBeginner && (
        <div className="rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800/40 p-4 text-xs text-gray-700 dark:text-gray-300 space-y-1">
          <div className="flex items-center space-x-1.5 font-bold text-indigo-900 dark:text-indigo-200 text-sm">
            <HelpCircle className="h-4 w-4 text-indigo-600" />
            <span>Why Track Sectors?</span>
          </div>
          <p className="leading-relaxed">
            Money in the stock market constantly rotates from one industry to another. When economic growth accelerates, cyclicals like Banking and Auto often rally. In uncertain times, defensives like Pharmaceuticals and IT tend to attract capital.
          </p>
        </div>
      )}

      {/* Rotation Commentary Banner */}
      <div className="rounded-3xl border border-indigo-200 dark:border-indigo-500/30 bg-white dark:bg-[#0E1524] p-5 text-xs shadow-sm space-y-1.5">
        <div className="flex items-center space-x-2 text-indigo-700 dark:text-indigo-300 font-bold uppercase tracking-wider text-[11px]">
          <Compass className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <span>Sector Rotation Intelligence</span>
        </div>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-xs sm:text-sm">
          {data?.rotation_commentary || "Defensive rotation underway with IT and Pharma showing steady accumulation while high-beta cyclicals consolidate."}
        </p>
      </div>

      {/* 16 Sectors Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {sectors.map((sec: any) => {
          const val = sec[metric];
          const isPos = val >= 0;
          const isLeader = sec.leadership_status === "LEADER";

          return (
            <div
              key={sec.code}
              className={`rounded-2xl p-4 transition flex flex-col justify-between border shadow-sm hover:shadow-md ${
                isPos
                  ? "border-emerald-200 dark:border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-950/20"
                  : "border-rose-200 dark:border-rose-500/30 bg-rose-50/40 dark:bg-rose-950/20"
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="font-bold text-xs sm:text-sm text-gray-900 dark:text-gray-100 tracking-tight">
                    {sec.sector}
                  </span>
                  {isLeader && (
                    <span className="rounded-full bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-300 dark:border-emerald-500/30 px-2 py-0.2 text-[9px] font-bold text-emerald-800 dark:text-emerald-300">
                      LEADER
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-gray-500 dark:text-gray-400 font-mono mt-0.5 block">{sec.index_name}</span>
              </div>

              <div className="mt-4 flex items-baseline justify-between border-t border-gray-200/50 dark:border-white/[0.06] pt-2.5">
                <span className="text-xs font-mono text-gray-600 dark:text-gray-400 tabular-nums">
                  ₹{typeof sec.price === "number" ? sec.price.toLocaleString("en-IN") : sec.price}
                </span>
                <span
                  className={`text-sm sm:text-base font-mono font-bold tabular-nums ${
                    isPos ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                  }`}
                >
                  {isPos ? `+${val}%` : `${val}%`}
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between text-[10px] text-gray-500 dark:text-gray-400 font-mono">
                <span>RS vs Nifty: {sec.relative_strength_vs_nifty > 0 ? "+" : ""}{sec.relative_strength_vs_nifty}%</span>
                <span>Breadth: {sec.breadth_pct}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
