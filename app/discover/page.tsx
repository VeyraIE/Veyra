import type { Metadata } from 'next'
import { Discovery } from '@/components/veyra/discovery'

export const metadata: Metadata = { title: 'Discover the Ireland edit', description: 'Explore wellness, adventure, movement, culture and shared experiences across Ireland. Personally arranged with Veyra.' }

export const dynamic = 'force-dynamic'

export default function DiscoverPage() {
  return <Discovery />
}
