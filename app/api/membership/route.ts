import { NextResponse } from 'next/server'
import { z } from 'zod'
import { assertSameOrigin, marketplaceDatabase, marketplaceStripe, marketplaceUser, paymentsConfigured, publicMarketplaceError } from '@/lib/marketplace/server'
import { getMembership, memberOffers, reconcileMembershipCheckout } from '@/lib/membership/server'
import { membershipName, membershipPrice } from '@/lib/membership/constants'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    assertSameOrigin(request)
    const user = await marketplaceUser()
    const body = z.object({ action: z.enum(['checkout', 'status', 'portal']), acceptRecurring: z.boolean().optional() }).parse(await request.json())
    const database = marketplaceDatabase()
    if (body.action === 'status') {
      const membership = await getMembership(user.id)
      return NextResponse.json({ status: membership?.status ?? 'inactive', paidUntil: membership?.paid_until ?? null }, { headers: { 'Cache-Control': 'no-store' } })
    }
    if (!paymentsConfigured()) return NextResponse.json({ error: 'Membership payments are not available yet. No charge has been made.' }, { status: 503 })
    const stripe = marketplaceStripe()
    let membership = await getMembership(user.id)
    if (body.action === 'portal') {
      if (!membership?.stripe_customer_id) throw new Error('Could not find your membership billing account.')
      const portal = await stripe.billingPortal.sessions.create({ customer: membership.stripe_customer_id, return_url: new URL('/account', request.url).toString() })
      return NextResponse.json({ url: portal.url })
    }
    if (!body.acceptRecurring) throw new Error('Check the monthly billing agreement before continuing.')
    if ((await memberOffers()).length === 0) return NextResponse.json({ error: 'Our first member offers are being prepared. We are not accepting membership payments yet.' }, { status: 409 })
    if (membership?.stripe_subscription_id && !['inactive', 'canceled', 'incomplete_expired'].includes(membership.status)) return NextResponse.json({ error: 'You already have a membership subscription. Use Manage billing instead of subscribing again.' }, { status: 409 })
    const { error: insertError } = await database.from('veyra_memberships').upsert({ user_id: user.id }, { onConflict: 'user_id', ignoreDuplicates: true })
    if (insertError) throw new Error('Membership setup is not complete yet.')
    membership = await getMembership(user.id, false)
    if (!membership) throw new Error('Could not prepare your membership.')
    let customerId = membership.stripe_customer_id
    if (!customerId) {
      const customer = await stripe.customers.create({ email: user.email, metadata: { veyra_user_id: user.id } }, { idempotencyKey: 'veyra-member-customer-' + user.id })
      customerId = customer.id
      const { error } = await database.from('veyra_memberships').update({ stripe_customer_id: customerId }).eq('user_id', user.id)
      if (error) throw new Error('Could not save your billing account.')
    }
    if (membership.checkout_session_id) {
      const existing = await stripe.checkout.sessions.retrieve(membership.checkout_session_id)
      if (existing.status === 'open' && existing.client_secret) return NextResponse.json({ clientSecret: existing.client_secret })
      if (existing.status === 'complete') {
        await reconcileMembershipCheckout(existing)
        const current = await getMembership(user.id, false)
        if (!current || !['canceled', 'incomplete_expired'].includes(current.status)) return NextResponse.json({ error: 'Your membership payment is being verified. Refresh your account; do not pay again.' }, { status: 409 })
      }
      const { error } = await database.from('veyra_memberships').update({ checkout_session_id: null, checkout_request_key: null, checkout_expires_at: null }).eq('user_id', user.id).eq('checkout_session_id', existing.id)
      if (error) throw new Error('Could not refresh your membership checkout.')
    }
    const { data, error: leaseError } = await database.rpc('veyra_membership_begin_checkout', { p_user_id: user.id })
    const lease = Array.isArray(data) ? data[0] : data
    if (leaseError || !lease) throw new Error('Could not start membership checkout. Manage an existing subscription from your account.')
    if (Date.parse(lease.checkout_expires_at) < Date.now() + 30 * 60000 && !lease.checkout_session_id) throw new Error('Could not safely recover this checkout. Contact hello@veyra.ie before paying again.')
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription', ui_mode: 'embedded_page', redirect_on_completion: 'if_required', payment_method_types: ['card'],
      customer: customerId, return_url: new URL('/account?membership=return', request.url).toString(),
      expires_at: Math.floor(Date.parse(lease.checkout_expires_at) / 1000),
      client_reference_id: user.id, metadata: { veyra_membership: '1', user_id: user.id },
      subscription_data: { metadata: { veyra_membership: '1', user_id: user.id } },
      line_items: [{ price_data: { currency: 'eur', unit_amount: membershipPrice, recurring: { interval: 'month' }, product_data: { name: membershipName, description: 'Member benefits, participating experience discounts and partner venue offers.' } }, quantity: 1 }],
    }, { idempotencyKey: 'veyra-member-checkout-' + lease.checkout_request_key })
    const { error } = await database.from('veyra_memberships').update({ checkout_session_id: session.id }).eq('user_id', user.id).eq('checkout_request_key', lease.checkout_request_key)
    if (error || !session.client_secret) throw new Error('Could not save your membership checkout. Retry without changing your account.')
    return NextResponse.json({ clientSecret: session.client_secret })
  } catch (error) {
    return NextResponse.json({ error: error instanceof z.ZodError ? 'Check your membership request.' : publicMarketplaceError(error) }, { status: 400 })
  }
}
