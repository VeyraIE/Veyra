import { NextResponse } from 'next/server'
import { z } from 'zod'
import { assertSameOrigin, marketplaceDatabase, marketplaceStripe, publicMarketplaceError, requireMarketplaceAdmin } from '@/lib/marketplace/server'

export async function POST(request: Request) {
  try {
    assertSameOrigin(request)
    const administrator = await requireMarketplaceAdmin()
    const body = await request.json()
    const database = marketplaceDatabase()
    if (body.action === 'review-provider') {
      const input = z.object({ providerId: z.string().uuid(), approved: z.boolean() }).parse(body)
      const percentage = input.approved ? z.union([z.number(), z.string().trim().regex(/^\d{1,2}(\.\d{1,2})?$/).transform(Number)]).pipe(z.number().min(0).max(99).multipleOf(0.01)).parse(body.commissionPercent) : null
      const { error } = await database.from('veyra_marketplace_providers').update({ approval_status: input.approved ? 'approved' : 'rejected', ...(percentage === null ? {} : { commission_bps: Math.round(percentage * 100) }), approved_by: administrator.id }).eq('id', input.providerId)
      if (error) throw new Error('Could not update this provider.')
      return NextResponse.json({ ok: true })
    }
    if (body.action === 'refund') {
      const id = z.string().uuid().parse(body.reservationId)
      const { data: reservation } = await database.from('veyra_marketplace_reservations').select('*').eq('id', id).single()
      if (!reservation?.stripe_payment_intent_id || reservation.status !== 'confirmed') throw new Error('Could not refund this booking in its current state.')
      const refund = await marketplaceStripe().refunds.create({ payment_intent: reservation.stripe_payment_intent_id, reverse_transfer: true, refund_application_fee: true, metadata: { veyra_marketplace: '1', reservation_id: id } }, { idempotencyKey: 'veyra-full-refund-' + id })
      const status = refund.status === 'succeeded' ? 'refunded' : 'refund_pending'
      const { error } = await database.from('veyra_marketplace_reservations').update({ stripe_refund_id: refund.id, status }).eq('id', id).eq('status', 'confirmed')
      if (error) throw new Error('Could not update the refund record. Stripe will retry reconciliation.')
      return NextResponse.json({ ok: true })
    }
    return NextResponse.json({ error: 'Unknown request.' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: error instanceof z.ZodError ? 'Check the commission percentage and required fields.' : publicMarketplaceError(error) }, { status: 400 })
  }
}
