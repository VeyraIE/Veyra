import Link from 'next/link'
import { ArrowUpRight, MapPin } from 'lucide-react'
import { categories, editImage, experiences } from '@/lib/experience-edit'

export function ExperienceCard({ experience }: { experience: typeof experiences[number] }) {
  return <Link href={`/experiences/${experience.slug}`} className="v-experience"><div className="v-card-image"><img src={editImage(experience.image)} alt={experience.title} loading="lazy" width={650} height={720} /><span className="v-card-tag">{experience.tag}</span><span className="v-card-arrow"><ArrowUpRight size={20} /></span></div><div className="v-card-meta"><span>{categories.find(category => category.slug === experience.category)?.label}</span><span><MapPin size={12} /> {experience.county}</span></div><h3>{experience.title}</h3><p>{experience.duration} <span>·</span> Enquire for pricing</p></Link>
}

