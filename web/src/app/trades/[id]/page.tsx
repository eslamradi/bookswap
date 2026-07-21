import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TradeActions } from "@/components/trades/trade-actions";

export default async function TradePage({
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
    redirect(`/sign-in?next=${encodeURIComponent(`/trades/${id}`)}`);
  }

  const { data: trade } = await supabase
    .from("trades")
    .select(
      "id, listing_id, offered_listing_id, requester_id, owner_id, offer_type, price, status",
    )
    .eq("id", id)
    .single();

  // Either genuinely doesn't exist, or RLS hid it because this user isn't a
  // participant — both cases should look the same to the visitor.
  if (!trade) {
    notFound();
  }

  const isOwner = trade.owner_id === user.id;
  const counterpartId = isOwner ? trade.requester_id : trade.owner_id;

  const [{ data: listing }, { data: counterpart }] = await Promise.all([
    supabase
      .from("listings")
      .select("title, author")
      .eq("id", trade.listing_id)
      .single(),
    supabase
      .from("profiles")
      .select("id, display_name")
      .eq("id", counterpartId)
      .single(),
  ]);

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-4 py-3 text-sm text-gray-500">
        bookswap
      </header>

      <div className="mx-auto max-w-lg px-4 py-6">
        <div
          id="offer-trade-summary"
          data-object-id="offer-trade-summary"
          className="mb-4 rounded-lg border border-gray-200 bg-white p-4"
        >
          <p className="mb-1 text-xs text-gray-500">
            {isOwner ? "Your book:" : "Requested book:"}
          </p>
          <p id="offer-book-title" className="mb-3 font-semibold text-gray-900">
            {listing?.title} by {listing?.author}
          </p>
          <p className="mb-1 text-xs text-gray-500">
            {isOwner ? "Claimed by:" : "Owner:"}
          </p>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs">
              👤
            </div>
            <p id="offer-counterpart-name" className="text-sm font-medium text-gray-900">
              {counterpart?.display_name ?? "Unknown"}
            </p>
          </div>
        </div>

        <div
          id="offer-terms"
          data-object-id="offer-terms"
          className="mb-6 rounded-lg border border-gray-200 bg-white p-4"
        >
          <p className="mb-1 text-xs text-gray-500">Offer:</p>
          <p id="offer-terms-text" className="text-sm font-medium text-gray-900">
            {trade.offer_type === "sale"
              ? `For sale — $${trade.price}`
              : trade.offer_type === "claim"
                ? "Straight claim (no payment)"
                : "Book-for-book exchange"}
          </p>
        </div>

        <TradeActions
          tradeId={trade.id}
          listingId={trade.listing_id}
          status={trade.status}
          isOwner={isOwner}
        />

        {trade.status === "accepted" && (
          <Link
            href={`/trades/${trade.id}/messages`}
            className="mt-4 block w-full rounded-lg bg-bookswap-600 py-3 text-center font-semibold text-white transition-colors hover:bg-bookswap-700"
          >
            Continue to Messaging →
          </Link>
        )}
      </div>
    </main>
  );
}
