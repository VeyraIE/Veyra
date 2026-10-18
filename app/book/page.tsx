import Link from 'next/link'
import { PageShell } from '@/components/veyra/site-shell'
import { BookableCard, MarketplaceHeading, buttonClass, secondaryClass } from '@/components/marketplace/presentation'
import { getBookableOffers } from '@/lib/marketplace/catalogue'

export const dynamic = 'force-dynamic'

export default async function BookableExperiences() {
  const offers = await getBookableOffers()
  return <PageShell><section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"><MarketplaceHeading eyebrow="Ireland · book with Veyra" title="Extraordinary plans. Booked here.">Choose a service from an approved provider, select your session and pay securely on Veyra. No app required.</MarketplaceHeading>{offers.length ? <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{offers.map(offer => <BookableCard key={offer.id} offer={offer} />)}</div> : <div className="rounded-2xl border border-border bg-card p-6 sm:p-10"><h2 className="text-2xl font-bold">Our first bookable services are coming soon</h2><p className="mt-4 max-w-2xl text-muted-foreground">Approved providers will add their own experiences, prices and available sessions. We won’t display invented availability or take payment for an unlisted service.</p><div className="mt-6 flex flex-wrap gap-3"><Link className={buttonClass} href="/discover">Explore the Ireland edit</Link><Link className={secondaryClass} href="/provider/onboarding">Become a provider</Link></div></div>}</section></PageShell>
}
