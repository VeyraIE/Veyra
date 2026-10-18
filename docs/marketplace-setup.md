# Veyra marketplace activation

## Status and boundaries

The draft branch implements approved-provider self-service listings, session capacity, guest booking, embedded Stripe payment, commission transfers, booking verification and administrator full refunds. It preserves the original Veyra homepage design.

Code deployment alone does not activate the marketplace. This change does not apply a database migration, create an administrator, open financial accounts, configure Stripe webhooks or accept live payments. The existing production deployment and production data remain unchanged. The static Ireland edit remains inspiration, never invented saleable inventory.

## Architecture

- Existing Supabase authentication is reused for verified provider and administrator accounts. Guests do not need an account.
- New tables are namespaced `veyra_marketplace_*`; legacy provider/activity/booking tables are not reused or migrated.
- The service-role key is server-only. RLS is enabled and anonymous/authenticated database access and RPC execution are revoked. All marketplace reads/writes go through server code with verified ownership or administrator checks.
- Administrator access comes exclusively from `veyra_marketplace_admins`, not editable profile metadata or a client-provided role.
- Approval requires an explicit commission percentage, stored as integer basis points. There is no assumed/default commercial rate. New holds snapshot the rate; changing terms does not reprice existing reservations.
- Approved providers enter their actual service description, county, category, EUR price, per-person/per-group basis, maximum guests, cancellation policy and first dated session. They can add sessions and publish/unpublish. Category artwork is reused from the original site; custom uploads and editing existing offers are not included in this initial workflow. Unpublish and create a replacement to change a service; existing bookings keep snapshots.
- Stripe Connect destination charges collect payment on the Veyra platform account, retain the application fee and transfer the remainder to the provider's connected account. Stripe processing fees/Connect costs affect Veyra's net margin, not the displayed provider commission calculation. Bank payout timing is controlled by Stripe and account eligibility, not promised as instant.
- Embedded Checkout accepts cards, including Stripe's supported card authentication flow. The server obtains prices, provider destination, commission and capacity from the database; client amounts are never accepted.
- A row lock on each session makes capacity reservation atomic. An idempotency key protects retries. A keyed hash of the network address limits reservation creation to five attempts per ten minutes. This is abuse mitigation, not complete DDoS/bot protection; configure appropriate platform rate limits before launch.
- Paid status is accepted only after Stripe verifies a completed, paid session, successful PaymentIntent, exact amount/currency, provider destination and application fee. A signed webhook and the guest confirmation/status endpoint reconcile idempotently.
- Holds are released only when Stripe confirms that Checkout expired, not just because a local timer elapsed. Pending/failed refunds retain capacity until a successful refund is verified.
- Full administrator refunds reverse the provider transfer and application fee using an idempotency key. Partial refunds, disputes and adjustments performed outside Veyra require manual reconciliation. Do not edit booking status to simulate payment.

## Activate in an isolated test environment first

1. Provision a separate Supabase staging project (or an isolated database branch). Do not apply this migration to the shared production database merely to test a preview.
2. Set preview-only `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` from that test project. Never expose the service-role key to the browser, chat or Git.
3. Review and apply `supabase/migrations/202610180001_marketplace.sql` to the test database. It is a transactional, additive migration. It must be applied once using a privileged database owner. Configure Supabase authentication/site URLs and an exact trusted preview callback URL.
4. In Stripe test mode, enable Connect for the Veyra platform. Set preview-only `STRIPE_SECRET_KEY=sk_test_...` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...`. Preview code refuses financial operations with live Stripe keys.
5. Create a Stripe **platform-account** test webhook targeting `https://<trusted-preview-host>/api/stripe/webhook`. Subscribe to `checkout.session.completed`, `checkout.session.expired`, `checkout.session.async_payment_succeeded`, `refund.created`, `refund.updated`, and `refund.failed`. Store the signing secret as preview-only `STRIPE_WEBHOOK_SECRET`. For a protected preview, provide an approved automation bypass scoped to that preview, following Vercel's supported webhook protection mechanism; do not disable deployment protection globally.
6. Create and verify the owner's test user normally in Supabase, then grant marketplace administration through trusted database administration only:

