"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Message = {
  id: string;
  sender_id: string;
  body: string;
  created_at: string;
};

export function MessageThread({
  tradeId,
  currentUserId,
  initialMessages,
}: {
  tradeId: string;
  currentUserId: string;
  initialMessages: Message[];
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;

    setSending(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("messages")
      .insert({ trade_id: tradeId, sender_id: currentUserId, body: trimmed })
      .select("id, sender_id, body, created_at")
      .single();

    if (!error && data) {
      setMessages((prev) => [...prev, data]);
      setText("");
    }
    setSending(false);
  }

  return (
    <>
      <div
        id="messaging-thread"
        data-object-id="messaging-thread"
        className="mx-auto w-full max-w-lg flex-1 space-y-2 overflow-y-auto px-4 py-4"
      >
        {messages.length === 0 && (
          <p id="messaging-empty-hint" className="py-6 text-center text-sm text-gray-400">
            Say hi and confirm shipping details
          </p>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.sender_id === currentUserId ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                m.sender_id === currentUserId
                  ? "bg-bookswap-600 text-white"
                  : "border border-gray-200 bg-white text-gray-900"
              }`}
            >
              {m.body}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 bg-white p-3">
        <form onSubmit={handleSend} className="mx-auto flex max-w-lg gap-2">
          <input
            id="messaging-input"
            data-object-id="messaging-input"
            type="text"
            value={text}
            disabled={sending}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-bookswap-500 disabled:opacity-50"
          />
          <button
            id="messaging-send-btn"
            data-object-id="messaging-send-btn"
            type="submit"
            disabled={sending}
            className="rounded-lg bg-bookswap-600 px-4 py-2 text-white disabled:opacity-50"
          >
            Send
          </button>
        </form>
        <Link
          id="messaging-continue-btn"
          data-object-id="messaging-continue-btn"
          href={`/trades/${tradeId}/handoff`}
          className="mt-3 block w-full text-center text-sm font-medium text-bookswap-600 hover:text-bookswap-700"
        >
          Continue to Handoff →
        </Link>
      </div>
    </>
  );
}
