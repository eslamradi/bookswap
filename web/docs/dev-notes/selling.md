# Dev Notes: Selling (2026-07-21)

## What changed

Payments were removed earlier this session because there was no real processor and "Pay now" was a dead button. This reintroduces selling *deliberately*, but with the same philosophy already used for shipping: bookswap never touches money. A listing can now be marked "For Sale" with a price; the buyer and seller arrange actual payment themselves (cash, Venmo, etc.) once the request is accepted — same as they already arrange the physical handoff.

## Schema

- `listings.listing_type` (`'swap' | 'sale'`, default `'swap'`) and `listings.price` (nullable numeric). A check constraint enforces `(listing_type = 'sale') = (price is not null)` — a sale listing must have a price, a swap listing must not carry a stale one.
- `trades.offer_type` gets `'sale'` back in its check constraint (removed along with payment processing), and `trades.price` is re-added to record what was agreed at request time — kept even if the listing's price changes later.

## Flow

1. **Listing** (`batch-listing-form.tsx`): a Swap/For Sale selector next to condition and genre; price input appears only for "For Sale", with inline validation (must be a positive number) that also gates the submit button.
2. **Browsing**: a price badge on Browse grid cards and inline next to the title in Search results.
3. **Requesting**: the listing detail page's CTA branches — swap listings still go to `/listings/[id]/offer` (submit your own book), but sale listings go to a new, much simpler `/listings/[id]/buy` page (`BuyActions`) that just confirms intent and creates a `trades` row directly (`offer_type: 'sale'`, `price` copied from the listing, no `offered_listing_id` since the buyer isn't giving a book). Reuses the existing accept/decline (`trade-actions.tsx`), messaging, and rating flows entirely unchanged.
4. **Handoff**: a payment reminder banner ("bring cash, or send $X via Venmo/PayPal — bookswap doesn't process payment") shows on the handoff page for sale trades, regardless of which exchange method (meetup/self-arranged) is chosen.

## Verified

Live against a real dev server with real DB constraints and a real two-user Playwright browser test (reusing the session-injection approach from the live-updates fix):
- Confirmed the DB rejects a swap listing with a price and a sale listing without one (both correctly 400).
- Full flow: buyer sees the price and "Buy this book — $X" CTA on the listing detail page, lands on `/buy`, confirms, gets redirected to the real trade (confirmed via `waitForURL`, not a fixed timeout — an earlier version of this test falsely looked like it failed because `networkidle` doesn't reliably wait for a Next.js client-side `router.push()`), trade page shows "For sale — $15", owner accepts, handoff page shows the payment reminder with the correct price.
- Test listings/trades deleted afterward.

`npm run lint` / `npm run build` clean.
