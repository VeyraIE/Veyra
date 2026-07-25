# Database Schema

Postgres on Supabase. 15 tables in the `public` schema. **Row Level Security is
enabled on all 15 tables**, each with at least one policy.

Auth is Supabase Auth (`auth.users`); `public.profiles` mirrors it 1:1 via `profiles.id`.

> Verified live against the `public` schema. If you change the schema, re-verify
> and update this file.

## Entity overview

```
auth.users ──1:1── profiles ──┬──< child_profiles
                              ├──< bookings >── activities >── providers
                              ├──< favorites                       │
                              ├──< reviews                         │
                              ├──< provider_follows >──────────────┘
                              ├──< notifications
                              ├──< messages
                              └──< waitlist

categories ──< activities ──< schedules ──< sessions ──< bookings
providers  ──< promo_codes
```

## Tables

### `profiles`
Public user record, keyed to `auth.users.id`. `role` drives all authorization
(`user` | `provider` | `admin`).

`id, email, full_name, avatar_url, phone, role, bio, location, county,
notification_preferences, created_at, updated_at`

### `providers`
A business that lists activities. Owned by a user via `user_id`.
Includes Irish-market trust fields (`is_garda_vetted`, `garda_vetting_date`,
`insurance_verified`) and Stripe subscription state.

`id, user_id, business_name, slug, description, logo_url, cover_image_url,
website, email, phone, address, county, eircode, lat, lng, is_verified,
is_garda_vetted, garda_vetting_date, insurance_verified, rating, review_count,
subscription_plan, subscription_status, stripe_customer_id,
stripe_subscription_id, social_links, business_hours, certifications, team_size,
founded_year, created_at, updated_at`

### `activities`
A bookable offering belonging to a provider and a category. Carries age range,
location, pricing, and denormalized counters.

`id, provider_id, category_id, title, slug, description, short_description,
what_to_learn, what_to_bring, images, cover_image, price, price_type, currency,
duration_minutes, min_age, max_age, skill_level, is_indoor, is_outdoor,
max_participants, address, county, eircode, lat, lng, is_active, is_featured,
rating, review_count, booking_count, waitlist_enabled, instant_booking,
cancellation_policy, safety_info, requirements, tags, created_at, updated_at`

### `categories`
Top-level taxonomy for browsing (`/category/[slug]`).

`id, name, slug, icon, description, color, created_at`

### `schedules`
Recurring availability rule for an activity (`day_of_week` + time range).

`id, activity_id, day_of_week, start_time, end_time, start_date, end_date,
is_recurring, max_participants, current_participants, is_active, created_at`

### `sessions`
A concrete dated instance, optionally generated from a `schedule_id`. This is
what a booking attaches to.

`id, activity_id, schedule_id, date, start_time, end_time, max_participants,
current_participants, status, notes, created_at`

### `bookings`
Central transactional table. Links a parent (`user_id`), a child (`child_id`),
an `activity_id`, and a `session_id`, plus payment and check-in state.

`id, user_id, activity_id, session_id, child_id, provider_id, status,
payment_status, amount, currency, stripe_payment_intent_id, promo_code,
discount_amount, participant_name, participant_age, special_requirements,
qr_code, checked_in, checked_in_at, booking_date, booking_time, notes,
cancellation_reason, cancelled_at, created_at, updated_at`

### `child_profiles`
Children belonging to a parent (`parent_id`), including safeguarding data.

`id, parent_id, name, date_of_birth, age, interests, medical_notes,
emergency_contact, emergency_phone, avatar_url, created_at, updated_at`

### `reviews`
Tied to a `booking_id` so reviews can be verified. Supports a provider
`response` and moderation via `is_approved`.

`id, user_id, activity_id, provider_id, booking_id, rating, title, comment,
response, response_date, is_verified, is_approved, helpful_count, created_at,
updated_at`

### `waitlist`
Queue for full sessions, with `position` and `notified_at`.

`id, user_id, activity_id, session_id, child_id, position, status, notified_at,
created_at`

### `favorites` / `provider_follows`
Join tables for saved activities and followed providers.

`favorites: id, user_id, activity_id, created_at`
`provider_follows: id, user_id, provider_id, created_at`

### `promo_codes`
Provider-scoped discounts, optionally limited to specific `activity_ids`.

`id, provider_id, code, description, discount_type, discount_value, min_purchase,
max_uses, current_uses, valid_from, valid_until, is_active, activity_ids,
created_at`

### `notifications` / `messages`
In-app notifications and provider/parent messaging threaded off a `booking_id`.

`notifications: id, user_id, type, title, message, data, read, read_at, created_at`
`messages: id, sender_id, receiver_id, booking_id, subject, content, read, read_at, created_at`

## Denormalized counters

These columns are **not** computed at read time and can drift from the source rows:

| Column | True source |
| --- | --- |
| `activities.rating`, `activities.review_count` | `reviews` |
| `activities.booking_count` | `bookings` |
| `providers.rating`, `providers.review_count` | `reviews` |
| `sessions.current_participants` | `bookings` for that session |
| `schedules.current_participants` | `bookings` |
| `promo_codes.current_uses` | `bookings.promo_code` |

Any UI reading these is trusting the counter, not the ledger. Keep them in sync
with triggers or recompute them, and treat a mismatch as a bug (see
`changelog.md` — seeded counters did not match real rows).

## Current data volumes

| Table | Rows |
| --- | --- |
| categories | 15 |
| profiles | 7 |
| activities | 6 |
| reviews | 6 |
| providers | 3 |
| sessions | 30 |
| bookings | 0 |
| child_profiles | 0 |
| waitlist | 0 |

`bookings` is empty, so no revenue or attendance figure in the product is real yet.

## auth.users integrity note

GoTrue scans its token columns into non-nullable Go strings. If
`confirmation_token`, `recovery_token`, `email_change`, `email_change_token_new`,
`email_change_token_current`, `phone_change`, `phone_change_token`, or
`reauthentication_token` is `NULL`, **login fails with
`Database error querying schema`** even when the password is correct.

Always insert `''` rather than `NULL`. Audit with:

```sql
select count(*) from auth.users
where confirmation_token is null or recovery_token is null
   or email_change is null or email_change_token_new is null
   or email_change_token_current is null or phone_change is null
   or phone_change_token is null or reauthentication_token is null;
```

Prefer creating users through the Auth API/admin SDK, which sets these correctly.

## No migration files

There is no `supabase/migrations/` or `scripts/` directory — the schema was
applied directly to the hosted database and is not reproducible from the repo.
See `deployment.md`; this blocks standing up a second environment.
