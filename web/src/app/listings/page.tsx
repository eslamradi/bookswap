import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppHeader } from "@/components/layout/app-header";

type Listing = {
  id: string;
  title: string;
  author: string;
  cover_url: string | null;
  photo_path: string | null;
  condition: string;
  status: string;
};

export default async function ListingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in?next=/listings");
  }

  const { data: listings } = await supabase
    .from("listings")
    .select("id, title, author, cover_url, photo_path, condition, status")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  const items: Listing[] = listings ?? [];

  // Pending trades against this user's own listings — someone else made an
  // offer and it's waiting on this user to accept/decline.
  const { data: pendingTrades } = await supabase
    .from("trades")
    .select("id, listing_id")
    .eq("owner_id", user.id)
    .eq("status", "pending");

  const pendingTradeByListing = new Map(
    (pendingTrades ?? []).map((t) => [t.listing_id, t.id]),
  );

  // Trades this user initiated (offers they sent), so they can track status
  // without needing to remember a link from the confirmation screen.
  const { data: myOffers } = await supabase
    .from("trades")
    .select("id, status, listing_id, listings!trades_listing_id_fkey(title)")
    .eq("requester_id", user.id)
    .order("created_at", { ascending: false });

  // listing-photos is a public bucket (Scenario 02 made it so — listing
  // photos are meant to be publicly viewable when browsing/searching), so a
  // plain public URL works here instead of a signed one.
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
      <AppHeader />

      <div className="mx-auto max-w-lg px-4 py-6">
        {items.length > 0 ? (
          <div
            id="dashboard-confirmation"
            data-object-id="dashboard-confirmation"
            className="mb-6 text-center"
          >
            <p className="text-xl font-bold text-gray-900">
              ✓ <span id="dashboard-count">{items.length}</span> book
              {items.length === 1 ? "" : "s"} listed!
            </p>
          </div>
        ) : (
          <p
            id="dashboard-empty-hint"
            data-object-id="dashboard-empty-hint"
            className="py-8 text-center text-sm text-gray-400"
          >
            No listings yet — nothing&apos;s been submitted.
          </p>
        )}

        <div
          id="dashboard-listings"
          data-object-id="dashboard-listings"
          className="space-y-2"
        >
          {items.map((item, i) => (
            <div
              key={item.id}
              id={`dashboard-listing-${item.id}`}
              data-object-id={`dashboard-listing-${item.id}`}
              className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3"
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
                  {item.author}
                </p>
              </div>
              {pendingTradeByListing.has(item.id) ? (
                <Link
                  id={`dashboard-listing-${item.id}-claimed`}
                  data-object-id={`dashboard-listing-${item.id}-claimed`}
                  href={`/trades/${pendingTradeByListing.get(item.id)}`}
                  className="rounded bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700 hover:bg-amber-100"
                >
                  Claimed — action needed
                </Link>
              ) : (
                <span className="rounded bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                  {item.status}
                </span>
              )}
            </div>
          ))}
        </div>

        {myOffers && myOffers.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-2 text-sm font-semibold text-gray-700">
              Your offers
            </h2>
            <div className="space-y-2">
              {myOffers.map((offer) => (
                <Link
                  key={offer.id}
                  href={`/trades/${offer.id}`}
                  className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 hover:bg-gray-50"
                >
                  <span className="truncate text-sm text-gray-900">
                    {/* PostgREST returns a to-one embed as a plain object at
                        runtime, not the array the generated type implies —
                        handle both rather than assuming one. */}
                    {(Array.isArray(offer.listings)
                      ? offer.listings[0]
                      : offer.listings
                    )?.title ?? "Listing"}
                  </span>
                  <span className="ml-2 flex-shrink-0 rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                    {offer.status}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link
            id="dashboard-add-more"
            data-object-id="dashboard-add-more"
            href="/listings/new"
            className="text-sm font-medium text-bookswap-600 hover:text-bookswap-700"
          >
            + Add more books
          </Link>
        </div>
      </div>
    </main>
  );
}
