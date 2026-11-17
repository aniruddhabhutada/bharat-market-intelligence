# Redesign Changelog (REDESIGN_CHANGELOG.md)

**Project:** Bharat Market Intelligence  
**Release:** UX Transformation Edition (v2.0)  
**Date:** November 2026  

---

## 🚀 Key Highlights

1. **Progressive Disclosure Architecture:**
   - Introduced `ExperienceModeContext` with **Simple View** (default for beginners) and **Advanced View** (for institutional analysts).
   - Added persistent 1-click toggle `ModeToggle` in the top header.
2. **First-Time Visitor Onboarding:**
   - Added `OnboardingBanner` in `page.tsx` greeting first-time users with a 3-step guide: *Understand Market*, *Analyse a Company*, and *Discover Stocks*. Includes optional skip and dismiss.
3. **Interactive Terminology Dictionary:**
   - Built reusable `ExplainThis` modal component with 4-part explanations: *What does it mean?*, *Why should you care?*, *How to interpret it?*, and *What does it NOT tell us?*.
   - Added inline `?` buttons across benchmarks, indicators, and financial ratios.
4. **Simplified 5-Item Navigation:**
   - **Sidebar:** Condensed 13 competing items into 5 primary items (*Home*, *Market Today*, *Explore Stocks*, *My Watchlist*, *Learn*). Housed advanced modules under an expandable *Research Tools* dropdown.
   - **MobileNav:** Added 5-item mobile bottom navigation bar with icons and text labels plus a slide-up *More Tools* bottom drawer.
5. **Brand-New Knowledge Base (`LearnView.tsx`):**
   - Created a dedicated educational hub explaining NIFTY, SENSEX, P/E, ROCE, RSI, FII/DII, Market Cap, Support/Resistance with real-world analogies.
6. **Revamped Dashboard (`DashboardView.tsx`):**
   - Added welcoming Hero section with global search.
   - Plain-English index cards with daily interpretation.
   - "Market in Simple Words" 3-question briefing.
   - 6 familiar sector cards with clear % changes.
   - "Stocks Worth Researching" with transparent research thesis and primary risks.
7. **Plain-English Stock Dossier (`StockResearchView.tsx`):**
   - "What Does This Company Do?" business model breakdown.
   - 6 plain-English financial health cards (P/E, ROCE, Debt/Equity, Free Cash Flow, ROE, Market Cap).
   - Plain-language RSI momentum explanation.
   - Dedicated 4-point risk assessment and research summary.
8. **Question-Based Screener (`ScreenerView.tsx`):**
   - Beginner mode offers 6 preset question cards (*Find financially strong companies*, *Find fast-growing companies*, *Find undervalued companies*, etc.).
   - Retains full quantitative filters and sorting in Advanced Mode.
9. **Visual Design & Default Light Theme:**
   - Switched `:root` and `body` to clean, crisp Light Mode as the default aesthetic.
   - Preserved full Dark Mode with 1-click toggle in the header.
   - Enhanced touch targets to 44px+ and added skeleton loading animations.
10. **100% Data Integrity Preserved:**
    - Zero mocked financial data. All calculations, P/E ratios, historical charts, and SEC/NSE order flow metrics remain connected to real engines.

---

## 📁 Modified & Created Files

- `docs/UX_AUDIT.md` (Created)
- `docs/DESIGN_SYSTEM.md` (Created)
- `docs/UX_TEST_REPORT.md` (Created)
- `docs/REDESIGN_CHANGELOG.md` (Created)
- `frontend/src/context/ExperienceModeContext.tsx` (Created)
- `frontend/src/context/ThemeContext.tsx` (Updated: default light mode)
- `frontend/src/components/ui/ExplainThis.tsx` (Created)
- `frontend/src/components/ui/ModeToggle.tsx` (Created)
- `frontend/src/components/views/LearnView.tsx` (Created)
- `frontend/src/app/globals.css` (Updated: light theme defaults, skeleton animation, focus styles)
- `frontend/src/app/layout.tsx` (Updated: wrapped with ExperienceModeProvider)
- `frontend/src/app/page.tsx` (Updated: Onboarding banner, LearnView routing, responsive background)
- `frontend/src/components/layout/Sidebar.tsx` (Updated: 5 primary items + expandable research tools)
- `frontend/src/components/layout/MobileNav.tsx` (Updated: labeled tabs + slide-up More drawer)
- `frontend/src/components/layout/Header.tsx` (Updated: ModeToggle integration)
- `frontend/src/components/views/DashboardView.tsx` (Updated: Beginner & Advanced modes)
- `frontend/src/components/views/StockResearchView.tsx` (Updated: Plain-English explanations & risks)
- `frontend/src/components/views/ScreenerView.tsx` (Updated: Question-based beginner screener)
- `frontend/src/components/views/IndicesView.tsx` (Updated: Educational index summaries)
- `frontend/src/components/views/SectorView.tsx` (Updated: Friendly sector health cards)
- `frontend/src/components/views/FiiDiiView.tsx` (Updated: FII/DII institutional explanations)
- `frontend/src/components/views/NewsView.tsx` (Updated: Clean responsive cards)
- `frontend/src/components/views/WatchlistView.tsx` (Updated: Clean basket layout)
- `frontend/src/components/views/PortfolioView.tsx` (Updated: Holdings & live valuation cards)
