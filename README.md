# Veyra · Ireland launch

Next.js website for discovering Irish experiences and arranging them with a personal concierge. The launch uses a manual email enquiry workflow, with no account or app required.

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
- `/experiences/[slug]` — experience inspiration and enquiry
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

Legacy `/book/[slug]`, `/pricing` and provider onboarding entry points lead to the new manual flow. Existing authenticated dashboards and integrations are retained. Public launch routes do not depend on Supabase session refresh or require login.

## Preview and release

This redesign is reviewed on a separate branch and draft pull request. GitHub's existing Vercel integration creates the preview. Do not merge, promote the preview or assign production domains without the owner's approval.

