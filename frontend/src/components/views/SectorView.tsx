"use client";

import React, { useEffect, useState } from "react";
import { PieChart, TrendingUp, TrendingDown, RefreshCw, BarChart2 } from "lucide-react";
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
    <div className="space-y-4 p-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-gray-800 pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <PieChart className="h-5 w-5 text-indigo-400" />
            <h1 className="text-base font-bold uppercase tracking-wider text-gray-100">
              16 Indian Sectors: Heatmap & Rotation Analysis
            </h1>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Relative strength ranking against NIFTY 50 benchmark ({niftyBenchmark > 0 ? "+" : ""}{niftyBenchmark}%).
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Metric Selector */}
          <div className="flex rounded bg-gray-900 border border-gray-800 p-0.5 text-xs">
            {[
              { id: "daily_pct", label: "Daily" },
              { id: "weekly_pct", label: "Weekly" },
              { id: "monthly_pct", label: "Monthly" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setMetric(tab.id as any)}
                className={`rounded px-2.5 py-1 text-xs font-semibold transition ${
                  metric === tab.id ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={loadSectors}
            disabled={loading}
            className="rounded bg-gray-800 p-1.5 text-gray-300 hover:text-white"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Rotation Commentary Banner */}
      <div className="rounded-lg border border-indigo-900/50 bg-indigo-950/20 p-3 text-xs text-indigo-200">
        <strong className="text-indigo-300">Sector Rotation Insights: </strong>
        <span>{data?.rotation_commentary || "Tracking 16 sectors against NIFTY 50."}</span>
      </div>

      {/* 16 Sectors Heatmap Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {sectors.map((sec: any) => {
          const val = sec[metric];
          const isPos = val >= 0;
          const isLeader = sec.leadership_status === "LEADER";

          return (
            <div
              key={sec.code}
              className={`rounded-lg border p-3.5 transition flex flex-col justify-between ${
                isPos
                  ? "bg-gradient-to-b from-emerald-950/40 to-[#111827] border-emerald-800/40"
                  : "bg-gradient-to-b from-red-950/40 to-[#111827] border-red-800/40"
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="font-bold text-xs text-gray-100">{sec.sector}</span>
                  {isLeader && (
                    <span className="rounded bg-emerald-900/60 px-1.5 py-0.2 text-[9px] font-bold text-emerald-300">
                      LEADER
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-gray-400">{sec.index_name}</span>
              </div>

              <div className="mt-3 flex items-baseline justify-between border-t border-gray-800/80 pt-2">
                <span className="text-xs font-mono text-gray-400">₹{sec.price}</span>
                <span
                  className={`text-sm font-mono font-bold ${
                    isPos ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {isPos ? `+${val}%` : `${val}%`}
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between text-[10px] text-gray-500 font-mono">
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

