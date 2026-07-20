-- Clean up any self-trades created before this constraint existed (pre-launch
-- test data only — this is literally the bug being fixed here, not real
-- user data worth preserving). Dependent rows first to satisfy FKs.
delete from public.ratings
  where trade_id in (select id from public.trades where requester_id = owner_id);
delete from public.messages
  where trade_id in (select id from public.trades where requester_id = owner_id);
delete from public.trades where requester_id = owner_id;

-- A user shouldn't be able to open a trade on their own listing. This is
-- the real enforcement boundary — UI prevention (hiding the "Request" button
-- on your own listings, guarding the offer page) is defense in depth, not a
-- substitute for this, since trades are inserted directly from client code.
alter table public.trades
  add constraint trades_requester_not_owner check (requester_id != owner_id);
