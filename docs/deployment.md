# Deployment

## Stack

| | |
| --- | --- |
| Framework | Next.js 16.2.6 (App Router) |
| React | 19 |
| Language | TypeScript 5.7.3 |
| Styling | Tailwind CSS 4.2.0 |
| Database / Auth | Supabase (`@supabase/supabase-js` 2.105.4, `@supabase/ssr` 0.10.3) |
| Payments | Stripe 22.1.1 |
| Validation | Zod 3.24.1 |
| Host | Vercel |

Scripts: `dev`, `build`, `start`, `lint`.

## Environment variables

| Variable | Scope | Used by |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Public | all three Supabase clients |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | all three Supabase clients |
| `STRIPE_SECRET_KEY` | Server only | `lib/stripe.ts` |

The exact name `NEXT_PUBLIC_SUPABASE_ANON_KEY` is what the code reads. A modern
`sb_publishable_...` key is fine, but it must be set under that name. Setting only
`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` leaves the app with an undefined key and
every Supabase call fails at construction.

Never expose the service-role key to the client.

## Supabase projects

Two projects have been referenced. They are not interchangeable:

| Project ref | State |
| --- | --- |
| `hgwauifqalovrtjqxtii` | **Active.** All 15 tables, RLS policies, and seed data. |
| `tybxkuacwiwhvbbmwrkv` | **Empty.** Auth responds, but none of the tables exist. |

Pointing the app at the empty project makes every data-backed page fail. Because
the repo has **no migration files**, the schema cannot be recreated from source —
it exists only in the active project.

### Before switching projects

1. Export the live schema:
   `supabase db dump --db-url "<active-project-url>" -f supabase/migrations/0001_init.sql`
2. Commit it, so the schema is reproducible.
3. Apply it to the target project and confirm all 15 tables plus RLS policies exist.
4. Seed categories and any demo providers/activities.
5. Only then change the env vars.

Adding migration files is a prerequisite for having more than one environment.

## Deploying

Vercel builds from the connected branch on push.

1. Set the three env variables for Preview and Production.
2. Push; Vercel runs `next build`.
3. In Supabase → Authentication → URL Configuration, add the deployment origin to
   the redirect allow-list, or `/auth/callback` rejects the code exchange and
   confirmation links break.

### Auth redirect URLs

Every origin needs registering: `http://localhost:3000`, the production domain,
and preview URLs (a wildcard such as `https://*-<team>.vercel.app` covers these).
Missing entries are the usual cause of a confirmation link landing on
`/auth/error`.

## Post-deploy verification

`next build` succeeding proves nothing about data access — RLS failures surface
only at runtime. Check by hand:

1. Sign up, confirm the email, and land on `/dashboard`.
2. Confirm the header shows the signed-in state, then sign out.
3. Load `/dashboard` while signed out and confirm it redirects to
   `/auth/login?redirect=/dashboard`.
4. Load `/discover` and a `/activity/[slug]` page and confirm real records render.
5. Sign in as a provider owner and load `/provider/dashboard`.

## Known constraints

- No Stripe webhook handler, so payment state is never written back.
- No migration files (see above).
- Denormalized counters can drift from real rows; see `database-schema.md`.
