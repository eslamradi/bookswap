# Prototype Roadmap: Scenario 01 — Tom's Five-Minute Declutter

**Project:** bookswap
**Created:** 2026-07-12
**Method:** Whiteport Design Studio (WDS) — Phase 5 Prototyping

---

## Scenario Overview

Tom the Declutterer lists a pile of unwanted books in one low-effort sitting. This is the top-priority scenario in the whole project — it answers the single highest-scored driving force in the Trigger Map (fear of listing effort outweighing payoff, 15/15).

**Spec source:** [01-toms-five-minute-declutter.md](../../C-UX-Scenarios/01-toms-five-minute-declutter/01-toms-five-minute-declutter.md)

---

## Setup

| Property | Value |
|----------|-------|
| **Device Compatibility** | Fully Responsive (375px–1920px+), multiple breakpoints (768px, 1024px, 1280px), hover on tablet & desktop |
| **Design Fidelity** | Generic Gray Model (wireframe) — `design_system_mode: none` in project config, no design system exists yet to build against |
| **Languages** | English only (single product language per config) |
| **Demo Data** | `data/demo-data.js` (`window.DEMO_DATA`, script-loaded — not fetched — to avoid `file://` CORS issues) — demo user Tom Reyes (unauthenticated at start), 8-book ISBN catalog simulating scan lookups |

---

## Pages in This Scenario

| # | Page | Spec | Status |
|---|------|------|--------|
| 1.1 | Sign Up/Login | [spec](../../C-UX-Scenarios/01-toms-five-minute-declutter/1.1-sign-up-login/1.1-sign-up-login.md) | Not started |
| 1.2 | Batch Listing | [spec](../../C-UX-Scenarios/01-toms-five-minute-declutter/1.2-batch-listing/1.2-batch-listing.md) | Not started |
| 1.3 | My Listings/Dashboard | [spec](../../C-UX-Scenarios/01-toms-five-minute-declutter/1.3-my-listings-dashboard/1.3-my-listings-dashboard.md) | Not started |

---

## Folder Structure

```
01-toms-five-minute-declutter-Prototype/
├── PROTOTYPE-ROADMAP.md
├── data/
│   └── demo-data.json
├── work/              (page work files, created just-in-time)
├── stories/           (section story files, created just-in-time)
├── shared/            (shared JS utilities)
├── components/        (reusable UI components)
├── pages/             (page-specific scripts, if needed)
└── assets/            (images, icons)

HTML files land in the root as they're built.
```

---

_Whiteport Design Studio (WDS) — Phase 5 Agentic Development, Prototyping activity_
