import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { checkoutSchema } from '@/lib/marketplace/validation'
import { assertSameOrigin, guestCookie, hashAddress, marketplaceDatabase, marketplaceStripe, paymentsConfigured, publicMarketplaceError, refreshProviderPayments, visitorIdentity } from '@/lib/marketplace/server'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const visitor = visitorIdentity(request.cookies.get(guestCookie)?.value)
  try {
    assertSameOrigin(request)
    if (!paymentsConfigured()) throw new Error('Payments are not available yet. Please contact Veyra.')
    const input = checkoutSchema.parse(await request.json())
    const database = marketplaceDatabase()
    const { data: offer, error: offerError } = await database.from('veyra_marketplace_offers').select('provider_id').eq('id', input.offerId).eq('active', true).single()
    if (offerError || !offer) throw new Error('This experience is not currently available to book.')
    const { data: provider } = await database.from('veyra_marketplace_providers').select('id,stripe_account_id,approval_status').eq('id', offer.provider_id).single()
    if (!provider || provider.approval_status !== 'approved' || !(await refreshProviderPayments(provider))) throw new Error('This experience is not currently available to book.')
    const { data, error } = await database.rpc('veyra_marketplace_reserve', {
      p_offer_id: input.offerId, p_slot_id: input.slotId, p_request_key: input.requestKey,
      p_visitor_hash: visitor.hash, p_ip_hash: hashAddress(request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown'),
      p_guests: input.guests, p_name: input.name, p_email: input.email,
    })
    const reservation = Array.isArray(data) ? data[0] : data
    if (error || !reservation) throw new Error(error?.message ?? 'Could not reserve this session.')
    const stripe = marketplaceStripe()
    const session = await stripe.checkout.sessions.create({
      mode: 'payment', ui_mode: 'embedded', payment_method_types: ['card'], redirect_on_completion: 'if_required',
      return_url: new URL('/book/confirmation?reservation=' + reservation.id, request.url).toString(),
      customer_email: reservation.customer_email,
      expires_at: Math.floor(Date.parse(reservation.expires_at) / 1000),
      client_reference_id: reservation.id,
      metadata: { veyra_marketplace: '1', reservation_id: reservation.id },
      line_items: [{ price_data: { currency: reservation.currency, unit_amount: reservation.unit_amount, product_data: { name: reservation.title } }, quantity: reservation.pricing_mode === 'per_person' ? reservation.guests : 1 }],
      payment_intent_data: { application_fee_amount: reservation.application_fee, transfer_data: { destination: reservation.stripe_account_id }, metadata: { veyra_marketplace: '1', reservation_id: reservation.id } },
    }, { idempotencyKey: 'veyra-checkout-' + reservation.id })
    const { error: attachError } = await database.from('veyra_marketplace_reservations').update({ stripe_session_id: session.id }).eq('id', reservation.id).eq('status', 'held')
    if (attachError || !session.client_secret) throw new Error('Could not open checkout. Retry this booking to recover it.')
    const response = NextResponse.json({ clientSecret: session.client_secret, reservationId: reservation.id })
    response.cookies.set(guestCookie, visitor.value, { httpOnly: true, secure: new URL(request.url).protocol === 'https:', sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 30 })
    return response
  } catch (error) {
    const response = NextResponse.json({ error: error instanceof z.ZodError ? 'Check your details and accept the cancellation terms.' : publicMarketplaceError(error) }, { status: 400 })
    response.cookies.set(guestCookie, visitor.value, { httpOnly: true, secure: new URL(request.url).protocol === 'https:', sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 30 })
    return response
  }
}
