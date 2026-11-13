@echo off
TITLE Bharat Market Intelligence - Startup Launcher
COLOR 0B

echo ===============================================================================
echo                BHARAT MARKET INTELLIGENCE (AI-POWERED PLATFORM)
echo ===============================================================================
echo.
echo [1/4] Checking environment prerequisites...

where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Python 3.10+ is required but not found in PATH.
    pause
    exit /b 1
)

where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is required but not found in PATH.
    pause
    exit /b 1
)

echo [2/4] Initializing local database and directories...
if not exist "data" mkdir "data"
if not exist "data\historical" mkdir "data\historical"
if not exist "data\reports" mkdir "data\reports"
if not exist "data\cache" mkdir "data\cache"

echo [3/4] Launching FastAPI Quantitative Backend (Port 8000)...
start "BMI Backend API" cmd /k "python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload"

timeout /t 3 /nobreak >nul

echo [4/4] Launching Next.js Professional Interface (Port 3000)...
cd frontend
start "BMI Frontend Terminal" cmd /k "npm run dev -- -p 3000 -H 0.0.0.0"
cd ..

echo.
echo ===============================================================================
echo  PLATFORM SUCCESSFULLY LAUNCHED!
echo ===============================================================================
echo  * Local Terminal Desktop: http://localhost:3000
echo  * Backend API Swagger:    http://localhost:8000/docs
echo  * Mobile Phone on Wi-Fi:  http://YOUR_LOCAL_IP:3000
echo ===============================================================================
echo.

timeout /t 3 /nobreak >nul
start http://localhost:3000

