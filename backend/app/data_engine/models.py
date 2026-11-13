from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime, date

class DataFreshnessStatus:
    LIVE = "LIVE"
    DELAYED = "DELAYED"
    LAST_AVAILABLE = "LAST AVAILABLE"
    STALE = "STALE"
    UNAVAILABLE = "UNAVAILABLE"

class Candle(BaseModel):
    timestamp: datetime
    open: float
    high: float
    low: float
    close: float
    volume: int
    adj_close: Optional[float] = None
    turnover: Optional[float] = None

class Quote(BaseModel):
    symbol: str
    exchange: str = "NSE"
    trading_date: date
    exchange_timestamp: Optional[datetime] = None
    retrieval_timestamp: datetime = Field(default_factory=datetime.now)
    open: float
    high: float
    low: float
    close: float # Current LTP or closing price
    previous_close: float
    change: float
    pct_change: float
    volume: int
    turnover: Optional[float] = None
    vwap: Optional[float] = None
    delivery_pct: Optional[float] = None
    
    # 52-Week stats
    week52_high: Optional[float] = None
    week52_low: Optional[float] = None
    
    # Provider metadata
    provider: str
    source_url: Optional[str] = None
    status: str = DataFreshnessStatus.LAST_AVAILABLE
    currency: str = "INR"
    quality_score: float = 100.0
    quality_notes: List[str] = Field(default_factory=list)

class IndexQuote(BaseModel):
    name: str # e.g. NIFTY 50, NIFTY BANK, SENSEX, INDIA VIX
    symbol: str
    exchange: str = "NSE"
    price: float
    change: float
    pct_change: float
    open: float
    high: float
    low: float
    previous_close: float
    advances: Optional[int] = None
    declines: Optional[int] = None
    unchanged: Optional[int] = None
    status: str = DataFreshnessStatus.LAST_AVAILABLE
    timestamp: datetime = Field(default_factory=datetime.now)
    provider: str = "NSE"

class FIIDIIRecord(BaseModel):
    date: date
    fii_gross_buy: float # in INR Crores
    fii_gross_sell: float
    fii_net: float
    dii_gross_buy: float
    dii_gross_sell: float
    dii_net: float
    provider: str = "NSE"
    retrieval_timestamp: datetime = Field(default_factory=datetime.now)

class CorporateAnnouncement(BaseModel):
    symbol: str
    company_name: Optional[str] = None
    headline: str
    category: str # Board Meeting, Financial Result, Dividend, Split, Agm/Egm, Other
    broadcast_date: datetime
    details_url: Optional[str] = None
    source: str = "NSE"

class NewsArticle(BaseModel):
    title: str
    url: str
    source: str
    published_at: datetime
    summary: str
    category: str # Indian Economy, Global Macro, Corporate Earnings, Regulatory, Sectoral
    relevant_symbols: List[str] = Field(default_factory=list)
    sentiment: str = "NEUTRAL" # BULLISH, BEARISH, NEUTRAL
    confirmed_filing: bool = False

class DataQualityAudit(BaseModel):
    timestamp: datetime = Field(default_factory=datetime.now)
    overall_health: str # HEALTHY, DEGRADED, CRITICAL
    active_provider: str
    trading_date: date
    quote_count: int
    anomalies_detected: int
    stale_count: int
    discrepancies: List[str] = Field(default_factory=list)
    provider_statuses: Dict[str, str] = Field(default_factory=dict)

