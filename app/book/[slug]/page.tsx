import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getActivity, getBookableSessions } from '@/lib/queries'
import BookClient from './book-client'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const activity = await getActivity(slug)

  if (!activity) return { title: 'Activity not found | Veyra' }

  return {
    title: `Book ${activity.title} | Veyra`,
    description: `Reserve a place on ${activity.title}${
      activity.provider?.business_name ? ` with ${activity.provider.business_name}` : ''
    }.`,
    robots: { index: false, follow: false },
  }
}

export default async function BookingPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const activity = await getActivity(slug)

  if (!activity) notFound()

  const sessions = await getBookableSessions(activity.id)

  return <BookClient activity={activity} sessions={sessions} />
}
