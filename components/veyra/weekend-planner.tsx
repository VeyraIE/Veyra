'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MapPin, Sparkles, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/veyra/reveal'
import { cn } from '@/lib/utils'

const filterGroups = [
  { key: 'location', label: 'Location', options: ['Dublin', 'Galway', 'Cork', 'Wicklow'] },
  { key: 'budget', label: 'Budget', options: ['Under €25', '€25–€60', '€60–€120', '€120+'] },
  { key: 'category', label: 'Category', options: ['Move', 'Recover', 'Explore', 'Learn'] },
  { key: 'age', label: 'Age Group', options: ['Solo', 'Couple', 'Friends', 'Family'] },
  { key: 'time', label: 'Time Available', options: ['1 hour', 'Half day', 'Full day', 'Weekend'] },
] as const

type FilterKey = (typeof filterGroups)[number]['key']

const previews: Record<string, { title: string; location: string; tier: string; price: string; image: string }> = {
  Recover: { title: 'Cold Water Wellness Retreat', location: 'Galway', tier: 'VEYRA Premium', price: '€95', image: '/veyra/exp-coldwater.png' },
  Explore: { title: 'Coastal Surf Session', location: 'Donegal', tier: 'VEYRA Signature', price: '€45', image: '/veyra/exp-surf.png' },
  Learn: { title: 'Acoustic Guitar Lessons', location: 'Dublin', tier: 'VEYRA Verified', price: '€32', image: '/veyra/learn.png' },
  Move: { title: 'Private Reformer Pilates', location: 'Dublin', tier: 'VEYRA Select', price: '€28', image: '/veyra/exp-pilates.png' },
  default: { title: 'Luxury Yoga Retreat', location: 'Wicklow', tier: 'VEYRA Signature', price: '€120', image: '/veyra/exp-yoga.png' },
}

export function WeekendPlanner() {
  const [selected, setSelected] = useState<Record<FilterKey, string | null>>({
    location: 'Dublin',
    budget: '€25–€60',
    category: 'Recover',
    age: 'Solo',
    time: 'Half day',
  })

  const setFilter = (key: FilterKey, value: string) =>
    setSelected((prev) => ({ ...prev, [key]: prev[key] === value ? null : value }))

  const preview = previews[selected.category ?? 'default'] ?? previews.default

  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <Reveal className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Weekend Planner</span>
        <h2 className="mt-4 text-balance text-4xl font-bold tracking-tight sm:text-5xl">
          Looking for plans this weekend?
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Tell us what you enjoy and discover experiences built around your lifestyle.
        </p>
      </Reveal>

      <Reveal className="mt-14">
        <div className="grid gap-6 rounded-3xl border border-border bg-card p-6 sm:p-8 lg:grid-cols-[1.2fr_1fr] lg:gap-10">
          {/* Filters */}
          <div className="space-y-7">
            {filterGroups.map((group) => (
              <div key={group.key}>
                <p className="mb-3 text-sm font-medium text-muted-foreground">{group.label}</p>
                <div className="flex flex-wrap gap-2">
                  {group.options.map((option) => {
                    const active = selected[group.key] === option
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setFilter(group.key, option)}
                        className={cn(
                          'rounded-full border px-4 py-2 text-sm font-medium transition-all',
                          active
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground'
                        )}
                      >
                        {option}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Recommendation preview */}
          <div className="flex flex-col">
            <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4 text-primary" />
              Your match
            </div>
            <div className="group relative flex-1 overflow-hidden rounded-2xl border border-border">
              <img
                key={preview.image}
                src={preview.image || "/placeholder.svg"}
                alt={preview.title}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
              <div className="relative flex h-full min-h-72 flex-col justify-end p-6">
                <span className="mb-2 inline-flex w-fit items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                  {preview.tier}
                </span>
                <h3 className="text-2xl font-bold tracking-tight">{preview.title}</h3>
                <div className="mt-1 flex items-center gap-1.5 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{preview.location}</span>
                  <span className="mx-1.5">·</span>
                  <span className="text-sm font-semibold text-foreground">from {preview.price}</span>
                </div>
                <Button asChild className="mt-5 w-fit rounded-full">
                  <Link href="/discover">
                    View experience
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
