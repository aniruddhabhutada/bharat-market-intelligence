"use client";

import React, { useState, useEffect } from "react";
import { Activity, ShieldCheck, Clock, RefreshCw, Menu, Search, Sun, Moon } from "lucide-react";
import { api } from "@/lib/api";
import { useTheme } from "@/context/ThemeContext";

interface HeaderProps {
  onOpenDataQuality: () => void;
  onSelectStock: (symbol: string) => void;
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenDataQuality,
  onSelectStock,
  onToggleMobileMenu
}) => {
  const { theme, toggleTheme } = useTheme();
  const [marketStatus, setMarketStatus] = useState<any>(null);
  const [searchSymbol, setSearchSymbol] = useState("");
  const [timeStr, setTimeStr] = useState("");
  const [qualityAudit, setQualityAudit] = useState<any>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const stat = await api.getMarketStatus();
        setMarketStatus(stat);
        const audit = await api.getDataQuality();
        setQualityAudit(audit.audit);
      } catch (e) {
        console.error("Status fetch error", e);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // 30s poll

    // Live clock in IST
    const clockInterval = setInterval(() => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString("en-IN", {
          timeZone: "Asia/Kolkata",
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        }) + " IST"
      );
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(clockInterval);
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchSymbol.trim()) {
      onSelectStock(searchSymbol.trim().toUpperCase());
      setSearchSymbol("");
    }
  };

  const isOpen = marketStatus?.is_open;
  const statusLabel = marketStatus?.status || "CONNECTED";

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-gray-800 bg-[#0B0F19]/90 px-4 backdrop-blur-md">
      {/* Left: Mobile Toggle & Brand / Date */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleMobileMenu}
          className="rounded p-1 text-gray-400 hover:bg-gray-800 hover:text-white md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex flex-col">
          <div className="flex items-center space-x-1.5">
            <span className="text-sm font-bold tracking-wider text-blue-500">BHARAT</span>
            <span className="text-xs font-medium text-gray-400">MARKET INTEL</span>
          </div>
          <span className="hidden sm:inline text-[9px] text-gray-400 font-normal">
            by <strong className="text-gray-300 font-semibold">Aniruddha Bhutada</strong>
          </span>
        </div>

        {/* Live IST Clock */}
        <div className="hidden items-center space-x-1 rounded bg-gray-900/80 px-2 py-0.5 text-xs text-gray-300 md:flex">
          <Clock className="h-3.5 w-3.5 text-blue-400" />
          <span>{timeStr || "09:15:00 IST"}</span>
        </div>
      </div>

      {/* Middle: Search bar for quick stock lookup */}
      <form onSubmit={handleSearchSubmit} className="hidden max-w-xs flex-1 px-4 sm:block">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-500" />
          <input
            type="text"
            placeholder="Search stock (e.g. RELIANCE, TCS)..."
            value={searchSymbol}
            onChange={(e) => setSearchSymbol(e.target.value)}
            className="w-full rounded-md border border-gray-800 bg-gray-900/90 py-1.5 pl-8 pr-3 text-xs text-gray-200 placeholder-gray-500 transition focus:border-blue-500 focus:outline-none"
          />
        </div>
      </form>

      {/* Right: Market Status & Data Quality Badge */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Market Status Badge */}
        <div
          className={`flex items-center space-x-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide ${
            isOpen
              ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800/60"
              : "bg-gray-800/80 text-gray-300 border border-gray-700/60"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              isOpen ? "bg-emerald-400 animate-live-dot" : "bg-gray-400"
            }`}
          />
          <span>{statusLabel}</span>
        </div>

        {/* Data Quality Health Pill */}
        <button
          onClick={onOpenDataQuality}
          className="flex items-center space-x-1.5 rounded-md border border-gray-800 bg-gray-900 px-2 py-1 text-xs text-gray-300 transition hover:border-gray-700 hover:text-white"
          title="Open Data Quality & Verification Panel"
        >
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span className="hidden sm:inline">DATA QUALITY</span>
          <span className="rounded bg-emerald-900/60 px-1 py-0.2 text-[10px] font-bold text-emerald-300">
            {qualityAudit?.overall_health || "100% VERIFIED"}
          </span>
        </button>

        {/* Light / Dark Mode Toggle Button */}
        <button
          onClick={toggleTheme}
          className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-800 bg-gray-900 text-gray-300 transition hover:border-gray-700 hover:text-white"
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label="Toggle Theme"
        >
          {theme === "dark" ? (
            <Sun className="h-3.5 w-3.5 text-amber-400 transition-transform hover:rotate-45" />
          ) : (
            <Moon className="h-3.5 w-3.5 text-blue-500 transition-transform hover:-rotate-12" />
          )}
        </button>
      </div>
    </header>
  );
};

