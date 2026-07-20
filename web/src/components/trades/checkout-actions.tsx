"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function CheckoutActions({
  tradeId,
  offerType,
  alreadyConfirmed,
}: {
  tradeId: string;
  offerType: string;
  alreadyConfirmed: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  // Already confirmed on a previous visit — skip straight ahead.
  useEffect(() => {
    if (alreadyConfirmed) {
      router.replace(`/trades/${tradeId}/handoff`);
    }
  }, [alreadyConfirmed, router, tradeId]);

  async function handleConfirm() {
    setBusy(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("trades")
      .update({ payment_confirmed: true })
      .eq("id", tradeId);

    setBusy(false);
    if (!error) {
      router.push(`/trades/${tradeId}/handoff`);
    }
  }

  if (alreadyConfirmed) {
    return null;
  }

  return (
    <button
      id="checkout-confirm-btn"
      data-object-id="checkout-confirm-btn"
      type="button"
      disabled={busy}
      onClick={handleConfirm}
      className="w-full rounded-lg bg-bookswap-600 py-3 font-semibold text-white transition-colors hover:bg-bookswap-700 disabled:opacity-50"
    >
      {busy ? "…" : offerType === "sale" ? "Pay now" : "Continue"}
    </button>
  );
}
