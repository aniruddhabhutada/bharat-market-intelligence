from fastapi import APIRouter
from ..analysis.fii_dii_analyzer import FIIDIIAnalyzer
from ..analysis.sector_analyzer import SectorAnalyzer

router = APIRouter(prefix="/api", tags=["Institutional & Sectors"])

@router.get("/fii-dii")
def get_fii_dii_flows(sessions: int = 30):
    """Returns cash market institutional flows, rolling 5D/20D sums, streaks, and regime."""
    return FIIDIIAnalyzer.get_institutional_flow_report(sessions=sessions)

@router.get("/sectors")
def get_sector_analysis():
    """Returns 16 major Indian sectors heatmap, relative strength vs Nifty, and rotation."""
    return SectorAnalyzer.get_sector_report()

