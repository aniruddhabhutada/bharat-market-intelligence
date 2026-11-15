"use client";

import React, { useEffect, useState } from "react";
import { Archive, Download, RefreshCw, Calendar, Sparkles, FileText, ChevronRight, Layers } from "lucide-react";
import { api, getApiBase } from "@/lib/api";

export const ReportsView: React.FC = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [activeReport, setActiveReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState(false);

  const loadReports = async () => {
    setLoading(true);
    try {
      const data = await api.getReports(selectedType === "ALL" ? undefined : selectedType);
      setReports(data);
      if (data.length > 0 && !activeReport) {
        setActiveReport(data[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, [selectedType]);

  const handleTriggerReport = async (type: string) => {
    setTriggering(true);
    try {
      await api.triggerReport(type);
      loadReports();
    } catch (e) {
      console.error(e);
    } finally {
      setTriggering(false);
    }
  };

  const apiBase = typeof window !== "undefined" ? getApiBase() : "https://bharat-market-intelligence.onrender.com/api";

  return (
    <div className="space-y-5 p-3 sm:p-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="h-8 w-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Archive className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100">
                  Institutional Intelligence Archive & Reports Hub
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  EXPORTABLE DOSSIERS
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Archived multi-factor market briefings with on-demand generation and verified CSV data exports.
              </p>
            </div>
          </div>
        </div>

        {/* Trigger On-Demand Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleTriggerReport("MORNING")}
            disabled={triggering}
            className="rounded-xl bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition active:scale-95 shadow-sm"
          >
            + Morning Dossier
          </button>
          <button
            onClick={() => handleTriggerReport("INTRADAY")}
            disabled={triggering}
            className="rounded-xl bg-blue-500/10 border border-blue-500/30 px-3 py-1.5 text-xs font-semibold text-blue-300 hover:bg-blue-500/20 transition active:scale-95 shadow-sm"
          >
            + Intraday Snapshot
          </button>
          <button
            onClick={() => handleTriggerReport("EVENING")}
            disabled={triggering}
            className="rounded-xl bg-indigo-500/10 border border-indigo-500/30 px-3 py-1.5 text-xs font-semibold text-indigo-300 hover:bg-indigo-500/20 transition active:scale-95 shadow-sm"
          >
            + Evening Close
          </button>
        </div>
      </div>

      {/* Filter Ribbon */}
      <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-1">
        {["ALL", "MORNING", "INTRADAY", "EVENING"].map((t) => {
          const active = selectedType === t;
          return (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition active:scale-95 ${
                active
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 border border-blue-400/40"
                  : "bg-gray-900/60 dark:bg-gray-900/60 text-gray-400 border border-white/[0.06] hover:border-white/20 hover:text-gray-200"
              }`}
            >
              {t} Reports
            </button>
          );
        })}
      </div>

      {/* 2-Column Layout: Reports List & Detail Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Col: Reports List */}
        <div className="space-y-3">
          {loading ? (
            <div className="flex flex-col h-40 items-center justify-center rounded-2xl border border-white/[0.08] glass-card">
              <RefreshCw className="h-6 w-6 animate-spin text-blue-400" />
              <span className="mt-2 text-xs text-gray-400">Loading dossiers...</span>
            </div>
          ) : reports.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/[0.1] bg-gray-950/40 p-6 text-center text-xs text-gray-400">
              No reports stored in this category.
            </div>
          ) : (
            reports.map((rep) => {
              const isActive = activeReport?.id === rep.id;
              return (
                <button
                  key={rep.id}
                  onClick={() => setActiveReport(rep)}
                  className={`w-full rounded-2xl border p-4 text-left transition active:scale-[0.99] duration-150 ${
                    isActive
                      ? "border-blue-500 bg-blue-600/10 shadow-lg shadow-blue-500/10"
                      : "border-white/[0.08] glass-card hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1.5">
                    <span className="rounded-md bg-white/[0.06] px-2 py-0.5 font-bold font-mono text-gray-300">
                      {rep.report_type}
                    </span>
                    <span className="font-mono">{rep.report_date}</span>
                  </div>
                  <h3 className="text-xs font-bold text-gray-100 line-clamp-1 tracking-tight">{rep.title}</h3>
                  <p className="text-[11px] text-gray-400 mt-1 line-clamp-2 leading-relaxed">{rep.summary}</p>
                </button>
              );
            })
          )}
        </div>

        {/* Right 2 Cols: Report Viewer */}
        <div className="lg:col-span-2">
          {activeReport ? (
            <div className="glass-card rounded-2xl border border-white/[0.08] p-5 sm:p-6 space-y-5 shadow-2xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="rounded-full bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 text-[10px] font-bold text-blue-300">
                      {activeReport.report_type} DOSSIER
                    </span>
                    <span className="text-xs text-gray-400 font-mono">
                      Published: {activeReport.report_date}
                    </span>
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-gray-100 mt-2 tracking-tight">
                    {activeReport.title}
                  </h2>
                </div>

                {/* CSV Download Link */}
                <a
                  href={`${apiBase}/reports/${activeReport.id}/export/csv`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-1.5 rounded-xl border border-white/[0.1] bg-gray-900/60 px-3.5 py-2 text-xs font-semibold text-gray-200 hover:bg-gray-800 transition active:scale-95 shrink-0"
                >
                  <Download className="h-3.5 w-3.5 text-blue-400" />
                  <span>Export CSV</span>
                </a>
              </div>

              {/* AI Research Synthesis Box */}
              {activeReport.content?.ai_synthesis && (
                <div className="glass-card rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-950/30 to-indigo-950/20 p-4 sm:p-5 space-y-2.5 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-[10px] text-blue-300 font-bold uppercase tracking-wider">
                      <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                      <span>Executive Market Synthesis</span>
                    </div>
                    <span className="text-[10px] font-mono text-gray-400">
                      {activeReport.content.ai_synthesis.model || "Local Rule Engine"}
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-200 whitespace-pre-line leading-relaxed">
                    {activeReport.content.ai_synthesis.narrative}
                  </div>
                </div>
              )}

              {/* Structured Report JSON Sections */}
              <div className="space-y-2.5">
                <div className="flex items-center space-x-2">
                  <Layers className="h-4 w-4 text-blue-400" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300">
                    Verified Ingested Evidence
                  </h4>
                </div>
                <div className="max-h-96 overflow-y-auto rounded-xl bg-gray-950/80 p-4 font-mono text-[11px] text-gray-300 border border-white/[0.06] shadow-inner leading-relaxed">
                  <pre className="whitespace-pre-wrap">
                    {JSON.stringify(activeReport.content, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-2xl border border-white/[0.08] glass-card text-xs text-gray-400">
              Select a research report from the archive to inspect.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
