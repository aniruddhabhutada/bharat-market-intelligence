"use client";

import React, { useState } from "react";

export interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface FinancialChartProps {
  symbol: string;
  candles?: CandleData[];
  height?: number;
}

export const FinancialChart: React.FC<FinancialChartProps> = ({
  symbol,
  candles,
  height = 360
}) => {
  const [chartType, setChartType] = useState<"CANDLE" | "AREA">("CANDLE");
  const [timeframe, setTimeframe] = useState<number>(60); // 30, 60, 120 bars
  const [showSMA20, setShowSMA20] = useState(true);

  if (!candles || candles.length === 0) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-2xl border border-[#E5EAF2] dark:border-[#1F2E47] bg-[#F5F7FB] dark:bg-gray-900/50 text-xs text-[#667085] dark:text-gray-500">
        No historical chart bars available for {symbol}.
      </div>
    );
  }

  const activeCandles = candles.slice(-timeframe);
  const minPrice = Math.min(...activeCandles.map((c) => c.low)) * 0.995;
  const maxPrice = Math.max(...activeCandles.map((c) => c.high)) * 1.005;
  const maxVol = Math.max(...activeCandles.map((c) => c.volume)) || 1;

  // Highest and lowest candle indices
  let highestIdx = 0;
  let lowestIdx = 0;
  activeCandles.forEach((c, i) => {
    if (c.high > activeCandles[highestIdx].high) highestIdx = i;
    if (c.low < activeCandles[lowestIdx].low) lowestIdx = i;
  });

  const width = 800; // SVG viewBox coordinate width
  const chartHeight = height - 70;
  const volHeight = 45;

  const getX = (index: number) => {
    const step = width / activeCandles.length;
    return index * step + step / 2;
  };

  const getY = (val: number) => {
    return chartHeight - ((val - minPrice) / (maxPrice - minPrice)) * chartHeight + 10;
  };

  const getVolY = (vol: number) => {
    return chartHeight + volHeight - (vol / maxVol) * volHeight;
  };

  // Calculate Simple 20-period Moving Average
  const smaPoints: { x: number; y: number }[] = [];
  activeCandles.forEach((c, idx) => {
    if (idx >= 19) {
      const slice = activeCandles.slice(idx - 19, idx + 1);
      const avg = slice.reduce((acc, curr) => acc + curr.close, 0) / 20;
      smaPoints.push({ x: getX(idx), y: getY(avg) });
    }
  });

  const smaPath = smaPoints.length
    ? "M " + smaPoints.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" L ")
    : "";

  const lineCoords = activeCandles.map((c, idx) => `${getX(idx).toFixed(1)} ${getY(c.close).toFixed(1)}`);
  const linePath = "M " + lineCoords.join(" L ");

  // Closed area polygon for AREA mode
  const firstX = getX(0).toFixed(1);
  const lastX = getX(activeCandles.length - 1).toFixed(1);
  const areaPath = `M ${firstX} ${chartHeight} L ${lineCoords.join(" L ")} L ${lastX} ${chartHeight} Z`;

  const lastCandle = activeCandles[activeCandles.length - 1];
  const isUp = lastCandle.close >= lastCandle.open;

  const startDate = activeCandles[0]?.time?.split("T")[0] || "";
  const endDate = lastCandle?.time?.split("T")[0] || "";

  return (
    <div className="glass-card rounded-2xl p-3.5 sm:p-4 shadow-sm">
      {/* Chart Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E5EAF2] dark:border-[#1F2E47] pb-2.5 mb-2.5">
        <div className="flex items-center space-x-2.5">
          <span className="font-extrabold text-sm sm:text-base text-[#172B4D] dark:text-[#F4F6FB] tracking-tight">{symbol}</span>
          <span className="text-xs sm:text-sm font-mono font-bold text-[#172B4D] dark:text-[#F4F6FB]">
            ₹{lastCandle.close.toFixed(2)}
          </span>
          <span
            className={`text-[11px] font-bold font-mono px-2 py-0.5 rounded-full ${
              isUp
                ? "bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60"
                : "bg-red-50 dark:bg-red-950/80 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/60"
            }`}
          >
            {isUp ? "▲" : "▼"} {((lastCandle.close - lastCandle.open) / lastCandle.open * 100).toFixed(2)}%
          </span>
        </div>

        <div className="flex items-center space-x-1.5 text-xs">
          {/* Timeframe buttons */}
          {[
            { label: "1M", count: 30 },
            { label: "3M", count: 60 },
            { label: "6M", count: 120 }
          ].map((tf) => (
            <button
              key={tf.count}
              onClick={() => setTimeframe(tf.count)}
              className={`rounded-lg px-2.5 py-1 text-[10px] font-bold transition active:scale-95 ${
                timeframe === tf.count
                  ? "bg-[#315EFB] text-white shadow-sm"
                  : "bg-[#F5F7FB] dark:bg-gray-800/80 text-[#667085] dark:text-gray-400 hover:text-[#172B4D] dark:hover:text-white border border-[#E5EAF2] dark:border-transparent"
              }`}
            >
              {tf.label}
            </button>
          ))}

          {/* Chart Type Toggle */}
          <button
            onClick={() => setChartType(chartType === "CANDLE" ? "AREA" : "CANDLE")}
            className="rounded-lg bg-[#F5F7FB] dark:bg-gray-800 px-2.5 py-1 text-[10px] font-bold text-[#172B4D] dark:text-gray-300 hover:text-[#315EFB] dark:hover:text-white border border-[#E5EAF2] dark:border-transparent transition active:scale-95"
          >
            {chartType === "CANDLE" ? "Candles" : "Area"}
          </button>

          {/* SMA20 Toggle */}
          <button
            onClick={() => setShowSMA20(!showSMA20)}
            className={`rounded-lg px-2.5 py-1 text-[10px] font-bold transition active:scale-95 ${
              showSMA20
                ? "bg-amber-500/10 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800/60"
                : "bg-[#F5F7FB] dark:bg-gray-800/80 text-[#667085] dark:text-gray-400 border border-[#E5EAF2] dark:border-transparent"
            }`}
          >
            SMA 20
          </button>
        </div>
      </div>

      {/* SVG Financial Canvas */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto select-none"
          style={{ maxHeight: height }}
        >
          <defs>
            {/* Glowing gradient for Area Chart */}
            <linearGradient id="chartAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#315EFB" stopOpacity="0.35" />
              <stop offset="60%" stopColor="#315EFB" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#315EFB" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines */}
          {[0.2, 0.4, 0.6, 0.8].map((ratio) => {
            const y = chartHeight * ratio;
            const priceLevel = maxPrice - (maxPrice - minPrice) * ratio;
            return (
              <g key={ratio}>
                <line x1="0" y1={y} x2={width} y2={y} stroke="#E5EAF2" className="stroke-[#E5EAF2] dark:stroke-[#1F2E47]" strokeDasharray="3 3" opacity={0.8} />
                <text x={width - 45} y={y - 3} fill="#8993A4" className="fill-[#8993A4] dark:fill-[#6C7A8E]" fontSize="9" textAnchor="end" fontFamily="monospace">
                  ₹{priceLevel.toFixed(1)}
                </text>
              </g>
            );
          })}

          {/* Volume Separator */}
          <line
            x1="0"
            y1={chartHeight}
            x2={width}
            y2={chartHeight}
            stroke="#E5EAF2"
            className="stroke-[#E5EAF2] dark:stroke-[#1F2E47]"
            strokeDasharray="2 2"
            opacity={0.8}
          />

          {/* Volume Profile Bars */}
          {activeCandles.map((c, i) => {
            const x = getX(i);
            const y = getVolY(c.volume);
            const h = chartHeight + volHeight - y;
            const green = c.close >= c.open;
            return (
              <rect
                key={`vol-${i}`}
                x={x - 2}
                y={y}
                width={Math.max(2, width / activeCandles.length - 2)}
                height={Math.max(1, h)}
                fill={green ? "#14866D" : "#D94B50"}
                opacity={0.25}
              />
            );
          })}

          {/* Area Chart Fill (when in AREA mode) */}
          {chartType === "AREA" && (
            <>
              <path d={areaPath} fill="url(#chartAreaGradient)" />
              <path d={linePath} fill="none" stroke="#315EFB" strokeWidth="2.5" />
            </>
          )}

          {/* Candlesticks (when in CANDLE mode) */}
          {chartType === "CANDLE" &&
            activeCandles.map((c, i) => {
              const x = getX(i);
              const openY = getY(c.open);
              const closeY = getY(c.close);
              const highY = getY(c.high);
              const lowY = getY(c.low);
              const green = c.close >= c.open;
              const barWidth = Math.max(3, width / activeCandles.length - 2);

              return (
                <g key={`candle-${i}`}>
                  {/* High/Low Wick */}
                  <line
                    x1={x}
                    y1={highY}
                    x2={x}
                    y2={lowY}
                    stroke={green ? "#14866D" : "#D94B50"}
                    strokeWidth="1.2"
                  />
                  {/* Real Body */}
                  <rect
                    x={x - barWidth / 2}
                    y={Math.min(openY, closeY)}
                    width={barWidth}
                    height={Math.max(2, Math.abs(closeY - openY))}
                    fill={green ? "#14866D" : "#D94B50"}
                    rx="1"
                  />
                </g>
              );
            })}

          {/* High Price Marker Tag */}
          <g transform={`translate(${getX(highestIdx)}, ${getY(activeCandles[highestIdx].high) - 12})`}>
            <rect x="-24" y="-8" width="48" height="14" rx="4" fill="#14866D" opacity={0.9} />
            <text x="0" y="2" fill="#FFFFFF" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              H: ₹{activeCandles[highestIdx].high.toFixed(0)}
            </text>
          </g>

          {/* Low Price Marker Tag */}
          <g transform={`translate(${getX(lowestIdx)}, ${getY(activeCandles[lowestIdx].low) + 14})`}>
            <rect x="-24" y="-7" width="48" height="14" rx="4" fill="#D94B50" opacity={0.9} />
            <text x="0" y="3" fill="#FFFFFF" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              L: ₹{activeCandles[lowestIdx].low.toFixed(0)}
            </text>
          </g>

          {/* SMA 20 Overlay Line */}
          {showSMA20 && smaPath && (
            <path d={smaPath} fill="none" stroke="#F59E0B" strokeWidth="1.8" opacity={0.85} strokeLinecap="round" />
          )}

          {/* Date Axis Markers */}
          <text x={getX(0)} y={chartHeight + volHeight + 14} fill="#8993A4" className="fill-[#8993A4] dark:fill-[#6C7A8E]" fontSize="9" fontFamily="monospace">
            {startDate}
          </text>
          <text x={getX(activeCandles.length - 1)} y={chartHeight + volHeight + 14} fill="#8993A4" className="fill-[#8993A4] dark:fill-[#6C7A8E]" fontSize="9" textAnchor="end" fontFamily="monospace">
            {endDate}
          </text>
        </svg>
      </div>
    </div>
  );
};
