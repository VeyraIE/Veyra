import type { Metadata } from 'next'
import { Discovery } from '@/components/veyra/discovery'

export const metadata: Metadata = { title: 'Discover the Ireland edit', description: 'Explore wellness, adventure, movement, culture and shared experiences across Ireland. Personally arranged with Veyra.' }

export default async function DiscoverPage({ searchParams }: { searchParams: Promise<{ category?: string; county?: string; q?: string }> }) {
  const params = await searchParams
  return <Discovery key={[params.category, params.county, params.q].join(':')} initialCategory={params.category} initialCounty={params.county} initialQuery={params.q} />
}

