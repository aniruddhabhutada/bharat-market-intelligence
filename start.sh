#!/usr/bin/env bash
# ==============================================================================
# BHARAT MARKET INTELLIGENCE - UNIX LAUNCHER (macOS / Linux)
# ==============================================================================

set -e

echo "==============================================================================="
echo "             BHARAT MARKET INTELLIGENCE (AI-POWERED PLATFORM)"
echo "==============================================================================="
echo ""

# 1. Environment checks
command -v python3 >/dev/null 2>&1 || { echo "[ERROR] python3 is required."; exit 1; }
command -v node >/dev/null 2>&1 || { echo "[ERROR] node is required."; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "[ERROR] npm is required."; exit 1; }

# 2. Directories
mkdir -p data/historical data/reports data/cache

# 3. Launch Backend
echo "[1/2] Starting FastAPI Backend on http://127.0.0.1:8000..."
python3 -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!

sleep 2

# 4. Launch Frontend
echo "[2/2] Starting Next.js Frontend on http://localhost:3000..."
cd frontend
npm run dev -- -p 3000 -H 0.0.0.0 &
FRONTEND_PID=$!
cd ..

trap "kill $BACKEND_PID $FRONTEND_PID" EXIT

echo ""
echo "==============================================================================="
echo " PLATFORM ONLINE"
echo " * Web Terminal: http://localhost:3000"
echo " * API Docs:     http://localhost:8000/docs"
echo "==============================================================================="
echo "Press Ctrl+C to terminate all services."

wait

