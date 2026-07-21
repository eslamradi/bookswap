-- Selling, take two — reintroduced deliberately, unlike the payment
-- processing removed earlier. This time there's no processor and no
-- checkout step: the lister sets a price, a buyer requests it, and the
-- two of them arrange payment themselves (cash, Venmo, whatever) the same
-- way they already arrange the physical handoff. bookswap never touches
-- money, same as it never touches shipping.
alter table public.listings
  add column listing_type text not null default 'swap'
  check (listing_type in ('swap', 'sale')),
  add column price numeric check (price is null or price > 0);

-- A sale listing must have a price; a swap listing must not (keeps the two
-- concepts from drifting apart, e.g. a stale price left on a listing that
-- got switched back to swap).
alter table public.listings
  add constraint listings_sale_requires_price
  check ((listing_type = 'sale') = (price is not null));

-- Re-add 'sale' as a trade offer_type (removed along with payment
-- processing) and the price column to record what was agreed at request
-- time — kept even if the listing's price later changes.
alter table public.trades
  drop constraint trades_offer_type_check;

alter table public.trades
  add constraint trades_offer_type_check
  check (offer_type in ('exchange', 'claim', 'sale'));

alter table public.trades
  add column price numeric;
