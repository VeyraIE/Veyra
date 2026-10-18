# Veyra · Ireland launch

Next.js website for discovering Irish experiences and arranging them with a personal concierge. Approved providers manage their own services, prices and sessions. Customers book and pay on-site through Stripe Connect, without an account or app. Concierge and hotel enquiries retain the manual email workflow.

## Development

Use the existing pnpm lockfile and Node 24:

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm exec tsc --project tsconfig.launch.json --noEmit
pnpm build
```

Vercel runs the launch TypeScript check before the production build. The launch configuration checks the redesigned public routes and their imports. The repository's existing Next.js setting that skips a full legacy-app type check is preserved.

## Public launch routes

- `/` — the Ireland edit and brand introduction
- `/discover` — category, county and text filters, reflected in the URL
- `/experiences/[slug]` — live provider service details, or clearly labelled editorial inspiration
- `/book` and `/book/[slug]` — published services and secure guest checkout
- `/book/confirmation` — private guest confirmation after Stripe verification
- `/provider/dashboard` — applications, payment onboarding, service/session management and bookings
- `/admin/marketplace` — owner-authorised approvals, commission settings and full refunds
- `/concierge` — personal planning
- `/partners` — separate provider and hotel partnership funnels
- `/request` — experience, concierge, provider and hotel enquiries
- `/privacy` — enquiry data handling

Existing photography stays in `public/veyra`. Update the editorial collection in `lib/experience-edit.ts`. These entries are inspiration, not live inventory: the interface makes clear that providers, availability and prices must be confirmed personally.

## Manual enquiry and booking workflow

1. A visitor completes the enquiry form and reviews a prepared email.
2. They choose to open their email service and send it to the existing `hello@veyra.ie` address, or copy the enquiry into their usual email service.
3. The team checks providers, availability, suitability and pricing and sends a personal proposal, including any concierge fee and cancellation terms.
4. The visitor approves the proposal; the team arranges and confirms the booking directly.

The form does not send messages, create database rows, take payment, reserve capacity or claim a booking is confirmed. No personal enquiry data is stored in browser storage. The inbox must be monitored by the operating team.

## Provider marketplace and activation

See [Marketplace setup](docs/marketplace-setup.md) for staging migration, administrator bootstrap, Stripe Connect, webhook configuration, reconciliation and the required end-to-end payment checklist. Deploying code does not apply the migration or activate payments. Previews reject live Stripe credentials and checkout fails closed without the signing secret. No invented services, prices, dates or commission rate are seeded.

Providers apply using verified Supabase accounts. A trusted marketplace administrator approves them and explicitly agrees a commission percentage. Approved providers connect Stripe, add services and sessions, and publish when eligible. Payment amounts, commission and capacity are checked server-side. A booking becomes confirmed only after verification with Stripe. Full administrator refunds reverse both the provider transfer and Veyra commission. Email delivery is not implemented; confirmation pages and dashboards display booking records.

The unsafe legacy booking-creation and client-priced checkout actions are disabled. Existing subscriptions and unrelated dashboards remain separate legacy features. `/provider/onboarding` now opens the provider application flow. `/pricing` still leads to partnerships.

## Preview and release

This redesign is reviewed on a separate branch and draft pull request. GitHub's existing Vercel integration creates the preview. Do not merge, promote the preview or assign production domains without the owner's approval.
