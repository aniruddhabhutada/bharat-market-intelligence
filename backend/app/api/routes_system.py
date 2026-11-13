from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, Dict, Any
from ..data_engine.provider_manager import provider_mgr
from ..db.sqlite_db import get_data_quality_logs, get_recent_job_runs
from ..core.config import settings

router = APIRouter(prefix="/api/system", tags=["System & Data Quality"])

class SettingsUpdatePayload(BaseModel):
    default_ai_provider: Optional[str] = None
    gemini_api_key: Optional[str] = None
    intraday_poll_interval_minutes: Optional[int] = None

@router.get("/data-quality")
def get_data_quality_status():
    """Returns real-time data provider health, quote counts, and anomalies."""
    audit = provider_mgr.get_data_quality_audit()
    recent_logs = get_data_quality_logs(limit=20)
    return {
        "audit": audit.dict(),
        "recent_issues": recent_logs
    }

@router.get("/jobs")
def get_job_history():
    """Returns recent scheduled cycle runs."""
    return get_recent_job_runs(limit=20)

@router.get("/settings")
def get_app_settings():
    """Returns public runtime settings."""
    return {
        "environment": settings.ENVIRONMENT,
        "timezone": settings.TIMEZONE,
        "morning_schedule_time": settings.MORNING_SCHEDULE_TIME,
        "intraday_poll_interval_minutes": settings.INTRADAY_POLL_INTERVAL_MINUTES,
        "evening_schedule_time": settings.EVENING_SCHEDULE_TIME,
        "default_ai_provider": settings.DEFAULT_AI_PROVIDER,
        "has_gemini_key": bool(settings.GEMINI_API_KEY),
        "ollama_base_url": settings.OLLAMA_BASE_URL
    }

@router.post("/settings")
def update_app_settings(payload: SettingsUpdatePayload):
    if payload.default_ai_provider:
        settings.DEFAULT_AI_PROVIDER = payload.default_ai_provider
    if payload.gemini_api_key is not None:
        settings.GEMINI_API_KEY = payload.gemini_api_key
    if payload.intraday_poll_interval_minutes:
        settings.INTRADAY_POLL_INTERVAL_MINUTES = payload.intraday_poll_interval_minutes
    return {"message": "Settings updated successfully."}

