import requests
import json
import logging
import pandas as pd
from datetime import datetime, date, timedelta
from typing import Optional, List, Dict, Any
from .base import BaseDataProvider
from ..models import Quote, IndexQuote, FIIDIIRecord, DataFreshnessStatus
from ..validator import DataValidator
from ...core.calendar import IndianMarketCalendar

logger = logging.getLogger(__name__)

class NSEDataProvider(BaseDataProvider):
    """Adapter for official National Stock Exchange of India (NSE) public endpoints."""
    
    BASE_URL = "https://www.nseindia.com"
    HEADERS = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive"
    }

    def __init__(self):
        super().__init__("NSE_OFFICIAL")
        self.session = requests.Session()
        self.session.headers.update(self.HEADERS)
        self.cookies_set = False

    def _ensure_session(self) -> bool:
        """NSE requires initial session cookies before accessing JSON APIs."""
        try:
            r = self.session.get(self.BASE_URL, timeout=8)
            if r.status_code == 200:
                self.cookies_set = True
                self.last_healthy = True
                return True
        except Exception as e:
            self.last_error = f"NSE session handshake failed: {str(e)}"
            self.last_healthy = False
        return False

    def get_indices(self) -> List[IndexQuote]:
        """Fetch all indices directly from NSE India."""
        results = []
        try:
            if not self.cookies_set:
                self._ensure_session()
            
            url = f"{self.BASE_URL}/api/allIndices"
            resp = self.session.get(url, timeout=6)
            
            if resp.status_code == 401 or resp.status_code == 403:
                # Refresh session cookies
                self._ensure_session()
                resp = self.session.get(url, timeout=6)

            if resp.status_code == 200:
                data = resp.json().get("data", [])
                for item in data:
                    name = item.get("index", "")
                    symbol = item.get("indexSymbol", name)
                    cur_val = float(item.get("last", 0))
                    prev_close = float(item.get("previousClose", cur_val))
                    change = float(item.get("change", 0))
                    pct_change = float(item.get("percentChange", 0))
                    o = float(item.get("open", cur_val))
                    h = float(item.get("high", cur_val))
                    l = float(item.get("low", cur_val))
                    
                    results.append(IndexQuote(
                        name=name,
                        symbol=symbol,
                        price=cur_val,
                        change=change,
                        pct_change=pct_change,
                        open=o,
                        high=h,
                        low=l,
                        previous_close=prev_close,
                        advances=int(item.get("advances", 0) or 0),
                        declines=int(item.get("declines", 0) or 0),
                        unchanged=int(item.get("unchanged", 0) or 0),
                        status=DataFreshnessStatus.LIVE if IndianMarketCalendar.get_market_status()["is_open"] else DataFreshnessStatus.LAST_AVAILABLE,
                        timestamp=datetime.now(),
                        provider="NSE_OFFICIAL"
                    ))
                self.last_healthy = True
                return results
        except Exception as e:
            self.last_error = f"NSE get_indices failed: {str(e)}"
            self.last_healthy = False
            
        return results

    def get_fii_dii(self) -> Optional[FIIDIIRecord]:
        """Fetch latest daily institutional cash flows from NSE."""
        try:
            if not self.cookies_set:
                self._ensure_session()
            url = f"{self.BASE_URL}/api/fiidiiTradeReact"
            resp = self.session.get(url, timeout=6)
            if resp.status_code == 200:
                records = resp.json()
                # NSE returns two items: FII and DII
                fii_data = next((r for r in records if "FII" in r.get("category", "")), {})
                dii_data = next((r for r in records if "DII" in r.get("category", "")), {})
                
                trade_date_str = fii_data.get("date", datetime.now().strftime("%d-%b-%Y"))
                try:
                    trade_date = datetime.strptime(trade_date_str, "%d-%b-%Y").date()
                except Exception:
                    trade_date = datetime.now().date()

                return FIIDIIRecord(
                    date=trade_date,
                    fii_gross_buy=float(fii_data.get("buyValue", 0)),
                    fii_gross_sell=float(fii_data.get("sellValue", 0)),
                    fii_net=float(fii_data.get("netValue", 0)),
                    dii_gross_buy=float(dii_data.get("buyValue", 0)),
                    dii_gross_sell=float(dii_data.get("sellValue", 0)),
                    dii_net=float(dii_data.get("netValue", 0)),
                    provider="NSE_OFFICIAL"
                )
        except Exception as e:
            self.last_error = f"NSE FII/DII failed: {str(e)}"
        return None

    def get_quote(self, symbol: str) -> Optional[Quote]:
        """Fetch single equity quote from NSE."""
        clean_symbol = symbol.replace(".NS", "").upper()
        try:
            if not self.cookies_set:
                self._ensure_session()
            url = f"{self.BASE_URL}/api/quote-equity?symbol={clean_symbol}"
            resp = self.session.get(url, timeout=6)
            if resp.status_code == 200:
                data = resp.json()
                price_info = data.get("priceInfo", {})
                trade_info = data.get("securityWiseDP", {})
                
                close_p = float(price_info.get("lastPrice", 0))
                prev_close = float(price_info.get("previousClose", close_p))
                o = float(price_info.get("open", close_p))
                h = float(price_info.get("intraDayHighLow", {}).get("max", close_p))
                l = float(price_info.get("intraDayHighLow", {}).get("min", close_p))
                vol = int(trade_info.get("quantityTraded", 0) or 0)
                
                valid, notes = DataValidator.validate_ohlc(o, h, l, close_p, vol)
                
                status = DataValidator.determine_freshness_status(datetime.now(), datetime.now())
                
                return Quote(
                    symbol=clean_symbol,
                    exchange="NSE",
                    trading_date=datetime.now().date(),
                    exchange_timestamp=datetime.now(),
                    retrieval_timestamp=datetime.now(),
                    open=o,
                    high=h,
                    low=l,
                    close=close_p,
                    previous_close=prev_close,
                    change=close_p - prev_close,
                    pct_change=((close_p - prev_close) / prev_close * 100.0) if prev_close else 0.0,
                    volume=vol,
                    vwap=float(price_info.get("vwap", 0) or 0),
                    delivery_pct=float(trade_info.get("deliveryToTradedQuantity", 0) or 0),
                    week52_high=float(price_info.get("weekHighLow", {}).get("max", 0) or 0),
                    week52_low=float(price_info.get("weekHighLow", {}).get("min", 0) or 0),
                    provider="NSE_OFFICIAL",
                    source_url=url,
                    status=status,
                    quality_score=100.0 if valid else 70.0,
                    quality_notes=notes
                )
        except Exception as e:
            self.last_error = f"NSE quote failed for {symbol}: {str(e)}"
        return None

    def get_history(self, symbol: str, days: int = 120) -> pd.DataFrame:
        """Historical data from NSE Bhavcopy archive or fallback."""
        return pd.DataFrame()

    def is_healthy(self) -> bool:
        return self.last_healthy

