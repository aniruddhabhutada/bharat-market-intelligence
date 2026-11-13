from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List, Dict, Any
from ..core.calendar import IndianMarketCalendar
from ..data_engine.provider_manager import provider_mgr
from ..reports.generator import DailyReportGenerator

router = APIRouter(prefix="/api", tags=["Market & Live Feeds"])

@router.get("/market-status")
def get_market_status():
    """Returns current market session status in IST."""
    return IndianMarketCalendar.get_market_status()

@router.get("/indices")
def get_indices():
    """Returns real-time or last available benchmark and sectoral index quotes."""
    return provider_mgr.get_indices()

@router.get("/quote/{symbol}")
def get_quote(symbol: str):
    """Returns real-time or last available quote for any Indian stock."""
    q = provider_mgr.get_quote(symbol)
    if not q:
        raise HTTPException(status_code=404, detail=f"Quote for '{symbol}' not found.")
    return q

@router.get("/chart/{symbol}")
def get_chart_data(symbol: str, days: int = Query(default=120, le=500)):
    """Returns OHLCV candle series for interactive charting."""
    df = provider_mgr.get_history(symbol, days=days)
    if df.empty:
        raise HTTPException(status_code=404, detail=f"Historical data for '{symbol}' unavailable.")
    
    candles = []
    for _, row in df.iterrows():
        candles.append({
            "time": str(row["date"])[:10],
            "open": float(row["open"]),
            "high": float(row["high"]),
            "low": float(row["low"]),
            "close": float(row["close"]),
            "volume": int(row["volume"])
        })
    return {
        "symbol": symbol.upper(),
        "count": len(candles),
        "candles": candles
    }

@router.get("/premarket")
def get_premarket_intelligence():
    """Returns daily pre-market research dossier."""
    return DailyReportGenerator.generate_morning_report()

