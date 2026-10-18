import { notFound } from 'next/navigation'
import Link from 'next/link'
import { PageShell } from '@/components/veyra/site-shell'
import { MarketplaceHeading, secondaryClass } from '@/components/marketplace/presentation'
import { CheckoutForm } from '@/components/marketplace/checkout-form'
import { getBookableOffer } from '@/lib/marketplace/catalogue'
import { paymentsConfigured } from '@/lib/marketplace/server'
import { experiences, requestLink } from '@/lib/experience-edit'

export const dynamic = 'force-dynamic'

export default async function BookPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const offer = await getBookableOffer(slug)
  if (!offer) {
    const idea = experiences.find(item => item.slug === slug)
    if (!idea) notFound()
    return <PageShell><section className="mx-auto max-w-4xl px-4 py-16"><MarketplaceHeading eyebrow="Experience inspiration" title={idea.title}>This is an experience idea, not a live provider listing. You can request a personal proposal, but no payment or reservation will be taken here.</MarketplaceHeading><Link className={secondaryClass} href={requestLink('experience', slug)}>Ask your concierge</Link></section></PageShell>
  }
  return <PageShell><section className="mx-auto max-w-4xl px-4 py-16 sm:px-6"><MarketplaceHeading eyebrow={offer.county + ' · ' + offer.provider.business_name} title={offer.title}>Select your session and pay securely on Veyra.</MarketplaceHeading><CheckoutForm offer={offer} configured={paymentsConfigured()} /></section></PageShell>
}

