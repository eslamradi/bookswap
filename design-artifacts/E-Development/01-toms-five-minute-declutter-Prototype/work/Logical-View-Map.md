# Logical View Map — Scenario 01: Tom's Five-Minute Declutter

**Created:** 2026-07-12
**Confirmed by:** Radi

---

## Views

### 1.1 Sign Up/Login
- **Type:** New logical view
- **Spec:** [1.1-sign-up-login.md](../../C-UX-Scenarios/01-toms-five-minute-declutter/1.1-sign-up-login/1.1-sign-up-login.md)
- **Summary:** Single-column, no nav chrome, passwordless auth (social + email magic-link/OTP)

### 1.2 Batch Listing
- **Type:** New logical view
- **Spec:** [1.2-batch-listing.md](../../C-UX-Scenarios/01-toms-five-minute-declutter/1.2-batch-listing/1.2-batch-listing.md)
- **Summary:** ISBN scan → auto-fill → condition preset → photo, repeatable queue, bulk submit

### 1.3 My Listings/Dashboard
- **Type:** New logical view
- **Spec:** [1.3-my-listings-dashboard.md](../../C-UX-Scenarios/01-toms-five-minute-declutter/1.3-my-listings-dashboard/1.3-my-listings-dashboard.md)
- **Summary:** Confirmation banner + listing summary. Note: this view is revisited in Scenario 04 with a "Claimed" state — out of scope for this build, flagged for consistency when Scenario 04 is prototyped.

---

## Build Order

1. 1.1 Sign Up/Login
2. 1.2 Batch Listing
3. 1.3 My Listings/Dashboard

No shared/reused views within this scenario — all three are distinct.
