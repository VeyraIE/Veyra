import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/veyra/reveal'

export function ProvidersSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-border">
            <img
              src="/veyra/providers.png"
              alt="An activity provider in their studio"
              className="aspect-[4/5] w-full object-cover sm:aspect-[4/3]"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-background/40 to-transparent" />
          </div>
        </Reveal>

        <Reveal delay={120}>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">For Providers</span>
          <h2 className="mt-4 text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Grow your business with VEYRA.
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-muted-foreground">
            Reach customers actively searching for experiences and manage bookings
            in one premium ecosystem.
          </p>
          <div className="mt-9">
            <Button asChild size="lg" className="h-13 rounded-full px-8 text-base font-semibold">
              <Link href="/provider/onboarding">
                Become a Provider
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
