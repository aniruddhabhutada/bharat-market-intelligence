"use client";

import React from "react";
import { LayoutDashboard, Activity, SearchCheck, FileText, Menu, Sparkles } from "lucide-react";
import { ViewType } from "./Sidebar";

interface MobileNavProps {
  currentView: ViewType;
  onSelectView: (view: ViewType) => void;
  onOpenDrawer: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentView,
  onSelectView,
  onOpenDrawer
}) => {
  const tabs: { id: ViewType; label: string; icon: any }[] = [
    { id: "dashboard", label: "Overview", icon: LayoutDashboard },
    { id: "live", label: "Live Market", icon: Activity },
    { id: "screener", label: "Screener", icon: SearchCheck },
    { id: "stock", label: "Research", icon: FileText }
  ];

  return (
    <div className="fixed bottom-3 inset-x-3 z-40 max-w-md mx-auto md:hidden">
      <nav className="flex h-14 items-center justify-around rounded-2xl border border-white/10 bg-gray-950/90 px-2 shadow-2xl shadow-black/70 backdrop-blur-xl">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectView(tab.id)}
              className={`relative flex min-h-[44px] flex-1 flex-col items-center justify-center rounded-xl py-1 text-[10px] font-semibold transition-all duration-200 active:scale-95 ${
                isActive
                  ? "bg-blue-600/15 text-blue-400"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <Icon className={`h-4 w-4 transition-transform ${isActive ? "scale-110" : ""}`} />
              <span className="mt-0.5 tracking-tight">{tab.label}</span>
              {isActive && (
                <span className="absolute bottom-1 h-1 w-1 rounded-full bg-blue-400 shadow-sm shadow-blue-400" />
              )}
            </button>
          );
        })}

        {/* More / All Tools Drawer Trigger */}
        <button
          onClick={onOpenDrawer}
          className="flex min-h-[44px] flex-1 flex-col items-center justify-center rounded-xl py-1 text-[10px] font-semibold text-gray-400 transition-all duration-200 hover:text-gray-200 active:scale-95"
        >
          <Menu className="h-4 w-4" />
          <span className="mt-0.5 tracking-tight">All Tools</span>
        </button>
      </nav>
    </div>
  );
};
