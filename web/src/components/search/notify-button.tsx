"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function NotifyButton({ query }: { query: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    const supabase = createClient();

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push(
          `/sign-in?next=${encodeURIComponent(`/search?q=${query}`)}`,
        );
        return;
      }

      const { error } = await supabase
        .from("alerts")
        .insert({ user_id: user.id, query });
      if (error) throw error;

      router.push("/notifications");
    } catch {
      setLoading(false);
    }
  }

  return (
    <button
      id="search-results-notify-btn"
      data-object-id="search-results-notify-btn"
      type="button"
      disabled={loading}
      onClick={handleClick}
      className="rounded-lg bg-bookswap-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-bookswap-700 disabled:opacity-50"
    >
      {loading ? "Setting up alert…" : "Notify me when available"}
    </button>
  );
}
