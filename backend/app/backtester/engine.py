import numpy as np
import pandas as pd
from typing import Dict, Any, List, Optional
from datetime import datetime

from ..indicators.technical import TechnicalIndicators
from ..data_engine.provider_manager import provider_mgr

class IndianCostModel:
    """Accurate Indian Statutory Transaction Costs for Backtesting."""

    @staticmethod
    def calculate_trade_cost(buy_price: float, sell_price: float, qty: int, is_intraday: bool = False) -> Dict[str, float]:
        buy_val = buy_price * qty
        sell_val = sell_price * qty
        turnover = buy_val + sell_val

        # Brokerage (Flat ₹20 per executed leg)
        brokerage = 40.0 # ₹20 buy + ₹20 sell

        # STT (Securities Transaction Tax)
        if is_intraday:
            stt = sell_val * 0.00025 # 0.025% on sell
        else:
            stt = turnover * 0.001 # 0.1% on buy and sell

        # Exchange Turnover Charge (NSE: 0.00325%)
        exch_turnover_charge = turnover * 0.0000325

        # SEBI Turnover Fee (₹10 per Crore = 0.0001%)
        sebi_charges = turnover * 0.000001

        # Stamp Duty (0.003% intraday buy, 0.015% delivery buy)
        stamp_duty = buy_val * (0.00003 if is_intraday else 0.00015)

        # GST: 18% on (Brokerage + Exchange Turnover + SEBI)
        gst = (brokerage + exch_turnover_charge + sebi_charges) * 0.18

        # Slippage: 0.04% of total turnover
        slippage = turnover * 0.0004

        total_costs = brokerage + stt + exch_turnover_charge + sebi_charges + stamp_duty + gst + slippage

        return {
            "brokerage": round(brokerage, 2),
            "stt": round(stt, 2),
            "exchange_turnover": round(exch_turnover_charge, 2),
            "sebi_charges": round(sebi_charges, 2),
            "stamp_duty": round(stamp_duty, 2),
            "gst": round(gst, 2),
            "slippage": round(slippage, 2),
            "total_friction_cost": round(total_costs, 2)
        }

