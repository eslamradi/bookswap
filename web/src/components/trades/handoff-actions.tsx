"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type ExchangeMethod = "meetup" | "self_arranged" | null;

export function HandoffActions({
  tradeId,
  exchangeMethod: initialMethod,
  isRequester,
  confirmedByRequester,
  confirmedByOwner,
}: {
  tradeId: string;
  exchangeMethod: ExchangeMethod;
  isRequester: boolean;
  confirmedByRequester: boolean;
  confirmedByOwner: boolean;
}) {
  const [method, setMethod] = useState<ExchangeMethod>(initialMethod);
  const [confirmedMine, setConfirmedMine] = useState(
    isRequester ? confirmedByRequester : confirmedByOwner,
  );
  // Not live-updated if the other party confirms while this page is open —
  // a refresh picks up the latest state. No realtime subscription this pass.
  const [confirmedTheirs] = useState(
    isRequester ? confirmedByOwner : confirmedByRequester,
  );
  const [busy, setBusy] = useState(false);

  async function chooseMethod(chosen: "meetup" | "self_arranged") {
    setBusy(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("trades")
      .update({ exchange_method: chosen })
      .eq("id", tradeId);

    setBusy(false);
    if (!error) setMethod(chosen);
  }

  async function confirmExchanged() {
    setBusy(true);
    const supabase = createClient();
    const field = isRequester
      ? "handoff_confirmed_by_requester"
      : "handoff_confirmed_by_owner";
    const { error } = await supabase
      .from("trades")
      .update({ [field]: true })
      .eq("id", tradeId);

    setBusy(false);
    if (!error) setConfirmedMine(true);
  }

  if (!method) {
    return (
      <div id="handoff-method-choice" data-object-id="handoff-method-choice">
        <p className="mb-4 text-sm text-gray-600">
          How will you exchange the book?
        </p>
        <div className="space-y-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => chooseMethod("meetup")}
            className="w-full rounded-lg border border-gray-200 bg-white p-4 text-left transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            <p className="font-medium text-gray-900">Meet in a public place</p>
            <p className="text-sm text-gray-500">
              Suggest a spot and time in your messages — no address needed.
            </p>
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => chooseMethod("self_arranged")}
            className="w-full rounded-lg border border-gray-200 bg-white p-4 text-left transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            <p className="font-medium text-gray-900">
              Arrange mailing yourselves
            </p>
            <p className="text-sm text-gray-500">
              bookswap doesn&apos;t handle shipping — coordinate directly in
              your messages.
            </p>
          </button>
        </div>
      </div>
    );
  }

  const bothConfirmed = confirmedMine && confirmedTheirs;

  return (
    <div id="handoff-guidance" data-object-id="handoff-guidance">
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
        {method === "meetup" ? (
          <>
            <p className="mb-1 font-medium text-gray-900">
              Meeting in a public place
            </p>
            <p className="text-sm text-gray-600">
              Use the message thread to agree on where and when. No address
              needed on either side.
            </p>
          </>
        ) : (
          <>
            <p className="mb-1 font-medium text-gray-900">
              Arranging mailing yourselves
            </p>
            <p className="text-sm text-gray-600">
              bookswap doesn&apos;t handle shipping. If you need to share an
              address, do it directly in your messages — entirely your
              choice.
            </p>
          </>
        )}
      </div>

      {!bothConfirmed && (
        <button
          id="handoff-confirm-btn"
          data-object-id="handoff-confirm-btn"
          type="button"
          disabled={busy || confirmedMine}
          onClick={confirmExchanged}
          className="w-full rounded-lg bg-bookswap-600 py-3 font-semibold text-white transition-colors hover:bg-bookswap-700 disabled:opacity-50"
        >
          {confirmedMine ? "Waiting on the other person…" : "Mark as exchanged"}
        </button>
      )}

      {bothConfirmed && (
        <Link
          id="handoff-continue-btn"
          data-object-id="handoff-continue-btn"
          href={`/trades/${tradeId}/rating`}
          className="block w-full rounded-lg bg-bookswap-600 py-3 text-center font-semibold text-white transition-colors hover:bg-bookswap-700"
        >
          Both confirmed — continue to Rating →
        </Link>
      )}
    </div>
  );
}
