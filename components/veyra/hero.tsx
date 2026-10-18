import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[100svh] items-center justify-center overflow-hidden">
      {/* Cinematic background */}
      <div className="absolute inset-0 -z-20">
        <img
          src="/veyra/hero.png"
          alt="A runner on a misty Irish coastal road at dawn"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/55 to-background" />
        <div className="absolute inset-0 bg-background/30" />
      </div>

      {/* Floating gradient orbs */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="animate-float absolute left-1/4 top-1/3 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />
        <div className="animate-float-slow absolute right-1/4 top-1/2 h-[28rem] w-[28rem] translate-x-1/2 rounded-full bg-[#008E63]/20 blur-[120px]" />
      </div>

      <div className="mx-auto flex max-w-4xl flex-col items-center px-4 py-32 text-center sm:px-6">
        <span className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-xs font-medium tracking-wide text-muted-foreground backdrop-blur">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
          Now launching across Ireland
        </span>

        <h1 className="text-balance text-5xl font-bold leading-[0.98] tracking-tight text-foreground sm:text-7xl lg:text-[5.5rem]">
          Discover Ireland
          <br />
          <span className="text-gradient-emerald">beyond the ordinary.</span>
        </h1>

        <p className="mt-8 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
          Discover experiences, wellness, sport, adventure and everything
          worth doing — with a personal team to arrange the details.
        </p>

        <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row">
          <Button asChild size="lg" className="h-13 rounded-full px-8 text-base font-semibold">
            <Link href="/discover">
              Explore Experiences
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-13 rounded-full border-border bg-card/40 px-8 text-base font-semibold backdrop-blur hover:bg-card"
          >
            <Link href="/concierge">Personal Concierge</Link>
          </Button>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 sm:block">
        <div className="flex h-10 w-6 items-start justify-center rounded-full border border-border p-1.5">
          <div className="h-2 w-1 animate-float rounded-full bg-muted-foreground" />
        </div>
      </div>
    </section>
  )
}
