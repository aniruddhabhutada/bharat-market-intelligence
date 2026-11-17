"use client";

import React, { useState } from "react";
import {
  Home,
  TrendingUp,
  Search,
  Star,
  Menu,
  X,
  BarChart2,
  Globe,
  SunMedium,
  Landmark,
  PieChart,
  FolderOpen,
  Briefcase,
  Settings,
  Newspaper,
} from "lucide-react";
import { ViewType } from "./Sidebar";

interface MobileNavProps {
  currentView: ViewType;
  onSelectView: (view: ViewType) => void;
  onOpenDrawer: () => void;
}

/* ─── Bottom tab bar items ───────────────────────────────────────────────── */
const MOBILE_NAV = [
  { id: "dashboard" as ViewType, label: "Home",      icon: Home },
  { id: "live"      as ViewType, label: "Market",    icon: TrendingUp },
  { id: "screener"  as ViewType, label: "Stocks",    icon: Search },
  { id: "watchlist" as ViewType, label: "Watchlist", icon: Star },
];

/* ─── Bottom sheet "More" drawer items ──────────────────────────────────── */
const MORE_NAV: { id: ViewType; emoji: string; label: string; sub: string }[] = [
  { id: "learn",     emoji: "💡", label: "Learn Investing",      sub: "Plain-English concepts & terms" },
  { id: "stock",     emoji: "📊", label: "Deep Stock Analysis",  sub: "In-depth stock research" },
  { id: "indices",   emoji: "🌐", label: "Market Indices",       sub: "NIFTY, SENSEX & more" },
  { id: "premarket", emoji: "🌅", label: "Pre-Market Intel",     sub: "Before market opens" },
  { id: "fiidii",    emoji: "📈", label: "FII / DII Flows",      sub: "Institutional investor activity" },
  { id: "sectors",   emoji: "🗂️", label: "Sector Heatmap",       sub: "Sector-wise performance" },
  { id: "news",      emoji: "📰", label: "Market News",          sub: "Latest financial news" },
  { id: "portfolio", emoji: "💼", label: "Portfolio Tracker",    sub: "Your holdings & P&L" },
  { id: "reports",   emoji: "📁", label: "Research Reports",     sub: "In-depth analyst reports" },
  { id: "settings",  emoji: "⚙️", label: "Settings",             sub: "App preferences" },
];

export const MobileNav: React.FC<MobileNavProps> = ({
  currentView,
  onSelectView,
  onOpenDrawer,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleSelect = (view: ViewType) => {
    onSelectView(view);
    setDrawerOpen(false);
  };

  // Check if the current view is one shown in the bottom bar or the More drawer
  const isMoreActive = MORE_NAV.some((item) => item.id === currentView);

  return (
    <>
      {/* ── Bottom Tab Bar ─────────────────────────────────────────────── */}
      <div className="fixed bottom-0 inset-x-0 z-40 md:hidden">
        <nav className="flex h-16 items-center justify-around border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0B0F19] px-1 safe-area-inset-bottom">
          {MOBILE_NAV.map(({ id, label, icon: Icon }) => {
            const isActive = currentView === id;
            return (
              <button
                key={id}
                onClick={() => handleSelect(id)}
                className="relative flex min-h-[48px] flex-1 flex-col items-center justify-center gap-0.5 rounded-xl py-1 text-[11px] font-semibold transition-all duration-200 active:scale-95"
              >
                {/* Active pill behind icon */}
                <div
                  className={`flex h-8 w-10 items-center justify-center rounded-full transition-colors ${
                    isActive
                      ? "bg-blue-100 dark:bg-blue-500/20"
                      : "bg-transparent"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 transition-colors ${
                      isActive
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  />
                </div>
                <span
                  className={`text-[10px] font-medium ${
                    isActive
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {label}
                </span>
              </button>
            );
          })}

          {/* More button */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="relative flex min-h-[48px] flex-1 flex-col items-center justify-center gap-0.5 rounded-xl py-1 text-[11px] font-semibold transition-all duration-200 active:scale-95"
          >
            <div
              className={`flex h-8 w-10 items-center justify-center rounded-full transition-colors ${
                isMoreActive
                  ? "bg-blue-100 dark:bg-blue-500/20"
                  : "bg-transparent"
              }`}
            >
              <Menu
                className={`h-5 w-5 ${
                  isMoreActive
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              />
            </div>
            <span
              className={`text-[10px] font-medium ${
                isMoreActive
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              More
            </span>
          </button>
        </nav>
      </div>

      {/* ── Bottom Sheet Drawer ─────────────────────────────────────────── */}
      {drawerOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Sheet */}
          <div className="fixed bottom-0 inset-x-0 z-50 rounded-t-2xl bg-white dark:bg-[#0F1623] border-t border-gray-200 dark:border-gray-700 md:hidden">
            {/* Handle & header */}
            <div className="flex items-center justify-between px-4 pt-4 pb-2">
              <div className="flex flex-col">
                <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-gray-300 dark:bg-gray-600" />
                <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                  More Tools
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Research &amp; Analysis
                </span>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* More nav items */}
            <div className="px-3 pb-6 pt-1 grid grid-cols-1 gap-1 max-h-[60vh] overflow-y-auto">
              {MORE_NAV.map((item) => {
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl text-left transition-all active:scale-[0.98] ${
                      isActive
                        ? "bg-blue-50 dark:bg-blue-500/15 ring-1 ring-blue-100 dark:ring-blue-500/20"
                        : "hover:bg-gray-50 dark:hover:bg-white/[0.04]"
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-lg ${
                        isActive
                          ? "bg-blue-100 dark:bg-blue-500/20"
                          : "bg-gray-100 dark:bg-white/[0.06]"
                      }`}
                    >
                      {item.emoji}
                    </div>
                    <div>
                      <div
                        className={`text-sm font-semibold ${
                          isActive
                            ? "text-blue-700 dark:text-blue-300"
                            : "text-gray-800 dark:text-gray-100"
                        }`}
                      >
                        {item.label}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {item.sub}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </>
  );
};
