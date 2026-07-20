export type BookLookupResult = {
  isbn: string;
  title: string;
  author: string;
  coverUrl: string | null;
};

function normalizeIsbn(raw: string): string {
  return raw.replace(/[^0-9Xx]/g, "");
}

// Open Library's Books API — free, keyless, no rate-limit setup needed.
// https://openlibrary.org/dev/docs/api/books
export async function lookupIsbn(
  rawIsbn: string,
): Promise<BookLookupResult | null> {
  const isbn = normalizeIsbn(rawIsbn);
  if (!isbn) return null;

  const url = `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`;

  let data: Record<string, unknown>;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    data = await res.json();
  } catch {
    return null;
  }

  const entry = data[`ISBN:${isbn}`] as
    | {
        title?: string;
        authors?: { name: string }[];
        cover?: { medium?: string; large?: string };
      }
    | undefined;

  if (!entry || !entry.title) return null;

  return {
    isbn,
    title: entry.title,
    author: entry.authors?.map((a) => a.name).join(", ") || "Unknown author",
    coverUrl: entry.cover?.medium ?? entry.cover?.large ?? null,
  };
}
