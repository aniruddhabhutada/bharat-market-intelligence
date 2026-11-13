import duckdb
import pandas as pd
from pathlib import Path
from typing import Optional, List, Dict, Any
from ..core.config import settings

class DuckDBStore:
    def __init__(self, db_path: Optional[Path] = None):
        self.db_path = str(db_path or settings.DUCKDB_PATH)
        self._init_db()

    def _get_connection(self):
        return duckdb.connect(self.db_path)

    def _init_db(self):
        conn = self._get_connection()
        # Initialize tables for daily OHLCV and intraday bars
        conn.execute("""
        CREATE TABLE IF NOT EXISTS daily_ohlcv (
            symbol VARCHAR,
            date DATE,
            open DOUBLE,
            high DOUBLE,
            low DOUBLE,
            close DOUBLE,
            adj_close DOUBLE,
            volume BIGINT,
            delivery_qty BIGINT,
            delivery_pct DOUBLE,
            turnover DOUBLE,
            provider VARCHAR,
            PRIMARY KEY (symbol, date)
        );
        """)

        conn.execute("""
        CREATE TABLE IF NOT EXISTS intraday_5m (
            symbol VARCHAR,
            timestamp TIMESTAMP,
            open DOUBLE,
            high DOUBLE,
            low DOUBLE,
            close DOUBLE,
            volume BIGINT,
            PRIMARY KEY (symbol, timestamp)
        );
        """)

        conn.execute("""
        CREATE TABLE IF NOT EXISTS fii_dii_cash (
            date DATE PRIMARY KEY,
            fii_gross_buy DOUBLE,
            fii_gross_sell DOUBLE,
            fii_net DOUBLE,
            dii_gross_buy DOUBLE,
            dii_gross_sell DOUBLE,
            dii_net DOUBLE,
            provider VARCHAR
        );
        """)
        conn.close()

    def store_daily_ohlcv(self, df: pd.DataFrame):
        """Stores or updates daily OHLCV data into DuckDB."""
        if df.empty:
            return
        df = df.copy()
        for col in ["delivery_qty", "delivery_pct", "turnover"]:
            if col not in df.columns:
                df[col] = None
        conn = self._get_connection()
        conn.register("df_temp", df)
        conn.execute("""
        INSERT OR REPLACE INTO daily_ohlcv
        SELECT symbol, CAST(date AS DATE), open, high, low, close, adj_close, volume, delivery_qty, delivery_pct, turnover, provider
        FROM df_temp;
        """)
        conn.close()

    def get_daily_ohlcv(self, symbol: str, limit: int = 250) -> pd.DataFrame:
        """Retrieves daily OHLCV dataframe sorted by date ascending."""
        conn = self._get_connection()
        query = """
        SELECT symbol, date, open, high, low, close, adj_close, volume, delivery_qty, delivery_pct, turnover, provider
        FROM daily_ohlcv
        WHERE symbol = ?
        ORDER BY date DESC
        LIMIT ?
        """
        df = conn.execute(query, [symbol.upper(), limit]).fetchdf()
        conn.close()
        if not df.empty:
            df = df.sort_values(by="date", ascending=True).reset_index(drop=True)
        return df

    def store_fii_dii(self, df: pd.DataFrame):
        if df.empty:
            return
        conn = self._get_connection()
        conn.register("df_fii_temp", df)
        conn.execute("""
        INSERT OR REPLACE INTO fii_dii_cash
        SELECT CAST(date AS DATE), fii_gross_buy, fii_gross_sell, fii_net, dii_gross_buy, dii_gross_sell, dii_net, provider
        FROM df_fii_temp;
        """)
        conn.close()

    def get_fii_dii_history(self, limit: int = 60) -> pd.DataFrame:
        conn = self._get_connection()
        query = """
        SELECT date, fii_gross_buy, fii_gross_sell, fii_net, dii_gross_buy, dii_gross_sell, dii_net, provider
        FROM fii_dii_cash
        ORDER BY date DESC
        LIMIT ?
        """
        df = conn.execute(query, [limit]).fetchdf()
        conn.close()
        if not df.empty:
            df = df.sort_values(by="date", ascending=True).reset_index(drop=True)
        return df

duck_store = DuckDBStore()

