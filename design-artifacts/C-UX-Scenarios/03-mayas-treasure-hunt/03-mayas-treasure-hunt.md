---
design_intent: D
design_status: not-started
---

# 03: Maya's Treasure Hunt

**Project:** bookswap
**Created:** 2026-07-12
**Method:** Whiteport Design Studio (WDS)

---

## Transaction (Q1)

**What this scenario covers:**
Browse for an unexpected book, verify trust signals, and complete a swap by listing one of her own books in trade.

---

## Business Goal (Q2)

**Goal:** Earn trust — get happier, repeat users
**Objective:** 2.1 Maintain 4.5+/5 average post-exchange satisfaction / 2.3 60%+ of users list a second book within 90 days

---

## User & Situation (Q3)

**Persona:** Maya the Bookworm (Priority 1 — primary persona)
**Situation:** Finished her current book last night, has a free evening, browsing casually from the couch. Always chasing the next read, but her shelves are already full.

---

## Driving Forces (Q4)

**Trigger:** Finished her current book last night and has a free evening ahead with nothing lined up to read next.

**Hope:** Stumble onto something she wouldn't have picked herself.

**Worry:** The book arrives beat-up or not as described, ruining the point of trading instead of just buying new.

---

## Device & Starting Point (Q5 + Q6)

**Device:** Tablet
**Entry:** Opens bookswap directly (habitual, bookmarked use) on a free evening after finishing her current book, heads straight to Browse.

---

## Best Outcome (Q7)

**User Success:**
Finds an unexpected book she wouldn't have picked herself, trusts the condition description enough to request it, and lists one of her own books to complete the trade.

**Business Success:**
A repeat, engaged browsing session converts into a completed swap and a new listing — directly feeding Objective 2.3 (60%+ list a second book) and reinforcing trust (2.1).

---

## Shortest Path (Q8)

1. **Browse Listings** — Scrolls the "open to any book" feed, filters by a genre she likes, spots an intriguing title
2. **Book Listing Detail** — Reviews condition photos/rating, decides she wants to request it
3. **User Profile/Reputation** — Checks the other lister's rating/history to confirm trustworthiness
4. **Create Listing (single)** — Lists one of her own books to offer in trade, completing the swap request ✓

---

## Trigger Map Connections

**Persona:** Maya the Bookworm (Priority 1)

**Driving Forces Addressed:**
- ✅ **Want:** Discover unexpected books outside her usual habits (12/15)
- ❌ **Fear:** Receiving a book in worse condition than described (13/15)

**Business Goal:** 2.1 4.5+/5 satisfaction / 2.3 60%+ list a second book

---

## Scenario Steps

| Step | Folder | Purpose | Exit Action |
|------|--------|---------|-------------|
| 3.1 | `3.1-browse-listings/` | Discover an unexpected book through casual browsing | Selects a listing → proceeds to Book Listing Detail |
| 3.2 | `3.2-book-listing-detail/` | Evaluate condition and trust signals for one book | Decides to request it → proceeds to User Profile |
| 3.3 | `3.3-user-profile-reputation/` | Confirm the lister is trustworthy | Confirms trust → proceeds to Create Listing |
| 3.4 | `3.4-create-listing-single/` | List one of her own books to offer in trade | Final — completes swap request, scenario success ✓ |

**First step** (3.1) includes full entry context (Q3 + Q4 + Q5 + Q6).
**On-step interactions** (that don't leave the step) are documented as storyboard items within each page spec.
