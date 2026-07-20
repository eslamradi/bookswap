# Dev Plan: Scenario 02 — Priya's Race Against the Deadline (`/`, `/search`, `/notifications`)

**Spec:** [design-artifacts/C-UX-Scenarios/02-priyas-race-against-the-deadline/](../../design-artifacts/C-UX-Scenarios/02-priyas-race-against-the-deadline/)
**Branch:** `feature/scenario-02-search-notify`

## IA Decision (made with Radi, not silently assumed)

Scenario 02's Home/Landing is a public, search-first entry page — conflicts with `/` already being the (deliberately minimal, no-search) Sign Up/Login page from Scenario 01. Resolved: **`/` becomes the public search home; Sign Up/Login moves to `/sign-in`.** Search and browsing are public (unauthenticated); only actions that need to know *who* to notify (the alert feature below) require signing in, redirecting to `/sign-in?next=<back-to-where-they-were>`.

This also means `listings` needs a public-read policy for `status = 'live'` rows — previously owner-only. This is exactly the moment flagged in the 1.2 dev-notes ("add public-read when Browse/Search needs it") — that's now.

## New Schema

- `alerts` table (id, user_id, query, created_at), owner-only RLS — captures "notify me" intent. No actual notification delivery yet (matches the original prototype's scope — this MVP captures the alert, doesn't send anything).
- New migration adds a public SELECT policy on `listings` for `status = 'live'`.

## Files

1. `supabase/migrations/<ts>_create_alerts_and_public_listings.sql`
2. `src/app/sign-in/page.tsx` — moved from `src/app/page.tsx`, now reads a `next` search param
3. `src/components/auth/sign-in-actions.tsx` — accepts a `next` prop (falls back to `DEFAULT_REDIRECT_PATH`) instead of hardcoding the batch-listing redirect for every sign-in
4. `src/app/listings/page.tsx`, `src/app/listings/new/page.tsx` — auth-guard redirects updated to `/sign-in?next=<original path>`
5. `src/app/page.tsx` — **new**: public search home, auto-focused input, low-emphasis secondary links
6. `src/app/search/page.tsx` — server component: query `listings` (public, `status = 'live'`) by title/author ilike or exact ISBN; match list or no-match+notify state (client component for the notify button since it needs an auth check + insert)
7. `src/app/notifications/page.tsx` — auth-guarded, real dashboard of the user's active alerts (same "real page, not just a confirmation toast" philosophy as 1.3's Dashboard)

## Acceptance Criteria (from spec)

- [ ] `/` — auto-focused search input, no auth required, low-emphasis browse/how-it-works links
- [x] `/search?q=` — public, unambiguous match vs. no-match state (not a blank/empty list)
- [x] No-match state offers "Notify me"; unauthenticated click routes to `/sign-in?next=/search?q=...` so the user lands back on the same search after signing in
- [x] Authenticated notify-me creates a real `alerts` row and redirects to `/notifications`
- [x] `/notifications` shows the real, current list of the user's active alerts (not just "the one you just made")
- [x] `/sign-in` (moved) still passes all of 1.1's original acceptance criteria unchanged

**Verified live by Radi (2026-07-19):** confirmed working end to end on the live Supabase project, including the logged-out notify-me → sign-in → back-to-alert round trip.
