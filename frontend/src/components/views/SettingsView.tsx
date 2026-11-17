"use client";

import React, { useEffect, useState } from "react";
import { Settings, Cpu, Clock, History, Play, CheckCircle, RefreshCw, BarChart, Sun, Moon, Palette, Globe, CheckCircle2, AlertCircle, Heart } from "lucide-react";
import { api, getApiBase, DEFAULT_CLOUD_API } from "@/lib/api";
import { useTheme } from "@/context/ThemeContext";

export const SettingsView: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [settingsData, setSettingsData] = useState<any>(null);
  const [jobHistory, setJobHistory] = useState<any[]>([]);
  const [aiProvider, setAiProvider] = useState("rule_based");
  const [geminiKey, setGeminiKey] = useState("");
  const [saveStatus, setSaveStatus] = useState("");

  // Backend connection state
  const [apiUrl, setApiUrl] = useState("");
  const [apiTestStatus, setApiTestStatus] = useState<"IDLE" | "TESTING" | "SUCCESS" | "ERROR">("IDLE");
  const [apiLatency, setApiLatency] = useState<number | null>(null);

  // Backtest state
  const [btSymbol, setBtSymbol] = useState("RELIANCE");
  const [btStrategy, setBtStrategy] = useState("EMA_CROSSOVER");
  const [btCapital, setBtCapital] = useState("100000");
  const [btResult, setBtResult] = useState<any>(null);
  const [btLoading, setBtLoading] = useState(false);

  const loadSettingsAndJobs = async () => {
    try {
      const [sRes, jRes] = await Promise.all([
        api.getSettings(),
        api.getJobHistory()
      ]);
      setSettingsData(sRes);
      setAiProvider(sRes.default_ai_provider || "rule_based");
      setJobHistory(jRes);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadSettingsAndJobs();
    setApiUrl(getApiBase());
  }, []);

  const handleTestApi = async () => {
    setApiTestStatus("TESTING");
    const start = performance.now();
    try {
      const target = apiUrl.replace(/\/+$/, "");
      const res = await fetch(`${target}/health`, { signal: AbortSignal.timeout(8000) });
      if (res.ok) {
        setApiLatency(Math.round(performance.now() - start));
        setApiTestStatus("SUCCESS");
      } else {
        setApiTestStatus("ERROR");
      }
    } catch (e) {
      setApiTestStatus("ERROR");
    }
  };

  const handleSaveApiUrl = () => {
    if (apiUrl) {
      localStorage.setItem("bmi_api_url", apiUrl.trim());
      window.location.reload();
    }
  };

  const handleResetApiUrl = () => {
    localStorage.removeItem("bmi_api_url");
    setApiUrl(DEFAULT_CLOUD_API);
    window.location.reload();
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus("Saving...");
    try {
      await api.updateSettings({
        default_ai_provider: aiProvider,
        gemini_api_key: geminiKey
      });
      setSaveStatus("Settings saved successfully.");
      setTimeout(() => setSaveStatus(""), 3000);
      loadSettingsAndJobs();
    } catch (e) {
      setSaveStatus("Failed to save settings.");
    }
  };

  const handleRunBacktest = async (e: React.FormEvent) => {
    e.preventDefault();
    setBtLoading(true);
    try {
      const res = await api.runBacktest({
        symbol: btSymbol.trim().toUpperCase(),
        strategy: btStrategy,
        initial_capital: parseFloat(btCapital),
        days: 300
      });
      setBtResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setBtLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-gray-800 pb-3">
        <div className="flex items-center space-x-2">
          <Settings className="h-5 w-5 text-blue-400" />
          <h1 className="text-base font-bold uppercase tracking-wider text-gray-100">
            Platform Settings & Quantitative Backtesting Lab
          </h1>
        </div>
        <p className="text-xs text-gray-400 mt-0.5">
          Configure offline deterministic AI models, scheduler intervals, and simulate technical strategies with Indian cost friction.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Col: Connection, Appearance, AI & Scheduling Settings */}
        <div className="space-y-4">
          {/* Backend Data Engine & Cloud API Connection */}
          <div className="rounded-lg border border-gray-800 bg-[#111827] p-4 shadow">
            <div className="flex items-center space-x-2 border-b border-gray-800 pb-2 mb-3">
              <Globe className="h-4 w-4 text-emerald-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-200">
                Backend Data Engine & Cloud API Connection
              </h3>
            </div>
            <p className="text-xs text-gray-400 mb-3">
              Live Indian market data (NSE/BSE quotes, DuckDB time-series, and technical indicators) are fetched from this FastAPI endpoint.
            </p>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-gray-400 font-semibold">Active Backend URL</label>
                <div className="flex space-x-2 mt-1">
                  <input
                    type="text"
                    value={apiUrl}
                    onChange={(e) => setApiUrl(e.target.value)}
                    placeholder="https://bharat-market-intelligence.onrender.com/api"
                    className="flex-1 rounded bg-gray-900 border border-gray-800 p-2 text-gray-200 font-mono text-[11px] focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleTestApi}
                    className="rounded border border-gray-700 bg-gray-800 px-3 py-1.5 text-xs font-semibold text-gray-200 hover:bg-gray-700 transition"
                  >
                    {apiTestStatus === "TESTING" ? "Testing..." : "Test"}
                  </button>
                </div>
              </div>

              {apiTestStatus === "SUCCESS" && (
                <div className="flex items-center space-x-1.5 text-emerald-400 font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Connected! Backend is healthy and responding ({apiLatency}ms).</span>
                </div>
              )}

              {apiTestStatus === "ERROR" && (
                <div className="flex items-center space-x-1.5 text-amber-400 font-medium">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>Backend not responding. Render may be waking up (wait 30s) or check URL.</span>
                </div>
              )}

              <div className="flex space-x-2 pt-1">
                <button
                  type="button"
                  onClick={handleSaveApiUrl}
                  className="rounded bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-500 transition"
                >
                  Save & Apply
                </button>
                <button
                  type="button"
                  onClick={handleResetApiUrl}
                  className="rounded border border-gray-800 bg-gray-900 px-3 py-1.5 text-xs text-gray-400 hover:text-gray-200 transition"
                >
                  Reset to Default Cloud
                </button>
              </div>
            </div>
          </div>

          {/* Appearance & Theme Selector */}
          <div className="rounded-lg border border-gray-800 bg-[#111827] p-4 shadow">
            <div className="flex items-center space-x-2 border-b border-gray-800 pb-2 mb-3">
              <Palette className="h-4 w-4 text-purple-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-200">
                Workstation Display Theme
              </h3>
            </div>
            <p className="text-xs text-gray-400 mb-3">
              Choose your visual mode. High-contrast Light Mode is ideal for daylight, while Dark Mode provides the institutional terminal experience.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={`flex flex-col items-center justify-center rounded-lg border p-3 text-xs font-semibold transition ${
                  theme === "dark"
                    ? "border-blue-500 bg-blue-950/40 text-blue-300 ring-1 ring-blue-500"
                    : "border-gray-800 bg-gray-900/60 text-gray-400 hover:border-gray-700 hover:text-gray-200"
                }`}
              >
                <Moon className="h-5 w-5 mb-1.5 text-blue-400" />
                <span>Dark Terminal</span>
                <span className="text-[10px] text-gray-500 font-normal mt-0.5">Obsidian Navy (Default)</span>
              </button>

              <button
                type="button"
                onClick={() => setTheme("light")}
                className={`flex flex-col items-center justify-center rounded-lg border p-3 text-xs font-semibold transition ${
                  theme === "light"
                    ? "border-blue-500 bg-blue-500/10 text-blue-600 ring-1 ring-blue-500"
                    : "border-gray-800 bg-gray-900/60 text-gray-400 hover:border-gray-700 hover:text-gray-200"
                }`}
              >
                <Sun className="h-5 w-5 mb-1.5 text-amber-500" />
                <span>Light Executive</span>
                <span className="text-[10px] text-gray-500 font-normal mt-0.5">High-Contrast White</span>
              </button>
            </div>
          </div>

          {/* AI Settings Box */}
          <div className="rounded-lg border border-gray-800 bg-[#111827] p-4 shadow">
            <div className="flex items-center space-x-2 border-b border-gray-800 pb-2 mb-3">
              <Cpu className="h-4 w-4 text-blue-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-200">
                Interchangeable AI Research Provider
              </h3>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-3 text-xs">
              <div>
                <label className="text-gray-400 font-semibold">Active AI Engine</label>
                <select
                  value={aiProvider}
                  onChange={(e) => setAiProvider(e.target.value)}
                  className="w-full mt-1 rounded bg-gray-900 border border-gray-800 p-2 text-gray-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="rule_based">Rule-Based Deterministic Analyst (100% Offline, Zero API Key)</option>
                  <option value="gemini">Google Gemini Free-Tier (User API Key)</option>
                  <option value="ollama">Local Ollama LLM (Offline llama3.2)</option>
                </select>
                <p className="text-[10px] text-gray-500 mt-1">
                  * Note: The platform operates completely without an AI key. AI provides qualitative explanations of verified calculations.
                </p>
              </div>

              {aiProvider === "gemini" && (
                <div>
                  <label className="text-gray-400 font-semibold">Google Gemini API Key (Optional)</label>
                  <input
                    type="password"
                    placeholder="Enter your free-tier Gemini API key..."
                    value={geminiKey}
                    onChange={(e) => setGeminiKey(e.target.value)}
                    className="w-full mt-1 rounded bg-gray-900 border border-gray-800 p-2 text-gray-200 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                {saveStatus && (
                  <span className="text-xs font-semibold text-emerald-400">{saveStatus}</span>
                )}
                <button
                  type="submit"
                  className="rounded bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-blue-500 transition ml-auto"
                >
                  Save Configuration
                </button>
              </div>
            </form>
          </div>

          {/* Scheduled Cycles & Timings */}
          <div className="rounded-lg border border-gray-800 bg-[#111827] p-4 shadow">
            <div className="flex items-center space-x-2 border-b border-gray-800 pb-2 mb-3">
              <Clock className="h-4 w-4 text-emerald-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-200">
                Automated Indian Market Schedule (Asia/Kolkata)
              </h3>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center rounded bg-gray-900/60 p-2 border border-gray-800">
                <span className="text-gray-300 font-medium">Morning Pre-Market Cycle</span>
                <span className="font-mono font-bold text-amber-400">08:30 IST</span>
              </div>
              <div className="flex justify-between items-center rounded bg-gray-900/60 p-2 border border-gray-800">
                <span className="text-gray-300 font-medium">Intraday Monitoring Window</span>
                <span className="font-mono font-bold text-emerald-400">09:15 - 15:30 IST (Every 15m)</span>
              </div>
              <div className="flex justify-between items-center rounded bg-gray-900/60 p-2 border border-gray-800">
                <span className="text-gray-300 font-medium">Evening Post-Market Research</span>
                <span className="font-mono font-bold text-indigo-400">15:45 - 21:00 IST</span>
              </div>
              <div className="flex justify-between items-center rounded bg-gray-900/60 p-2 border border-gray-800">
                <span className="text-gray-300 font-medium">Daily Screener Auto-Scan</span>
                <span className="font-mono font-bold text-blue-400">18:00 IST</span>
              </div>
            </div>
          </div>

          {/* Job History */}
          <div className="rounded-lg border border-gray-800 bg-[#111827] p-4 shadow">
            <div className="flex items-center space-x-2 border-b border-gray-800 pb-2 mb-3">
              <History className="h-4 w-4 text-indigo-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-200">
                Recent Scheduled Job Runs
              </h3>
            </div>

            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {jobHistory.length === 0 ? (
                <p className="text-xs text-gray-500 italic">No job history recorded yet.</p>
              ) : (
                jobHistory.map((j) => (
                  <div
                    key={j.id}
                    className="flex items-center justify-between rounded bg-gray-900/60 p-2 text-xs border border-gray-800"
                  >
                    <div>
                      <span className="font-semibold text-gray-200">{j.job_name}</span>
                      <p className="text-[10px] text-gray-500">{j.run_time}</p>
                    </div>
                    <span
                      className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        j.status === "SUCCESS"
                          ? "bg-emerald-950 text-emerald-400"
                          : j.status === "SKIPPED"
                          ? "bg-gray-800 text-gray-400"
                          : "bg-red-950 text-red-400"
                      }`}
                    >
                      {j.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Quantitative Strategy Backtesting Simulator */}
        <div className="rounded-lg border border-gray-800 bg-[#111827] p-4 shadow space-y-4">
          <div className="flex items-center space-x-2 border-b border-gray-800 pb-2">
            <BarChart className="h-4 w-4 text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-200">
              Indian Equity Strategy Backtesting Simulator
            </h3>
          </div>

          <form onSubmit={handleRunBacktest} className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-gray-400 font-semibold">Stock Symbol</label>
              <input
                type="text"
                value={btSymbol}
                onChange={(e) => setBtSymbol(e.target.value)}
                className="w-full mt-1 rounded bg-gray-900 border border-gray-800 p-1.5 text-gray-200 font-mono"
              />
            </div>
            <div>
              <label className="text-gray-400 font-semibold">Strategy Model</label>
              <select
                value={btStrategy}
                onChange={(e) => setBtStrategy(e.target.value)}
                className="w-full mt-1 rounded bg-gray-900 border border-gray-800 p-1.5 text-gray-200"
              >
                <option value="EMA_CROSSOVER">EMA 9 / 20 Crossover</option>
                <option value="RSI_MOMENTUM">RSI 14 Momentum Shift</option>
                <option value="SUPERTREND_TREND">Supertrend (10, 3) Trend Follow</option>
              </select>
            </div>
            <div>
              <label className="text-gray-400 font-semibold">Initial Capital (₹)</label>
              <input
                type="number"
                value={btCapital}
                onChange={(e) => setBtCapital(e.target.value)}
                className="w-full mt-1 rounded bg-gray-900 border border-gray-800 p-1.5 text-gray-200 font-mono"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={btLoading}
                className="w-full flex items-center justify-center space-x-1.5 rounded bg-emerald-600 p-2 text-xs font-semibold text-white hover:bg-emerald-500 transition"
              >
                <Play className="h-3.5 w-3.5" />
                <span>{btLoading ? "Simulating..." : "Execute Simulation"}</span>
              </button>
            </div>
          </form>

          {/* Backtest Results */}
          {btResult && (
            <div className="space-y-3 border-t border-gray-800 pt-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="rounded bg-gray-900 p-2">
                  <span className="text-[10px] text-gray-500">Net Return</span>
                  <p
                    className={`font-mono font-bold mt-0.5 ${
                      btResult.net_return_pct >= 0 ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {btResult.net_return_pct > 0 ? "+" : ""}{btResult.net_return_pct}%
                  </p>
                </div>
                <div className="rounded bg-gray-900 p-2">
                  <span className="text-[10px] text-gray-500">Win Rate</span>
                  <p className="font-mono font-bold text-gray-200 mt-0.5">{btResult.win_rate_pct}%</p>
                </div>
                <div className="rounded bg-gray-900 p-2">
                  <span className="text-[10px] text-gray-500">Profit Factor</span>
                  <p className="font-mono font-bold text-blue-400 mt-0.5">{btResult.profit_factor}</p>
                </div>
                <div className="rounded bg-gray-900 p-2">
                  <span className="text-[10px] text-gray-500">Max Drawdown</span>
                  <p className="font-mono font-bold text-red-400 mt-0.5">-{btResult.max_drawdown_pct}%</p>
                </div>
              </div>

              {/* Statutory Indian Cost Modeling Note */}
              <div className="rounded bg-gray-900/60 p-2.5 text-[10px] text-gray-400 border border-gray-800 space-y-1">
                <p className="font-bold text-gray-300">
                  Indian Cost Modeling Applied: ₹40 Brokerage + 0.1% STT + NSE Turnover + Stamp Duty + 18% GST + Slippage
                </p>
                <p className="text-gray-500">
                  Sample round-trip friction cost on 40 shares: ₹{btResult.cost_breakdown_sample?.total_friction_cost}
                </p>
              </div>

              {/* Recent Trade History */}
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                  Executed Simulated Trades ({btResult.total_trades} Total)
                </h4>
                <div className="max-h-48 overflow-y-auto rounded border border-gray-800">
                  <table className="w-full text-left text-[11px] font-mono">
                    <thead className="bg-gray-900 text-gray-400">
                      <tr>
                        <th className="p-1.5">Entry Date</th>
                        <th className="p-1.5">Exit Date</th>
                        <th className="p-1.5 text-right">Entry</th>
                        <th className="p-1.5 text-right">Exit</th>
                        <th className="p-1.5 text-right">Net P&L (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {(btResult.trades || []).slice(-6).map((t: any, idx: number) => {
                        const win = t.net_pnl > 0;
                        return (
                          <tr key={idx} className="hover:bg-gray-800/40">
                            <td className="p-1.5 text-gray-400">{t.entry_date}</td>
                            <td className="p-1.5 text-gray-400">{t.exit_date}</td>
                            <td className="p-1.5 text-right text-gray-300">₹{t.entry_price}</td>
                            <td className="p-1.5 text-right text-gray-300">₹{t.exit_price}</td>
                            <td
                              className={`p-1.5 text-right font-bold ${
                                win ? "text-emerald-400" : "text-red-400"
                              }`}
                            >
                              {win ? "+" : ""}₹{t.net_pnl}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* About Project & Author Card */}
      <div className="rounded-lg border border-gray-800 bg-[#111827] p-4 shadow text-center">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-200">
          Bharat Market Intelligence
        </h3>
        <p className="text-xs text-gray-300 mt-1 flex items-center justify-center space-x-1">
          <span>Architected, Engineered &amp; Developed with</span>
          <Heart className="h-3.5 w-3.5 text-red-500 fill-current inline mx-0.5" />
          <span>by</span>
          <strong className="text-blue-400 font-semibold">Aniruddha Bhutada</strong>
        </p>
        <p className="text-[11px] text-gray-500 mt-1">
          Open-Source Institutional Equity Research Platform • NSE & BSE India
        </p>
      </div>
    </div>
  );
};

