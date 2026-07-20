# Dev Plan: Scenario 05 — Account Settings (`/account`)

**Spec:** [design-artifacts/C-UX-Scenarios/05-toms-privacy-settings/](../../design-artifacts/C-UX-Scenarios/05-toms-privacy-settings/)
**Branch:** `feature/scenario-05-account-settings`

## Why this needed rethinking, not a direct build

The original spec is entirely about **address-masking defaults and preferred shipping method** — both concepts that no longer exist. The 2026-07-20 handoff simplification (see `scenario-04-safe-handoff.md`) removed courier/shipping entirely in favor of choosing "meet in public" or "arrange mailing yourselves" per-trade. A public meetup needs no address at all, and self-arranged mailing is an explicit, per-trade, opt-in choice — there's nothing left to "mask" or default at the account level in the original sense.

**What's kept from the original intent:** the underlying goal — let Tom set a preference once instead of deciding every time — is still worth having. Adapted it to **preferred exchange method** (meetup / self-arranged / no preference), stored on the profile, so a future pass can pre-fill the Handoff choice instead of asking every time. **Not wired into Handoff yet this pass** — the preference is captured and stored, but Handoff still always asks. Flagging this explicitly rather than silently deciding it's out of scope forever.

**Also added, because they were real gaps with nowhere else to live:**
- **Editable display name.** Since Scenario 03, `display_name` has been auto-populated from the email's local part with no way to change it. This is the natural home for that.
- **Sign out.** There has been no way to sign out of the app at all until now — genuinely missing, not a scope decision.

## Schema

- `profiles.preferred_exchange_method` (nullable, same values as `trades.exchange_method`: `'meetup' | 'self_arranged'`)

## Files

1. `supabase/migrations/<ts>_account_settings.sql`
2. `src/app/account/page.tsx` — auth-guarded server component
3. `src/components/account/account-settings-form.tsx` — client component: display name field, exchange-method preference, sign out
4. Link to `/account` from somewhere reachable (Dashboard header, for now — no persistent nav exists yet)

## Acceptance Criteria

- [x] `/account` — auth-guarded, redirects to `/sign-in?next=/account` if not signed in
- [x] Display name is editable and saves for real (shows up on Browse/Profile/trade pages afterward)
- [x] Preferred exchange method saves for real, **and is now wired into Handoff** (2026-07-20, same day) — if set, Handoff auto-applies it instead of asking, with a "not this time?" escape hatch back to the choice screen
- [x] Sign out actually clears the session and redirects to `/`

**Verified:** lint, build, migration, route checks all pass.
