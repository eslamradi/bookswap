import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function NotificationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in?next=/notifications");
  }

  const { data: alerts } = await supabase
    .from("alerts")
    .select("id, query, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const items = alerts ?? [];

  const { data: matches } =
    items.length > 0
      ? await supabase
          .from("alert_notifications")
          .select("id, alert_id, created_at, listings(id, title, author)")
          .in(
            "alert_id",
            items.map((alert) => alert.id),
          )
          .order("created_at", { ascending: false })
      : { data: [] };

  const matchesByAlert = new Map<string, typeof matches>();
  for (const match of matches ?? []) {
    const existing = matchesByAlert.get(match.alert_id) ?? [];
    existing.push(match);
    matchesByAlert.set(match.alert_id, existing);
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-4 py-3">
        <Link href="/" className="text-sm text-gray-500">
          ← bookswap
        </Link>
      </header>

      <div className="mx-auto max-w-lg px-4 py-6">
        {items.length > 0 ? (
          <div
            id="notifications-confirmation"
            data-object-id="notifications-confirmation"
            className="mb-6 text-center"
          >
            <p className="text-xl font-bold text-gray-900">
              ✓ We&apos;ll email you
            </p>
          </div>
        ) : (
          <p className="mb-6 text-center text-sm text-gray-400">
            No active alerts yet — search for a title and tap &quot;Notify
            me&quot; if it&apos;s not available.
          </p>
        )}

        <div className="space-y-2">
          {items.map((alert) => (
            <div
              key={alert.id}
              id={`notifications-alert-${alert.id}`}
              data-object-id={`notifications-alert-${alert.id}`}
              className="rounded-lg border border-gray-200 bg-white p-3"
            >
              <p
                id="notifications-watched-title"
                data-object-id="notifications-watched-title"
                className="font-medium text-gray-900"
              >
                &quot;{alert.query}&quot;
              </p>
              <p className="mb-2 text-xs text-gray-500">Notify via: Email</p>

              {(matchesByAlert.get(alert.id) ?? []).length > 0 ? (
                <div className="space-y-1 border-t border-gray-100 pt-2">
                  {(matchesByAlert.get(alert.id) ?? []).map((match) => {
                    const listing = Array.isArray(match.listings)
                      ? match.listings[0]
                      : match.listings;
                    if (!listing) return null;
                    return (
                      <Link
                        key={match.id}
                        href={`/listings/${listing.id}`}
                        className="block text-sm text-bookswap-600 hover:underline"
                      >
                        Found: {listing.title} by {listing.author} →
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-gray-400">
                  No matches yet — we&apos;ll email you the moment one shows
                  up.
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
