-- Real delivery for "Notify me" alerts (Scenario 02). Previously alerts were
-- recorded but never actually sent — see the original note on the `alerts`
-- table. This table records which (alert, listing) matches have already
-- been notified, both to drive the notifications page's "found" list and
-- to make sending idempotent: a unique constraint means each match can only
-- ever be recorded (and therefore emailed) once, no matter how many times
-- the matching check is triggered.
create table public.alert_notifications (
  id uuid primary key default gen_random_uuid(),
  alert_id uuid not null references public.alerts (id) on delete cascade,
  listing_id uuid not null references public.listings (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (alert_id, listing_id)
);

alter table public.alert_notifications enable row level security;

-- Read access follows the alert's owner. Inserts happen exclusively via the
-- server-side matching job using the service role key (bypasses RLS), since
-- it must write on behalf of whichever user owns the matched alert, not the
-- signed-in user who created the new listing.
create policy "Alert notifications are viewable by the alert owner"
  on public.alert_notifications for select
  using (
    exists (
      select 1 from public.alerts
      where alerts.id = alert_notifications.alert_id
      and alerts.user_id = auth.uid()
    )
  );

create index alert_notifications_alert_id_idx on public.alert_notifications (alert_id);
