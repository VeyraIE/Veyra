import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowUpRight, Check, MapPin } from 'lucide-react'
import { PageShell } from '@/components/veyra/site-shell'
import { ExperienceCard } from '@/components/veyra/experience-card'
import { categories, editImage, experiences, requestLink } from '@/lib/experience-edit'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const experience = experiences.find(item => item.slug === slug)
  return { title: experience?.title ?? 'Experience not found', description: experience?.description }
}

export default async function ExperiencePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const experience = experiences.find(item => item.slug === slug)
  if (!experience) notFound()
  return <PageShell><section className="v-wrap v-detail"><Link className="v-back" href="/discover"><ArrowLeft size={16} /> Back to the Ireland edit</Link><div className="v-detail-grid"><div className="v-detail-photo"><img src={editImage(experience.image)} alt={experience.title} width={900} height={1100} /><span>{experience.tag}</span></div><div className="v-detail-copy"><span className="v-eyebrow">{categories.find(item => item.slug === experience.category)?.label}</span><h1>{experience.title}</h1><span className="v-detail-location"><MapPin size={16} /> {experience.county}, Ireland · {experience.duration}</span><p>{experience.description}</p><h2>Your experience, considered.</h2><ul>{experience.includes.map(item => <li key={item}><Check size={17} />{item}</li>)}</ul><div className="v-enquiry-box"><span className="v-eyebrow">Personally arranged</span><h3>A good idea. Made yours.</h3><p>Share your dates and group size. We’ll confirm a suitable provider, availability and a full quote before you commit.</p><Link className="v-button" href={requestLink('experience', experience.slug)}>Enquire about this experience <ArrowUpRight size={17} /></Link><small>No payment today. Your booking is confirmed only after you approve the proposal and receive confirmation from our team.</small></div></div></div></section><section className="v-wrap v-section"><div className="v-section-heading"><div><span className="v-eyebrow">Stay curious</span><h2>A little more <em>inspiration.</em></h2></div></div><div className="v-experience-grid">{experiences.filter(item => item.slug !== slug).slice(0, 3).map(item => <ExperienceCard key={item.slug} experience={item} />)}</div></section></PageShell>
}

