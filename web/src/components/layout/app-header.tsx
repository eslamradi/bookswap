import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

// One consistent header for every page except `/` and `/sign-in`, which
// have their own centered, self-contained treatment. Previously each page
// built its own ad-hoc header — some linked the wordmark, some didn't, and
// /listings/new had no header at all, no way back except the browser's
// back button.
export async function AppHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="border-b border-gray-200 bg-white px-4 py-3">
      <div className="mx-auto flex max-w-3xl items-center justify-between">
        <Link
          href="/"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          ← bookswap
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/browse" className="text-gray-500 hover:text-gray-900">
            Browse
          </Link>
          {user && (
            <Link
              href="/notifications"
              className="text-gray-500 hover:text-gray-900"
            >
              Alerts
            </Link>
          )}
          <Link
            href={user ? "/account" : "/sign-in"}
            className="font-medium text-bookswap-600 hover:text-bookswap-700"
          >
            {user ? "Account" : "Sign in"}
          </Link>
        </nav>
      </div>
    </header>
  );
}
