import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { OfferForm } from "@/components/listings/offer-form";
import { AppHeader } from "@/components/layout/app-header";

export default async function OfferPage({
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
    redirect(`/sign-in?next=${encodeURIComponent(`/listings/${id}/offer`)}`);
  }

  const { data: targetListing } = await supabase
    .from("listings")
    .select("id, title, author, owner_id")
    .eq("id", id)
    .single();

  if (!targetListing) {
    notFound();
  }

  if (targetListing.owner_id === user.id) {
    redirect(`/listings/${id}`);
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <AppHeader />

      <div className="mx-auto max-w-lg px-4 py-6">
        <div
          id="create-listing-context"
          data-object-id="create-listing-context"
          className="mb-6 rounded-lg border border-gray-200 bg-white p-3"
        >
          <p className="text-xs text-gray-500">Offering in trade for:</p>
          <p
            id="create-listing-target-title"
            className="font-medium text-gray-900"
          >
            {targetListing.title} by {targetListing.author}
          </p>
        </div>

        <OfferForm
          targetListingId={targetListing.id}
          targetOwnerId={targetListing.owner_id}
          userId={user.id}
        />
      </div>
    </main>
  );
}
