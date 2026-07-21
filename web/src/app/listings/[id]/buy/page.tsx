import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BuyActions } from "@/components/listings/buy-actions";

export default async function BuyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/sign-in?next=${encodeURIComponent(`/listings/${id}/buy`)}`);
  }

  const { data: listing } = await supabase
    .from("listings")
    .select("id, title, author, owner_id, listing_type, price, status")
    .eq("id", id)
    .single();

  if (!listing) {
    notFound();
  }

  if (listing.owner_id === user.id) {
    redirect(`/listings/${id}`);
  }

  // Not a sale listing, or no longer available — this page doesn't apply.
  if (listing.listing_type !== "sale" || listing.status !== "live") {
    redirect(`/listings/${id}`);
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-4 py-3 text-sm text-gray-500">
        bookswap
      </header>

      <div className="mx-auto max-w-lg px-4 py-6">
        <div
          id="buy-context"
          data-object-id="buy-context"
          className="mb-6 rounded-lg border border-gray-200 bg-white p-4"
        >
          <p className="mb-1 text-xs text-gray-500">Buying:</p>
          <p id="buy-target-title" className="font-medium text-gray-900">
            {listing.title} by {listing.author}
          </p>
          <p className="mt-2 text-2xl font-bold text-bookswap-600">
            ${listing.price}
          </p>
        </div>

        <BuyActions
          listingId={listing.id}
          ownerId={listing.owner_id}
          price={listing.price!}
          userId={user.id}
        />
      </div>
    </main>
  );
}
