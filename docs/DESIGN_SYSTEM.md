# Bharat Market Intelligence — Design System Specification

**Version:** 2.0 (UX Transformation Edition)  
**Target:** Indian Equity Research for Retail Investors & Analysts  
**Guiding Principle:** Complexity is Optional. Clarity is the Default.

---

## 1. Core UX Principles

### 1.1 Progressive Disclosure
Show the simplest, most intuitive explanation first. Allow beginners to understand market direction within 10 seconds without knowing what RSI or MACD means. Reveal quantitative models, institutional cash flows, and technical charts only when the user requests deeper data or switches to **Advanced View**.

### 1.2 Dual Experience Modes
- **Simple View (Default):**
  - Plain English summaries ("The 50 major companies rose today").
  - Intuitive question-based screeners ("Find financially strong companies").
  - Clickable `ExplainThis` (?) buttons next to all financial metrics.
  - Generous whitespace, large legible numbers, friendly sector categories.
- **Advanced View:**
  - Full candlestick charts with SMA20 and volume bars.
  - Multi-factor quantitative scoring (Composite, Fundamental, Technical /100).
  - Microstructure analysis and institutional order flow metrics.
  - Complete 5-year balance sheet progressions and FII/DII cash ledgers.

### 1.3 Truthful & Neutral Language
- Never use promotional "Guaranteed Winning Stocks" or unexplained BUY/SELL signals.
- Always provide both the positive thesis and the primary risk for every research candidate.
- Real-time or latest verified market status clearly disclosed on every metric.

---

## 2. Color Palette & Theming

The application defaults to a **Clean Light Theme** for welcoming, accessible readability, with full support for an optional **Dark Terminal Theme**.

### 2.1 CSS Variables & Design Tokens

| Token | Light Theme (Default) | Dark Theme | Purpose |
| :--- | :--- | :--- | :--- |
| `--bg-main` | `#f8fafc` (Slate 50) | `#0b0f19` (Obsidian) | Main viewport canvas |
| `--bg-card` | `#ffffff` (Pure White) | `#0e1524` (Deep Blue-Gray) | Content cards & panels |
| `--bg-card-hover` | `#f1f5f9` (Slate 100) | `#162032` | Interactive card hover states |
| `--border-color` | `#e2e8f0` (Slate 200) | `rgba(255,255,255,0.08)` | Hairline separation lines |
| `--text-primary` | `#0f172a` (Slate 900) | `#f3f4f6` (Off-white) | Headings, company titles, prices |
| `--text-secondary` | `#475569` (Slate 600) | `#9ca3af` (Gray 400) | Body paragraphs & explanations |
| `--text-muted` | `#64748b` (Slate 500) | `#6b7280` | Timestamps, exchange badges |
| `--accent-blue` | `#2563eb` (Royal Blue) | `#3b82f6` | Primary action buttons & active states |
| `--market-green` | `#16a34a` (Emerald 600) | `#10b981` (Emerald 400) | Positive price movement & profits |
| `--market-red` | `#dc2626` (Rose 600) | `#ef4444` (Rose 400) | Negative price movement & risks |

---

## 3. Typography Hierarchy

Body text defaults to 15px/16px with comfortable 1.6 line height for effortless readability across mobile and desktop.

| Level | Size | Weight | Tracking | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Hero Display** | 28px – 36px | 800 (Extra Bold) | `-0.03em` | Main homepage headline |
| **Section Title** | 18px – 22px | 700 (Bold) | `-0.02em` | Major module headers |
| **Card Header** | 14px – 16px | 700 (Bold) | `-0.01em` | Stock symbols, index titles |
| **Body Text** | 14px – 15px | 400 (Regular) | `normal` | Plain-English explanations & summaries |
| **Caption & Meta**| 11px – 12px | 500 (Medium) | `normal` | Sub-labels, dates, sources |
| **Numeric Data** | 14px – 28px | 800 (Mono Bold) | `tabular-nums` | Prices, P/E ratios, percentages, ₹ Cr |

---

## 4. Reusable Core Components

### 4.1 `ExplainThis` Component
A universal accessible tooltip/modal button displayed next to any financial term:
- **Interaction:** Triggered by click, tap, or keyboard focus (never hover-only).
- **Structure:**
  1. *What does it mean?* (Clear 1-sentence definition).
  2. *Why should you care?* (Relevance to personal investing).
  3. *How to interpret it?* (Benchmarks, normal ranges, green/red flags).
  4. *What does it NOT tell us?* (Crucial limitations & caveats).

### 4.2 `ModeToggle` Component
A clean, prominent segmented pill switch in the header:
`[ 📖 Simple View | 📊 Advanced View ]`
Persisted seamlessly in `localStorage (bmi_experience_mode)` across browser visits.

### 4.3 `OnboardingBanner` Component
A lightweight, dismissible 3-step introductory banner that greets first-time visitors with clear paths to:
1. Understand Today's Market
2. Analyse a Company (e.g. Reliance, TCS)
3. Discover Stocks by Financial Strength

---

## 5. Mobile Ergonomics

- **Minimum Touch Bounds:** All buttons, pills, and nav tabs meet or exceed the 44px × 44px touch target guideline.
- **Fixed Floating Bottom Navigation:** 5 key mobile destinations with icons + visible labels:
  `Home` | `Market` | `Stocks` | `Watchlist` | `More`
- **Zero Horizontal Overflow:** All tables support smooth native horizontal swipe with `-webkit-overflow-scrolling: touch`.
