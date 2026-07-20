-- Adapts the original "privacy settings" concept (address-masking/shipping
-- defaults, removed with courier support) into a lighter preference: which
-- handoff method a user tends to prefer. Not yet consumed by the Handoff
-- page (still always asks) — stored now so that wiring it up later is a
-- small change, not a new column.
alter table public.profiles
  add column preferred_exchange_method text
  check (preferred_exchange_method in ('meetup', 'self_arranged'));
