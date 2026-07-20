-- Listings a user has posted to trade/sell. Owner-only RLS for now — no
-- public-read policy yet, since nothing (e.g. Browse Listings) needs to show
-- one user's listings to another until that feature actually exists. Add a
-- public-read policy alongside whichever page first needs it.

create table public.listings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  isbn text,
  title text not null,
  author text not null,
  cover_url text, -- reference cover image from the ISBN lookup (external URL, may be null)
  photo_path text, -- user-uploaded condition photo, storage object path (not a URL — bucket is private; generate a signed URL to display)
  condition text not null check (condition in ('Good', 'Fair', 'Worn')),
  status text not null default 'live' check (status in ('live', 'claimed', 'removed')),
  created_at timestamptz not null default now()
);

alter table public.listings enable row level security;

create policy "Listings are viewable by owner"
  on public.listings for select
  using (auth.uid() = owner_id);

create policy "Listings are insertable by owner"
  on public.listings for insert
  with check (auth.uid() = owner_id);

create policy "Listings are updatable by owner"
  on public.listings for update
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create index listings_owner_id_idx on public.listings (owner_id);

-- Condition photos. Owner-scoped read/write for now, same reasoning as the
-- table RLS above — make public-readable when Browse Listings needs it.
insert into storage.buckets (id, name, public)
values ('listing-photos', 'listing-photos', false);

create policy "Listing photos are viewable by owner"
  on storage.objects for select
  using (bucket_id = 'listing-photos' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Listing photos are insertable by owner"
  on storage.objects for insert
  with check (bucket_id = 'listing-photos' and auth.uid()::text = (storage.foldername(name))[1]);
