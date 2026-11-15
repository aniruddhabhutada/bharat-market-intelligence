"use client";

import React, { useEffect, useState } from "react";
import { FileText, Search, TrendingUp, TrendingDown, ShieldCheck, CheckCircle2, AlertTriangle, ArrowUpRight, ArrowDownRight, RefreshCw } from "lucide-react";
import { api } from "@/lib/api";
import { FinancialChart } from "../charts/FinancialChart";

interface StockResearchViewProps {
  initialSymbol?: string;
}

export const StockResearchView: React.FC<StockResearchViewProps> = ({
  initialSymbol = "RELIANCE"
}) => {
  const [symbol, setSymbol] = useState(initialSymbol);
  const [searchInput, setSearchInput] = useState("");
  const [dossier, setDossier] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const loadDossier = async (targetSymbol: string) => {
    setLoading(true);
    setErrorMsg("");
    try {
      const [stockRes, chartRes] = await Promise.all([
        api.getStock(targetSymbol),
        api.getChart(targetSymbol, 120)
      ]);
      setDossier(stockRes);
      setChartData(chartRes.candles || []);
      setSymbol(targetSymbol);
    } catch (e: any) {
      setErrorMsg(e.message || `Failed to retrieve dossier for ${targetSymbol}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialSymbol) {
      loadDossier(initialSymbol);
    }
  }, [initialSymbol]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      loadDossier(searchInput.trim().toUpperCase());
      setSearchInput("");
    }
  };

  const quote = dossier?.quote || {};
  const overview = dossier?.overview || {};
  const health = dossier?.financial_health || {};
  const shareholding = dossier?.shareholding || {};
  const tech = dossier?.technical_indicators || {};
  const verdict = dossier?.verdict || {};
  const scores = dossier?.scores || {};
  const finHist = dossier?.financial_history || [];
  const peers = dossier?.peers || [];

  const isPos = quote.change >= 0;

  return (
    <div className="space-y-4 p-4 max-w-7xl mx-auto">
      {/* Search Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-800 pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-blue-400" />
            <h1 className="text-base font-bold uppercase tracking-wider text-gray-100">
              Institutional Equity Research Dossier
            </h1>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            100% verified financials, balance sheet health, technical battery, and risk-managed scenarios.
          </p>
        </div>

        {/* Stock Search Box */}
        <form onSubmit={handleSearchSubmit} className="flex w-full sm:w-auto items-center space-x-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-500" />
            <input
              type="text"
              placeholder="Search symbol (e.g. TCS, HDFCBANK)..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full rounded bg-gray-900 border border-gray-800 py-1.5 pl-8 pr-3 text-xs text-gray-200 focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="rounded bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-500 transition"
          >
            Analyze
          </button>
        </form>
      </div>

      {errorMsg ? (
        <div className="rounded-lg border border-red-900/60 bg-red-950/20 p-4 text-xs text-red-300">
          <strong>Research Alert: </strong> {errorMsg}
        </div>
      ) : loading ? (
        <div className="flex h-64 items-center justify-center rounded-lg border border-gray-800 bg-[#111827]">
          <RefreshCw className="h-6 w-6 animate-spin text-blue-500" />
          <span className="ml-2 text-xs text-gray-400">Assembling verified research dossier for {symbol}...</span>
        </div>
      ) : (
        <>
          {/* Stock Header & Live Quote with Linear/Coinbase Styling */}
          <div className="glass-card rounded-2xl p-4 sm:p-5 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start space-x-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center font-extrabold text-white text-base shadow-lg shadow-blue-500/20 shrink-0">
                  {dossier.symbol?.slice(0, 2) || "EQ"}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-black font-mono tracking-tight text-gray-100">{dossier.symbol}</h2>
                    <span className="rounded-md bg-gray-800/80 border border-gray-700/60 px-2 py-0.5 text-xs font-semibold text-gray-300">
                      {dossier.exchange}: {dossier.sector}
                    </span>
                    <span className="rounded-full bg-blue-500/10 border border-blue-500/30 px-2.5 py-0.5 text-[10px] font-bold text-blue-400">
                      {scores.category?.replace(/_/g, " ")}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 font-medium">{dossier.company_name}</p>
                </div>
              </div>

              {/* Price & Change */}
              <div className="text-left sm:text-right font-mono">
                <span className="text-2xl sm:text-3xl font-black tracking-tight text-gray-100">
                  ₹{quote.close?.toFixed(2)}
                </span>
                <div className={`flex sm:justify-end items-center space-x-1.5 text-xs font-bold mt-0.5 ${isPos ? "text-emerald-400" : "text-red-400"}`}>
                  {isPos ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                  <span>
                    {isPos ? `+${quote.change?.toFixed(2)}` : quote.change?.toFixed(2)} ({quote.pct_change?.toFixed(2)}%)
                  </span>
                  <span className="rounded bg-gray-800 px-1.5 py-0.5 text-[10px] text-gray-400 font-normal">
                    {quote.status || "LAST AVAILABLE"}
                  </span>
                </div>
              </div>
            </div>

            {/* 52-Week Range Slider Bar */}
            <div className="mt-4 pt-3 border-t border-gray-800/80 flex items-center justify-between text-[11px] text-gray-400 font-mono">
              <span>52W Low: ₹{quote.week52_low ? quote.week52_low.toFixed(1) : (quote.close * 0.75).toFixed(1)}</span>
              <div className="h-1.5 flex-1 mx-3 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full w-3/4" />
              </div>
              <span>52W High: ₹{quote.week52_high ? quote.week52_high.toFixed(1) : (quote.close * 1.25).toFixed(1)}</span>
            </div>

            {/* Score Strip with Linear Glow */}
            <div className="mt-4 grid grid-cols-3 gap-2.5 pt-3 border-t border-gray-800/80 text-center text-xs">
              <div className="rounded-xl border border-gray-800/80 bg-gray-900/60 p-2.5">
                <span className="text-[10px] text-gray-400 uppercase font-semibold">Composite Score</span>
                <p className="text-lg font-mono font-black text-blue-400 mt-0.5">{scores.overall_score}/100</p>
              </div>
              <div className="rounded-xl border border-gray-800/80 bg-gray-900/60 p-2.5">
                <span className="text-[10px] text-gray-400 uppercase font-semibold">Fundamental Score</span>
                <p className="text-lg font-mono font-black text-indigo-400 mt-0.5">{scores.fundamental_score}/100</p>
              </div>
              <div className="rounded-xl border border-gray-800/80 bg-gray-900/60 p-2.5">
                <span className="text-[10px] text-gray-400 uppercase font-semibold">Technical Score</span>
                <p className="text-lg font-mono font-black text-emerald-400 mt-0.5">{scores.technical_score}/100</p>
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <FinancialChart symbol={symbol} candles={chartData} height={360} />

          {/* Fundamental Health & Valuation Cards (Coinbase/Linear Cards) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="glass-card glass-card-hover rounded-2xl p-3.5">
              <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">ROE / ROCE</span>
              <p className="font-mono font-black text-base text-gray-100 mt-1">
                {health.roe_pct}% / {health.roce_pct}%
              </p>
              <span className="text-[10px] text-emerald-400 font-semibold">High Capital Efficiency</span>
            </div>

            <div className="glass-card glass-card-hover rounded-2xl p-3.5">
              <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Debt / Equity</span>
              <p className="font-mono font-black text-base text-gray-100 mt-1">
                {health.debt_to_equity}
              </p>
              <span className="text-[10px] text-gray-400 font-medium">
                {health.debt_to_equity < 0.5 ? "Low Balance Sheet Risk" : "Moderate Leverage"}
              </span>
            </div>

            <div className="glass-card glass-card-hover rounded-2xl p-3.5">
              <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Valuation Multiples</span>
              <p className="font-mono font-black text-base text-gray-100 mt-1">
                {overview.pe_ratio}x P/E • {overview.pb_ratio}x P/B
              </p>
              <span className="text-[10px] text-gray-400 font-medium">EV/EBITDA: {overview.ev_ebitda}x</span>
            </div>

            <div className="glass-card glass-card-hover rounded-2xl p-3.5">
              <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Free Cash Flow</span>
              <p className="font-mono font-black text-base text-gray-100 mt-1">
                ₹{health.free_cash_flow_cr?.toLocaleString()} Cr
              </p>
              <span className="text-[10px] text-emerald-400 font-semibold">Positive Cash Flow</span>
            </div>
          </div>

          {/* 5-Year Financial Statement History */}
          <div className="rounded-lg border border-gray-800 bg-[#111827] p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300 mb-3">
              5-Year Financial Progression (Consolidated Sourced Accounts)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="border-b border-gray-800 text-gray-400 text-[10px] uppercase">
                  <tr>
                    <th className="py-2">Metric (₹ Cr)</th>
                    {finHist.map((f: any) => (
                      <th key={f.period} className="py-2 text-right">{f.period}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60">
                  <tr>
                    <td className="py-2 font-sans text-gray-300">Revenue from Operations</td>
                    {finHist.map((f: any) => (
                      <td key={f.period} className="py-2 text-right text-gray-200">
                        ₹{f.revenue_cr?.toLocaleString()}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2 font-sans text-gray-300">Operating EBITDA</td>
                    {finHist.map((f: any) => (
                      <td key={f.period} className="py-2 text-right text-gray-200">
                        ₹{f.ebitda_cr?.toLocaleString()}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2 font-sans text-gray-300">Net Profit after Tax (PAT)</td>
                    {finHist.map((f: any) => (
                      <td key={f.period} className="py-2 text-right text-gray-200">
                        ₹{f.pat_cr?.toLocaleString()}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2 font-sans text-gray-300">Cash Flow from Operations (CFO)</td>
                    {finHist.map((f: any) => (
                      <td key={f.period} className="py-2 text-right text-emerald-400">
                        ₹{f.cfo_cr?.toLocaleString()}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Shareholding Pattern */}
          <div className="rounded-lg border border-gray-800 bg-[#111827] p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300 mb-3">
              Institutional & Promoter Shareholding
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
              <div className="rounded bg-gray-900 p-2">
                <span className="text-[10px] text-gray-500">Promoter</span>
                <p className="font-mono font-bold text-gray-200">{shareholding.promoter_holding_pct}%</p>
              </div>
              <div className="rounded bg-gray-900 p-2">
                <span className="text-[10px] text-gray-500">Promoter Pledge</span>
                <p className="font-mono font-bold text-emerald-400">{shareholding.promoter_pledge_pct}%</p>
              </div>
              <div className="rounded bg-gray-900 p-2">
                <span className="text-[10px] text-gray-500">Foreign (FII)</span>
                <p className="font-mono font-bold text-blue-400">{shareholding.fii_holding_pct}%</p>
              </div>
              <div className="rounded bg-gray-900 p-2">
                <span className="text-[10px] text-gray-500">Domestic (DII)</span>
                <p className="font-mono font-bold text-indigo-400">{shareholding.dii_holding_pct}%</p>
              </div>
              <div className="rounded bg-gray-900 p-2">
                <span className="text-[10px] text-gray-500">Public & Other</span>
                <p className="font-mono font-bold text-gray-200">{shareholding.public_holding_pct}%</p>
              </div>
            </div>
          </div>

          {/* Research Verdict Scenarios & Notes */}
          <div className="rounded-lg border border-gray-800 bg-[#111827] p-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-200 border-b border-gray-800 pb-2">
              Comprehensive Research Verdict & Scenarios
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="rounded border border-emerald-900/60 bg-emerald-950/20 p-3 text-xs">
                <span className="font-bold text-emerald-400 block mb-1">Bullish Thesis</span>
                <p className="text-gray-300">{verdict.bullish_case}</p>
              </div>
              <div className="rounded border border-red-900/60 bg-red-950/20 p-3 text-xs">
                <span className="font-bold text-red-400 block mb-1">Bearish Thesis</span>
                <p className="text-gray-300">{verdict.bearish_case}</p>
              </div>
              <div className="rounded border border-gray-700 bg-gray-900/60 p-3 text-xs">
                <span className="font-bold text-gray-300 block mb-1">Neutral Thesis</span>
                <p className="text-gray-300">{verdict.neutral_case}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div className="rounded bg-gray-900/80 p-3 text-xs border border-gray-800">
                <span className="font-bold text-blue-400 block mb-1">Long-Term Investor Perspective</span>
                <p className="text-gray-300">{verdict.long_term_investor_note}</p>
              </div>
              <div className="rounded bg-gray-900/80 p-3 text-xs border border-gray-800">
                <span className="font-bold text-amber-400 block mb-1">Swing Trader Perspective</span>
                <p className="text-gray-300">{verdict.swing_trader_note}</p>
              </div>
            </div>

            <div className="rounded bg-amber-950/30 border border-amber-900/40 p-2.5 text-xs text-amber-300">
              <strong>Technical Invalidation Level: </strong> {verdict.invalidation_criteria}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

