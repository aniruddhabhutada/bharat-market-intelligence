"use client";

import React, { useState, useEffect } from "react";
import {
  Activity,
  ShieldCheck,
  Clock,
  RefreshCw,
  Menu,
  Search,
  Sun,
  Moon,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  X
} from "lucide-react";
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
  const [showMobileSearch, setShowMobileSearch] = useState(false);

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
      setShowMobileSearch(false);
    }
  };

  const isOpen = marketStatus?.is_open;
  const statusLabel = marketStatus?.status || "CONNECTED";

  // Market Pulse Ticker Items
  const tickerItems = [
    { label: "NIFTY 50", val: "25,144.30", chg: "-0.61%", isUp: false, sym: "NIFTY" },
    { label: "BANK NIFTY", val: "61,034.10", chg: "-0.79%", isUp: false, sym: "BANKNIFTY" },
    { label: "BSE SENSEX", val: "81,592.45", chg: "-0.39%", isUp: false, sym: "SENSEX" },
    { label: "INDIA VIX", val: "15.50", chg: "-6.74%", isUp: true, sym: "INDIAVIX" },
    { label: "GIFT NIFTY", val: "25,180.00", chg: "+0.14%", isUp: true },
    { label: "BRENT CRUDE", val: "$74.20", chg: "-0.35%", isUp: false },
    { label: "USD/INR", val: "₹84.38", chg: "+0.02%", isUp: true },
    { label: "DII NET", val: "+₹2,664 Cr", chg: "BUYING", isUp: true },
    { label: "FII NET", val: "-₹2,453 Cr", chg: "SELLING", isUp: false }
  ];

  return (
    <header className="sticky top-0 z-30 w-full border-b border-gray-800/80 bg-[#0B0F19]/95 backdrop-blur-md">
      {/* Tier 1: Main Header Bar */}
      <div className="flex h-14 items-center justify-between px-3 sm:px-4">
        {/* Left: Mobile Drawer Button & Brand Emblem */}
        <div className="flex items-center space-x-2.5 sm:space-x-3">
          <button
            onClick={onToggleMobileMenu}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-800 bg-gray-900/80 text-gray-400 hover:bg-gray-800 hover:text-white md:hidden active:scale-95 transition"
            aria-label="Open Navigation Menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center space-x-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 font-bold text-white text-xs shadow-md shadow-blue-500/20">
              भ
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-1">
                <span className="text-xs sm:text-sm font-extrabold tracking-wider text-blue-500">BHARAT</span>
                <span className="text-[10px] sm:text-xs font-semibold text-gray-300">MARKET INTEL</span>
              </div>
              <span className="text-[8px] sm:text-[9px] text-gray-500 font-medium -mt-0.5">
                by <strong className="text-gray-400 font-semibold">Aniruddha Bhutada</strong>
              </span>
            </div>
          </div>

          {/* Live IST Clock Badge */}
          <div className="hidden items-center space-x-1.5 rounded-md border border-gray-800/80 bg-gray-900/60 px-2 py-1 text-[11px] text-gray-300 lg:flex">
            <Clock className="h-3.5 w-3.5 text-blue-400" />
            <span className="font-mono">{timeStr || "09:15:00 IST"}</span>
          </div>
        </div>

        {/* Middle: Desktop Search Bar */}
        <form onSubmit={handleSearchSubmit} className="hidden max-w-xs flex-1 px-4 md:block">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-500" />
            <input
              type="text"
              placeholder="Search stock symbol (e.g. RELIANCE, TCS)..."
              value={searchSymbol}
              onChange={(e) => setSearchSymbol(e.target.value)}
              className="w-full rounded-lg border border-gray-800 bg-gray-900/80 py-1.5 pl-8 pr-12 text-xs text-gray-200 placeholder-gray-500 transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <span className="absolute right-2.5 top-2 rounded bg-gray-800 px-1.5 py-0.5 text-[9px] font-mono text-gray-400">
              ↵
            </span>
          </div>
        </form>

        {/* Right: Actions, Status & Theme */}
        <div className="flex items-center space-x-1.5 sm:space-x-2.5">
          {/* Mobile Search Toggle */}
          <button
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-800 bg-gray-900/80 text-gray-400 hover:text-white md:hidden"
            aria-label="Search"
          >
            {showMobileSearch ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
          </button>

          {/* Market Status Pill */}
          <div
            className={`flex items-center space-x-1.5 rounded-full px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-[11px] font-semibold tracking-wide ${
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
            className="flex items-center space-x-1.5 rounded-md border border-gray-800 bg-gray-900/90 px-2 py-1 text-xs text-gray-300 transition hover:border-gray-700 hover:text-white"
            title="Open Data Quality & Verification Panel"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span className="hidden xl:inline text-[11px]">DATA QUALITY</span>
            <span className="rounded bg-emerald-900/50 px-1 py-0.2 text-[9px] font-bold text-emerald-300">
              100%
            </span>
          </button>

          {/* Light / Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-800 bg-gray-900/90 text-gray-300 transition hover:border-gray-700 hover:text-white active:scale-95"
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 text-amber-400 transition-transform hover:rotate-45" />
            ) : (
              <Moon className="h-4 w-4 text-blue-500 transition-transform hover:-rotate-12" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search Input Drawer (Visible when toggled) */}
      {showMobileSearch && (
        <form onSubmit={handleSearchSubmit} className="border-t border-gray-800/80 bg-gray-950 p-2.5 md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            <input
              type="text"
              autoFocus
              placeholder="Search Indian stock (e.g. RELIANCE, TCS)..."
              value={searchSymbol}
              onChange={(e) => setSearchSymbol(e.target.value)}
              className="w-full rounded-lg border border-gray-700 bg-gray-900 py-2 pl-9 pr-3 text-xs text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </form>
      )}

      {/* Tier 2: Live Market Pulse Ticker Tape (Swipeable on Mobile) */}
      <div className="flex h-8 w-full items-center overflow-x-auto border-t border-gray-800/60 bg-gray-950/60 px-2 text-[11px] no-scrollbar">
        <div className="flex items-center space-x-4 shrink-0 pr-4">
          <span className="flex items-center space-x-1 text-[10px] font-bold uppercase tracking-wider text-blue-400">
            <Activity className="h-3 w-3 animate-pulse" />
            <span>PULSE:</span>
          </span>

          {tickerItems.map((item, idx) => (
            <button
              key={idx}
              onClick={() => item.sym && onSelectStock(item.sym)}
              className="group flex items-center space-x-1.5 rounded px-1.5 py-0.5 transition hover:bg-gray-800/60"
            >
              <span className="font-semibold text-gray-400 group-hover:text-gray-200">
                {item.label}
              </span>
              <span className="font-mono font-medium text-gray-200">
                {item.val}
              </span>
              <span
                className={`flex items-center font-mono font-semibold ${
                  item.isUp ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {item.isUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {item.chg}
              </span>
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
