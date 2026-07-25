import { Instagram, Facebook, Search, MessageCircle, Globe, MapPin, ArrowDown } from 'lucide-react'
import { Reveal } from '@/components/veyra/reveal'

const scattered = [
  { icon: Instagram, label: 'Instagram', x: 'left-[6%] top-[12%]', rot: '-rotate-6' },
  { icon: Facebook, label: 'Facebook', x: 'right-[8%] top-[6%]', rot: 'rotate-3' },
  { icon: Search, label: 'Google', x: 'left-[18%] bottom-[14%]', rot: 'rotate-6' },
  { icon: MessageCircle, label: 'WhatsApp groups', x: 'right-[12%] bottom-[10%]', rot: '-rotate-3' },
  { icon: Globe, label: 'Booking sites', x: 'left-[40%] top-[2%]', rot: 'rotate-2' },
  { icon: MapPin, label: 'Local directories', x: 'right-[34%] bottom-[2%]', rot: '-rotate-6' },
]

export function ProblemSection() {
  return (
    <section className="relative overflow-hidden border-y border-border bg-[#0d0d0d] py-28 sm:py-36">
      {/* Scattered platforms */}
      <div className="pointer-events-none absolute inset-0 hidden md:block" aria-hidden="true">
        {scattered.map((item) => (
          <div
            key={item.label}
            className={`absolute ${item.x} ${item.rot} flex items-center gap-2 rounded-xl border border-border bg-card/70 px-4 py-2.5 text-sm text-muted-foreground opacity-60 backdrop-blur`}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </div>
        ))}
      </div>

      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <Reveal>
          <h2 className="text-balance text-4xl font-bold tracking-tight text-muted-foreground sm:text-5xl">
            Stop searching everywhere.
          </h2>
        </Reveal>

        <Reveal delay={150} className="mt-10 flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card">
            <ArrowDown className="h-5 w-5 text-primary" />
          </div>
        </Reveal>

        <Reveal delay={250}>
          <p className="mt-10 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            Everything worth doing.
            <br />
            <span className="text-primary">One place.</span>
          </p>
        </Reveal>
      </div>
    </section>
  )
}
