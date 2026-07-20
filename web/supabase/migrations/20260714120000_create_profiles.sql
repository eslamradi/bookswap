-- Minimal profile row mirrored 1:1 with auth.users. This page (1.1 Sign
-- Up/Login) requires zero profile setup, so this table intentionally has
-- no product-specific columns yet. Add columns in a future migration only
-- when a feature actually needs them (e.g. display name for listings).

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by owner"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Profiles are insertable by owner"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Profiles are updatable by owner"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Auto-create a profile row for every new auth user, regardless of which
-- auth method created them (Google, Apple, or email magic link).
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
