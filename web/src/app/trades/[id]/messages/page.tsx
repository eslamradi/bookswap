import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MessageThread } from "@/components/trades/message-thread";

export default async function TradeMessagesPage({
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
    redirect(`/sign-in?next=${encodeURIComponent(`/trades/${id}/messages`)}`);
  }

  const { data: trade } = await supabase
    .from("trades")
    .select("id, requester_id, owner_id")
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

  const { data: messages } = await supabase
    .from("messages")
    .select("id, sender_id, body, created_at")
    .eq("trade_id", id)
    .order("created_at", { ascending: true });

  return (
    <main className="flex min-h-screen flex-col bg-gray-50">
      <header className="flex items-center gap-2 border-b border-gray-200 bg-white px-4 py-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs">
          👤
        </div>
        <span className="text-sm font-medium text-gray-900">
          {counterpart?.display_name ?? "Unknown"}
        </span>
      </header>

      <MessageThread
        tradeId={id}
        currentUserId={user.id}
        initialMessages={messages ?? []}
      />
    </main>
  );
}
