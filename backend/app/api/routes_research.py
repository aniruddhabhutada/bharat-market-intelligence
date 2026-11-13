from fastapi import APIRouter, HTTPException, Query
from typing import Optional, Dict, Any
from ..analysis.fundamental_analyzer import ComprehensiveStockResearch
from ..screener.scanner import scanner
from ..data_engine.provider_manager import provider_mgr

router = APIRouter(prefix="/api", tags=["Equity Research & Discovery"])

@router.get("/stock/{symbol}")
def get_stock_research_dossier(symbol: str):
    """Produces deep equity research dossier including 5-year financials, technicals, and verdicts."""
    dossier = ComprehensiveStockResearch.get_stock_dossier(symbol)
    if "error" in dossier:
        raise HTTPException(status_code=404, detail=dossier["error"])
    return dossier

@router.get("/screener/run")
def run_stock_screener(
    scan_type: str = Query(default="MOMENTUM", description="MOMENTUM, BREAKOUT, REVERSAL, QUALITY, VALUE, VOLUME"),
    universe: str = Query(default="NIFTY 50", description="NIFTY 50, NIFTY 100, NIFTY 500")
):
    """Executes quantitative or fundamental scans with transparent factor scoring."""
    return scanner.run_scan(scan_type=scan_type.upper(), universe=universe.upper())

@router.get("/news")
def get_news_feed(limit: int = Query(default=25, le=100)):
    """Returns curated, categorized, and deduplicated financial news from trusted feeds."""
    return provider_mgr.get_news(limit=limit)

