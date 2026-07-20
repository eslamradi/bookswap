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
      "id, requester_id, owner_id, exchange_method, handoff_confirmed_by_requester, handoff_confirmed_by_owner",
    )
    .eq("id", id)
    .single();

  if (!trade) {
    notFound();
  }

  const isRequester = trade.requester_id === user.id;

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-4 py-3 text-sm text-gray-500">
        bookswap
      </header>

      <div className="mx-auto max-w-lg px-4 py-6">
        <HandoffActions
          tradeId={trade.id}
          exchangeMethod={trade.exchange_method}
          isRequester={isRequester}
          confirmedByRequester={trade.handoff_confirmed_by_requester}
          confirmedByOwner={trade.handoff_confirmed_by_owner}
        />
      </div>
    </main>
  );
}
