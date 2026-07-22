import Link from "next/link";
import { SearchBar } from "@/components/search/search-bar";
import { createClient } from "@/lib/supabase/server";

// Public search home — no auth required. Every documented entry point for
// Priya (Scenario 02) is a search-engine result landing directly here.
export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <div id="home-container" data-object-id="home-container" className="w-full max-w-md text-center">
        <div className="mb-8 text-lg font-semibold text-gray-900">
          bookswap
        </div>

        <SearchBar />

        <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-gray-500">
          <Link href="/browse" className="hover:text-gray-700">
            Browse books →
          </Link>
          <Link href="/listings/new" className="hover:text-gray-700">
            Sell your books →
          </Link>
          <Link
            href={user ? "/account" : "/sign-in"}
            className="hover:text-gray-700"
          >
            {user ? "Account →" : "Sign in →"}
          </Link>
        </div>
      </div>
    </main>
  );
}
