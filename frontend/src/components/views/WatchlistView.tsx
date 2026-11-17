"use client";

import React, { useEffect, useState } from "react";
import { Star, Plus, Trash2, ArrowUpRight, ArrowDownRight, RefreshCw, ChevronRight, Bookmark } from "lucide-react";
import { api } from "@/lib/api";

interface WatchlistViewProps {
  onSelectStock: (symbol: string) => void;
}

export const WatchlistView: React.FC<WatchlistViewProps> = ({ onSelectStock }) => {
  const [watchlists, setWatchlists] = useState<any[]>([]);
  const [activeListIndex, setActiveListIndex] = useState(0);
  const [quotes, setQuotes] = useState<Record<string, any>>({});
  const [newSymbol, setNewSymbol] = useState("");
  const [newListName, setNewListName] = useState("");
  const [showNewListForm, setShowNewListForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadWatchlists = async () => {
    setLoading(true);
    try {
      const data = await api.getWatchlists();
      setWatchlists(data);
      if (data.length > 0) {
        await loadQuotesForList(data[activeListIndex]?.symbols || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadQuotesForList = async (symbols: string[]) => {
    const quoteMap: Record<string, any> = {};
    for (const sym of symbols) {
      try {
        const q = await api.getQuote(sym);
        if (q) quoteMap[sym] = q;
      } catch (e) {
        // fallback
      }
    }
    setQuotes(quoteMap);
  };

  useEffect(() => {
    loadWatchlists();
  }, []);

  const currentList = watchlists[activeListIndex] || { name: "Default", symbols: [] };

  const handleAddSymbol = async (e: React.FormEvent) => {
    e.preventDefault();
    const sym = newSymbol.trim().toUpperCase();
    if (!sym || currentList.symbols.includes(sym)) return;

    const updatedSymbols = [...currentList.symbols, sym];
    await api.saveWatchlist(currentList.name, updatedSymbols);
    setNewSymbol("");
    loadWatchlists();
  };

  const handleRemoveSymbol = async (sym: string) => {
    const updatedSymbols = currentList.symbols.filter((s: string) => s !== sym);
    await api.saveWatchlist(currentList.name, updatedSymbols);
    loadWatchlists();
  };

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    await api.saveWatchlist(newListName.trim(), ["RELIANCE", "TCS"]);
    setNewListName("");
    setShowNewListForm(false);
    loadWatchlists();
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-200 dark:border-white/[0.08] pb-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="h-8 w-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Star className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100">
                  My Watchlists & Tracking Baskets
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">
                  REAL-TIME PRICES
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Save companies you are researching. Click on any stock to open its full dossier.
              </p>
            </div>
          </div>
        </div>

        {/* Add Symbol Form */}
        <form onSubmit={handleAddSymbol} className="flex items-center space-x-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Add NSE symbol (e.g. INFY, SBIN)..."
            value={newSymbol}
            onChange={(e) => setNewSymbol(e.target.value)}
            className="rounded-xl bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-white/[0.1] px-3 py-1.5 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-blue-500 font-mono flex-1 sm:w-48 shadow-inner"
          />
          <button
            type="submit"
            className="flex items-center space-x-1 rounded-xl bg-blue-600 hover:bg-blue-500 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition active:scale-95 shrink-0"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Stock</span>
          </button>
        </form>
      </div>

      {/* Watchlist Baskets Ribbon */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar pb-1">
        <div className="flex items-center space-x-2">
          {watchlists.map((w, idx) => {
            const active = activeListIndex === idx;
            return (
              <button
                key={w.id || idx}
                onClick={() => {
                  setActiveListIndex(idx);
                  loadQuotesForList(w.symbols);
                }}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition active:scale-95 ${
                  active
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white dark:bg-gray-900/60 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/[0.06] hover:text-gray-900 dark:hover:text-gray-200"
                }`}
              >
                {w.name} ({w.symbols.length})
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setShowNewListForm(!showNewListForm)}
          className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold flex items-center space-x-1 shrink-0 px-2"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New Basket</span>
        </button>
      </div>

      {/* New List Creator Form */}
      {showNewListForm && (
        <form onSubmit={handleCreateList} className="rounded-2xl border border-gray-200 dark:border-white/[0.1] bg-white dark:bg-[#0E1524] p-4 flex items-center space-x-2 shadow-sm">
          <input
            type="text"
            placeholder="Basket Name (e.g. Dividend Leaders, High Growth)..."
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            className="rounded-xl bg-gray-50 dark:bg-gray-950/70 border border-gray-200 dark:border-white/[0.1] px-3 py-1.5 text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 flex-1"
          />
          <button
            type="submit"
            className="rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition active:scale-95"
          >
            Create Basket
          </button>
        </form>
      )}

      {/* Symbols Table */}
      <div className="rounded-3xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#0E1524] shadow-sm overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-gray-50 dark:bg-gray-900/60 border-b border-gray-200 dark:border-white/[0.08] text-[10px] uppercase font-bold tracking-wider text-gray-500 dark:text-gray-400">
              <tr>
                <th className="py-3 px-4">Instrument</th>
                <th className="py-3 px-3 text-right">LTP (₹)</th>
                <th className="py-3 px-3 text-right">Day Change</th>
                <th className="py-3 px-3 text-right">% Change</th>
                <th className="py-3 px-3 text-right">Day High</th>
                <th className="py-3 px-3 text-right">Day Low</th>
                <th className="py-3 px-3 text-right">52W High</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/[0.04]">
              {currentList.symbols.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-xs text-gray-400">
                    Your watchlist is currently empty. Add a symbol above to start tracking it.
                  </td>
                </tr>
              ) : (
                currentList.symbols.map((sym: string) => {
                  const q = quotes[sym];
                  const isPos = q ? q.change >= 0 : true;

                  return (
                    <tr key={sym} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition">
                      <td className="py-3 px-4 font-bold text-gray-900 dark:text-gray-100 flex items-center space-x-2.5">
                        <span className="h-6 w-6 rounded-md bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-mono text-[10px]">
                          {sym.slice(0, 2)}
                        </span>
                        <button
                          onClick={() => onSelectStock(sym)}
                          className="hover:text-blue-600 transition tracking-tight"
                        >
                          {sym}
                        </button>
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold tabular-nums text-gray-900 dark:text-gray-100">
                        {q ? `₹${Number(q.close).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "--"}
                      </td>
                      <td className={`py-3 px-3 text-right font-mono font-bold tabular-nums ${isPos ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                        {q ? (isPos ? `+${q.change.toFixed(2)}` : q.change.toFixed(2)) : "--"}
                      </td>
                      <td className={`py-3 px-3 text-right font-mono font-bold tabular-nums ${isPos ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                        {q ? (isPos ? `+${q.pct_change.toFixed(2)}%` : `${q.pct_change.toFixed(2)}%`) : "--"}
                      </td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums text-gray-500 dark:text-gray-400">{q?.high ? Number(q.high).toFixed(2) : "--"}</td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums text-gray-500 dark:text-gray-400">{q?.low ? Number(q.low).toFixed(2) : "--"}</td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums text-gray-500 dark:text-gray-400">{q?.week52_high ? Number(q.week52_high).toFixed(2) : "--"}</td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => onSelectStock(sym)}
                            className="rounded-lg p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition"
                            title="Analyze Stock"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleRemoveSymbol(sym)}
                            className="rounded-lg p-1 text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition"
                            title="Remove from Watchlist"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
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
