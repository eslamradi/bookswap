"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { ensureRealtimeAuth } from "@/lib/supabase/realtime-auth";

type ExchangeMethod = "meetup" | "self_arranged" | null;

export function HandoffActions({
  tradeId,
  exchangeMethod: initialMethod,
  preferredMethod,
  isRequester,
  confirmedByRequester,
  confirmedByOwner,
  price,
}: {
  tradeId: string;
  exchangeMethod: ExchangeMethod;
  preferredMethod: ExchangeMethod;
  isRequester: boolean;
  confirmedByRequester: boolean;
  confirmedByOwner: boolean;
  price: number | null;
}) {
  // No trade-level method set yet, but this viewer has a saved preference —
  // apply it immediately rather than making them choose again. Still
  // changeable via "Not this time?" below.
  const appliedFromPreference = !initialMethod && !!preferredMethod;
  const [method, setMethod] = useState<ExchangeMethod>(
    initialMethod ?? preferredMethod,
  );
  const [showPreferenceHint, setShowPreferenceHint] = useState(
    appliedFromPreference,
  );
  const [confirmedMine, setConfirmedMine] = useState(
    isRequester ? confirmedByRequester : confirmedByOwner,
  );
  const [confirmedTheirs, setConfirmedTheirs] = useState(
    isRequester ? confirmedByOwner : confirmedByRequester,
  );
  const [busy, setBusy] = useState(false);

  // Live updates for the other participant's actions — picking a method or
  // confirming the handoff — without needing a manual refresh. Setting
  // state inside the subscription callback (not synchronously in the
  // effect body) isn't the pattern react-hooks/set-state-in-effect warns
  // about.
  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();
    let channel: ReturnType<typeof supabase.channel> | null = null;

    ensureRealtimeAuth(supabase).then(() => {
      if (cancelled) return;
      channel = supabase
        .channel(`trade-${tradeId}`)
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "trades",
            filter: `id=eq.${tradeId}`,
          },
          (payload) => {
            const updated = payload.new as {
              exchange_method: ExchangeMethod;
              handoff_confirmed_by_requester: boolean;
              handoff_confirmed_by_owner: boolean;
            };
            setMethod((prev) => prev ?? updated.exchange_method);
            setConfirmedTheirs(
              isRequester
                ? updated.handoff_confirmed_by_owner
                : updated.handoff_confirmed_by_requester,
            );
          },
        )
        .subscribe();
    });

    return () => {
      cancelled = true;
      if (channel) supabase.removeChannel(channel);
    };
  }, [tradeId, isRequester]);

  // Persist the auto-applied preference to the trade so it sticks (and the
  // other participant sees it too) — a one-time sync on mount, not a loop.
  useEffect(() => {
    if (!appliedFromPreference) return;
    const supabase = createClient();
    supabase
      .from("trades")
      .update({ exchange_method: preferredMethod })
      .eq("id", tradeId)
      .then();
    // Only ever runs once per mount when this condition is true at load —
    // appliedFromPreference is derived from props that don't change after
    // mount, so this can't loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function chooseMethod(chosen: "meetup" | "self_arranged") {
    setBusy(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("trades")
      .update({ exchange_method: chosen })
      .eq("id", tradeId);

    setBusy(false);
    if (!error) {
      setMethod(chosen);
      setShowPreferenceHint(false);
    }
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

  const paymentReminder = price != null && (
    <p
      id="handoff-payment-reminder"
      data-object-id="handoff-payment-reminder"
      className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800"
    >
      This is a sale — bring cash, or send ${price} via Venmo/PayPal before
      you meet. bookswap doesn&apos;t process payment.
    </p>
  );

  if (!method) {
    return (
      <div id="handoff-method-choice" data-object-id="handoff-method-choice">
        {paymentReminder}
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
      {paymentReminder}
      {showPreferenceHint && (
        <p
          id="handoff-preference-applied-hint"
          data-object-id="handoff-preference-applied-hint"
          className="mb-3 text-center text-xs text-gray-400"
        >
          Using your saved preference —{" "}
          <button
            type="button"
            onClick={() => setMethod(null)}
            className="underline hover:text-gray-600"
          >
            not this time?
          </button>
        </p>
      )}

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
