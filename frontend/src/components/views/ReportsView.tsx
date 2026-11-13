"use client";

import React, { useEffect, useState } from "react";
import { Archive, Download, RefreshCw, Calendar, Sparkles, FileText, ChevronRight } from "lucide-react";
import { api } from "@/lib/api";

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

  return (
    <div className="space-y-4 p-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-800 pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <Archive className="h-5 w-5 text-indigo-400" />
            <h1 className="text-base font-bold uppercase tracking-wider text-gray-100">
              Historical Research Reports Archive & Publishing Hub
            </h1>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Searchable historical daily dossiers with on-demand report generation and CSV export.
          </p>
        </div>

        {/* Trigger On-Demand Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleTriggerReport("MORNING")}
            disabled={triggering}
            className="rounded bg-amber-950/80 border border-amber-800/60 px-2.5 py-1 text-xs font-semibold text-amber-300 hover:bg-amber-900 transition"
          >
            + Morning Report
          </button>
          <button
            onClick={() => handleTriggerReport("INTRADAY")}
            disabled={triggering}
            className="rounded bg-blue-950/80 border border-blue-800/60 px-2.5 py-1 text-xs font-semibold text-blue-300 hover:bg-blue-900 transition"
          >
            + Intraday Report
          </button>
          <button
            onClick={() => handleTriggerReport("EVENING")}
            disabled={triggering}
            className="rounded bg-indigo-950/80 border border-indigo-800/60 px-2.5 py-1 text-xs font-semibold text-indigo-300 hover:bg-indigo-900 transition"
          >
            + Evening Report
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 border-b border-gray-800 pb-2">
        {["ALL", "MORNING", "INTRADAY", "EVENING"].map((t) => (
          <button
            key={t}
            onClick={() => setSelectedType(t)}
            className={`rounded px-3 py-1 text-xs font-semibold transition ${
              selectedType === t
                ? "bg-blue-600 text-white"
                : "bg-gray-900 text-gray-400 hover:text-white"
            }`}
          >
            {t} Reports
          </button>
        ))}
      </div>

      {/* 2-Column Layout: Reports List & Detail Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Col: Reports List */}
        <div className="space-y-2">
          {reports.map((rep) => {
            const isActive = activeReport?.id === rep.id;
            return (
              <button
                key={rep.id}
                onClick={() => setActiveReport(rep)}
                className={`w-full rounded-lg border p-3 text-left transition ${
                  isActive
                    ? "border-blue-500 bg-[#162032] shadow-md"
                    : "border-gray-800 bg-[#111827] hover:border-gray-700"
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1">
                  <span className="rounded bg-gray-800 px-1.5 py-0.2 font-bold font-mono">
                    {rep.report_type}
                  </span>
                  <span>{rep.report_date}</span>
                </div>
                <h3 className="text-xs font-bold text-gray-200 line-clamp-1">{rep.title}</h3>
                <p className="text-[11px] text-gray-400 mt-1 line-clamp-2">{rep.summary}</p>
              </button>
            );
          })}
        </div>

        {/* Right 2 Cols: Report Viewer */}
        <div className="lg:col-span-2">
          {activeReport ? (
            <div className="rounded-lg border border-gray-800 bg-[#111827] p-5 space-y-4 shadow">
              <div className="flex items-start justify-between border-b border-gray-800 pb-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="rounded bg-blue-900/60 border border-blue-700/60 px-2 py-0.5 text-[10px] font-bold text-blue-300">
                      {activeReport.report_type} DOSSIER
                    </span>
                    <span className="text-xs text-gray-400 font-mono">
                      Date: {activeReport.report_date}
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-gray-100 mt-1.5">
                    {activeReport.title}
                  </h2>
                </div>

                {/* CSV Download Link */}
                <a
                  href={`http://127.0.0.1:8000/api/reports/${activeReport.id}/export/csv`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-1 rounded bg-gray-800 px-3 py-1.5 text-xs font-semibold text-gray-200 hover:bg-gray-700 hover:text-white transition"
                >
                  <Download className="h-3.5 w-3.5 text-blue-400" />
                  <span>Export CSV</span>
                </a>
              </div>

              {/* AI Research Synthesis Box */}
              {activeReport.content?.ai_synthesis && (
                <div className="rounded-lg border border-blue-900/40 bg-blue-950/20 p-3.5 space-y-2">
                  <div className="flex items-center space-x-2 text-[10px] text-blue-300 font-bold uppercase tracking-wider">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Executive Analyst Synthesis ({activeReport.content.ai_synthesis.model})</span>
                  </div>
                  <div className="text-xs text-gray-300 whitespace-pre-line leading-relaxed">
                    {activeReport.content.ai_synthesis.narrative}
                  </div>
                </div>
              )}

              {/* Structured Report JSON Sections */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Verified Ingested Evidence
                </h4>
                <div className="max-h-96 overflow-y-auto rounded bg-gray-900/90 p-3 font-mono text-[11px] text-gray-300 border border-gray-800">
                  <pre className="whitespace-pre-wrap">
                    {JSON.stringify(activeReport.content, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-lg border border-gray-800 bg-[#111827] text-xs text-gray-500">
              Select a research report from the archive to inspect.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

