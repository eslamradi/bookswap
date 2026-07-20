---
design_intent: D
design_status: not-started
---

# 04: Tom's Safe Handoff

**Project:** bookswap
**Created:** 2026-07-12
**Method:** Whiteport Design Studio (WDS)

---

## Transaction (Q1)

**What this scenario covers:**
Confirm a matched trade, coordinate payment/shipping without exposing his home address, and close out with a rating.

---

## Business Goal (Q2)

**Goal:** Earn trust — get happier, repeat users / Work smarter — minimize friction and overhead
**Objective:** 2.2 Keep dispute/no-show rate under 5% / 3.3 Fewer than 10% of transactions require manual support

---

## User & Situation (Q3)

**Persona:** Tom the Declutterer (Priority 3) — this flow also resolves Maya's and Priya's ghosting/non-delivery fears, but Tom's address-privacy fear is the sharpest test of it.
**Situation:** One of his listed books just got claimed by another user. He needs to finalize and ship it without extra hassle or exposing personal info.

---

## Driving Forces (Q4)

**Trigger:** Just got notified that one of his listed books was claimed by another user.

**Hope:** Ship it off quickly and be done, without giving a stranger his address.

**Worry:** Has to hand over his home address to someone he's never met, or the other person flakes after he's already agreed.

---

## Device & Starting Point (Q5 + Q6)

**Device:** Mobile
**Entry:** Gets a push/email notification that his book was claimed, taps directly into the app to confirm the trade.

---

## Best Outcome (Q7)

**User Success:**
Confirms the trade, ships the book using a platform-provided shipping label without ever sharing his home address, and gets marked complete with a good rating — all in a few taps.

**Business Success:**
Trade closes with no dispute and no support ticket — protects Objective 2.2 (<5% disputes) and 3.3 (<10% need support).

---

## Shortest Path (Q8)

1. **Trade/Offer Flow** — Reviews and confirms the trade terms with the other user
2. **Messaging** — Coordinates handoff details without exchanging personal contact/address info directly
3. **Checkout** — Confirms transaction terms (payment collected for a sale, or skipped for a pure exchange)
4. **Shipping/Handoff Coordination** — Generates a platform-provided shipping label; his real address stays hidden from the other user
5. **Trade Confirmation & Tracking** — Ships the package; tracking updates automatically
6. **Post-Trade Rating** — Leaves and receives a rating; trade marked complete ✓

---

## Trigger Map Connections

**Persona:** Tom the Declutterer (Priority 3)

**Driving Forces Addressed:**
- ✅ **Want:** Get some value back for minimal work (9/15)
- ❌ **Fear:** Sharing his home address with a stranger for pickup/shipping (13/15)

*(Also resolves, cross-persona: Maya's fear of a partner ghosting after shipping (11/15) and Priya's fear of paying into a swap that never ships (11/15) — this scenario is shared trust infrastructure, not unique to Tom.)*

**Business Goal:** 2.2 <5% dispute rate / 3.3 <10% need support

---

## Scenario Steps

| Step | Folder | Purpose | Exit Action |
|------|--------|---------|-------------|
| 4.1 | `4.1-trade-offer-flow/` | Confirm trade terms with the other user | Confirms → proceeds to Messaging |
| 4.2 | `4.2-messaging/` | Coordinate handoff without exposing personal info | Handoff details agreed → proceeds to Checkout |
| 4.3 | `4.3-checkout/` | Settle payment (sale) or confirm no payment due (exchange) | Confirmed → proceeds to Shipping |
| 4.4 | `4.4-shipping-handoff-coordination/` | Generate a masked/platform shipping label | Label generated → proceeds to Tracking |
| 4.5 | `4.5-trade-confirmation-tracking/` | Ship and track the package | Delivery confirmed → proceeds to Rating |
| 4.6 | `4.6-post-trade-rating/` | Close out the trade with mutual ratings | Final — scenario success ✓ |

**First step** (4.1) includes full entry context (Q3 + Q4 + Q5 + Q6).
**On-step interactions** (that don't leave the step) are documented as storyboard items within each page spec.
