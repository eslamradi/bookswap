import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { GENRES, type Genre } from "@/lib/books/genres";

function isGenre(value: string): value is Genre {
  return (GENRES as readonly string[]).includes(value);
}

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ genre?: string }>;
}) {
  const { genre: rawGenre } = await searchParams;
  const activeGenre = rawGenre && isGenre(rawGenre) ? rawGenre : null;

  const supabase = await createClient();

  let query = supabase
    .from("listings")
    .select("id, title, author, condition, genre, cover_url, photo_path")
    .eq("status", "live");

  if (activeGenre) {
    query = query.eq("genre", activeGenre);
  }

  const { data: listings } = await query
    .order("created_at", { ascending: false })
    .limit(60);

  const items = listings ?? [];

  const thumbnails = await Promise.all(
    items.map(async (item) => {
      if (item.photo_path) {
        const { data } = supabase.storage
          .from("listing-photos")
          .getPublicUrl(item.photo_path);
        if (data?.publicUrl) return data.publicUrl;
      }
      return item.cover_url;
    }),
  );

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-4 py-3">
        <Link href="/" className="text-sm text-gray-500">
          ← bookswap
        </Link>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-6">
        <h1 className="mb-4 text-lg font-semibold text-gray-900">
          Browse books
        </h1>

        <div
          id="browse-genre-filter"
          data-object-id="browse-genre-filter"
          className="mb-6 flex flex-wrap gap-2"
        >
          <Link
            id="browse-genre-all"
            data-object-id="browse-genre-all"
            href="/browse"
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              !activeGenre
                ? "border-bookswap-600 bg-bookswap-600 text-white"
                : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            All
          </Link>
          {GENRES.map((g) => (
            <Link
              key={g}
              id={`browse-genre-${g}`}
              data-object-id={`browse-genre-${g}`}
              href={`/browse?genre=${encodeURIComponent(g)}`}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                activeGenre === g
                  ? "border-bookswap-600 bg-bookswap-600 text-white"
                  : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {g}
            </Link>
          ))}
        </div>

        <div
          id="browse-grid"
          data-object-id="browse-grid"
          className="grid grid-cols-2 gap-4 sm:grid-cols-3"
        >
          {items.map((item, i) => (
            <Link
              key={item.id}
              id={`browse-card-${item.id}`}
              data-object-id={`browse-card-${item.id}`}
              href={`/listings/${item.id}`}
              className="block overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-md"
            >
              <div className="flex aspect-[2/3] items-center justify-center bg-gray-100 text-xs text-gray-400">
                {thumbnails[i] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={thumbnails[i]!}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  "cover"
                )}
              </div>
              <div className="p-2">
                <p className="truncate text-sm font-medium text-gray-900">
                  {item.title}
                </p>
                <p className="truncate text-xs text-gray-500">
                  {item.author}
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  {item.genre} · {item.condition}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {items.length === 0 && (
          <p className="py-16 text-center text-sm text-gray-400">
            {activeGenre
              ? `No ${activeGenre} books listed yet.`
              : "No books listed yet."}
          </p>
        )}
      </div>
    </main>
  );
}
