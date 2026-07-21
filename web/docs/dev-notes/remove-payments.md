# Dev Notes: Remove Payments (2026-07-21)

## What changed

`offer_type: 'sale'` and its "Pay now" checkout step were dead from the start — nothing in the app ever created a sale offer (`offer-form.tsx` only ever inserts `offer_type: 'exchange'`), so the button existed but was unreachable except by hand-editing a trade row. Explicit product decision: no payment processor is going to be integrated, so remove the dead end rather than leave it implying a feature that doesn't exist. Same call as the earlier courier-shipping removal.

Removed:
- `/trades/[id]/checkout` page and `checkout-actions.tsx` — the whole step is gone, not just the sale branch of it. Since every real trade is `exchange` (or, in principle, `claim`), the "confirm" click it required was pure friction with nothing behind it.
- `trades.price` and `trades.payment_confirmed` columns — both sale-only.
- `'sale'` from the `trades.offer_type` check constraint (now `'exchange' | 'claim'`).

## New flow

Accept trade → Messages → **Handoff** directly (previously: → Checkout → Handoff). `message-thread.tsx`'s "Continue to Checkout →" link now points straight to `/trades/[id]/handoff` and reads "Continue to Handoff →".

## Not touched

`'claim'` stays in the schema and in the trade-detail page's display text ("Straight claim (no payment)") — it's a no-payment concept (give a book away outright), not a payments concept, and wasn't part of this request. Still unreachable via any UI today (nothing creates a claim offer either), same as before this change — just not in scope here.

## Verified

`npm run lint` and `npm run build` both clean after the removal; confirmed no leftover references to `price`, `payment_confirmed`, `offer_type === "sale"`, or `/checkout` anywhere in `src/`. Confirmed zero existing rows had `offer_type = 'sale'` before dropping it from the constraint (checked directly against the production table before migrating, same due-diligence as the self-trade constraint fix).
