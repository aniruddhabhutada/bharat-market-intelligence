from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from ..db.sqlite_db import (
    get_all_watchlists, save_watchlist, delete_watchlist,
    get_portfolio_positions, add_portfolio_position, delete_portfolio_position
)
from ..backtester.engine import StrategyBacktester
from ..data_engine.provider_manager import provider_mgr

router = APIRouter(prefix="/api", tags=["User Watchlists & Portfolio"])

class WatchlistPayload(BaseModel):
    name: str
    symbols: List[str]

class PortfolioPayload(BaseModel):
    symbol: str
    purchase_price: float
    quantity: int
    sector: Optional[str] = ""
    notes: Optional[str] = ""
    purchase_date: Optional[str] = ""

class BacktestPayload(BaseModel):
    symbol: str = "RELIANCE"
    strategy: str = "EMA_CROSSOVER"
    initial_capital: float = 100000.0
    days: int = 300

@router.get("/watchlists")
def list_watchlists():
    return get_all_watchlists()

@router.post("/watchlists")
def create_or_update_watchlist(payload: WatchlistPayload):
    return save_watchlist(payload.name, [s.upper() for s in payload.symbols])

@router.delete("/watchlists/{name}")
def remove_watchlist(name: str):
    delete_watchlist(name)
    return {"message": f"Watchlist '{name}' deleted."}

@router.get("/portfolio")
def list_portfolio():
    positions = get_portfolio_positions()
    # Enrich with live price & unrealized P&L
    enriched = []
    total_invested = 0.0
    total_current = 0.0

    for pos in positions:
        sym = pos["symbol"]
        quote = provider_mgr.get_quote(sym)
        ltp = quote.close if quote else pos["purchase_price"]
        invested = pos["purchase_price"] * pos["quantity"]
        curr_val = ltp * pos["quantity"]
        pnl = curr_val - invested
        pnl_pct = (pnl / invested * 100.0) if invested > 0 else 0.0

        total_invested += invested
        total_current += curr_val

        enriched.append({
            **pos,
            "current_price": ltp,
            "invested_value": round(invested, 2),
            "current_value": round(curr_val, 2),
            "unrealized_pnl": round(pnl, 2),
            "unrealized_pnl_pct": round(pnl_pct, 2)
        })

    total_pnl = total_current - total_invested
    total_pnl_pct = (total_pnl / total_invested * 100.0) if total_invested > 0 else 0.0

    return {
        "positions": enriched,
        "summary": {
            "total_invested": round(total_invested, 2),
            "total_current_value": round(total_current, 2),
            "total_unrealized_pnl": round(total_pnl, 2),
            "total_unrealized_pnl_pct": round(total_pnl_pct, 2),
            "position_count": len(positions)
        }
    }

@router.post("/portfolio")
def add_position(payload: PortfolioPayload):
    add_portfolio_position(
        symbol=payload.symbol,
        purchase_price=payload.purchase_price,
        quantity=payload.quantity,
        sector=payload.sector or "",
        notes=payload.notes or "",
        purchase_date=payload.purchase_date or ""
    )
    return {"message": f"Position added for {payload.symbol}."}

@router.delete("/portfolio/{position_id}")
def remove_position(position_id: int):
    delete_portfolio_position(position_id)
    return {"message": f"Position {position_id} removed."}

@router.post("/backtest")
def run_backtest(payload: BacktestPayload):
    """Simulates trading strategy on Indian equities with statutory brokerage, STT, and slippage."""
    return StrategyBacktester.run_backtest(
        symbol=payload.symbol,
        strategy=payload.strategy,
        initial_capital=payload.initial_capital,
        days=payload.days
    )

