import 'server-only'
import { createHash, createHmac, randomBytes } from 'node:crypto'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import Stripe from 'stripe'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

export const guestCookie = 'veyra_booking_guest'

export function marketplaceDatabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Booking setup is not complete yet.')
  return createSupabaseClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
}

export function marketplaceStripe() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new Error('Payments are not available yet.')
  if (process.env.VERCEL_ENV !== 'production' && !/^(sk|rk)_test_/.test(key)) throw new Error('Preview payments require Stripe test mode.')
  return new Stripe(key)
}

export function paymentsConfigured() {
  const secret = process.env.STRIPE_SECRET_KEY ?? ''
  const publishable = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ''
  const validMode = process.env.VERCEL_ENV === 'production'
    ? /^(sk|rk)_live_/.test(secret) && publishable.startsWith('pk_live_')
    : /^(sk|rk)_test_/.test(secret) && publishable.startsWith('pk_test_')
  return Boolean(validMode && secret && publishable && process.env.STRIPE_WEBHOOK_SECRET && process.env.SUPABASE_SERVICE_ROLE_KEY)
}

export async function marketplaceUser() {
  const client = await createClient()
  const { data: { user }, error } = await client.auth.getUser()
  if (error || !user || !user.email_confirmed_at) throw new Error('Sign in with a verified email to continue.')
  return user
}

export async function requireMarketplaceAdmin() {
  const user = await marketplaceUser()
  const { data, error } = await marketplaceDatabase().from('veyra_marketplace_admins').select('user_id').eq('user_id', user.id).maybeSingle()
  if (error || !data) throw new Error('Administrator access is required.')
  return user
}

export async function requireProvider(approved = true) {
  const user = await marketplaceUser()
  const { data, error } = await marketplaceDatabase().from('veyra_marketplace_providers').select('*').eq('user_id', user.id).maybeSingle()
  if (error || !data || (approved && data.approval_status !== 'approved')) throw new Error('Your provider account must be approved first.')
  return { user, provider: data }
}

export async function refreshProviderPayments(provider: { id: string; stripe_account_id: string | null }) {
  if (!provider.stripe_account_id) return false
  const account = await marketplaceStripe().accounts.retrieve(provider.stripe_account_id)
  const ready = Boolean(!account.deleted && account.charges_enabled && account.payouts_enabled && account.capabilities?.transfers === 'active')
  const { error } = await marketplaceDatabase().from('veyra_marketplace_providers').update({ payments_ready: ready }).eq('id', provider.id)
  if (error) throw new Error('Could not refresh your payment account. Please retry.')
  return ready
}

export function visitorIdentity(token?: string) {
  const value = token && /^[a-f0-9]{64}$/.test(token) ? token : randomBytes(32).toString('hex')
  return { value, hash: createHash('sha256').update(value).digest('hex') }
}

export function hashAddress(address: string) {
  return createHmac('sha256', process.env.SUPABASE_SERVICE_ROLE_KEY!).update('veyra-booking:' + address).digest('hex')
}

export async function ownedReservation(id: string) {
  const token = (await cookies()).get(guestCookie)?.value
  if (!token) return null
  const { data, error } = await marketplaceDatabase().from('veyra_marketplace_reservations').select('*').eq('id', id).eq('visitor_hash', visitorIdentity(token).hash).maybeSingle()
  if (error) throw new Error('Could not retrieve your booking.')
  return data
}

export async function synchronizePayment(session: Stripe.Checkout.Session) {
  if (session.metadata?.veyra_marketplace !== '1' || !session.metadata.reservation_id) return
  const database = marketplaceDatabase()
  if (session.payment_status === 'paid' && session.status === 'complete') {
    const intentId = typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id
    if (!intentId || !session.amount_total || !session.currency) throw new Error('Payment details are incomplete.')
    const intent = await marketplaceStripe().paymentIntents.retrieve(intentId)
    const destination = typeof intent.transfer_data?.destination === 'string' ? intent.transfer_data.destination : intent.transfer_data?.destination?.id
    const { data: reservation, error } = await database.from('veyra_marketplace_reservations').select('stripe_account_id,application_fee').eq('id', session.metadata.reservation_id).single()
    if (error || !reservation || destination !== reservation.stripe_account_id || (intent.application_fee_amount ?? 0) !== reservation.application_fee || intent.status !== 'succeeded') throw new Error('Payment destination could not be verified.')
    const { error: settleError } = await database.rpc('veyra_marketplace_settle', {
      p_reservation_id: session.metadata.reservation_id,
      p_session_id: session.id,
      p_amount: session.amount_total,
      p_currency: session.currency,
      p_payment_intent: intentId,
    })
    if (settleError) throw new Error('Payment received; booking reconciliation requires a retry.')
  } else if (session.status === 'expired') {
    const { error } = await database.from('veyra_marketplace_reservations').update({ status: 'expired' }).eq('id', session.metadata.reservation_id).eq('status', 'held').eq('stripe_session_id', session.id)
    if (error) throw new Error('Could not release the expired reservation.')
  }
}

export function assertSameOrigin(request: Request) {
  if (request.headers.get('origin') !== new URL(request.url).origin) throw new Error('Please submit this request from Veyra.')
}

export function publicMarketplaceError(error: unknown) {
  const message = error instanceof Error ? error.message : ''
  const allowed = /^(Sign in with|Administrator access|Your provider account|Booking setup|Payments are not|Preview payments|Please submit|This session|This experience|There are not enough|Too many booking|Choose a valid|Start a new booking|This checkout|This group needs|Complete payment|Could not|Your payment|Provider approval|Check the|Only future|A published)/
  if (error instanceof Stripe.errors.StripeError) return 'The payment service could not complete this request. Please retry or contact Veyra.'
  return allowed.test(message) ? message : 'Could not complete this request. Please retry or contact Veyra.'
}
