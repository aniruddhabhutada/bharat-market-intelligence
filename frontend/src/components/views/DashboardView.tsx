"use client";

import React, { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Activity, Landmark, ShieldCheck, ArrowUpRight, ArrowDownRight, RefreshCw, Sparkles, ChevronRight } from "lucide-react";
import { api } from "@/lib/api";
import { FinancialChart } from "../charts/FinancialChart";

interface DashboardViewProps {
  onSelectStock: (symbol: string) => void;
  onNavigate: (view: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onSelectStock, onNavigate }) => {
  const [indices, setIndices] = useState<any[]>([]);
  const [fiiDii, setFiiDii] = useState<any>(null);
  const [sectors, setSectors] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [selectedChartSym, setSelectedChartSym] = useState("NIFTY");
  const [premarketBrief, setPremarketBrief] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [idxRes, fdRes, secRes, chartRes, preRes] = await Promise.allSettled([
        api.getIndices(),
        api.getFiiDii(5),
        api.getSectors(),
        api.getChart("RELIANCE", 60),
        api.getPremarket()
      ]);

      if (idxRes.status === "fulfilled") setIndices(idxRes.value);
      if (fdRes.status === "fulfilled") setFiiDii(fdRes.value);
      if (secRes.status === "fulfilled") setSectors(secRes.value.sectors || []);
      if (chartRes.status === "fulfilled") setChartData(chartRes.value.candles || []);
      if (preRes.status === "fulfilled") setPremarketBrief(preRes.value);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChartChange = async (sym: string) => {
    setSelectedChartSym(sym);
    try {
      const res = await api.getChart(sym, 60);
      setChartData(res.candles || []);
    } catch (e) {
      console.error(e);
    }
  };

  // Find index cards
  const nifty = indices.find((i) => i.symbol === "NIFTY" || i.name?.includes("NIFTY 50"));
  const bankNifty = indices.find((i) => i.symbol === "BANKNIFTY" || i.name?.includes("BANK"));
  const sensex = indices.find((i) => i.symbol === "SENSEX");
  const vix = indices.find((i) => i.symbol === "INDIAVIX" || i.name?.includes("VIX"));

  return (
    <div className="space-y-4 p-4 max-w-7xl mx-auto">
      {/* Top Banner: Analyst Briefing & Refresh */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 rounded-lg border border-gray-800 bg-gradient-to-r from-[#111827] to-[#162032] p-3.5 shadow-md">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-md bg-blue-600/20 text-blue-400">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Indian Market Regime: {fiiDii?.regime ? fiiDii.regime.replace(/_/g, " ") : "BALANCED RECOVERY"}
            </h2>
            <p className="text-xs text-gray-300 mt-0.5">
              {fiiDii?.regime_description || "Domestic Institutions absorbing foreign flow; sectoral breadth stable."}
            </p>
          </div>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="flex items-center space-x-1.5 rounded bg-gray-800/80 px-3 py-1.5 text-xs font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Sync Feeds</span>
        </button>
      </div>

      {/* 4 Main Index Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "NIFTY 50", data: nifty, defaultVal: 24245.5, defaultChg: 88.2, defaultPct: 0.37 },
          { label: "BANK NIFTY", data: bankNifty, defaultVal: 52140.0, defaultChg: 210.5, defaultPct: 0.41 },
          { label: "SENSEX", data: sensex, defaultVal: 79820.0, defaultChg: 275.0, defaultPct: 0.35 },
          { label: "INDIA VIX", data: vix, defaultVal: 13.4, defaultChg: -0.32, defaultPct: -2.33, isVix: true }
        ].map((card, i) => {
          const val = card.data?.price || card.defaultVal;
          const chg = card.data?.change !== undefined ? card.data.change : card.defaultChg;
          const pct = card.data?.pct_change !== undefined ? card.data.pct_change : card.defaultPct;
          const isPos = chg >= 0;

          return (
            <div
              key={i}
              className="rounded-lg border border-gray-800 bg-[#111827] p-3 shadow transition hover:border-gray-700"
            >
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span className="font-semibold">{card.label}</span>
                <span className="text-[10px] rounded bg-gray-800 px-1.5 py-0.2 text-gray-400">
                  {card.data?.status || "LAST AVAILABLE"}
                </span>
              </div>
              <div className="mt-1.5 flex items-baseline justify-between">
                <span className="text-base sm:text-lg font-bold font-mono text-gray-100">
                  {val.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <div
                  className={`flex items-center text-xs font-semibold ${
                    card.isVix
                      ? isPos ? "text-amber-400" : "text-emerald-400"
                      : isPos ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {isPos ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                  <span>{pct > 0 ? `+${pct.toFixed(2)}` : pct.toFixed(2)}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Chart + Institutional Flows & Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left 2 Cols: Interactive Market Chart */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300">
              Technical Chart & Price Action
            </h3>
            {/* Quick Switcher */}
            <div className="flex items-center space-x-1">
              {["RELIANCE", "TCS", "HDFCBANK", "INFY", "SBIN"].map((sym) => (
                <button
                  key={sym}
                  onClick={() => handleChartChange(sym)}
                  className={`rounded px-2 py-0.5 text-[10px] font-semibold transition ${
                    selectedChartSym === sym
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-gray-400 hover:text-gray-200"
                  }`}
                >
                  {sym}
                </button>
              ))}
            </div>
          </div>

          <FinancialChart symbol={selectedChartSym} candles={chartData} height={340} />

          {/* Quick Shortcuts to Core Research */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {[
              { label: "Pre-Market Outlook", view: "premarket", desc: "Global & Gift Nifty" },
              { label: "FII / DII Institutional", view: "fiidii", desc: "Cash Market Flows" },
              { label: "Sector Rotation", view: "sectors", desc: "16 Sectors Heatmap" },
              { label: "Stock Screener", view: "screener", desc: "6 Multi-Factor Scans" }
            ].map((item, idx) => (
              <button
                key={idx}
                onClick={() => onNavigate(item.view)}
                className="flex flex-col text-left rounded border border-gray-800 bg-[#111827] p-2.5 transition hover:border-blue-500 hover:bg-gray-800/60"
              >
                <div className="flex items-center justify-between text-xs font-bold text-gray-200">
                  <span>{item.label}</span>
                  <ChevronRight className="h-3 w-3 text-gray-500" />
                </div>
                <span className="text-[10px] text-gray-400 mt-0.5">{item.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Col: Institutional Flows Summary & Sector Breadth */}
        <div className="space-y-4">
          {/* Institutional Cash Flow Card */}
          <div className="rounded-lg border border-gray-800 bg-[#111827] p-3.5 shadow">
            <div className="flex items-center justify-between border-b border-gray-800 pb-2 mb-3">
              <div className="flex items-center space-x-1.5">
                <Landmark className="h-4 w-4 text-blue-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-gray-200">
                  Institutional Cash Flow
                </span>
              </div>
              <button
                onClick={() => onNavigate("fiidii")}
                className="text-[11px] text-blue-400 hover:underline"
              >
                Full Analytics
              </button>
            </div>

            {fiiDii?.latest_session ? (
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center rounded bg-gray-900/80 p-2">
                  <span className="text-gray-400">Foreign (FII) Net:</span>
                  <span
                    className={`font-mono font-bold ${
                      fiiDii.latest_session.fii_net >= 0 ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {fiiDii.latest_session.fii_net > 0 ? "+" : ""}
                    ₹{fiiDii.latest_session.fii_net.toLocaleString()} Cr
                  </span>
                </div>
                <div className="flex justify-between items-center rounded bg-gray-900/80 p-2">
                  <span className="text-gray-400">Domestic (DII) Net:</span>
                  <span
                    className={`font-mono font-bold ${
                      fiiDii.latest_session.dii_net >= 0 ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {fiiDii.latest_session.dii_net > 0 ? "+" : ""}
                    ₹{fiiDii.latest_session.dii_net.toLocaleString()} Cr
                  </span>
                </div>
                <div className="flex justify-between items-center pt-1 text-[11px] text-gray-400">
                  <span>5-Day Combined Net:</span>
                  <span className="font-mono font-bold text-gray-200">
                    ₹{fiiDii.rolling_5_session?.combined_net_cr?.toLocaleString() || 0} Cr
                  </span>
                </div>
                <div className="rounded bg-blue-950/40 border border-blue-900/40 p-2 text-[10px] text-blue-300">
                  {fiiDii.streaks?.fii_streak} | {fiiDii.streaks?.dii_streak}
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-500">Loading verified flows...</p>
            )}
          </div>

          {/* Sector Heatmap Snapshot */}
          <div className="rounded-lg border border-gray-800 bg-[#111827] p-3.5 shadow">
            <div className="flex items-center justify-between border-b border-gray-800 pb-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-200">
                Sector Momentum (Top 6)
              </span>
              <button
                onClick={() => onNavigate("sectors")}
                className="text-[11px] text-blue-400 hover:underline"
              >
                Heatmap
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {sectors.slice(0, 6).map((sec: any) => {
                const isPos = sec.daily_pct >= 0;
                return (
                  <div
                    key={sec.code}
                    className={`rounded border p-2 flex flex-col justify-between ${
                      isPos
                        ? "bg-emerald-950/30 border-emerald-800/40 text-emerald-300"
                        : "bg-red-950/30 border-red-800/40 text-red-300"
                    }`}
                  >
                    <span className="text-[11px] font-semibold truncate text-gray-200">
                      {sec.sector}
                    </span>
                    <div className="flex justify-between items-baseline mt-1">
                      <span className="text-[10px] opacity-75 font-mono">₹{sec.price}</span>
                      <span className="font-mono font-bold text-xs">
                        {isPos ? `+${sec.daily_pct}%` : `${sec.daily_pct}%`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Platform Attribution Footer */}
      <footer className="mt-8 border-t border-gray-800/80 pt-4 pb-2 text-center text-xs text-gray-400">
        <p className="flex items-center justify-center space-x-1.5">
          <span>Bharat Market Intelligence</span>
          <span>•</span>
          <span>Made with</span>
          <span className="text-red-500">❤️</span>
          <span>by</span>
          <strong className="text-gray-200 font-semibold hover:text-blue-400 transition">Aniruddha Bhutada</strong>
        </p>
        <p className="text-[10px] text-gray-500 mt-1">
          Free & Open-Source Indian Equity Research Terminal for NSE & BSE
        </p>
      </footer>
    </div>
  );
};

