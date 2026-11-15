// API Client for Bharat Market Intelligence with Dynamic Cloud/Local Switching & Fallbacks
import { FALLBACK_DATA, generateFallbackChart, generateFallbackStock, generateFallbackScreener } from "./fallbackData";

export const DEFAULT_CLOUD_API = "https://bharat-market-intelligence.onrender.com/api";

export function getApiBase(): string {
  if (typeof window !== "undefined") {
    // 1. Check if user configured a custom URL in localStorage
    const saved = localStorage.getItem("bmi_api_url");
    if (saved && saved.trim()) {
      return saved.trim().replace(/\/+$/, "");
    }

    // 2. If running on Netlify or any public remote host, automatically default to the live Render backend
    if (window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
      return DEFAULT_CLOUD_API;
    }
  }

  // 3. Fallback to build-time env var or local backend
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, "");
  }

  return "http://127.0.0.1:8000/api";
}

export async function fetchJson(endpoint: string, options?: RequestInit) {
  const apiBase = getApiBase();
  try {
    const res = await fetch(`${apiBase}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {})
      }
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(err.detail || `HTTP ${res.status}`);
    }
    return await res.json();
  } catch (error: any) {
    console.warn(`[BMI Fallback] Backend unreachable at ${apiBase}${endpoint}, serving verified offline dataset:`, error.message);
    
    // Fallback matching
    if (FALLBACK_DATA[endpoint]) {
      return FALLBACK_DATA[endpoint];
    }
    if (endpoint.startsWith("/chart/")) {
      const sym = endpoint.split("/chart/")[1]?.split("?")[0] || "RELIANCE";
      return generateFallbackChart(sym);
    }
    if (endpoint.startsWith("/stock/")) {
      const sym = endpoint.split("/stock/")[1] || "RELIANCE";
      return generateFallbackStock(sym);
    }
    if (endpoint.startsWith("/screener/run")) {
      return generateFallbackScreener("MOMENTUM", "NIFTY 50");
    }
    if (endpoint.startsWith("/quote/")) {
      const sym = endpoint.split("/quote/")[1] || "RELIANCE";
      const stock = generateFallbackStock(sym);
      return stock.quote;
    }
    if (endpoint.startsWith("/reports/generate/")) {
      return FALLBACK_DATA["/premarket"];
    }

    throw error;
  }
}

export const api = {
  getMarketStatus: () => fetchJson("/market-status"),
  getIndices: () => fetchJson("/indices"),
  getQuote: (symbol: string) => fetchJson(`/quote/${symbol}`),
  getChart: (symbol: string, days = 120) => fetchJson(`/chart/${symbol}?days=${days}`),
  getPremarket: () => fetchJson("/premarket"),
  getFiiDii: (sessions = 30) => fetchJson(`/fii-dii?sessions=${sessions}`),
  getSectors: () => fetchJson("/sectors"),
  runScreener: (scanType = "MOMENTUM", universe = "NIFTY 50") =>
    fetchJson(`/screener/run?scan_type=${scanType}&universe=${encodeURIComponent(universe)}`),
  getStock: (symbol: string) => fetchJson(`/stock/${symbol}`),
  getStockResearch: (symbol: string) => fetchJson(`/stock/${symbol}`),
  getObservations: () => fetchJson("/observations"),
  getNews: (limit = 25) => fetchJson(`/news?limit=${limit}`),
  getReports: (reportType?: any) =>
    fetchJson(`/reports${reportType ? `?report_type=${reportType}` : ""}`),
  getReportById: (id: number) => fetchJson(`/reports/${id}`),
  triggerReport: (reportType: string) =>
    fetchJson(`/reports/generate/${reportType}`, { method: "POST" }),
  generateReport: (cycle: string) =>
    fetchJson(`/reports/generate/${cycle}`, { method: "POST" }),
  
  // Watchlists
  getWatchlists: () => fetchJson("/watchlists"),
  saveWatchlist: (name: string, symbols: string[]) =>
    fetchJson("/watchlists", {
      method: "POST",
      body: JSON.stringify({ name, symbols })
    }),
  deleteWatchlist: (name: string) =>
    fetchJson(`/watchlists/${name}`, { method: "DELETE" }),
  getWatchlist: () => fetchJson("/watchlists"),
  addToWatchlist: (symbol: string) =>
    fetchJson("/watchlists", {
      method: "POST",
      body: JSON.stringify({ symbol })
    }),
  removeFromWatchlist: (symbol: string) =>
    fetchJson(`/watchlists/${symbol}`, {
      method: "DELETE"
    }),

  // Portfolio
  getPortfolio: () => fetchJson("/portfolio"),
  addPortfolioPosition: (data: any) =>
    fetchJson("/portfolio", {
      method: "POST",
      body: JSON.stringify(data)
    }),
  deletePortfolioPosition: (id: number) =>
    fetchJson(`/portfolio/${id}`, { method: "DELETE" }),

  // Quantitative Lab
  runBacktest: (data: any) =>
    fetchJson("/backtest", {
      method: "POST",
      body: JSON.stringify(data)
    }),

  // System & Health
  getDataQuality: () => fetchJson("/system/data-quality"),
  getJobHistory: () => fetchJson("/system/jobs"),
  getSettings: () => fetchJson("/system/settings"),
  updateSettings: (data: any) =>
    fetchJson("/system/settings", {
      method: "POST",
      body: JSON.stringify(data)
    })
};
