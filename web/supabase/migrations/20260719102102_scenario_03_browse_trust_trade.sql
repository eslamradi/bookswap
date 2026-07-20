-- Lister's free-text notes (optional). Was intentionally omitted from the
-- original listings migration since Batch Listing (Tom's fast flow) never
-- collects one — Create Listing (single, Maya's slower flow) does.
alter table public.listings add column description text;

-- Records that a listing was created via the "offer in trade" flow against
-- a specific target listing. Not a full trade-request/matching system yet
-- (that's Scenario 04) — just an honest reference, not a fake confirmation.
alter table public.listings
  add column offered_for_listing_id uuid references public.listings (id);

-- Display name, needed now that listings/profiles are shown to other users
-- (Browse, Book Detail, Profile pages). No "edit profile" UI exists yet, so
-- this is auto-populated from the email's local part at signup — a
-- reasonable default, not a placeholder to build a settings page around
-- later if one never gets requested.
alter table public.profiles add column display_name text;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, split_part(new.email, '@', 1));
  return new;
end;
$$;

-- Profiles need to be publicly readable now too — Browse/Book Detail link
-- to a lister's profile, and that only works if visitors other than the
-- owner can see it. Same "add public-read when something needs it" pattern
-- as listings/storage in the Scenario 02 migration.
create policy "Profiles are viewable by anyone"
  on public.profiles for select
  using (true);
