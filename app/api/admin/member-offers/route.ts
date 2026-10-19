import { NextResponse } from 'next/server'
import { z } from 'zod'
import { assertSameOrigin, marketplaceDatabase, publicMarketplaceError, requireMarketplaceAdmin } from '@/lib/marketplace/server'

export async function POST(request: Request) {
  try {
    assertSameOrigin(request)
    const administrator = await requireMarketplaceAdmin()
    const body = await request.json()
    const database = marketplaceDatabase()
    if (body.action === 'toggle') {
      const input = z.object({ id: z.string().uuid(), active: z.boolean() }).parse(body)
      const { error } = await database.from('veyra_member_offers').update({ active: input.active }).eq('id', input.id)
      if (error) throw new Error('Could not update this member offer.')
      return NextResponse.json({ ok: true })
    }
    const input = z.object({
      title: z.string().trim().min(3).max(140), description: z.string().trim().min(10).max(3000),
      kind: z.enum(['experience', 'venue', 'benefit']), venue: z.string().trim().min(2).max(150), county: z.string().trim().min(2).max(80),
      offerId: z.string().optional(), discountPercent: z.string().optional(),
      redemption: z.string().trim().min(10).max(3000), endsAt: z.string().datetime({ offset: true }).refine(value => Date.parse(value) > Date.now()),
      active: z.boolean(), agreed: z.literal(true),
    }).parse(body)
    let serviceId = null
    let discountBps = null
    if (input.kind === 'experience') {
      serviceId = z.string().uuid().parse(input.offerId)
      const percentage = z.string().regex(/^\d{1,2}(\.\d{1,2})?$/).transform(Number).pipe(z.number().min(0.01).max(99)).parse(input.discountPercent)
      discountBps = Math.round(percentage * 100)
      const { data: service } = await database.from('veyra_marketplace_offers').select('id,unit_amount,provider:veyra_marketplace_providers!inner(approval_status)').eq('id', serviceId).eq('active', true).eq('provider.approval_status', 'approved').single()
      if (!service || Math.round(service.unit_amount * (10000 - discountBps) / 10000) < 50) return NextResponse.json({ error: 'Choose a published, approved service and a discount leaving a price of at least €0.50.' }, { status: 400 })
    }
    const { error } = await database.from('veyra_member_offers').insert({
      title: input.title, description: input.description, kind: input.kind, venue: input.venue, county: input.county,
      offer_id: serviceId, discount_bps: discountBps, redemption_instructions: input.redemption,
      ends_at: input.endsAt, active: input.active, created_by: administrator.id,
    })
    if (error) throw new Error('Could not save this member offer.')
    return NextResponse.json({ ok: true })
  } catch (error) { return NextResponse.json({ error: error instanceof z.ZodError ? 'Check the offer details, agreed terms and expiry date.' : publicMarketplaceError(error) }, { status: 400 }) }
}
