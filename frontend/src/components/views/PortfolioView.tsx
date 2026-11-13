"use client";

import React, { useEffect, useState } from "react";
import { Briefcase, Plus, Trash2, ArrowUpRight, ArrowDownRight, RefreshCw, PieChart, ShieldCheck } from "lucide-react";
import { api } from "@/lib/api";

export const PortfolioView: React.FC = () => {
  const [portfolioData, setPortfolioData] = useState<any>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [symbol, setSymbol] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [sector, setSector] = useState("");
  const [loading, setLoading] = useState(true);

  const loadPortfolio = async () => {
    setLoading(true);
    try {
      const res = await api.getPortfolio();
      setPortfolioData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPortfolio();
  }, []);

  const handleAddPosition = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol.trim() || !purchasePrice || !quantity) return;

    await api.addPortfolioPosition({
      symbol: symbol.trim().toUpperCase(),
      purchase_price: parseFloat(purchasePrice),
      quantity: parseInt(quantity),
      sector: sector.trim() || "Equities",
      purchase_date: new Date().toISOString().split("T")[0]
    });

    setSymbol("");
    setPurchasePrice("");
    setQuantity("");
    setSector("");
    setShowAddForm(false);
    loadPortfolio();
  };

  const handleDeletePosition = async (id: number) => {
    await api.deletePortfolioPosition(id);
    loadPortfolio();
  };

  const positions = portfolioData?.positions || [];
  const summary = portfolioData?.summary || {};
  const isPos = summary.total_unrealized_pnl >= 0;

  return (
    <div className="space-y-4 p-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-800 pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <Briefcase className="h-5 w-5 text-emerald-400" />
            <h1 className="text-base font-bold uppercase tracking-wider text-gray-100">
              Personal Portfolio & Holdings Tracker
            </h1>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Strictly local-first. No broker passwords or API token sharing required.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center space-x-1 rounded bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-500 transition"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Position</span>
          </button>
          <button
            onClick={loadPortfolio}
            disabled={loading}
            className="rounded bg-gray-800 p-1.5 text-gray-300 hover:text-white"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Add Position Modal/Form */}
      {showAddForm && (
        <form onSubmit={handleAddPosition} className="rounded-lg border border-gray-800 bg-[#111827] p-4 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300">
            Log New Stock Holding
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div>
              <label className="text-[10px] text-gray-400">NSE Symbol</label>
              <input
                type="text"
                placeholder="e.g. RELIANCE"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                className="w-full mt-1 rounded bg-gray-900 border border-gray-800 p-1.5 text-xs text-gray-200"
                required
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-400">Buy Price (₹)</label>
              <input
                type="number"
                step="0.05"
                placeholder="2500.0"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(e.target.value)}
                className="w-full mt-1 rounded bg-gray-900 border border-gray-800 p-1.5 text-xs text-gray-200"
                required
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-400">Quantity</label>
              <input
                type="number"
                placeholder="50"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full mt-1 rounded bg-gray-900 border border-gray-800 p-1.5 text-xs text-gray-200"
                required
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-400">Sector</label>
              <input
                type="text"
                placeholder="e.g. Banking"
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="w-full mt-1 rounded bg-gray-900 border border-gray-800 p-1.5 text-xs text-gray-200"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="rounded bg-gray-800 px-3 py-1 text-xs text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-500"
            >
              Save Holding
            </button>
          </div>
        </form>
      )}

      {/* Portfolio Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-lg border border-gray-800 bg-[#111827] p-3 shadow">
          <span className="text-[10px] text-gray-500 uppercase">Invested Capital</span>
          <p className="font-mono font-bold text-base text-gray-200 mt-0.5">
            ₹{summary.total_invested?.toLocaleString("en-IN", { minimumFractionDigits: 2 }) || "0.00"}
          </p>
        </div>
        <div className="rounded-lg border border-gray-800 bg-[#111827] p-3 shadow">
          <span className="text-[10px] text-gray-500 uppercase">Current Valuation</span>
          <p className="font-mono font-bold text-base text-gray-100 mt-0.5">
            ₹{summary.total_current_value?.toLocaleString("en-IN", { minimumFractionDigits: 2 }) || "0.00"}
          </p>
        </div>
        <div className="rounded-lg border border-gray-800 bg-[#111827] p-3 shadow">
          <span className="text-[10px] text-gray-500 uppercase">Total Unrealized P&L</span>
          <div className={`flex items-baseline space-x-1.5 mt-0.5 font-mono font-bold text-base ${isPos ? "text-emerald-400" : "text-red-400"}`}>
            <span>{isPos ? "+" : ""}₹{summary.total_unrealized_pnl?.toLocaleString("en-IN", { minimumFractionDigits: 2 }) || "0.00"}</span>
            <span className="text-xs">({isPos ? "+" : ""}{summary.total_unrealized_pnl_pct || 0}%)</span>
          </div>
        </div>
        <div className="rounded-lg border border-gray-800 bg-[#111827] p-3 shadow">
          <span className="text-[10px] text-gray-500 uppercase">Active Holdings</span>
          <p className="font-mono font-bold text-base text-blue-400 mt-0.5">
            {summary.position_count || 0} Stocks
          </p>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-800 bg-[#111827]">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-gray-800 bg-gray-900/80 text-[11px] font-bold uppercase text-gray-400 font-mono">
            <tr>
              <th className="px-4 py-3">Symbol</th>
              <th className="px-3 py-3">Sector</th>
              <th className="px-3 py-3 text-right">Qty</th>
              <th className="px-3 py-3 text-right">Avg Buy (₹)</th>
              <th className="px-3 py-3 text-right">LTP (₹)</th>
              <th className="px-3 py-3 text-right">Invested</th>
              <th className="px-3 py-3 text-right">Current Value</th>
              <th className="px-3 py-3 text-right">P&L (₹)</th>
              <th className="px-3 py-3 text-right">Return %</th>
              <th className="px-4 py-3 text-center">Delete</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800 font-mono">
            {positions.map((pos: any) => {
              const posGain = pos.unrealized_pnl >= 0;
              return (
                <tr key={pos.id} className="hover:bg-gray-800/40 transition">
                  <td className="px-4 py-2.5 font-sans font-bold text-gray-100">{pos.symbol}</td>
                  <td className="px-3 py-2.5 font-sans text-gray-400">{pos.sector || "Equities"}</td>
                  <td className="px-3 py-2.5 text-right text-gray-300">{pos.quantity}</td>
                  <td className="px-3 py-2.5 text-right text-gray-300">₹{pos.purchase_price.toFixed(2)}</td>
                  <td className="px-3 py-2.5 text-right font-bold text-gray-100">₹{pos.current_price?.toFixed(2)}</td>
                  <td className="px-3 py-2.5 text-right text-gray-400">₹{pos.invested_value?.toLocaleString()}</td>
                  <td className="px-3 py-2.5 text-right text-gray-200">₹{pos.current_value?.toLocaleString()}</td>
                  <td className={`px-3 py-2.5 text-right font-bold ${posGain ? "text-emerald-400" : "text-red-400"}`}>
                    {posGain ? "+" : ""}₹{pos.unrealized_pnl?.toLocaleString()}
                  </td>
                  <td className={`px-3 py-2.5 text-right font-bold ${posGain ? "text-emerald-400" : "text-red-400"}`}>
                    {posGain ? `+${pos.unrealized_pnl_pct}%` : `${pos.unrealized_pnl_pct}%`}
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <button
                      onClick={() => handleDeletePosition(pos.id)}
                      className="rounded bg-gray-800 p-1 text-gray-400 hover:text-red-400 transition"
                      title="Delete Holding"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
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

