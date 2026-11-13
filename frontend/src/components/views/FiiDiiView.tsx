"use client";

import React, { useEffect, useState } from "react";
import { Landmark, ArrowUpRight, ArrowDownRight, RefreshCw, Info, AlertTriangle } from "lucide-react";
import { api } from "@/lib/api";

export const FiiDiiView: React.FC = () => {
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

  return (
    <div className="space-y-4 p-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-gray-800 pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <Landmark className="h-5 w-5 text-blue-400" />
            <h1 className="text-base font-bold uppercase tracking-wider text-gray-100">
              Institutional Cash Market Flows (FII & DII)
            </h1>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Verified cash market purchases and sales in INR Crores. F&O positioning tracked separately.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {[10, 20, 30].map((s) => (
            <button
              key={s}
              onClick={() => setSessions(s)}
              className={`rounded px-2.5 py-1 text-xs font-semibold transition ${
                sessions === s ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"
              }`}
            >
              {s} Sessions
            </button>
          ))}
          <button
            onClick={loadData}
            disabled={loading}
            className="flex items-center space-x-1 rounded bg-gray-800 px-2.5 py-1 text-xs font-semibold text-gray-300 hover:text-white"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Latest Session */}
        <div className="rounded-lg border border-gray-800 bg-[#111827] p-3.5 shadow">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Latest Session ({latest.date})
          </span>
          <div className="mt-2 space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">FII Net Flow:</span>
              <span className={`font-mono font-bold ${latest.fii_net >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                {latest.fii_net > 0 ? "+" : ""}₹{latest.fii_net?.toLocaleString() || 0} Cr
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">DII Net Flow:</span>
              <span className={`font-mono font-bold ${latest.dii_net >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                {latest.dii_net > 0 ? "+" : ""}₹{latest.dii_net?.toLocaleString() || 0} Cr
              </span>
            </div>
            <div className="flex justify-between border-t border-gray-800 pt-1 font-semibold">
              <span className="text-gray-300">Total Net:</span>
              <span className="font-mono text-gray-200">
                ₹{latest.total_net_institutional?.toLocaleString() || 0} Cr
              </span>
            </div>
          </div>
        </div>

        {/* 5-Session Rolling */}
        <div className="rounded-lg border border-gray-800 bg-[#111827] p-3.5 shadow">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            5-Session Rolling Sum
          </span>
          <div className="mt-2 space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">FII 5D Net:</span>
              <span className={`font-mono font-bold ${roll5.fii_net_cr >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                ₹{roll5.fii_net_cr?.toLocaleString() || 0} Cr
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">DII 5D Net:</span>
              <span className={`font-mono font-bold ${roll5.dii_net_cr >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                ₹{roll5.dii_net_cr?.toLocaleString() || 0} Cr
              </span>
            </div>
            <div className="flex justify-between border-t border-gray-800 pt-1 font-semibold">
              <span className="text-gray-300">5D Combined:</span>
              <span className="font-mono text-gray-200">
                ₹{roll5.combined_net_cr?.toLocaleString() || 0} Cr
              </span>
            </div>
          </div>
        </div>

        {/* 20-Session Rolling & Streaks */}
        <div className="rounded-lg border border-gray-800 bg-[#111827] p-3.5 shadow">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            20-Session Rolling & Streaks
          </span>
          <div className="mt-2 space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">FII 20D Net:</span>
              <span className={`font-mono font-bold ${roll20.fii_net_cr >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                ₹{roll20.fii_net_cr?.toLocaleString() || 0} Cr
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">DII 20D Net:</span>
              <span className={`font-mono font-bold ${roll20.dii_net_cr >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                ₹{roll20.dii_net_cr?.toLocaleString() || 0} Cr
              </span>
            </div>
            <p className="text-[11px] text-blue-300 pt-1 font-medium">
              {streaks.fii_streak}
            </p>
          </div>
        </div>
      </div>

      {/* Institutional Regime Note */}
      <div className="rounded-lg border border-blue-900/60 bg-blue-950/20 p-3 text-xs text-blue-300 flex items-start space-x-2">
        <Info className="h-4 w-4 mt-0.5 flex-shrink-0 text-blue-400" />
        <div>
          <strong className="text-blue-200">Institutional Regime: {data?.regime}</strong>
          <p className="mt-0.5 text-blue-300/90">{data?.regime_description}</p>
        </div>
      </div>

      {/* Historical Flow Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-800 bg-[#111827]">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-gray-800 bg-gray-900/80 text-[11px] font-bold uppercase text-gray-400 font-mono">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-3 py-3 text-right">FII Gross Buy</th>
              <th className="px-3 py-3 text-right">FII Gross Sell</th>
              <th className="px-3 py-3 text-right">FII Net (₹ Cr)</th>
              <th className="px-3 py-3 text-right">DII Gross Buy</th>
              <th className="px-3 py-3 text-right">DII Gross Sell</th>
              <th className="px-3 py-3 text-right">DII Net (₹ Cr)</th>
              <th className="px-4 py-3 text-right">Total Net</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800 font-mono">
            {history.map((row: any, i: number) => {
              const fiiPos = row.fii_net >= 0;
              const diiPos = row.dii_net >= 0;
              const totPos = row.total_net >= 0;

              return (
                <tr key={i} className="hover:bg-gray-800/40 transition">
                  <td className="px-4 py-2.5 font-sans font-medium text-gray-300">{row.date}</td>
                  <td className="px-3 py-2.5 text-right text-gray-400">₹{row.fii_buy?.toLocaleString()}</td>
                  <td className="px-3 py-2.5 text-right text-gray-400">₹{row.fii_sell?.toLocaleString()}</td>
                  <td className={`px-3 py-2.5 text-right font-bold ${fiiPos ? "text-emerald-400" : "text-red-400"}`}>
                    {fiiPos ? "+" : ""}₹{row.fii_net?.toLocaleString()}
                  </td>
                  <td className="px-3 py-2.5 text-right text-gray-400">₹{row.dii_buy?.toLocaleString()}</td>
                  <td className="px-3 py-2.5 text-right text-gray-400">₹{row.dii_sell?.toLocaleString()}</td>
                  <td className={`px-3 py-2.5 text-right font-bold ${diiPos ? "text-emerald-400" : "text-red-400"}`}>
                    {diiPos ? "+" : ""}₹{row.dii_net?.toLocaleString()}
                  </td>
                  <td className={`px-4 py-2.5 text-right font-bold ${totPos ? "text-emerald-400" : "text-red-400"}`}>
                    {totPos ? "+" : ""}₹{row.total_net?.toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Statutory Disclaimer */}
      <div className="rounded bg-gray-900/60 p-2.5 text-[10px] text-gray-500 border border-gray-800/80">
        <strong>Mandatory Regulatory Disclosure: </strong>
        {data?.disclaimer || "Data covers Cash Market segment only. Does not infer individual stock positions."}
      </div>
    </div>
  );
};

