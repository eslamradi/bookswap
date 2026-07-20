-- A trade connects a requester's offer to a listing's owner. Created when
-- an offer is sent (Scenario 03's offer flow); walked through accept ->
-- message -> checkout -> shipping -> tracking -> rating by this scenario.
create table public.trades (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings (id),
  offered_listing_id uuid references public.listings (id),
  requester_id uuid not null references auth.users (id) on delete cascade,
  owner_id uuid not null references auth.users (id) on delete cascade,
  offer_type text not null default 'exchange' check (offer_type in ('exchange', 'claim', 'sale')),
  price numeric,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined', 'completed')),
  payment_confirmed boolean not null default false,
  shipping_label_generated boolean not null default false,
  tracking_status text check (tracking_status in ('awaiting_dropoff', 'in_transit', 'delivered')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.trades enable row level security;

create policy "Trades are viewable by participants"
  on public.trades for select
  using (auth.uid() = requester_id or auth.uid() = owner_id);

create policy "Trades are insertable by requester"
  on public.trades for insert
  with check (auth.uid() = requester_id);

create policy "Trades are updatable by participants"
  on public.trades for update
  using (auth.uid() = requester_id or auth.uid() = owner_id)
  with check (auth.uid() = requester_id or auth.uid() = owner_id);

create index trades_requester_id_idx on public.trades (requester_id);
create index trades_owner_id_idx on public.trades (owner_id);

-- In-platform messaging so trade participants never need to exchange real
-- contact info or an address directly.
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  trade_id uuid not null references public.trades (id) on delete cascade,
  sender_id uuid not null references auth.users (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

alter table public.messages enable row level security;

create policy "Messages are viewable by trade participants"
  on public.messages for select
  using (
    exists (
      select 1 from public.trades t
      where t.id = trade_id
        and (t.requester_id = auth.uid() or t.owner_id = auth.uid())
    )
  );

create policy "Messages are insertable by trade participants"
  on public.messages for insert
  with check (
    auth.uid() = sender_id
    and exists (
      select 1 from public.trades t
      where t.id = trade_id
        and (t.requester_id = auth.uid() or t.owner_id = auth.uid())
    )
  );

create index messages_trade_id_idx on public.messages (trade_id);

-- Ratings are public-readable (this is what finally gives the Profile page
-- real review data) but only insertable by an actual participant of a
-- completed trade, rating the other participant.
create table public.ratings (
  id uuid primary key default gen_random_uuid(),
  trade_id uuid not null references public.trades (id),
  rater_id uuid not null references auth.users (id) on delete cascade,
  ratee_id uuid not null references auth.users (id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now()
);

alter table public.ratings enable row level security;

create policy "Ratings are viewable by anyone"
  on public.ratings for select
  using (true);

create policy "Ratings are insertable by trade participants"
  on public.ratings for insert
  with check (
    auth.uid() = rater_id
    and ratee_id != auth.uid()
    and exists (
      select 1 from public.trades t
      where t.id = trade_id
        and t.status = 'completed'
        and (t.requester_id = auth.uid() or t.owner_id = auth.uid())
        and ratee_id in (t.requester_id, t.owner_id)
    )
  );

create index ratings_ratee_id_idx on public.ratings (ratee_id);
