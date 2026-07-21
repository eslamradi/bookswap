import type { SupabaseClient } from "@supabase/supabase-js";

// supabase-js only pushes the user's JWT to the Realtime socket on
// SIGNED_IN/TOKEN_REFRESHED auth events — restoring an existing session on
// page load fires INITIAL_SESSION instead, which it does NOT react to.
// Separately, the socket's own connect-time auth fetch is async and races
// with an immediate .channel().subscribe() call. Either gap means a channel
// can join before the JWT is attached, and RLS then silently filters out
// every event for that connection's lifetime (verified directly against a
// live browser session — see docs/dev-notes/live-updates.md). Awaiting this
// before subscribing closes both gaps.
export async function ensureRealtimeAuth(supabase: SupabaseClient) {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (session) {
    await supabase.realtime.setAuth(session.access_token);
  }
}
