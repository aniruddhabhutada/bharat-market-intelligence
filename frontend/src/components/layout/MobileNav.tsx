"use client";

import React from "react";
import { LayoutDashboard, Activity, SearchCheck, FileText, Menu } from "lucide-react";
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
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "live", label: "Live", icon: Activity },
    { id: "screener", label: "Screener", icon: SearchCheck },
    { id: "stock", label: "Stock", icon: FileText }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex h-14 items-center justify-around border-t border-gray-800 bg-[#0B0F19]/95 px-2 backdrop-blur-md md:hidden">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentView === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectView(tab.id)}
            className={`flex flex-1 flex-col items-center justify-center py-1 text-[10px] font-medium transition ${
              isActive ? "text-blue-500" : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <Icon className="h-4 w-4" />
            <span className="mt-0.5">{tab.label}</span>
          </button>
        );
      })}

      {/* More / Menu Drawer */}
      <button
        onClick={onOpenDrawer}
        className="flex flex-1 flex-col items-center justify-center py-1 text-[10px] font-medium text-gray-400 hover:text-gray-200"
      >
        <Menu className="h-4 w-4" />
        <span className="mt-0.5">More</span>
      </button>
    </div>
  );
};

