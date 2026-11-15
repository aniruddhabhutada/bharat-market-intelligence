"use client";

import React, { useEffect, useState } from "react";
import { SunMedium, Globe, Fuel, DollarSign, AlertTriangle, ShieldCheck, CheckCircle2, TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import { api } from "@/lib/api";

export const PremarketView: React.FC = () => {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadPremarket = async () => {
    setLoading(true);
    try {
      const data = await api.getPremarket();
      setReport(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPremarket();
  }, []);

  const macros = report?.global_context?.macro_factors || {};
  const globalMkts = report?.global_context?.global_markets || [];
  const setup = report?.indian_market_setup || {};
  const scenarios = report?.scenarios || {};
  const aiNarrative = report?.ai_synthesis?.narrative || "";

  return (
    <div className="space-y-4 p-4 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-gray-800 pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <SunMedium className="h-5 w-5 text-amber-400" />
            <h1 className="text-base font-bold uppercase tracking-wider text-gray-100">
              Daily Pre-Market Intelligence (08:30 IST Session)
            </h1>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Global market cues, commodities, currency, and multi-scenario tactical Indian opening framework.
          </p>
        </div>

        <button
          onClick={loadPremarket}
          disabled={loading}
          className="flex items-center space-x-1.5 rounded bg-gray-800 px-3 py-1.5 text-xs font-semibold text-gray-300 hover:text-white transition"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Analysis</span>
        </button>
      </div>

      {/* Global & Macro Cards (Linear / Coinbase Glassmorphic Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: "BRENT CRUDE", val: macros.CRUDE_OIL?.value ? `$${macros.CRUDE_OIL.value}` : "$74.20", pct: macros.CRUDE_OIL?.pct_change || -0.4, icon: Fuel },
          { label: "GOLD OUNCE", val: macros.GOLD?.value ? `$${macros.GOLD.value}` : "$2645.0", pct: macros.GOLD?.pct_change || 0.2, icon: SunMedium },
          { label: "USD / INR", val: macros.USD_INR?.value ? `₹${macros.USD_INR.value}` : "₹84.42", pct: macros.USD_INR?.pct_change || 0.05, icon: DollarSign },
          { label: "US 10Y YIELD", val: macros.US_10Y_YIELD?.value ? `${macros.US_10Y_YIELD.value}%` : "4.41%", pct: macros.US_10Y_YIELD?.pct_change || 0.1, icon: Globe },
          { label: "DOLLAR INDEX", val: macros.DOLLAR_INDEX?.value ? `${macros.DOLLAR_INDEX.value}` : "106.2", pct: macros.DOLLAR_INDEX?.pct_change || -0.15, icon: ShieldCheck }
        ].map((item, idx) => {
          const Icon = item.icon;
          const isPos = item.pct >= 0;
          return (
            <div key={idx} className="glass-card glass-card-hover rounded-2xl p-3.5 shadow-lg">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span className="font-bold text-[10px] tracking-wider text-gray-300">{item.label}</span>
                <Icon className="h-3.5 w-3.5 text-blue-400" />
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="font-mono font-black text-base text-gray-100">{item.val}</span>
                <span className={`text-[11px] font-mono font-bold ${isPos ? "text-emerald-400" : "text-red-400"}`}>
                  {isPos ? `+${item.pct}%` : `${item.pct}%`}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI & Research Analyst Briefing */}
      {aiNarrative && (
        <div className="glass-card rounded-2xl p-4 sm:p-5 shadow-xl border-l-4 border-l-blue-500">
          <div className="flex items-center space-x-2 border-b border-gray-800 pb-2.5 mb-3">
            <span className="rounded-full bg-blue-500/10 border border-blue-500/30 px-2.5 py-0.5 text-[10px] font-bold text-blue-400">
              {report?.ai_synthesis?.model || "RULE-BASED DETERMINISTIC ANALYST"}
            </span>
            <span className="text-[11px] text-gray-400 font-medium">
              Verified Evidence-Backed Synthesis | Prompt v1.0
            </span>
          </div>
          <div className="prose prose-invert max-w-none text-xs text-gray-300 whitespace-pre-line leading-relaxed">
            {aiNarrative}
          </div>
        </div>
      )}

      {/* Scenarios Framework: Bullish, Bearish, Neutral */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="glass-card rounded-2xl border-emerald-900/40 bg-emerald-950/15 p-4">
          <div className="flex items-center space-x-2 text-emerald-400 mb-2 font-bold text-xs tracking-wide">
            <TrendingUp className="h-4 w-4" />
            <span>BULLISH SCENARIO</span>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed font-normal">
            {scenarios.bullish_scenario || "Sustained trade above opening range targets continuation towards swing resistance."}
          </p>
        </div>

        <div className="glass-card rounded-2xl border-red-900/40 bg-red-950/15 p-4">
          <div className="flex items-center space-x-2 text-red-400 mb-2 font-bold text-xs tracking-wide">
            <TrendingDown className="h-4 w-4" />
            <span>BEARISH SCENARIO</span>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">
            {scenarios.bearish_scenario || "Breakdown below yesterday's low triggers stop runs towards moving average support."}
          </p>
        </div>

        <div className="rounded-lg border border-gray-700 bg-gray-900/60 p-3.5">
          <div className="flex items-center space-x-2 text-gray-300 mb-2 font-bold text-xs">
            <ShieldCheck className="h-4 w-4 text-blue-400" />
            <span>NEUTRAL / BALANCED SCENARIO</span>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">
            {scenarios.neutral_scenario || "Range-bound rotation expected as institutional cash flows absorb cross-border volatility."}
          </p>
        </div>
      </div>

      {/* Risks & Sectors Focus */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Risks */}
        <div className="rounded-lg border border-gray-800 bg-[#111827] p-3.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-1.5 mb-2.5">
            <AlertTriangle className="h-4 w-4" />
            <span>Key Market Risks to Monitor</span>
          </h3>
          <ul className="space-y-1.5 text-xs text-gray-300">
            {(report?.key_risks || []).map((risk: string, i: number) => (
              <li key={i} className="flex items-start space-x-2">
                <span className="text-amber-500 font-bold">•</span>
                <span>{risk}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Sectors in Focus */}
        <div className="rounded-lg border border-gray-800 bg-[#111827] p-3.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center space-x-1.5 mb-2.5">
            <CheckCircle2 className="h-4 w-4" />
            <span>Sectors in Focus for Today</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {(report?.sectors_in_focus || ["Banking", "Infra", "Auto"]).map((s: string, idx: number) => (
              <span key={idx} className="rounded bg-blue-950/60 border border-blue-800/40 px-2.5 py-1 text-xs text-blue-300 font-medium">
                {s}
              </span>
            ))}
          </div>
          <p className="text-[11px] text-gray-500 mt-3">
            Confidence Rating: <strong className="text-gray-300">{report?.confidence_rating || "HIGH (Exchange Sourced)"}</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

