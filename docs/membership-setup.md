# €4.99 Veyra Membership

## What is implemented

- Prominent Member / Provider account choices in the site navigation, homepage and signup.
- `/providers` with direct provider account creation and sign-in. `/auth/sign-up?type=provider` returns verified users to the provider dashboard; consumer signup returns to `/account`.
- `/membership` presents the owner's exact €4.99/month EUR price, participating experience discounts, partner venue offers and member benefits, without inventing partners or specific savings.
- `/account` shows verified membership state, paid access expiry, genuine offers and billing/cancellation controls.
- Verified users explicitly agree to recurring monthly billing before embedded Stripe Checkout opens. Account creation alone is free and never makes someone a paid member.
- The subscription is collected by the Veyra platform directly, not transferred to a provider. Provider commissions apply separately to experience bookings.
- Price, currency, monthly interval and quantity are verified against Stripe; paid membership requires active subscription status and a paid invoice covering the membership price.
- Signed subscription, Checkout and invoice webhooks refresh entitlement from Stripe. Account reads also verify the current Stripe subscription. Expired, canceled, unpaid or past-due membership does not grant new discounts.
- Private offer instructions are rendered only after server-side membership verification. Public offer descriptions contain no private redemption instructions.
- `/admin/membership` lets authorised marketplace administrators publish genuine venue benefits and agreed experience discounts, with expiry dates and terms.
- Booking discounts use the best active offer for that service. The guest never supplies their membership identity or discount rate; the server verifies the signed-in account and the capacity-reservation RPC rechecks paid entitlement.
- Discounts are applied before provider commission. Prices and agreed discount/commission are snapshotted on the reservation. Existing checkout holds keep their original price even if membership later expires.
- No annual plan, free trial, universal percentage saving, named partner venue or redemption code is invented. The previous legacy generic subscription action is disabled so it cannot create unlinked memberships.

## Activation prerequisites

These source changes do not modify production data, activate billing or create subscriptions.

1. Follow `marketplace-setup.md` for isolated Supabase staging and Stripe test configuration.
2. Apply `202610180001_marketplace.sql` and then `202610180002_memberships.sql` in staging. The second migration adds protected membership/offer tables and replaces the reservation function with the member-aware signature. Deploy code and migrate together; the new checkout intentionally fails closed if the RPC is not present.
3. Add these **platform-account** events to the existing signed Stripe webhook:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`
   - `invoice.payment_action_required`
   Keep the marketplace Checkout/refund events from the first setup guide.
4. Configure Stripe's customer billing portal for this platform, enabling payment method management, invoices and cancellation **at period end**. Do not enable customer price/quantity changes or promotional discounts in the portal for this initial fixed-price plan.
5. Add exact trusted signup/OAuth callback URLs in Supabase. Email verification must remain enabled. Provider approval is still a separate Veyra administrator decision, never a signup metadata role.
6. Agree real partner terms and publish genuine member offers through `/admin/membership`. Experience discounts must be agreed with the provider because they affect the provider's proceeds. A discount must leave at least €0.50 per unit.
7. The system refuses new membership payments if no current member offers are published, if Stripe test/live keys mismatch the deployment environment, or if the signing secret/configuration is missing.
8. Test all flows below and obtain owner approval before any production release.

## Required verification before charging members

- Both signup choices reach the correct destination after password login, email verification and OAuth; account creation never grants a paid membership.
- A guest/unverified user cannot start or manage a subscription.
- Checkout displays exactly €4.99/month EUR; no client-supplied amount, user ID or entitlement is trusted.
- Concurrent/repeated checkout requests for one account use one database lease, one Stripe customer and one idempotent Checkout session, not multiple subscriptions.
- Successful test payment unlocks benefits only after paid invoice and subscription verification. Decline, authentication interruption, checkout expiry or failed webhook delivery do not grant access.
- Renewal success extends paid access; renewal failure or expiry removes access. Cancel-at-period-end preserves only the already-paid interval; actual cancellation removes entitlement.
- Out-of-order events for a canceled old subscription cannot replace a newer active subscription.
- Billing portal sessions belong to the signed-in account, and cancellation behaves as disclosed.
- Expired/unpublished offers disappear. Free/inactive accounts cannot obtain private redemption instructions or inject discounts into the booking API.
- A paid member's eligible service gets the best valid discount, and commission/transfer totals use the discounted amount. A non-member booking receives no member discount.
- Another user cannot access billing or private membership records by changing IDs.
- Repeat these checks with webhooks duplicated, delayed and retried, plus 320px/390px/tablet/desktop and keyboard form checks.

## Recovery and operations

A conservative checkout lease prevents double subscriptions. If a network interruption occurs between Stripe session creation and saving the session ID, the original request can be retried promptly with its unchanged idempotency key. An older ambiguous lease is not automatically discarded: the owner must investigate Stripe metadata before permitting another charge. Do not reset a lease or mark someone paid merely because a request timed out.

Account pages fail closed if live subscription verification is unavailable. Do not tell an already-paying member to pay again to fix a verification issue. Review Stripe financial records and webhook delivery. Refunds of membership invoices and membership cancellations are separate financial operations: refunds, chargebacks and exceptional adjustments require human handling in Stripe, with subscription cancellation/reconciliation as appropriate. This version does not automate membership refunds, disputes or email delivery.

Offer-specific terms, privacy/retention information, subscription disclosures and consumer obligations require owner review before launch. Partner venue redemptions initially use the genuine instructions published by the administrator, not an invented venue verification network.
