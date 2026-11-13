"use client";

import React, { useEffect, useState } from "react";
import { Activity, Clock, AlertCircle, ArrowUpRight, ArrowDownRight, RefreshCw, BarChart2 } from "lucide-react";
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

  return (
    <div className="space-y-4 p-4 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-gray-800 pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-emerald-400" />
            <h1 className="text-base font-bold uppercase tracking-wider text-gray-100">
              Live / Intraday Market Monitor & Microstructure
            </h1>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            15-minute polling cycles, real-time indicators, and automated behavioral observation engine.
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="flex items-center space-x-1.5 rounded bg-gray-800 px-3 py-1.5 text-xs font-semibold text-gray-300 hover:text-white transition"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Intraday</span>
        </button>
      </div>

      {/* Main Grid: Chart + Indicator Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left 2 Cols: Chart with Symbol Buttons */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-1">
              {["RELIANCE", "TCS", "HDFCBANK", "INFY", "SBIN", "BHARTIARTL", "LT"].map((sym) => (
                <button
                  key={sym}
                  onClick={() => setSelectedSymbol(sym)}
                  className={`rounded px-2.5 py-1 text-xs font-semibold transition ${
                    selectedSymbol === sym
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  {sym}
                </button>
              ))}
            </div>
            <button
              onClick={() => onSelectStock(selectedSymbol)}
              className="text-xs text-blue-400 hover:underline font-semibold"
            >
              Open Full Dossier →
            </button>
          </div>

          <FinancialChart symbol={selectedSymbol} candles={chartData} height={380} />

          {/* Indicator Battery Grid */}
          <div className="rounded-lg border border-gray-800 bg-[#111827] p-3 shadow">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300 mb-2.5">
              Technical Indicator Battery: {selectedSymbol}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="rounded bg-gray-900/80 p-2">
                <span className="text-[10px] text-gray-500">RSI (14-Day)</span>
                <p className="font-mono font-bold text-gray-200 mt-0.5">{tech.rsi14 || 50.0}</p>
                <span className="text-[10px] text-gray-400">
                  {tech.rsi14 > 70 ? "Overbought" : tech.rsi14 < 30 ? "Oversold" : "Neutral Bullish"}
                </span>
              </div>
              <div className="rounded bg-gray-900/80 p-2">
                <span className="text-[10px] text-gray-500">Supertrend (10, 3)</span>
                <p
                  className={`font-mono font-bold mt-0.5 ${
                    tech.supertrend_direction === "BULLISH" ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {tech.supertrend_direction || "BULLISH"}
                </p>
                <span className="text-[10px] text-gray-400">₹{tech.supertrend_value || "--"}</span>
              </div>
              <div className="rounded bg-gray-900/80 p-2">
                <span className="text-[10px] text-gray-500">MA Alignment</span>
                <p className="font-mono font-bold text-gray-200 mt-0.5">{tech.ma_alignment || "MIXED"}</p>
                <span className="text-[10px] text-gray-400">
                  EMA20: ₹{tech.ema20 || "--"}
                </span>
              </div>
              <div className="rounded bg-gray-900/80 p-2">
                <span className="text-[10px] text-gray-500">RVOL & ADX</span>
                <p className="font-mono font-bold text-gray-200 mt-0.5">
                  {tech.rvol || 1.0}x | ADX {tech.adx14 || 22}
                </p>
                <span className="text-[10px] text-gray-400">ATR14: ₹{tech.atr14 || "--"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Intraday Observation Engine */}
        <div className="space-y-4">
          <div className="rounded-lg border border-gray-800 bg-[#111827] p-3.5 shadow">
            <div className="flex items-center space-x-1.5 border-b border-gray-800 pb-2 mb-3">
              <AlertCircle className="h-4 w-4 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-gray-200">
                Intraday Observation Engine
              </span>
            </div>

            <div className="space-y-3">
              {observations.map((obs: any, i: number) => (
                <div
                  key={i}
                  className="rounded border border-gray-800 bg-gray-900/60 p-2.5 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-200">{obs.title}</span>
                    <span className="text-[10px] text-gray-400 flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{obs.timestamp}</span>
                    </span>
                  </div>
                  <p className="text-gray-300">
                    <strong className="text-gray-400">What Happened: </strong>
                    {obs.what_happened}
                  </p>
                  <p className="text-gray-400 text-[11px]">
                    <strong className="text-gray-400">Supporting Evidence: </strong>
                    {obs.supporting_data}
                  </p>
                  <div className="rounded bg-amber-950/30 border border-amber-900/40 p-1.5 text-[10px] text-amber-300">
                    <strong>Invalidation Criteria: </strong>
                    {obs.invalidation_condition}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

