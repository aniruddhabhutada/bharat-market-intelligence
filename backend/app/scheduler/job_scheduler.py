import logging
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from apscheduler.triggers.interval import IntervalTrigger
from datetime import datetime
import pytz

from ..core.calendar import IndianMarketCalendar
from ..core.config import settings
from ..reports.generator import DailyReportGenerator
from ..screener.scanner import scanner
from ..db.sqlite_db import log_job_run

logger = logging.getLogger(__name__)
IST = pytz.timezone(settings.TIMEZONE)

class MarketJobScheduler:
    """Automates Morning, Intraday, Evening, and Screener research cycles in Asia/Kolkata."""

    def __init__(self):
        self.scheduler = BackgroundScheduler(timezone=IST)

    def start(self):
        # 1. Morning Pre-Market Cycle (08:30 IST)
        self.scheduler.add_job(
            self.run_morning_cycle,
            CronTrigger(hour=8, minute=30, timezone=IST),
            id="job_morning_research",
            name="Morning Pre-Market Intelligence",
            replace_existing=True
        )

        # 2. Intraday Monitor (Every 15 minutes between 09:15 and 15:30 IST)
        self.scheduler.add_job(
            self.run_intraday_cycle,
            IntervalTrigger(minutes=settings.INTRADAY_POLL_INTERVAL_MINUTES, timezone=IST),
            id="job_intraday_monitor",
            name="Intraday Market Observation Monitor",
            replace_existing=True
        )

        # 3. Evening Post-Market Cycle (15:45 IST)
        self.scheduler.add_job(
            self.run_evening_cycle,
            CronTrigger(hour=15, minute=45, timezone=IST),
            id="job_evening_research",
            name="Evening Post-Market Research Dossier",
            replace_existing=True
        )

        # 4. Stock Screener Cycle (18:00 IST)
        self.scheduler.add_job(
            self.run_screener_cycle,
            CronTrigger(hour=18, minute=0, timezone=IST),
            id="job_screener_scan",
            name="Daily Nifty Stock Screener Scan",
            replace_existing=True
        )

        self.scheduler.start()
        logger.info("MarketJobScheduler initialized and started.")

    def run_morning_cycle(self):
        today = IndianMarketCalendar.now_ist().date()
        if not IndianMarketCalendar.is_trading_day(today):
            log_job_run("job_morning_research", "Morning Pre-Market", "SKIPPED", f"Skipped: Market closed today ({today}).")
            return
        try:
            DailyReportGenerator.generate_morning_report()
            log_job_run("job_morning_research", "Morning Pre-Market", "SUCCESS", "Generated morning intelligence briefing.")
        except Exception as e:
            log_job_run("job_morning_research", "Morning Pre-Market", "FAILED", str(e))

    def run_intraday_cycle(self):
        m_stat = IndianMarketCalendar.get_market_status()
        if not m_stat["is_open"]:
            # Intraday monitor only active when market is open
            return
        try:
            DailyReportGenerator.generate_intraday_report()
            log_job_run("job_intraday_monitor", "Intraday Monitor", "SUCCESS", "Completed 15-minute intraday observation scan.")
        except Exception as e:
            log_job_run("job_intraday_monitor", "Intraday Monitor", "FAILED", str(e))

    def run_evening_cycle(self):
        today = IndianMarketCalendar.now_ist().date()
        if not IndianMarketCalendar.is_trading_day(today):
            log_job_run("job_evening_research", "Evening Post-Market", "SKIPPED", f"Skipped: Market closed today ({today}).")
            return
        try:
            DailyReportGenerator.generate_evening_report()
            log_job_run("job_evening_research", "Evening Post-Market", "SUCCESS", "Generated final closing research report.")
        except Exception as e:
            log_job_run("job_evening_research", "Evening Post-Market", "FAILED", str(e))

    def run_screener_cycle(self):
        try:
            scanner.run_scan(scan_type="MOMENTUM", universe="NIFTY 50")
            log_job_run("job_screener_scan", "Daily Screener Scan", "SUCCESS", "Completed daily quantitative scans.")
        except Exception as e:
            log_job_run("job_screener_scan", "Daily Screener Scan", "FAILED", str(e))

market_scheduler = MarketJobScheduler()

