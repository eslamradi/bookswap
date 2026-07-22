# Dev Notes: Home Page Never Checked Auth State (2026-07-22)

## Bug

Reported: "Sign in still appears even after user is signed in." Root cause was in `src/app/page.tsx` (the home page) — it was a plain, non-async function component that never called `supabase.auth.getUser()` at all. It unconditionally rendered a "Sign in →" link regardless of actual auth state. This predates the earlier structural nav pass; `/` was deliberately left untouched in that pass (per the chosen "structural fixes only" scope, which excluded a home page redesign), so this specific bug survived it.

Confirmed via a real browser test with a real injected session (not guessed): signed-in home still showed "Sign in" before the fix, and correctly showed "Account →" after.

Also verified this was *not* a client-side router-cache staleness issue (a real possibility with Next.js `<Link>` navigation serving stale RSC output for a route visited earlier while signed out) — separately tested navigating between `AppHeader` pages (which do correctly call `getUser()`) via real `<Link>` clicks after signing in, including a route that had been visited anonymously earlier in the same browser context. That worked correctly, so the fix only needed to touch the home page itself.

## Fix

`page.tsx` is now `async`, fetches the user the same way every other page does, and the last inline link swaps between "Sign in →" (`/sign-in`) and "Account →" (`/account`) based on that.

## Verified

Real browser test, signed-out vs signed-in, fresh page loads: signed-out shows "Sign in", signed-in shows "Account", nothing else. `npm run build` confirms `/` switched from a static (`○`) to dynamic (`ƒ`) route, as expected now that it reads cookies per-request.
