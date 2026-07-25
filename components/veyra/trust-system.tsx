import { BadgeCheck, Star, Crown } from 'lucide-react'
import { Reveal } from '@/components/veyra/reveal'
import { cn } from '@/lib/utils'

const tiers = [
  {
    name: 'VEYRA Verified',
    icon: BadgeCheck,
    stars: 1,
    points: ['Trusted providers', 'Reliable quality', 'Consistent experience'],
    featured: false,
  },
  {
    name: 'VEYRA Select',
    icon: Star,
    stars: 2,
    points: ['Highly rated providers', 'Premium service quality', 'Better experience'],
    featured: true,
  },
  {
    name: 'VEYRA Signature',
    icon: Crown,
    stars: 3,
    points: ['Exceptional providers', 'Best in class experiences', 'Premium service standard'],
    featured: false,
  },
]

export function TrustSystem() {
  return (
    <section className="relative overflow-hidden border-y border-border bg-[#0d0d0d] py-24 sm:py-32">
      <div className="pointer-events-none absolute left-1/2 top-0 -z-0 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-primary/10 blur-[140px]" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">The VEYRA Standard</span>
          <h2 className="mt-4 text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Quality you can trust, by design.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Every provider is rated against the VEYRA standard, so you always know
            exactly what to expect.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {tiers.map((tier, i) => (
            <Reveal key={tier.name} delay={i * 110}>
              <div
                className={cn(
                  'group relative flex h-full flex-col rounded-3xl border p-8 transition-all duration-500',
                  tier.featured
                    ? 'border-primary/40 bg-gradient-to-b from-primary/10 to-card md:-translate-y-4'
                    : 'border-border bg-card hover:border-primary/20'
                )}
              >
                {tier.featured && (
                  <span className="absolute right-6 top-6 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                    Most loved
                  </span>
                )}
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-background">
                  <tier.icon className="h-7 w-7 text-primary" />
                </div>

                <div className="mt-6 flex items-center gap-1">
                  {Array.from({ length: 3 }).map((_, s) => (
                    <Star
                      key={s}
                      className={cn(
                        'h-4 w-4',
                        s < tier.stars ? 'fill-primary text-primary' : 'text-border'
                      )}
                    />
                  ))}
                </div>

                <h3 className="mt-4 text-2xl font-bold tracking-tight">{tier.name}</h3>

                <ul className="mt-6 space-y-3 border-t border-border pt-6">
                  {tier.points.map((point) => (
                    <li key={point} className="flex items-center gap-3 text-muted-foreground">
                      <BadgeCheck className="h-4 w-4 shrink-0 text-primary" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
