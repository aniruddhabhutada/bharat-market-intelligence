# Bharat Market Intelligence — Premium Fintech Design System

**Version:** 3.0 (Premium Fintech Redesign)  
**Target:** Indian Equity Research for Retail Investors & Financial Analysts  
**Core Product Philosophy:** Simple to understand. Powerful to explore.

---

## 1. Product Experience Architecture

The platform delivers a single coherent application with two progressive disclosure tiers:

### 1.1 Simple View (Default for First-Time Visitors)
- Plain, everyday English without intimidating jargon.
- Universal 4-part explanations alongside all metrics.
- Prioritized high-impact market information.
- Simplified line charts with intuitive ranges.
- Structured, question-driven stock discovery presets.
- Clear guidance toward the next useful analytical action.

### 1.2 Advanced View (Persistent Toggle)
- Professional candlestick charts with SMA20 and volume profiles.
- Quantitative multi-factor scoring (Quality, Growth, Momentum, Value).
- Microstructure analysis and institutional cash flow ledger.
- Full fundamental valuation ratios, balance sheet metrics, and peer comparisons.
- Advanced invalidation boundaries and technical breakout conditions.

### 1.3 Persistent Experience Mode Toggle
- Persistent segmented pill in global header: `[ Simple View | Advanced View ]`
- Persisted in browser `localStorage (bmi_experience_mode)` across all pages and subsequent sessions.
- Modifies information hierarchy across every view without duplicating backend business logic.

---

## 2. Visual Identity & Design Tokens

Default Theme: **Clean Light Theme**  
Optional Theme: **Balanced Contrast Dark Theme**

### 2.1 Color Tokens Specification

| Token Name | Light Theme (Default) | Dark Theme | Purpose / Usage |
| :--- | :--- | :--- | :--- |
| **Page Background** | `#F5F7FB` | `#0B111E` | Primary page canvas |
| **Card Background** | `#FFFFFF` | `#131C2E` | Container cards, panels, dossiers |
| **Primary Navy** | `#172B4D` | `#F4F6FB` | Primary headings, titles, core text |
| **Brand Blue** | `#315EFB` | `#4D74FB` | Primary interactive buttons, badges, brand emblems |
| **Subtle Blue** | `#EEF3FC` | `#1A2844` | Active nav backgrounds, pill badges, selected states |
| **Positive Movement** | `#14866D` | `#22C55E` | Price appreciation, profit growth, bullish indicators |
| **Negative Movement** | `#D94B50` | `#F43F5E` | Price declines, losses, risk alerts |
| **Secondary Text** | `#667085` | `#97A3B6` | Supporting text, body explanations, subtitles |
| **Border / Hairline** | `#E5EAF2` | `#1F2E47` | Card outlines, dividers, table row borders |
| **Muted Text** | `#8993A4` | `#6C7A8E` | Timestamps, data status indicators, fine print |

### 2.2 Visual Restraint Principles
- **No Neon Colors:** Replaced high-saturation neon greens/pinks with calm institutional emerald `#14866D` and rose `#D94B50`.
- **No Excessive Gradients or Glows:** Eliminated multi-colored radial glows and blur overlays in favor of crisp 1px borders.
- **No Heavy Dark Terminals by Default:** Pristine `#F5F7FB` canvas creates a welcoming fintech experience similar to Stripe and Linear.
- **Controlled Radii:** Cards use consistent `rounded-2xl` (16px), controls use `rounded-xl` (12px), badges use `rounded-full`.

---

## 3. Typography & Numerals

Font Family: **Inter** (`font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`)

### 3.1 Typographic Scale

| Level | Size | Weight | Tracking | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Main Page Heading** | 28px – 32px | 800 (Extra Bold) | `-0.025em` | Hero titles, primary view titles |
| **Section Heading** | 20px – 22px | 700 (Bold) | `-0.02em` | Section headers (A through G) |
| **Card Heading** | 16px – 18px | 700 (Bold) | `-0.01em` | Stock symbols, index titles, card topics |
| **Body Text** | 15px – 16px | 400 (Regular) | `normal` | Plain-English explanations & summaries |
| **Supporting Text** | 13px – 14px | 400 (Regular) | `normal` | Secondary descriptions, thesis notes, risks |
| **Caption & Meta** | 11px – 12px | 500 (Medium) | `+0.01em` | Status badges, timestamps, exchange labels |

### 3.2 Tabular Numerals
All stock prices, P/E multiples, percentages, and financial values enforce:
```css
font-variant-numeric: tabular-nums;
font-feature-settings: "tnum";
```
This guarantees alignment across rows and prevents layout shifts during live quote refreshes.

---

## 4. Professional Icon System

**Zero Unicode Emojis:** All decorative emojis have been systematically removed across the entire application (sidebar, navigation, buttons, cards, headings, empty states, and observations).

**Lucide React Consistency:**
- `Home`: `House`
- `Market Today`: `ChartNoAxesCombined`
- `Explore Stocks`: `Search`
- `Watchlist`: `Bookmark`
- `Learn`: `GraduationCap`
- `Stock Analysis`: `BarChart3`
- `Stock Screener`: `SlidersHorizontal`
- `Technical Analysis`: `ChartLine`
- `Fundamental Analysis`: `Scale`
- `Sector Analysis`: `PieChart`
- `FII/DII Analysis`: `TrendingUp`
- `Market Reports`: `FileText`
- `Portfolio`: `Wallet`
- `Settings`: `Settings`
- `Help`: `CircleHelp`
- `Refresh`: `RefreshCw`
- `Attribution Heart`: `Heart` (`fill-current text-red-500`)

Consistent stroke width (1.75px) and sizing (14px–20px) maintained across all views.

---

## 5. Reusable Component Specifications

1. **`ExplainThis`**: Accessible modal & inline popup providing standardized 4-part explanations:
   - What does it mean?
   - Why should you care?
   - How to interpret it?
   - What it does NOT tell us?
2. **`ModeToggle`**: Segmented pill component for 1-click toggling between Simple View and Advanced View.
3. **`Sidebar`**: Grouped 3-tier desktop navigation (`MAIN`, `RESEARCH`, `PERSONAL`) with clean subtle borders and restrained blue active states.
4. **`MobileNav`**: 5-item mobile bottom navigation bar (`Home`, `Market`, `Explore`, `Watchlist`, `More`) with accessible 48px touch targets and full slide-up drawer for secondary modules.
5. **`Header`**: Clean sticky header containing current page title, universal search bar, live market status, data verification badge, experience mode toggle, and static market benchmark strip.

---

## 6. Mobile & Accessibility Standards

- **Target Viewports:** Browser-tested at 390px, 430px, 768px, 1024px, 1366px, and 1440px.
- **No Horizontal Scroll:** `overflow-x: hidden` enforced on page wrapper with native momentum swipe on wide data tables.
- **Touch Bounds:** All touch controls meet or exceed 44px × 44px.
- **WCAG 2.2 AA Contrast:** All text-to-background contrast ratios exceed 4.5:1 for normal text and 3:1 for large text.
