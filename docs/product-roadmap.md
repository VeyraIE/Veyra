# Product Roadmap

Veyra is a marketplace for children's activities in Ireland. Parents discover and
book classes, camps, and clubs; providers list them and manage attendance.

Two sides, three roles: `user` (parent), `provider`, `admin`.

## Where the product actually is

The schema is broad — 15 tables covering messaging, waitlists, promo codes, and
follows — but only part of it is wired to UI, and `bookings` is empty.

| Capability | Tables | State |
| --- | --- | --- |
| Browse & search | `categories`, `activities` | Built. 15 categories, 6 activities. |
| Provider profiles | `providers` | Built. 3 providers. |
| Auth & roles | `profiles` | Built. Email + password, confirmation required. |
| Parent dashboard | `bookings`, `child_profiles` | Renders live data; empty states only. |
| Provider dashboard | `bookings`, `activities` | Renders live data; counters unverified. |
| Reviews | `reviews` | 6 rows; verified-review flow depends on bookings. |
| Booking flow | `bookings`, `sessions` | `createBooking` implemented; **0 bookings ever created.** |
| Payments | Stripe | Embedded Checkout; **no webhook, marked paid optimistically.** |
| Child profiles | `child_profiles` | Schema only, 0 rows; `createBooking` never sets `child_id`. |
| Waitlists | `waitlist` | Schema only, no UI. |
| Promo codes | `promo_codes` | Validation and redemption implemented in server actions. |
| Messaging | `messages` | Schema only, no UI. |
| Notifications | `notifications` | Schema only, no UI. |
| Favorites / follows | `favorites`, `provider_follows` | Schema only; header links to `/dashboard`. |
| Admin | — | `/admin` page exists, role-gated. |

## Phase 1 — Make one booking real

Nothing else matters until a parent can pay and both sides see it. The booking
flow is the only path that converts.

- Stop trusting the client for payment. `createBooking` writes
  `payment_status: 'paid'` unconditionally, so a booking can be confirmed without
  paying. Gate it on a verified Stripe payment.
- Add the Stripe webhook handler to set `payment_status` and
  `stripe_payment_intent_id` from Stripe rather than optimistically.
- Make capacity atomic. The current read-then-increment can oversell under
  concurrent bookings; enforce `max_participants` in the database.
- Decrement `sessions.current_participants` on cancellation — only the increment
  exists today.
- Create a child profile during booking — `createBooking` never sets `child_id`,
  so no booking is linked to a child.
- Show the booking on both dashboards and email a confirmation.

Done when: a parent books, pays, and both dashboards show it without manual SQL.

## Phase 2 — Trust

Irish parents will not hand over a child on brand alone; the schema already
anticipates this.

- Surface `is_garda_vetted`, `garda_vetting_date`, and `insurance_verified` on
  provider and activity pages.
- Admin review queue for vetting, using `reviews.is_approved`.
- Allow reviews only from a completed `booking_id`, so `is_verified` means something.
- Provider responses to reviews (`reviews.response`).

## Phase 3 — Provider self-service

Providers currently cannot manage supply without help.

- Activity create/edit, and turning a `schedules` rule into `sessions` rows.
- Attendance via `bookings.qr_code` / `checked_in`.
- Cancellations and refunds, including `cancellation_reason`.
- Subscription billing from `/pricing` writing `providers.subscription_status`.

## Phase 4 — Retention

- Waitlist auto-promotion when a place frees up, using `waitlist.position`.
- Notification centre and messaging UI.
- Favorites and follows pages (header links are placeholders today).
- Promo code redemption at checkout.

## Non-goals for now

No native apps, no multi-currency (EUR only), no provider payouts beyond Stripe
subscriptions, no i18n.

## Health before features

Carrying: 13 stale `Activio` brand strings, no migration files, denormalized
counters that can drift, and no webhook. See `launch-checklist.md`.
