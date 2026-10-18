begin;

create table public.veyra_marketplace_admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

create table public.veyra_marketplace_providers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete restrict,
  business_name text not null check (length(business_name) between 2 and 150),
  description text not null,
  county text not null,
  approval_status text not null default 'pending' check (approval_status in ('pending', 'approved', 'rejected')),
  commission_bps integer check (commission_bps between 0 and 9900),
  approved_by uuid references auth.users(id),
  stripe_account_id text unique,
  payments_ready boolean not null default false,
  created_at timestamptz not null default now(),
  check (approval_status <> 'approved' or commission_bps is not null)
);

create table public.veyra_marketplace_offers (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references public.veyra_marketplace_providers(id) on delete restrict,
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null,
  description text not null,
  county text not null,
  category text not null check (category in ('wellness','adventure','fitness','learning','family')),
  image_url text not null,
  unit_amount integer not null check (unit_amount between 50 and 10000000),
  pricing_mode text not null check (pricing_mode in ('per_person', 'per_group')),
  max_guests integer not null check (max_guests between 1 and 100),
  currency text not null default 'eur' check (currency = 'eur'),
  cancellation_terms text not null check (length(cancellation_terms) between 10 and 3000),
  active boolean not null default false,
  created_at timestamptz not null default now()
);
create index veyra_marketplace_offers_provider_idx on public.veyra_marketplace_offers(provider_id);

create table public.veyra_marketplace_slots (
  id uuid primary key default gen_random_uuid(),
  offer_id uuid not null references public.veyra_marketplace_offers(id) on delete restrict,
  starts_at timestamptz not null,
  capacity integer not null check (capacity between 1 and 10000),
  active boolean not null default true,
  unique (offer_id, starts_at)
);
create index veyra_marketplace_slots_offer_idx on public.veyra_marketplace_slots(offer_id, starts_at);

create table public.veyra_marketplace_reservations (
  id uuid primary key default gen_random_uuid(),
  request_key uuid not null,
  visitor_hash text not null,
  ip_hash text not null,
  slot_id uuid not null references public.veyra_marketplace_slots(id) on delete restrict,
  provider_id uuid not null references public.veyra_marketplace_providers(id) on delete restrict,
  title text not null,
  starts_at timestamptz not null,
  customer_name text not null,
  customer_email text not null,
  guests integer not null check (guests between 1 and 100),
  unit_amount integer not null,
  total_amount integer not null,
  application_fee integer not null,
  pricing_mode text not null,
  currency text not null,
  stripe_account_id text not null,
  cancellation_terms text not null,
  terms_accepted_at timestamptz not null default now(),
  status text not null default 'held' check (status in ('held','confirmed','expired','refund_pending','refunded','refund_failed')),
  expires_at timestamptz not null default now() + interval '35 minutes',
  stripe_session_id text unique,
  stripe_payment_intent_id text unique,
  stripe_refund_id text unique,
  created_at timestamptz not null default now(),
  unique (visitor_hash, request_key),
  check (total_amount > 0 and application_fee between 0 and total_amount)
);
create index veyra_marketplace_reservations_slot_idx on public.veyra_marketplace_reservations(slot_id, status);
create index veyra_marketplace_reservations_provider_idx on public.veyra_marketplace_reservations(provider_id, created_at);
create index veyra_marketplace_reservations_ip_idx on public.veyra_marketplace_reservations(ip_hash, created_at);
create index veyra_marketplace_reservations_expiry_idx on public.veyra_marketplace_reservations(expires_at) where status = 'held';

alter table public.veyra_marketplace_admins enable row level security;
alter table public.veyra_marketplace_providers enable row level security;
alter table public.veyra_marketplace_offers enable row level security;
alter table public.veyra_marketplace_slots enable row level security;
alter table public.veyra_marketplace_reservations enable row level security;
revoke all on public.veyra_marketplace_admins, public.veyra_marketplace_providers, public.veyra_marketplace_offers, public.veyra_marketplace_slots, public.veyra_marketplace_reservations from anon, authenticated;
grant all on public.veyra_marketplace_admins, public.veyra_marketplace_providers, public.veyra_marketplace_offers, public.veyra_marketplace_slots, public.veyra_marketplace_reservations to service_role;

create function public.veyra_marketplace_reserve(p_offer_id uuid, p_slot_id uuid, p_request_key uuid, p_visitor_hash text, p_ip_hash text, p_guests integer, p_name text, p_email text)
returns public.veyra_marketplace_reservations
language plpgsql security definer set search_path = '' as $$
declare
  offer public.veyra_marketplace_offers;
  slot public.veyra_marketplace_slots;
  provider public.veyra_marketplace_providers;
  reservation public.veyra_marketplace_reservations;
  occupied integer;
  total integer;
