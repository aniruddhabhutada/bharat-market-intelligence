from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from .core.config import settings
from .db.sqlite_db import init_sqlite_db
from .scheduler.job_scheduler import market_scheduler
from .api.routes_market import router as market_router
from .api.routes_institutional import router as institutional_router
from .api.routes_research import router as research_router
from .api.routes_reports import router as reports_router
from .api.routes_user import router as user_router
from .api.routes_system import router as system_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("bharat_market_intelligence")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup actions
    logger.info("Initializing SQLite database tables...")
    init_sqlite_db()
    
    logger.info("Starting Indian Market Research APScheduler...")
    try:
        market_scheduler.start()
    except Exception as e:
        logger.warning(f"Scheduler start note: {e}")
        
    logger.info("Bharat Market Intelligence Backend is fully online.")
    yield
    # Shutdown actions
    logger.info("Shutting down Bharat Market Intelligence Backend...")

app = FastAPI(
    title="Bharat Market Intelligence API",
    description="Professional Indian Stock Market Equity Research, Quantitative Analytics & AI Synthesis Platform",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for Next.js frontend (permits Netlify, local dev, mobile LAN access)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register route modules
app.include_router(market_router)
app.include_router(institutional_router)
app.include_router(research_router)
app.include_router(reports_router)
app.include_router(user_router)
app.include_router(system_router)

@app.get("/")
def root():
    return {
        "platform": "Bharat Market Intelligence",
        "status": "ONLINE",
        "version": "1.0.0",
        "timezone": settings.TIMEZONE,
        "docs": "/docs"
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "HEALTHY",
        "service": "Bharat Market Intelligence API",
        "storage": "ONLINE",
        "data_engine": "ACTIVE"
    }

