# Launch Checklist

Blockers first. Every item below was verified against the running app or the live
database, not assumed.

## Blockers

### 1. No booking has ever succeeded
`bookings` has 0 rows. The core transaction is unproven end to end. Book, pay, and
confirm both dashboards reflect it before anything else ships.

### 2. A booking can be marked paid without paying
`app/actions/bookings.ts` → `createBooking` inserts
`payment_status: 'paid', status: 'confirmed'` unconditionally, with no check that
Stripe took the money. Invoking the action directly yields a free confirmed
booking. Gate this on a verified payment.

To its credit the same action recomputes the price server-side rather than
trusting the client — the money is right, the payment state is not.

### 3. No Stripe webhook handler
`lib/stripe.ts` reads `STRIPE_SECRET_KEY` and `app/actions/stripe.ts` opens
embedded Checkout, but nothing writes Stripe results back.
`bookings.stripe_payment_intent_id` and `providers.subscription_status` are never
set. `getCheckoutSessionStatus` is the only link, and it persists nothing.
**Do not take real payments until this exists.**

### 4. Capacity check can oversell
`createBooking` reads `sessions.current_participants`, then separately writes
`value + 1`. Two concurrent bookings can both pass the full-session check and
oversell. For a children's activity this is a safeguarding issue, not just a
counting bug. Enforce capacity atomically in the database.

Cancellation also never decrements the counter, so seats are lost permanently.

### 5. Stale `Activio` branding — 15 occurrences in 8 files
User-visible on auth and pricing pages.

- `app/auth/login/page.tsx` (2)
- `app/auth/sign-up/page.tsx` (2)
- `app/auth/sign-up-success/page.tsx` (1)
- `app/pricing/page.tsx` (3)
- `app/about/page.tsx` (3)
- `app/provider/onboarding/page.tsx` (1)
- `app/admin/page.tsx` (1)
- `lib/products.ts` (2)

`lib/products.ts` matters most — that text can reach Stripe product descriptions
and customer receipts.

### 6. No migration files
No `supabase/migrations/`. The schema exists only in project
`hgwauifqalovrtjqxtii` and cannot be rebuilt from the repo, so there is no way to
stand up staging or recover from a mistake. Dump the schema and commit it.

### 7. Do not point at the empty Supabase project
`tybxkuacwiwhvbbmwrkv` has no tables. Switching env vars to it breaks every
data-backed page. See `deployment.md`.

## Data integrity

### `auth.users` NULL token columns
NULL in GoTrue's token columns causes `Database error querying schema` on login
even with a correct password. This was hit and repaired for all affected rows;
seeding users with raw SQL will reintroduce it. Prefer the Auth admin API. Audit
query is in `database-schema.md`.

### Denormalized counters drift
`sessions.current_participants`, `activities.rating` / `review_count` /
`booking_count`, and `providers.rating` / `review_count` are stored, not computed.
Seeded values do not match the underlying rows, so provider dashboard figures can
overstate reality. Recompute from source rows and add triggers before launch.

### Bookings are not linked to children
`createBooking` never sets `bookings.child_id`, so no booking is attached to a
`child_profiles` row. Attendance and medical/emergency data cannot be looked up
from a booking — which is exactly what a provider needs on the day.

## Verified working

- Sign-up with email confirmation.
- Login, and sign-out clearing the session and reverting the header.
- `/dashboard` and `/provider/dashboard` redirect to
  `/auth/login?redirect=<path>` when signed out.
- Parent dashboard renders real profile data with honest zeros and empty states.
- Provider dashboard loads for a provider owner.
- RLS enabled with policies on all 15 tables.

## Pre-launch

### Legal and safeguarding (non-negotiable in this market)
- [ ] Privacy policy and terms; GDPR basis for storing children's data.
- [ ] `child_profiles.medical_notes` is sensitive — confirm RLS restricts it to
      the parent and the booked provider only.
- [ ] Cancellation and refund policy surfaced before payment.
- [ ] Confirm Garda vetting claims are verified, not self-declared.

### Product
- [ ] Replace all `Activio` strings.
- [ ] Remove or build the placeholder destinations: favorites, notifications,
      bookings list, and settings (header links currently point at `/dashboard`).
- [ ] Booking confirmation email.
- [ ] Empty states on every list a new user sees.

### Technical
- [ ] Commit migration files.
- [ ] Set the three env vars on Preview and Production.
- [ ] Register all auth redirect URLs in Supabase.
- [ ] `next build` and `lint` clean.
- [ ] Per-page `metadata` titles must not repeat the brand — the root layout
      already applies a `%s | VEYRA` template.
- [ ] Error monitoring.

### Content
- [ ] 6 activities across 3 providers is thin. Recruit real providers.
- [ ] Every activity needs a real cover image and accurate age range and price.
