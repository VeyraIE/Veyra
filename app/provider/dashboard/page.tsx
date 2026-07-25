import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import {
  calculateProviderStats,
  getProviderActivities,
  getProviderBookings,
  getProviderForUser,
} from '@/lib/dashboard-queries'
import ProviderDashboardClient, {
  type TodaySession,
} from './provider-dashboard-client'

export const metadata: Metadata = {
  title: 'Provider Dashboard | Veyra',
  description:
    'Track bookings, revenue, listings and today’s sessions for your activity business.',
}

export default async function ProviderDashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login?redirect=/provider/dashboard')

  // A provider record is the authorisation boundary here: without one there is
  // no business to show, so send the user through onboarding instead.
  const provider = await getProviderForUser(user.id)
  if (!provider) redirect('/provider/onboarding')

  const [activities, bookings] = await Promise.all([
    getProviderActivities(provider.id),
    getProviderBookings(provider.id),
  ])

  const stats = calculateProviderStats(activities, bookings)

  // Today's sessions, restricted to this provider's own activity ids.
  const activityIds = activities.map((a) => a.id)
  let todaySessions: TodaySession[] = []

  if (activityIds.length > 0) {
    const today = new Date().toISOString().slice(0, 10)
    const { data } = await supabase
      .from('sessions')
      .select('*, activity:activities(*)')
      .in('activity_id', activityIds)
      .eq('date', today)
      .order('start_time', { ascending: true })

    todaySessions = (data ?? []) as unknown as TodaySession[]
  }

  return (
    <ProviderDashboardClient
      provider={provider}
      activities={activities}
      bookings={bookings}
      stats={stats}
      todaySessions={todaySessions}
    />
  )
}
