"use client";

import React, { useEffect, useState } from "react";
import { Star, Plus, Trash2, ArrowUpRight, ArrowDownRight, RefreshCw, ChevronRight } from "lucide-react";
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
    <div className="space-y-4 p-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-800 pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-amber-400" />
            <h1 className="text-base font-bold uppercase tracking-wider text-gray-100">
              Personal Watchlist Workstation
            </h1>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Real-time equity monitoring, fast switching, and customized tracking baskets.
          </p>
        </div>

        {/* Add Symbol Form */}
        <form onSubmit={handleAddSymbol} className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Add symbol (e.g. INFOSYS)..."
            value={newSymbol}
            onChange={(e) => setNewSymbol(e.target.value)}
            className="rounded bg-gray-900 border border-gray-800 px-2.5 py-1 text-xs text-gray-200 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="flex items-center space-x-1 rounded bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-blue-500"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add</span>
          </button>
        </form>
      </div>

      {/* Watchlist Baskets Tabs */}
      <div className="flex items-center justify-between border-b border-gray-800/80 pb-2">
        <div className="flex space-x-2 overflow-x-auto">
          {watchlists.map((w, idx) => (
            <button
              key={w.id}
              onClick={() => {
                setActiveListIndex(idx);
                loadQuotesForList(w.symbols);
              }}
              className={`rounded px-3 py-1 text-xs font-semibold transition ${
                activeListIndex === idx
                  ? "bg-blue-600 text-white"
                  : "bg-gray-900 text-gray-400 hover:text-white"
              }`}
            >
              {w.name} ({w.symbols.length})
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowNewListForm(!showNewListForm)}
          className="text-xs text-blue-400 hover:underline flex items-center space-x-1"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New List</span>
        </button>
      </div>

      {/* New List Creator */}
      {showNewListForm && (
        <form onSubmit={handleCreateList} className="flex items-center space-x-2 rounded border border-gray-800 bg-[#111827] p-3">
          <input
            type="text"
            placeholder="Watchlist Name (e.g. Dividend Stars)..."
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            className="rounded bg-gray-900 border border-gray-800 px-3 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="rounded bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500"
          >
            Create Watchlist
          </button>
        </form>
      )}

      {/* Symbols Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-800 bg-[#111827]">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-gray-800 bg-gray-900/80 text-[11px] font-bold uppercase text-gray-400 font-mono">
            <tr>
              <th className="px-4 py-3">Symbol</th>
              <th className="px-3 py-3 text-right">LTP (₹)</th>
              <th className="px-3 py-3 text-right">Day Change</th>
              <th className="px-3 py-3 text-right">% Change</th>
              <th className="px-3 py-3 text-right">Day High</th>
              <th className="px-3 py-3 text-right">Day Low</th>
              <th className="px-3 py-3 text-right">52W High</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800 font-mono">
            {currentList.symbols.map((sym: string) => {
              const q = quotes[sym];
              const isPos = q ? q.change >= 0 : true;

              return (
                <tr key={sym} className="hover:bg-gray-800/40 transition">
                  <td className="px-4 py-2.5 font-sans font-bold text-gray-100">
                    <button
                      onClick={() => onSelectStock(sym)}
                      className="hover:text-blue-400 transition"
                    >
                      {sym}
                    </button>
                  </td>
                  <td className="px-3 py-2.5 text-right font-bold text-gray-100">
                    {q ? `₹${q.close.toFixed(2)}` : "--"}
                  </td>
                  <td className={`px-3 py-2.5 text-right font-semibold ${isPos ? "text-emerald-400" : "text-red-400"}`}>
                    {q ? (isPos ? `+${q.change.toFixed(2)}` : q.change.toFixed(2)) : "--"}
                  </td>
                  <td className={`px-3 py-2.5 text-right font-semibold ${isPos ? "text-emerald-400" : "text-red-400"}`}>
                    {q ? (isPos ? `+${q.pct_change.toFixed(2)}%` : `${q.pct_change.toFixed(2)}%`) : "--"}
                  </td>
                  <td className="px-3 py-2.5 text-right text-gray-400">{q?.high?.toFixed(2) || "--"}</td>
                  <td className="px-3 py-2.5 text-right text-gray-400">{q?.low?.toFixed(2) || "--"}</td>
                  <td className="px-3 py-2.5 text-right text-gray-400">{q?.week52_high?.toFixed(2) || "--"}</td>
                  <td className="px-4 py-2.5 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => onSelectStock(sym)}
                        className="rounded bg-gray-800 p-1 text-gray-400 hover:text-white"
                        title="Analyze Stock"
                      >
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleRemoveSymbol(sym)}
                        className="rounded bg-gray-800 p-1 text-gray-400 hover:text-red-400"
                        title="Remove from Watchlist"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
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

