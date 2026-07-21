import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { HandoffActions } from "@/components/trades/handoff-actions";

export default async function HandoffPage({
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
    redirect(`/sign-in?next=${encodeURIComponent(`/trades/${id}/handoff`)}`);
  }

  const { data: trade } = await supabase
    .from("trades")
    .select(
      "id, requester_id, owner_id, exchange_method, offer_type, price, handoff_confirmed_by_requester, handoff_confirmed_by_owner",
    )
    .eq("id", id)
    .single();

  if (!trade) {
    notFound();
  }

  const isRequester = trade.requester_id === user.id;

  const { data: profile } = await supabase
    .from("profiles")
    .select("preferred_exchange_method")
    .eq("id", user.id)
    .single();

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-4 py-3 text-sm text-gray-500">
        bookswap
      </header>

      <div className="mx-auto max-w-lg px-4 py-6">
        <HandoffActions
          tradeId={trade.id}
          exchangeMethod={trade.exchange_method}
          preferredMethod={profile?.preferred_exchange_method ?? null}
          isRequester={isRequester}
          confirmedByRequester={trade.handoff_confirmed_by_requester}
          confirmedByOwner={trade.handoff_confirmed_by_owner}
          price={trade.offer_type === "sale" ? trade.price : null}
        />
      </div>
    </main>
  );
}
