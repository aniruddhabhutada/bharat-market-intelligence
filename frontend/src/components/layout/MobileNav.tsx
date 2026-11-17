"use client";

import React, { useState } from "react";
import {
  House,
  ChartNoAxesCombined,
  Search,
  Bookmark,
  Menu,
  X,
  GraduationCap,
  BarChart3,
  ChartLine,
  Scale,
  PieChart,
  TrendingUp,
  Newspaper,
  Wallet,
  FileText,
  Settings,
  LucideIcon
} from "lucide-react";
import { ViewType } from "./Sidebar";

interface MobileNavProps {
  currentView: ViewType;
  onSelectView: (view: ViewType) => void;
  onOpenDrawer: () => void;
}

/* ─── Bottom tab bar items ───────────────────────────────────────────────── */
const PRIMARY_MOBILE_TABS: { id: ViewType; label: string; icon: LucideIcon }[] = [
  { id: "dashboard", label: "Home",      icon: House },
  { id: "live",      label: "Market",    icon: ChartNoAxesCombined },
  { id: "screener",  label: "Explore",   icon: Search },
  { id: "watchlist", label: "Watchlist", icon: Bookmark },
];

/* ─── Bottom sheet "More" drawer items ──────────────────────────────────── */
interface MoreItem {
  id: ViewType;
  label: string;
  sub: string;
  icon: LucideIcon;
}

const MORE_NAV: MoreItem[] = [
  { id: "learn",     label: "Learn Investing",     sub: "Plain-English concepts & terms", icon: GraduationCap },
  { id: "stock",     label: "Stock Analysis",      sub: "In-depth equity dossiers",       icon: BarChart3 },
  { id: "indices",   label: "Technical Analysis",  sub: "Support, resistance & trends",   icon: ChartLine },
  { id: "fiidii",    label: "FII / DII Flows",     sub: "Institutional cash movements",   icon: TrendingUp },
  { id: "sectors",   label: "Sector Heatmap",      sub: "Industry rotation metrics",      icon: PieChart },
  { id: "news",      label: "Market News",         sub: "Verified news & SEBI filings",   icon: Newspaper },
  { id: "portfolio", label: "Portfolio Research",  sub: "Track simulated equity holdings",icon: Wallet },
  { id: "reports",   label: "Market Reports",      sub: "Morning and evening briefs",     icon: FileText },
  { id: "settings",  label: "Settings",            sub: "Preferences & API config",       icon: Settings },
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

  const isMoreActive = MORE_NAV.some((item) => item.id === currentView);

  return (
    <>
      {/* ── Bottom Tab Bar ─────────────────────────────────────────────── */}
      <div className="fixed bottom-0 inset-x-0 z-40 md:hidden">
        <nav className="flex h-16 items-center justify-around border-t border-[#E5EAF2] dark:border-[#1F2E47] bg-white/95 dark:bg-[#131C2E]/95 backdrop-blur-md px-1 safe-area-inset-bottom">
          {PRIMARY_MOBILE_TABS.map(({ id, label, icon: Icon }) => {
            const isActive = currentView === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => handleSelect(id)}
                className="relative flex min-h-[48px] flex-1 flex-col items-center justify-center gap-0.5 rounded-xl py-1 text-[11px] font-semibold transition-all active:scale-95"
              >
                <div
                  className={`flex h-8 w-10 items-center justify-center rounded-full transition-colors ${
                    isActive
                      ? "bg-[#EEF3FC] dark:bg-[#1A2844] text-[#315EFB] dark:text-[#4D74FB]"
                      : "text-[#667085] dark:text-[#97A3B6]"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span
                  className={`text-[10px] tracking-tight ${
                    isActive
                      ? "font-bold text-[#315EFB] dark:text-[#4D74FB]"
                      : "text-[#667085] dark:text-[#97A3B6]"
                  }`}
                >
                  {label}
                </span>
              </button>
            );
          })}

          {/* More Button */}
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="relative flex min-h-[48px] flex-1 flex-col items-center justify-center gap-0.5 rounded-xl py-1 text-[11px] font-semibold transition-all active:scale-95"
          >
            <div
              className={`flex h-8 w-10 items-center justify-center rounded-full transition-colors ${
                isMoreActive
                  ? "bg-[#EEF3FC] dark:bg-[#1A2844] text-[#315EFB] dark:text-[#4D74FB]"
                  : "text-[#667085] dark:text-[#97A3B6]"
              }`}
            >
              <Menu className="h-5 w-5" />
            </div>
            <span
              className={`text-[10px] tracking-tight ${
                isMoreActive
                  ? "font-bold text-[#315EFB] dark:text-[#4D74FB]"
                  : "text-[#667085] dark:text-[#97A3B6]"
              }`}
            >
              More
            </span>
          </button>
        </nav>
      </div>

      {/* ── Slide-up "More" Drawer ────────────────────────────────────────── */}
      {drawerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex flex-col justify-end bg-[#172B4D]/50 backdrop-blur-xs md:hidden"
        >
          {/* Backdrop click area */}
          <div
            className="flex-1"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close drawer"
          />

          {/* Drawer content */}
          <div className="rounded-t-2xl border-t border-[#E5EAF2] dark:border-[#1F2E47] bg-white dark:bg-[#131C2E] p-4 shadow-2xl max-h-[75vh] flex flex-col animate-in slide-in-from-bottom-6 duration-200">
            {/* Header with pill handle */}
            <div className="flex flex-col items-center pb-3 border-b border-[#E5EAF2] dark:border-[#1F2E47] relative">
              <div className="h-1 w-10 rounded-full bg-[#E5EAF2] dark:bg-[#1F2E47] mb-2" />
              <div className="w-full flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#172B4D] dark:text-[#F4F6FB] tracking-tight">
                    Research &amp; Tools
                  </h3>
                  <p className="text-[11px] text-[#667085] dark:text-[#97A3B6]">
                    Select a section to explore
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="rounded-lg p-1 text-[#667085] hover:text-[#172B4D] dark:hover:text-[#F4F6FB]"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Scrollable list */}
            <div className="overflow-y-auto py-2 space-y-1 divide-y divide-[#E5EAF2]/60 dark:divide-[#1F2E47]/60 no-scrollbar">
              {MORE_NAV.map(({ id, label, sub, icon: Icon }) => {
                const isActive = currentView === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => handleSelect(id)}
                    className={`w-full flex items-center space-x-3 px-3 py-3 text-left transition rounded-xl ${
                      isActive
                        ? "bg-[#EEF3FC] dark:bg-[#1A2844] text-[#315EFB] dark:text-[#4D74FB]"
                        : "hover:bg-[#F5F7FB] dark:hover:bg-[#19253C] text-[#172B4D] dark:text-[#F4F6FB]"
                    }`}
                  >
                    <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-lg bg-[#F5F7FB] dark:bg-[#1A2844] text-[#315EFB] dark:text-[#4D74FB]">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className={`text-xs font-semibold ${isActive ? "text-[#315EFB] dark:text-[#4D74FB]" : ""}`}>
                        {label}
                      </div>
                      <div className="text-[11px] text-[#667085] dark:text-[#97A3B6] truncate">
                        {sub}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
