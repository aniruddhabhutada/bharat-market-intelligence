import pytest
from datetime import date, datetime
import pandas as pd
import numpy as np

from backend.app.core.calendar import IndianMarketCalendar, NSE_HOLIDAYS
from backend.app.data_engine.validator import DataValidator
from backend.app.indicators.technical import TechnicalIndicators
from backend.app.analysis.scoring_engine import ResearchScoringEngine
from backend.app.backtester.engine import IndianCostModel
from backend.app.db.sqlite_db import init_sqlite_db, get_all_watchlists, save_watchlist

def test_sqlite_db_init():
    init_sqlite_db()
    watchlists = get_all_watchlists()
    assert len(watchlists) >= 1
    assert any("Nifty Core Leaders" in w["name"] for w in watchlists)

def test_market_calendar_holidays():
    # Republic day 2026 is a holiday
    is_hol, hol_name = IndianMarketCalendar.is_holiday(date(2026, 1, 26))
    assert is_hol is True
    assert "Republic Day" in hol_name

    # Weekend check
    assert IndianMarketCalendar.is_weekend(date(2026, 11, 14)) is True # Saturday
    assert IndianMarketCalendar.is_trading_day(date(2026, 11, 14)) is False

def test_data_validator_geometric_ohlc():
    # Valid OHLC
    valid, notes = DataValidator.validate_ohlc(100.0, 105.0, 98.0, 102.0, 50000)
    assert valid is True
    assert len(notes) == 0

    # Invalid: High lower than Open
    valid, notes = DataValidator.validate_ohlc(100.0, 95.0, 90.0, 92.0, 50000)
    assert valid is False
    assert any("High" in n for n in notes)

    # Invalid: Low higher than Close
    valid, notes = DataValidator.validate_ohlc(100.0, 110.0, 105.0, 102.0, 50000)
    assert valid is False
    assert any("Low" in n for n in notes)

    # Negative volume
    valid, notes = DataValidator.validate_ohlc(100.0, 105.0, 98.0, 102.0, -5)
    assert valid is False

def test_data_validator_circuit_jump():
    jump, msg = DataValidator.check_price_jump(130.0, 100.0, threshold_pct=20.0)
    assert jump is True
    assert "Abnormal price shift" in msg

    no_jump, msg = DataValidator.check_price_jump(102.0, 100.0, threshold_pct=20.0)
    assert no_jump is False

def test_technical_indicators_sma_rsi_macd():
    # Create sample synthetic OHLCV series
    np.random.seed(42)
    dates = pd.date_range("2026-01-01", periods=60)
    prices = 100.0 + np.cumsum(np.random.randn(60) * 1.5)
    df = pd.DataFrame({
        "open": prices * 0.99,
        "high": prices * 1.02,
        "low": prices * 0.98,
        "close": prices,
        "volume": np.random.randint(10000, 100000, size=60)
    }, index=dates)

    sma20 = TechnicalIndicators.sma(df["close"], 20)
    assert len(sma20) == 60
    assert not np.isnan(sma20.iloc[-1])

    rsi14 = TechnicalIndicators.rsi(df["close"], 14)
    assert len(rsi14) == 60
    assert 0.0 <= rsi14.iloc[-1] <= 100.0

    macd_l, signal_l, hist_l = TechnicalIndicators.macd(df["close"])
    assert not np.isnan(macd_l.iloc[-1])
    assert not np.isnan(signal_l.iloc[-1])

def test_indian_transaction_costs():
    cost = IndianCostModel.calculate_trade_cost(buy_price=2500.0, sell_price=2550.0, qty=40, is_intraday=False)
    assert cost["brokerage"] == 40.0 # ₹20 buy + ₹20 sell
    assert cost["stt"] > 0
    assert cost["total_friction_cost"] > 40.0

def test_research_scoring_engine():
    tech = {
        "ma_alignment": "STRONGLY_BULLISH",
        "rsi14": 62.0,
        "rs_vs_nifty": 3.2,
        "rvol": 1.9,
        "turnover": 45.0,
        "adx14": 28.0
    }
    fund = {
        "revenue_growth_yoy_pct": 18.0,
        "roe_pct": 21.0,
        "roce_pct": 24.0,
        "debt_to_equity": 0.2,
        "operating_cash_flow_cr": 450.0,
        "free_cash_flow_cr": 220.0,
        "pe_ratio": 21.5,
        "promoter_pledge_pct": 0.0
    }
    score_res = ResearchScoringEngine.evaluate_stock(tech, fund)
    assert score_res["technical_score"] >= 75.0
    assert score_res["fundamental_score"] >= 70.0
    assert score_res["category"] == "RESEARCH_PRIORITY"

