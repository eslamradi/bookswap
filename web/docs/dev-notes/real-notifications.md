# Dev Notes: Real Alert Notifications (2026-07-21)

## What changed

"Notify me when available" alerts (Scenario 02) previously only recorded intent — nothing was ever sent. This wires up real delivery.

**Flow:** whenever a listing is created with `status = 'live'` (Batch Listing, or the listing created behind an Offer), the client fires a request to `POST /api/alerts/check` with the new listing's id. That route runs server-side (using the Supabase service-role key, since it must act on behalf of *other* users' alerts) and:

1. Loads the listing.
2. Loads every saved alert and does a case-insensitive substring match of `alert.query` against the listing's title/author (JS-side, not SQL — the alerts table is small at this scale, and PostgREST can't easily express "match many arbitrary queries against one row" in a single filter).
3. For each match, inserts into the new `alert_notifications` table (`unique(alert_id, listing_id)`) — the insert failing with a `23505` unique-violation is the expected "already notified" path, and every other match short-circuits there. This is what makes the whole thing idempotent no matter how many times `/api/alerts/check` gets called for the same listing.
4. Only on a successful (non-duplicate) insert does it look up the alert owner's email (via `supabase.auth.admin.getUserById`, service-role only — email isn't in `profiles`) and send via Brevo's HTTP API (`BREVO_API_KEY`, a separate credential from the SMTP key already used for Supabase auth emails — Brevo's SMTP keys and API keys are not interchangeable, confirmed by testing the SMTP key against the API and getting a 401).

The notifications page (`/notifications`) now reads `alert_notifications` (joined to `listings`) alongside each alert and lists real matches with a link to the listing, instead of the old static "we'll notify you" placeholder.

## Why client-triggered instead of a DB trigger

Considered a Postgres trigger (`after insert on listings`) using `pg_net` to call the webhook server-side, which would cover every insert path automatically, including ones added later, without depending on the client. Went with a client-triggered fetch instead for this pass — much less infrastructure (no `pg_net`, no webhook secret to manage), and there are currently only two call sites that create live listings. **Known gap:** any future code path that inserts a `status: 'live'` listing without also calling `/api/alerts/check` will silently skip notifying. Flagging this explicitly rather than letting it become a surprise later.

## Security notes

- `/api/alerts/check` is intentionally not auth-gated — `listingId` alone doesn't expose anything the public search page doesn't already show, and the unique constraint means repeated/abusive calls can't cause duplicate emails, only (at most) nudge a legitimate notification to arrive slightly earlier than it organically would have.
- Listing `title`/`author` are user-controlled and get HTML-escaped before being interpolated into the email body, since they end up in another user's inbox.

## Verified

Live end-to-end test against the real Supabase project and Brevo: created a real alert, created a matching listing, hit the endpoint, confirmed the `alert_notifications` row and an actual "delivered" event in Brevo's activity log to a real inbox. Re-called the endpoint for the same listing and confirmed no second row / no duplicate send. Test data cleaned up afterward.

Not yet tested: the client-side fire-and-forget `fetch` calls from `batch-listing-form.tsx` / `offer-form.tsx` themselves (only the API route was exercised directly) — worth a manual click-through pass.
