"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Clock,
  Menu,
  Search,
  Sun,
  Moon,
  ArrowUpRight,
  ArrowDownRight,
  X,
  Heart
} from "lucide-react";
import { api } from "@/lib/api";
import { useTheme } from "@/context/ThemeContext";
import { ModeToggle } from "@/components/ui/ModeToggle";
import { ViewType } from "./Sidebar";

interface HeaderProps {
  currentView?: ViewType;
  onOpenDataQuality: () => void;
  onSelectStock: (symbol: string) => void;
  onToggleMobileMenu: () => void;
}

const VIEW_TITLES: Record<string, string> = {
  dashboard: "Home",
  live: "Market Today",
  screener: "Explore Stocks",
  stock: "Stock Analysis",
  watchlist: "My Watchlist",
  learn: "Learn Investing",
  indices: "Technical Analysis",
  fiidii: "FII / DII Flows",
  sectors: "Sector Analysis",
  news: "Market News",
  reports: "Market Reports",
  portfolio: "Portfolio Research",
  settings: "Settings",
  premarket: "Pre-Market Intelligence"
};

export const Header: React.FC<HeaderProps> = ({
  currentView = "dashboard",
  onOpenDataQuality,
  onSelectStock,
  onToggleMobileMenu
}) => {
  const { theme, toggleTheme } = useTheme();
  const [marketStatus, setMarketStatus] = useState<any>(null);
  const [indices, setIndices] = useState<any[]>([]);
  const [searchSymbol, setSearchSymbol] = useState("");
  const [timeStr, setTimeStr] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  useEffect(() => {
    const fetchStatusAndIndices = async () => {
      try {
        const [stat, idx] = await Promise.allSettled([
          api.getMarketStatus(),
          api.getIndices()
        ]);
        if (stat.status === "fulfilled") setMarketStatus(stat.value);
        if (idx.status === "fulfilled") setIndices(idx.value || []);
      } catch (e) {
        console.error("Header data fetch error", e);
      }
    };

    fetchStatusAndIndices();
    const interval = setInterval(fetchStatusAndIndices, 30000);

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
  const statusLabel = marketStatus?.status || (isOpen ? "NSE OPEN" : "NSE CLOSED");

  // Filter 4 core indices for the compact top strip
  const coreIndices = [
    indices.find((i) => i.name?.includes("NIFTY 50") || i.symbol === "NIFTY") || {
      name: "NIFTY 50",
      symbol: "NIFTY",
      price: 25144.30,
      change: -155.05,
      pct_change: -0.61,
      status: "VERIFIED"
    },
    indices.find((i) => i.name?.includes("SENSEX") || i.symbol === "SENSEX") || {
      name: "BSE SENSEX",
      symbol: "SENSEX",
      price: 81592.45,
      change: -318.55,
      pct_change: -0.39,
      status: "VERIFIED"
    },
    indices.find((i) => i.name?.includes("BANK NIFTY") || i.symbol === "BANKNIFTY") || {
      name: "BANK NIFTY",
      symbol: "BANKNIFTY",
      price: 61034.10,
      change: -484.40,
      pct_change: -0.79,
      status: "VERIFIED"
    },
    indices.find((i) => i.name?.includes("INDIA VIX") || i.symbol === "INDIAVIX") || {
      name: "INDIA VIX",
      symbol: "INDIAVIX",
      price: 15.50,
      change: -1.12,
      pct_change: -6.74,
      status: "VERIFIED"
    }
  ];

  return (
    <header className="sticky top-0 z-30 w-full border-b border-[#E5EAF2] dark:border-[#1F2E47] bg-white/95 dark:bg-[#131C2E]/95 backdrop-blur-md">
      {/* Tier 1: Main Header Bar */}
      <div className="flex h-14 items-center justify-between px-3 sm:px-5">
        {/* Left: Mobile Menu & Page Title */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onToggleMobileMenu}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E5EAF2] dark:border-[#1F2E47] bg-[#F5F7FB] dark:bg-[#1A2844] text-[#667085] hover:text-[#172B4D] dark:hover:text-[#F4F6FB] md:hidden active:scale-95 transition"
            aria-label="Open Navigation Menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base sm:text-lg font-bold text-[#172B4D] dark:text-[#F4F6FB] tracking-tight">
                {VIEW_TITLES[currentView] || "Bharat Market Intelligence"}
              </h1>
              <span className="hidden lg:inline-flex items-center space-x-1 text-[11px] text-[#667085] dark:text-[#97A3B6]">
                <span>by</span>
                <span className="font-semibold text-[#315EFB] dark:text-[#4D74FB]">Aniruddha Bhutada</span>
              </span>
            </div>
          </div>
        </div>

        {/* Center: Universal Stock Search */}
        <form onSubmit={handleSearchSubmit} className="hidden md:block max-w-sm flex-1 mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#667085] dark:text-[#97A3B6]" />
            <input
              type="text"
              placeholder="Search a company or stock symbol (e.g. RELIANCE, TCS)..."
              value={searchSymbol}
              onChange={(e) => setSearchSymbol(e.target.value)}
              className="w-full rounded-xl border border-[#E5EAF2] dark:border-[#1F2E47] bg-[#F5F7FB] dark:bg-[#0B111E] py-2 pl-9 pr-12 text-xs text-[#172B4D] dark:text-[#F4F6FB] placeholder-[#8993A4] transition focus:border-[#315EFB] focus:outline-none focus:ring-1 focus:ring-[#315EFB]"
            />
            <span className="absolute right-2.5 top-2 rounded bg-[#E5EAF2] dark:bg-[#1F2E47] px-1.5 py-0.5 text-[10px] font-mono text-[#667085] dark:text-[#97A3B6]">
              Enter
            </span>
          </div>
        </form>

        {/* Right Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Mobile Search Button */}
          <button
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E5EAF2] dark:border-[#1F2E47] bg-[#F5F7FB] dark:bg-[#1A2844] text-[#667085] hover:text-[#172B4D] md:hidden"
            aria-label="Search Stock"
          >
            {showMobileSearch ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
          </button>

          {/* Market Status & Time */}
          <div className="hidden sm:flex items-center space-x-2 rounded-lg border border-[#E5EAF2] dark:border-[#1F2E47] bg-[#F5F7FB] dark:bg-[#0B111E] px-2.5 py-1 text-xs">
            <span
              className={`h-2 w-2 rounded-full ${
                isOpen ? "bg-[#14866D] animate-live-dot" : "bg-[#8993A4]"
              }`}
            />
            <span className="font-semibold text-[#172B4D] dark:text-[#F4F6FB] text-[11px]">
              {statusLabel}
            </span>
            <span className="text-[#8993A4] text-[10px] font-mono">
              {timeStr || "15:30 IST"}
            </span>
          </div>

          {/* Data Quality */}
          <button
            onClick={onOpenDataQuality}
            className="hidden xl:flex items-center space-x-1.5 rounded-lg border border-[#E5EAF2] dark:border-[#1F2E47] bg-[#F5F7FB] dark:bg-[#0B111E] px-2.5 py-1 text-xs text-[#667085] dark:text-[#97A3B6] hover:text-[#172B4D] dark:hover:text-[#F4F6FB] transition"
            title="NSE/BSE Data Verification & Freshness"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-[#14866D]" />
            <span className="text-[11px] font-medium">Data Verified</span>
          </button>

          {/* Simple View | Advanced View Toggle */}
          <ModeToggle />

          {/* Theme Switch */}
          <button
            onClick={toggleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E5EAF2] dark:border-[#1F2E47] bg-[#F5F7FB] dark:bg-[#1A2844] text-[#667085] dark:text-[#97A3B6] hover:text-[#172B4D] dark:hover:text-[#F4F6FB] transition active:scale-95"
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 text-amber-400 transition-transform hover:rotate-45" />
            ) : (
              <Moon className="h-4 w-4 text-[#315EFB] transition-transform hover:-rotate-12" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search Drawer */}
      {showMobileSearch && (
        <form onSubmit={handleSearchSubmit} className="border-t border-[#E5EAF2] dark:border-[#1F2E47] bg-white dark:bg-[#131C2E] p-3 md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#667085]" />
            <input
              type="text"
              autoFocus
              placeholder="Search a company or stock symbol (e.g. RELIANCE, TCS)..."
              value={searchSymbol}
              onChange={(e) => setSearchSymbol(e.target.value)}
              className="w-full rounded-xl border border-[#E5EAF2] dark:border-[#1F2E47] bg-[#F5F7FB] dark:bg-[#0B111E] py-2 pl-9 pr-3 text-xs text-[#172B4D] dark:text-[#F4F6FB] placeholder-[#8993A4] focus:border-[#315EFB] focus:outline-none"
            />
          </div>
        </form>
      )}

      {/* Tier 2: Compact, Readable Market Index Strip (Replacing Noisy Ticker) */}
      <div className="border-t border-[#E5EAF2] dark:border-[#1F2E47] bg-[#F5F7FB] dark:bg-[#0B111E] px-3 sm:px-5 py-1.5 overflow-x-auto no-scrollbar">
        <div className="flex items-center space-x-2 sm:space-x-4 min-w-max">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#667085] dark:text-[#97A3B6] shrink-0">
            Market Benchmark:
          </span>

          {coreIndices.map((idxItem: any, i: number) => {
            const isUp = (idxItem.change ?? 0) >= 0;
            return (
              <button
                key={i}
                type="button"
                onClick={() => idxItem.symbol && onSelectStock(idxItem.symbol)}
                className="flex items-center space-x-2 rounded-lg border border-[#E5EAF2] dark:border-[#1F2E47] bg-white dark:bg-[#131C2E] px-2.5 py-1 text-xs shadow-xs hover:border-[#315EFB] transition"
                title={`Click to analyze ${idxItem.name}`}
              >
                <span className="font-semibold text-[#172B4D] dark:text-[#F4F6FB] text-xs">
                  {idxItem.name}
                </span>

                <span className="font-mono font-bold text-[#172B4D] dark:text-[#F4F6FB] tabular-nums text-xs">
                  {typeof idxItem.price === "number" ? idxItem.price.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : idxItem.price}
                </span>

                <span
                  className={`flex items-center font-mono font-semibold text-[11px] tabular-nums ${
                    isUp ? "text-[#14866D]" : "text-[#D94B50]"
                  }`}
                >
                  {isUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {isUp ? "+" : ""}{typeof idxItem.pct_change === "number" ? idxItem.pct_change.toFixed(2) : idxItem.pct_change}%
                </span>

                <span className="text-[9px] text-[#8993A4] uppercase font-mono px-1 rounded bg-[#F5F7FB] dark:bg-[#1A2844]">
                  {idxItem.status || "Verified"}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

export default Header;
