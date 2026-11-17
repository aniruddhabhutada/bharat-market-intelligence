# UX Audit — Bharat Market Intelligence

**Date:** November 2026  
**Auditor:** Foundation Agent  
**App:** [bharat-market-intelligence.netlify.app](https://bharat-market-intelligence.netlify.app/)  
**Stack:** Next.js 14 App Router · TypeScript · Tailwind CSS · Recharts

---

## Executive Summary

Bharat Market Intelligence is a feature-rich Indian equity research terminal that currently targets experienced traders and analysts. While technically impressive, the product creates significant barriers for the large and growing population of first-time retail investors in India. This audit identifies usability, accessibility, and learnability gaps, and recommends targeted improvements across navigation, typography, onboarding, terminology, and visual design.

**Overall Severity: HIGH** — The current design risks high bounce rates from new users and excludes the largest addressable market segment.

---

## 1. Navigation & Information Architecture

### 1.1 Navigation Overload

| Severity | CRITICAL |
|----------|----------|
| **Finding** | 13 navigation items are presented at equal visual weight in the sidebar: Pre-Market, Live Market, Indices, FII/DII Flows, Sector Analysis, Stock Screener, Stock Research, News & Events, Watchlist, Portfolio Tracker, Reports Archive, Settings. |
| **Impact** | Decision paralysis for new users. Research shows cognitive load rises sharply above 7±2 items. A new user has no mental model for distinguishing "Pre-Market" from "Live Market" or "Indices" from "Sector Analysis". |
| **Recommended Fix** | Group into 3–4 primary categories with expandable sub-items: **Market** (Pre-Market, Live, Indices), **Research** (Sectors, Screener, Stock Research), **Portfolio** (Watchlist, Portfolio), **More** (News, Reports, Settings). Progressive disclosure shows sub-items only when needed. |

### 1.2 Mobile Navigation Incompleteness

| Severity | HIGH |
|----------|------|
| **Finding** | Mobile bottom nav shows only 5 icons with no visible text labels. Users must guess meanings from icons alone. |
| **Impact** | Icon-only navigation fails accessibility standards (WCAG 2.1 SC 1.1.1) and forces trial-and-error exploration. |
| **Recommended Fix** | Display short text labels (≤8 chars) beneath each icon. If space is tight, use a "More" overflow that opens the full sidebar drawer. |

### 1.3 No Active State Hierarchy

| Severity | MEDIUM |
|----------|--------|
| **Finding** | Active nav item uses only a slight background tint — insufficient contrast especially in dark mode. |
| **Recommended Fix** | Use a prominent left accent bar + filled background for the active item. Consider a blue pill/chip style consistent with the accent colour. |

---

## 2. Onboarding & First-Time User Experience

### 2.1 No Hero / Explanation Section

| Severity | CRITICAL |
|----------|----------|
| **Finding** | First-time visitors land directly on the Dashboard view with no explanation of what the app does, who it is for, or how to use it. |
| **Impact** | Users who are unfamiliar with Indian markets or trading terminals will immediately bounce. The app provides no orientation. |
| **Recommended Fix** | Add an `OnboardingBanner` component that appears on first visit (tracked via `localStorage`). It should state the platform's value proposition, provide 3 clear entry points (Understand Market, Research a Stock, Discover Stocks), and offer a guided tour option. |

### 2.2 No Progressive Disclosure / Beginner Mode

| Severity | CRITICAL |
|----------|----------|
| **Finding** | All technical indicators, institutional flows, and jargon are always visible at full complexity. There is no mechanism for a beginner to access a simplified view. |
| **Recommended Fix** | Implement `ExperienceModeContext` with "Simple View" and "Advanced View" modes. Beginners see: market summary in plain English, top 5 movers, essential news. Advanced users see: full indicator dashboard, FII/DII flows, market microstructure, etc. |

### 2.3 No Tour / Guided Walkthrough

| Severity | MEDIUM |
|----------|--------|
| **Finding** | No in-app tooltips or step-by-step tour guide exists. |
| **Recommended Fix** | Implement a lightweight 5-step tour (can be built without external libraries): highlight the view toggle, explain the main sections, demonstrate a stock search, show how to read the dashboard. Store completion state in `localStorage`. |

---

## 3. Terminology & Plain Language

### 3.1 Jargon-Heavy Dashboard Headers

| Severity | HIGH |
|----------|------|
| **Finding** | Dashboard section headers include "Institutional Regime", "Market Microstructure", "Breadth Dynamics", "Delivery Volume Analysis" with no explanations. |
| **Impact** | Retail investors without finance backgrounds are excluded. Indian retail participation is growing rapidly (Demat accounts grew from 36M in 2019 to 150M+ in 2024). These users cannot engage with unexplained jargon. |
| **Recommended Fix** | Add a reusable `ExplainThis` component with inline "?" buttons next to every technical term. The component shows a plain-language definition panel on click. |

### 3.2 No Plain Language Summaries

| Severity | HIGH |
|----------|------|
| **Finding** | There are no "What this means" summary cards. The dashboard shows raw numbers (RSI: 62, MACD: +0.4, ADX: 28) without any contextual interpretation. |
| **Recommended Fix** | In Simple View mode, add an interpretive sentence below each indicator: e.g., "RSI is at 62 — the market has moderate upward momentum, not yet overbought." |

### 3.3 Chart Labels Unexplained

| Severity | HIGH |
|----------|------|
| **Finding** | Charts use technical Y-axis labels and legend abbreviations without explanation. A chart labelled "VWAP" or "ATR" gives no guidance to beginners. |
| **Recommended Fix** | Add descriptive chart titles, e.g., "NIFTY 50 — Today's Price Movement (intraday)". Include a one-line sub-heading explaining what to look for. |

---

## 4. Typography & Visual Hierarchy

### 4.1 Text Too Small

| Severity | HIGH |
|----------|------|
| **Finding** | Many data labels use 10px and 11px font sizes (e.g., ticker tape, table cells, legend items). The base body font is not explicitly set to 16px. |
| **Impact** | Fails WCAG 2.1 SC 1.4.4 (Resize Text). Problematic for older users and those on smaller screens. Causes eye strain during extended sessions. |
| **Recommended Fix** | Set `body { font-size: 16px; line-height: 1.6; }` as the base. Minimum text size for any visible content: 12px. Data labels: 13px minimum. |

### 4.2 Low Contrast in Secondary Text

| Severity | HIGH |
|----------|------|
| **Finding** | Muted text (`text-gray-500` on dark background) measures approximately 3.8:1 contrast ratio — below WCAG AA threshold (4.5:1) for normal text. |
| **Recommended Fix** | Use `text-gray-400` minimum for body text in dark mode, `text-gray-600` minimum in light mode. |

### 4.3 Insufficient Visual Hierarchy

| Severity | MEDIUM |
|----------|--------|
| **Finding** | Section headings, card titles, and body text lack a clear typographic scale. Many elements compete for attention at similar visual weights. |
| **Recommended Fix** | Establish a 6-step type scale: Display (32px), H1 (24px), H2 (20px), H3 (16px bold), Body (16px), Caption (13px). Apply consistently across all views. |

---

## 5. Aesthetic & Emotional Design

### 5.1 Dark Terminal Aesthetic Not Welcoming

| Severity | MEDIUM |
|----------|--------|
| **Finding** | The app defaults to a dark, glass-card terminal aesthetic that communicates "expert tool". While appropriate for advanced traders, it actively discourages casual or curious users. |
| **Impact** | For the fastest-growing user segment (first-time retail investors), the visual language signals "this is not for me". |
| **Recommended Fix** | Light mode should be the **default** experience. Advanced/dark mode should be opt-in. Introduce warmer tones, clearer cards with rounded corners, and illustrated empty states. |

### 5.2 No Empty States or Illustrations

| Severity | MEDIUM |
|----------|--------|
| **Finding** | Empty states (no watchlist items, no portfolio holdings) show blank areas with no guidance. |
| **Recommended Fix** | Add illustrated empty states with a clear call-to-action: "Your watchlist is empty — search for a stock to add it here." |

### 5.3 No Success / Feedback Micro-interactions

| Severity | LOW |
|----------|-----|
| **Finding** | Actions like adding to watchlist, refreshing data, or switching views have no visual confirmation. |
| **Recommended Fix** | Add subtle toast notifications and button loading states. |

---

## 6. Accessibility

### 6.1 Focus Styles Missing

| Severity | HIGH |
|----------|------|
| **Finding** | Interactive elements (buttons, links, nav items) lack visible focus rings. Keyboard navigation is unusable. |
| **Impact** | Fails WCAG 2.1 SC 2.4.7. Excludes keyboard-only users and screen reader users. |
| **Recommended Fix** | Add `*:focus-visible { outline: 2px solid #2563eb; outline-offset: 2px; border-radius: 4px; }` globally. |

### 6.2 Missing ARIA Labels

| Severity | MEDIUM |
|----------|--------|
| **Finding** | Icon-only buttons and navigation items lack `aria-label` attributes. |
| **Recommended Fix** | Add descriptive `aria-label` to all interactive elements that lack visible text. |

### 6.3 Language Attribute

| Severity | LOW |
|----------|-----|
| **Finding** | `<html lang="en">` is set correctly, but `suppressHydrationWarning` is missing, causing React hydration warnings. |
| **Recommended Fix** | Add `suppressHydrationWarning` to `<html>`. |

---

## 7. Mobile Experience

### 7.1 Overflow Hidden on Body

| Severity | MEDIUM |
|----------|--------|
| **Finding** | `overflow-hidden` on `body` can trap scroll contexts and cause issues on some mobile browsers. |
| **Recommended Fix** | Use `overflow-hidden` only on the app container div, not the body. |

### 7.2 Touch Targets Too Small

| Severity | MEDIUM |
|----------|--------|
| **Finding** | Several interactive elements (filter chips, icon buttons) are smaller than the recommended 44×44px touch target. |
| **Recommended Fix** | Ensure minimum `min-h-[44px] min-w-[44px]` for all tappable elements. |

---

## 8. Performance Perception

### 8.1 No Loading Skeletons

| Severity | MEDIUM |
|----------|--------|
| **Finding** | Data-loading states show empty/blank areas with no skeleton placeholders. |
| **Recommended Fix** | Use CSS skeleton animations (`.skeleton` class) for card, table row, and chart placeholder states. |

---

## Priority Matrix

| Priority | Issue | Effort | Impact |
|----------|-------|--------|--------|
| P0 | Add onboarding banner for first-time visitors | Low | Very High |
| P0 | Implement beginner/advanced mode toggle | Medium | Very High |
| P0 | Add ExplainThis glossary to all jargon terms | Medium | Very High |
| P1 | Light mode as default | Low | High |
| P1 | Fix typography scale (16px base, min 12px) | Low | High |
| P1 | Focus styles for keyboard accessibility | Low | High |
| P1 | Nav grouping (reduce to 4 primary items) | Medium | High |
| P2 | Mobile nav text labels | Low | Medium |
| P2 | Add skeleton loading states | Low | Medium |
| P2 | Plain-language chart titles | Low | Medium |
| P3 | Empty state illustrations | Medium | Medium |
| P3 | Micro-interactions & toast notifications | Medium | Low |

---

## Recommended Implementation Sequence

```
Phase 1 (Foundation — this sprint):
  ✅ ExperienceModeContext (beginner/advanced toggle)
  ✅ ExplainThis component (glossary modal)
  ✅ ModeToggle component (Simple View / Advanced View)
  ✅ globals.css: 16px base, focus rings, skeleton animations
  ✅ OnboardingBanner in page.tsx
  ✅ Light mode as default theme

Phase 2 (Views):
  → Apply ExplainThis to Dashboard jargon terms
  → Simplify nav to 4 primary groups
  → Add plain-language summaries in beginner mode
  → Mobile nav labels

Phase 3 (Polish):
  → Illustrated empty states
  → Toast notification system
  → Guided tour implementation
  → Full ARIA audit
```

---

## References

- WCAG 2.1 Guidelines: https://www.w3.org/TR/WCAG21/
- Nielsen's 10 Usability Heuristics
- Baymard Institute — Navigation UX Research
- SEBI Investor Survey 2023 — Indian Retail Investor Behaviour
