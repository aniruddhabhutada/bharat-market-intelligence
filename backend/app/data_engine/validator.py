from datetime import datetime, date, timedelta
from typing import Tuple, List, Dict, Any, Optional
from ..core.calendar import IndianMarketCalendar
from .models import Quote, DataFreshnessStatus

class DataValidator:
    """Rigorous Data Quality Engine for Indian Stock Market Data."""

    @staticmethod
    def validate_ohlc(open_p: float, high_p: float, low_p: float, close_p: float, volume: int) -> Tuple[bool, List[str]]:
        errors = []
        if open_p <= 0 or high_p <= 0 or low_p <= 0 or close_p <= 0:
            errors.append("Invalid non-positive price detected.")
        
        # High must be >= open, close, low
        if high_p < open_p or high_p < close_p or high_p < low_p:
            errors.append(f"High ({high_p}) is lower than Open/Close/Low ({open_p}/{close_p}/{low_p}).")
            
        # Low must be <= open, close, high
        if low_p > open_p or low_p > close_p or low_p > high_p:
            errors.append(f"Low ({low_p}) is higher than Open/Close/High ({open_p}/{close_p}/{high_p}).")

        if volume < 0:
            errors.append(f"Negative volume detected: {volume}.")

        return len(errors) == 0, errors

    @staticmethod
    def check_price_jump(current_price: float, prev_close: float, threshold_pct: float = 20.0) -> Tuple[bool, Optional[str]]:
        """Checks for abnormal single-day percentage change (possible corporate action / split)."""
        if prev_close <= 0:
            return False, "Previous close invalid or zero."
        pct = abs(current_price - prev_close) / prev_close * 100.0
        if pct > threshold_pct:
            return True, f"Abnormal price shift of {pct:.2f}% detected. Check for stock split, bonus, or extreme circuit move."
        return False, None

    @classmethod
    def determine_freshness_status(cls, exchange_ts: Optional[datetime], retrieval_ts: datetime) -> str:
        """Determines appropriate status badge according to BMI rules."""
        market_status = IndianMarketCalendar.get_market_status()
        is_open = market_status.get("is_open", False)
        
        now = datetime.now()
        age_seconds = (now - retrieval_ts).total_seconds()

        if is_open:
            if age_seconds < 90:
                return DataFreshnessStatus.LIVE
            elif age_seconds < 1200: # 20 mins
                return DataFreshnessStatus.DELAYED
            else:
                return DataFreshnessStatus.STALE
        else:
            # Market is closed or weekend
            if age_seconds < 86400: # within 24 hours
                return DataFreshnessStatus.LAST_AVAILABLE
            else:
                return DataFreshnessStatus.LAST_AVAILABLE

    @staticmethod
    def detect_provider_conflict(primary_price: float, secondary_price: float, threshold_pct: float = 0.5) -> Tuple[bool, Optional[str]]:
        """Detects if two data providers disagree materially (> 0.5%)."""
        if primary_price <= 0 or secondary_price <= 0:
            return False, None
        diff_pct = abs(primary_price - secondary_price) / primary_price * 100.0
        if diff_pct > threshold_pct:
            return True, f"Material conflict: Primary ₹{primary_price:.2f} vs Secondary ₹{secondary_price:.2f} ({diff_pct:.2f}% divergence)."
        return False, None

