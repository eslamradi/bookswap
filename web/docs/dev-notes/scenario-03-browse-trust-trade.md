# Dev Plan: Scenario 03 — Maya's Treasure Hunt

**Spec:** [design-artifacts/C-UX-Scenarios/03-mayas-treasure-hunt/](../../design-artifacts/C-UX-Scenarios/03-mayas-treasure-hunt/)
**Branch:** `feature/scenario-03-browse-trust-trade`

## Decisions

1. **No genre filter on Browse.** The original page spec included genre filter chips, but real listings have no genre data (Open Library's lookup response doesn't reliably include it, and nothing in the schema captures it). Rather than fake it, Browse ships as recency-ordered only — this exactly matches the Phase 4 spec's own resolved open question ("MVP ships with basic browse/filter; sophisticated recommendations are post-MVP"). Adding genre is a real future feature (would need either editable metadata or a richer book-data source), not a silent scope cut.
2. **Reputation is honestly empty right now.** User Profile shows real `member since` date, but "New member, no trade history" for everyone — because Post-Trade Rating (Scenario 04) doesn't exist yet, so there is no real rating data to show. This isn't a placeholder to be embarrassed about; it's the actual cold-start state the Phase 4 spec explicitly flagged as an open question, now visibly true in the running product.
3. **Create Listing (single) creates a real listing, referencing the target.** The full trade-request/matching workflow is Scenario 04 territory (not built yet). This page's honest scope: Maya creates a real, functional listing of her own book, with a `offered_for_listing_id` reference recorded against the listing she wants — a real link, not a fake confirmation, but not a full trade-negotiation system either.
4. **Display names:** `profiles` had no display-name column (deliberately deferred in 1.1). Needed now to show listers/reviewers as something other than a UUID. No "edit profile" page exists to let users set one, so it's auto-populated from their email's local part (e.g. `radi` from `radi@example.com`) at signup — a reasonable default, not a fake name.

## Schema Additions

- `listings.description` (nullable) — lister's free-text notes
- `listings.offered_for_listing_id` (nullable, self-referencing FK) — set when a listing was created via the "offer in trade" flow
- `profiles.display_name` (text) — auto-populated from email local-part in the existing `handle_new_user` trigger

## Files

1. `supabase/migrations/<ts>_scenario-03.sql`
2. `src/app/browse/page.tsx` — public grid, recency order
3. `src/app/listings/[id]/page.tsx` — Book Listing Detail (template page, public)
4. `src/app/profile/[userId]/page.tsx` — User Profile/Reputation (public)
5. `src/app/listings/[id]/offer/page.tsx` — Create Listing (single), auth-guarded
6. Update `src/app/search/page.tsx` — link each result row into `/listings/[id]` (wasn't clickable before)

## Acceptance Criteria (from spec, adapted per decisions above)

- [ ] `/browse` — public, recency-ordered grid of live listings, links into detail pages
- [ ] `/listings/[id]` — public, shows condition/photo/description, links to lister's profile and to the offer flow
- [ ] `/profile/[userId]` — public, real member-since date, honest empty-reviews state
- [ ] `/listings/[id]/offer` — auth-guarded, real ISBN entry → creates a real listing referencing the target
- [ ] Search results are now clickable into the same detail template
