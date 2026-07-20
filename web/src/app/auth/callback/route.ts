import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { DEFAULT_REDIRECT_PATH } from "@/lib/auth/constants";

// Reached after Supabase has already completed the OAuth/magic-link
// exchange with the provider. Exchanges the auth code for a session, or
// surfaces the provider's own error back to the sign-in page — OAuth
// failures happen after a full round trip away from the app, so the
// original page's in-memory error state is long gone by the time we get
// back here.
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? DEFAULT_REDIRECT_PATH;
  const oauthError =
    url.searchParams.get("error_description") ?? url.searchParams.get("error");

  if (oauthError) {
    return NextResponse.redirect(
      new URL(`/?auth_error=${encodeURIComponent(oauthError)}`, url.origin),
    );
  }

  if (code) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return NextResponse.redirect(new URL(next, url.origin));
      }
    } catch {
      // Supabase not configured (missing/invalid env vars) — fall through
      // to the auth_failed redirect below instead of a 500.
    }
  }

  return NextResponse.redirect(
    new URL("/?auth_error=auth_failed", url.origin),
  );
}
