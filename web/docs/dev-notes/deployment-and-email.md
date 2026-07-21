# Dev Notes: Deployment, Custom Domain, and Email (2026-07-20 to 2026-07-21)

## What's live

- **Production:** https://bookswap.eslamradi.com (custom domain, DNS on Cloudflare, A record → `76.76.21.21`)
- Also reachable at the Vercel-assigned URL: https://web-lilac-one-11.vercel.app
- Vercel project: `radis/web`, linked via CLI (not GitHub-connected — deploys are manual `vercel --prod` from local files, not automatic on push)
- Supabase env vars set in Vercel for all three environments (Development/Preview/Production)
- Auth emails: custom SMTP via Resend, sender `hi@eslamradi.com` displaying as "bookswap", branded subject + HTML content

## Bugs found and fixed

1. **Redirect allowlist used exact-string matching, not accounting for query strings.** Our `emailRedirectTo` always includes `?next=...`, but the allowlist entries were bare `/auth/callback` with no wildcard — so every redirect silently fell back to `site_url` (which was still `http://localhost:3000`) instead of erroring, making this hard to spot. Fixed with `/**` wildcards scoped right after the domain (not narrowly after the path — an earlier attempt with `/auth/callback**` also failed for reasons not fully root-caused, possibly an interaction with how the wildcard positions in the matcher; the broader `/**` pattern is what actually worked).
2. **The custom domain was never added to the allowlist in the first place**, once `bookswap.eslamradi.com` went live — an easy one to miss since testing against the Vercel URL had already "worked" (in the sense of hitting the same fallback bug, which looked identical from the outside).
3. **Auth email rate limit defaulted to 2/hour**, which we blew through almost immediately during this debugging session, producing 429s that looked like more of the same redirect bug (a stale/failed-send email was being inspected, not a fresh one). Raised to 30/hour now that custom SMTP means we're not on Supabase's shared free-tier quota.
4. **Email template customization (subject/content) is blocked entirely on Supabase's free tier while using their default mail service** — returns a clear 400 explaining why, but this wasn't obvious going in. Resolved itself once custom SMTP was configured (templates use the same config endpoint regardless of provider, so this stopped being free-tier-gated).

## Rule for next time

When debugging "the redirect/link is wrong" on Supabase Auth, check three things together, not just the allowlist pattern: (1) is the *exact domain being tested* actually in the allowlist, (2) does the pattern account for query strings, (3) is a rate limit silently causing stale-email confusion. All three looked like the same symptom from the user's side and took several rounds to fully separate.
