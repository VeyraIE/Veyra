import Link from 'next/link'
import { PageShell } from '@/components/veyra/site-shell'
import { MarketplaceHeading, secondaryClass } from '@/components/marketplace/presentation'
import { AdminMemberOffers } from '@/components/membership/admin-offers'
import { marketplaceDatabase, requireMarketplaceAdmin } from '@/lib/marketplace/server'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Member offer management', robots: { index: false, follow: false } }

export default async function MembershipAdmin() {
  try { await requireMarketplaceAdmin() } catch { return <PageShell><section className="mx-auto max-w-4xl px-4 py-16"><MarketplaceHeading eyebrow="Veyra administration" title="Administrator access required">Only authorised Veyra administrators can manage member benefits and venue offers.</MarketplaceHeading></section></PageShell> }
  const database = marketplaceDatabase()
  const [offers, services] = await Promise.all([
    database.from('veyra_member_offers').select('id,title,description,kind,venue,county,ends_at,discount_bps,offer_id,active').order('created_at', { ascending: false }).limit(200),
    database.from('veyra_marketplace_offers').select('id,title').eq('active', true).order('title'),
  ])
  return <PageShell><section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"><MarketplaceHeading eyebrow="Veyra administration" title="Member benefits & partner offers">Create and publish genuine benefits for €4.99/month members. Private redemption details are restricted to verified paid members.</MarketplaceHeading><Link className={secondaryClass + ' mb-8'} href="/admin/marketplace">Provider approvals & payments</Link>{offers.error || services.error ? <p className="text-muted-foreground">Membership setup is not complete yet. Apply the reviewed membership database migration in staging first.</p> : <AdminMemberOffers offers={offers.data ?? []} services={services.data ?? []} />}</section></PageShell>
}
