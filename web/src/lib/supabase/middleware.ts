import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Refreshes the Supabase session on every request. Session cookies can go
// stale without this, since server.ts's client can only set cookies inside
// Server Actions/Route Handlers — not from Server Components.
export async function updateSession(request: NextRequest) {
  const response = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // createServerClient throws synchronously (not just on the eventual
  // network call) if either value is missing or empty — must not let that
  // 500 every request before a real Supabase project is wired up.
  if (!supabaseUrl || !supabaseAnonKey) {
    return response;
  }

  let mutableResponse = response;
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        mutableResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          mutableResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  try {
    await supabase.auth.getUser();
  } catch {
    // Supabase URL configured but unreachable/invalid — proceed
    // unauthenticated rather than 500 the whole app.
  }

  return mutableResponse;
}
