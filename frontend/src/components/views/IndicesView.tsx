"use client";

import React, { useEffect, useState } from "react";
import { TrendingUp, ArrowUpRight, ArrowDownRight, RefreshCw } from "lucide-react";
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

  return (
    <div className="space-y-4 p-4 max-w-7xl mx-auto">
      <div className="flex items-center justify-between border-b border-gray-800 pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-blue-400" />
            <h1 className="text-base font-bold uppercase tracking-wider text-gray-100">
              NSE & BSE Index Monitor
            </h1>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Verified benchmark, sectoral, and global tracking feeds with official OHLC metrics.
          </p>
        </div>

        <button
          onClick={loadIndices}
          disabled={loading}
          className="flex items-center space-x-1.5 rounded bg-gray-800 px-3 py-1.5 text-xs font-semibold text-gray-300 hover:text-white transition"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-800 bg-[#111827]">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-gray-800 bg-gray-900/80 text-[11px] font-bold uppercase text-gray-400">
            <tr>
              <th className="px-4 py-3">Index Name</th>
              <th className="px-3 py-3">Exchange</th>
              <th className="px-3 py-3 text-right">LTP</th>
              <th className="px-3 py-3 text-right">Change</th>
              <th className="px-3 py-3 text-right">% Chg</th>
              <th className="px-3 py-3 text-right">Open</th>
              <th className="px-3 py-3 text-right">High</th>
              <th className="px-3 py-3 text-right">Low</th>
              <th className="px-3 py-3 text-right">Prev Close</th>
              <th className="px-4 py-3 text-center">Data Freshness</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800 font-mono">
            {indices.map((idx, i) => {
              const isPos = idx.change >= 0;
              return (
                <tr key={i} className="hover:bg-gray-800/40 transition">
                  <td className="px-4 py-2.5 font-sans font-bold text-gray-200">
                    {idx.name}
                  </td>
                  <td className="px-3 py-2.5 text-gray-400 font-sans text-[11px]">
                    {idx.exchange}
                  </td>
                  <td className="px-3 py-2.5 text-right font-bold text-gray-100">
                    ₹{idx.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </td>
                  <td
                    className={`px-3 py-2.5 text-right font-semibold ${
                      isPos ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {isPos ? `+${idx.change.toFixed(2)}` : idx.change.toFixed(2)}
                  </td>
                  <td
                    className={`px-3 py-2.5 text-right font-semibold ${
                      isPos ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {isPos ? `+${idx.pct_change.toFixed(2)}%` : `${idx.pct_change.toFixed(2)}%`}
                  </td>
                  <td className="px-3 py-2.5 text-right text-gray-400">
                    {idx.open?.toFixed(2)}
                  </td>
                  <td className="px-3 py-2.5 text-right text-gray-400">
                    {idx.high?.toFixed(2)}
                  </td>
                  <td className="px-3 py-2.5 text-right text-gray-400">
                    {idx.low?.toFixed(2)}
                  </td>
                  <td className="px-3 py-2.5 text-right text-gray-400">
                    {idx.previous_close?.toFixed(2)}
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <span className="rounded bg-gray-800 px-2 py-0.5 text-[10px] text-gray-300 font-sans">
                      {idx.status || "LAST AVAILABLE"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

