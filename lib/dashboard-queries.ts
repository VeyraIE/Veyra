import { createClient } from '@/lib/supabase/server'
import type {
  Activity,
  Booking,
  ChildProfile,
  Notification,
  Profile,
  Provider,
} from '@/lib/types'

/**
 * Server-side data access for authenticated dashboards.
 *
 * Unlike the public catalogue helpers in `lib/queries.ts`, every function here
 * requires a signed-in user. Each query is additionally scoped to that user's
 * id (or their provider record) so a caller can never read another account's
 * bookings, children, or notifications even if an RLS policy were relaxed.
 */

const BOOKING_SELECT = `
  *,
  activity:activities(
    *,
    provider:providers(*),
    category:categories(*)
  ),
  child:child_profiles(*),
  session:sessions(*)
`

/** The signed-in user's profile, or null when not authenticated. */
export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  if (error) {
    console.log('[v0] getCurrentProfile failed:', error.message)
    return null
  }
  return data as Profile | null
}

/**
 * Bookings for the signed-in user, split into upcoming and past.
 *
 * "Upcoming" means a non-cancelled booking whose date is today or later.
 */
export async function getUserBookings(userId: string): Promise<{
  upcoming: Booking[]
  past: Booking[]
}> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('bookings')
    .select(BOOKING_SELECT)
    .eq('user_id', userId)
    .order('booking_date', { ascending: true })

  if (error) {
    console.log('[v0] getUserBookings failed:', error.message)
    return { upcoming: [], past: [] }
  }

  const bookings = (data ?? []) as unknown as Booking[]
  // Compare on date only so a session earlier today still counts as upcoming.
  const today = new Date().toISOString().slice(0, 10)

  const upcoming = bookings.filter(
    (b) => b.booking_date >= today && b.status !== 'cancelled',
  )
  const past = bookings
    .filter((b) => b.booking_date < today || b.status === 'cancelled')
    .reverse()

  return { upcoming, past }
}

/** Child profiles belonging to the signed-in user. */
export async function getUserChildren(
  userId: string,
): Promise<ChildProfile[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('child_profiles')
    .select('*')
    .eq('parent_id', userId)
    .order('created_at', { ascending: true })

  if (error) {
    console.log('[v0] getUserChildren failed:', error.message)
    return []
  }
  return (data ?? []) as ChildProfile[]
}

/** Activities the signed-in user has favourited. */
export async function getUserFavorites(userId: string): Promise<Activity[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('favorites')
    .select(
      'activity:activities(*, provider:providers(*), category:categories(*))',
    )
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.log('[v0] getUserFavorites failed:', error.message)
    return []
  }

  // Drop rows whose activity was deleted after being favourited.
  return (data ?? [])
    .map((row) => (row as unknown as { activity: Activity | null }).activity)
    .filter((activity): activity is Activity => activity !== null)
}

/** Notifications for the signed-in user, newest first. */
export async function getUserNotifications(
  userId: string,
  limit = 10,
): Promise<Notification[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.log('[v0] getUserNotifications failed:', error.message)
    return []
  }
  return (data ?? []) as Notification[]
}

/** The provider record owned by the signed-in user, if they have one. */
export async function getProviderForUser(
  userId: string,
): Promise<Provider | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('providers')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) {
    console.log('[v0] getProviderForUser failed:', error.message)
    return null
  }
  return data as Provider | null
}

/** Every activity owned by a provider, including inactive listings. */
export async function getProviderActivities(
  providerId: string,
): Promise<Activity[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('activities')
    .select('*, provider:providers(*), category:categories(*)')
    .eq('provider_id', providerId)
    .order('created_at', { ascending: false })

  if (error) {
    console.log('[v0] getProviderActivities failed:', error.message)
    return []
  }
  return (data ?? []) as unknown as Activity[]
}

/** Bookings across all of a provider's activities, newest first. */
export async function getProviderBookings(
  providerId: string,
): Promise<Booking[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('bookings')
    .select(BOOKING_SELECT)
    .eq('provider_id', providerId)
    .order('booking_date', { ascending: false })

  if (error) {
    console.log('[v0] getProviderBookings failed:', error.message)
    return []
  }
  return (data ?? []) as unknown as Booking[]
}

export type ProviderStats = {
  totalRevenue: number
  totalBookings: number
  upcomingBookings: number
  activeActivities: number
  averageRating: number
  totalReviews: number
}

/**
 * Aggregate dashboard figures for a provider.
 *
 * Revenue counts only paid bookings so pending or refunded rows do not inflate
 * the headline number.
 */
export function calculateProviderStats(
  activities: Activity[],
  bookings: Booking[],
): ProviderStats {
  const today = new Date().toISOString().slice(0, 10)

  const paidBookings = bookings.filter(
    (b) => b.payment_status === 'paid' && b.status !== 'cancelled',
  )

  const totalRevenue = paidBookings.reduce(
    (sum, b) => sum + Number(b.amount ?? 0),
    0,
  )

  const activeActivities = activities.filter((a) => a.is_active)

  const reviewCount = activities.reduce(
    (sum, a) => sum + (a.review_count ?? 0),
    0,
  )

  // Weight each activity's rating by its review count for a true average.
  const weightedRating = activities.reduce(
    (sum, a) => sum + (a.rating ?? 0) * (a.review_count ?? 0),
    0,
  )

  return {
    totalRevenue,
    totalBookings: bookings.filter((b) => b.status !== 'cancelled').length,
    upcomingBookings: bookings.filter(
      (b) => b.booking_date >= today && b.status !== 'cancelled',
    ).length,
    activeActivities: activeActivities.length,
    averageRating: reviewCount > 0 ? weightedRating / reviewCount : 0,
    totalReviews: reviewCount,
  }
}
