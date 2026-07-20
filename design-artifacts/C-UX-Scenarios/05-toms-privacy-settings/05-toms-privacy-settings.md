---
design_intent: D
design_status: not-started
---

# 05: Tom Locks Down His Privacy

**Project:** bookswap
**Created:** 2026-07-12
**Method:** Whiteport Design Studio (WDS)

---

## Transaction (Q1)

**What this scenario covers:**
Proactively configure privacy/address-masking preferences before ever completing a trade.

---

## Business Goal (Q2)

**Goal:** Work smarter — minimize friction and overhead
**Objective:** 3.3 Fewer than 10% of transactions require manual support intervention

---

## User & Situation (Q3)

**Persona:** Tom the Declutterer (Priority 3)
**Situation:** Just signed up, before listing anything. Wants to make sure his personal info won't be exposed later, before it becomes an issue mid-trade.

---

## Driving Forces (Q4)

**Trigger:** Just finished signing up and hasn't listed a book yet — privacy is on his mind before it's forced on him.

**Hope:** Set it once so he never has to think about privacy again mid-trade.

**Worry:** Realizes too late, mid-trade, that he has to hand over his address — and it's awkward to back out by then.

---

## Device & Starting Point (Q5 + Q6)

**Device:** Mobile
**Entry:** Right after signing up (continuation from account creation), taps into Account Settings from the profile menu before listing his first book.

---

## Best Outcome (Q7)

**User Success:**
Enables address-masking / platform-mediated shipping as his default in under a minute, and never has to think about it again.

**Business Success:**
Proactive privacy configuration reduces mid-trade drop-off and privacy-related support tickets — feeds Objective 3.3.

---

## Shortest Path (Q8)

1. **Account Settings** — Toggles on address-masking / platform-mediated shipping as the default for all future trades ✓

---

## Trigger Map Connections

**Persona:** Tom the Declutterer (Priority 3)

**Driving Forces Addressed:**
- ❌ **Fear:** Sharing his home address with a stranger for pickup/shipping (13/15)

**Business Goal:** 3.3 Fewer than 10% of transactions require manual support

---

## Scenario Steps

| Step | Folder | Purpose | Exit Action |
|------|--------|---------|-------------|
| 5.1 | `5.1-account-settings/` | Set address-masking as the default before ever listing | Final — scenario success ✓ |

**First step** (5.1) includes full entry context (Q3 + Q4 + Q5 + Q6).
