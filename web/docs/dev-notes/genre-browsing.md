# Dev Notes: Genre/Category Browsing (2026-07-21)

## What changed

Added `listings.genre` (fixed enum, not null, defaults to `'Other'`) and genre-filter chips on `/browse`.

**Why a fixed enum instead of Open Library's subject data:** the ISBN lookup already returns rich `subjects` for many books (checked directly against the live API), but it's free-text, wildly granular ("Grief", "Drowning", "Daughters" for one novel), and inconsistently present across editions — unusable as a clean filter taxonomy. Genre is picked by the lister at listing time instead, the same pattern already used for `condition`. List: Fiction, Non-Fiction, Mystery & Thriller, Sci-Fi & Fantasy, Romance, Biography & Memoir, History, Self-Help, Children's, Young Adult, Comics & Graphic Novels, Other — defined once in `src/lib/books/genres.ts`.

## Files

- `supabase/migrations/20260721150000_add_listing_genre.sql` — column + check constraint + partial index on `(genre) where status = 'live'` (matches how Browse actually queries).
- `src/lib/books/genres.ts` — the fixed list, shared by every place that needs it.
- `batch-listing-form.tsx` / `offer-form.tsx` — genre `<select>` next to condition, same UI pattern. Batch form's localStorage persistence handles old queued items saved before this field existed (defaults to `"Other"` on read, doesn't crash).
- `browse/page.tsx` — genre filter chips ("All" + each genre) as links to `/browse?genre=X`, filtering server-side via `.eq("genre", ...)`. Invalid/unknown query values fall back to unfiltered (`isGenre` type guard).
- `search/page.tsx`, `listings/[id]/page.tsx` — genre shown alongside condition for consistency. Not wired into Search's text-query filtering — that stays title/author/ISBN only, genre filtering lives on Browse.

## Not touched

The Dashboard (`/listings`, a user's own listings) already selects `condition` but never displays it — genre wasn't added there either, matching that existing scope rather than introducing a new pattern.

## Verified

Live against production: applied the migration, confirmed the default (`'Other'`) and an explicit genre both insert correctly, created a real listing tagged `Sci-Fi & Fantasy`, confirmed it appears in the unfiltered Browse grid and under the `Sci-Fi & Fantasy` chip, and confirmed it's correctly excluded when filtering to `Romance`. Test data cleaned up afterward. `npm run lint` / `npm run build` both clean.
