import Link from 'next/link'
import Image from 'next/image'
import { MapPin, ArrowUpRight } from 'lucide-react'
import { Reveal } from '@/components/veyra/reveal'

const experiences = [
  { title: 'Private Reformer Pilates', location: 'Dublin', tier: 'Move', slug: 'private-pilates', image: '/veyra/exp-pilates.png' },
  { title: 'Surf Lessons', location: 'Donegal', tier: 'Explore', slug: 'atlantic-surf', image: '/veyra/exp-surf.png' },
  { title: 'Cold Water Wellness Retreat', location: 'Galway', tier: 'Recover', slug: 'coastal-reset', image: '/veyra/exp-coldwater.png' },
  { title: 'Luxury Yoga Retreat', location: 'Wicklow', tier: 'Recover', slug: 'wicklow-retreat', image: '/veyra/exp-yoga.png' },
]

export function FeaturedExperiences() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <Reveal className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Featured</span>
          <h2 className="mt-4 text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Experiences worth your weekend.
          </h2>
        </div>
        <Link
          href="/discover"
          className="group inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          View all
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </Reveal>

      <p className="mt-6 text-sm text-muted-foreground">Experience inspiration. Providers, availability and pricing are confirmed personally before you book.</p>
      <div className="mt-14 flex flex-col gap-6">
        {experiences.map((exp, i) => (
          <Reveal key={exp.title} delay={i * 80}>
            <Link
              href={`/experiences/${exp.slug}`}
              className="group relative grid overflow-hidden rounded-3xl border border-border bg-card transition-colors duration-500 hover:border-primary/30 md:grid-cols-[1.1fr_1fr]"
            >
              <div className="relative h-64 overflow-hidden md:h-80">
                <Image
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  src={exp.image || "/placeholder.svg"}
                  alt={exp.title}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/90 md:to-card" />
              </div>

              <div className="flex flex-col justify-center gap-4 p-8 sm:p-10">
                <span className="inline-flex w-fit items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                  {exp.tier}
                </span>
                <h3 className="text-3xl font-bold tracking-tight">{exp.title}</h3>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{exp.location}</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Enquire for pricing</span>
                  </div>
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform group-hover:scale-105">
                    <ArrowUpRight className="h-5 w-5" />
                  </span>
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

