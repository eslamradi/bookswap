-- A user shouldn't be able to open a trade on their own listing. This is
-- the real enforcement boundary — UI prevention (hiding the "Request" button
-- on your own listings, guarding the offer page) is defense in depth, not a
-- substitute for this, since trades are inserted directly from client code.
alter table public.trades
  add constraint trades_requester_not_owner check (requester_id != owner_id);
