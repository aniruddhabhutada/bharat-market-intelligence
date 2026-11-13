import sqlite3
import json
from datetime import datetime
from typing import List, Dict, Any, Optional
from ..core.config import settings

def get_db_connection():
    conn = sqlite3.connect(str(settings.DB_PATH))
    conn.row_factory = sqlite3.Row
    return conn

def init_sqlite_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # 1. Watchlists
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS watchlists (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        symbols TEXT NOT NULL, -- JSON list of symbols
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)
    
    # 2. Portfolio holdings
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS portfolio (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        symbol TEXT NOT NULL,
        exchange TEXT DEFAULT 'NSE',
        purchase_price REAL NOT NULL,
        quantity INTEGER NOT NULL,
        purchase_date DATE,
        sector TEXT,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)
    
    # 3. Reports Archive
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS reports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        report_type TEXT NOT NULL, -- MORNING, INTRADAY, EVENING, STOCK
        report_date DATE NOT NULL,
        title TEXT NOT NULL,
        summary TEXT,
        content_json TEXT NOT NULL,
        ai_provider TEXT DEFAULT 'rule_based',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)
    
    # 4. Scheduled Jobs Execution History
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS scheduled_jobs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        job_id TEXT NOT NULL,
        job_name TEXT NOT NULL,
        run_time TIMESTAMP NOT NULL,
        status TEXT NOT NULL, -- SUCCESS, FAILED, MISSED, PENDING
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)
    
    # 5. Data Quality Warnings & Logs
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS data_quality_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        provider TEXT NOT NULL,
        symbol TEXT,
        issue_type TEXT NOT NULL, -- ANOMALY, STALE, DISCREPANCY, UNAVAILABLE
        severity TEXT NOT NULL, -- LOW, MEDIUM, CRITICAL
        details TEXT
    )
    """)
    
    # 6. User Settings
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS app_settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)
    
    # Seed default watchlist if empty
    cursor.execute("SELECT COUNT(*) FROM watchlists")
    if cursor.fetchone()[0] == 0:
        default_symbols = json.dumps([
            "RELIANCE", "TCS", "HDFCBANK", "INFY", "ICICIBANK",
            "BHARTIARTL", "SBIN", "LICI", "ITC", "HINDUNILVR",
            "LT", "BAJFINANCE", "MARUTI", "SUNPHARMA", "TATAMOTORS"
        ])
        cursor.execute("INSERT INTO watchlists (name, symbols) VALUES (?, ?)", ("Nifty Core Leaders", default_symbols))
        
        bank_symbols = json.dumps(["HDFCBANK", "ICICIBANK", "SBIN", "KOTAKBANK", "AXISBANK", "INDUSINDBK"])
        cursor.execute("INSERT INTO watchlists (name, symbols) VALUES (?, ?)", ("Top Private & PSU Banks", bank_symbols))
        
    conn.commit()
    conn.close()

# Watchlist CRUD
def get_all_watchlists() -> List[Dict[str, Any]]:
    conn = get_db_connection()
    rows = conn.execute("SELECT * FROM watchlists ORDER BY id ASC").fetchall()
    conn.close()
    return [{"id": r["id"], "name": r["name"], "symbols": json.loads(r["symbols"])} for r in rows]

def save_watchlist(name: str, symbols: List[str]) -> Dict[str, Any]:
    conn = get_db_connection()
    cursor = conn.cursor()
    symbols_json = json.dumps(symbols)
    cursor.execute("""
    INSERT INTO watchlists (name, symbols, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(name) DO UPDATE SET symbols=excluded.symbols, updated_at=CURRENT_TIMESTAMP
    """, (name, symbols_json))
    conn.commit()
    conn.close()
    return {"name": name, "symbols": symbols}

def delete_watchlist(name: str):
    conn = get_db_connection()
    conn.execute("DELETE FROM watchlists WHERE name = ?", (name,))
    conn.commit()
    conn.close()

# Portfolio CRUD
def get_portfolio_positions() -> List[Dict[str, Any]]:
    conn = get_db_connection()
    rows = conn.execute("SELECT * FROM portfolio ORDER BY id DESC").fetchall()
    conn.close()
    return [dict(r) for r in rows]

def add_portfolio_position(symbol: str, purchase_price: float, quantity: int, sector: str = "", notes: str = "", purchase_date: str = ""):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO portfolio (symbol, exchange, purchase_price, quantity, purchase_date, sector, notes)
    VALUES (?, 'NSE', ?, ?, ?, ?, ?)
    """, (symbol.upper(), purchase_price, quantity, purchase_date or datetime.now().strftime("%Y-%m-%d"), sector, notes))
    conn.commit()
    conn.close()

