import 'server-only'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'
import { marketplaceDatabase, marketplaceStripe } from '@/lib/marketplace/server'
import { membershipPrice } from './constants'

export type Membership = { user_id: string; status: string; paid_until: string | null; cancel_at_period_end: boolean; stripe_customer_id: string | null; stripe_subscription_id: string | null; checkout_session_id: string | null; checkout_expires_at: string | null; checkout_request_key: string | null }
export type MemberOffer = { id: string; title: string; description: string; kind: string; venue: string; county: string; ends_at: string; discount_bps: number | null; offer_id: string | null; redemption_instructions?: string; active?: boolean }

export function membershipActive(membership: Membership | null) {
  return membership?.status === 'active' && Date.parse(membership.paid_until ?? '') > Date.now()
}

export async function memberOffers(privateDetails = false): Promise<MemberOffer[]> {
  try {
    const columns = 'id,title,description,kind,venue,county,ends_at,discount_bps,offer_id' + (privateDetails ? ',redemption_instructions' : '')
    const { data, error } = await marketplaceDatabase().from('veyra_member_offers').select(columns).eq('active', true).gt('ends_at', new Date().toISOString()).order('created_at', { ascending: false }).abortSignal(AbortSignal.timeout(3500))
    if (error) return []
    return data as unknown as MemberOffer[]
  } catch { return [] }
}

export async function synchronizeMembership(subscriptionId: string) {
  const stripe = marketplaceStripe()
  const subscription = await stripe.subscriptions.retrieve(subscriptionId, { expand: ['latest_invoice'] })
  if (subscription.metadata.veyra_membership !== '1' || !subscription.metadata.user_id) return
  const userId = subscription.metadata.user_id
  const database = marketplaceDatabase()
  const { data: record, error } = await database.from('veyra_memberships').select('*').eq('user_id', userId).single()
  const customer = typeof subscription.customer === 'string' ? subscription.customer : subscription.customer.id
  if (error || !record || record.stripe_customer_id !== customer) throw new Error('Membership customer could not be verified.')
  if (record.stripe_subscription_id && record.stripe_subscription_id !== subscriptionId && !['inactive', 'canceled', 'incomplete_expired'].includes(record.status)) return
  const item = subscription.items.data[0]
  if (subscription.items.data.length !== 1 || item.quantity !== 1 || item.price.unit_amount !== membershipPrice || item.price.currency !== 'eur' || item.price.recurring?.interval !== 'month' || item.price.recurring.interval_count !== 1) throw new Error('Membership plan could not be verified.')
  const invoice = typeof subscription.latest_invoice === 'string' ? await stripe.invoices.retrieve(subscription.latest_invoice) : subscription.latest_invoice
  const paidUntil = invoice?.status === 'paid' && invoice.amount_paid >= membershipPrice && invoice.currency === 'eur'
    ? new Date(item.current_period_end * 1000).toISOString() : record.paid_until
  const { error: updateError } = await database.from('veyra_memberships').update({
    stripe_subscription_id: subscriptionId, status: subscription.status, paid_until: paidUntil,
    cancel_at_period_end: subscription.cancel_at_period_end, updated_at: new Date().toISOString(),
  }).eq('user_id', userId).or('stripe_subscription_id.is.null,stripe_subscription_id.eq.' + subscriptionId + ',status.in.(inactive,canceled,incomplete_expired)')
  if (updateError) throw new Error('Could not reconcile membership.')
}

export async function reconcileMembershipCheckout(session: Stripe.Checkout.Session) {
  if (session.metadata?.veyra_membership !== '1' || session.status !== 'complete') return
  const id = typeof session.subscription === 'string' ? session.subscription : session.subscription?.id
  if (!id) throw new Error('Could not verify the subscription.')
  await synchronizeMembership(id)
}

export async function getMembership(userId: string, refresh = true): Promise<Membership | null> {
  const database = marketplaceDatabase()
  const { data, error } = await database.from('veyra_memberships').select('*').eq('user_id', userId).maybeSingle()
  if (error) throw new Error('Membership setup is not complete yet.')
  if (!data) return null
  if (refresh && data.checkout_session_id) await reconcileMembershipCheckout(await marketplaceStripe().checkout.sessions.retrieve(data.checkout_session_id))
  else if (refresh && data.stripe_subscription_id) await synchronizeMembership(data.stripe_subscription_id)
  if (!refresh) return data
  const result = await database.from('veyra_memberships').select('*').eq('user_id', userId).single()
  if (result.error) throw new Error('Could not retrieve your membership.')
  return result.data
}

export async function bookingMember() {
  try {
    const client = await createClient()
    const { data: { user } } = await client.auth.getUser()
    if (!user?.email_confirmed_at) return null
    return membershipActive(await getMembership(user.id)) ? user.id : null
  } catch { return null }
}

export async function memberBookingPrice(offerId: string, baseAmount: number) {
  const userId = await bookingMember()
  if (!userId) return null
  const { data } = await marketplaceDatabase().from('veyra_member_offers').select('discount_bps').eq('offer_id', offerId).eq('kind', 'experience').eq('active', true).gt('ends_at', new Date().toISOString()).order('discount_bps', { ascending: false }).limit(1).maybeSingle()
  return data ? { unitAmount: Math.max(50, Math.round(baseAmount * (10000 - data.discount_bps) / 10000)), percentage: data.discount_bps / 100 } : null
}
