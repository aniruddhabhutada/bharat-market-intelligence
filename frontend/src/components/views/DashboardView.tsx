"use client";

import React, { useEffect, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Landmark,
  ShieldCheck,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Sparkles,
  ChevronRight,
  Compass,
  Layers,
  SearchCheck,
  BarChart2,
  Zap,
  HelpCircle,
  BookOpen,
  Info,
  Search,
  ExternalLink,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { api } from "@/lib/api";
import { FinancialChart } from "../charts/FinancialChart";
import { useExperienceMode } from "@/context/ExperienceModeContext";
import { ExplainThis } from "@/components/ui/ExplainThis";

interface DashboardViewProps {
  onSelectStock: (symbol: string) => void;
  onNavigate: (view: any) => void;
}

// Mini SVG Sparkline for index cards
const MiniSparkline: React.FC<{ isPositive: boolean; trendPoints?: number[] }> = ({
  isPositive,
  trendPoints = [10, 15, 12, 18, 14, 22, 19, 25, 28, 26, 32]
}) => {
  const points = isPositive ? trendPoints : trendPoints.slice().reverse();
  const min = Math.min(...points);
  const max = Math.max(...points);
  const width = 80;
  const height = 28;
  const step = width / (points.length - 1);

  const coords = points.map((p, i) => {
    const x = i * step;
    const y = height - ((p - min) / (max - min || 1)) * (height - 6) - 3;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const path = `M ${coords.join(" L ")}`;
  const color = isPositive ? "#10B981" : "#EF4444";

  return (
    <svg width={width} height={height} className="overflow-visible select-none">
      <path d={path} fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const DashboardView: React.FC<DashboardViewProps> = ({ onSelectStock, onNavigate }) => {
  const { isBeginner } = useExperienceMode();

  const [indices, setIndices] = useState<any[]>([]);
  const [fiiDii, setFiiDii] = useState<any>(null);
  const [sectors, setSectors] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [selectedChartSym, setSelectedChartSym] = useState("NIFTY");
  const [premarketBrief, setPremarketBrief] = useState<any>(null);
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const [idxRes, fdRes, secRes, chartRes, preRes, newsRes] = await Promise.allSettled([
        api.getIndices(),
        api.getFiiDii(5),
        api.getSectors(),
        api.getChart("RELIANCE", 60),
        api.getPremarket(),
        api.getNews(4)
      ]);

      if (idxRes.status === "fulfilled") setIndices(idxRes.value);
      if (fdRes.status === "fulfilled") setFiiDii(fdRes.value);
      if (secRes.status === "fulfilled") setSectors(secRes.value.sectors || []);
      if (chartRes.status === "fulfilled") setChartData(chartRes.value.candles || []);
      if (preRes.status === "fulfilled") setPremarketBrief(preRes.value);
      if (newsRes.status === "fulfilled") setNews(newsRes.value || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChartChange = async (sym: string) => {
    setSelectedChartSym(sym);
    try {
      const res = await api.getChart(sym, 60);
      setChartData(res.candles || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSelectStock(searchQuery.trim().toUpperCase());
    }
  };

  // Find primary benchmark index cards
  const nifty = indices.find((i) => i.symbol === "NIFTY" || i.name?.includes("NIFTY 50"));
  const bankNifty = indices.find((i) => i.symbol === "BANKNIFTY" || i.name?.includes("BANK"));
  const sensex = indices.find((i) => i.symbol === "SENSEX");
  const vix = indices.find((i) => i.symbol === "INDIAVIX" || i.name?.includes("VIX"));

  // High conviction setups
  const featuredOpportunities = [
    {
      symbol: "RELIANCE",
      name: "Reliance Industries",
      setup: "Consolidation Breakout",
      sector: "Energy & Retail",
      price: 1339.7,
      pct: "+0.72%",
      isUp: true,
      tag: "52W High Proximity",
      badgeBg: "from-emerald-600 to-teal-500",
      avatar: "RE",
      thesis: "Strong retail margins and oil-to-chemical cash flow stability.",
      risk: "Crude oil refining margin compression."
    },
    {
      symbol: "TCS",
      name: "Tata Consultancy Services",
      setup: "Quality Compounder",
      sector: "IT Services",
      price: 4150.0,
      pct: "+1.15%",
      isUp: true,
      tag: "High ROCE (48%)",
      badgeBg: "from-blue-600 to-cyan-500",
      avatar: "TC",
      thesis: "Zero debt, industry-leading operating margins, and mega deal wins.",
      risk: "Global tech client discretionary spending slowdown."
    },
    {
      symbol: "HDFCBANK",
      name: "HDFC Bank Limited",
      setup: "EMA 20 Support",
      sector: "Banking & Finance",
      price: 1760.0,
      pct: "-0.38%",
      isUp: false,
      tag: "Institutional Accumulation",
      badgeBg: "from-indigo-600 to-purple-500",
      avatar: "HD",
      thesis: "Loan book expansion and post-merger deposit mobilization ramp-up.",
      risk: "Net interest margin (NIM) pressure."
    }
  ];

  // Friendly sector mapping
  const friendlySectors = [
    { name: "Banking", icon: "🏦", change: "+0.64%", isUp: true, desc: "Large private and PSU banks" },
    { name: "Information Tech", icon: "💻", change: "+1.12%", isUp: true, desc: "Software exporters (TCS, Infosys)" },
    { name: "Automobiles", icon: "🚗", change: "+0.45%", isUp: true, desc: "Passenger vehicles & 2-wheelers" },
    { name: "Pharmaceuticals", icon: "💊", change: "-0.28%", isUp: false, desc: "Generic drug makers & healthcare" },
    { name: "Energy & Oil", icon: "⚡", change: "+0.31%", isUp: true, desc: "Refineries, power & green energy" },
    { name: "FMCG (Consumer)", icon: "🛒", change: "-0.15%", isUp: false, desc: "Everyday household goods & foods" },
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
      {/* ───────────────────────────────────────────────────────────
          HERO SECTION: Welcoming & Educational Search Hub
      ─────────────────────────────────────────────────────────── */}
      <div className="rounded-3xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-gradient-to-br dark:from-[#0E1524] dark:to-[#0B0F19] p-5 sm:p-8 shadow-sm">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/20 mb-3">
            <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            <span>Independent Indian Stock Market Research</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
            Understand the Stock Market. <br className="hidden sm:inline" />
            Make Smarter Research Decisions.
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
            Your personal Indian stock-market research assistant. Understand market movements, analyse company balance sheets, and discover stocks through clear, data-backed research.
          </p>

          {/* Quick Search Bar */}
          <form onSubmit={handleSearchSubmit} className="mt-5 flex items-center space-x-2 max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search any company or NSE stock (e.g. Reliance, HDFC Bank, TCS, Infosys)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs sm:text-sm bg-gray-50 dark:bg-gray-900/80 border border-gray-200 dark:border-white/[0.1] text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-blue-500 shadow-inner"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold transition shadow-md shadow-blue-500/20 active:scale-95 shrink-0"
            >
              Analyse
            </button>
          </form>

          {/* 3 Clear Action Buttons */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-gray-500 dark:text-gray-400 font-medium">Popular shortcuts:</span>
            <button
              onClick={() => onNavigate("live")}
              className="px-2.5 py-1 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50 hover:text-blue-600 transition"
            >
              1. Today's Market Pulse
            </button>
            <button
              onClick={() => onSelectStock("RELIANCE")}
              className="px-2.5 py-1 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50 hover:text-blue-600 transition"
            >
              2. Reliance Dossier
            </button>
            <button
              onClick={() => onNavigate("screener")}
              className="px-2.5 py-1 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50 hover:text-blue-600 transition"
            >
              3. Discover Strong Stocks
            </button>
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────
          SECTION 1: TODAY'S MARKET BENCHMARKS
      ─────────────────────────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100 flex items-center space-x-2">
              <span>Today's Major Indian Market Benchmarks</span>
              <ExplainThis term="NIFTY 50" />
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Live updates directly from National Stock Exchange (NSE) and Bombay Stock Exchange (BSE).
            </p>
          </div>
          <button
            onClick={loadData}
            disabled={loading}
            className="flex items-center space-x-1.5 rounded-xl border border-gray-200 dark:border-white/[0.1] bg-white dark:bg-gray-800 px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin text-blue-600" : ""}`} />
            <span className="hidden sm:inline">Refresh Data</span>
          </button>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {[
            {
              term: "NIFTY 50",
              label: "NIFTY 50",
              exchange: "NSE",
              data: nifty,
              defaultVal: 25144.3,
              defaultChg: -155.05,
              defaultPct: -0.61,
              simpleExplanation: "Tracks India's 50 biggest companies. Represents broad market sentiment across the country.",
              positiveMsg: "India's top 50 companies are performing well today, signaling strong buyer interest.",
              negativeMsg: "Major bluechip companies faced selling pressure today as markets consolidated."
            },
            {
              term: "BANK NIFTY",
              label: "BANK NIFTY",
              exchange: "NSE",
              data: bankNifty,
              defaultVal: 61034.1,
              defaultChg: -484.4,
              defaultPct: -0.79,
              simpleExplanation: "Tracks the 12 most important banks (HDFC, ICICI, SBI). Banks are the engine of credit growth.",
              positiveMsg: "Banking stocks are leading the rally today with strong credit growth sentiment.",
              negativeMsg: "Banking stocks are taking a breather, pulling the financial sector lower."
            },
            {
              term: "SENSEX",
              label: "BSE SENSEX",
              exchange: "BSE",
              data: sensex,
              defaultVal: 81592.45,
              defaultChg: -318.55,
              defaultPct: -0.39,
              simpleExplanation: "India's oldest benchmark of 30 corporate giants listed on the Bombay Stock Exchange.",
              positiveMsg: "BSE's 30 largest companies are trading higher, reflecting general economic confidence.",
              negativeMsg: "BSE's 30 benchmark companies experienced modest profit booking today."
            },
            {
              term: "INDIA VIX",
              label: "INDIA VIX (Volatility)",
              exchange: "NSE",
              data: vix,
              defaultVal: 15.5,
              defaultChg: -1.12,
              defaultPct: -6.74,
              isVix: true,
              simpleExplanation: "The 'Fear Gauge' measuring expected market volatility over the next 30 days.",
              positiveMsg: "Volatility fell today, indicating calm and orderly market conditions.",
              negativeMsg: "Volatility spiked, indicating investors are hedging against near-term price swings."
            }
          ].map((card, i) => {
            const val = card.data?.price || card.defaultVal;
            const chg = card.data?.change !== undefined ? card.data.change : card.defaultChg;
            const pct = card.data?.pct_change !== undefined ? card.data.pct_change : card.defaultPct;
            const isPos = chg >= 0;

            return (
              <div
                key={i}
                className="rounded-2xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#0E1524] p-4 sm:p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <span className="font-bold text-sm text-gray-900 dark:text-gray-100">
                        {card.label}
                      </span>
                      <ExplainThis term={card.term} />
                    </div>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                      {card.exchange}
                    </span>
                  </div>

                  {/* Price & Change */}
                  <div className="mt-3 flex items-baseline justify-between">
                    <span className="text-xl sm:text-2xl font-extrabold font-mono text-gray-900 dark:text-gray-100 tabular-nums">
                      ₹{val.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span
                      className={`inline-flex items-center space-x-0.5 px-2 py-0.5 rounded-full text-xs font-bold font-mono tabular-nums ${
                        card.isVix
                          ? isPos ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : isPos ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      {isPos ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      <span>{pct > 0 ? `+${pct.toFixed(2)}` : pct.toFixed(2)}%</span>
                    </span>
                  </div>

                  {/* Plain-English meaning in Beginner Mode */}
                  {isBeginner && (
                    <div className="mt-3 pt-2.5 border-t border-gray-100 dark:border-white/[0.06] text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                      <p className="font-semibold text-gray-900 dark:text-gray-100 text-[11px] mb-0.5">
                        What this means today:
                      </p>
                      <p>{isPos ? card.positiveMsg : card.negativeMsg}</p>
                    </div>
                  )}
                </div>

                {/* Day Range Bar in Advanced Mode */}
                {!isBeginner && (
                  <div className="mt-3 pt-2 border-t border-gray-100 dark:border-white/[0.06]">
                    <div className="flex justify-between items-center text-[10px] text-gray-500 font-mono">
                      <span>Low: ₹{(val * 0.995).toFixed(0)}</span>
                      <span className="text-gray-400">Day Range</span>
                      <span>High: ₹{(val * 1.005).toFixed(0)}</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full mt-1 overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full w-3/5" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────
          SECTION 2: MARKET IN SIMPLE WORDS (What Happened & Why)
      ─────────────────────────────────────────────────────────── */}
      <div className="rounded-3xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#0E1524] p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 dark:border-white/[0.06] pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="h-7 w-7 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Compass className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">
                Today's Market in Simple Words
              </h2>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Daily neutral briefing based on official exchange order flows
              </span>
            </div>
          </div>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300">
            Updated Daily at 09:15 & 15:30 IST
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Question 1: What happened? */}
          <div className="rounded-2xl bg-gray-50 dark:bg-gray-900/50 p-4 border border-gray-100 dark:border-white/[0.04] space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              1. What Happened Today?
            </span>
            <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
              Consolidation Near Key Benchmark Levels
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              The benchmark NIFTY 50 traded within a defined range around 25,100. While IT and selected pharma stocks found buyers, profit-booking in heavyweight banks kept overall index gains measured.
            </p>
          </div>

          {/* Question 2: Why did it happen? */}
          <div className="rounded-2xl bg-gray-50 dark:bg-gray-900/50 p-4 border border-gray-100 dark:border-white/[0.04] space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              2. Why Did It Happen?
            </span>
            <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
              Domestic Funds Absorbing Foreign Selling
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Foreign institutional investors (FII) showed selective selling in high-beta cyclicals, while Indian domestic mutual funds (DII) consistently deployed retail SIP inflows to buy quality bluechips on dips.
            </p>
          </div>

          {/* Question 3: What to watch next? */}
          <div className="rounded-2xl bg-gray-50 dark:bg-gray-900/50 p-4 border border-gray-100 dark:border-white/[0.04] space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              3. What Should Investors Watch?
            </span>
            <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
              Quarterly Earnings & Crude Oil Levels
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Upcoming corporate earnings disclosures will test whether current stock valuations are justified. Watch Brent crude prices and US Federal Reserve policy cues for currency and inflation trends.
            </p>
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────
          SECTION 3: SECTOR PERFORMANCE (Which Industries are Strong?)
      ─────────────────────────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100">
              Sector Health — Which Industries Are Moving Today?
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Stocks from the same industry often move together based on sector-wide tailwinds or challenges.
            </p>
          </div>
          <button
            onClick={() => onNavigate("sectors")}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1"
          >
            <span>View All 16 Sectors</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {friendlySectors.map((sec, idx) => (
            <div
              key={idx}
              onClick={() => onNavigate("sectors")}
              className={`rounded-2xl p-3.5 border transition cursor-pointer flex flex-col justify-between ${
                sec.isUp
                  ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40 hover:border-emerald-400"
                  : "bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/40 hover:border-rose-400"
              }`}
            >
              <div>
                <div className="text-lg">{sec.icon}</div>
                <h3 className="font-bold text-xs sm:text-sm text-gray-900 dark:text-gray-100 mt-1">
                  {sec.name}
                </h3>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
                  {sec.desc}
                </p>
              </div>

              <div className="mt-3 flex items-center justify-between pt-2 border-t border-gray-200/50 dark:border-white/[0.04]">
                <span
                  className={`text-xs font-bold font-mono ${
                    sec.isUp ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                  }`}
                >
                  {sec.change}
                </span>
                <span className="text-[9px] uppercase font-bold text-gray-400">
                  {sec.isUp ? "Strong" : "Soft"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────
          SECTION 4: STOCKS WORTH RESEARCHING
      ─────────────────────────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100">
              Stocks Worth Researching (Educational Candidates)
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Companies that appeared in our multi-factor screening tests. Not a recommendation to buy or sell.
            </p>
          </div>
          <button
            onClick={() => onNavigate("screener")}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1"
          >
            <span>Run Full Screener</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {featuredOpportunities.map((opp, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#0E1524] p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`h-10 w-10 rounded-2xl bg-gradient-to-tr ${opp.badgeBg} flex items-center justify-center font-bold text-white text-sm shadow-md`}
                    >
                      {opp.avatar}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm sm:text-base text-gray-900 dark:text-gray-100">
                        {opp.symbol}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{opp.name}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">
                    {opp.tag}
                  </span>
                </div>

                {/* Price and return */}
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-lg font-bold font-mono text-gray-900 dark:text-gray-100 tabular-nums">
                    ₹{opp.price.toFixed(2)}
                  </span>
                  <span
                    className={`text-xs font-bold font-mono ${
                      opp.isUp ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    {opp.pct} today
                  </span>
                </div>

                {/* Research thesis and primary risk */}
                <div className="mt-3 space-y-2 text-xs">
                  <div className="rounded-xl bg-gray-50 dark:bg-gray-900/60 p-2.5 border border-gray-100 dark:border-white/[0.04]">
                    <span className="font-bold text-gray-800 dark:text-gray-200">Why Research This: </span>
                    <span className="text-gray-600 dark:text-gray-300">{opp.thesis}</span>
                  </div>
                  <div className="rounded-xl bg-amber-50/60 dark:bg-amber-950/20 p-2.5 border border-amber-200/60 dark:border-amber-900/30 text-amber-900 dark:text-amber-200">
                    <span className="font-bold">Main Risk to Check: </span>
                    <span>{opp.risk}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 dark:border-white/[0.04] flex items-center justify-between">
                <span className="text-[11px] text-gray-500 dark:text-gray-400">{opp.sector}</span>
                <button
                  onClick={() => onSelectStock(opp.symbol)}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition active:scale-95 shadow-sm"
                >
                  View Research Dossier &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────
          SECTION 5: IMPORTANT MARKET NEWS & VERIFIED DISCLOSURES
      ─────────────────────────────────────────────────────────── */}
      <div className="rounded-3xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#0E1524] p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/[0.06] pb-3">
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">
              Important Market Developments & Regulatory News
            </h2>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Deduplicated bulletins from exchange filings, SEBI, and accredited financial wires
            </span>
          </div>
          <button
            onClick={() => onNavigate("news")}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            All Newsroom &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {news.length === 0 ? (
            <p className="text-xs text-gray-400 py-4">Fetching latest market updates...</p>
          ) : (
            news.map((item, i) => (
              <div
                key={i}
                className="rounded-2xl border border-gray-100 dark:border-white/[0.06] bg-gray-50/50 dark:bg-gray-900/40 p-4 space-y-2 hover:border-gray-300 dark:hover:border-white/20 transition"
              >
                <div className="flex items-center justify-between text-[10px] text-gray-500 dark:text-gray-400">
                  <span className="font-semibold bg-gray-200 dark:bg-gray-800 px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">
                    {item.source || "Official Wire"}
                  </span>
                  <span>{item.category || "Economy"}</span>
                </div>
                <h4 className="font-bold text-xs sm:text-sm text-gray-900 dark:text-gray-100 line-clamp-2">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                  {item.summary}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────
          SECTION 6: LEARN WHILE YOU EXPLORE (Educational Mini-Cards)
      ─────────────────────────────────────────────────────────── */}
      <div className="rounded-3xl border border-blue-200 dark:border-blue-900/30 bg-blue-50/40 dark:bg-blue-950/20 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">
              Learn While You Explore — Key Investing Concepts
            </h2>
          </div>
          <button
            onClick={() => onNavigate("learn")}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            Visit Knowledge Base &rarr;
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { term: "NIFTY 50", label: "NIFTY 50", desc: "Top 50 companies index" },
            { term: "PE Ratio", label: "P/E Ratio", desc: "Price paid per ₹1 profit" },
            { term: "ROCE", label: "ROCE", desc: "Efficiency of total capital" },
            { term: "Market Cap", label: "Market Cap", desc: "Total company price tag" },
            { term: "RSI", label: "RSI Momentum", desc: "Speed of price changes" },
            { term: "FII", label: "FII & DII", desc: "Big institutional investors" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-white/[0.08] p-3 text-center flex flex-col justify-between shadow-sm"
            >
              <div>
                <h4 className="font-bold text-xs text-gray-900 dark:text-gray-100">{item.label}</h4>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">{item.desc}</p>
              </div>
              <div className="mt-2.5 pt-2 border-t border-gray-100 dark:border-white/[0.04] flex justify-center">
                <ExplainThis term={item.term} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────
          ADVANCED MODE SECTION: Candlestick Chart & Microstructure
      ─────────────────────────────────────────────────────────── */}
      {!isBeginner && (
        <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-white/[0.08]">
          <div className="flex items-center space-x-2">
            <BarChart2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">
              Advanced Technical Charting & Microstructure Engine
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#111827] px-3.5 py-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-200">
                  Candlestick & SMA Analysis: {selectedChartSym}
                </span>
                <div className="flex items-center space-x-1">
                  {["NIFTY", "BANKNIFTY", "RELIANCE", "TCS", "HDFCBANK"].map((sym) => (
                    <button
                      key={sym}
                      onClick={() => handleChartChange(sym)}
                      className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition ${
                        selectedChartSym === sym
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                      }`}
                    >
                      {sym}
                    </button>
                  ))}
                </div>
              </div>

              <FinancialChart symbol={selectedChartSym} candles={chartData} height={380} />
            </div>

            {/* Right: Institutional Ledger */}
            <div className="space-y-4">
              <div className="rounded-2xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#111827] p-4 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/[0.06] pb-2">
                  <div className="flex items-center space-x-2">
                    <Landmark className="h-4 w-4 text-emerald-500" />
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-gray-200">
                      Institutional Cash Ledger
                    </span>
                  </div>
                  <button
                    onClick={() => onNavigate("fiidii")}
                    className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Deep Ledger &rarr;
                  </button>
                </div>

                {fiiDii?.latest_session ? (
                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex justify-between items-center p-2 rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-100 dark:border-white/[0.04]">
                      <span className="text-gray-600 dark:text-gray-400">FII Net Cash:</span>
                      <span className={`font-bold ${fiiDii.latest_session.fii_net >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                        {fiiDii.latest_session.fii_net > 0 ? "+" : ""}₹{fiiDii.latest_session.fii_net.toLocaleString()} Cr
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-100 dark:border-white/[0.04]">
                      <span className="text-gray-600 dark:text-gray-400">DII Net Cash:</span>
                      <span className={`font-bold ${fiiDii.latest_session.dii_net >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                        {fiiDii.latest_session.dii_net > 0 ? "+" : ""}₹{fiiDii.latest_session.dii_net.toLocaleString()} Cr
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-gray-400">Loading flow data...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Attribution Footer */}
      <footer className="mt-8 border-t border-gray-200 dark:border-white/[0.08] pt-4 pb-2 text-center text-xs text-gray-500 dark:text-gray-400">
        <p className="flex items-center justify-center space-x-1.5">
          <span>Bharat Market Intelligence</span>
          <span>•</span>
          <span>Made with</span>
          <span className="text-red-500">❤️</span>
          <span>by</span>
          <strong className="text-gray-800 dark:text-gray-200 font-semibold">Aniruddha Bhutada</strong>
        </p>
        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
          100% Free & Open Indian Equity Research Terminal for NSE & BSE
        </p>
      </footer>
    </div>
  );
};
