import { NextResponse } from 'next/server'
import { marketplaceDatabase, marketplaceStripe, synchronizePayment } from '@/lib/marketplace/server'
import { reconcileMembershipCheckout, synchronizeMembership } from '@/lib/membership/server'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const signature = request.headers.get('stripe-signature')
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!signature || !secret) return NextResponse.json({ error: 'Webhook verification is unavailable.' }, { status: 400 })
  let event
  try {
    event = marketplaceStripe().webhooks.constructEvent(await request.text(), signature, secret)
  } catch {
    return NextResponse.json({ error: 'Invalid webhook signature.' }, { status: 400 })
  }
  try {
    const stripe = marketplaceStripe()
    if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded' || event.type === 'checkout.session.expired') {
      const session = await stripe.checkout.sessions.retrieve(event.data.object.id)
      await synchronizePayment(session)
      await reconcileMembershipCheckout(session)
    }
    if (event.type === 'customer.subscription.created' || event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
      await synchronizeMembership(event.data.object.id)
    }
    if (event.type === 'invoice.paid' || event.type === 'invoice.payment_failed' || event.type === 'invoice.payment_action_required') {
      const subscription = event.data.object.parent?.subscription_details?.subscription
      const id = typeof subscription === 'string' ? subscription : subscription?.id
      if (id) await synchronizeMembership(id)
    }
    if (event.type === 'refund.updated' || event.type === 'refund.created' || event.type === 'refund.failed') {
      const refund = await stripe.refunds.retrieve(event.data.object.id)
      if (refund.metadata?.veyra_marketplace === '1' && refund.metadata.reservation_id) {
        const status = refund.status === 'succeeded' ? 'refunded' : refund.status === 'failed' || refund.status === 'canceled' ? 'refund_failed' : 'refund_pending'
        const { error } = await marketplaceDatabase().from('veyra_marketplace_reservations').update({ status, stripe_refund_id: refund.id }).eq('id', refund.metadata.reservation_id).eq('stripe_payment_intent_id', typeof refund.payment_intent === 'string' ? refund.payment_intent : refund.payment_intent?.id)
        if (error) throw new Error('Refund reconciliation failed.')
      }
    }
    return NextResponse.json({ received: true })
  } catch {
    console.error('Veyra marketplace webhook requires retry:', event.id, event.type)
    return NextResponse.json({ error: 'Please retry delivery.' }, { status: 500 })
  }
}
