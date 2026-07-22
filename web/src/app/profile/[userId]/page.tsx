import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppHeader } from "@/components/layout/app-header";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, display_name, created_at")
    .eq("id", userId)
    .single();

  if (!profile) {
    notFound();
  }

  const memberSince = new Date(profile.created_at).toLocaleDateString(
    "en-US",
    { year: "numeric", month: "long" },
  );

  const { data: ratings } = await supabase
    .from("ratings")
    .select("id, rating, comment")
    .eq("ratee_id", userId)
    .order("created_at", { ascending: false });

  const reviews = ratings ?? [];
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : null;

  return (
    <main className="min-h-screen bg-gray-50">
      <AppHeader />

      <div className="mx-auto max-w-lg px-4 py-6">
        <div
          id="profile-trust-summary"
          data-object-id="profile-trust-summary"
          className="mb-6 flex items-center gap-3"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-200 text-lg text-gray-500">
            👤
          </div>
          <div>
            <p id="profile-name" className="font-semibold text-gray-900">
              {profile.display_name ?? "Unknown"}
            </p>
            <p id="profile-rating" className="text-xs text-gray-500">
              {averageRating
                ? `★ ${averageRating} (${reviews.length})`
                : "New member"}
            </p>
            <p id="profile-member-since" className="text-xs text-gray-400">
              Member since {memberSince}
            </p>
          </div>
        </div>

        <div
          id="profile-reviews"
          data-object-id="profile-reviews"
          className="mb-6 space-y-2"
        >
          {reviews.length > 0 ? (
            reviews.map((r) => (
              <div
                key={r.id}
                className="rounded-lg border border-gray-200 bg-white p-3 text-sm"
              >
                <span className="text-yellow-500">
                  {"★".repeat(r.rating)}
                </span>
                {r.comment && (
                  <span className="ml-1 text-gray-600">
                    &quot;{r.comment}&quot;
                  </span>
                )}
              </div>
            ))
          ) : (
            // Honest cold-start state — this user genuinely has zero
            // completed trades yet, not a placeholder.
            <p
              id="profile-new-member-hint"
              data-object-id="profile-new-member-hint"
              className="py-4 text-center text-sm text-gray-400"
            >
              New member — no trade history yet.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
