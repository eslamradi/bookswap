-- bookswap doesn't process payments and never will — no processor is
-- integrated, and "Pay now" was a dead button with nothing behind it.
-- 'sale' was never actually reachable (offer-form.tsx only ever creates
-- 'exchange'), but leaving it in the schema/UI implied a feature that
-- didn't exist. Removing it outright, same call as the earlier courier
-- removal: don't leave a misleading dead end in the product.
alter table public.trades
  drop constraint trades_offer_type_check;

alter table public.trades
  add constraint trades_offer_type_check
  check (offer_type in ('exchange', 'claim'));

-- Both were sale-only fields (price to charge, whether payment cleared).
-- The checkout step that read/wrote them is removed in the same pass —
-- trades now go straight from accepted messaging to Handoff.
alter table public.trades
  drop column price,
  drop column payment_confirmed;
