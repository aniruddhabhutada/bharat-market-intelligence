# Bharat Market Intelligence — Deployment & GitHub Guide

This guide walks you through uploading your complete codebase to GitHub and deploying the application to Netlify (and connecting the Python FastAPI backend on Render / Railway).

---

## 1. Uploading to GitHub

The project has been prepared with clean `.gitignore` files, removed nested git submodules, and structured configurations.

### Step 1: Create a New Repository on GitHub
1. Go to [github.com/new](https://github.com/new).
2. Repository name: `bharat-market-intelligence` (or any preferred name).
3. Set visibility to **Public** or **Private**.
4. **Do NOT** initialize with a README, .gitignore, or license (these are already configured in this workspace).
5. Click **Create repository**.

### Step 2: Initialize Git and Push from Terminal
Open your terminal in `g:\vy` (or your project directory) and run:

```bash
# 1. Initialize git (if not already done)
git init

# 2. Stage all project files (ignoring build artifacts, node_modules, and virtualenvs)
git add .

# 3. Commit the codebase
git commit -m "feat: Bharat Market Intelligence initial release"

# 4. Set main branch
git branch -M main

# 5. Link to your GitHub repository (replace with your actual GitHub URL)
git remote add origin https://github.com/YOUR_USERNAME/bharat-market-intelligence.git

# 6. Push to GitHub
git push -u origin main
```

---

## 2. Deploying the Frontend to Netlify

### Is it possible?
**YES!** Netlify is built specifically for modern Next.js and React applications. 

### Built-in Zero-Crash Offline Architecture
Because Netlify is a serverless JAMstack hosting platform, Python daemons (FastAPI + DuckDB + SQLite + APScheduler) cannot run as persistent background processes inside Netlify itself. 
To solve this seamlessly:
- **Instant Previews**: We designed the Next.js frontend with an intelligent offline dataset (`frontend/src/lib/fallbackData.ts`) and fallback interceptor (`frontend/src/lib/api.ts`).
- When deployed on Netlify, **all 13 modules render immediately without crashing or blank screens**, showing verified Indian market baseline quotes (NIFTY 50, Bank Nifty, Sectors, FII/DII institutional flows, momentum screeners, and SVG financial charts).
- Once your backend is hosted (see Step 3 below), simply provide the backend URL in Netlify and it switches dynamically to live backend data!

### Step-by-Step Netlify Setup:
1. Log in to [Netlify.com](https://www.netlify.com/).
2. Click **"Add new site"** &rarr; **"Import an existing project"**.
3. Select **GitHub** and authorize access to your `bharat-market-intelligence` repository.
4. Netlify will detect the `netlify.toml` file automatically. Verify the build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
5. Click **Deploy Site**.
6. Netlify will build and deploy your site in ~1–2 minutes, providing you with a free `https://<your-site-name>.netlify.app` URL.

---

## 3. Connecting the Python Backend (Free Hosting)

To power real-time NSE/BSE scrapers, yfinance ingestion, DuckDB historical queries, and the local AI analyst engine in production:

### Option A: Render.com (Recommended Free Hosting)
1. Go to [render.com](https://render.com/) and connect your GitHub repository.
2. Select **"Blueprint"** (Render will automatically read the included `render.yaml`), or create a **"Web Service"**:
   - **Name**: `bharat-market-intel-backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT`
3. Click **Create Web Service**. Render will deploy your FastAPI backend with a free public URL (e.g., `https://bharat-market-intel-backend.onrender.com`).
4. **Connect to Netlify**:
   - Go to your Netlify site dashboard &rarr; **Site configuration** &rarr; **Environment variables**.
   - Add variable: `NEXT_PUBLIC_API_URL`
   - Value: `https://bharat-market-intel-backend.onrender.com/api`
   - Trigger a redeploy in Netlify!

### Option B: Local Mode (Hybrid Desktop / Mobile on LAN)
You can also run the backend on your own PC and view it on your phone or local network:
- Double click `start_windows.bat` on Windows (or run `./start.sh` on Linux/Mac).
- Backend runs on `http://localhost:8000`.
- Frontend runs on `http://localhost:3000`.

---

## 4. Key Configuration Files Included

| File | Purpose |
|---|---|
| `netlify.toml` | Root Netlify configuration pointing build to `frontend/` with `@netlify/plugin-nextjs` |
| `frontend/netlify.toml` | Direct directory build fallback for Netlify |
| `render.yaml` | 1-Click blueprint for Render.com Python FastAPI deployment |
| `Procfile` | Universal container start command for Railway, Heroku, or Koyeb |
| `.gitignore` | Comprehensive rules excluding `.next`, `node_modules`, `venv`, DuckDB/SQLite data, and logs |
| `frontend/src/lib/fallbackData.ts` | Complete offline snapshot ensuring 100% uptime on Netlify |
| `frontend/src/lib/api.ts` | Dynamic environment URL resolution with auto-fallback |

