---
design_intent: D
design_status: not-started
---

# 02: Priya's Race Against the Deadline

**Project:** bookswap
**Created:** 2026-07-12
**Method:** Whiteport Design Studio (WDS)

---

## Transaction (Q1)

**What this scenario covers:**
Search for one specific book title and get a fast, certain answer on whether a match exists.

---

## Business Goal (Q2)

**Goal:** Build a self-sustaining, liquid marketplace / Work smarter — minimize friction and overhead
**Objective:** 1.2 40%+ of listings result in a completed swap/sale within 30 days / 3.2 50%+ of matches originate from automated suggestions

---

## User & Situation (Q3)

**Persona:** Priya the Deadline Swapper (Priority 2)
**Situation:** Needs a specific textbook before the semester starts in 3 days. On a student budget, searching between classes.

---

## Driving Forces (Q4)

**Trigger:** Just realized she needs this exact textbook and the semester starts in 3 days.

**Hope:** Find this exact book available right now, cheap.

**Worry:** No one has it, and she's stuck paying full price at the last minute.

---

## Device & Starting Point (Q5 + Q6)

**Device:** Mobile
**Entry:** Googles the exact textbook title while on campus, clicks a bookswap search result, lands ready to search immediately.

---

## Best Outcome (Q7)

**User Success:**
Gets a definitive answer within seconds — no exact match right now, but confirms she'll be alerted the instant one appears, freeing her from manually re-checking.

**Business Success:**
Captures a high-intent lead via notify-me instead of losing her to buying new elsewhere; sets up the auto-match that feeds Objective 3.2.

---

## Shortest Path (Q8)

1. **Home/Landing** — Lands on bookswap, sees a prominent search bar front and center
2. **Search Results** — Searches the exact title, sees "no exact match right now" with an instant "Notify me" option
3. **Notifications** — Confirms the alert is active for that title ✓

---

## Trigger Map Connections

**Persona:** Priya the Deadline Swapper (Priority 2)

**Driving Forces Addressed:**
- ✅ **Want:** Fast yes/no on whether a match even exists (14/15, HIGH)
- ❌ **Fear:** Missing her deadline because no match materializes in time (12/15)

**Business Goal:** 1.2 40%+ match rate within 30 days / 3.2 50%+ auto-matched

---

## Scenario Steps

| Step | Folder | Purpose | Exit Action |
|------|--------|---------|-------------|
| 2.1 | `2.1-home-landing/` | Land and find the search entry point immediately | Enters search → proceeds to Search Results |
| 2.2 | `2.2-search-results/` | Search the exact title, see match status | No match found, taps "Notify me" → proceeds to Notifications |
| 2.3 | `2.3-notifications/` | Confirm the alert is active | Final — scenario success ✓ |

**First step** (2.1) includes full entry context (Q3 + Q4 + Q5 + Q6).
**On-step interactions** (that don't leave the step) are documented as storyboard items within each page spec.
