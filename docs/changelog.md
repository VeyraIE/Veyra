# Changelog

## Unreleased

### Fixed — header never showed a signed-in state
`components/layout/header.tsx` accepted an optional `user` prop, but **all 13 call
sites rendered `<Header />` with no user**, so the site showed "Sign In" and "Join
Early Access" even while authenticated.

The header now prefers a server-provided `user` and otherwise resolves the session
itself via `supabase.auth.getUser()`, staying live through
`onAuthStateChange`. This fixed all 13 pages without threading props through each.

### Fixed — sign-out was a dead link
The menu linked to `/auth/logout`, which does not exist, so signing out 404'd.
Replaced with a real handler calling `supabase.auth.signOut()`, clearing local
state and redirecting home. Verified: the session clears and the header reverts.

### Fixed — menu links pointed at non-existent routes
Audited every signed-in destination and found six with no matching page:
`/auth/logout`, `/provider`, `/dashboard/bookings`, `/dashboard/settings`,
`/dashboard/favorites`, `/dashboard/notifications`.

- `/provider` → `/provider/dashboard` (the route that exists)
- Favorites → `/dashboard`; removed the notifications bell and its fake unread dot
- Removed the dead "My Bookings" and "Settings" items
- Added "Provider Dashboard" to the mobile menu, which was missing it

The bell's permanently-lit indicator implied unread notifications that no code
produced.

### Fixed — login broken by NULL token columns in `auth.users`
Sign-in failed with `Database error querying schema` for seeded provider accounts
while a freshly created account worked. Comparing rows showed the seeded ones had
`NULL` in GoTrue's token columns where the real signup had `''`.

GoTrue scans these into non-nullable Go strings, so `NULL` aborts the query before
credentials are checked — the "schema" error is misleading. Normalized
`confirmation_token`, `recovery_token`, `email_change`,
`email_change_token_new`, `email_change_token_current`, `phone_change`,
`phone_change_token`, and `reauthentication_token` to `''`. Login then succeeded
for both accounts.

### Fixed — duplicated page titles
The root layout defines a `%s | VEYRA` title template, and
`app/dashboard/page.tsx` also included the brand, rendering
`My Dashboard | Veyra | VEYRA`. Removed the redundant suffix.

### Added — `/docs`
`product-roadmap.md`, `database-schema.md`, `api-spec.md`, `deployment.md`,
`launch-checklist.md`, and this changelog. Written from the live schema, the route
tree, and `package.json` rather than assumptions.

An initial draft claimed there were no server actions — a `find` for `actions.ts`
had missed `app/actions/bookings.ts` and `app/actions/stripe.ts`. Corrected by
grepping for `'use server'`, which also surfaced the optimistic `payment_status`
and non-atomic capacity defects now recorded above.

### Added — Supabase agent skills
Installed `supabase/agent-skills` (`supabase`, `supabase-postgres-best-practices`)
into `.agents/skills/`. Security scan reported 0 alerts.

## Known issues

Carried into `launch-checklist.md`:

- `createBooking` sets `payment_status: 'paid'` without verifying Stripe — a
  booking can be confirmed without payment.
- Capacity is checked and incremented non-atomically, so concurrent bookings can
  oversell a session. Cancellation never decrements it.
- `bookings.child_id` is never set, so bookings are not linked to a child.
- `bookings` is empty — the flow has never completed end to end.
- No Stripe webhook, so payment state is never written back.
- 15 `Activio` strings across 8 files, including `lib/products.ts`.
- No migration files; the schema lives only in the hosted project.
- Denormalized counters drift from source rows, so some dashboard figures
  overstate reality.
- Pre-existing type errors in `app/actions/stripe.ts`,
  `components/checkout/*`, and `components/ui/calendar.tsx`.

## Verification notes

Changes above were checked in a real browser against the running app, not just
compiled. Confirmed: sign-up with email confirmation, login, signed-in header,
account menu showing real name and email, sign-out, and redirect-to-login for both
`/dashboard` and `/provider/dashboard`.

A second Supabase project (`tybxkuacwiwhvbbmwrkv`) was probed and found to have
**no tables**. The app was deliberately left pointed at `hgwauifqalovrtjqxtii`;
switching would break every data-backed page. See `deployment.md`.
