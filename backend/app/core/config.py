import os
from pathlib import Path
from pydantic_settings import BaseSettings
from typing import List

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent

class Settings(BaseSettings):
    API_HOST: str = "127.0.0.1"
    API_PORT: int = 8000
    FRONTEND_PORT: int = 3000
    ENVIRONMENT: str = "development"
    
    # Paths
    BASE_PATH: Path = BASE_DIR
    DATA_DIR: Path = BASE_DIR / "data"
    DB_PATH: Path = BASE_DIR / "data" / "market_intel.db"
    DUCKDB_PATH: Path = BASE_DIR / "data" / "historical" / "markets.duckdb"
    REPORTS_DIR: Path = BASE_DIR / "data" / "reports"
    CACHE_DIR: Path = BASE_DIR / "data" / "cache"
    
    # Timezone & Scheduling
    TIMEZONE: str = "Asia/Kolkata"
    MORNING_SCHEDULE_TIME: str = "08:30"
    INTRADAY_POLL_INTERVAL_MINUTES: int = 15
    EVENING_SCHEDULE_TIME: str = "15:45"
    SCREENER_SCHEDULE_TIME: str = "18:00"
    
    # AI Engine
    DEFAULT_AI_PROVIDER: str = "rule_based" # rule_based, gemini, ollama
    GEMINI_API_KEY: str = ""
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "llama3.2:latest"
    
    # Quality & Provider settings
    NSE_REQUEST_TIMEOUT_SECONDS: int = 10
    CACHE_TTL_INTRADAY_SECONDS: int = 30
    CACHE_TTL_EOD_HOURS: int = 24
    DATA_QUALITY_STRICT_MODE: bool = True
    MAX_PARALLEL_DOWNLOADS: int = 3
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "*"
    ]
    
    model_config = {
        "env_file": str(BASE_DIR / ".env"),
        "env_file_encoding": "utf-8",
        "extra": "allow"
    }

settings = Settings()

# Ensure directories exist
settings.DATA_DIR.mkdir(parents=True, exist_ok=True)
(settings.DATA_DIR / "historical").mkdir(parents=True, exist_ok=True)
settings.REPORTS_DIR.mkdir(parents=True, exist_ok=True)
settings.CACHE_DIR.mkdir(parents=True, exist_ok=True)