begin
  perform pg_advisory_xact_lock(hashtextextended(p_ip_hash, 0));
  select * into slot from public.veyra_marketplace_slots where id = p_slot_id and offer_id = p_offer_id for update;
  if not found then raise exception 'This session is no longer available.'; end if;
  select * into reservation from public.veyra_marketplace_reservations where visitor_hash = p_visitor_hash and request_key = p_request_key;
  if found then
    if reservation.slot_id <> p_slot_id or reservation.guests <> p_guests or reservation.customer_email <> p_email or reservation.customer_name <> p_name then
      raise exception 'Start a new booking after changing your details.';
    end if;
    if reservation.status <> 'held' or reservation.expires_at <= now() then raise exception 'This checkout has expired. Start a new booking.'; end if;
    return reservation;
  end if;
  if (select count(*) from public.veyra_marketplace_reservations where ip_hash = p_ip_hash and created_at > now() - interval '10 minutes') >= 5 then
    raise exception 'Too many booking attempts. Please try again in ten minutes.';
  end if;
  select * into offer from public.veyra_marketplace_offers where id = p_offer_id for share;
  select * into provider from public.veyra_marketplace_providers where id = offer.provider_id for share;
  if not slot.active or not offer.active or slot.starts_at <= now() + interval '1 hour' or provider.approval_status <> 'approved' or not provider.payments_ready or provider.stripe_account_id is null then
    raise exception 'This experience is not currently available to book.';
  end if;
  if p_guests < 1 or p_guests > offer.max_guests then raise exception 'Choose a valid number of guests.'; end if;
  select coalesce(sum(guests), 0) into occupied from public.veyra_marketplace_reservations where slot_id = slot.id and status in ('held','confirmed','refund_pending','refund_failed');
  if occupied + p_guests > slot.capacity then raise exception 'There are not enough places left for this session.'; end if;
  total := offer.unit_amount * case when offer.pricing_mode = 'per_person' then p_guests else 1 end;
  if total > 99999999 then raise exception 'This group needs a personal booking quote.'; end if;
  insert into public.veyra_marketplace_reservations(request_key, visitor_hash, ip_hash, slot_id, provider_id, title, starts_at, customer_name, customer_email, guests, unit_amount, total_amount, application_fee, pricing_mode, currency, stripe_account_id, cancellation_terms)
  values(p_request_key, p_visitor_hash, p_ip_hash, slot.id, provider.id, offer.title, slot.starts_at, p_name, p_email, p_guests, offer.unit_amount, total, round(total::numeric * provider.commission_bps / 10000)::integer, offer.pricing_mode, offer.currency, provider.stripe_account_id, offer.cancellation_terms)
  returning * into reservation;
  return reservation;
end;
$$;

create function public.veyra_marketplace_settle(p_reservation_id uuid, p_session_id text, p_amount integer, p_currency text, p_payment_intent text)
returns void language plpgsql security definer set search_path = '' as $$
declare reservation public.veyra_marketplace_reservations;
begin
  select * into reservation from public.veyra_marketplace_reservations where id = p_reservation_id for update;
  if not found then raise exception 'Reservation not found.'; end if;
  if reservation.total_amount <> p_amount or reservation.currency <> p_currency or (reservation.stripe_session_id is not null and reservation.stripe_session_id <> p_session_id) then raise exception 'Payment does not match reservation.'; end if;
  if reservation.status = 'confirmed' and reservation.stripe_payment_intent_id = p_payment_intent then return; end if;
  if reservation.status in ('refund_pending','refunded','refund_failed') and reservation.stripe_payment_intent_id = p_payment_intent then return; end if;
  if reservation.status <> 'held' then raise exception 'Reservation needs manual payment review.'; end if;
  update public.veyra_marketplace_reservations set status = 'confirmed', stripe_session_id = p_session_id, stripe_payment_intent_id = p_payment_intent where id = reservation.id;
end;
$$;

revoke all on function public.veyra_marketplace_reserve(uuid, uuid, uuid, text, text, integer, text, text) from public, anon, authenticated;
revoke all on function public.veyra_marketplace_settle(uuid, text, integer, text, text) from public, anon, authenticated;
grant execute on function public.veyra_marketplace_reserve(uuid, uuid, uuid, text, text, integer, text, text) to service_role;
grant execute on function public.veyra_marketplace_settle(uuid, text, integer, text, text) to service_role;

create function public.veyra_marketplace_create_offer(p_provider_id uuid, p_offer jsonb)
returns uuid language plpgsql security definer set search_path = '' as $$
declare provider public.veyra_marketplace_providers; offer_id uuid;
begin
  select * into provider from public.veyra_marketplace_providers where id = p_provider_id for update;
  if not found or provider.approval_status <> 'approved' then raise exception 'Provider approval is required.'; end if;
  if (p_offer->>'active')::boolean and not provider.payments_ready then raise exception 'Complete payment onboarding before publishing.'; end if;
  insert into public.veyra_marketplace_offers(provider_id, slug, title, description, county, category, image_url, unit_amount, pricing_mode, max_guests, cancellation_terms, active)
  values(provider.id, p_offer->>'slug', p_offer->>'title', p_offer->>'description', p_offer->>'county', p_offer->>'category', p_offer->>'image_url', (p_offer->>'unit_amount')::integer, p_offer->>'pricing_mode', (p_offer->>'max_guests')::integer, p_offer->>'cancellation_terms', (p_offer->>'active')::boolean)
  returning id into offer_id;
  insert into public.veyra_marketplace_slots(offer_id, starts_at, capacity) values(offer_id, (p_offer->>'starts_at')::timestamptz, (p_offer->>'capacity')::integer);
  return offer_id;
end;
$$;
revoke all on function public.veyra_marketplace_create_offer(uuid, jsonb) from public, anon, authenticated;
grant execute on function public.veyra_marketplace_create_offer(uuid, jsonb) to service_role;

commit;
