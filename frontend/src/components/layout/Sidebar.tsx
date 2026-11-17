"use client";

import React, { useState } from "react";
import {
  Home,
  ChartNoAxesCombined,
  Search,
  Bookmark,
  GraduationCap,
  BarChart3,
  SlidersHorizontal,
  ChartLine,
  Scale,
  PieChart,
  TrendingUp,
  FileText,
  Wallet,
  BookmarkCheck,
  Settings,
  CircleHelp,
  ChevronDown,
  ChevronUp,
  Heart,
  LucideIcon
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
  onOpenHelp?: () => void;
}

interface NavItem {
  id: ViewType;
  label: string;
  sub?: string;
  icon: LucideIcon;
}

/* ─── MAIN Section ───────────────────────────────────────────────────────── */
const MAIN_NAV: NavItem[] = [
  { id: "dashboard",  label: "Home",           sub: "Market overview",        icon: Home },
  { id: "live",       label: "Market Today",   sub: "Live prices & trends",   icon: ChartNoAxesCombined },
  { id: "screener",   label: "Explore Stocks", sub: "Find & compare stocks",  icon: Search },
  { id: "watchlist",  label: "My Watchlist",   sub: "Saved stock watchlist",  icon: Bookmark },
  { id: "learn",      label: "Learn",          sub: "Plain-English guide",    icon: GraduationCap },
];

/* ─── RESEARCH Section ───────────────────────────────────────────────────── */
const RESEARCH_NAV: NavItem[] = [
  { id: "stock",     label: "Stock Analysis",      sub: "In-depth equity dossier",    icon: BarChart3 },
  { id: "screener",  label: "Stock Screener",      sub: "Quantitative filters",       icon: SlidersHorizontal },
  { id: "indices",   label: "Technical Analysis",  sub: "Support, resistance & trend",icon: ChartLine },
  { id: "stock",     label: "Fundamental Analysis",sub: "Financial health & valuation",icon: Scale },
  { id: "sectors",   label: "Sector Analysis",     sub: "Sector rotation heatmap",    icon: PieChart },
  { id: "fiidii",    label: "FII/DII Analysis",    sub: "Institutional cash flows",   icon: TrendingUp },
  { id: "reports",   label: "Market Reports",      sub: "Morning & closing dossiers", icon: FileText },
];

/* ─── PERSONAL Section ───────────────────────────────────────────────────── */
const PERSONAL_NAV: (NavItem & { action?: "help" })[] = [
  { id: "portfolio", label: "My Portfolio",    sub: "Holdings & performance",  icon: Wallet },
  { id: "watchlist", label: "Saved Research",   sub: "Bookmarked analysis",     icon: BookmarkCheck },
  { id: "settings",  label: "Settings",         sub: "Preferences & API keys",  icon: Settings },
];

interface NavButtonProps {
  icon: LucideIcon;
  label: string;
  sub?: string;
  isActive: boolean;
  onClick: () => void;
  compact?: boolean;
}

