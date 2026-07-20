import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CheckoutActions } from "@/components/trades/checkout-actions";

export default async function CheckoutPage({
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
    redirect(`/sign-in?next=${encodeURIComponent(`/trades/${id}/checkout`)}`);
  }

  const { data: trade } = await supabase
    .from("trades")
    .select("id, offer_type, price, payment_confirmed, requester_id, owner_id")
    .eq("id", id)
    .single();

  if (!trade) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-4 py-3 text-sm text-gray-500">
        bookswap
      </header>

      <div className="mx-auto max-w-lg px-4 py-6">
        <div
          id="checkout-summary"
          data-object-id="checkout-summary"
          className="mb-6 rounded-lg border border-gray-200 bg-white p-4"
        >
          <p id="checkout-summary-text" className="text-gray-900">
            {trade.offer_type === "sale"
              ? `Book: $${trade.price ?? "TBD"}`
              : "No payment due — this is a straight exchange"}
          </p>
        </div>

        <CheckoutActions
          tradeId={trade.id}
          offerType={trade.offer_type}
          alreadyConfirmed={trade.payment_confirmed}
        />
      </div>
    </main>
  );
}
