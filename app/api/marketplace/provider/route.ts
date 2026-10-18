import { randomUUID } from 'node:crypto'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { applicationSchema, offerSchema } from '@/lib/marketplace/validation'
import { assertSameOrigin, marketplaceDatabase, marketplaceStripe, marketplaceUser, publicMarketplaceError, refreshProviderPayments, requireProvider } from '@/lib/marketplace/server'

export const runtime = 'nodejs'

const categoryImages: Record<string, string> = { wellness: 'recover', adventure: 'explore', fitness: 'move', learning: 'learn', family: 'family' }

export async function POST(request: Request) {
  try {
    assertSameOrigin(request)
    const body = await request.json()
    const database = marketplaceDatabase()
    if (body.action === 'apply') {
      const user = await marketplaceUser()
      const input = applicationSchema.parse(body)
      const { data: existing, error: lookupError } = await database.from('veyra_marketplace_providers').select('id').eq('user_id', user.id).maybeSingle()
      if (lookupError) throw new Error('Booking setup is not complete yet.')
      if (existing) return NextResponse.json({ ok: true })
      const { error } = await database.from('veyra_marketplace_providers').insert({ user_id: user.id, business_name: input.businessName, county: input.county, description: input.description })
      if (error) throw new Error('Could not save your provider application. Please retry.')
      return NextResponse.json({ ok: true })
    }

    const { provider, user } = await requireProvider()
    if (body.action === 'connect') {
      const stripe = marketplaceStripe()
      let accountId = provider.stripe_account_id as string | null
      if (!accountId) {
        const account = await stripe.accounts.create({
          country: 'IE', email: user.email,
          controller: { fees: { payer: 'application' }, losses: { payments: 'application' }, stripe_dashboard: { type: 'express' }, requirement_collection: 'stripe' },
          capabilities: { card_payments: { requested: true }, transfers: { requested: true } },
          business_profile: { name: provider.business_name, product_description: provider.description.slice(0, 500) },
          metadata: { veyra_provider_id: provider.id },
        }, { idempotencyKey: 'veyra-provider-' + provider.id })
        accountId = account.id
        const { error } = await database.from('veyra_marketplace_providers').update({ stripe_account_id: accountId }).eq('id', provider.id)
        if (error) throw new Error('Could not save your payment connection. Please retry.')
      }
      const origin = new URL(request.url).origin
      const link = await stripe.accountLinks.create({ account: accountId, type: 'account_onboarding', refresh_url: origin + '/provider/dashboard?connect=refresh', return_url: origin + '/provider/dashboard?connect=return' })
      return NextResponse.json({ url: link.url })
    }
    if (body.action === 'refresh-payments') {
      return NextResponse.json({ ready: await refreshProviderPayments(provider) })
    }
    if (body.action === 'payout-dashboard') {
      if (!provider.stripe_account_id) throw new Error('Complete payment onboarding first.')
      const link = await marketplaceStripe().accounts.createLoginLink(provider.stripe_account_id)
      return NextResponse.json({ url: link.url })
    }
    if (body.action === 'create-offer') {
      const input = offerSchema.parse(body)
      if (input.publish && !(await refreshProviderPayments(provider))) throw new Error('Complete payment onboarding before publishing a service.')
      const slug = input.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70) + '-' + randomUUID().slice(0, 8)
      const { data, error } = await database.rpc('veyra_marketplace_create_offer', { p_provider_id: provider.id, p_offer: {
        slug, title: input.title, description: input.description, county: input.county, category: input.category,
        image_url: '/veyra/' + categoryImages[input.category] + '.png', unit_amount: input.price,
        pricing_mode: input.pricingMode, max_guests: input.maxGuests, cancellation_terms: input.cancellationTerms,
        active: input.publish, starts_at: input.startsAt, capacity: input.capacity,
      } })
      if (error) throw new Error('Could not save your service and session. Please check the details and retry.')
      return NextResponse.json({ ok: true, id: data })
    }
    if (body.action === 'toggle-offer') {
      const id = z.string().uuid().parse(body.offerId)
      const active = z.boolean().parse(body.active)
      if (active && !(await refreshProviderPayments(provider))) throw new Error('Complete payment onboarding before publishing a service.')
      const { data, error } = await database.from('veyra_marketplace_offers').update({ active }).eq('id', id).eq('provider_id', provider.id).select('id').single()
      if (error || !data) throw new Error('Could not update your service.')
      return NextResponse.json({ ok: true })
    }
    if (body.action === 'add-slot') {
      const input = z.object({ offerId: z.string().uuid(), startsAt: z.string().datetime({ offset: true }).refine(value => Date.parse(value) > Date.now() + 3600000), capacity: z.coerce.number().int().min(1).max(10000) }).parse(body)
      const { data } = await database.from('veyra_marketplace_offers').select('id').eq('id', input.offerId).eq('provider_id', provider.id).single()
      if (!data) throw new Error('Could not find your service.')
      const { error } = await database.from('veyra_marketplace_slots').insert({ offer_id: input.offerId, starts_at: input.startsAt, capacity: input.capacity })
      if (error) throw new Error('Could not add this session. Check that it is not already listed.')
      return NextResponse.json({ ok: true })
    }
    return NextResponse.json({ error: 'Unknown request.' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: error instanceof z.ZodError ? 'Check the required fields and use a future date with an explicit time zone.' : publicMarketplaceError(error) }, { status: 400 })
  }
}
