"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar, ViewType } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { DataQualityModal } from "@/components/modals/DataQualityModal";
import { Sparkles, ArrowRight, X, Compass, Search, Star, BookOpen, CheckCircle2 } from "lucide-react";

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
import { LearnView } from "@/components/views/LearnView";

export default function Home() {
  const [currentView, setCurrentView] = useState<ViewType>("dashboard");
  const [selectedStock, setSelectedStock] = useState<string>("RELIANCE");
  const [isDataQualityOpen, setIsDataQualityOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [tourStep, setTourStep] = useState<number | null>(null);

  useEffect(() => {
    try {
      const visited = localStorage.getItem("bmi_has_visited");
      if (!visited) {
        setShowOnboarding(true);
      }
    } catch {
      // ignore in SSR or restricted storage
    }
  }, []);

  const dismissOnboarding = () => {
    setShowOnboarding(false);
    setTourStep(null);
    try {
      localStorage.setItem("bmi_has_visited", "true");
    } catch {
      // ignore
    }
  };

  const handleSelectStock = (sym: string) => {
    setSelectedStock(sym);
    setCurrentView("stock");
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-[#0B0F19] text-gray-900 dark:text-gray-100 transition-colors duration-200">
      {/* Desktop Sidebar & Mobile Drawer */}
      <Sidebar
        currentView={currentView}
        onSelectView={(v) => {
          setCurrentView(v);
        }}
        isOpenMobile={isMobileDrawerOpen}
        onCloseMobile={() => setIsMobileDrawerOpen(false)}
      />

      {/* Main Terminal Workspace */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {/* Top Navbar */}
        <Header
          onOpenDataQuality={() => setIsDataQualityOpen(true)}
          onSelectStock={handleSelectStock}
          onToggleMobileMenu={() => setIsMobileDrawerOpen(true)}
        />

        {/* Dynamic View Container */}
        <main className="flex-1 overflow-y-auto pb-24 md:pb-6">
          {/* Lightweight 3-Step First-Time Welcome Banner */}
          {showOnboarding && (
            <div className="mx-4 sm:mx-6 mt-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-blue-500/5 border border-blue-500/20 shadow-sm relative animate-in fade-in slide-in-from-top-2 duration-300">
              <button
                onClick={dismissOnboarding}
                className="absolute right-3.5 top-3.5 p-1 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition"
                title="Dismiss Welcome Banner"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-start space-x-3.5 pr-8">
                <div className="h-9 w-9 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-500/20">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5 rounded-full">
                      Welcome to Bharat Market Intelligence
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      • Simple Mode is ON
                    </span>
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                    Understand the Stock Market. Make Smarter Research Decisions.
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed">
                    New to investing? No worries! We explain financial movements, company earnings, and balance sheets in clear, everyday language — without complicated jargon.
                  </p>
                </div>
              </div>

              {/* 3 Simple Action Cards */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  onClick={() => {
                    setCurrentView("dashboard");
                    dismissOnboarding();
                  }}
                  className="flex items-center space-x-2.5 p-3 rounded-xl bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-white/[0.08] hover:border-blue-500/50 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 text-left transition group"
                >
                  <div className="h-7 w-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      Understand Today's Market
                    </div>
                    <div className="text-[11px] text-gray-500 dark:text-gray-400">
                      Is the market up or down?
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    handleSelectStock("RELIANCE");
                    dismissOnboarding();
                  }}
                  className="flex items-center space-x-2.5 p-3 rounded-xl bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-white/[0.08] hover:border-blue-500/50 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 text-left transition group"
                >
                  <div className="h-7 w-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      Analyse a Company
                    </div>
                    <div className="text-[11px] text-gray-500 dark:text-gray-400">
                      Check Reliance, TCS, or SBI
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setCurrentView("screener");
                    dismissOnboarding();
                  }}
                  className="flex items-center space-x-2.5 p-3 rounded-xl bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-white/[0.08] hover:border-blue-500/50 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 text-left transition group"
                >
                  <div className="h-7 w-7 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      Discover Stocks
                    </div>
                    <div className="text-[11px] text-gray-500 dark:text-gray-400">
                      Filter by financial strength
                    </div>
                  </div>
                </button>
              </div>

              {/* Bottom Skip / Help controls */}
              <div className="mt-3.5 pt-2.5 border-t border-gray-200/60 dark:border-white/[0.06] flex items-center justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400 text-[11px]">
                  💡 You can switch between <strong>Simple View</strong> and <strong>Advanced View</strong> anytime in the header.
                </span>
                <button
                  onClick={dismissOnboarding}
                  className="text-xs font-semibold text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 underline"
                >
                  Got it, skip introduction
                </button>
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
