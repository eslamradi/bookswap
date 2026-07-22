import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { RatingForm } from "@/components/trades/rating-form";
import { AppHeader } from "@/components/layout/app-header";

export default async function RatingPage({
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
    redirect(`/sign-in?next=${encodeURIComponent(`/trades/${id}/rating`)}`);
  }

  const { data: trade } = await supabase
    .from("trades")
    .select("id, requester_id, owner_id, status")
    .eq("id", id)
    .single();

  if (!trade) {
    notFound();
  }

  const counterpartId =
    trade.owner_id === user.id ? trade.requester_id : trade.owner_id;

  const { data: counterpart } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", counterpartId)
    .single();

  const { data: existingRating } = await supabase
    .from("ratings")
    .select("id")
    .eq("trade_id", id)
    .eq("rater_id", user.id)
    .maybeSingle();

  return (
    <main className="min-h-screen bg-gray-50">
      <AppHeader />

      <div className="mx-auto max-w-lg px-4 py-6">
        <div id="rating-trade-complete" data-object-id="rating-trade-complete" className="mb-6 text-center">
          <p className="text-xl font-bold text-gray-900">Trade complete!</p>
        </div>

        <RatingForm
          tradeId={trade.id}
          raterId={user.id}
          rateeId={counterpartId}
          rateeName={counterpart?.display_name ?? "them"}
          alreadyRated={!!existingRating}
          needsCompletion={trade.status !== "completed"}
        />
      </div>
    </main>
  );
}
