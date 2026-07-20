# Design Log

**Project:** bookswap
**Started:** 2026-07-08
**Method:** Whiteport Design Studio (WDS)

---

## Backlog

> Business-value items. Add links to detail files if needed.

- [x] Complete product brief — Phase 1 (simplified)
- [x] Define trigger map — Phase 2
- [x] Create user scenarios — Phase 3

---

## Current

| Task | Started | Agent |
|------|---------|-------|
| — | — | — |

**Rules:** Mark what you start. Complete it when done (move to Log). One task at a time per agent.

---

## Design Loop Status

> Per-page design progress. Updated by agents at every design transition.

| Scenario | Step | Page | Status | Updated |
|----------|------|------|--------|---------|
| 01-toms-five-minute-declutter | 1.1 | Sign Up/Login | specified | 2026-07-12 |
| 01-toms-five-minute-declutter | 1.1 | Sign Up/Login | built | 2026-07-13 |
| 01-toms-five-minute-declutter | 1.2 | Batch Listing | built | 2026-07-13 |
| 01-toms-five-minute-declutter | 1.3 | My Listings/Dashboard | built | 2026-07-13 |
| 02-priyas-race-against-the-deadline | 2.1 | Home/Landing | built | 2026-07-13 |
| 02-priyas-race-against-the-deadline | 2.2 | Search Results | built | 2026-07-13 |
| 02-priyas-race-against-the-deadline | 2.3 | Notifications | built | 2026-07-13 |
| 03-mayas-treasure-hunt | 3.1 | Browse Listings | built | 2026-07-13 |
| 03-mayas-treasure-hunt | 3.2 | Book Listing Detail | built | 2026-07-13 |
| 03-mayas-treasure-hunt | 3.3 | User Profile/Reputation | built | 2026-07-13 |
| 03-mayas-treasure-hunt | 3.4 | Create Listing (single) | built | 2026-07-13 |
| 04-completing-the-trade | 4.1 | Trade/Offer Flow | built | 2026-07-13 |
| 04-completing-the-trade | 4.2 | Messaging | built | 2026-07-13 |
| 04-completing-the-trade | 4.3 | Checkout | built | 2026-07-13 |
| 04-completing-the-trade | 4.4 | Shipping/Handoff Coordination | built | 2026-07-13 |
| 04-completing-the-trade | 4.5 | Trade Confirmation & Tracking | built | 2026-07-13 |
| 04-completing-the-trade | 4.6 | Post-Trade Rating | built | 2026-07-13 |
| 05-toms-privacy-settings | 5.1 | Account Settings | built | 2026-07-13 |
| 01-toms-five-minute-declutter | 1.2 | Batch Listing | specified | 2026-07-12 |
| 01-toms-five-minute-declutter | 1.3 | My Listings/Dashboard | specified | 2026-07-12 |
| 02-priyas-race-against-the-deadline | 2.1 | Home/Landing | specified | 2026-07-12 |
| 02-priyas-race-against-the-deadline | 2.2 | Search Results | specified | 2026-07-12 |
| 02-priyas-race-against-the-deadline | 2.3 | Notifications | specified | 2026-07-12 |
| 03-mayas-treasure-hunt | 3.1 | Browse Listings | specified | 2026-07-12 |
| 03-mayas-treasure-hunt | 3.2 | Book Listing Detail | specified | 2026-07-12 |
| 03-mayas-treasure-hunt | 3.3 | User Profile/Reputation | specified | 2026-07-12 |
| 03-mayas-treasure-hunt | 3.4 | Create Listing (single) | specified | 2026-07-12 |
| 04-completing-the-trade | 4.1 | Trade/Offer Flow | specified | 2026-07-12 |
| 04-completing-the-trade | 4.2 | Messaging | specified | 2026-07-12 |
| 04-completing-the-trade | 4.3 | Checkout | specified | 2026-07-12 |
| 04-completing-the-trade | 4.4 | Shipping/Handoff Coordination | specified | 2026-07-12 |
| 04-completing-the-trade | 4.5 | Trade Confirmation & Tracking | specified | 2026-07-12 |
| 04-completing-the-trade | 4.6 | Post-Trade Rating | specified | 2026-07-12 |
| 05-toms-privacy-settings | 5.1 | Account Settings | specified | 2026-07-12 |

**Status values:** `discussed` → `wireframed` → `specified` → `explored` → `building` → `built` → `approved` | `removed`

