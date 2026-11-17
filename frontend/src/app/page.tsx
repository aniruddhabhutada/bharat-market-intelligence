"use client";

import React, { useState, useEffect } from "react";
import { Sidebar, ViewType } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { DashboardView } from "@/components/views/DashboardView";
import { LiveMarketView } from "@/components/views/LiveMarketView";
import { PremarketView } from "@/components/views/PremarketView";
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
import { LearnView } from "@/components/views/LearnView";
import { DataQualityModal } from "@/components/modals/DataQualityModal";
import { X, Sparkles, BookOpen, Search, ChartNoAxesCombined } from "lucide-react";

export default function Home() {
  const [currentView, setCurrentView] = useState<ViewType>("dashboard");
  const [selectedStock, setSelectedStock] = useState<string>("RELIANCE");
  const [isDataQualityOpen, setIsDataQualityOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Check first-time visitor status for beginner onboarding
  useEffect(() => {
    try {
      const hasVisited = localStorage.getItem("bmi_has_visited");
      if (!hasVisited) {
        setShowOnboarding(true);
      }
    } catch {
      // LocalStorage unavailable
    }
  }, []);

  const dismissOnboarding = () => {
    setShowOnboarding(false);
    try {
      localStorage.setItem("bmi_has_visited", "true");
    } catch {
      // Ignore
    }
  };

  const handleSelectStock = (symbol: string) => {
    setSelectedStock(symbol);
    setCurrentView("stock");
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F5F7FB] dark:bg-[#0B111E] text-[#172B4D] dark:text-[#F4F6FB] transition-colors duration-200">
      {/* Desktop Sidebar & Mobile Drawer */}
      <Sidebar
        currentView={currentView}
        onSelectView={(v) => setCurrentView(v)}
        isOpenMobile={isMobileDrawerOpen}
        onCloseMobile={() => setIsMobileDrawerOpen(false)}
        onOpenHelp={() => setIsDataQualityOpen(true)}
      />

      {/* Main Terminal Workspace */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {/* Top Navbar */}
        <Header
          currentView={currentView}
          onOpenDataQuality={() => setIsDataQualityOpen(true)}
          onSelectStock={handleSelectStock}
          onToggleMobileMenu={() => setIsMobileDrawerOpen(true)}
        />

        {/* Dynamic View Container */}
        <main className="flex-1 overflow-y-auto pb-24 md:pb-6">
          {/* Welcoming Optional Introduction Banner */}
          {showOnboarding && (
            <div className="mx-4 sm:mx-6 mt-4 p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#131C2E] border border-[#CAD9FB] dark:border-[#1F2E47] shadow-sm relative animate-in fade-in slide-in-from-top-2 duration-300">
              <button
                onClick={dismissOnboarding}
                className="absolute right-3.5 top-3.5 p-1 rounded-lg text-[#667085] hover:text-[#172B4D] dark:hover:text-[#F4F6FB] transition"
                title="Dismiss Introduction"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-start space-x-3.5 pr-8">
                <div className="h-9 w-9 rounded-xl bg-[#315EFB] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#315EFB] dark:text-[#4D74FB] bg-[#EEF3FC] dark:bg-[#1A2844] px-2 py-0.5 rounded-full">
                      Welcome to Bharat Market Intelligence
                    </span>
                    <span className="text-xs text-[#667085] dark:text-[#97A3B6]">
                      • Simple View is active by default
                    </span>
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-[#172B4D] dark:text-[#F4F6FB] tracking-tight">
                    Understand the Stock Market. Research with Confidence.
                  </h2>
                  <p className="text-xs sm:text-sm text-[#667085] dark:text-[#97A3B6] max-w-2xl leading-relaxed">
                    Your intelligent Indian stock market research assistant. Understand market movements, analyse companies and discover stocks with clear, data-backed insights.
                  </p>
                </div>
              </div>

              {/* 3 Prominent Actions */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentView("live");
                    dismissOnboarding();
                  }}
                  className="flex items-center space-x-3 p-3 rounded-xl bg-[#F5F7FB] dark:bg-[#0B111E] border border-[#E5EAF2] dark:border-[#1F2E47] hover:border-[#315EFB] hover:bg-[#EEF3FC] dark:hover:bg-[#1A2844] text-left transition group"
                >
                  <div className="h-8 w-8 rounded-lg bg-[#315EFB]/10 text-[#315EFB] dark:text-[#4D74FB] flex items-center justify-center shrink-0">
                    <ChartNoAxesCombined className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#172B4D] dark:text-[#F4F6FB] group-hover:text-[#315EFB]">
                      1. Understand Today&apos;s Market
                    </div>
                    <div className="text-[11px] text-[#667085] dark:text-[#97A3B6]">
                      See what happened &amp; why
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleSelectStock("RELIANCE");
                    dismissOnboarding();
                  }}
                  className="flex items-center space-x-3 p-3 rounded-xl bg-[#F5F7FB] dark:bg-[#0B111E] border border-[#E5EAF2] dark:border-[#1F2E47] hover:border-[#315EFB] hover:bg-[#EEF3FC] dark:hover:bg-[#1A2844] text-left transition group"
                >
                  <div className="h-8 w-8 rounded-lg bg-[#315EFB]/10 text-[#315EFB] dark:text-[#4D74FB] flex items-center justify-center shrink-0">
                    <Search className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#172B4D] dark:text-[#F4F6FB] group-hover:text-[#315EFB]">
                      2. Analyse a Stock
                    </div>
                    <div className="text-[11px] text-[#667085] dark:text-[#97A3B6]">
                      Check Reliance, TCS, or HDFC
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCurrentView("screener");
                    dismissOnboarding();
                  }}
                  className="flex items-center space-x-3 p-3 rounded-xl bg-[#F5F7FB] dark:bg-[#0B111E] border border-[#E5EAF2] dark:border-[#1F2E47] hover:border-[#315EFB] hover:bg-[#EEF3FC] dark:hover:bg-[#1A2844] text-left transition group"
                >
                  <div className="h-8 w-8 rounded-lg bg-[#315EFB]/10 text-[#315EFB] dark:text-[#4D74FB] flex items-center justify-center shrink-0">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#172B4D] dark:text-[#F4F6FB] group-hover:text-[#315EFB]">
                      3. Explore Stock Opportunities
                    </div>
                    <div className="text-[11px] text-[#667085] dark:text-[#97A3B6]">
                      Filter by financial strength
                    </div>
                  </div>
                </button>
              </div>

              {/* Bottom Introduction Link & Skip Controls */}
              <div className="mt-3.5 pt-2.5 border-t border-[#E5EAF2] dark:border-[#1F2E47] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentView("learn");
                    dismissOnboarding();
                  }}
                  className="inline-flex items-center space-x-1.5 text-[#315EFB] dark:text-[#4D74FB] font-semibold hover:underline"
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>New to investing? Start with our simple market guide.</span>
                </button>

                <div className="flex items-center space-x-3 text-[11px] text-[#667085] dark:text-[#97A3B6]">
                  <span>Toggle Simple/Advanced view anytime in the header.</span>
                  <button
                    type="button"
                    onClick={dismissOnboarding}
                    className="font-semibold text-[#172B4D] dark:text-[#F4F6FB] hover:text-[#315EFB] underline"
                  >
                    Skip
                  </button>
                </div>
              </div>
            </div>
          )}

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
          {currentView === "learn" && <LearnView />}
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