def delete_portfolio_position(position_id: int):
    conn = get_db_connection()
    conn.execute("DELETE FROM portfolio WHERE id = ?", (position_id,))
    conn.commit()
    conn.close()

# Reports Storage
def save_report(report_type: str, report_date: str, title: str, summary: str, content: Dict[str, Any], ai_provider: str = "rule_based"):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO reports (report_type, report_date, title, summary, content_json, ai_provider)
    VALUES (?, ?, ?, ?, ?, ?)
    """, (report_type, report_date, title, summary, json.dumps(content, default=str), ai_provider))
    conn.commit()
    conn.close()

def get_reports(report_type: Optional[str] = None, limit: int = 30) -> List[Dict[str, Any]]:
    conn = get_db_connection()
    if report_type:
        rows = conn.execute("SELECT * FROM reports WHERE report_type = ? ORDER BY id DESC LIMIT ?", (report_type, limit)).fetchall()
    else:
        rows = conn.execute("SELECT * FROM reports ORDER BY id DESC LIMIT ?", (limit,)).fetchall()
    conn.close()
    result = []
    for r in rows:
        item = dict(r)
        item["content"] = json.loads(item["content_json"])
        del item["content_json"]
        result.append(item)
    return result

def get_report_by_id(report_id: int) -> Optional[Dict[str, Any]]:
    conn = get_db_connection()
    row = conn.execute("SELECT * FROM reports WHERE id = ?", (report_id,)).fetchone()
    conn.close()
    if not row:
        return None
    item = dict(row)
    item["content"] = json.loads(item["content_json"])
    del item["content_json"]
    return item

# Data Quality Logging
def log_data_quality_issue(provider: str, symbol: Optional[str], issue_type: str, severity: str, details: str):
    conn = get_db_connection()
    conn.execute("""
    INSERT INTO data_quality_logs (provider, symbol, issue_type, severity, details)
    VALUES (?, ?, ?, ?, ?)
    """, (provider, symbol, issue_type, severity, details))
    conn.commit()
    conn.close()

def get_data_quality_logs(limit: int = 50) -> List[Dict[str, Any]]:
    conn = get_db_connection()
    rows = conn.execute("SELECT * FROM data_quality_logs ORDER BY id DESC LIMIT ?", (limit,)).fetchall()
    conn.close()
    return [dict(r) for r in rows]

# Scheduled Jobs
def log_job_run(job_id: str, job_name: str, status: str, message: str = ""):
    conn = get_db_connection()
    conn.execute("""
    INSERT INTO scheduled_jobs (job_id, job_name, run_time, status, message)
    VALUES (?, ?, CURRENT_TIMESTAMP, ?, ?)
    """, (job_id, job_name, status, message))
    conn.commit()
    conn.close()

def get_recent_job_runs(limit: int = 20) -> List[Dict[str, Any]]:
    conn = get_db_connection()
    rows = conn.execute("SELECT * FROM scheduled_jobs ORDER BY id DESC LIMIT ?", (limit,)).fetchall()
    conn.close()
    return [dict(r) for r in rows]

