import Link from 'next/link'
import { Reveal } from '@/components/veyra/reveal'

const tiles = [
  { title: 'MOVE', desc: 'Fitness, training, performance.', image: '/veyra/move.png', href: '/discover?category=fitness', span: 'lg:col-span-2' },
  { title: 'RECOVER', desc: 'Sauna, mobility, recovery, wellness.', image: '/veyra/recover.png', href: '/discover?category=wellness', span: '' },
  { title: 'EXPLORE', desc: 'Adventure, hiking, outdoors.', image: '/veyra/explore.png', href: '/discover?category=adventure', span: '' },
  { title: 'LEARN', desc: 'Music, hobbies, creativity, education.', image: '/veyra/learn.png', href: '/discover?category=learning', span: '' },
  { title: 'COMPETE', desc: 'Sport clubs, coaching, academies.', image: '/veyra/compete.png', href: '/discover?category=sport', span: '' },
  { title: 'FAMILY', desc: 'Kids activities, camps, experiences.', image: '/veyra/family.png', href: '/discover?category=family', span: 'lg:col-span-2' },
]

export function DiscoveryGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <Reveal className="max-w-2xl">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Discover</span>
        <h2 className="mt-4 text-balance text-4xl font-bold tracking-tight sm:text-5xl">
          Everything worth doing, by mood.
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Move, recover, explore, learn, compete. Choose how you want to feel and
          we&apos;ll show you where to go.
        </p>
      </Reveal>

      <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tiles.map((tile, i) => (
          <Reveal key={tile.title} delay={(i % 3) * 90} className={tile.span}>
            <Link
              href={tile.href}
              className="group relative block h-72 overflow-hidden rounded-2xl border border-border sm:h-80 lg:h-96"
            >
              <img
                src={tile.image || "/placeholder.svg"}
                alt={tile.title}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/5 transition-colors duration-500 group-hover:ring-primary/40" />
              <div className="absolute bottom-0 left-0 p-7">
                <h3 className="text-2xl font-bold tracking-tight text-foreground">{tile.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{tile.desc}</p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
