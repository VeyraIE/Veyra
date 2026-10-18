begin;

create table public.veyra_memberships (
  user_id uuid primary key references auth.users(id) on delete restrict,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  status text not null default 'inactive',
  paid_until timestamptz,
  cancel_at_period_end boolean not null default false,
  checkout_request_key uuid,
  checkout_session_id text unique,
  checkout_expires_at timestamptz,
  updated_at timestamptz not null default now()
);

create table public.veyra_member_offers (
  id uuid primary key default gen_random_uuid(),
  title text not null check (length(title) between 3 and 140),
  description text not null check (length(description) between 10 and 3000),
  kind text not null check (kind in ('experience','venue','benefit')),
  venue text not null check (length(venue) between 2 and 150),
  county text not null check (length(county) between 2 and 80),
  offer_id uuid references public.veyra_marketplace_offers(id) on delete restrict,
  discount_bps integer check (discount_bps between 1 and 9900),
  redemption_instructions text not null check (length(redemption_instructions) between 10 and 3000),
  ends_at timestamptz not null,
  active boolean not null default false,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  check (kind <> 'experience' or (offer_id is not null and discount_bps is not null))
);
create index veyra_member_offers_service_idx on public.veyra_member_offers(offer_id) where active;
create index veyra_member_offers_expiry_idx on public.veyra_member_offers(ends_at) where active;
alter table public.veyra_memberships enable row level security;
alter table public.veyra_member_offers enable row level security;
revoke all on public.veyra_memberships, public.veyra_member_offers from public, anon, authenticated;
grant all on public.veyra_memberships, public.veyra_member_offers to service_role;

create function public.veyra_membership_begin_checkout(p_user_id uuid)
returns public.veyra_memberships language plpgsql security definer set search_path = '' as $$
declare membership public.veyra_memberships;
begin
  select * into membership from public.veyra_memberships where user_id = p_user_id for update;
  if not found or membership.stripe_customer_id is null then raise exception 'Membership setup is not complete.'; end if;
  if membership.stripe_subscription_id is not null and membership.status not in ('inactive','canceled','incomplete_expired') then raise exception 'Manage your existing membership instead of creating another subscription.'; end if;
  if membership.checkout_request_key is not null then return membership; end if;
  update public.veyra_memberships set checkout_request_key = gen_random_uuid(), checkout_expires_at = now() + interval '35 minutes', updated_at = now() where user_id = p_user_id returning * into membership;
  return membership;
end;
$$;
revoke all on function public.veyra_membership_begin_checkout(uuid) from public, anon, authenticated;
grant execute on function public.veyra_membership_begin_checkout(uuid) to service_role;

alter table public.veyra_marketplace_reservations
  add column base_unit_amount integer,
  add column member_discount_bps integer not null default 0,
  add column member_user_id uuid references auth.users(id),
  add column member_offer_id uuid references public.veyra_member_offers(id);

drop function public.veyra_marketplace_reserve(uuid, uuid, uuid, text, text, integer, text, text);
create function public.veyra_marketplace_reserve(p_offer_id uuid, p_slot_id uuid, p_request_key uuid, p_visitor_hash text, p_ip_hash text, p_guests integer, p_name text, p_email text, p_member_user_id uuid default null)
returns public.veyra_marketplace_reservations
language plpgsql security definer set search_path = '' as $$
declare
  offer public.veyra_marketplace_offers;
  slot public.veyra_marketplace_slots;
  provider public.veyra_marketplace_providers;
  reservation public.veyra_marketplace_reservations;
  occupied integer;
  total integer;
  membership public.veyra_memberships;
  benefit public.veyra_member_offers;
  base_amount integer;
  discounted_amount integer;
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
  base_amount := offer.unit_amount;
  discounted_amount := base_amount;
  if p_member_user_id is not null then
    select * into membership from public.veyra_memberships where user_id = p_member_user_id and status = 'active' and paid_until > now() for share;
    if found then
      select * into benefit from public.veyra_member_offers where offer_id = offer.id and kind = 'experience' and active and ends_at > now() order by discount_bps desc limit 1 for share;
      if found then discounted_amount := greatest(50, round(base_amount::numeric * (10000 - benefit.discount_bps) / 10000)::integer); end if;
    end if;
  end if;
  total := discounted_amount * case when offer.pricing_mode = 'per_person' then p_guests else 1 end;
  if total > 99999999 then raise exception 'This group needs a personal booking quote.'; end if;
  insert into public.veyra_marketplace_reservations(request_key, visitor_hash, ip_hash, slot_id, provider_id, title, starts_at, customer_name, customer_email, guests, unit_amount, total_amount, application_fee, pricing_mode, currency, stripe_account_id, cancellation_terms, base_unit_amount, member_discount_bps, member_user_id, member_offer_id)
  values(p_request_key, p_visitor_hash, p_ip_hash, slot.id, provider.id, offer.title, slot.starts_at, p_name, p_email, p_guests, discounted_amount, total, round(total::numeric * provider.commission_bps / 10000)::integer, offer.pricing_mode, offer.currency, provider.stripe_account_id, offer.cancellation_terms, base_amount, coalesce(benefit.discount_bps, 0), case when benefit.id is not null then p_member_user_id else null end, benefit.id)
  returning * into reservation;
  return reservation;
end;
$$;

revoke all on function public.veyra_marketplace_reserve(uuid, uuid, uuid, text, text, integer, text, text, uuid) from public, anon, authenticated;
grant execute on function public.veyra_marketplace_reserve(uuid, uuid, uuid, text, text, integer, text, text, uuid) to service_role;

commit;
