# Dev Plan: Scenario 04 — Tom's Safe Handoff

> **Revised (2026-07-20):** dropped the courier/shipping-label simulation entirely, per Radi's call — no real carrier integration was ever going to happen soon, and it was solving Tom's address-privacy fear in a roundabout way. Replaced Shipping (4.4) + Tracking (4.5) with a single **Handoff** step: choose "meet in a public place" or "arrange mailing yourselves," then both sides confirm the exchange happened. A public meetup needs *no address at all*, which is actually a cleaner resolution of Tom's fear (13/15, sharing his home address) than platform-mediated shipping ever was. Self-arranged mailing puts address-sharing back in the users' own hands, via the messaging thread, entirely opt-in rather than a platform default. See the "Handoff Revision" section below for schema/file details — the original plan below is kept for history.

**Spec:** [design-artifacts/C-UX-Scenarios/04-completing-the-trade/](../../design-artifacts/C-UX-Scenarios/04-completing-the-trade/)
**Branch:** `feature/scenario-04-safe-handoff`

## Decisions

1. **New `trades` entity, created by the Scenario 03 offer flow.** Nothing before now actually connected an "offer" to the original listing's owner — Maya's offer-form just created a listing row. Wiring it: submitting an offer now also creates a `trades` row (requester = Maya, owner = Tom, references both listings), which is what this whole scenario operates on.
2. **Only the "exchange" path is real-world initiable right now.** The original spec mentions "Straight claim" and "cash / book-for-book" as offer types, but no real page in Scenarios 01–03 lets someone claim-without-offering or pay cash — that would be a new "Buy this book" action on Book Listing Detail that doesn't exist yet. Scenario 04 completes whatever trade exists; it doesn't add new ways to start one. `offer_type` is schema-ready for `'claim'`/`'sale'` but only `'exchange'` is reachable today.
3. **Shipping label generation and carrier tracking are simulated**, same as the validated prototype — no real carrier API integration this pass (that's a real, meaningful integration project on its own, flagged as a genuine future dependency, not a shortcut). Shipping page marks a boolean; tracking page has the same "simulate carrier update" prototype-only button the HTML prototype used.
4. **Checkout has no real payment processor.** Since only the exchange path is reachable (see #2), Checkout for now is always the "no payment due" pass-through state — the payment-collection UI exists in the page per spec but isn't wired to a real processor (Stripe, etc. — a genuine future integration, not faked).
5. **Ratings are public-readable, participant-only insertable**, gated to `completed` trades — this is what finally gives the Profile page (Scenario 03) real review data instead of the honest-empty state it's had until now.

## Schema

- `trades` (id, listing_id, offered_listing_id nullable, requester_id, owner_id, offer_type, price nullable, status, payment_confirmed, shipping_label_generated, tracking_status, created_at) — RLS: participants only (select/update)
- `messages` (id, trade_id, sender_id, body, created_at) — RLS: trade participants only
- `ratings` (id, trade_id, rater_id, ratee_id, rating 1-5, comment nullable, created_at) — RLS: public select, insert restricted to a real participant of a `completed` trade rating the *other* participant

## Files

1. `supabase/migrations/<ts>_scenario-04.sql`
2. `src/components/listings/offer-form.tsx` — updated to also create a `trades` row
3. `src/app/listings/page.tsx` (Dashboard) — updated to surface pending trades on the owner's own listings
4. `src/app/trades/[id]/page.tsx` — Trade/Offer Flow (accept/decline)
5. `src/app/trades/[id]/messages/page.tsx` + a small client thread component
6. `src/app/trades/[id]/checkout/page.tsx`
7. `src/app/trades/[id]/shipping/page.tsx`
8. `src/app/trades/[id]/tracking/page.tsx`
9. `src/app/trades/[id]/rating/page.tsx`
10. `src/app/profile/[userId]/page.tsx` — updated to query and display real ratings

## Acceptance Criteria (from spec, adapted per decisions above)

- [x] Sending an offer (Scenario 03) creates a real `trades` row; the owner sees it as a pending trade on their Dashboard
- [x] `/trades/[id]` — only participants can view; accept/decline works; accept moves to Messaging
- [x] `/trades/[id]/messages` — real persisted thread, participant-only
- [x] `/trades/[id]/checkout` — pass-through confirmation (exchange path only, as decided)
- [x] `/trades/[id]/shipping` — simulated label generation, address never actually collected/shown to the counterpart
- [x] `/trades/[id]/tracking` — simulated carrier update button, matches prototype
- [x] `/trades/[id]/rating` — real rating submission, marks trade `completed`
- [x] `/profile/[userId]` now shows real ratings when they exist, same honest-empty state as before when they don't

**Verified (route/auth-guard level, not full click-through — needs Radi's session):** lint, build, migration push, and curl checks against real listing data all pass. Hit and fixed one real Turbopack dev-cache bug along the way (see `agent-experiences/2026-07-19-turbopack-stale-route-cache.md`).

## Handoff Revision (2026-07-20)

**Schema:** drop `shipping_label_generated`, `tracking_status`. Add `exchange_method` (`'meetup' | 'self_arranged'`, nullable until chosen), `handoff_confirmed_by_requester`, `handoff_confirmed_by_owner` (both boolean, default false).

**Flow:** Checkout → `/trades/[id]/handoff` (was `/shipping` + `/tracking`) → Rating, once both participants confirm.

- Choosing **meetup**: guidance to suggest a public place/time in Messages — no address ever needed.
- Choosing **self_arranged**: guidance that bookswap doesn't handle shipping — participants coordinate directly (including any address) via Messages, entirely their own choice.
- Each participant has their own "Mark as exchanged" confirmation; once both are true, either can proceed to Rating.

**Files removed:** `src/app/trades/[id]/shipping/`, `src/app/trades/[id]/tracking/`, `src/components/trades/shipping-actions.tsx`, `src/components/trades/tracking-actions.tsx`.
**Files added:** `src/app/trades/[id]/handoff/page.tsx`, `src/components/trades/handoff-actions.tsx`.
**Files changed:** `src/components/trades/checkout-actions.tsx` (redirect target).
