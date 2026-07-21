const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://bookswap.eslamradi.com";

// User-controlled listing fields (title/author) end up in HTML email
// content — escape them so a crafted listing can't inject markup into
// someone else's inbox.
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendMatchEmail({
  to,
  title,
  author,
  listingId,
}: {
  to: string;
  title: string;
  author: string;
  listingId: string;
}) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) return;

  const safeTitle = escapeHtml(title);
  const safeAuthor = escapeHtml(author);
  const url = `${SITE_URL}/listings/${listingId}`;

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender: { email: "hi@eslamradi.com", name: "bookswap" },
      to: [{ email: to }],
      subject: `"${title}" is now available on bookswap`,
      htmlContent: `<p><strong>${safeTitle}</strong> by ${safeAuthor} just showed up on bookswap — the book you asked to be notified about.</p><p><a href="${url}">View listing →</a></p>`,
    }),
  });

  if (!response.ok) {
    console.error("Failed to send match email:", await response.text());
  }
}