**How to use:**
- **Append a row** when a page reaches a new status (do not overwrite — latest row per page is current status)
- **Read on startup** to see where the project stands and what to suggest next

---

## Log

### 2026-07-08 — Project Brief completed (Phase 1, simplified)
- Brief type: Simplified
- Scope: Web platform (mobile later) for listing used books to exchange (specific/any book) or sell
- Challenge: Unused books have no easy way to trade
- Design goals: Low-friction listing, quick matching
- Constraints: None yet — flexible

### 2026-07-12 — Trigger Map completed (Phase 2, Suggest mode)
- 3 business goals (Liquid Marketplace ⭐ / Earn Trust / Work Smarter), each with 3 SMART objectives
- 3 personas: Maya the Bookworm (P1), Priya the Deadline Swapper (P2), Tom the Declutterer (P3)
- 18 driving forces scored (Frequency × Intensity × Fit): 3 HIGH, 10 MEDIUM, 5 LOW
- Key insight: Tom's listing-abandonment fear (15/15) and Priya's fast-match want (14/15) are the top-priority build targets — not Maya's, despite her being the priority-1 persona. A cross-cutting trust theme (condition, ghosting, address-privacy) clusters at MEDIUM across all personas.
- Output: `B-Trigger-Map/trigger-map.md`, `B-Trigger-Map/personas/*.md`, `B-Trigger-Map/feature-impact-analysis.md`
- Session detail: `_progress/agent-experiences/2026-07-12-trigger-map-suggest.md`

### 2026-07-12 — UX Scenarios completed (Phase 3, Suggest mode)

**Agent:** Saga (Scenario Outline)
**Scenarios:** 5 scenarios covering 17/17 pages (100% coverage)
**Quality:** Excellent (all 5 pass minimum thresholds; 3 scored full Excellent, 2 scored Good with disclosed, intentional tradeoffs)

**Artifacts Created:**
- `C-UX-Scenarios/00-ux-scenarios.md` — Scenario index with coverage matrix
- `C-UX-Scenarios/01-toms-five-minute-declutter/01-toms-five-minute-declutter.md` — Tom's Five-Minute Declutter
- `C-UX-Scenarios/01-toms-five-minute-declutter/1.1-sign-up-login/1.1-sign-up-login.md`
- `C-UX-Scenarios/01-toms-five-minute-declutter/1.2-batch-listing/1.2-batch-listing.md`
- `C-UX-Scenarios/01-toms-five-minute-declutter/1.3-my-listings-dashboard/1.3-my-listings-dashboard.md`
- `C-UX-Scenarios/02-priyas-race-against-the-deadline/02-priyas-race-against-the-deadline.md` — Priya's Race Against the Deadline
- `C-UX-Scenarios/02-priyas-race-against-the-deadline/2.1-home-landing/2.1-home-landing.md`
- `C-UX-Scenarios/02-priyas-race-against-the-deadline/2.2-search-results/2.2-search-results.md`
- `C-UX-Scenarios/02-priyas-race-against-the-deadline/2.3-notifications/2.3-notifications.md`
- `C-UX-Scenarios/03-mayas-treasure-hunt/03-mayas-treasure-hunt.md` — Maya's Treasure Hunt
- `C-UX-Scenarios/03-mayas-treasure-hunt/3.1-browse-listings/3.1-browse-listings.md`
- `C-UX-Scenarios/03-mayas-treasure-hunt/3.2-book-listing-detail/3.2-book-listing-detail.md`
- `C-UX-Scenarios/03-mayas-treasure-hunt/3.3-user-profile-reputation/3.3-user-profile-reputation.md`
- `C-UX-Scenarios/03-mayas-treasure-hunt/3.4-create-listing-single/3.4-create-listing-single.md`
- `C-UX-Scenarios/04-completing-the-trade/04-completing-the-trade.md` — Tom's Safe Handoff
- `C-UX-Scenarios/04-completing-the-trade/4.1-trade-offer-flow/4.1-trade-offer-flow.md`
- `C-UX-Scenarios/04-completing-the-trade/4.2-messaging/4.2-messaging.md`
- `C-UX-Scenarios/04-completing-the-trade/4.3-checkout/4.3-checkout.md`
- `C-UX-Scenarios/04-completing-the-trade/4.4-shipping-handoff-coordination/4.4-shipping-handoff-coordination.md`
- `C-UX-Scenarios/04-completing-the-trade/4.5-trade-confirmation-tracking/4.5-trade-confirmation-tracking.md`
- `C-UX-Scenarios/04-completing-the-trade/4.6-post-trade-rating/4.6-post-trade-rating.md`
- `C-UX-Scenarios/05-toms-privacy-settings/05-toms-privacy-settings.md` — Tom Locks Down His Privacy
- `C-UX-Scenarios/05-toms-privacy-settings/5.1-account-settings/5.1-account-settings.md`

