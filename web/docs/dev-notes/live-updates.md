# Dev Notes: Live Updates for Messages and Handoff (2026-07-21)

## What changed

Messaging and Handoff previously required a manual page refresh to see the other participant's action — explicitly flagged as a gap in `handoff-actions.tsx`'s original comments. Both now use Supabase Realtime (`postgres_changes`) instead of a static server-rendered snapshot:

- `message-thread.tsx` subscribes to `INSERT` on `messages` filtered by `trade_id=eq.<id>`, appending incoming rows (deduped by `id`, since the sender's own optimistic insert also arrives back through the same subscription).
- `handoff-actions.tsx` subscribes to `UPDATE` on `trades` filtered by `id=eq.<id>`, updating `confirmedTheirs` live, and adopting `exchange_method` if the other participant picks one while this viewer's own choice is still unset.

`supabase/migrations/20260721160000_enable_realtime.sql` adds both tables to the `supabase_realtime` publication (previously empty — checked directly via `pg_publication_tables` before this change). Existing RLS select policies on both tables are enforced per-connection by Realtime itself; this migration doesn't loosen access, just turns on delivery.

## Verified

Real end-to-end test, not just build/lint: wrote a temporary Node script using `@supabase/supabase-js` against the live project, created a temporary trade between two real users, subscribed with the *exact* filter strings used in the actual components (`trade_id=eq.<id>` / `id=eq.<id>`), inserted a message and updated the trade's handoff confirmation from a separate call, and confirmed both events were received by the subscriber. Test data and script deleted afterward.

**One thing worth knowing:** the very first test attempt inserted immediately after the client reported `SUBSCRIBED` and received nothing — a startup race between the client-side channel join ack and the Realtime server actually attaching its WAL filter. Adding a ~2s gap before the write resolved it in the test. Not expected to matter in practice (a real user isn't going to send a message within milliseconds of the page mounting), but if delivery is ever flaky immediately after a fresh page load, this is why.

`npm run lint` and `npm run build` both clean — the `react-hooks/set-state-in-effect` rule doesn't fire here since the `setState` calls happen inside the async subscription callback, not synchronously in the effect body.
