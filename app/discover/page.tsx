import type { Metadata } from 'next'
import { Discovery } from '@/components/veyra/discovery'
import { getBookableOffers } from '@/lib/marketplace/catalogue'

export const metadata: Metadata = { title: 'Discover the Ireland edit', description: 'Explore wellness, adventure, movement, culture and shared experiences across Ireland. Personally arranged with Veyra.' }

export const dynamic = 'force-dynamic'

export default async function DiscoverPage() {
  return <Discovery offers={await getBookableOffers()} />
}
