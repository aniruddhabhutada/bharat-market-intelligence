from fastapi import APIRouter, HTTPException, Response
from typing import Optional
from io import StringIO
import csv
from ..db.sqlite_db import get_reports, get_report_by_id
from ..reports.generator import DailyReportGenerator

router = APIRouter(prefix="/api/reports", tags=["Research Reports Archive"])

@router.get("")
def list_reports(report_type: Optional[str] = None, limit: int = 30):
    """Retrieves historical research reports (Morning, Intraday, Evening)."""
    return get_reports(report_type=report_type, limit=limit)

@router.get("/{report_id}")
def get_report(report_id: int):
    """Retrieves a single research report by ID."""
    rep = get_report_by_id(report_id)
    if not rep:
        raise HTTPException(status_code=404, detail="Report not found.")
    return rep

@router.post("/generate/{report_type}")
def trigger_report_generation(report_type: str):
    """Manually triggers generation of Morning, Intraday, or Evening research report."""
    rt = report_type.upper()
    if rt == "MORNING":
        return DailyReportGenerator.generate_morning_report()
    elif rt == "INTRADAY":
        return DailyReportGenerator.generate_intraday_report()
    elif rt == "EVENING":
        return DailyReportGenerator.generate_evening_report()
    else:
        raise HTTPException(status_code=400, detail="Invalid report type. Use MORNING, INTRADAY, or EVENING.")

@router.get("/{report_id}/export/csv")
def export_report_csv(report_id: int):
    """Exports structured report tables to CSV."""
    rep = get_report_by_id(report_id)
    if not rep:
        raise HTTPException(status_code=404, detail="Report not found.")
    
    output = StringIO()
    writer = csv.writer(output)
    writer.writerow(["Report Title", rep.get("title", "")])
    writer.writerow(["Report Type", rep.get("report_type", "")])
    writer.writerow(["Date", rep.get("report_date", "")])
    writer.writerow(["AI Provider", rep.get("ai_provider", "")])
    writer.writerow([])
    writer.writerow(["Section", "Details"])
    
    content = rep.get("content", {})
    for key, val in content.items():
        writer.writerow([key, str(val)[:200]])

    csv_data = output.getvalue()
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=bmi_report_{report_id}.csv"}
    )

