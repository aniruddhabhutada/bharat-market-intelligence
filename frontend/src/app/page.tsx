"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar, ViewType } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { DataQualityModal } from "@/components/modals/DataQualityModal";

// Views
import { DashboardView } from "@/components/views/DashboardView";
import { PremarketView } from "@/components/views/PremarketView";
import { LiveMarketView } from "@/components/views/LiveMarketView";
import { IndicesView } from "@/components/views/IndicesView";
import { FiiDiiView } from "@/components/views/FiiDiiView";
import { SectorView } from "@/components/views/SectorView";
import { ScreenerView } from "@/components/views/ScreenerView";
import { StockResearchView } from "@/components/views/StockResearchView";
import { NewsView } from "@/components/views/NewsView";
import { WatchlistView } from "@/components/views/WatchlistView";
import { PortfolioView } from "@/components/views/PortfolioView";
import { ReportsView } from "@/components/views/ReportsView";
import { SettingsView } from "@/components/views/SettingsView";

export default function Home() {
  const [currentView, setCurrentView] = useState<ViewType>("dashboard");
  const [selectedStock, setSelectedStock] = useState<string>("RELIANCE");
  const [isDataQualityOpen, setIsDataQualityOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const handleSelectStock = (sym: string) => {
    setSelectedStock(sym);
    setCurrentView("stock");
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0B0F19] text-gray-100">
      {/* Desktop Sidebar & Mobile Drawer */}
      <Sidebar
        currentView={currentView}
        onSelectView={setCurrentView}
        isOpenMobile={isMobileDrawerOpen}
        onCloseMobile={() => setIsMobileDrawerOpen(false)}
      />

      {/* Main Terminal Workspace */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navbar */}
        <Header
          onOpenDataQuality={() => setIsDataQualityOpen(true)}
          onSelectStock={handleSelectStock}
          onToggleMobileMenu={() => setIsMobileDrawerOpen(true)}
        />

        {/* Dynamic View Container */}
        <main className="flex-1 overflow-y-auto pb-16 md:pb-6">
          {currentView === "dashboard" && (
            <DashboardView
              onSelectStock={handleSelectStock}
              onNavigate={setCurrentView}
            />
          )}
          {currentView === "premarket" && <PremarketView />}
          {currentView === "live" && (
            <LiveMarketView onSelectStock={handleSelectStock} />
          )}
          {currentView === "indices" && <IndicesView />}
          {currentView === "fiidii" && <FiiDiiView />}
          {currentView === "sectors" && <SectorView />}
          {currentView === "screener" && (
            <ScreenerView onSelectStock={handleSelectStock} />
          )}
          {currentView === "stock" && (
            <StockResearchView initialSymbol={selectedStock} />
          )}
          {currentView === "news" && <NewsView />}
          {currentView === "watchlist" && (
            <WatchlistView onSelectStock={handleSelectStock} />
          )}
          {currentView === "portfolio" && <PortfolioView />}
          {currentView === "reports" && <ReportsView />}
          {currentView === "settings" && <SettingsView />}
        </main>

        {/* Mobile Bottom Navigation Bar */}
        <MobileNav
          currentView={currentView}
          onSelectView={setCurrentView}
          onOpenDrawer={() => setIsMobileDrawerOpen(true)}
        />
      </div>

      {/* Visible Data Quality & Reliability Modal */}
      <DataQualityModal
        isOpen={isDataQualityOpen}
        onClose={() => setIsDataQualityOpen(false)}
      />
    </div>
  );
}
