from datetime import datetime
from typing import List, Dict, Any
from ..data_engine.provider_manager import provider_mgr

class IntradayObservationEngine:
    """Generates structured market observations with thesis, evidence, and invalidation criteria."""

    @classmethod
    def generate_observations(cls) -> List[Dict[str, Any]]:
        observations = []
        now_str = datetime.now().strftime("%H:%M IST")

        # 1. Inspect Key Benchmark Indices
        indices = provider_mgr.get_indices()
        nifty = next((idx for idx in indices if "NIFTY 50" in idx.name.upper() or idx.symbol == "NIFTY"), None)
        banknifty = next((idx for idx in indices if "BANK" in idx.name.upper()), None)
        vix = next((idx for idx in indices if "VIX" in idx.name.upper()), None)

        if nifty:
            if abs(nifty.pct_change) > 0.6:
                direction = "Bullish expansion" if nifty.pct_change > 0 else "Bearish contraction"
                observations.append({
                    "id": "OBS_NIFTY_MOMENTUM",
                    "title": f"NIFTY 50 Directional Shift: {nifty.pct_change:+.2f}%",
                    "timestamp": now_str,
                    "what_happened": f"NIFTY moved {nifty.change:+.2f} points ({nifty.pct_change:+.2f}%) to {nifty.price:.2f}.",
                    "supporting_data": f"Day Range: {nifty.low:.2f} - {nifty.high:.2f} | Prev Close: {nifty.previous_close:.2f}",
                    "possible_explanation": f"Institutional capital flows and sectoral breadth are providing directional impetus ({direction}).",
                    "invalidation_condition": f"Failure to sustain above {nifty.open:.2f} or a sudden surge in India VIX above 15.5."
                })

        if vix:
            if vix.price < 13.5:
                observations.append({
                    "id": "OBS_VIX_COMPRESSION",
                    "title": f"Volatility Compression: India VIX at {vix.price:.2f}",
                    "timestamp": now_str,
                    "what_happened": f"India VIX sits at {vix.price:.2f} ({vix.pct_change:+.2f}%), indicating muted near-term option pricing expectations.",
                    "supporting_data": f"VIX reading {vix.price:.2f} remains well below the 16.0 panic threshold.",
                    "possible_explanation": "Options writers are pricing in tight range-bound market behavior without systemic event risks.",
                    "invalidation_condition": "A sharp spike in VIX > 15.0 on intraday gap-downs would invalidate the stable regime thesis."
                })
            elif vix.price > 16.0:
                observations.append({
                    "id": "OBS_VIX_ELEVATED",
                    "title": f"Heightened Market Volatility: India VIX at {vix.price:.2f}",
                    "timestamp": now_str,
                    "what_happened": f"India VIX has expanded to {vix.price:.2f}, signaling heightened hedging activity across index options.",
                    "supporting_data": f"Elevated VIX reading of {vix.price:.2f} reflects higher premium pricing for downside protection.",
                    "possible_explanation": "Participants are hedging ahead of macro events, global yield movements, or earnings reports.",
                    "invalidation_condition": "VIX falling back below 14.0 with consecutive higher index closes."
                })

        # 2. Key Stock Observations (Unusual Volume / Outperformance)
        watchlist_check = ["RELIANCE", "TCS", "HDFCBANK", "INFY", "BHARTIARTL", "SBIN", "LT"]
        for sym in watchlist_check:
            q = provider_mgr.get_quote(sym)
            if q and abs(q.pct_change) > 1.4:
                obs_type = "Outperformance Surge" if q.pct_change > 0 else "Intraday Weakness"
                observations.append({
                    "id": f"OBS_STOCK_{sym}",
                    "title": f"{sym} {obs_type}: {q.pct_change:+.2f}%",
                    "timestamp": now_str,
                    "what_happened": f"{sym} is trading at ₹{q.close:.2f} ({q.pct_change:+.2f}%) with {q.volume:,} shares traded.",
                    "supporting_data": f"Day High: ₹{q.high:.2f}, Low: ₹{q.low:.2f}, Previous Close: ₹{q.previous_close:.2f}",
                    "possible_explanation": "Institutional block activity or sector-specific tailwinds driving momentum.",
                    "invalidation_condition": f"A reversal below the day's VWAP (₹{q.vwap or q.open:.2f}) on heavy volume."
                })

        if not observations:
            observations.append({
                "id": "OBS_STEADY_STATE",
                "title": "Equilibrium Trading Regime",
                "timestamp": now_str,
                "what_happened": "Major benchmarks and heavyweight stocks are oscillating within well-defined intraday ranges.",
                "supporting_data": "NIFTY and sectoral breadth are balanced with moderate volume turnover.",
                "possible_explanation": "Consolidation phase ahead of key economic data releases.",
                "invalidation_condition": "A decisive breakout above the morning high or breakdown below the morning opening range."
            })

        return observations