**Summary:** Classified bookswap as a Dynamic App (17 pages, Small scale) and built 5 scenarios in priority order: two Priority 1 scenarios (Tom's batch listing, Priya's instant search/notify) deliberately lead with the two highest-scored driving forces from the Trigger Map rather than the primary persona, since they gate Goal 1 (liquidity) — a decision explicitly surfaced and approved at the scenario-plan checkpoint. Maya's browsing/trust scenario is Priority 1 as the primary-persona retention loop. A shared "Tom's Safe Handoff" scenario (Priority 2) covers the cross-cutting trust/shipping/rating flow used after any match. Account privacy settings (Priority 3) closes out full page coverage.

**Next:** Phase 4 — UX Design

### 2026-07-12 — Phase 4 UX Design: all 5 scenarios Dream-designed

**Agent:** Freya (Dream mode, autonomous)
**Pages specified:** 17/17 (100%)
**Design system mode:** none (per config) — specs use descriptive layout/sections rather than a shared component/token system; typography, spacing tokens, and Object-ID-level component specs deferred to a future [P] Specify + [M] Design System pass if/when one is introduced

**Summary:** Every page from all 5 Phase 3 scenarios now has a page specification (purpose, entry/exit points, layout structure, page sections, states, technical notes, open questions). Key cross-cutting decisions: address-masking defaults to ON platform-wide (Account Settings 5.1 pre-configures what Shipping/Handoff Coordination 4.4 later executes); Book Listing Detail (3.2) is documented once as a shared template page reused across Maya's and Priya's flows; Batch Listing (1.2) and Create Listing (3.4) share the same scan→auto-fill→condition→photo component pattern at different cadences (queue vs. single-item). Several open questions were surfaced per page (payment/commission model, carrier integration for masked shipping, cold-start trust for new users) — none block further design work but should be resolved before implementation.

**Next:** User review of all 17 specs; optional deeper [P] Specify / [M] Design System pass; or proceed to Phase 5 (Agentic Development) once specs are approved.

### 2026-07-13 — Phase 5 Agentic Development: all 5 scenarios prototyped

**Agent:** Implementation Partner (Prototyping activity, built autonomously per user instruction after Scenario 01)
**Pages built:** 17/17 (100%) — 5 separate prototype folders under `E-Development/`, one per scenario, each with its own demo data and localStorage-backed mock API
**Bugs found and fixed during build:** 2, both documented as reusable lessons in `_progress/agent-experiences/`:
1. `fetch()` of local JSON blocked by `file://` CORS — fixed by switching all scenarios' demo data to script-loaded `window.DEMO_DATA` globals instead of fetched JSON
2. Stale localStorage state missing newly-added fields after mid-session schema changes — fixed by normalizing state against the seed shape on every read, not just first creation

**Summary:** Scenario 01 (Tom's Five-Minute Declutter, 3 pages) was built interactively with full per-section approval gates and live self-verification; the user then asked to build all remaining pages/sections without approval gates. Scenarios 02–05 (11 pages) were built autonomously with static self-verification (object IDs, tag balance, JS syntax, asset resolvability) after each scenario, since no live browser/Puppeteer is available in this environment. Known prototype limitations, disclosed per scenario: no real camera/barcode scanning (simulated via manual ISBN entry against small demo catalogs), no real payment processor, no real carrier tracking webhooks (Scenario 04 includes a manual "simulate carrier update" button, clearly marked as prototype-only).

**Next:** User click-through testing of all 5 prototypes; then likely Phase 5 [D] Development (real codebase) once prototypes are validated, or [T] Acceptance Testing against the specs.

---

## About This Folder

- **This file** — Single source of truth for project progress
- **agent-experiences/** — Compressed insights from design discussions (dated files)
- **wds-project-outline.yaml** — Project configuration from Phase 0 setup

**Do not modify `wds-project-outline.yaml`** — it is the source of truth for project configuration.
