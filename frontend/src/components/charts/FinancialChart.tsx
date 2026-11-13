"use client";

import React, { useState } from "react";

interface Candle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface FinancialChartProps {
  symbol: string;
  candles: Candle[];
  height?: number;
}

export const FinancialChart: React.FC<FinancialChartProps> = ({
  symbol,
  candles,
  height = 360
}) => {
  const [chartType, setChartType] = useState<"CANDLE" | "LINE">("CANDLE");
  const [timeframe, setTimeframe] = useState<number>(60); // 30, 60, 120 bars
  const [showSMA20, setShowSMA20] = useState(true);

  if (!candles || candles.length === 0) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-lg border border-gray-800 bg-gray-900/50 text-xs text-gray-500">
        No historical chart bars available for {symbol}.
      </div>
    );
  }

  const activeCandles = candles.slice(-timeframe);
  const minPrice = Math.min(...activeCandles.map((c) => c.low)) * 0.995;
  const maxPrice = Math.max(...activeCandles.map((c) => c.high)) * 1.005;
  const maxVol = Math.max(...activeCandles.map((c) => c.volume)) || 1;

  const width = 800; // SVG viewBox coordinate width
  const chartHeight = height - 70;
  const volHeight = 50;

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

  const linePath = "M " + activeCandles.map((c, idx) => `${getX(idx).toFixed(1)} ${getY(c.close).toFixed(1)}`).join(" L ");

  const lastCandle = activeCandles[activeCandles.length - 1];
  const isUp = lastCandle.close >= lastCandle.open;

  return (
    <div className="rounded-lg border border-gray-800 bg-[#111827] p-3 shadow-lg">
      {/* Chart Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-800 pb-2.5 mb-2">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-sm text-gray-200">{symbol}</span>
          <span className="text-xs font-mono font-semibold text-gray-100">
            ₹{lastCandle.close.toFixed(2)}
          </span>
          <span
            className={`text-[11px] font-semibold px-1.5 py-0.5 rounded ${
              isUp ? "bg-emerald-950 text-emerald-400" : "bg-red-950 text-red-400"
            }`}
          >
            {isUp ? "▲" : "▼"} {((lastCandle.close - lastCandle.open) / lastCandle.open * 100).toFixed(2)}%
          </span>
        </div>

        <div className="flex items-center space-x-1.5 text-xs">
          {/* Timeframe buttons */}
          {[30, 60, 120].map((count) => (
            <button
              key={count}
              onClick={() => setTimeframe(count)}
              className={`rounded px-2 py-0.5 text-[10px] font-semibold transition ${
                timeframe === count ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"
              }`}
            >
              {count}D
            </button>
          ))}

          {/* Chart Type */}
          <button
            onClick={() => setChartType(chartType === "CANDLE" ? "LINE" : "CANDLE")}
            className="rounded bg-gray-800 px-2 py-0.5 text-[10px] font-semibold text-gray-300 hover:text-white"
          >
            {chartType}
          </button>

          {/* SMA20 Toggle */}
          <button
            onClick={() => setShowSMA20(!showSMA20)}
            className={`rounded px-2 py-0.5 text-[10px] font-semibold transition ${
              showSMA20 ? "bg-amber-950 text-amber-300 border border-amber-800/60" : "bg-gray-800 text-gray-400"
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
          {/* Horizontal Grid lines */}
          {[0.2, 0.4, 0.6, 0.8].map((ratio) => {
            const y = chartHeight * ratio;
            const priceLevel = maxPrice - (maxPrice - minPrice) * ratio;
            return (
              <g key={ratio}>
                <line x1="0" y1={y} x2={width} y2={y} stroke="#1f2937" strokeDasharray="3 3" />
                <text x={width - 50} y={y - 3} fill="#6b7280" fontSize="9" textAnchor="end">
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
            stroke="#374151"
            strokeDasharray="2 2"
          />

          {/* Volume Bars */}
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
                fill={green ? "#10b981" : "#ef4444"}
                opacity={0.35}
              />
            );
          })}

          {/* Candlesticks */}
          {chartType === "CANDLE" ? (
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
                  {/* Wick */}
                  <line
                    x1={x}
                    y1={highY}
                    x2={x}
                    y2={lowY}
                    stroke={green ? "#10b981" : "#ef4444"}
                    strokeWidth="1.2"
                  />
                  {/* Body */}
                  <rect
                    x={x - barWidth / 2}
                    y={Math.min(openY, closeY)}
                    width={barWidth}
                    height={Math.max(2, Math.abs(closeY - openY))}
                    fill={green ? "#10b981" : "#ef4444"}
                  />
                </g>
              );
            })
          ) : (
            <path d={linePath} fill="none" stroke="#3b82f6" strokeWidth="2" />
          )}

          {/* SMA 20 Line Overlay */}
          {showSMA20 && smaPath && (
            <path d={smaPath} fill="none" stroke="#f59e0b" strokeWidth="1.8" opacity={0.9} />
          )}
        </svg>
      </div>

      <div className="flex items-center justify-between text-[10px] text-gray-500 pt-1">
        <span>Start: {activeCandles[0].time}</span>
        {showSMA20 && <span className="text-amber-400 font-semibold">• SMA 20 (Orange)</span>}
        <span>Latest: {lastCandle.time}</span>
      </div>
    </div>
  );
};
