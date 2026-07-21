-- Genre/category browsing. Fixed enum chosen by the lister at listing time
-- (same pattern as `condition`) rather than derived from Open Library's
-- per-book "subjects" data, which is free-text, wildly inconsistent, and
-- often missing entirely — unusable as a clean filter taxonomy.
alter table public.listings
  add column genre text not null default 'Other'
  check (
    genre in (
      'Fiction',
      'Non-Fiction',
      'Mystery & Thriller',
      'Sci-Fi & Fantasy',
      'Romance',
      'Biography & Memoir',
      'History',
      'Self-Help',
      'Children''s',
      'Young Adult',
      'Comics & Graphic Novels',
      'Other'
    )
  );

-- Browse filters on (status = 'live', genre = ...) together.
create index listings_live_genre_idx on public.listings (genre)
  where status = 'live';
