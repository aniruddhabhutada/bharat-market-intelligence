from typing import Dict, Any, Tuple, List
import pandas as pd

class ResearchScoringEngine:
    """Transparent Multi-Factor Scoring Engine for Indian Equities."""

    @classmethod
    def evaluate_stock(cls, tech_data: Dict[str, Any], fund_data: Dict[str, Any]) -> Dict[str, Any]:
        """Calculates itemized Technical Score (0-100), Fundamental Score (0-100), and Overall Score."""
        
        # 1. Technical Scoring (Weights: Trend 25%, Mom 20%, RS 15%, Vol 15%, Liq 15%, Risk 10%)
        tech_score = 0.0
        tech_breakdown = {}

        # Trend (25%)
        ma_align = tech_data.get("ma_alignment", "MIXED")
        if ma_align == "STRONGLY_BULLISH":
            trend_pts = 25.0
        elif ma_align == "MODERATELY_BULLISH":
            trend_pts = 18.0
        elif ma_align == "MIXED":
            trend_pts = 10.0
        else:
            trend_pts = 2.0
        tech_score += trend_pts
        tech_breakdown["Trend (25%)"] = {"score": trend_pts, "detail": f"Structure: {ma_align}"}

        # Momentum - RSI 14 (20%)
        rsi = tech_data.get("rsi14", 50.0)
        if 55.0 <= rsi <= 72.0:
            mom_pts = 20.0
            mom_note = f"Bullish sweet spot (RSI: {rsi})"
        elif 50.0 <= rsi < 55.0:
            mom_pts = 14.0
            mom_note = f"Mild positive momentum (RSI: {rsi})"
        elif rsi > 75.0:
            mom_pts = 10.0 # Extreme overbought deduction
            mom_note = f"Overbought alert (RSI: {rsi})"
        elif 40.0 <= rsi < 50.0:
            mom_pts = 8.0
            mom_note = f"Subdued momentum (RSI: {rsi})"
        else:
            mom_pts = 2.0
            mom_note = f"Weak momentum (RSI: {rsi})"
        tech_score += mom_pts
        tech_breakdown["Momentum (20%)"] = {"score": mom_pts, "detail": mom_note}

        # Relative Strength (15%)
        rs_vs_nifty = tech_data.get("rs_vs_nifty", 0.0)
        if rs_vs_nifty > 2.0:
            rs_pts = 15.0
        elif rs_vs_nifty > 0.0:
            rs_pts = 11.0
        elif rs_vs_nifty > -2.0:
            rs_pts = 6.0
        else:
            rs_pts = 1.0
        tech_score += rs_pts
        tech_breakdown["Relative Strength (15%)"] = {"score": rs_pts, "detail": f"RS vs NIFTY: {rs_vs_nifty:+.2f}%"}

        # Volume Confirmation - RVOL (15%)
        rvol = tech_data.get("rvol", 1.0)
        if rvol >= 1.8:
            vol_pts = 15.0
            vol_note = f"Institutional accumulation surge ({rvol}x 20-day avg)"
        elif rvol >= 1.2:
            vol_pts = 11.0
            vol_note = f"Above average activity ({rvol}x)"
        elif rvol >= 0.8:
            vol_pts = 7.0
            vol_note = f"Normal volume ({rvol}x)"
        else:
            vol_pts = 2.0
            vol_note = f"Below average liquidity ({rvol}x)"
        tech_score += vol_pts
        tech_breakdown["Volume & RVOL (15%)"] = {"score": vol_pts, "detail": vol_note}

        # Liquidity / Turnover (15%)
        turnover = tech_data.get("turnover", 50.0)
        liq_pts = 15.0 if turnover > 30.0 else (10.0 if turnover > 10.0 else 5.0)
        tech_score += liq_pts
        tech_breakdown["Liquidity (15%)"] = {"score": liq_pts, "detail": f"Turnover: ₹{turnover:.1f} Cr"}

        # Risk & Volatility (10%)
        adx = tech_data.get("adx14", 20.0)
        risk_pts = 10.0 if adx > 25.0 else 6.0
        tech_score += risk_pts
        tech_breakdown["Risk / Trend Strength (10%)"] = {"score": risk_pts, "detail": f"ADX: {adx:.1f}"}

        # 2. Fundamental Scoring (Growth 20%, Returns 25%, BalSheet 15%, CashFlow 15%, Valuation 15%, Gov 10%)
        fund_score = 0.0
        fund_breakdown = {}

        # Growth (20%)
        rev_g = fund_data.get("revenue_growth_yoy_pct", 10.0)
        if rev_g > 15.0:
            growth_pts = 20.0
        elif rev_g > 8.0:
            growth_pts = 14.0
        elif rev_g > 0.0:
            growth_pts = 8.0
        else:
            growth_pts = 2.0
        fund_score += growth_pts
        fund_breakdown["Growth (20%)"] = {"score": growth_pts, "detail": f"YoY Rev Growth: {rev_g:.1f}%"}

        # Profitability & Returns - ROE & ROCE (25%)
        roe = fund_data.get("roe_pct", 12.0)
        roce = fund_data.get("roce_pct", 14.0)
        if roe > 18.0 and roce > 20.0:
            ret_pts = 25.0
        elif roe > 14.0 and roce > 15.0:
            ret_pts = 19.0
        elif roe > 10.0:
            ret_pts = 12.0
        else:
            ret_pts = 4.0
        fund_score += ret_pts
        fund_breakdown["Profitability & Returns (25%)"] = {"score": ret_pts, "detail": f"ROE: {roe:.1f}%, ROCE: {roce:.1f}%"}

        # Balance Sheet Quality - Debt/Equity (15%)
        de = fund_data.get("debt_to_equity", 0.5)
        if de <= 0.3:
            de_pts = 15.0
            de_note = f"Virtually debt free (D/E: {de:.2f})"
        elif de <= 0.8:
            de_pts = 11.0
            de_note = f"Conservative leverage (D/E: {de:.2f})"
        elif de <= 1.5:
            de_pts = 6.0
            de_note = f"Moderate leverage (D/E: {de:.2f})"
        else:
            de_pts = 2.0
            de_note = f"Elevated leverage risk (D/E: {de:.2f})"
        fund_score += de_pts
        fund_breakdown["Balance Sheet (15%)"] = {"score": de_pts, "detail": de_note}

        # Cash Flow Quality (15%)
        cfo = fund_data.get("operating_cash_flow_cr", 100.0)
        fcf = fund_data.get("free_cash_flow_cr", 50.0)
        if cfo > 0 and fcf > 0:
            cf_pts = 15.0
            cf_note = f"Strong CFO (₹{cfo:.0f} Cr) & Positive FCF"
        elif cfo > 0:
            cf_pts = 10.0
            cf_note = f"Positive CFO (₹{cfo:.0f} Cr), Capex ongoing"
        else:
            cf_pts = 2.0
            cf_note = "Negative Operating Cash Flow"
        fund_score += cf_pts
        fund_breakdown["Cash Flow Quality (15%)"] = {"score": cf_pts, "detail": cf_note}

        # Valuation (15%)
        pe = fund_data.get("pe_ratio", 25.0)
        if pe <= 0:
            val_pts = 2.0
            val_note = "Loss making (Negative PE)"
        elif pe < 22.0:
            val_pts = 15.0
            val_note = f"Attractive multiple (PE: {pe:.1f})"
        elif pe < 38.0:
            val_pts = 10.0
            val_note = f"Fair value band (PE: {pe:.1f})"
        else:
            val_pts = 5.0
            val_note = f"Premium valuation (PE: {pe:.1f})"
        fund_score += val_pts
        fund_breakdown["Valuation (15%)"] = {"score": val_pts, "detail": val_note}

        # Governance & Pledging (10%)
        pledge = fund_data.get("promoter_pledge_pct", 0.0)
        gov_pts = 10.0 if pledge < 2.0 else (5.0 if pledge < 10.0 else 0.0)
        fund_score += gov_pts
        fund_breakdown["Governance & Pledge (10%)"] = {"score": gov_pts, "detail": f"Promoter pledge: {pledge:.1f}%"}

        # Overall composite score: 50% Fundamental + 50% Technical
        overall_score = round((fund_score * 0.5) + (tech_score * 0.5), 1)

        # Categorization
        if tech_score >= 75.0 and fund_score >= 70.0:
            category = "RESEARCH_PRIORITY"
            rationale = "High technical conviction aligned with strong balance sheet & return metrics."
        elif tech_score >= 65.0 or fund_score >= 65.0:
            category = "WATCHLIST"
            rationale = "Solid fundamentals or developing technical structure; monitor for confirmation."
        elif tech_score >= 55.0 and fund_score < 45.0:
            category = "DEVELOPING_SETUP"
            rationale = "Short-term swing structure building, but fundamental quality requires verification."
        else:
            category = "AVOID_HIGH_RISK"
            rationale = "Subdued momentum or structural balance sheet concerns."

        return {
            "overall_score": overall_score,
            "technical_score": round(tech_score, 1),
            "fundamental_score": round(fund_score, 1),
            "category": category,
            "category_rationale": rationale,
            "technical_breakdown": tech_breakdown,
            "fundamental_breakdown": fund_breakdown
        }

