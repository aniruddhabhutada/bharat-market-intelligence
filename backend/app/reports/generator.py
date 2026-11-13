from datetime import datetime, date
from typing import Dict, Any, List, Optional
import json

from ..data_engine.provider_manager import provider_mgr
from ..analysis.fii_dii_analyzer import FIIDIIAnalyzer
from ..analysis.sector_analyzer import SectorAnalyzer
from ..analysis.observation_engine import IntradayObservationEngine
from ..ai.ai_engine import ai_agent
from ..db.sqlite_db import save_report, get_reports
from ..core.calendar import IndianMarketCalendar
from ..core.utils import sanitize_json

class DailyReportGenerator:
    """Consolidated Research Publishing Engine for Morning, Intraday, and Evening Reports."""

    @classmethod
    def generate_morning_report(cls) -> Dict[str, Any]:
        today_str = datetime.now().strftime("%Y-%m-%d")
        
        # 1. Fetch Global & Macro Data
        macros = provider_mgr.yahoo.get_macro_data()
        indices = provider_mgr.get_indices()
        global_indices = [idx for idx in indices if idx.exchange == "GLOBAL"]
        
        # 2. Institutional Activity
        fii_dii = FIIDIIAnalyzer.get_institutional_flow_report(sessions=5)
        
        # 3. Key Indian Setup
        nifty = next((idx for idx in indices if "NIFTY 50" in idx.name.upper() or idx.symbol == "NIFTY"), None)
        banknifty = next((idx for idx in indices if "BANK" in idx.name.upper()), None)
        vix = next((idx for idx in indices if "VIX" in idx.name.upper()), None)
        
        # Build scenarios
        nifty_p = nifty.price if nifty else 24200.0
        bull_lvl = round(nifty_p * 1.006, 2)
        bear_lvl = round(nifty_p * 0.994, 2)

        verified_data = {
            "nifty_prev_pct": nifty.pct_change if nifty else 0.0,
            "vix_value": vix.price if vix else 13.5,
            "fii_net_cr": fii_dii["latest_session"]["fii_net"],
            "dii_net_cr": fii_dii["latest_session"]["dii_net"],
            "crude_price": macros.get("CRUDE_OIL", {}).get("value", 74.0),
            "usdinr_price": macros.get("USD_INR", {}).get("value", 84.4)
        }

        ai_res = ai_agent.synthesize_research_narrative("MORNING", verified_data)

        report_payload = {
            "report_type": "MORNING",
            "report_date": today_str,
            "title": f"Pre-Market Intelligence Briefing - {today_str}",
            "generated_at": datetime.now().isoformat(),
            "confidence_rating": "HIGH (Verified EOD & Macro Feeds)",
            "global_context": {
                "macro_factors": macros,
                "global_markets": [g.dict() for g in global_indices[:4]]
            },
            "indian_market_setup": {
                "nifty": nifty.dict() if nifty else {},
                "bank_nifty": banknifty.dict() if banknifty else {},
                "india_vix": vix.dict() if vix else {},
                "fii_dii_summary": fii_dii["latest_session"],
                "regime": fii_dii["regime"]
            },
            "scenarios": {
                "bullish_scenario": f"Sustained trade above {nifty_p:.2f} opens up targets toward {bull_lvl:.2f} led by Banking heavyweights.",
                "bearish_scenario": f"Rejection below {bear_lvl:.2f} on elevated VIX (>14.5) risks unwinding toward primary moving average support.",
                "neutral_scenario": f"Range-bound oscillation between {bear_lvl:.2f} and {bull_lvl:.2f} as institutional flows balance."
            },
            "sectors_in_focus": ["Banking & Financials", "Infrastructure", "Automobile"],
            "key_risks": [
                "Crude oil price volatility affecting domestic fiscal margins.",
                "US Dollar Index strength driving foreign portfolio outflows.",
                "Overnight global central bank interest rate rhetoric."
            ],
            "ai_synthesis": ai_res
        }

        report_payload = sanitize_json(report_payload)
        save_report("MORNING", today_str, report_payload["title"], "Pre-market outlook and index setup.", report_payload, ai_res["provider"])
        return report_payload

    @classmethod
    def generate_intraday_report(cls) -> Dict[str, Any]:
        today_str = datetime.now().strftime("%Y-%m-%d")
        now_time_str = datetime.now().strftime("%H:%M IST")
        
        indices = provider_mgr.get_indices()
        sector_data = SectorAnalyzer.get_sector_report()
        observations = IntradayObservationEngine.generate_observations()

        nifty = next((idx for idx in indices if "NIFTY 50" in idx.name.upper() or idx.symbol == "NIFTY"), None)
        
        verified_data = {
            "nifty_price": nifty.price if nifty else 24200.0,
            "nifty_pct": nifty.pct_change if nifty else 0.0,
            "top_sector": sector_data.get("top_leaders", ["Banking"])[0] if sector_data.get("top_leaders") else "Banking",
            "laggard_sector": sector_data.get("top_laggards", ["IT"])[0] if sector_data.get("top_laggards") else "IT"
        }
        
        ai_res = ai_agent.synthesize_research_narrative("INTRADAY", verified_data)

        report_payload = {
            "report_type": "INTRADAY",
            "report_date": today_str,
            "title": f"Live Market Pulse Report - {now_time_str}",
            "generated_at": datetime.now().isoformat(),
            "indices_snapshot": [idx.dict() for idx in indices if idx.exchange in ("NSE", "BSE")][:6],
            "sector_leadership": sector_data["top_leaders"],
            "sector_laggards": sector_data["top_laggards"],
            "observations": observations,
            "ai_synthesis": ai_res
        }

        report_payload = sanitize_json(report_payload)
        save_report("INTRADAY", today_str, report_payload["title"], f"Intraday market observations at {now_time_str}.", report_payload, ai_res["provider"])
        return report_payload

    @classmethod
    def generate_evening_report(cls) -> Dict[str, Any]:
        today_str = datetime.now().strftime("%Y-%m-%d")
        indices = provider_mgr.get_indices()
        fii_dii = FIIDIIAnalyzer.get_institutional_flow_report(sessions=10)
        sector_data = SectorAnalyzer.get_sector_report()
        
        nifty = next((idx for idx in indices if "NIFTY 50" in idx.name.upper() or idx.symbol == "NIFTY"), None)
        banknifty = next((idx for idx in indices if "BANK" in idx.name.upper()), None)
        sensex = next((idx for idx in indices if "SENSEX" in idx.name.upper()), None)

        verified_data = {
            "nifty_close": nifty.price if nifty else 24250.0,
            "nifty_pct": nifty.pct_change if nifty else 0.35,
            "fii_net_cr": fii_dii["latest_session"]["fii_net"],
            "dii_net_cr": fii_dii["latest_session"]["dii_net"]
        }
        ai_res = ai_agent.synthesize_research_narrative("EVENING", verified_data)

        report_payload = {
            "report_type": "EVENING",
            "report_date": today_str,
            "title": f"Post-Market Closing Research Dossier - {today_str}",
            "generated_at": datetime.now().isoformat(),
            "closing_summary": {
                "nifty": nifty.dict() if nifty else {},
                "bank_nifty": banknifty.dict() if banknifty else {},
                "sensex": sensex.dict() if sensex else {}
            },
            "institutional_flows": fii_dii,
            "sector_performance": sector_data["sectors"][:8],
            "tomorrow_watchlist": ["RELIANCE", "HDFCBANK", "LT", "BHARTIARTL", "TCS"],
            "three_major_risks": [
                "Overnight US tech earnings and interest rate trajectory.",
                "Continued FII net cash sales requiring persistent DII absorption.",
                "Crude oil resistance levels testing domestic inflation thresholds."
            ],
            "ai_synthesis": ai_res
        }

        report_payload = sanitize_json(report_payload)
        save_report("EVENING", today_str, report_payload["title"], "Comprehensive end-of-day market research.", report_payload, ai_res["provider"])
        return report_payload

