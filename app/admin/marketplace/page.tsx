import { PageShell } from '@/components/veyra/site-shell'
import { MarketplaceHeading } from '@/components/marketplace/presentation'
import { AdminPanel } from '@/components/marketplace/admin-panel'
import { marketplaceDatabase, paymentsConfigured, requireMarketplaceAdmin } from '@/lib/marketplace/server'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Marketplace management', robots: { index: false, follow: false } }

export default async function MarketplaceAdmin() {
  try { await requireMarketplaceAdmin() } catch {
    return <PageShell><section className="mx-auto max-w-4xl px-4 py-16"><MarketplaceHeading eyebrow="Veyra administration" title="Administrator access required">Sign in with an authorised, verified Veyra administrator account. Marketplace access must be granted by the platform owner.</MarketplaceHeading></section></PageShell>
  }
  const database = marketplaceDatabase()
  const [providers, bookings] = await Promise.all([
    database.from('veyra_marketplace_providers').select('id,business_name,description,county,approval_status,commission_bps').order('created_at', { ascending: false }).limit(200),
    database.from('veyra_marketplace_reservations').select('id,title,status,customer_name,customer_email,total_amount,application_fee,starts_at').order('created_at', { ascending: false }).limit(200),
  ])
  if (providers.error || bookings.error) return <PageShell><section className="mx-auto max-w-4xl px-4 py-16"><MarketplaceHeading eyebrow="Veyra administration" title="Could not load marketplace records">Please check the marketplace database setup and retry.</MarketplaceHeading></section></PageShell>
  return <PageShell><section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"><MarketplaceHeading eyebrow="Veyra administration" title="Marketplace management">Approve providers, agree commission, and manage verified booking payments.</MarketplaceHeading><AdminPanel providers={providers.data ?? []} bookings={bookings.data ?? []} paymentSetup={paymentsConfigured()} /></section></PageShell>
}
