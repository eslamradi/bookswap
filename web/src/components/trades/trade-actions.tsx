"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Status = "pending" | "accepted" | "declined" | "completed";

export function TradeActions({
  tradeId,
  listingId,
  status,
  isOwner,
}: {
  tradeId: string;
  listingId: string;
  status: Status;
  isOwner: boolean;
}) {
  const router = useRouter();
  const [current, setCurrent] = useState(status);
  const [busy, setBusy] = useState(false);

  async function respond(newStatus: "accepted" | "declined") {
    setBusy(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("trades")
      .update({ status: newStatus })
      .eq("id", tradeId);

    if (!error && newStatus === "accepted") {
      // The listing is no longer available once a trade is accepted — this
      // is what actually removes it from Browse/Search and disables
      // "Request this book" for everyone else (both already filter/check on
      // listings.status, not on trade state, which is why this was missing
      // before: accepting a trade never touched the listing itself).
      await supabase
        .from("listings")
        .update({ status: "claimed" })
        .eq("id", listingId);

      // Any other pending offers on the same listing are now moot — the
      // book is going to someone else. Auto-decline them rather than
      // leaving them stuck showing "waiting for the owner to respond".
      await supabase
        .from("trades")
        .update({ status: "declined" })
        .eq("listing_id", listingId)
        .eq("status", "pending")
        .neq("id", tradeId);
    }

    if (!error) {
      setCurrent(newStatus);
      router.refresh();
    }
    setBusy(false);
  }

  if (!isOwner) {
    return (
      <p className="text-center text-sm text-gray-500">
        {current === "pending" && "Waiting for the owner to respond…"}
        {current === "accepted" && "Trade accepted!"}
        {current === "declined" && "This trade was declined."}
        {current === "completed" && "Trade completed."}
      </p>
    );
  }

  if (current !== "pending") {
    return (
      <p className="text-center text-sm text-gray-500">
        {current === "accepted" && "You accepted this trade."}
        {current === "declined" && "You declined this trade."}
        {current === "completed" && "Trade completed."}
      </p>
    );
  }

  return (
    <div id="offer-actions" data-object-id="offer-actions" className="space-y-2">
      <button
        id="offer-accept-btn"
        data-object-id="offer-accept-btn"
        type="button"
        disabled={busy}
        onClick={() => respond("accepted")}
        className="w-full rounded-lg bg-bookswap-600 py-3 font-semibold text-white transition-colors hover:bg-bookswap-700 disabled:opacity-50"
      >
        Accept trade
      </button>
      <button
        id="offer-decline-btn"
        data-object-id="offer-decline-btn"
        type="button"
        disabled={busy}
        onClick={() => respond("declined")}
        className="w-full rounded-lg border border-gray-300 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
      >
        Decline
      </button>
    </div>
  );
}
