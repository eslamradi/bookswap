import { createServiceClient } from "@/lib/supabase/service";
import { sendMatchEmail } from "@/lib/notifications/send-match-email";

// Checks a single newly-live listing against every saved alert and emails
// anyone whose query matches. The alert_notifications unique constraint
// makes this idempotent — calling it more than once for the same listing
// (or the same alert matching again) never sends a duplicate email.
export async function checkAlertsForListing(listingId: string) {
  const supabase = createServiceClient();

  const { data: listing } = await supabase
    .from("listings")
    .select("id, title, author, status")
    .eq("id", listingId)
    .single();

  if (!listing || listing.status !== "live") return;

  const { data: alerts } = await supabase
    .from("alerts")
    .select("id, user_id, query");

  const title = listing.title.toLowerCase();
  const author = listing.author.toLowerCase();

  const matches = (alerts ?? []).filter((alert) => {
    const query = alert.query.trim().toLowerCase();
    return query.length > 0 && (title.includes(query) || author.includes(query));
  });

  for (const alert of matches) {
    const { error: insertError } = await supabase
      .from("alert_notifications")
      .insert({ alert_id: alert.id, listing_id: listing.id });

    if (insertError) {
      // 23505 = unique-constraint violation, meaning this alert was already
      // notified about this listing — expected dedupe path, skip silently.
      if (insertError.code !== "23505") {
        console.error("Failed to record alert notification:", insertError);
      }
      continue;
    }

    const { data: userResult } = await supabase.auth.admin.getUserById(
      alert.user_id,
    );
    const email = userResult?.user?.email;
    if (!email) continue;

    await sendMatchEmail({
      to: email,
      title: listing.title,
      author: listing.author,
      listingId: listing.id,
    });
  }
}
