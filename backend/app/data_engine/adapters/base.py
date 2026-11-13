from abc import ABC, abstractmethod
from typing import Optional, List, Dict, Any
from datetime import date
import pandas as pd
from ..models import Quote, IndexQuote, FIIDIIRecord

class BaseDataProvider(ABC):
    def __init__(self, name: str):
        self.name = name
        self.last_healthy = True
        self.last_error: Optional[str] = None

    @abstractmethod
    def get_quote(self, symbol: str) -> Optional[Quote]:
        """Fetch latest quote for an Indian stock."""
        pass

    @abstractmethod
    def get_history(self, symbol: str, days: int = 120) -> pd.DataFrame:
        """Fetch historical daily OHLCV dataframe."""
        pass

    @abstractmethod
    def get_indices(self) -> List[IndexQuote]:
        """Fetch major indices (NIFTY 50, BANK NIFTY, SENSEX, VIX, etc)."""
        pass

    @abstractmethod
    def is_healthy(self) -> bool:
        """Return provider health status."""
        pass

