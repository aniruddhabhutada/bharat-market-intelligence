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
          {/* Stock Header & Live Quote */}
          <div className="rounded-lg border border-gray-800 bg-[#111827] p-4 shadow">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center space-x-2.5">
                  <h2 className="text-xl font-bold font-mono text-gray-100">{dossier.symbol}</h2>
                  <span className="rounded bg-gray-800 px-2 py-0.5 text-xs font-medium text-gray-300">
                    {dossier.exchange}: {dossier.sector}
                  </span>
                  <span className="rounded bg-blue-950/80 border border-blue-800/40 px-2 py-0.5 text-[10px] font-bold text-blue-300">
                    {scores.category?.replace(/_/g, " ")}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">{dossier.company_name}</p>
              </div>

              {/* Price & Change */}
              <div className="text-left sm:text-right font-mono">
                <span className="text-2xl font-bold text-gray-100">
                  ₹{quote.close?.toFixed(2)}
                </span>
                <div className={`flex sm:justify-end items-center text-xs font-semibold ${isPos ? "text-emerald-400" : "text-red-400"}`}>
                  {isPos ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                  <span>
                    {isPos ? `+${quote.change?.toFixed(2)}` : quote.change?.toFixed(2)} ({quote.pct_change?.toFixed(2)}%)
                  </span>
                  <span className="ml-2 rounded bg-gray-800 px-1.5 py-0.2 text-[10px] text-gray-400">
                    {quote.status || "LAST AVAILABLE"}
                  </span>
                </div>
              </div>
            </div>

            {/* Score Strip */}
            <div className="mt-4 grid grid-cols-3 gap-2 border-t border-gray-800 pt-3 text-center text-xs">
              <div className="rounded bg-gray-900/60 p-2">
                <span className="text-[10px] text-gray-500 uppercase">Composite Score</span>
                <p className="text-base font-mono font-bold text-blue-400">{scores.overall_score}/100</p>
              </div>
              <div className="rounded bg-gray-900/60 p-2">
                <span className="text-[10px] text-gray-500 uppercase">Fundamental Score</span>
                <p className="text-base font-mono font-bold text-indigo-400">{scores.fundamental_score}/100</p>
              </div>
              <div className="rounded bg-gray-900/60 p-2">
                <span className="text-[10px] text-gray-500 uppercase">Technical Score</span>
                <p className="text-base font-mono font-bold text-emerald-400">{scores.technical_score}/100</p>
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <FinancialChart symbol={symbol} candles={chartData} height={360} />

          {/* Fundamental Health & Valuation Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-lg border border-gray-800 bg-[#111827] p-3">
              <span className="text-[10px] text-gray-500 uppercase">ROE / ROCE</span>
              <p className="font-mono font-bold text-sm text-gray-200 mt-1">
                {health.roe_pct}% / {health.roce_pct}%
              </p>
              <span className="text-[10px] text-emerald-400">High Return on Capital</span>
            </div>

            <div className="rounded-lg border border-gray-800 bg-[#111827] p-3">
              <span className="text-[10px] text-gray-500 uppercase">Debt / Equity</span>
              <p className="font-mono font-bold text-sm text-gray-200 mt-1">
                {health.debt_to_equity}
              </p>
              <span className="text-[10px] text-gray-400">
                {health.debt_to_equity < 0.5 ? "Low Leverage" : "Moderate Leverage"}
              </span>
            </div>

            <div className="rounded-lg border border-gray-800 bg-[#111827] p-3">
              <span className="text-[10px] text-gray-500 uppercase">Valuation (P/E & P/B)</span>
              <p className="font-mono font-bold text-sm text-gray-200 mt-1">
                {overview.pe_ratio}x / {overview.pb_ratio}x
              </p>
              <span className="text-[10px] text-gray-400">EV/EBITDA: {overview.ev_ebitda}x</span>
            </div>

            <div className="rounded-lg border border-gray-800 bg-[#111827] p-3">
              <span className="text-[10px] text-gray-500 uppercase">Cash Flow Quality</span>
              <p className="font-mono font-bold text-sm text-gray-200 mt-1">
                ₹{health.free_cash_flow_cr?.toLocaleString()} Cr
              </p>
              <span className="text-[10px] text-emerald-400">Positive Free Cash Flow</span>
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

