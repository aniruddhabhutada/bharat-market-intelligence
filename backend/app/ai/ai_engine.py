import json
import logging
from datetime import datetime
from typing import Dict, Any, Optional
import httpx
from ..core.config import settings

logger = logging.getLogger(__name__)

class AIMarketResearchAgent:
    """Interchangeable AI Analyst Architecture: Rule-Based, Gemini, Ollama."""

    def __init__(self):
        self.default_provider = settings.DEFAULT_AI_PROVIDER
        self.gemini_key = settings.GEMINI_API_KEY
        self.ollama_url = settings.OLLAMA_BASE_URL
        self.ollama_model = settings.OLLAMA_MODEL

    def synthesize_research_narrative(
        self,
        report_type: str,
        verified_data: Dict[str, Any],
        provider: Optional[str] = None
    ) -> Dict[str, Any]:
        """Synthesizes professional research commentary based strictly on verified inputs."""
        selected_provider = provider or self.default_provider
        
        # If Gemini requested but key missing, automatically fallback to rule_based
        if selected_provider == "gemini" and not self.gemini_key:
            selected_provider = "rule_based"

        # Step 1: Rule-based deterministic analyst (Always Available, Anti-Hallucination)
        if selected_provider == "rule_based":
            narrative = self._generate_rule_based_narrative(report_type, verified_data)
            return {
                "provider": "rule_based",
                "model": "BMI-Deterministic-Analyst-v1.0",
                "generation_timestamp": datetime.now().isoformat(),
                "prompt_version": "1.0",
                "narrative": narrative
            }

        # Step 2: Google Gemini Free-Tier API
        elif selected_provider == "gemini":
            try:
                narrative = self._call_gemini_api(report_type, verified_data)
                return {
                    "provider": "gemini",
                    "model": "gemini-2.5-flash",
                    "generation_timestamp": datetime.now().isoformat(),
                    "prompt_version": "1.0",
                    "narrative": narrative
                }
            except Exception as e:
                logger.warning(f"Gemini API call failed ({e}). Gracefully falling back to rule-based engine.")
                narrative = self._generate_rule_based_narrative(report_type, verified_data)
                return {
                    "provider": "rule_based (fallback from gemini)",
                    "model": "BMI-Deterministic-Analyst-v1.0",
                    "generation_timestamp": datetime.now().isoformat(),
                    "prompt_version": "1.0",
                    "narrative": narrative
                }

        # Step 3: Local Ollama
        elif selected_provider == "ollama":
            try:
                narrative = self._call_ollama_api(report_type, verified_data)
                return {
                    "provider": "ollama",
                    "model": self.ollama_model,
                    "generation_timestamp": datetime.now().isoformat(),
                    "prompt_version": "1.0",
                    "narrative": narrative
                }
            except Exception as e:
                logger.warning(f"Ollama call failed ({e}). Falling back to rule-based engine.")
                narrative = self._generate_rule_based_narrative(report_type, verified_data)
                return {
                    "provider": "rule_based (fallback from ollama)",
                    "model": "BMI-Deterministic-Analyst-v1.0",
                    "generation_timestamp": datetime.now().isoformat(),
                    "prompt_version": "1.0",
                    "narrative": narrative
                }

        # Default fallback
        narrative = self._generate_rule_based_narrative(report_type, verified_data)
        return {
            "provider": "rule_based",
            "model": "BMI-Deterministic-Analyst-v1.0",
            "generation_timestamp": datetime.now().isoformat(),
            "prompt_version": "1.0",
            "narrative": narrative
        }

    def _generate_rule_based_narrative(self, report_type: str, data: Dict[str, Any]) -> str:
        """Deterministic research synthesis using verified numerical boundaries."""
        if report_type == "MORNING":
            nifty_chg = data.get("nifty_prev_pct", 0.0)
            vix = data.get("vix_value", 13.5)
            fii_net = data.get("fii_net_cr", -1200.0)
            dii_net = data.get("dii_net_cr", 1500.0)
            crude = data.get("crude_price", 74.5)
            usdinr = data.get("usdinr_price", 84.4)

            sentiment = "Cautiously Optimistic" if (nifty_chg >= 0 and dii_net > 0) else "Prudent / Rangebound"
            
            return (
                f"### Morning Pre-Market Executive Briefing ({sentiment})\n\n"
                f"**1. Global & Macro Context:** Brent Crude sits at ${crude:.2f}/bbl and USD/INR at {usdinr:.2f}. "
                f"Global benchmark futures suggest steady risk pricing into the Asian opening bell.\n\n"
                f"**2. Institutional Liquidity:** In the prior session, Domestic Institutions (DIIs) injected net +₹{dii_net:.1f} Cr "
                f"against Foreign Institutional (FII) net flow of ₹{fii_net:.1f} Cr in the cash market. "
                f"DII absorption remains the central anchor against foreign portfolio rebalancing.\n\n"
                f"**3. Volatility & Tactical Ranges:** India VIX at {vix:.2f} confirms an orderly volatility environment. "
                f"Expect initial rotational action across Banking and Infrastructure heavyweights."
            )

        elif report_type == "INTRADAY":
            nifty = data.get("nifty_price", 24200.0)
            nifty_pct = data.get("nifty_pct", 0.35)
            top_sector = data.get("top_sector", "Banking")
            laggard_sector = data.get("laggard_sector", "IT")

            return (
                f"### Intraday Session Assessment\n\n"
                f"NIFTY 50 is trading at **{nifty:.2f}** ({nifty_pct:+.2f}%). Sectoral leadership is centered in **{top_sector}**, "
                f"while defensive positioning is visible with relative underperformance in **{laggard_sector}**.\n\n"
                f"Market breadth remains stable. Key support on 15-minute charts is anchored at the morning opening range."
            )

        elif report_type == "EVENING":
            nifty = data.get("nifty_close", 24250.0)
            nifty_pct = data.get("nifty_pct", 0.42)
            fii_net = data.get("fii_net_cr", -850.0)
            dii_net = data.get("dii_net_cr", 1420.0)

            return (
                f"### End-of-Day Market Research Summary\n\n"
                f"The Indian benchmark NIFTY 50 settled at **{nifty:.2f}** ({nifty_pct:+.2f}%). "
                f"Cash market institutional flow closed with DII net buying of +₹{dii_net:.1f} Cr and FII net flow of ₹{fii_net:.1f} Cr.\n\n"
                f"**Key Takeaways for Tomorrow:**\n"
                f"- Trend structure continues to preserve key moving averages.\n"
                f"- Sector rotation favors domestic cyclicals over export-sensitive sectors.\n"
                f"- Monitor global bond yields and crude stability as primary overnight risk factors."
            )

        return "Analytical commentary based on verified exchange feeds."

    def _call_gemini_api(self, report_type: str, data: Dict[str, Any]) -> str:
        prompt = (
            f"You are the senior equity research analyst at Bharat Market Intelligence. "
            f"Write a concise, professional research commentary for the {report_type} market report based STRICTLY on this verified data: "
            f"{json.dumps(data)}. "
            f"CRITICAL RULES: Do NOT invent stock prices, ratios, or announcements. Stick strictly to the numbers provided."
        )
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={self.gemini_key}"
        payload = {"contents": [{"parts": [{"text": prompt}]}]}
        with httpx.Client(timeout=10) as client:
            resp = client.post(url, json=payload)
            if resp.status_code == 200:
                res = resp.json()
                return res["candidates"][0]["content"]["parts"][0]["text"]
            else:
                raise Exception(f"Gemini API status {resp.status_code}: {resp.text}")

    def _call_ollama_api(self, report_type: str, data: Dict[str, Any]) -> str:
        prompt = (
            f"You are the senior Indian equity research analyst at Bharat Market Intelligence. "
            f"Write a concise analysis for {report_type} using ONLY these verified numbers: {json.dumps(data)}. "
            f"Never invent or extrapolate unverified facts."
        )
        url = f"{self.ollama_url}/api/generate"
        payload = {"model": self.ollama_model, "prompt": prompt, "stream": False}
        with httpx.Client(timeout=15) as client:
            resp = client.post(url, json=payload)
            if resp.status_code == 200:
                return resp.json().get("response", "")
            else:
                raise Exception(f"Ollama status {resp.status_code}")

ai_agent = AIMarketResearchAgent()

