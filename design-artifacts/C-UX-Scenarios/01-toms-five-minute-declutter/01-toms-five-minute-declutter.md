---
design_intent: D
design_status: not-started
---

# 01: Tom's Five-Minute Declutter

**Project:** bookswap
**Created:** 2026-07-12
**Method:** Whiteport Design Studio (WDS)

---

## Transaction (Q1)

**What this scenario covers:**
List a pile of unwanted books for exchange or sale with almost no per-book effort.

---

## Business Goal (Q2)

**Goal:** Build a self-sustaining, liquid marketplace / Work smarter — minimize friction and overhead
**Objective:** 1.1 Reach 2,000 active listings within 6 months / 3.1 Median time-to-list under 2 minutes

---

## User & Situation (Q3)

**Persona:** Tom the Declutterer (Priority 3)
**Situation:** Just finished a Saturday closet clean-out. Has a box of ~8 books he's not reading again and wants them gone today. Low patience for anything that feels like "setting up one more app."

---

## Driving Forces (Q4)

**Trigger:** Just finished a Saturday closet clean-out — a box of ~8 books is sitting there, staring at him.

**Hope:** Get this box off his hands in minutes, without it becoming a project.

**Worry:** This turns into a chore he abandons halfway through, like other declutter apps he's tried.

---

## Device & Starting Point (Q5 + Q6)

**Device:** Mobile
**Entry:** Searches "sell my old books online" on his phone right after the clean-out, taps into bookswap from a search result.

---

## Best Outcome (Q7)

**User Success:**
Lists all 8 books in under 10 minutes total, box is empty, no more thinking required.

**Business Success:**
8 new listings added toward the 2,000-listing target (Goal 1.1), zero support tickets generated (Goal 3.3).

---

## Shortest Path (Q8)

1. **Sign Up/Login** — Quick account creation (or social login), no friction before he can start listing
2. **Batch Listing** — Scans ISBN per book (auto-fills title/author), snaps one photo, picks condition from a simple preset, repeats for all 8, bulk-submits
3. **My Listings/Dashboard** — Sees all 8 books live, box confirmed "handled" ✓

---

## Trigger Map Connections

**Persona:** Tom the Declutterer (Priority 3)

**Driving Forces Addressed:**
- ✅ **Want:** Get rid of books fast with almost no effort (14/15, HIGH)
- ❌ **Fear:** Listing effort outweighs payoff, causing abandonment mid-flow (15/15, HIGH — top force overall)

**Business Goal:** 1.1 Reach 2,000 active listings within 6 months / 3.1 Median time-to-list under 2 minutes

---

## Scenario Steps

| Step | Folder | Purpose | Exit Action |
|------|--------|---------|-------------|
| 1.1 | `1.1-sign-up-login/` | Create an account with zero friction | Completes sign-up → proceeds to Batch Listing |
| 1.2 | `1.2-batch-listing/` | List all 8 books in one sitting, minimal effort per book | Bulk-submits all books → proceeds to Dashboard |
| 1.3 | `1.3-my-listings-dashboard/` | Confirm all books are live, task is done | Final — scenario success ✓ |

**First step** (1.1) includes full entry context (Q3 + Q4 + Q5 + Q6).
**On-step interactions** (that don't leave the step) are documented as storyboard items within each page spec.
