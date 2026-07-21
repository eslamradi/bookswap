# Dev Notes: Real-Browser Testing Found a Live-Updates Bug (2026-07-21)

## What was wrong

The initial live-updates implementation (see `live-updates.md`) was verified only with a service-role Node script — which bypasses RLS entirely, so it couldn't have caught this. Asked to actually test messages/handoff live in a browser, I used Playwright with two real authenticated sessions (cookies constructed from real Supabase sessions minted via the admin API, not fake data) against the real app. That test failed: **zero realtime events ever reached the browser**, for either messages or trade updates.

Root cause, found by inspecting raw WebSocket frames and then `@supabase/supabase-js` / `@supabase/realtime-js` source directly:

- supabase-js only pushes the session JWT to the Realtime socket (`realtime.setAuth()`) on `SIGNED_IN` / `TOKEN_REFRESHED` auth events. Restoring an *existing* session on page load fires `INITIAL_SESSION` instead, which is not handled the same way.
- Separately, the socket's own connect-time auth fetch (`_setAuthSafely('connect')`) is asynchronous, and our components called `.channel(...).subscribe()` immediately on mount without waiting for it.
- Either gap means the `phx_join` message can go out with no `access_token` attached. The server still accepts the subscription (replies `ok`), but every event RLS-checks against `auth.uid()` — which resolves to nothing — so it's silently filtered out for that connection's entire lifetime. No error, no client-visible failure, just events that never arrive.

This is a known category of Supabase Realtime + RLS gotcha, not a bug in our RLS policies themselves — the fix is on the client side.

## Fix

New `src/lib/supabase/realtime-auth.ts`: `ensureRealtimeAuth(supabase)` awaits `supabase.auth.getSession()` and then `supabase.realtime.setAuth(session.access_token)` *before* any channel is created. Both `message-thread.tsx` and `handoff-actions.tsx` now await this inside their subscription effect before calling `.channel(...).subscribe()`, with a `cancelled` flag so an unmount before the auth check resolves doesn't leak a subscription.

## Verified

Real dual-user browser test via Playwright + Chromium (installed for this specifically — no browser automation tool was otherwise available):

1. Minted real sessions for two real accounts via Supabase's admin `generate_link` + `verify` (`token_hash`, not the `token`+`email` form — that one 400s) endpoints, since headless magic-link email delivery isn't scriptable.
2. Constructed the exact `@supabase/ssr` cookie (`sb-<project-ref>-auth-token`, `base64-` + base64url(JSON session)) by reading the library's own source rather than guessing, and injected it via `context.addCookies()` — confirmed real sessions (protected `/account` didn't redirect to sign-in for either user).
3. First run (before the fix) failed exactly as predicted: message never arrived, and the one handoff event that looked like it worked was a false positive — B's account had a stored `preferred_exchange_method: 'meetup'`, which auto-applies locally on page load regardless of realtime. Raw frame inspection confirmed zero broadcasts of any kind reached B's socket.
4. Applied the fix, reran against a local dev server (with B's stored preference temporarily cleared, and A deliberately choosing the *other* handoff method, so a live update on B's screen couldn't be confused with B's own local auto-apply): message delivery, handoff method sync, and handoff confirmation sync (both directions) all genuinely passed, confirmed via real `postgres_changes` broadcast frames observed on the wire, not just DOM assertions with generous timeouts.
5. All test trades/listings deleted afterward; B's preference restored to its original value.

**Lesson worth keeping:** a positive-looking test result (B's screen showed the right text) turned out to be caused by something else entirely (a stored preference), not the mechanism under test. Instrumenting the raw transport (WebSocket frames) rather than trusting only the higher-level UI assertion is what caught it.
