import Link from 'next/link'
import type { ComponentProps } from 'react'
import { PageShell } from '@/components/veyra/site-shell'
import { MarketplaceHeading, buttonClass } from '@/components/marketplace/presentation'
import { ProviderPortal } from '@/components/marketplace/provider-portal'
import { createClient } from '@/lib/supabase/server'
import { marketplaceDatabase } from '@/lib/marketplace/server'

export const dynamic = 'force-dynamic'

export default async function ProviderDashboard() {
  const client = await createClient()
  const { data: { user } } = await client.auth.getUser()
  if (!user) return <PageShell><section className="mx-auto max-w-7xl px-4 py-16 sm:px-6"><MarketplaceHeading eyebrow="Veyra for providers" title="Your experiences. Your business.">Apply for approval, add services and available sessions, and manage bookings in one place.</MarketplaceHeading><Link className={buttonClass} href="/auth/login?redirect=/provider/dashboard">Sign in to continue</Link><p className="mt-5 text-sm text-muted-foreground">New to Veyra? <Link className="text-primary" href="/auth/sign-up">Create an account</Link>, verify your email, then return here to apply.</p></section></PageShell>
  if (!user.email_confirmed_at) return <PageShell><section className="mx-auto max-w-7xl px-4 py-16"><MarketplaceHeading eyebrow="Provider accounts" title="Verify your email first">Please use the verification link in your inbox before applying.</MarketplaceHeading></section></PageShell>
  let configured = true
  let provider = null
  let offers: ComponentProps<typeof ProviderPortal>['offers'] = []
  let bookings: ComponentProps<typeof ProviderPortal>['bookings'] = []
  try {
    const database = marketplaceDatabase()
    const result = await database.from('veyra_marketplace_providers').select('id,business_name,approval_status,commission_bps,payments_ready,stripe_account_id').eq('user_id', user.id).maybeSingle()
    if (result.error) configured = false
    provider = result.data
    if (provider?.approval_status === 'approved') {
      const offerResult = await database.from('veyra_marketplace_offers').select('id,slug,title,active,unit_amount,pricing_mode,slots:veyra_marketplace_slots(id,starts_at,capacity)').eq('provider_id', provider.id).order('created_at', { ascending: false })
      offers = offerResult.data ?? []
      const bookingResult = await database.from('veyra_marketplace_reservations').select('id,title,starts_at,guests,total_amount,application_fee,customer_name,customer_email,status').eq('provider_id', provider.id).neq('status', 'held').neq('status', 'expired').order('created_at', { ascending: false }).limit(100)
      bookings = bookingResult.data ?? []
    }
  } catch { configured = false }
  return <PageShell><section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"><MarketplaceHeading eyebrow="Veyra for providers" title="Provider dashboard">A direct connection between what you do best and people looking for something extraordinary.</MarketplaceHeading><ProviderPortal provider={provider} offers={offers} bookings={bookings} configured={configured} /></section></PageShell>
}
