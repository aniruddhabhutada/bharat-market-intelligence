"use client";

import React, { useEffect, useState } from "react";
import { Briefcase, Plus, Trash2, ArrowUpRight, ArrowDownRight, RefreshCw, PieChart, ShieldCheck, Wallet, IndianRupee } from "lucide-react";
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
  const isPos = (summary.total_unrealized_pnl || 0) >= 0;

  return (
    <div className="space-y-5 p-3 sm:p-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="h-8 w-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Briefcase className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100">
                  Personal Equity Portfolio & Real-time Tracker
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  CLIENT-SIDE SECURE
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Zero broker credentials needed. Live P&L recalculated continuously from official NSE market feeds.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center space-x-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 px-3.5 py-2 text-xs font-semibold text-white transition active:scale-95 shadow-lg shadow-blue-500/20"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Holding</span>
          </button>
          <button
            onClick={loadPortfolio}
            disabled={loading}
            className="rounded-xl border border-white/[0.08] bg-gray-900/60 p-2 text-gray-300 hover:text-white transition active:scale-95"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-blue-400" : ""}`} />
          </button>
        </div>
      </div>

      {/* Add Position Form Drawer */}
      {showAddForm && (
        <form onSubmit={handleAddPosition} className="glass-card rounded-2xl border border-white/[0.1] p-4 sm:p-5 space-y-4 shadow-2xl animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-200">
              Log New Equity Holding
            </h3>
            <span className="text-[10px] text-gray-400">Stored in local browser SQLite</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400">NSE Symbol</label>
              <input
                type="text"
                placeholder="e.g. RELIANCE"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                className="w-full mt-1 rounded-xl bg-gray-950/70 border border-white/[0.1] p-2 text-xs text-gray-100 placeholder-gray-600 focus:outline-none focus:border-blue-500 font-mono"
                required
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Avg Buy Price (₹)</label>
              <input
                type="number"
                step="0.05"
                placeholder="2500.0"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(e.target.value)}
                className="w-full mt-1 rounded-xl bg-gray-950/70 border border-white/[0.1] p-2 text-xs text-gray-100 placeholder-gray-600 focus:outline-none focus:border-blue-500 font-mono"
                required
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Quantity (Shares)</label>
              <input
                type="number"
                placeholder="50"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full mt-1 rounded-xl bg-gray-950/70 border border-white/[0.1] p-2 text-xs text-gray-100 placeholder-gray-600 focus:outline-none focus:border-blue-500 font-mono"
                required
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Industry Sector</label>
              <input
                type="text"
                placeholder="e.g. Energy / IT"
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="w-full mt-1 rounded-xl bg-gray-950/70 border border-white/[0.1] p-2 text-xs text-gray-100 placeholder-gray-600 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2 border-t border-white/[0.06]">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="rounded-xl border border-white/[0.08] bg-gray-900/60 px-3.5 py-1.5 text-xs text-gray-400 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-1.5 text-xs font-semibold text-white shadow-lg shadow-emerald-500/20 transition active:scale-95"
            >
              Save Holding
            </button>
          </div>
        </form>
      )}

      {/* Portfolio Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-white/[0.08] shadow-xl">
          <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Invested Capital</span>
          <p className="font-mono font-bold text-lg text-gray-200 mt-1 tabular-nums">
            ₹{summary.total_invested ? Number(summary.total_invested).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00"}
          </p>
        </div>

        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-white/[0.08] shadow-xl">
          <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Current Valuation</span>
          <p className="font-mono font-bold text-lg text-gray-100 mt-1 tabular-nums">
            ₹{summary.total_current_value ? Number(summary.total_current_value).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00"}
          </p>
        </div>

        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-white/[0.08] shadow-xl">
          <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Total Unrealized P&L</span>
          <div className={`flex items-baseline space-x-1.5 mt-1 font-mono font-bold text-lg tabular-nums ${isPos ? "text-emerald-400" : "text-rose-400"}`}>
            <span>{isPos ? "+" : ""}₹{summary.total_unrealized_pnl ? Number(summary.total_unrealized_pnl).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00"}</span>
            <span className="text-xs">({isPos ? "+" : ""}{summary.total_unrealized_pnl_pct || 0}%)</span>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-white/[0.08] shadow-xl">
          <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Active Positions</span>
          <p className="font-mono font-bold text-lg text-blue-400 mt-1 tabular-nums">
            {summary.position_count || positions.length} Equities
          </p>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="glass-card rounded-2xl border border-white/[0.08] shadow-xl overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-gray-900/60 dark:bg-gray-950/70 border-b border-white/[0.08] text-[10px] uppercase font-bold tracking-wider text-gray-400">
              <tr>
                <th className="py-3 px-4">Instrument</th>
                <th className="py-3 px-3">Sector</th>
                <th className="py-3 px-3 text-right">Shares</th>
                <th className="py-3 px-3 text-right">Avg Cost</th>
                <th className="py-3 px-3 text-right">CMP (LTP)</th>
                <th className="py-3 px-3 text-right">Invested</th>
                <th className="py-3 px-3 text-right">Current Value</th>
                <th className="py-3 px-3 text-right">Unrealized P&L</th>
                <th className="py-3 px-3 text-right">Return %</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {positions.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-xs text-gray-400">
                    No holdings logged yet. Click "Add Holding" above to start tracking.
                  </td>
                </tr>
              ) : (
                positions.map((pos: any) => {
                  const posGain = (pos.unrealized_pnl || 0) >= 0;
                  return (
                    <tr key={pos.id} className="hover:bg-white/[0.02] transition">
                      <td className="py-3 px-4 font-bold text-gray-100 flex items-center space-x-2">
                        <span className="h-6 w-6 rounded-md bg-blue-500/10 text-blue-400 flex items-center justify-center font-mono text-[10px]">
                          {pos.symbol.slice(0, 2)}
                        </span>
                        <span>{pos.symbol}</span>
                      </td>
                      <td className="py-3 px-3 text-gray-400">{pos.sector || "Equities"}</td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums text-gray-300">{pos.quantity}</td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums text-gray-300">₹{Number(pos.purchase_price).toFixed(2)}</td>
                      <td className="py-3 px-3 text-right font-mono font-bold tabular-nums text-gray-100">₹{Number(pos.current_price || pos.purchase_price).toFixed(2)}</td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums text-gray-400">₹{Number(pos.invested_value || 0).toLocaleString("en-IN")}</td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums text-gray-200">₹{Number(pos.current_value || 0).toLocaleString("en-IN")}</td>
                      <td className={`py-3 px-3 text-right font-mono font-bold tabular-nums ${posGain ? "text-emerald-400" : "text-rose-400"}`}>
                        {posGain ? "+" : ""}₹{Number(pos.unrealized_pnl || 0).toLocaleString("en-IN")}
                      </td>
                      <td className={`py-3 px-3 text-right font-mono font-bold tabular-nums ${posGain ? "text-emerald-400" : "text-rose-400"}`}>
                        {posGain ? `+${pos.unrealized_pnl_pct}%` : `${pos.unrealized_pnl_pct}%`}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleDeletePosition(pos.id)}
                          className="rounded-lg p-1 text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                          title="Delete Holding"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
