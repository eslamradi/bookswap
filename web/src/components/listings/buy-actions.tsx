"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function BuyActions({
  listingId,
  ownerId,
  price,
  userId,
}: {
  listingId: string;
  ownerId: string;
  price: number;
  userId: string;
}) {
  const router = useRouter();
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  async function handleBuy() {
    setSendError(null);
    setSending(true);
    const supabase = createClient();

    const { data: trade, error } = await supabase
      .from("trades")
      .insert({
        listing_id: listingId,
        requester_id: userId,
        owner_id: ownerId,
        offer_type: "sale",
        price,
      })
      .select("id")
      .single();

    if (error || !trade) {
      setSendError("Something went wrong sending your request — try again.");
      setSending(false);
      return;
    }

    router.push(`/trades/${trade.id}`);
  }

  return (
    <div>
      <p className="mb-4 text-sm text-gray-600">
        bookswap doesn&apos;t process payment — you&apos;ll arrange that
        directly with the seller (cash, Venmo, etc.) once your request is
        accepted.
      </p>

      {sendError && (
        <p className="mb-2 text-sm text-red-600">{sendError}</p>
      )}

      <button
        id="buy-confirm-btn"
        data-object-id="buy-confirm-btn"
        type="button"
        disabled={sending}
        onClick={handleBuy}
        className="w-full rounded-lg bg-bookswap-600 py-3 font-semibold text-white transition-colors hover:bg-bookswap-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {sending ? "Sending…" : `Buy for $${price}`}
      </button>
    </div>
  );
}
