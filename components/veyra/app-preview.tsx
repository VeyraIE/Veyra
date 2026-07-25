import { Search, MapPin, Star } from 'lucide-react'
import { Reveal } from '@/components/veyra/reveal'

const appCards = [
  { title: 'Reformer Pilates', meta: 'Dublin · VEYRA Select', price: '€28', image: '/veyra/exp-pilates.png' },
  { title: 'Cold Water Wellness', meta: 'Galway · VEYRA Premium', price: '€95', image: '/veyra/exp-coldwater.png' },
]

export function AppPreview() {
  return (
    <section className="relative overflow-hidden border-t border-border bg-[#0d0d0d] py-24 sm:py-32">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[140px]" />
      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <Reveal>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">VEYRA App</span>
          <h2 className="mt-4 text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Your next experience is one tap away.
          </h2>
        </Reveal>

        {/* Floating phone mockup */}
        <Reveal delay={150} className="mt-16 flex justify-center">
          <div className="animate-float relative w-[18rem] rounded-[2.75rem] border border-border bg-card p-3 shadow-soft-xl sm:w-[20rem]">
            <div className="absolute left-1/2 top-3 z-10 h-6 w-28 -translate-x-1/2 rounded-full bg-background" />
            <div className="overflow-hidden rounded-[2rem] bg-background">
              {/* App header */}
              <div className="px-5 pb-4 pt-10 text-left">
                <p className="text-xs text-muted-foreground">Good morning</p>
                <p className="text-lg font-bold tracking-tight">Find your next thing</p>
                <div className="mt-3 flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm text-muted-foreground">
                  <Search className="h-4 w-4" />
                  Search experiences
                </div>
              </div>
              {/* App cards */}
              <div className="space-y-3 px-5 pb-8 text-left">
                {appCards.map((card) => (
                  <div key={card.title} className="overflow-hidden rounded-2xl border border-border bg-card">
                    <div className="relative h-28">
                      <img src={card.image || "/placeholder.svg"} alt={card.title} className="h-full w-full object-cover" />
                      <span className="absolute right-2 top-2 rounded-full bg-background/80 px-2 py-0.5 text-xs font-semibold backdrop-blur">
                        {card.price}
                      </span>
                    </div>
                    <div className="p-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold">{card.title}</p>
                        <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                          <Star className="h-3 w-3 fill-primary text-primary" />
                          4.9
                        </span>
                      </div>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {card.meta}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
