"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  TrendingUp,
  Search,
  Star,
  Newspaper,
  ChevronDown,
  ChevronUp,
  BarChart2,
  Globe,
  SunMedium,
  Landmark,
  PieChart,
  FolderOpen,
  Briefcase,
  Settings,
} from "lucide-react";
import { useExperienceMode } from "@/context/ExperienceModeContext";

export type ViewType =
  | "dashboard"
  | "premarket"
  | "live"
  | "indices"
  | "fiidii"
  | "sectors"
  | "screener"
  | "stock"
  | "news"
  | "watchlist"
  | "portfolio"
  | "reports"
  | "settings"
  | "learn";

interface SidebarProps {
  currentView: ViewType;
  onSelectView: (view: ViewType) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

/* ─── Primary nav (always visible) ──────────────────────────────────────── */
const PRIMARY_NAV: { id: ViewType; emoji: string; label: string; sub: string }[] = [
  { id: "dashboard",  emoji: "🏠", label: "Home",           sub: "Market Overview" },
  { id: "live",       emoji: "🌅", label: "Market Today",   sub: "Live prices & trends" },
  { id: "screener",   emoji: "🔍", label: "Explore Stocks", sub: "Find & Compare Stocks" },
  { id: "watchlist",  emoji: "⭐", label: "My Watchlist",   sub: "Your Saved Stocks" },
  { id: "learn",      emoji: "💡", label: "Learn",          sub: "Investing in simple words" },
];

/* ─── Research tools (collapsible) ──────────────────────────────────────── */
interface ResearchItem {
  id: ViewType;
  emoji: string;
  label: string;
  sub?: string;
}

const RESEARCH_NAV: ResearchItem[] = [
  { id: "stock",     emoji: "📊", label: "Stock Research",      sub: "Fundamentals & technicals" },
  { id: "indices",   emoji: "🌐", label: "Market Indices",       sub: "NIFTY 50, SENSEX, VIX" },
  { id: "premarket", emoji: "🌅", label: "Pre-Market Intel",     sub: "Opening setups & global cues" },
  { id: "fiidii",    emoji: "📈", label: "FII / DII Flows",      sub: "Institutional investor activity" },
  { id: "sectors",   emoji: "🗂️", label: "Sector Analysis",     sub: "16 sector rotation radar" },
  { id: "news",      emoji: "📰", label: "Market News",          sub: "Verified news & filings" },
  { id: "reports",   emoji: "📁", label: "Market Reports",       sub: "Morning & evening briefs" },
  { id: "portfolio", emoji: "💼", label: "Portfolio Research",   sub: "Holdings & performance" },
  { id: "settings",  emoji: "⚙️", label: "Settings",             sub: "Preferences & API config" },
];

/* ─── NavButton component ────────────────────────────────────────────────── */
interface NavButtonProps {
  emoji: string;
  label: string;
  sub?: string;
  isActive: boolean;
  onClick: () => void;
  compact?: boolean;
}

const NavButton: React.FC<NavButtonProps> = ({ emoji, label, sub, isActive, onClick, compact }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-3 rounded-xl text-left transition-all group ${
      compact ? "py-2" : "py-3"
    } ${
      isActive
        ? "bg-blue-50 dark:bg-blue-500/15 ring-1 ring-blue-100 dark:ring-blue-500/20"
        : "hover:bg-gray-50 dark:hover:bg-white/[0.04]"
    }`}
  >
    <div
      className={`flex-shrink-0 flex items-center justify-center rounded-lg text-base ${
        compact ? "h-8 w-8" : "h-9 w-9"
      } ${
        isActive
          ? "bg-blue-100 dark:bg-blue-500/20"
          : "bg-gray-100 dark:bg-white/[0.06] group-hover:bg-blue-50 dark:group-hover:bg-blue-500/10"
      }`}
    >
      {emoji}
    </div>
    <div className="min-w-0">
      <div
        className={`font-semibold truncate ${compact ? "text-xs" : "text-sm"} ${
          isActive
            ? "text-blue-700 dark:text-blue-300"
            : "text-gray-800 dark:text-gray-100"
        }`}
      >
        {label}
      </div>
      {sub && !compact && (
        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{sub}</div>
      )}
    </div>
  </button>
);

/* ─── Sidebar ────────────────────────────────────────────────────────────── */
export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  isOpenMobile,
  onCloseMobile,
}) => {
  const { mode, isBeginner } = useExperienceMode();
  // Beginners start with research tools collapsed; advanced users see them open
  const [researchOpen, setResearchOpen] = useState(!isBeginner);

  const handleSelect = (view: ViewType) => {
    onSelectView(view);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0B0F19] transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
          isOpenMobile ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo Header */}
        <div className="flex h-14 items-center justify-between border-b border-gray-200 dark:border-gray-800 px-4">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 font-bold text-white text-xs shadow-md shadow-blue-500/20">
              भ
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-xs font-extrabold tracking-wide text-blue-600 dark:text-blue-400">
                BHARAT INTEL
              </span>
              <span className="text-[9px] text-gray-400 dark:text-gray-500">
                Market Intelligence
              </span>
            </div>
          </div>
        </div>

        {/* Experience Mode Badge */}
        <div className="px-4 py-2.5 border-b border-gray-100 dark:border-gray-800/60">
          {isBeginner ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Simple View 🟢
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 px-2.5 py-1 text-[11px] font-semibold text-blue-700 dark:text-blue-300">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
              Advanced View 🔵
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
          {/* Primary nav */}
          {PRIMARY_NAV.map((item) => (
            <NavButton
              key={item.id}
              emoji={item.emoji}
              label={item.label}
              sub={item.sub}
              isActive={currentView === item.id}
              onClick={() => handleSelect(item.id)}
            />
          ))}

          {/* Research tools collapsible section */}
          <div className="pt-2">
            <button
              onClick={() => setResearchOpen((o) => !o)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-all"
            >
              <span>Research Tools</span>
              {researchOpen ? (
                <ChevronUp className="h-3.5 w-3.5" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" />
              )}
            </button>

            {researchOpen && (
              <div className="mt-0.5 space-y-0.5">
                {RESEARCH_NAV.map((item) => (
                  <NavButton
                    key={item.id}
                    emoji={item.emoji}
                    label={item.label}
                    sub={item.sub}
                    isActive={currentView === item.id}
                    onClick={() => handleSelect(item.id)}
                    compact
                  />
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-800 p-3">
          <div className="rounded-lg bg-gray-50 dark:bg-gray-900/80 p-2.5 text-[10px] text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-800/60">
            <div className="flex items-center space-x-1 font-medium text-gray-700 dark:text-gray-300">
              <span>Made with</span>
              <span className="text-red-500">❤️</span>
              <span>by</span>
              <strong className="text-blue-600 dark:text-blue-400 font-semibold">
                Aniruddha Bhutada
              </strong>
            </div>
            <p className="mt-1 text-[9px] text-gray-400 dark:text-gray-500">
              100% Free &amp; Open Indian Equity Terminal
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
