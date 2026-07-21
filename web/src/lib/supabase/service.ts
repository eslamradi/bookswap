import { createClient } from "@supabase/supabase-js";

// Service-role client: bypasses RLS entirely. Server-only — never import
// this from a "use client" component or leak SUPABASE_SERVICE_ROLE_KEY to
// the browser. Used for background jobs that must act across users (e.g.
// notifying an alert's owner about someone else's new listing).
export function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
