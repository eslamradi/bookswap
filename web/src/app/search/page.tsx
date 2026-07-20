import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { NotifyButton } from "@/components/search/notify-button";

// Strip characters that would break PostgREST's .or() filter syntax
// (commas separate conditions, parens/percent/underscore are pattern
// syntax) — a plain-text search box shouldn't be able to inject filter
// logic just by typing a comma.
function sanitizeQuery(raw: string): string {
  return raw.replace(/[,()%_]/g, " ").trim();
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const safeQuery = sanitizeQuery(query);

  const supabase = await createClient();

  const { data: listings } =
    safeQuery.length > 0
      ? await supabase
          .from("listings")
          .select("id, title, author, condition, cover_url, photo_path")
          .eq("status", "live")
          .or(
            `title.ilike.%${safeQuery}%,author.ilike.%${safeQuery}%,isbn.eq.${safeQuery}`,
          )
          .limit(20)
      : { data: [] };

  const results = listings ?? [];

  const thumbnails = await Promise.all(
    results.map(async (item) => {
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

      <div className="mx-auto max-w-lg px-4 py-6">
        <h1
          id="search-results-query"
          data-object-id="search-results-query"
          className="mb-4 text-lg font-semibold text-gray-900"
        >
          &quot;{query}&quot;
        </h1>

        {results.length > 0 ? (
          <div
            id="search-results-matches"
            data-object-id="search-results-matches"
            className="space-y-2"
          >
            {results.map((item, i) => (
              <Link
                key={item.id}
                href={`/listings/${item.id}`}
                className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 hover:bg-gray-50"
              >
                <div className="flex h-14 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded bg-gray-100 text-xs text-gray-400">
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
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-gray-900">
                    {item.title}
                  </p>
                  <p className="truncate text-sm text-gray-500">
                    {item.author} · {item.condition}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div
            id="search-results-no-match"
            data-object-id="search-results-no-match"
            className="py-8 text-center"
          >
            <p className="mb-4 text-gray-600">No exact match right now</p>
            <NotifyButton query={query} />
          </div>
        )}
      </div>
    </main>
  );
}
