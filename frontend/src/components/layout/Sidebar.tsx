"use client";

import React from "react";
import {
  LayoutDashboard,
  SunMedium,
  Activity,
  TrendingUp,
  Landmark,
  PieChart,
  SearchCheck,
  FileText,
  Newspaper,
  Star,
  Briefcase,
  Archive,
  Settings,
  ChevronRight
} from "lucide-react";

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
  | "settings";

interface SidebarProps {
  currentView: ViewType;
  onSelectView: (view: ViewType) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

const NAV_ITEMS: { id: ViewType; label: string; icon: any; category?: string }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, category: "Market Intelligence" },
  { id: "premarket", label: "Pre-Market", icon: SunMedium },
  { id: "live", label: "Live Market", icon: Activity },
  { id: "indices", label: "Indices", icon: TrendingUp },

  { id: "fiidii", label: "FII / DII Flows", icon: Landmark, category: "Institutional & Sectors" },
  { id: "sectors", label: "Sector Analysis", icon: PieChart },

  { id: "screener", label: "Stock Screener", icon: SearchCheck, category: "Equity Research" },
  { id: "stock", label: "Stock Research", icon: FileText },
  { id: "news", label: "News & Events", icon: Newspaper },

  { id: "watchlist", label: "Watchlist", icon: Star, category: "Personal Workstation" },
  { id: "portfolio", label: "Portfolio Tracker", icon: Briefcase },
  { id: "reports", label: "Reports Archive", icon: Archive },
  { id: "settings", label: "Settings", icon: Settings }
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  isOpenMobile,
  onCloseMobile
}) => {
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
        className={`fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r border-gray-800 bg-[#0B0F19] transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
          isOpenMobile ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Terminal Header */}
        <div className="flex h-14 items-center justify-between border-b border-gray-800 px-4">
          <div className="flex items-center space-x-2">
            <div className="h-6 w-6 rounded bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-bold text-white text-xs">
              भ
            </div>
            <span className="text-xs font-semibold tracking-wide text-gray-200">
              BHARAT INTEL
            </span>
          </div>
          <span className="rounded bg-gray-800 px-1.5 py-0.5 text-[10px] font-mono text-gray-400">
            v1.0
          </span>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
          {NAV_ITEMS.map((item, idx) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            const showCategory = item.category;

            return (
              <React.Fragment key={item.id}>
                {showCategory && (
                  <div className="px-2 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                    {item.category}
                  </div>
                )}
                <button
                  onClick={() => {
                    onSelectView(item.id);
                    onCloseMobile();
                  }}
                  className={`group flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-xs font-medium transition ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                      : "text-gray-400 hover:bg-gray-900 hover:text-gray-200"
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon
                      className={`h-4 w-4 transition ${
                        isActive ? "text-white" : "text-gray-400 group-hover:text-blue-400"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="h-3.5 w-3.5 opacity-80" />}
                </button>
              </React.Fragment>
            );
          })}
        </nav>

        {/* Footer Attribution & Integrity Note */}
        <div className="border-t border-gray-800 p-3 space-y-2">
          <div className="rounded bg-gray-900/80 p-2 text-[10px] text-gray-400 border border-gray-800/60">
            <div className="flex items-center space-x-1 font-medium text-gray-300">
              <span>Made with</span>
              <span className="text-red-500">❤️</span>
              <span>by</span>
              <strong className="text-blue-400 font-semibold">Aniruddha Bhutada</strong>
            </div>
            <p className="mt-1 text-[9px] text-gray-500">
              100% Free & Open Indian Equity Terminal
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

