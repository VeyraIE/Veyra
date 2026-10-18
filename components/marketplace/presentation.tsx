import Link from 'next/link'
import type { BookableOffer } from '@/lib/marketplace/catalogue'
import { formatMoney, formatSession } from '@/lib/marketplace/validation'

export const fieldClass = 'mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary'
export const buttonClass = 'inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50'
export const secondaryClass = 'inline-flex min-h-11 items-center justify-center rounded-full border border-border px-5 py-3 text-sm font-medium hover:border-primary disabled:opacity-50'

export function MarketplaceHeading({ eyebrow, title, children }: { eyebrow: string; title: string; children?: React.ReactNode }) {
  return <div className="mb-10 max-w-3xl"><p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">{eyebrow}</p><h1 className="text-3xl font-bold tracking-tight sm:text-5xl">{title}</h1>{children && <div className="mt-5 text-muted-foreground">{children}</div>}</div>
}

export function BookableCard({ offer }: { offer: BookableOffer }) {
  return <article className="overflow-hidden rounded-2xl border border-border bg-card"><Link href={'/experiences/' + offer.slug} className="block"><img src={offer.image_url} alt="" className="aspect-[4/3] w-full object-cover" loading="lazy" /><div className="p-6"><p className="text-xs font-semibold uppercase tracking-widest text-primary">{offer.county} · Book online</p><h3 className="mt-3 text-xl font-bold">{offer.title}</h3><p className="mt-2 text-sm text-muted-foreground">By {offer.provider.business_name}</p><p className="mt-4 font-semibold">{formatMoney(offer.unit_amount, offer.currency)} <span className="text-sm font-normal text-muted-foreground">{offer.pricing_mode === 'per_person' ? 'per person' : 'per group'}</span></p><p className="mt-2 text-sm text-muted-foreground">Next: {formatSession(offer.slots[0].starts_at)} (Ireland)</p><span className="mt-5 inline-block text-sm font-semibold text-primary">View sessions & book →</span></div></Link></article>
}
