import math
import numpy as np

def sanitize_json(obj):
    """Recursively replaces NaN, Inf, and non-compliant floats with None or safe numbers."""
    if isinstance(obj, float):
        if math.isnan(obj) or math.isinf(obj) or np.isnan(obj) or np.isinf(obj):
            return None
        return obj
    elif isinstance(obj, dict):
        return {k: sanitize_json(v) for k, v in obj.items()}
    elif isinstance(obj, (list, tuple)):
        return [sanitize_json(x) for x in obj]
    return obj

