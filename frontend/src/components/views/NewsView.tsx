"use client";

import React, { useEffect, useState } from "react";
import { Newspaper, ExternalLink, ShieldCheck, RefreshCw, Tag, Sparkles, Filter } from "lucide-react";
import { api } from "@/lib/api";

export const NewsView: React.FC = () => {
  const [news, setNews] = useState<any[]>([]);
  const [selectedCat, setSelectedCat] = useState("ALL");
  const [loading, setLoading] = useState(true);

  const loadNews = async () => {
    setLoading(true);
    try {
      const data = await api.getNews(40);
      setNews(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  const categories = ["ALL", "Indian Economy", "Corporate Earnings", "Regulatory", "Market Developments", "Sectoral"];

  const filteredNews = selectedCat === "ALL"
    ? news
    : news.filter((n) => n.category?.toLowerCase() === selectedCat.toLowerCase());

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-200 dark:border-white/[0.08] pb-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="h-8 w-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Newspaper className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100">
                  Verified Financial Newsroom &amp; Regulatory Bulletins
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                  SEBI / RBI DEDUPLICATED
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Curated intelligence from official exchange disclosures, corporate filings, and accredited financial wires.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={loadNews}
          disabled={loading}
          className="flex items-center space-x-1.5 rounded-xl border border-gray-200 dark:border-white/[0.1] bg-white dark:bg-gray-800 px-3.5 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition active:scale-95 shadow-sm"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-blue-600" : "text-gray-400"}`} />
          <span>Refresh News</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex overflow-x-auto space-x-2 pb-1 no-scrollbar">
        {categories.map((cat) => {
          const active = selectedCat === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition active:scale-95 ${
                active
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white dark:bg-gray-900/60 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/[0.06] hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Articles Feed */}
      <div className="space-y-3.5">
        {loading ? (
          <div className="flex flex-col h-48 items-center justify-center rounded-3xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#0E1524]">
            <RefreshCw className="h-6 w-6 animate-spin text-blue-600 dark:text-blue-400" />
            <span className="mt-2 text-xs text-gray-400">Fetching latest filings and bulletins...</span>
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-200 dark:border-white/[0.1] bg-white dark:bg-gray-950/40 p-8 text-center text-xs text-gray-400">
            No news items found under category "{selectedCat}".
          </div>
        ) : (
          filteredNews.map((art, idx) => {
            const isBull = art.sentiment === "BULLISH";
            const isBear = art.sentiment === "BEARISH";

            return (
              <div
                key={idx}
                className="rounded-3xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#0E1524] p-5 shadow-sm hover:shadow-md transition space-y-3"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-gray-100 dark:bg-white/[0.06] px-2 py-0.5 text-[10px] font-bold text-gray-700 dark:text-gray-300">
                    {art.source}
                  </span>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 font-mono">
                    {art.published_at ? new Date(art.published_at).toLocaleDateString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "Live Wire"}
                  </span>
                  <span className="rounded-md bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:text-blue-300">
                    {art.category}
                  </span>
                  {art.confirmed_filing && (
                    <span className="flex items-center space-x-1 rounded-md bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                      <ShieldCheck className="h-3 w-3" />
                      <span>Official Exchange Filing</span>
                    </span>
                  )}
                  <span
                    className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                      isBull
                        ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20"
                        : isBear
                        ? "bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20"
                        : "bg-gray-100 dark:bg-white/[0.04] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/[0.08]"
                    }`}
                  >
                    {art.sentiment}
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100 leading-snug">
                  <a href={art.url || "#"} target="_blank" rel="noopener noreferrer" className="flex items-start justify-between group">
                    <span className="group-hover:text-blue-600 transition">{art.title}</span>
                    <ExternalLink className="h-3.5 w-3.5 ml-2 mt-1 flex-shrink-0 text-gray-400 group-hover:text-blue-600 transition" />
                  </a>
                </h3>

                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  {art.summary}
                </p>

                {art.relevant_symbols && art.relevant_symbols.length > 0 && (
                  <div className="pt-2 border-t border-gray-100 dark:border-white/[0.04] flex items-center space-x-2">
                    <Tag className="h-3 w-3 text-gray-400" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Related Equities:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {art.relevant_symbols.map((sym: string) => (
                        <span key={sym} className="rounded-lg bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-white/[0.08] px-2 py-0.5 text-[10px] font-mono text-gray-800 dark:text-gray-200 font-bold">
                          {sym}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
