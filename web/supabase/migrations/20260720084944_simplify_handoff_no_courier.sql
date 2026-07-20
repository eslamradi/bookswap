-- Dropping courier/shipping-label simulation — no real carrier integration
-- was ever planned soon, and it solved the address-privacy fear in a
-- roundabout way. Replaced with a straightforward choice: meet in a public
-- place (needs no address at all) or arrange mailing yourselves (address
-- sharing, if any, is the participants' own explicit choice via Messages).
alter table public.trades drop column shipping_label_generated;
alter table public.trades drop column tracking_status;

alter table public.trades
  add column exchange_method text check (exchange_method in ('meetup', 'self_arranged'));
alter table public.trades
  add column handoff_confirmed_by_requester boolean not null default false;
alter table public.trades
  add column handoff_confirmed_by_owner boolean not null default false;
