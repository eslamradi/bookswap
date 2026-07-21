// Fixed set, not derived from Open Library's per-book "subjects" data —
// those are free-text tags (dozens of ultra-specific topics per book,
// inconsistently present) and unusable as a clean browsing taxonomy.
// Picked by the lister at listing time, same pattern as `condition`.
export const GENRES = [
  "Fiction",
  "Non-Fiction",
  "Mystery & Thriller",
  "Sci-Fi & Fantasy",
  "Romance",
  "Biography & Memoir",
  "History",
  "Self-Help",
  "Children's",
  "Young Adult",
  "Comics & Graphic Novels",
  "Other",
] as const;

export type Genre = (typeof GENRES)[number];
