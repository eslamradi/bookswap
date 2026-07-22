# Dev Notes: Visual/UX Structural Pass (2026-07-22)

## Why

Asked for a visual design and UX pass. Before touching anything, actually looked at the live app in a real browser (Playwright + Chromium, mobile and desktop viewports) rather than assessing from code — that surfaced real bugs a code read wouldn't have caught. Scoped to **structural fixes only** per explicit choice: real bugs, consistent navigation, and desktop-aware layout — no color/branding/imagery overhaul, no home page redesign.

## Bugs found by actually looking, fixed here

1. **Dashboard "Your offers" showed the literal text "Listing"** instead of the book title. `src/app/listings/page.tsx` assumed a Supabase to-one embed (`listings!trades_listing_id_fkey(title)`) returns an array and indexed `[0]`, but PostgREST returns a plain object at runtime for a to-one join — the index access silently returned `undefined` and fell through to the hardcoded fallback string. Fixed with the same `Array.isArray` defensive pattern already used correctly in `notifications/page.tsx`.
2. **Blank lister/profile name** — `listings/[id]/page.tsx` and `profile/[userId]/page.tsx` rendered `display_name` with no fallback; when null (confirmed via a direct DB check, not assumed), it rendered nothing. Every other place in the codebase already had `?? "Unknown"` — these two didn't. Now consistent.
3. **Stale copy on Account Settings**: "not yet automatically applied at handoff time" was true when that page was first built, but the preference has been wired into Handoff since. Updated to reflect actual behavior.

## Navigation

New `src/components/layout/app-header.tsx` — one shared header (async server component, does its own `getUser()` call same as every page already does) used everywhere except `/` and `/sign-in`, which keep their own intentional centered treatment. Replaces what was previously ad-hoc per page:

- Several pages (`trades/[id]`, `rating`, `buy`, `offer`, `account`) had a plain `bookswap` **text label, not a link** — dead end, no way back.
- `/listings/new` (Batch Listing — arguably the single most important page in the app) had **no header at all**, no way back except the browser's back button.
- The pages that did link the wordmark disagreed on the target (`/` vs `/browse`).

`AppHeader` always links home, and adds persistent Browse / Alerts (if signed in) / Account-or-Sign-in links so a user is never more than one click from the rest of the app, regardless of which page they're on.

`trades/[id]/messages` keeps its distinct avatar+name header (more useful there than generic nav, mid-conversation) but previously had **no back link at all** — added one to `/trades/[id]`.

## Desktop

Browse was the one page with genuinely content-dense output that was wasting real estate: widened `max-w-3xl → max-w-5xl` and added a `lg:grid-cols-5` breakpoint (was capped at 3 columns even on a 1280px viewport). Also fixed the genre filter chips wrapping 3 rows deep on mobile before any book was visible — switched to a horizontal scroll strip (`overflow-x-auto`, hidden scrollbar, `flex-shrink-0` chips) instead of `flex-wrap`.

Left other pages' widths alone (`max-w-lg` forms/detail pages) — intentional per scope, not an oversight.

## Verified

Real before/after screenshots (mobile 390×844 and desktop 1280×900) via Playwright against a real dev server with real production data — not just a lint/build pass. Confirmed the "Listing" bug now shows the real title, blank names now show "Unknown", the account copy is corrected, genre chips scroll on one row, Browse uses 5 columns on desktop, and every previously-header-less or dead-wordmark page now has working, consistent navigation. Also hit (and worked around) the same Turbopack dev-cache corruption issue documented in `agent-experiences/2026-07-19-turbopack-stale-route-cache.md` — a `rm -rf .next` restart resolved it, unrelated to these changes.

`npm run lint` / `npm run build` clean.
