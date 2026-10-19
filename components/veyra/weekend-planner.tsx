'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, MapPin, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/veyra/reveal'
import { cn } from '@/lib/utils'
import { experiences, editImage, requestLink } from '@/lib/experience-edit'

const filterGroups = [
  { key: 'location', label: 'Location', options: ['Dublin', 'Galway', 'Donegal', 'Wicklow'] },
  { key: 'budget', label: 'Budget', options: ['Under €25', '€25–€60', '€60–€120', '€120+'] },
  { key: 'category', label: 'Category', options: ['Move', 'Recover', 'Explore', 'Learn'] },
  { key: 'group', label: 'Your Group', options: ['Solo', 'Couple', 'Friends', 'Family'] },
  { key: 'time', label: 'Time Available', options: ['1 hour', 'Half day', 'Full day', 'Weekend'] },
] as const

type FilterKey = (typeof filterGroups)[number]['key']

const categorySlugs: Record<string, string> = { Move: 'fitness', Recover: 'wellness', Explore: 'adventure', Learn: 'learning' }

export function WeekendPlanner() {
  const [selected, setSelected] = useState<Record<FilterKey, string | null>>({
    location: 'Dublin',
    budget: '€25–€60',
    category: 'Move',
    group: 'Solo',
    time: 'Half day',
  })
  const preview = experiences.find(experience =>
    (!selected.location || experience.county === selected.location) &&
    (!selected.category || experience.category === categorySlugs[selected.category])
  )
  const summary = [
    preview?.title ?? 'A personally planned experience',
    ...filterGroups.map(filter => selected[filter.key] ? filter.label + ': ' + selected[filter.key] : null).filter(Boolean),
  ].join(' · ')
  const enquiryHref = requestLink('concierge') + '&reference=' + encodeURIComponent(summary)

  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <Reveal className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Weekend Planner</span>
        <h2 className="mt-4 text-balance text-4xl font-bold tracking-tight sm:text-5xl">Looking for plans this weekend?</h2>
        <p className="mt-4 text-lg text-muted-foreground">Tell us what you enjoy and let our team help plan an experience around your lifestyle.</p>
      </Reveal>
      <Reveal className="mt-14">
        <div className="grid gap-6 rounded-3xl border border-border bg-card p-6 sm:p-8 lg:grid-cols-[1.2fr_1fr] lg:gap-10">
          <div className="space-y-7">
            {filterGroups.map(filter => (
              <div key={filter.key}>
                <p className="mb-3 text-sm font-medium text-muted-foreground">{filter.label}</p>
                <div className="flex flex-wrap gap-2">
                  {filter.options.map(option => (
                    <button
                      key={option}
                      type="button"
                      aria-pressed={selected[filter.key] === option}
                      onClick={() => setSelected(previous => ({ ...previous, [filter.key]: previous[filter.key] === option ? null : option }))}
                      className={cn(
                        'rounded-full border px-4 py-2 text-sm font-medium transition-all',
                        selected[filter.key] === option
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground'
                      )}
                    >{option}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col">
            <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground"><Sparkles className="h-4 w-4 text-primary" /> Experience inspiration</div>
            <div className="relative flex-1 overflow-hidden rounded-2xl border border-border" aria-live="polite">
              <Image fill sizes="(max-width: 1024px) 100vw, 50vw" src={editImage(preview?.image ?? 'hero')} alt={preview?.title ?? 'The Irish coast'} className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
              <div className="relative flex h-full min-h-72 flex-col justify-end p-6">
                <span className="mb-2 inline-flex w-fit rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">Personally arranged</span>
                <h3 className="text-2xl font-bold tracking-tight">{preview?.title ?? 'Let us find your next experience.'}</h3>
                <div className="mt-2 flex items-center gap-1.5 text-muted-foreground"><MapPin className="h-4 w-4" /><span className="text-sm">{selected.location ?? 'Ireland'} · Enquire for pricing</span></div>
                <p className="mt-3 text-xs text-muted-foreground">We’ll check your preferences, availability and budget before proposing a plan.</p>
                <Button asChild className="mt-5 w-fit rounded-full"><Link href={enquiryHref}>Plan this with us <ArrowRight className="h-4 w-4" /></Link></Button>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

