from datetime import datetime, date, time, timedelta
from typing import Dict, Any, Optional
import pytz

IST = pytz.timezone("Asia/Kolkata")

# Verified NSE / BSE Trading Holidays (2024 - 2027)
NSE_HOLIDAYS = {
    # 2024
    date(2024, 1, 22): "Special Holiday (Ram Mandir Pran Pratishtha)",
    date(2024, 1, 26): "Republic Day",
    date(2024, 3, 8): "Mahashivratri",
    date(2024, 3, 25): "Holi",
    date(2024, 3, 29): "Good Friday",
    date(2024, 4, 11): "Id-Ul-Fitr (Ramzan Id)",
    date(2024, 4, 17): "Ram Navami",
    date(2024, 5, 1): "Maharashtra Day",
    date(2024, 5, 20): "Lok Sabha Elections 2024 (Mumbai)",
    date(2024, 6, 17): "Bakri Id",
    date(2024, 7, 17): "Muharram",
    date(2024, 8, 15): "Independence Day",
    date(2024, 10, 2): "Mahatma Gandhi Jayanti",
    date(2024, 11, 1): "Diwali Laxmi Pujan (Muhurat Trading)",
    date(2024, 11, 15): "Gurunanak Jayanti",
    date(2024, 11, 20): "Maharashtra Assembly Election",
    date(2024, 12, 25): "Christmas",

    # 2025
    date(2025, 2, 26): "Mahashivratri",
    date(2025, 3, 14): "Holi",
    date(2025, 3, 31): "Id-Ul-Fitr",
    date(2025, 4, 10): "Mahavir Jayanti",
    date(2025, 4, 14): "Dr. Baba Saheb Ambedkar Jayanti",
    date(2025, 4, 18): "Good Friday",
    date(2025, 5, 1): "Maharashtra Day",
    date(2025, 8, 15): "Independence Day",
    date(2025, 8, 27): "Ganesh Chaturthi",
    date(2025, 10, 2): "Mahatma Gandhi Jayanti",
    date(2025, 10, 21): "Diwali Laxmi Pujan (Muhurat Trading)",
    date(2025, 10, 22): "Diwali Balipratipada",
    date(2025, 11, 5): "Prakash Gurpurb Sri Guru Nanak Dev Jayanti",
    date(2025, 12, 25): "Christmas",

    # 2026
    date(2026, 1, 26): "Republic Day",
    date(2026, 3, 6): "Mahashivratri",
    date(2026, 3, 20): "Id-Ul-Fitr",
    date(2026, 4, 3): "Good Friday",
    date(2026, 4, 14): "Dr. Baba Saheb Ambedkar Jayanti",
    date(2026, 5, 1): "Maharashtra Day",
    date(2026, 5, 27): "Bakri Id",
    date(2026, 6, 25): "Muharram",
    date(2026, 10, 2): "Mahatma Gandhi Jayanti",
    date(2026, 10, 20): "Dussehra",
    date(2026, 11, 8): "Diwali Laxmi Pujan (Muhurat Trading)",
    date(2026, 11, 24): "Gurunanak Jayanti",
    date(2026, 12, 25): "Christmas",

    # 2027
    date(2027, 1, 26): "Republic Day",
    date(2027, 3, 10): "Id-Ul-Fitr",
    date(2027, 3, 22): "Holi",
    date(2027, 3, 26): "Good Friday",
    date(2027, 4, 14): "Dr. Baba Saheb Ambedkar Jayanti",
    date(2027, 5, 1): "Maharashtra Day",
    date(2027, 8, 15): "Independence Day",
    date(2027, 10, 2): "Mahatma Gandhi Jayanti",
    date(2027, 10, 29): "Diwali Laxmi Pujan (Muhurat Trading)",
    date(2027, 12, 25): "Christmas",
}

