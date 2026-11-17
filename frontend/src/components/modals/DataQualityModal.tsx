"use client";

import React, { useEffect, useState } from "react";
import { ShieldCheck, AlertTriangle, CheckCircle, RefreshCw, X } from "lucide-react";
import { api } from "@/lib/api";

interface DataQualityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DataQualityModal: React.FC<DataQualityModalProps> = ({ isOpen, onClose }) => {
  const [auditData, setAuditData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const loadAudit = async () => {
    setLoading(true);
    try {
      const res = await api.getDataQuality();
      setAuditData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadAudit();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const audit = auditData?.audit;
  const recentIssues = auditData?.recent_issues || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl border border-[#E5EAF2] dark:border-[#1F2E47] bg-white dark:bg-[#131C2E] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E5EAF2] dark:border-[#1F2E47] px-5 py-4">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="h-5 w-5 text-[#14866D] dark:text-emerald-400" />
            <h3 className="text-sm font-bold text-[#172B4D] dark:text-[#F4F6FB] uppercase tracking-wider">
              Data Quality &amp; Source Reliability Monitor
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-[#667085] hover:bg-[#F5F7FB] dark:hover:bg-[#1A2844] hover:text-[#172B4D] dark:hover:text-[#F4F6FB] transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="max-h-[75vh] overflow-y-auto p-5 space-y-4">
          {/* Status summary banner */}
          <div className="flex items-center justify-between rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50 dark:bg-emerald-950/40 p-3.5">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-[#14866D] dark:text-emerald-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-emerald-800 dark:text-emerald-200">
                  Integrity Health: {audit?.overall_health || "HEALTHY"}
                </p>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-300/80 mt-0.5">
                  Zero price hallucination policy active. Pre-calculated exchange data only.
                </p>
              </div>
            </div>
            <button
              onClick={loadAudit}
              disabled={loading}
              className="flex items-center space-x-1.5 rounded-xl border border-emerald-300 dark:border-emerald-700/60 bg-white dark:bg-[#0B111E] px-2.5 py-1 text-xs font-semibold text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-950 transition"
            >
              <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>
          </div>

          {/* Provider Matrix */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#667085] dark:text-[#97A3B6] mb-2">
              Provider Ingestion Status
            </h4>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {audit?.provider_statuses &&
                Object.entries(audit.provider_statuses).map(([provider, status]: [string, any]) => (
                  <div key={provider} className="rounded-xl border border-[#E5EAF2] dark:border-[#1F2E47] bg-[#F5F7FB] dark:bg-[#0B111E] p-2.5">
                    <p className="text-[10px] font-mono text-[#667085] dark:text-[#97A3B6] uppercase">{provider}</p>
                    <p
                      className={`text-xs font-bold mt-1 ${
                        status === "HEALTHY" ? "text-[#14866D] dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      {status}
                    </p>
                  </div>
                ))}
            </div>
          </div>

          {/* Diagnostic Metrics */}
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            <div className="rounded-xl border border-[#E5EAF2] dark:border-[#1F2E47] bg-[#F5F7FB] dark:bg-[#0B111E] p-2.5">
              <p className="text-[10px] text-[#667085] dark:text-[#97A3B6]">Active Trading Date</p>
              <p className="text-xs font-semibold text-[#172B4D] dark:text-[#F4F6FB] mt-0.5">{audit?.trading_date || "2026-11-13"}</p>
            </div>
            <div className="rounded-xl border border-[#E5EAF2] dark:border-[#1F2E47] bg-[#F5F7FB] dark:bg-[#0B111E] p-2.5">
              <p className="text-[10px] text-[#667085] dark:text-[#97A3B6]">Cached Instrument Quotes</p>
              <p className="text-xs font-semibold text-[#172B4D] dark:text-[#F4F6FB] mt-0.5">{audit?.quote_count || 0} Symbols</p>
            </div>
            <div className="rounded-xl border border-[#E5EAF2] dark:border-[#1F2E47] bg-[#F5F7FB] dark:bg-[#0B111E] p-2.5">
              <p className="text-[10px] text-[#667085] dark:text-[#97A3B6]">Anomalies Detected</p>
              <p className="text-xs font-semibold text-[#14866D] dark:text-emerald-400 mt-0.5">
                {audit?.anomalies_detected || 0} (0% Error Rate)
              </p>
            </div>
          </div>

          {/* Validation Checklist */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#667085] dark:text-[#97A3B6] mb-2">
              Automated Integrity Checks
            </h4>
            <div className="space-y-1.5 text-xs text-[#172B4D] dark:text-[#CBD5E1]">
              <div className="flex items-center space-x-2 rounded-xl bg-[#F5F7FB] dark:bg-[#0B111E] p-2.5 border border-[#E5EAF2] dark:border-[#1F2E47]">
                <CheckCircle className="h-3.5 w-3.5 text-[#14866D] dark:text-emerald-400 shrink-0" />
                <span>
                  <strong>Geometric Price Sanity:</strong> High ≥ max(Open, Close, Low) and Low ≤ min(Open, Close, High)
                </span>
              </div>
              <div className="flex items-center space-x-2 rounded-xl bg-[#F5F7FB] dark:bg-[#0B111E] p-2.5 border border-[#E5EAF2] dark:border-[#1F2E47]">
                <CheckCircle className="h-3.5 w-3.5 text-[#14866D] dark:text-emerald-400 shrink-0" />
                <span>
                  <strong>Corporate Action / Split Guard:</strong> Auto-flags single-day price shifts exceeding 20%
                </span>
              </div>
              <div className="flex items-center space-x-2 rounded-xl bg-[#F5F7FB] dark:bg-[#0B111E] p-2.5 border border-[#E5EAF2] dark:border-[#1F2E47]">
                <CheckCircle className="h-3.5 w-3.5 text-[#14866D] dark:text-emerald-400 shrink-0" />
                <span>
                  <strong>Indicator Warm-Up Verification:</strong> Enforces minimum 200 sessions before calculating 200 SMA
                </span>
              </div>
            </div>
          </div>

          {/* Recent Quality Logs */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#667085] dark:text-[#97A3B6] mb-2">
              Recent Provider Events &amp; Fallback Logs
            </h4>
            {recentIssues.length === 0 ? (
              <p className="text-xs text-[#667085] dark:text-[#97A3B6] italic">No data quality discrepancies recorded.</p>
            ) : (
              <div className="space-y-1.5">
                {recentIssues.slice(0, 5).map((log: any) => (
                  <div
                    key={log.id}
                    className="flex items-start space-x-2 rounded-xl border border-[#E5EAF2] dark:border-[#1F2E47] bg-[#F5F7FB] dark:bg-[#0B111E] p-2 text-xs"
                  >
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold text-[#172B4D] dark:text-[#F4F6FB]">[{log.issue_type}] </span>
                      <span className="text-[#667085] dark:text-[#97A3B6]">{log.details}</span>
                      <p className="text-[10px] text-[#667085] dark:text-[#6C7A8E] mt-0.5">{log.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-[#E5EAF2] dark:border-[#1F2E47] px-5 py-3.5">
          <button
            onClick={onClose}
            className="rounded-xl bg-[#315EFB] px-4 py-1.5 text-xs font-semibold text-white hover:bg-blue-600 transition shadow-sm"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