```sql
insert into public.veyra_marketplace_admins (user_id)
values ('<verified-owner-auth-user-uuid>');
```

7. Use `/provider/dashboard` to apply as a separate provider account. In `/admin/marketplace`, review the application and enter the agreed commission. Approval does not accept terms on the provider's behalf.
8. The provider completes Stripe's own test onboarding and checks payment status in their dashboard. Do not have an agent enter financial identity/bank details or accept Stripe terms for a real provider. Account eligibility and platform country compatibility must be verified with Stripe.
9. Add a real test service and future session. Price and capacity have no invented defaults. Publish only after payment setup is ready. Listings appear in `/discover`, `/book` and their detail pages.
10. Complete the checks below using Stripe test credentials and disposable staging data, then obtain owner approval before production activation.

## Required end-to-end checks

- Verified provider applies; unverified, pending and rejected accounts cannot list, publish, connect payments or view another provider's records.
- Non-administrators cannot review providers, change commission or issue refunds. New users cannot self-assign admin status.
- Provider creates a draft, adds a session and publishes only after Connect is ready.
- Public filters include published provider listings alongside clearly separate inspiration cards; drafts/suspended providers are absent.
- Guest selects a dated session and valid guest count. Tampering with offer/session IDs, quantity, price or application fee cannot change authoritative charges.
- One remaining place and concurrent checkouts: exactly one hold succeeds. Repeating the same request returns the existing hold/session.
- Successful test payment confirms exactly once and appears in provider/admin records. Decline/authentication failure does not confirm. Closing the browser does not lose webhook fulfillment.
- Check the test platform charge, application fee and connected-account transfer against the chosen commission; test card authentication and the return URL.
- Expired Checkout releases capacity only after Stripe verification. Duplicate/out-of-order webhook delivery cannot double-book or revert a confirmed/refunded record.
- Guest booking details cannot be retrieved with another browser's cookie, missing cookie or another reservation ID.
- Test a full refund, transfer reversal, commission refund and subsequent webhook delivery; capacity releases only on successful refund.
- If Stripe is unavailable or signature verification fails, no success is shown. Missing credentials/webhook configuration must leave payment disabled.
- Test 320px, 390px, tablet and desktop layouts and keyboard form operation.

These payment/database checks are **not verified merely by a passing build**. They require the staging setup above.

## Operational reconciliation

Set a strong server-only `CRON_SECRET` and invoke `GET /api/marketplace/reconcile` using `Authorization: Bearer <secret>` from a trusted scheduler. No cron schedule is installed automatically. This retries up to 50 expired held records with attached Stripe session IDs; it verifies Stripe state before releasing seats. Monitor nonzero retry counts, failed Stripe webhook deliveries and old held records.

A network failure between hold creation and Stripe session attachment can leave a held row without a session ID. The original guest can retry the same request with its unchanged idempotency key. For orphaned holds, an administrator must locate the matching Stripe session/PaymentIntent by reservation metadata and reconcile it; never release by clock alone or assume that a timeout means no payment occurred. This conservative behaviour prefers unavailable seats over overselling. Such records appear in the admin list for manual investigation.

Refunds requested in Veyra carry reservation metadata for webhook reconciliation. Refunds/disputes initiated elsewhere, partial refunds, Stripe account restrictions and chargebacks need operator review. Stripe financial records remain authoritative. Monitor them before every payout/reconciliation cycle. Automated dispute handling and email delivery are not included.

## Production release gate

Do not merge/promote without owner approval. Before activation: pass all staging checks, verify Stripe live Connect configuration and platform obligations, agree commission/provider contracts and consumer cancellation terms, finalise a suitable privacy/retention policy, configure the live webhook and reconciliation schedule, grant the owner's admin account explicitly, and verify payment/refund operations with appropriate human approval. Do not copy test keys or test provider account IDs into production.

There is no automatic booking email service. The confirmation page says so and provides a reference; providers/admins see booking records. Concierge and hotel enquiries remain an explicit review-and-send email workflow.