class IndianMarketCalendar:
    @staticmethod
    def now_ist() -> datetime:
        return datetime.now(IST)

    @classmethod
    def is_holiday(cls, check_date: date) -> tuple[bool, Optional[str]]:
        if check_date in NSE_HOLIDAYS:
            return True, NSE_HOLIDAYS[check_date]
        return False, None

    @classmethod
    def is_weekend(cls, check_date: date) -> bool:
        # 5 is Saturday, 6 is Sunday
        return check_date.weekday() in (5, 6)

    @classmethod
    def is_trading_day(cls, check_date: date) -> bool:
        if cls.is_weekend(check_date):
            return False
        is_hol, _ = cls.is_holiday(check_date)
        return not is_hol

    @classmethod
    def get_market_status(cls, dt: Optional[datetime] = None) -> Dict[str, Any]:
        """Returns comprehensive status: OPEN, CLOSED, PRE_OPEN, POST_CLOSE, HOLIDAY, WEEKEND"""
        dt = dt or cls.now_ist()
        current_date = dt.date()
        current_time = dt.time()

        if cls.is_weekend(current_date):
            return {
                "status": "WEEKEND",
                "is_open": False,
                "message": "Market is closed for the weekend.",
                "current_time_ist": dt.strftime("%Y-%m-%d %H:%M:%S IST"),
                "next_session": cls.get_next_trading_day(current_date).strftime("%Y-%m-%d")
            }

        is_hol, holiday_name = cls.is_holiday(current_date)
        if is_hol:
            # Special check for Muhurat trading
            if "Muhurat" in (holiday_name or ""):
                # Muhurat typically 18:00 - 19:15
                muhurat_start = time(18, 0)
                muhurat_end = time(19, 15)
                if muhurat_start <= current_time <= muhurat_end:
                    return {
                        "status": "OPEN",
                        "is_open": True,
                        "session_type": "MUHURAT",
                        "message": f"Special Muhurat Trading Session ({holiday_name})",
                        "current_time_ist": dt.strftime("%Y-%m-%d %H:%M:%S IST")
                    }
            return {
                "status": "HOLIDAY",
                "is_open": False,
                "holiday_name": holiday_name,
                "message": f"Market closed today for {holiday_name}.",
                "current_time_ist": dt.strftime("%Y-%m-%d %H:%M:%S IST"),
                "next_session": cls.get_next_trading_day(current_date).strftime("%Y-%m-%d")
            }

        # Regular Trading Day Timings
        pre_open_start = time(9, 0)
        market_open = time(9, 15)
        market_close = time(15, 30)
        post_close_end = time(16, 0)

        if current_time < pre_open_start:
            return {
                "status": "PRE_MARKET",
                "is_open": False,
                "message": "Market opens at 09:15 IST (Pre-open at 09:00 IST)",
                "current_time_ist": dt.strftime("%Y-%m-%d %H:%M:%S IST"),
                "market_open_time": "09:15:00"
            }
        elif pre_open_start <= current_time < market_open:
            return {
                "status": "PRE_OPEN",
                "is_open": False,
                "message": "Pre-open order collection session in progress (09:00 - 09:15 IST)",
                "current_time_ist": dt.strftime("%Y-%m-%d %H:%M:%S IST")
            }
        elif market_open <= current_time <= market_close:
            return {
                "status": "OPEN",
                "is_open": True,
                "message": "Market is OPEN (Live trading session 09:15 - 15:30 IST)",
                "current_time_ist": dt.strftime("%Y-%m-%d %H:%M:%S IST"),
                "closing_time": "15:30:00"
            }
        elif market_close < current_time <= post_close_end:
            return {
                "status": "POST_CLOSE",
                "is_open": False,
                "message": "Market closed. Post-closing price discovery session in progress.",
                "current_time_ist": dt.strftime("%Y-%m-%d %H:%M:%S IST")
            }
        else:
            return {
                "status": "CLOSED",
                "is_open": False,
                "message": "Market closed for the day. Official closing Bhavcopies in effect.",
                "current_time_ist": dt.strftime("%Y-%m-%d %H:%M:%S IST"),
                "next_session": cls.get_next_trading_day(current_date).strftime("%Y-%m-%d")
            }

    @classmethod
    def get_last_trading_day(cls, ref_date: Optional[date] = None) -> date:
        curr = (ref_date or cls.now_ist().date()) - timedelta(days=1)
        while not cls.is_trading_day(curr):
            curr -= timedelta(days=1)
        return curr

    @classmethod
    def get_next_trading_day(cls, ref_date: Optional[date] = None) -> date:
        curr = (ref_date or cls.now_ist().date()) + timedelta(days=1)
        while not cls.is_trading_day(curr):
            curr += timedelta(days=1)
        return curr

    @classmethod
    def get_recent_trading_days(cls, count: int = 10, end_date: Optional[date] = None) -> list[date]:
        days = []
        curr = end_date or cls.now_ist().date()
        while len(days) < count:
            if cls.is_trading_day(curr):
                days.append(curr)
            curr -= timedelta(days=1)
        return sorted(days)