const NavButton: React.FC<NavButtonProps> = ({
  icon: Icon,
  label,
  sub,
  isActive,
  onClick,
  compact
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-3 rounded-xl text-left transition-all group ${
      compact ? "py-2" : "py-2.5"
    } ${
      isActive
        ? "bg-[#EEF3FC] dark:bg-[#1A2844] text-[#315EFB] dark:text-[#4D74FB] font-semibold"
        : "text-[#172B4D] dark:text-[#F4F6FB] hover:bg-[#F5F7FB] dark:hover:bg-[#19253C]"
    }`}
  >
    <div
      className={`flex-shrink-0 flex items-center justify-center rounded-lg transition-colors ${
        compact ? "h-7 w-7" : "h-8 w-8"
      } ${
        isActive
          ? "bg-[#315EFB]/10 dark:bg-[#4D74FB]/20 text-[#315EFB] dark:text-[#4D74FB]"
          : "text-[#667085] dark:text-[#97A3B6] group-hover:text-[#315EFB] dark:group-hover:text-[#4D74FB] group-hover:bg-[#EEF3FC] dark:group-hover:bg-[#1A2844]"
      }`}
    >
      <Icon className={compact ? "h-4 w-4" : "h-4 w-4"} />
    </div>

    <div className="min-w-0 flex-1">
      <div className={`truncate tracking-tight ${compact ? "text-xs" : "text-sm"} ${isActive ? "font-semibold" : "font-medium"}`}>
        {label}
      </div>
      {sub && !compact && (
        <div className="text-[11px] text-[#667085] dark:text-[#97A3B6] truncate">
          {sub}
        </div>
      )}
    </div>
  </button>
);

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  isOpenMobile,
  onCloseMobile,
  onOpenHelp,
}) => {
  const { isBeginner } = useExperienceMode();
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
          className="fixed inset-0 z-40 bg-[#172B4D]/40 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-[#E5EAF2] dark:border-[#1F2E47] bg-white dark:bg-[#131C2E] transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
          isOpenMobile ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-14 items-center justify-between border-b border-[#E5EAF2] dark:border-[#1F2E47] px-4">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#315EFB] font-bold text-white text-sm shadow-sm">
              भ
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-xs font-bold tracking-wider text-[#172B4D] dark:text-[#F4F6FB]">
                BHARAT MARKET
              </span>
              <span className="text-[10px] font-medium text-[#667085] dark:text-[#97A3B6]">
                Intelligence Platform
              </span>
            </div>
          </div>
        </div>

        {/* Experience Mode State Indicator */}
        <div className="px-4 py-2 border-b border-[#E5EAF2] dark:border-[#1F2E47] bg-[#F5F7FB] dark:bg-[#0B111E]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#667085] dark:text-[#97A3B6]">
              Experience Mode:
            </span>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide ${
                isBeginner
                  ? "bg-[#E8F7F3] text-[#14866D] border border-[#B3E3D7]"
                  : "bg-[#EEF3FC] text-[#315EFB] border border-[#CAD9FB]"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isBeginner ? "bg-[#14866D]" : "bg-[#315EFB]"
                }`}
              />
              {isBeginner ? "Simple View" : "Advanced View"}
            </span>
          </div>
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-4 no-scrollbar">
          {/* MAIN */}
          <div>
            <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#667085] dark:text-[#97A3B6]">
              Main
            </div>
            <div className="space-y-0.5">
              {MAIN_NAV.map((item) => (
                <NavButton
                  key={item.id}
                  icon={item.icon}
                  label={item.label}
                  sub={item.sub}
                  isActive={currentView === item.id}
                  onClick={() => handleSelect(item.id)}
                />
              ))}
            </div>
          </div>

          {/* RESEARCH (Collapsible) */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setResearchOpen((o) => !o)}
              className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider text-[#667085] dark:text-[#97A3B6] hover:bg-[#F5F7FB] dark:hover:bg-[#19253C] transition-colors"
            >
              <span>Research</span>
              {researchOpen ? (
                <ChevronUp className="h-3.5 w-3.5" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" />
              )}
            </button>

            {researchOpen && (
              <div className="mt-1 space-y-0.5">
                {RESEARCH_NAV.map((item, idx) => (
                  <NavButton
                    key={`${item.id}-${idx}`}
                    icon={item.icon}
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

          {/* PERSONAL */}
          <div className="pt-1">
            <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#667085] dark:text-[#97A3B6]">
              Personal
            </div>
            <div className="space-y-0.5">
              {PERSONAL_NAV.map((item) => (
                <NavButton
                  key={item.id}
                  icon={item.icon}
                  label={item.label}
                  sub={item.sub}
                  isActive={currentView === item.id}
                  onClick={() => handleSelect(item.id)}
                  compact
                />
              ))}

              {/* Help button */}
              <button
                type="button"
                onClick={() => {
                  if (onOpenHelp) onOpenHelp();
                  else handleSelect("learn");
                }}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-left transition-all text-[#172B4D] dark:text-[#F4F6FB] hover:bg-[#F5F7FB] dark:hover:bg-[#19253C] group"
              >
                <div className="flex-shrink-0 flex items-center justify-center rounded-lg h-7 w-7 text-[#667085] dark:text-[#97A3B6] group-hover:text-[#315EFB] dark:group-hover:text-[#4D74FB] group-hover:bg-[#EEF3FC] dark:group-hover:bg-[#1A2844] transition-colors">
                  <CircleHelp className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate tracking-tight text-xs font-medium">
                    Help &amp; Documentation
                  </div>
                </div>
              </button>
            </div>
          </div>
        </nav>

        {/* Footer Attribution */}
        <div className="border-t border-[#E5EAF2] dark:border-[#1F2E47] p-3">
          <div className="rounded-xl bg-[#F5F7FB] dark:bg-[#0B111E] p-2.5 text-[11px] text-[#667085] dark:text-[#97A3B6] border border-[#E5EAF2] dark:border-[#1F2E47]">
            <div className="flex items-center space-x-1 font-medium text-[#172B4D] dark:text-[#F4F6FB]">
              <span>Made with</span>
              <Heart className="h-3 w-3 text-red-500 fill-current inline mx-0.5" />
              <span>by</span>
              <strong className="text-[#315EFB] dark:text-[#4D74FB] font-semibold">
                Aniruddha Bhutada
              </strong>
            </div>
            <p className="mt-0.5 text-[10px] text-[#667085] dark:text-[#97A3B6]">
              Indian Equity Research Assistant
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
