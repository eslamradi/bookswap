import { NextResponse, type NextRequest } from "next/server";
import { checkAlertsForListing } from "@/lib/notifications/check-alerts";

// Called right after a listing is inserted (client-side), so that anyone
// with a matching "notify me" alert gets emailed. Not gated behind auth —
// listingId alone can't leak anything the public search page doesn't
// already show, and the alert_notifications unique constraint makes this
// idempotent no matter how many times it's called for the same listing.
export async function POST(request: NextRequest) {
  const { listingId } = await request.json();

  if (typeof listingId !== "string" || !listingId) {
    return NextResponse.json({ error: "listingId required" }, { status: 400 });
  }

  await checkAlertsForListing(listingId);

  return NextResponse.json({ ok: true });
}
