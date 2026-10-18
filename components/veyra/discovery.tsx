'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowUpRight, Search, X } from 'lucide-react'
import { PageShell } from './site-shell'
import { ExperienceCard } from './experience-card'
import { categories, experiences } from '@/lib/experience-edit'

export function Discovery() {
  const searchParams = useSearchParams()
  const requestedCategory = searchParams.get('category') ?? 'all'
  const category = categories.some(item => item.slug === requestedCategory) ? requestedCategory : 'all'
  const counties = [...new Set(experiences.map(item => item.county))].sort()
  const requestedCounty = searchParams.get('county') ?? 'all'
  const county = counties.includes(requestedCounty) ? requestedCounty : 'all'
  const query = searchParams.get('q') ?? ''
  const results = experiences.filter(item => (category === 'all' || item.category === category) && (county === 'all' || item.county === county) && `${item.title} ${item.description} ${item.county} ${categories.find(entry => entry.slug === item.category)?.label}`.toLowerCase().includes(query.toLowerCase().trim()))
  function updateFilter(key: string, value: string) {
    const url = new URL(window.location.href)
    if (!value || value === 'all') url.searchParams.delete(key)
    else url.searchParams.set(key, value)
    window.history.replaceState(null, '', url)
  }
  function reset() { window.history.replaceState(null, '', '/discover') }
  return <PageShell>
    <section className="v-page-intro v-wrap">
    <span className="v-eyebrow">The Ireland edit</span>
    <h1>Find your next<br />
    <em>good thing.</em>
    </h1>
    <p>Big adventures. Small rituals. Time beautifully spent.<br />Explore ideas for your next experience, personally arranged.</p>
    </section>
    <section className="v-wrap v-discovery">
    <div className="v-search-row">
    <label className="v-search">
    <Search size={19} />
    <span className="sr-only">Search experiences</span>
    <input type="search" placeholder="What would you love to do?" value={query} onChange={event => { updateFilter('q', event.target.value) }} />
    </label>
    <label className="v-county">
    <span>Where</span>
    <select aria-label="Filter by county" value={county} onChange={event => { updateFilter('county', event.target.value) }}>
    <option value="all">Anywhere in Ireland</option>{counties.map(item => <option key={item}>{item}</option>)}</select>
    </label>
    </div>
    <div className="v-category-links" aria-label="Filter by category">{categories.map(item => <button aria-pressed={category === item.slug} key={item.slug} className={category === item.slug ? 'is-active' : ''} onClick={() => { updateFilter('category', item.slug) }}>{item.label}</button>)}</div>
    <div className="v-results-meta">
    <span role="status">{results.length} {results.length === 1 ? 'experience' : 'experiences'} to inspire you</span>
    <button onClick={reset}>Reset filters <X size={13} />
    </button>
    </div>{results.length ? <div className="v-experience-grid">{results.map(experience => <ExperienceCard key={experience.slug} experience={experience} />)}</div> : <div className="v-empty">
    <h2>A little further afield?</h2>
    <p>Try another location or category, or let us find something just for you.</p>
    <button className="v-button" onClick={reset}>Explore all experiences <ArrowUpRight size={17} />
    </button>
    </div>}<p className="v-collection-note">These are experience ideas, rather than live bookable listings. Provider, location, availability and pricing are confirmed in your personal proposal.</p>
    <div className="v-discovery-cta">
    <h2>Have something else in mind?</h2>
    <Link className="v-underlined" href="/request">Tell your concierge <ArrowUpRight size={18} />
    </Link>
    </div>
    </section>
    </PageShell>
}

