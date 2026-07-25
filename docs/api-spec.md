# API Specification

Veyra has **no REST API layer**. There is exactly one route handler in the app:

| Route | File | Purpose |
| --- | --- | --- |
| `GET /auth/callback` | `app/auth/callback/route.ts` | Exchanges the Supabase auth code for a session cookie |

Everything else is either a **server action** or a direct Supabase query from a
server component, with **Row Level Security as the authorization boundary**.

## Server actions

Two `'use server'` modules. These are the real mutation surface.

### `app/actions/bookings.ts`

| Action | Behaviour |
| --- | --- |
| `validatePromoCode(code, activityId)` | Validates a promo against the activity, returns the discount |
| `createBooking(input)` | Creates the booking and takes the seat |

`createBooking` does several things correctly: it requires a session, **recomputes
the price server-side** rather than trusting the client, rejects a full session,
then increments `sessions.current_participants` and `promo_codes.current_uses`.

Two defects to be aware of:

1. **It hardcodes `payment_status: 'paid'` and `status: 'confirmed'`** without
   verifying any Stripe payment. Calling it directly creates a fully paid booking
   for free. This is the single most important thing to fix before launch.
2. **The capacity check is not atomic.** It reads `current_participants`, then
   later writes `value + 1`. Two concurrent bookings can both pass the check and
   oversell. Enforce capacity in the database (a constraint, or an atomic
   increment returning the new count) instead of in application code.

### `app/actions/stripe.ts`

| Action | Behaviour |
| --- | --- |
| `startSubscriptionCheckout(productId)` | Embedded Checkout for a provider plan (`mode: 'subscription'`) |
| `startBookingCheckout(details)` | Embedded Checkout for a booking (`mode: 'payment'`) |
| `getCheckoutSessionStatus(sessionId)` | Reads back the Checkout session status |

Both use `ui_mode: 'embedded'`. Since there is no webhook,
`getCheckoutSessionStatus` is the only link between a Stripe payment and the app,
and nothing persists the result.

## Data access pattern

Three clients, one per execution context:

| File | Context | Notes |
| --- | --- | --- |
| `lib/supabase/client.ts` | Browser | Used by client components |
| `lib/supabase/server.ts` | Server components | Cookie-backed, per-request |
| `lib/supabase/middleware.ts` | Middleware | Refreshes the session on navigation |

All three read `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

> Naming matters: the code reads `NEXT_PUBLIC_SUPABASE_ANON_KEY`. A newer-style
> `sb_publishable_...` value works, but it must be exposed under the
> `ANON_KEY` name or every client fails to construct.

Because the anon key is public, **RLS is the only thing protecting data**. Any
new table must have RLS enabled and policies written, or it is world-readable.

## Route inventory

18 pages. Auth requirements are enforced in `middleware.ts` plus per-page
session checks.

### Public
| Route | File |
| --- | --- |
| `/` | `app/page.tsx` |
| `/discover` | `app/discover/page.tsx` |
| `/category/[slug]` | `app/category/[slug]/page.tsx` |
| `/activity/[slug]` | `app/activity/[slug]/page.tsx` |
| `/provider/[slug]` | `app/provider/[slug]/page.tsx` |
| `/pricing` | `app/pricing/page.tsx` |
| `/about` | `app/about/page.tsx` |

### Auth
| Route | File |
| --- | --- |
| `/auth/login` | `app/auth/login/page.tsx` |
| `/auth/sign-up` | `app/auth/sign-up/page.tsx` |
| `/auth/sign-up-success` | `app/auth/sign-up-success/page.tsx` |
| `/auth/error` | `app/auth/error/page.tsx` |
| `/auth/callback` | `app/auth/callback/route.ts` |

Sign-up requires email confirmation. Sign-out is a client call to
`supabase.auth.signOut()` in the header — there is no `/auth/logout` route.

### Authenticated
| Route | File | Guard |
| --- | --- | --- |
| `/dashboard` | `app/dashboard/page.tsx` | Any signed-in user |
| `/book/[slug]` | `app/book/[slug]/page.tsx` | Any signed-in user |
| `/booking/confirmation` | `app/booking/confirmation/page.tsx` | Any signed-in user |
| `/checkout/subscription/[productId]` | `app/checkout/subscription/[productId]/page.tsx` | Any signed-in user |
| `/provider/dashboard` | `app/provider/dashboard/page.tsx` | Must own a `providers` row |
| `/provider/onboarding` | `app/provider/onboarding/page.tsx` | Any signed-in user |
| `/admin` | `app/admin/page.tsx` | `profiles.role = 'admin'` |

Unauthenticated access to a guarded route redirects to
`/auth/login?redirect=<path>`. Verified for both `/dashboard` and
`/provider/dashboard`.

## Payments

`lib/stripe.ts` reads `STRIPE_SECRET_KEY` and `lib/products.ts` defines the
subscription tiers sold at `/pricing`.

Checkout is created by `app/actions/stripe.ts` (see above), but there is **no
Stripe webhook handler**. Nothing writes `bookings.stripe_payment_intent_id` or
`providers.subscription_status` back from Stripe, and `bookings.payment_status` is
set to `'paid'` optimistically by `createBooking` rather than on payment
confirmation. A failed or abandoned payment can still leave a booking marked paid.
This is the largest gap before charging real money — see `launch-checklist.md`.

## Conventions for new endpoints

Add a route handler only when RLS cannot express the rule, or when a secret is
required (Stripe, email, webhooks).

- Never use the service-role key in code reachable from the browser.
- `await` `params`, `searchParams`, `cookies()`, and `headers()` — all async in Next.js 16.
- Validate request bodies with `zod` (already a dependency).
- Return `401` when there is no session, `403` on a role mismatch.
- Prefer server components reading via RLS over writing a fetch endpoint.
