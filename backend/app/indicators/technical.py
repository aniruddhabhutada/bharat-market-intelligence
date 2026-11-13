import numpy as np
import pandas as pd
from typing import Dict, Any, Optional, Tuple, List

class TechnicalIndicators:
    """Rigorous mathematical implementation of Technical Indicators for Indian Equities."""

    @staticmethod
    def sma(series: pd.Series, period: int) -> pd.Series:
        if len(series) < period:
            return pd.Series(index=series.index, dtype=float)
        return series.rolling(window=period).mean()

    @staticmethod
    def ema(series: pd.Series, period: int) -> pd.Series:
        if len(series) < period:
            return pd.Series(index=series.index, dtype=float)
        return series.ewm(span=period, adjust=False).mean()

    @staticmethod
    def rsi(series: pd.Series, period: int = 14) -> pd.Series:
        """Wilder's smoothed Relative Strength Index (RSI)."""
        if len(series) < (period + 1):
            return pd.Series(index=series.index, dtype=float)

        delta = series.diff()
        gain = delta.where(delta > 0, 0.0)
        loss = -delta.where(delta < 0, 0.0)

        # First average is simple mean
        avg_gain = gain.rolling(window=period).mean()
        avg_loss = loss.rolling(window=period).mean()

        # Wilder's exponential smoothing
        for i in range(period, len(series)):
            avg_gain.iloc[i] = (avg_gain.iloc[i - 1] * (period - 1) + gain.iloc[i]) / period
            avg_loss.iloc[i] = (avg_loss.iloc[i - 1] * (period - 1) + loss.iloc[i]) / period

        rs = avg_gain / avg_loss.replace(0, np.nan)
        rsi = 100.0 - (100.0 / (1.0 + rs))
        return rsi.fillna(100.0 if avg_loss.iloc[-1] == 0 else 50.0)

    @staticmethod
    def macd(series: pd.Series, fast: int = 12, slow: int = 26, signal: int = 9) -> Tuple[pd.Series, pd.Series, pd.Series]:
        ema_fast = TechnicalIndicators.ema(series, fast)
        ema_slow = TechnicalIndicators.ema(series, slow)
        macd_line = ema_fast - ema_slow
        signal_line = TechnicalIndicators.ema(macd_line.dropna(), signal)
        signal_line = signal_line.reindex(series.index)
        histogram = macd_line - signal_line
        return macd_line, signal_line, histogram

    @staticmethod
    def bollinger_bands(series: pd.Series, period: int = 20, num_std: float = 2.0) -> Tuple[pd.Series, pd.Series, pd.Series]:
        middle = TechnicalIndicators.sma(series, period)
        rolling_std = series.rolling(window=period).std()
        upper = middle + (num_std * rolling_std)
        lower = middle - (num_std * rolling_std)
        return upper, middle, lower

    @staticmethod
    def atr(df: pd.DataFrame, period: int = 14) -> pd.Series:
        """Average True Range using Wilder's smoothing."""
        high = df['high']
        low = df['low']
        close = df['close']
        prev_close = close.shift(1)

        tr1 = high - low
        tr2 = (high - prev_close).abs()
        tr3 = (low - prev_close).abs()
        tr = pd.concat([tr1, tr2, tr3], axis=1).max(axis=1)

        if len(df) < period:
            return pd.Series(index=df.index, dtype=float)

        atr_series = tr.rolling(window=period).mean()
        for i in range(period, len(df)):
            atr_series.iloc[i] = (atr_series.iloc[i - 1] * (period - 1) + tr.iloc[i]) / period
        return atr_series

    @staticmethod
    def supertrend(df: pd.DataFrame, period: int = 10, multiplier: float = 3.0) -> Tuple[pd.Series, pd.Series]:
        """Calculates Supertrend (value series and direction series: 1 for Bullish, -1 for Bearish)."""
        atr_val = TechnicalIndicators.atr(df, period)
        hl2 = (df['high'] + df['low']) / 2.0

        basic_upper = hl2 + (multiplier * atr_val)
        basic_lower = hl2 - (multiplier * atr_val)

        final_upper = pd.Series(index=df.index, dtype=float)
        final_lower = pd.Series(index=df.index, dtype=float)
        trend = pd.Series(index=df.index, dtype=int)
        supertrend_val = pd.Series(index=df.index, dtype=float)

        close = df['close']

        for i in range(len(df)):
            if i == 0 or np.isnan(atr_val.iloc[i]):
                final_upper.iloc[i] = basic_upper.iloc[i]
                final_lower.iloc[i] = basic_lower.iloc[i]
                trend.iloc[i] = 1
                supertrend_val.iloc[i] = basic_lower.iloc[i]
                continue

            # Lower Band condition
            if basic_lower.iloc[i] > final_lower.iloc[i - 1] or close.iloc[i - 1] < final_lower.iloc[i - 1]:
                final_lower.iloc[i] = basic_lower.iloc[i]
            else:
                final_lower.iloc[i] = final_lower.iloc[i - 1]

            # Upper Band condition
            if basic_upper.iloc[i] < final_upper.iloc[i - 1] or close.iloc[i - 1] > final_upper.iloc[i - 1]:
                final_upper.iloc[i] = basic_upper.iloc[i]
            else:
                final_upper.iloc[i] = final_upper.iloc[i - 1]

            # Trend direction
            if trend.iloc[i - 1] == 1:
                if close.iloc[i] < final_lower.iloc[i]:
                    trend.iloc[i] = -1
                    supertrend_val.iloc[i] = final_upper.iloc[i]
                else:
                    trend.iloc[i] = 1
                    supertrend_val.iloc[i] = final_lower.iloc[i]
            else:
                if close.iloc[i] > final_upper.iloc[i]:
                    trend.iloc[i] = 1
                    supertrend_val.iloc[i] = final_lower.iloc[i]
                else:
                    trend.iloc[i] = -1
                    supertrend_val.iloc[i] = final_upper.iloc[i]

        return supertrend_val, trend

    @staticmethod
    def adx(df: pd.DataFrame, period: int = 14) -> Tuple[pd.Series, pd.Series, pd.Series]:
        """Calculates Average Directional Index (ADX), +DI, -DI."""
        if len(df) < (period * 2):
            empty = pd.Series(index=df.index, dtype=float)
            return empty, empty, empty

        high = df['high']
        low = df['low']
        close = df['close']

        up_move = high - high.shift(1)
        down_move = low.shift(1) - low

        plus_dm = np.where((up_move > down_move) & (up_move > 0), up_move, 0.0)
        minus_dm = np.where((down_move > up_move) & (down_move > 0), down_move, 0.0)

        tr = TechnicalIndicators.atr(df, period)
        plus_di = 100.0 * (pd.Series(plus_dm, index=df.index).rolling(window=period).mean() / tr)
        minus_di = 100.0 * (pd.Series(minus_dm, index=df.index).rolling(window=period).mean() / tr)

        dx = 100.0 * ((plus_di - minus_di).abs() / (plus_di + minus_di).replace(0, np.nan))
        adx_val = dx.rolling(window=period).mean()

        return adx_val, plus_di, minus_di

    @staticmethod
    def vwap(df: pd.DataFrame) -> pd.Series:
        """Volume Weighted Average Price (intraday sessions)."""
        typical_price = (df['high'] + df['low'] + df['close']) / 3.0
        cum_vol = df['volume'].cumsum()
        cum_tp_vol = (typical_price * df['volume']).cumsum()
        return cum_tp_vol / cum_vol.replace(0, np.nan)

    @staticmethod
    def detect_pivots_support_resistance(df: pd.DataFrame) -> Dict[str, float]:
        """Calculates Classical and Camarilla Pivot Points from latest daily candle."""
        if df.empty:
            return {}
        last = df.iloc[-1]
        h = float(last['high'])
        l = float(last['low'])
        c = float(last['close'])

        pivot = (h + l + c) / 3.0
        r1 = (2 * pivot) - l
        s1 = (2 * pivot) - h
        r2 = pivot + (h - l)
        s2 = pivot - (h - l)
        r3 = h + 2 * (pivot - l)
        s3 = l - 2 * (h - pivot)

        # Camarilla levels
        rng = h - l
        cam_r4 = c + (rng * 1.1 / 2)
        cam_r3 = c + (rng * 1.1 / 4)
        cam_s3 = c - (rng * 1.1 / 4)
        cam_s4 = c - (rng * 1.1 / 2)

        return {
            "pivot": round(pivot, 2),
            "r1": round(r1, 2),
            "s1": round(s1, 2),
            "r2": round(r2, 2),
            "s2": round(s2, 2),
            "r3": round(r3, 2),
            "s3": round(s3, 2),
            "cam_r4_breakout": round(cam_r4, 2),
            "cam_r3_reversal": round(cam_r3, 2),
            "cam_s3_reversal": round(cam_s3, 2),
            "cam_s4_breakdown": round(cam_s4, 2)
        }

    @classmethod
    def calculate_full_analysis(cls, df: pd.DataFrame) -> Dict[str, Any]:
        """Runs complete technical indicator battery on an OHLCV dataframe."""
        if df.empty or len(df) < 20:
            return {"error": "Insufficient history (less than 20 sessions)."}

        close = df['close']
        last_price = float(close.iloc[-1])
        prev_close = float(close.iloc[-2]) if len(close) > 1 else last_price

        # Moving Averages
        sma20 = cls.sma(close, 20).iloc[-1]
        sma50 = cls.sma(close, 50).iloc[-1] if len(close) >= 50 else None
        sma100 = cls.sma(close, 100).iloc[-1] if len(close) >= 100 else None
        sma200 = cls.sma(close, 200).iloc[-1] if len(close) >= 200 else None

        ema9 = cls.ema(close, 9).iloc[-1]
        ema20 = cls.ema(close, 20).iloc[-1]

        # Oscillators
        rsi_series = cls.rsi(close, 14)
        rsi_val = rsi_series.iloc[-1] if not rsi_series.empty else 50.0

        macd_l, signal_l, hist_l = cls.macd(close)
        macd_val = macd_l.iloc[-1] if not macd_l.empty else 0.0
        signal_val = signal_l.iloc[-1] if not signal_l.empty else 0.0
        hist_val = hist_l.iloc[-1] if not hist_l.empty else 0.0

        upper_bb, mid_bb, lower_bb = cls.bollinger_bands(close, 20, 2.0)
        atr_series = cls.atr(df, 14)
        atr_val = atr_series.iloc[-1] if not atr_series.empty else (last_price * 0.015)

        st_val_series, st_trend_series = cls.supertrend(df, 10, 3.0)
        st_val = st_val_series.iloc[-1] if not st_val_series.empty else last_price
        st_trend = int(st_trend_series.iloc[-1]) if not st_trend_series.empty else 1

        adx_series, p_di, m_di = cls.adx(df, 14)
        adx_val = adx_series.iloc[-1] if not adx_series.empty and not np.isnan(adx_series.iloc[-1]) else 20.0

        # Volume MA & RVOL
        vol = df['volume']
        vol_ma20 = vol.rolling(window=20).mean().iloc[-1] if len(vol) >= 20 else vol.iloc[-1]
        rvol = round(float(vol.iloc[-1] / vol_ma20), 2) if vol_ma20 > 0 else 1.0

        pivots = cls.detect_pivots_support_resistance(df)

        # Trend & Alignment Assessment
        ma_alignment = "MIXED"
        if sma200 is not None and sma50 is not None:
            if last_price > ema20 > sma50 > sma200:
                ma_alignment = "STRONGLY_BULLISH"
            elif last_price < ema20 < sma50 < sma200:
                ma_alignment = "STRONGLY_BEARISH"
            elif last_price > sma200:
                ma_alignment = "MODERATELY_BULLISH"
            else:
                ma_alignment = "MODERATELY_BEARISH"

        return {
            "last_price": round(last_price, 2),
            "sma20": round(float(sma20), 2) if pd.notna(sma20) else None,
            "sma50": round(float(sma50), 2) if pd.notna(sma50) else None,
            "sma100": round(float(sma100), 2) if pd.notna(sma100) else None,
            "sma200": round(float(sma200), 2) if pd.notna(sma200) else None,
            "ema9": round(float(ema9), 2) if pd.notna(ema9) else None,
            "ema20": round(float(ema20), 2) if pd.notna(ema20) else None,
            "rsi14": round(float(rsi_val), 2),
            "macd": round(float(macd_val), 2),
            "macd_signal": round(float(signal_val), 2),
            "macd_hist": round(float(hist_val), 2),
            "bollinger_upper": round(float(upper_bb.iloc[-1]), 2) if pd.notna(upper_bb.iloc[-1]) else None,
            "bollinger_middle": round(float(mid_bb.iloc[-1]), 2) if pd.notna(mid_bb.iloc[-1]) else None,
            "bollinger_lower": round(float(lower_bb.iloc[-1]), 2) if pd.notna(lower_bb.iloc[-1]) else None,
            "atr14": round(float(atr_val), 2),
            "supertrend_value": round(float(st_val), 2),
            "supertrend_direction": "BULLISH" if st_trend == 1 else "BEARISH",
            "adx14": round(float(adx_val), 2),
            "rvol": rvol,
            "ma_alignment": ma_alignment,
            "pivots": pivots
        }

