import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowUpRight, Check, MapPin } from 'lucide-react'
import { PageShell } from '@/components/veyra/site-shell'
import { ExperienceCard } from '@/components/veyra/experience-card'
import { categories, editImage, experiences, requestLink } from '@/lib/experience-edit'
import { getBookableOffer } from '@/lib/marketplace/catalogue'
import { formatMoney, formatSession } from '@/lib/marketplace/validation'
import { buttonClass, MarketplaceHeading } from '@/components/marketplace/presentation'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const experience = await getBookableOffer(slug) ?? experiences.find(item => item.slug === slug)
  return { title: experience?.title ?? 'Experience not found', description: experience?.description }
}

export default async function ExperiencePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const offer = await getBookableOffer(slug)
  if (offer) return <PageShell><section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"><Link className="mb-8 inline-block text-sm text-primary" href="/discover">← Back to discover</Link><div className="grid gap-10 lg:grid-cols-2"><Image width={1000} height={750} sizes="(max-width: 1024px) 100vw, 50vw" src={offer.image_url} alt="" className="aspect-[4/3] w-full rounded-2xl object-cover" /><div><MarketplaceHeading eyebrow={offer.county + ' · Ireland'} title={offer.title}>By {offer.provider.business_name} · approved Veyra provider</MarketplaceHeading><p className="whitespace-pre-wrap text-muted-foreground">{offer.description}</p><p className="mt-6 text-2xl font-bold">{formatMoney(offer.unit_amount, offer.currency)} <span className="text-base font-normal text-muted-foreground">{offer.pricing_mode === 'per_person' ? 'per person' : 'per group'} · up to {offer.max_guests} guests per booking</span></p><h2 className="mt-8 text-xl font-bold">Available sessions</h2><ul className="mt-3 space-y-2 text-sm text-muted-foreground">{offer.slots.map(slot => <li key={slot.id}>{formatSession(slot.starts_at)} (Ireland time)</li>)}</ul><p className="mt-3 text-xs text-muted-foreground">Places are checked and held when you start checkout.</p><Link className={buttonClass + ' mt-6'} href={'/book/' + offer.slug}>Choose a session & book</Link><h2 className="mt-8 text-xl font-bold">Cancellation terms</h2><p className="mt-3 whitespace-pre-wrap text-sm text-muted-foreground">{offer.cancellation_terms}</p></div></div></section></PageShell>
  const experience = experiences.find(item => item.slug === slug)
  if (!experience) notFound()
  return <PageShell>
    <section className="v-wrap v-detail">
    <Link className="v-back" href="/discover">
    <ArrowLeft size={16} /> Back to the Ireland edit</Link>
    <div className="v-detail-grid">
    <div className="v-detail-photo">
    <Image unoptimized={false} sizes="(max-width: 760px) 100vw, 50vw" src={editImage(experience.image)} alt={experience.title} width={900} height={1100} />
    <span>{experience.tag}</span>
    </div>
    <div className="v-detail-copy">
    <span className="v-eyebrow">{categories.find(item => item.slug === experience.category)?.label}</span>
    <h1>{experience.title}</h1>
    <span className="v-detail-location">
    <MapPin size={16} /> {experience.county}, Ireland · {experience.duration}</span>
    <p>{experience.description}</p>
    <h2>Your experience, considered.</h2>
    <ul>{experience.includes.map(item => <li key={item}>
    <Check size={17} />{item}</li>)}</ul>
    <div className="v-enquiry-box">
    <span className="v-eyebrow">Personally arranged</span>
    <h3>A good idea. Made yours.</h3>
    <p>Share your dates and group size. We’ll confirm a suitable provider, availability and a full quote before you commit.</p>
    <Link className="v-button" href={requestLink('experience', experience.slug)}>Enquire about this experience <ArrowUpRight size={17} />
    </Link>
    <small>No payment today. Your booking is confirmed only after you approve the proposal and receive confirmation from our team.</small>
    </div>
    </div>
    </div>
    </section>
    <section className="v-wrap v-section">
    <div className="v-section-heading">
    <div>
    <span className="v-eyebrow">Stay curious</span>
    <h2>A little more <em>inspiration.</em>
    </h2>
    </div>
    </div>
    <div className="v-experience-grid">{experiences.filter(item => item.slug !== slug).slice(0, 3).map(item => <ExperienceCard key={item.slug} experience={item} />)}</div>
    </section>
    </PageShell>
}
