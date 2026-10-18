'use server'

import { createClient } from '@/lib/supabase/server'

export type PromoResult =
  | { ok: true; code: string; discount: number; description: string }
  | { ok: false; error: string }

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

export async function createBooking(input: {
  activityId: string
  sessionId: string
  participantName: string
  participantAge?: string
  specialRequirements?: string
  promoCode?: string
}): Promise<CreateBookingResult> {
  void input
  return { ok: false, error: 'Use the secure Veyra checkout to book and pay.' }
}

