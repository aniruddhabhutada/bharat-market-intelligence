"use client";

import React, { useEffect, useState } from "react";
import { PieChart, TrendingUp, TrendingDown, RefreshCw, BarChart2, Compass, Sparkles } from "lucide-react";
import { api } from "@/lib/api";

export const SectorView: React.FC = () => {
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
    <div className="space-y-5 p-3 sm:p-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="h-8 w-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <PieChart className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100">
                  16 Indian Sectors: Heatmap & Relative Strength Rotation
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  NSE SECTORAL
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Relative strength ranking against NIFTY 50 benchmark ({niftyBenchmark > 0 ? "+" : ""}{niftyBenchmark}%).
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Metric Selector Pills */}
          <div className="flex bg-gray-900/60 p-0.5 rounded-xl border border-white/[0.08]">
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
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={loadSectors}
            disabled={loading}
            className="rounded-xl border border-white/[0.08] bg-gray-900/60 p-2 text-gray-300 hover:text-white transition active:scale-95"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-blue-400" : ""}`} />
          </button>
        </div>
      </div>

      {/* Rotation Commentary Banner */}
      <div className="glass-card rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/30 to-blue-950/20 p-4 text-xs shadow-lg space-y-1">
        <div className="flex items-center space-x-2 text-indigo-300 font-bold uppercase tracking-wider text-[11px]">
          <Compass className="h-4 w-4 text-indigo-400" />
          <span>Sector Rotation Intelligence</span>
        </div>
        <p className="text-gray-300 leading-relaxed">
          {data?.rotation_commentary || "Defensive rotation underway with IT and Pharma showing accumulation while high-beta cyclicals consolidate."}
        </p>
      </div>

      {/* 16 Sectors Heatmap Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {sectors.map((sec: any) => {
          const val = sec[metric];
          const isPos = val >= 0;
          const isLeader = sec.leadership_status === "LEADER";

          return (
            <div
              key={sec.code}
              className={`group glass-card rounded-2xl p-4 transition flex flex-col justify-between border shadow-lg hover:scale-[1.02] duration-200 ${
                isPos
                  ? "border-emerald-500/30 hover:border-emerald-400/50 bg-gradient-to-b from-emerald-950/20 to-transparent"
                  : "border-rose-500/30 hover:border-rose-400/50 bg-gradient-to-b from-rose-950/20 to-transparent"
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="font-bold text-xs sm:text-sm text-gray-100 group-hover:text-blue-300 transition tracking-tight">
                    {sec.sector}
                  </span>
                  {isLeader && (
                    <span className="rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.2 text-[9px] font-bold text-emerald-300">
                      LEADER
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-gray-400 font-mono mt-0.5 block">{sec.index_name}</span>
              </div>

              <div className="mt-4 flex items-baseline justify-between border-t border-white/[0.06] pt-2.5">
                <span className="text-xs font-mono text-gray-400 tabular-nums">
                  ₹{typeof sec.price === "number" ? sec.price.toLocaleString("en-IN") : sec.price}
                </span>
                <span
                  className={`text-sm sm:text-base font-mono font-bold tabular-nums ${
                    isPos ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {isPos ? `+${val}%` : `${val}%`}
                </span>
              </div>

              <div className="mt-2.5 flex items-center justify-between text-[10px] text-gray-400 font-mono">
                <span>RS: {sec.relative_strength_vs_nifty > 0 ? "+" : ""}{sec.relative_strength_vs_nifty}%</span>
                <span>Breadth: {sec.breadth_pct}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