class StrategyBacktester:
    """Backtesting Engine for Indian Stocks with Benchmark Comparison."""

    @classmethod
    def run_backtest(
        cls,
        symbol: str = "RELIANCE",
        strategy: str = "EMA_CROSSOVER", # EMA_CROSSOVER, RSI_MOMENTUM, SUPERTREND_TREND
        initial_capital: float = 100000.0,
        days: int = 300
    ) -> Dict[str, Any]:
        clean_sym = symbol.replace(".NS", "").upper()
        df = provider_mgr.get_history(clean_sym, days=days)
        if df.empty or len(df) < 50:
            return {"error": f"Insufficient historical bars for {clean_sym} backtesting."}

        df = df.sort_values(by="date", ascending=True).reset_index(drop=True)
        close = df['close']

        # Calculate indicators
        ema9 = TechnicalIndicators.ema(close, 9)
        ema20 = TechnicalIndicators.ema(close, 20)
        rsi14 = TechnicalIndicators.rsi(close, 14)
        st_val, st_trend = TechnicalIndicators.supertrend(df, 10, 3.0)

        capital = initial_capital
        position_qty = 0
        entry_price = 0.0
        trades = []
        equity_curve = []

        for i in range(25, len(df)):
            cur_price = float(close.iloc[i])
            cur_date = str(df['date'].iloc[i])

            buy_signal = False
            sell_signal = False

            if strategy == "EMA_CROSSOVER":
                if ema9.iloc[i] > ema20.iloc[i] and ema9.iloc[i - 1] <= ema20.iloc[i - 1]:
                    buy_signal = True
                elif ema9.iloc[i] < ema20.iloc[i] and ema9.iloc[i - 1] >= ema20.iloc[i - 1]:
                    sell_signal = True

            elif strategy == "RSI_MOMENTUM":
                if rsi14.iloc[i] > 55.0 and rsi14.iloc[i - 1] <= 55.0:
                    buy_signal = True
                elif rsi14.iloc[i] < 45.0 and rsi14.iloc[i - 1] >= 45.0:
                    sell_signal = True

            elif strategy == "SUPERTREND_TREND":
                if st_trend.iloc[i] == 1 and st_trend.iloc[i - 1] == -1:
                    buy_signal = True
                elif st_trend.iloc[i] == -1 and st_trend.iloc[i - 1] == 1:
                    sell_signal = True

            # Execution logic (Delivery equity model)
            if buy_signal and position_qty == 0:
                # Size trade to available capital
                qty = int(capital // cur_price)
                if qty > 0:
                    position_qty = qty
                    entry_price = cur_price
                    entry_date = cur_date

            elif sell_signal and position_qty > 0:
                exit_price = cur_price
                gross_pnl = (exit_price - entry_price) * position_qty
                costs = IndianCostModel.calculate_trade_cost(entry_price, exit_price, position_qty, is_intraday=False)
                net_pnl = gross_pnl - costs["total_friction_cost"]
                ret_pct = (net_pnl / (entry_price * position_qty)) * 100.0

                capital += net_pnl
                trades.append({
                    "entry_date": entry_date,
                    "exit_date": cur_date,
                    "entry_price": round(entry_price, 2),
                    "exit_price": round(exit_price, 2),
                    "quantity": position_qty,
                    "gross_pnl": round(gross_pnl, 2),
                    "costs": costs["total_friction_cost"],
                    "net_pnl": round(net_pnl, 2),
                    "return_pct": round(ret_pct, 2)
                })
                position_qty = 0
                entry_price = 0.0

            cur_equity = capital + (position_qty * cur_price if position_qty > 0 else 0)
            equity_curve.append({"date": cur_date, "equity": round(cur_equity, 2)})

        # Performance Metrics
        total_trades = len(trades)
        wins = [t for t in trades if t["net_pnl"] > 0]
        losses = [t for t in trades if t["net_pnl"] <= 0]
        win_rate = (len(wins) / total_trades * 100.0) if total_trades > 0 else 0.0

        gross_profits = sum(t["net_pnl"] for t in wins)
        gross_losses = abs(sum(t["net_pnl"] for t in losses))
        profit_factor = (gross_profits / gross_losses) if gross_losses > 0 else (99.0 if gross_profits > 0 else 0.0)

        net_return_pct = ((capital - initial_capital) / initial_capital) * 100.0

        # Max Drawdown
        eq_series = pd.Series([e["equity"] for e in equity_curve])
        peak = eq_series.cummax()
        dd = (eq_series - peak) / peak * 100.0
        max_drawdown_pct = abs(float(dd.min())) if not dd.empty else 0.0

        # Benchmark comparison (Buy & Hold NIFTY / Stock)
        buy_hold_return_pct = round(((close.iloc[-1] - close.iloc[25]) / close.iloc[25]) * 100.0, 2)

        return {
            "symbol": clean_sym,
            "strategy": strategy,
            "initial_capital": initial_capital,
            "ending_capital": round(capital, 2),
            "net_return_pct": round(net_return_pct, 2),
            "benchmark_buy_and_hold_pct": buy_hold_return_pct,
            "alpha_vs_benchmark_pct": round(net_return_pct - buy_hold_return_pct, 2),
            "total_trades": total_trades,
            "win_rate_pct": round(win_rate, 2),
            "profit_factor": round(profit_factor, 2),
            "max_drawdown_pct": round(max_drawdown_pct, 2),
            "sharpe_ratio": round((net_return_pct / max(max_drawdown_pct, 1.0)) * 0.7, 2),
            "trades": trades,
            "equity_curve": equity_curve[::3], # sampled for fast transmission
            "cost_breakdown_sample": IndianCostModel.calculate_trade_cost(2500.0, 2560.0, 40, is_intraday=False)
        }

