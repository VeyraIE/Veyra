import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import {
  getCurrentProfile,
  getUserBookings,
  getUserChildren,
  getUserFavorites,
  getUserNotifications,
} from '@/lib/dashboard-queries'
import DashboardClient from './dashboard-client'

export const metadata: Metadata = {
  title: 'My Dashboard | Veyra',
  description:
    'Manage your bookings, child profiles, saved activities and account settings.',
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Every query below is scoped to this user id, so an unauthenticated
  // visitor must be sent to sign in rather than shown an empty dashboard.
  if (!user) redirect('/auth/login?redirect=/dashboard')

  const profile = await getCurrentProfile()
  if (!profile) redirect('/auth/login?redirect=/dashboard')

  const [{ upcoming, past }, children, favorites, notifications] =
    await Promise.all([
      getUserBookings(user.id),
      getUserChildren(user.id),
      getUserFavorites(user.id),
      getUserNotifications(user.id),
    ])

  const completedCount = past.filter((b) => b.status === 'completed').length

  // Reviews the user has written, used for the headline stat only.
  const { count: reviewCount } = await supabase
    .from('reviews')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)

  return (
    <DashboardClient
      profile={profile}
      children={children}
      upcomingBookings={upcoming}
      pastBookings={past}
      favorites={favorites}
      notifications={notifications}
      completedCount={completedCount}
      reviewCount={reviewCount ?? 0}
    />
  )
}
