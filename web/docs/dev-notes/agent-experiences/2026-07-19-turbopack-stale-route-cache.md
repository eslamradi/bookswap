# Learning: Turbopack dev cache can serve stale 404s for newly added nested routes

**Date:** 2026-07-19
**Context:** Scenario 04, adding 6 new nested dynamic routes under `src/app/trades/[id]/` in one batch

## The Problem

After adding `src/app/trades/[id]/{messages,checkout,shipping,tracking,rating}/page.tsx` and restarting the dev server (`pkill` + `npm run dev`), all 5 newly added sub-routes 404'd — but the base `/trades/[id]/page.tsx` route worked fine, and `next build` correctly listed all 6 routes moments earlier. The 404s returned in ~20-30ms with essentially no time in the route handler, indicating Turbopack's dev router wasn't even invoking the page component — it didn't recognize the routes existed at all, despite a fresh process start.

## The Fix

`rm -rf .next` before restarting `npm run dev`. A plain process restart wasn't enough — Turbopack's persistent on-disk dev cache (in `.next/`) had stale route-manifest data from before these files existed, and a new process picked that cache back up rather than rediscovering routes from disk.

## Rule for This Project

**When adding several new nested route folders in one batch, clear `.next` before the next `npm run dev` restart if anything 404s unexpectedly** — don't assume a normal restart re-scans the filesystem. This is a known-rough-edge behavior in this Next.js version's Turbopack dev server (see the project's own `AGENTS.md`: "breaking changes... heed deprecation notices" — this isn't a deprecation notice, but it's the same class of "don't trust training-data assumptions about how this version behaves").
