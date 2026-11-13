"use client";

import React, { useEffect, useState } from "react";
import { Newspaper, ExternalLink, ShieldCheck, RefreshCw, Tag } from "lucide-react";
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
    <div className="space-y-4 p-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-gray-800 pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <Newspaper className="h-5 w-5 text-blue-400" />
            <h1 className="text-base font-bold uppercase tracking-wider text-gray-100">
              Verified Financial Newsroom & Regulatory Bulletins
            </h1>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Deduplicated feeds from RBI, SEBI, exchange announcements, and reliable financial media.
          </p>
        </div>

        <button
          onClick={loadNews}
          disabled={loading}
          className="flex items-center space-x-1.5 rounded bg-gray-800 px-3 py-1.5 text-xs font-semibold text-gray-300 hover:text-white"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh News</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex overflow-x-auto space-x-1.5 pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
              selectedCat === cat
                ? "bg-blue-600 text-white"
                : "bg-gray-900 border border-gray-800 text-gray-400 hover:text-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Articles Feed */}
      <div className="space-y-3">
        {filteredNews.map((art, idx) => {
          const isBull = art.sentiment === "BULLISH";
          const isBear = art.sentiment === "BEARISH";

          return (
            <div
              key={idx}
              className="rounded-lg border border-gray-800 bg-[#111827] p-4 shadow transition hover:border-gray-700"
            >
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="rounded bg-gray-800 px-2 py-0.5 text-[10px] font-bold text-gray-300">
                  {art.source}
                </span>
                <span className="text-[10px] text-gray-500 font-mono">
                  {art.published_at ? new Date(art.published_at).toLocaleString() : "Recent"}
                </span>
                <span className="rounded bg-blue-950/60 border border-blue-800/40 px-2 py-0.5 text-[10px] text-blue-300">
                  {art.category}
                </span>
                {art.confirmed_filing && (
                  <span className="flex items-center space-x-1 rounded bg-emerald-950/80 border border-emerald-800/40 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400">
                    <ShieldCheck className="h-3 w-3" />
                    <span>Official Exchange Filing</span>
                  </span>
                )}
                <span
                  className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                    isBull
                      ? "bg-emerald-950 text-emerald-400"
                      : isBear
                      ? "bg-red-950 text-red-400"
                      : "bg-gray-800 text-gray-400"
                  }`}
                >
                  {art.sentiment}
                </span>
              </div>

              <h3 className="text-sm font-bold text-gray-100 hover:text-blue-400 transition">
                <a href={art.url} target="_blank" rel="noopener noreferrer" className="flex items-start justify-between">
                  <span>{art.title}</span>
                  <ExternalLink className="h-3.5 w-3.5 ml-2 mt-1 flex-shrink-0 text-gray-500" />
                </a>
              </h3>

              <p className="mt-1.5 text-xs text-gray-400 leading-relaxed">
                {art.summary}
              </p>

              {art.relevant_symbols && art.relevant_symbols.length > 0 && (
                <div className="mt-2.5 flex items-center space-x-1.5">
                  <Tag className="h-3 w-3 text-gray-500" />
                  <span className="text-[10px] text-gray-500">Mentions:</span>
                  <div className="flex flex-wrap gap-1">
                    {art.relevant_symbols.map((sym: string) => (
                      <span key={sym} className="rounded bg-gray-900 border border-gray-800 px-1.5 py-0.2 text-[10px] font-mono text-gray-300 font-semibold">
                        {sym}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

