import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppHeader } from "@/components/layout/app-header";

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: listing } = await supabase
    .from("listings")
    .select(
      "id, title, author, condition, genre, listing_type, price, description, cover_url, photo_path, owner_id, status",
    )
    .eq("id", id)
    .single();

  if (!listing) {
    notFound();
  }

  const { data: lister } = await supabase
    .from("profiles")
    .select("id, display_name, created_at")
    .eq("id", listing.owner_id)
    .single();

  let photoUrl: string | null = listing.cover_url;
  if (listing.photo_path) {
    const { data } = supabase.storage
      .from("listing-photos")
      .getPublicUrl(listing.photo_path);
    if (data?.publicUrl) photoUrl = data.publicUrl;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <AppHeader />

      <div className="mx-auto max-w-lg px-4 py-6">
        <div
          id="listing-detail-photos"
          data-object-id="listing-detail-photos"
          className="mb-4 flex aspect-[3/2] items-center justify-center overflow-hidden rounded-lg bg-gray-100 text-gray-400"
        >
          {photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photoUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            "no photo"
          )}
        </div>

        <h1
          id="listing-detail-title"
          data-object-id="listing-detail-title"
          className="text-xl font-bold text-gray-900"
        >
          {listing.title}
        </h1>
        <p
          id="listing-detail-author"
          data-object-id="listing-detail-author"
          className="mb-2 text-gray-500"
        >
          {listing.author}
        </p>
        {listing.listing_type === "sale" && (
          <p
            id="listing-detail-price"
            data-object-id="listing-detail-price"
            className="mb-2 text-2xl font-bold text-bookswap-600"
          >
            ${listing.price}
          </p>
        )}

        <p
          id="listing-detail-condition"
          data-object-id="listing-detail-condition"
          className="mb-4 text-sm font-medium text-gray-700"
        >
          {listing.genre} · Condition: {listing.condition}
        </p>

        {listing.description && (
          <p
            id="listing-detail-description"
            data-object-id="listing-detail-description"
            className="mb-6 text-sm text-gray-600"
          >
            {listing.description}
          </p>
        )}

        {lister && (
          <Link
            id="listing-detail-lister-link"
            data-object-id="listing-detail-lister-link"
            href={`/profile/${lister.id}`}
            className="mb-6 flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 hover:bg-gray-50"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-xs text-gray-500">
              👤
            </div>
            <div className="flex-1">
              <p
                id="listing-detail-lister-name"
                className="text-sm font-medium text-gray-900"
              >
                {lister.display_name ?? "Unknown"}
              </p>
            </div>
            <span className="text-gray-400">→</span>
          </Link>
        )}

        {user?.id === listing.owner_id ? (
          <p
            id="listing-detail-own-listing-hint"
            data-object-id="listing-detail-own-listing-hint"
            className="text-center text-sm text-gray-400"
          >
            This is your listing
          </p>
        ) : listing.status === "live" ? (
          <Link
            id="listing-detail-request-btn"
            data-object-id="listing-detail-request-btn"
            href={
              listing.listing_type === "sale"
                ? `/listings/${listing.id}/buy`
                : `/listings/${listing.id}/offer`
            }
            className="block w-full rounded-lg bg-bookswap-600 py-3 text-center font-semibold text-white transition-colors hover:bg-bookswap-700"
          >
            {listing.listing_type === "sale"
              ? `Buy this book — $${listing.price}`
              : "Request this book"}
          </Link>
        ) : (
          <p className="text-center text-sm text-gray-400">
            No longer available
          </p>
        )}
      </div>
    </main>
  );
}
