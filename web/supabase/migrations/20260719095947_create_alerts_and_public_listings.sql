-- "Notify me" intent capture for Scenario 02 (Priya). No delivery mechanism
-- yet — this MVP only records the alert, matching the original prototype's
-- scope. Sending real notifications when a match appears is a future pass.
create table public.alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  query text not null,
  created_at timestamptz not null default now()
);

alter table public.alerts enable row level security;

create policy "Alerts are viewable by owner"
  on public.alerts for select
  using (auth.uid() = user_id);

create policy "Alerts are insertable by owner"
  on public.alerts for insert
  with check (auth.uid() = user_id);

create index alerts_user_id_idx on public.alerts (user_id);

-- Public search/browse needs to see everyone's live listings, not just the
-- owner's own. Flagged as a "when it's actually needed" addition back in
-- the 1.2 migration's comments — this is that moment (Scenario 02 search).
create policy "Live listings are viewable by anyone"
  on public.listings for select
  using (status = 'live');

-- Condition photos need to be publicly viewable too, for the same reason —
-- a marketplace listing's photo is meant to be seen by anyone browsing/
-- searching, not just its owner. Flip the bucket to public (serves photos
-- via a public URL, no per-request RLS check needed for reads). Uploads
-- remain owner-only via the existing insert policy.
update storage.buckets set public = true where id = 'listing-photos';
