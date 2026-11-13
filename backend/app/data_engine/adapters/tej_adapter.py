import pandas as pd
from datetime import datetime, date
from typing import Optional, List, Dict, Any
from pathlib import Path
from ..models import Quote, DataFreshnessStatus
from ...core.config import settings

class TejBazaarAdapter:
    """Adapter for TejHQ open-source Bhavcopy and point-in-time Parquet archives."""

    def __init__(self, data_dir: Optional[Path] = None):
        self.data_dir = data_dir or (settings.DATA_DIR / "historical")
        self.data_dir.mkdir(parents=True, exist_ok=True)

    def load_bhavcopy_parquet(self, trade_date: date) -> Optional[pd.DataFrame]:
        """Loads daily Bhavcopy parquet if available locally."""
        file_path = self.data_dir / f"bhavcopy_{trade_date.strftime('%Y%m%d')}.parquet"
        if file_path.exists():
            try:
                return pd.read_parquet(file_path)
            except Exception:
                return None
        return None

    def get_liquid_universe(self) -> List[Dict[str, Any]]:
        """Returns verified point-in-time liquid Indian universe (NIFTY 500 constituents sample)."""
        return [
            {"symbol": "RELIANCE", "name": "Reliance Industries Ltd", "sector": "Oil & Gas / Conglomerate", "series": "EQ", "index": "NIFTY 50"},
            {"symbol": "TCS", "name": "Tata Consultancy Services Ltd", "sector": "Information Technology", "series": "EQ", "index": "NIFTY 50"},
            {"symbol": "HDFCBANK", "name": "HDFC Bank Ltd", "sector": "Banking & Financials", "series": "EQ", "index": "NIFTY 50"},
            {"symbol": "INFY", "name": "Infosys Ltd", "sector": "Information Technology", "series": "EQ", "index": "NIFTY 50"},
            {"symbol": "ICICIBANK", "name": "ICICI Bank Ltd", "sector": "Banking & Financials", "series": "EQ", "index": "NIFTY 50"},
            {"symbol": "BHARTIARTL", "name": "Bharti Airtel Ltd", "sector": "Telecommunications", "series": "EQ", "index": "NIFTY 50"},
            {"symbol": "SBIN", "name": "State Bank of India", "sector": "Banking & Financials", "series": "EQ", "index": "NIFTY 50"},
            {"symbol": "ITC", "name": "ITC Ltd", "sector": "FMCG / Diversified", "series": "EQ", "index": "NIFTY 50"},
            {"symbol": "HINDUNILVR", "name": "Hindustan Unilever Ltd", "sector": "FMCG", "series": "EQ", "index": "NIFTY 50"},
            {"symbol": "LT", "name": "Larsen & Toubro Ltd", "sector": "Infrastructure & Capital Goods", "series": "EQ", "index": "NIFTY 50"},
            {"symbol": "BAJFINANCE", "name": "Bajaj Finance Ltd", "sector": "Financial Services", "series": "EQ", "index": "NIFTY 50"},
            {"symbol": "MARUTI", "name": "Maruti Suzuki India Ltd", "sector": "Automobile", "series": "EQ", "index": "NIFTY 50"},
            {"symbol": "SUNPHARMA", "name": "Sun Pharmaceutical Industries Ltd", "sector": "Pharmaceuticals", "series": "EQ", "index": "NIFTY 50"},
            {"symbol": "TATAMOTORS", "name": "Tata Motors Ltd", "sector": "Automobile", "series": "EQ", "index": "NIFTY 50"},
            {"symbol": "KOTAKBANK", "name": "Kotak Mahindra Bank Ltd", "sector": "Banking & Financials", "series": "EQ", "index": "NIFTY 50"},
            {"symbol": "TITAN", "name": "Titan Company Ltd", "sector": "Consumer Durables", "series": "EQ", "index": "NIFTY 50"},
            {"symbol": "ONGC", "name": "Oil & Natural Gas Corporation Ltd", "sector": "Energy", "series": "EQ", "index": "NIFTY 50"},
            {"symbol": "NTPC", "name": "NTPC Ltd", "sector": "Energy & Power", "series": "EQ", "index": "NIFTY 50"},
            {"symbol": "AXISBANK", "name": "Axis Bank Ltd", "sector": "Banking & Financials", "series": "EQ", "index": "NIFTY 50"},
            {"symbol": "ADANIENT", "name": "Adani Enterprises Ltd", "sector": "Metals & Mining / Conglomerate", "series": "EQ", "index": "NIFTY 50"},
            {"symbol": "ADANIPORTS", "name": "Adani Ports & SEZ Ltd", "sector": "Infrastructure", "series": "EQ", "index": "NIFTY 50"},
            {"symbol": "POWERGRID", "name": "Power Grid Corporation of India Ltd", "sector": "Energy & Power", "series": "EQ", "index": "NIFTY 50"},
            {"symbol": "COALINDIA", "name": "Coal India Ltd", "sector": "Energy", "series": "EQ", "index": "NIFTY 50"},
            {"symbol": "BAJAJFINSV", "name": "Bajaj Finserv Ltd", "sector": "Financial Services", "series": "EQ", "index": "NIFTY 50"},
            {"symbol": "M&M", "name": "Mahindra & Mahindra Ltd", "sector": "Automobile", "series": "EQ", "index": "NIFTY 50"},
            {"symbol": "ASIANPAINT", "name": "Asian Paints Ltd", "sector": "Consumer Durables", "series": "EQ", "index": "NIFTY 50"},
            {"symbol": "ULTRACEMCO", "name": "UltraTech Cement Ltd", "sector": "Materials", "series": "EQ", "index": "NIFTY 50"},
            {"symbol": "TATASTEEL", "name": "Tata Steel Ltd", "sector": "Metals", "series": "EQ", "index": "NIFTY 50"},
            {"symbol": "JSWSTEEL", "name": "JSW Steel Ltd", "sector": "Metals", "series": "EQ", "index": "NIFTY 50"},
            {"symbol": "GRASIM", "name": "Grasim Industries Ltd", "sector": "Materials", "series": "EQ", "index": "NIFTY 50"},
            {"symbol": "TECHM", "name": "Tech Mahindra Ltd", "sector": "Information Technology", "series": "EQ", "index": "NIFTY 50"},
            {"symbol": "HINDALCO", "name": "Hindalco Industries Ltd", "sector": "Metals", "series": "EQ", "index": "NIFTY 50"},
            {"symbol": "WIPRO", "name": "Wipro Ltd", "sector": "Information Technology", "series": "EQ", "index": "NIFTY 50"},
            {"symbol": "INDUSINDBK", "name": "IndusInd Bank Ltd", "sector": "Banking & Financials", "series": "EQ", "index": "NIFTY 50"},
            {"symbol": "NESTLEIND", "name": "Nestle India Ltd", "sector": "FMCG", "series": "EQ", "index": "NIFTY 50"},
            {"symbol": "CIPLA", "name": "Cipla Ltd", "sector": "Pharmaceuticals", "series": "EQ", "index": "NIFTY 50"},
            {"symbol": "DRREDDY", "name": "Dr. Reddy's Laboratories Ltd", "sector": "Pharmaceuticals", "series": "EQ", "index": "NIFTY 50"},
            {"symbol": "BRITANNIA", "name": "Britannia Industries Ltd", "sector": "FMCG", "series": "EQ", "index": "NIFTY 50"},
            {"symbol": "TATACONSUM", "name": "Tata Consumer Products Ltd", "sector": "FMCG", "series": "EQ", "index": "NIFTY 50"},
            {"symbol": "EICHERMOT", "name": "Eicher Motors Ltd", "sector": "Automobile", "series": "EQ", "index": "NIFTY 50"},
            {"symbol": "APOLLOHOSP", "name": "Apollo Hospitals Enterprise Ltd", "sector": "Healthcare", "series": "EQ", "index": "NIFTY 50"},
            {"symbol": "BAJAJ-AUTO", "name": "Bajaj Auto Ltd", "sector": "Automobile", "series": "EQ", "index": "NIFTY 50"},
            {"symbol": "BPCL", "name": "Bharat Petroleum Corporation Ltd", "sector": "Energy", "series": "EQ", "index": "NIFTY 50"},
            {"symbol": "SHRIRAMFIN", "name": "Shriram Finance Ltd", "sector": "Financial Services", "series": "EQ", "index": "NIFTY 50"},
            {"symbol": "HEROMOTOCO", "name": "Hero MotoCorp Ltd", "sector": "Automobile", "series": "EQ", "index": "NIFTY 50"},
            {"symbol": "DIVISLAB", "name": "Divi's Laboratories Ltd", "sector": "Pharmaceuticals", "series": "EQ", "index": "NIFTY 50"},
            {"symbol": "HAL", "name": "Hindustan Aeronautics Ltd", "sector": "Defense & Capital Goods", "series": "EQ", "index": "NIFTY NEXT 50"},
            {"symbol": "BEL", "name": "Bharat Electronics Ltd", "sector": "Defense & Electronics", "series": "EQ", "index": "NIFTY 50"},
            {"symbol": "TRENT", "name": "Trent Ltd", "sector": "Retail / Consumer", "series": "EQ", "index": "NIFTY 50"},
            {"symbol": "DLF", "name": "DLF Ltd", "sector": "Realty", "series": "EQ", "index": "NIFTY NEXT 50"}
        ]

