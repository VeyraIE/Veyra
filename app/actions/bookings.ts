'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

const SERVICE_FEE = 2.5

export type PromoResult =
  | { ok: true; code: string; discount: number; description: string }
  | { ok: false; error: string }

/**
 * Validates a promo code against the database rather than trusting the
 * client. Returns the discount in euro so the caller can display it, but the
 * authoritative recalculation happens again in `createBooking`.
 */
export async function validatePromoCode(
  rawCode: string,
  activityId: string,
): Promise<PromoResult> {
  const code = rawCode.trim().toUpperCase()
  if (!code) return { ok: false, error: 'Enter a promo code.' }

  const supabase = await createClient()

  const { data: activity } = await supabase
    .from('activities')
    .select('id, price')
    .eq('id', activityId)
    .maybeSingle()

  if (!activity) return { ok: false, error: 'Activity not found.' }

  const { data: promo, error } = await supabase
    .from('promo_codes')
    .select('*')
    .eq('code', code)
    .eq('is_active', true)
    .maybeSingle()

  if (error || !promo) {
    return { ok: false, error: 'That code is not valid.' }
  }

  const now = new Date()
  if (promo.valid_from && new Date(promo.valid_from) > now) {
    return { ok: false, error: 'That code is not active yet.' }
  }
  if (promo.valid_until && new Date(promo.valid_until) < now) {
    return { ok: false, error: 'That code has expired.' }
  }
  if (
    promo.max_uses !== null &&
    promo.max_uses !== undefined &&
    (promo.current_uses ?? 0) >= promo.max_uses
  ) {
    return { ok: false, error: 'That code has reached its usage limit.' }
  }

  // A promo may be restricted to specific activities.
  const restricted = promo.activity_ids as string[] | null
  if (restricted && restricted.length > 0 && !restricted.includes(activityId)) {
    return { ok: false, error: 'That code does not apply to this activity.' }
  }

  const price = Number(activity.price ?? 0)
  if (promo.min_purchase && price < Number(promo.min_purchase)) {
    return {
      ok: false,
      error: `That code needs a minimum spend of €${Number(promo.min_purchase).toFixed(2)}.`,
    }
  }

  const discount =
    promo.discount_type === 'fixed'
      ? Math.min(Number(promo.discount_value), price)
      : (price * Number(promo.discount_value)) / 100

  return {
    ok: true,
    code,
    discount: Math.round(discount * 100) / 100,
    description: promo.description ?? `${promo.discount_value}% off`,
  }
}

export type CreateBookingResult =
  | { ok: true; bookingId: string; reference: string }
  | { ok: false; error: string }

/**
 * Creates the booking row. Prices are recomputed server-side from the
 * activity and promo records so a tampered client cannot change what is
 * stored, and capacity is re-checked before the seat is taken.
 */
export async function createBooking(input: {
  activityId: string
  sessionId: string
  participantName: string
  participantAge?: string
  specialRequirements?: string
  promoCode?: string
}): Promise<CreateBookingResult> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, error: 'You need to be signed in to book.' }
  }

  const { data: activity } = await supabase
    .from('activities')
    .select('id, price, provider_id, title')
    .eq('id', input.activityId)
    .maybeSingle()

  if (!activity) return { ok: false, error: 'Activity not found.' }

  const { data: session } = await supabase
    .from('sessions')
    .select('*')
    .eq('id', input.sessionId)
    .maybeSingle()

  if (!session) return { ok: false, error: 'That session is no longer available.' }

  const capacity = session.max_participants ?? 0
  if (capacity > 0 && (session.current_participants ?? 0) >= capacity) {
    return { ok: false, error: 'That session is now full.' }
  }

  // Recompute money server-side.
  const price = Number(activity.price ?? 0)
  let discount = 0
  let appliedCode: string | null = null

  if (input.promoCode) {
    const promo = await validatePromoCode(input.promoCode, input.activityId)
    if (promo.ok) {
      discount = promo.discount
      appliedCode = promo.code
    }
  }

  const amount = Math.round((price - discount + SERVICE_FEE) * 100) / 100
  const reference = `VY-${new Date().getFullYear()}-${Math.random()
    .toString(36)
    .slice(2, 8)
    .toUpperCase()}`

  const { data: booking, error } = await supabase
    .from('bookings')
    .insert({
      user_id: user.id,
      activity_id: activity.id,
      provider_id: activity.provider_id,
      session_id: session.id,
      status: 'confirmed',
      payment_status: 'paid',
      amount,
      currency: 'EUR',
      promo_code: appliedCode,
      discount_amount: discount,
      participant_name: input.participantName,
      participant_age: input.participantAge
        ? Number(input.participantAge)
        : null,
      special_requirements: input.specialRequirements || null,
      booking_date: session.date,
      booking_time: session.start_time,
      qr_code: reference,
    })
    .select('id')
    .single()

  if (error || !booking) {
    console.log('[v0] createBooking failed:', error?.message)
    return { ok: false, error: 'We could not save your booking. Please try again.' }
  }

  // Take the seat and record the promo redemption.
  await supabase
    .from('sessions')
    .update({ current_participants: (session.current_participants ?? 0) + 1 })
    .eq('id', session.id)

  if (appliedCode) {
    const { data: promoRow } = await supabase
      .from('promo_codes')
      .select('id, current_uses')
      .eq('code', appliedCode)
      .maybeSingle()

    if (promoRow) {
      await supabase
        .from('promo_codes')
        .update({ current_uses: (promoRow.current_uses ?? 0) + 1 })
        .eq('id', promoRow.id)
    }
  }

  revalidatePath('/dashboard')

  return { ok: true, bookingId: booking.id, reference }
}
