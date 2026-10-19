import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/veyra/reveal'

export function ConciergeSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <Reveal className="rounded-3xl border border-border bg-card px-6 py-16 text-center sm:px-12">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">VEYRA Concierge</span>
        <h2 className="mt-4 text-balance text-4xl font-bold tracking-tight sm:text-5xl">Your next experience starts with a conversation.</h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">A weekend away, a special occasion, or something new to try. Tell us what you have in mind and let our team bring the details together.</p>
        <Button asChild size="lg" className="mt-9 h-13 rounded-full px-8 text-base font-semibold">
          <Link href="/concierge">Explore Personal Concierge <ArrowRight className="h-4 w-4" /></Link>
        </Button>
        <p className="mt-5 text-sm text-muted-foreground">No app or account required. Pricing and arrangements agreed personally.</p>
      </Reveal>
    </section>
  )
}

