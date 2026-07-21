-- Live updates for messaging and handoff confirmations — previously both
-- required a manual page refresh to see the other participant's action
-- (explicitly flagged as a gap in handoff-actions.tsx). Adds both tables to
-- the standard Realtime publication so postgres_changes subscriptions can
-- receive INSERT (messages) and UPDATE (trades) events. Existing RLS
-- select policies on both tables are enforced per-connection by Realtime,
-- same as any other client read — no new access is opened up.
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.trades;
