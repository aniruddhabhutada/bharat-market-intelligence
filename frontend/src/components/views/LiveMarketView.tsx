"use client";

import React, { useEffect, useState } from "react";
import { Activity, Clock, AlertCircle, ArrowUpRight, ArrowDownRight, RefreshCw, BarChart2, ShieldAlert, Sparkles, ChevronRight } from "lucide-react";
import { api } from "@/lib/api";
import { FinancialChart } from "../charts/FinancialChart";

interface LiveMarketViewProps {
  onSelectStock: (symbol: string) => void;
}

export const LiveMarketView: React.FC<LiveMarketViewProps> = ({ onSelectStock }) => {
  const [indices, setIndices] = useState<any[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState("RELIANCE");
  const [chartData, setChartData] = useState<any[]>([]);
  const [stockDetail, setStockDetail] = useState<any>(null);
  const [intradayReport, setIntradayReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [idxRes, chartRes, stockRes, intraRes] = await Promise.allSettled([
        api.getIndices(),
        api.getChart(selectedSymbol, 60),
        api.getStock(selectedSymbol),
        api.triggerReport("INTRADAY")
      ]);

      if (idxRes.status === "fulfilled") setIndices(idxRes.value);
      if (chartRes.status === "fulfilled") setChartData(chartRes.value.candles || []);
      if (stockRes.status === "fulfilled") setStockDetail(stockRes.value);
      if (intraRes.status === "fulfilled") setIntradayReport(intraRes.value);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedSymbol]);

  const tech = stockDetail?.technical_indicators || {};
  const observations = intradayReport?.observations || [];

  const SYMBOLS = [
    { sym: "RELIANCE", name: "Reliance Ind." },
    { sym: "TCS", name: "Tata Consultancy" },
    { sym: "HDFCBANK", name: "HDFC Bank" },
    { sym: "INFY", name: "Infosys" },
    { sym: "SBIN", name: "State Bank of India" },
    { sym: "BHARTIARTL", name: "Bharti Airtel" },
    { sym: "LT", name: "Larsen & Toubro" },
  ];

  return (
    <div className="space-y-5 p-3 sm:p-5 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/[0.08] dark:border-white/[0.08] pb-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="h-8 w-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Activity className="h-4 w-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100">
                  Live Market Microstructure & Intraday Terminal
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  ● 15M CYCLE
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Real-time technical indicators, live order-flow microstructure, and rule-based behavioral observation engine.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="flex items-center space-x-1.5 rounded-xl border border-white/[0.1] bg-gray-900/40 hover:bg-gray-800/60 dark:bg-gray-800/50 dark:hover:bg-gray-700/60 px-3.5 py-2 text-xs font-semibold text-gray-200 transition active:scale-95 shadow-sm"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-blue-400" : "text-gray-400"}`} />
          <span>Refresh Intraday</span>
        </button>
      </div>

      {/* Symbol Quick Switcher Ribbon */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar pb-1">
        <div className="flex items-center space-x-1.5 min-w-max">
          {SYMBOLS.map(({ sym, name }) => {
            const active = selectedSymbol === sym;
            return (
              <button
                key={sym}
                onClick={() => setSelectedSymbol(sym)}
                className={`group relative rounded-xl px-3 py-1.5 text-xs font-semibold transition active:scale-95 ${
                  active
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20 border border-blue-400/40"
                    : "bg-gray-900/60 dark:bg-gray-900/60 text-gray-400 border border-white/[0.06] hover:border-white/20 hover:text-gray-200"
                }`}
              >
                <span className="tracking-tight">{sym}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onSelectStock(selectedSymbol)}
          className="hidden sm:flex items-center space-x-1 text-xs font-semibold text-blue-400 hover:text-blue-300 transition shrink-0 pl-3"
        >
          <span>Open Full Dossier</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Main Grid: Chart + Indicator Battery + Observations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: Interactive Financial Chart & Indicators */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-card rounded-2xl p-3 sm:p-4 border border-white/[0.08] shadow-xl">
            <FinancialChart symbol={selectedSymbol} candles={chartData} height={400} />
          </div>

          {/* Indicator Battery Grid */}
          <div className="glass-card rounded-2xl p-4 sm:p-5 border border-white/[0.08] shadow-xl">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center space-x-2">
                <BarChart2 className="h-4 w-4 text-blue-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-200">
                  Technical Indicator Battery: {selectedSymbol}
                </h3>
              </div>
              <span className="text-[11px] font-mono text-gray-500">
                Formula: EMA20 / RSI14 / Supertrend(10,3)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              {/* RSI */}
              <div className="rounded-xl border border-white/[0.06] bg-gray-950/50 p-3 hover:border-white/[0.12] transition">
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">RSI (14-Day)</span>
                <p className="font-mono font-bold text-gray-100 text-base sm:text-lg mt-0.5 tabular-nums">
                  {tech.rsi14 ? tech.rsi14.toFixed(1) : "50.0"}
                </p>
                <div className="mt-1 flex items-center space-x-1">
                  <span
                    className={`inline-block h-1.5 w-1.5 rounded-full ${
                      (tech.rsi14 || 50) > 70
                        ? "bg-amber-400"
                        : (tech.rsi14 || 50) < 30
                        ? "bg-blue-400"
                        : "bg-emerald-400"
                    }`}
                  />
                  <span className="text-[10px] text-gray-400 font-medium">
                    {(tech.rsi14 || 50) > 70
                      ? "Overbought"
                      : (tech.rsi14 || 50) < 30
                      ? "Oversold"
                      : "Neutral Bullish"}
                  </span>
                </div>
              </div>

              {/* Supertrend */}
              <div className="rounded-xl border border-white/[0.06] bg-gray-950/50 p-3 hover:border-white/[0.12] transition">
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Supertrend (10,3)</span>
                <p
                  className={`font-mono font-bold text-base sm:text-lg mt-0.5 tracking-tight ${
                    tech.supertrend_direction === "BULLISH" ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {tech.supertrend_direction || "BULLISH"}
                </p>
                <p className="text-[10px] font-mono text-gray-400 mt-1 tabular-nums">
                  Stop: ₹{tech.supertrend_value ? Number(tech.supertrend_value).toLocaleString("en-IN") : "--"}
                </p>
              </div>

              {/* MA Alignment */}
              <div className="rounded-xl border border-white/[0.06] bg-gray-950/50 p-3 hover:border-white/[0.12] transition">
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">MA Stack</span>
                <p className="font-mono font-bold text-gray-100 text-base sm:text-lg mt-0.5 tracking-tight">
                  {tech.ma_alignment || "BULLISH"}
                </p>
                <p className="text-[10px] font-mono text-gray-400 mt-1 tabular-nums">
                  EMA20: ₹{tech.ema20 ? Number(tech.ema20).toLocaleString("en-IN") : "--"}
                </p>
              </div>

              {/* RVOL & Volatility */}
              <div className="rounded-xl border border-white/[0.06] bg-gray-950/50 p-3 hover:border-white/[0.12] transition">
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">RVOL & ADX</span>
                <p className="font-mono font-bold text-gray-100 text-base sm:text-lg mt-0.5 tabular-nums">
                  {tech.rvol ? Number(tech.rvol).toFixed(2) : "1.12"}x
                </p>
                <p className="text-[10px] font-mono text-gray-400 mt-1 tabular-nums">
                  ADX: {tech.adx14 || 24} • ATR: ₹{tech.atr14 ? Number(tech.atr14).toFixed(1) : "--"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Intraday Observation Engine */}
        <div className="space-y-4">
          <div className="glass-card rounded-2xl p-4 sm:p-5 border border-white/[0.08] shadow-xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-3.5">
              <div className="flex items-center space-x-2">
                <div className="h-6 w-6 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <AlertCircle className="h-3.5 w-3.5" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-200">
                  Observation Engine
                </span>
              </div>
              <span className="text-[10px] font-bold text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                ACTIVE
              </span>
            </div>

            <div className="space-y-3">
              {observations.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/[0.1] bg-gray-950/40 p-4 text-center">
                  <p className="text-xs text-gray-400">No abnormal price dislocations detected in current session.</p>
                </div>
              ) : (
                observations.map((obs: any, i: number) => (
                  <div
                    key={i}
                    className="group rounded-xl border border-white/[0.06] bg-gray-950/60 p-3.5 text-xs space-y-2 hover:border-white/20 transition shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-200 text-xs tracking-tight group-hover:text-blue-300 transition">
                        {obs.title}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono flex items-center space-x-1 bg-white/[0.04] px-1.5 py-0.5 rounded">
                        <Clock className="h-3 w-3 text-gray-500" />
                        <span>{obs.timestamp || "Live"}</span>
                      </span>
                    </div>

                    <p className="text-gray-300 text-xs leading-relaxed">
                      <span className="text-gray-500 font-semibold">Event: </span>
                      {obs.what_happened}
                    </p>

                    <p className="text-gray-400 text-[11px] leading-relaxed">
                      <span className="text-gray-500 font-semibold">Evidence: </span>
                      {obs.supporting_data}
                    </p>

                    <div className="rounded-lg bg-amber-500/[0.08] border border-amber-500/20 p-2 text-[11px] text-amber-300/90 leading-tight">
                      <strong className="text-amber-200">Invalidation: </strong>
                      {obs.invalidation_condition}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
