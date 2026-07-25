import { createClient } from '@/lib/supabase/server'
import type { Activity, Category, Provider, Review, Session } from '@/lib/types'

/**
 * Server-side data access for the public catalogue.
 *
 * Every function here runs on the server and relies on the RLS policies
 * already defined in the database: catalogue tables (activities, categories,
 * providers, reviews, sessions) are publicly readable, everything else is
 * owner-scoped. That means these helpers are safe to call before a user
 * has signed in.
 */

const ACTIVITY_SELECT = `
  *,
  provider:providers(*),
  category:categories(*)
`

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  if (error) {
    console.log('[v0] getCategories failed:', error.message)
    return []
  }
  return (data ?? []) as Category[]
}

export async function getActivities(): Promise<Activity[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('activities')
    .select(ACTIVITY_SELECT)
    .eq('is_active', true)
    .order('is_featured', { ascending: false })
    .order('rating', { ascending: false })

  if (error) {
    console.log('[v0] getActivities failed:', error.message)
    return []
  }
  return (data ?? []) as unknown as Activity[]
}

export async function getFeaturedActivities(limit = 8): Promise<Activity[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('activities')
    .select(ACTIVITY_SELECT)
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('rating', { ascending: false })
    .limit(limit)

  if (error) {
    console.log('[v0] getFeaturedActivities failed:', error.message)
    return []
  }
  return (data ?? []) as unknown as Activity[]
}

/**
 * Activities are addressed by slug in the URL, but older links (and the
 * activity cards) may still use the raw UUID. Accept either.
 */
export async function getActivity(slugOrId: string): Promise<Activity | null> {
  const supabase = await createClient()
  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      slugOrId,
    )

  const { data, error } = await supabase
    .from('activities')
    .select(ACTIVITY_SELECT)
    .eq(isUuid ? 'id' : 'slug', slugOrId)
    .maybeSingle()

  if (error) {
    console.log('[v0] getActivity failed:', error.message)
    return null
  }
  return (data as unknown as Activity) ?? null
}

/**
 * Filtering on an embedded table (`categories.slug`) does not restrict the
 * parent rows unless the join is declared as inner, so resolve the category
 * to its id first and filter on the activities table directly.
 */
export async function getActivitiesByCategory(
  categorySlug: string,
): Promise<Activity[]> {
  const category = await getCategory(categorySlug)
  if (!category) return []

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('activities')
    .select(ACTIVITY_SELECT)
    .eq('is_active', true)
    .eq('category_id', category.id)
    .order('rating', { ascending: false })

  if (error) {
    console.log('[v0] getActivitiesByCategory failed:', error.message)
    return []
  }
  return (data ?? []) as unknown as Activity[]
}

/** Other activities in the same category, excluding the current one. */
export async function getSimilarActivities(
  categoryId: string | null,
  excludeActivityId: string,
  limit = 2,
): Promise<Activity[]> {
  if (!categoryId) return []

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('activities')
    .select(ACTIVITY_SELECT)
    .eq('is_active', true)
    .eq('category_id', categoryId)
    .neq('id', excludeActivityId)
    .order('rating', { ascending: false })
    .limit(limit)

  if (error) {
    console.log('[v0] getSimilarActivities failed:', error.message)
    return []
  }
  return (data ?? []) as unknown as Activity[]
}

export async function getCategory(slug: string): Promise<Category | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()

  if (error) {
    console.log('[v0] getCategory failed:', error.message)
    return null
  }
  return (data as Category) ?? null
}

export async function getProvider(slug: string): Promise<Provider | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('providers')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()

  if (error) {
    console.log('[v0] getProvider failed:', error.message)
    return null
  }
  return (data as Provider) ?? null
}

export async function getProviderActivities(
  providerId: string,
): Promise<Activity[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('activities')
    .select(ACTIVITY_SELECT)
    .eq('provider_id', providerId)
    .eq('is_active', true)
    .order('rating', { ascending: false })

  if (error) {
    console.log('[v0] getProviderActivities failed:', error.message)
    return []
  }
  return (data ?? []) as unknown as Activity[]
}

export async function getActivityReviews(
  activityId: string,
): Promise<Review[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('reviews')
    .select('*, user:profiles(id, full_name, avatar_url)')
    .eq('activity_id', activityId)
    .eq('is_approved', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.log('[v0] getActivityReviews failed:', error.message)
    return []
  }
  return (data ?? []) as unknown as Review[]
}

/** Approved reviews across every activity belonging to a provider. */
export async function getProviderReviews(
  providerId: string,
): Promise<Review[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('reviews')
    .select('*, user:profiles(id, full_name, avatar_url)')
    .eq('provider_id', providerId)
    .eq('is_approved', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.log('[v0] getProviderReviews failed:', error.message)
    return []
  }
  return (data ?? []) as unknown as Review[]
}

/** Upcoming, not-yet-full sessions for an activity, used by the booking flow. */
export async function getUpcomingSessions(
  activityId: string,
): Promise<Session[]> {
  const supabase = await createClient()
  const today = new Date().toISOString().slice(0, 10)

  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('activity_id', activityId)
    .eq('status', 'scheduled')
    .gte('date', today)
    .order('date')
    .order('start_time')

  if (error) {
    console.log('[v0] getUpcomingSessions failed:', error.message)
    return []
  }
  return (data ?? []) as unknown as Session[]
}

/** A session flattened into the shape the booking UI renders. */
export type BookableSession = {
  id: string
  date: string
  day: string
  time: string
  spots: number
}

/**
 * Upcoming sessions with remaining capacity, formatted for the booking flow.
 * Sessions that are already full are excluded so users cannot select them.
 */
export async function getBookableSessions(
  activityId: string,
): Promise<BookableSession[]> {
  const sessions = await getUpcomingSessions(activityId)

  return sessions
    .map((session) => {
      const max = session.max_participants ?? 0
      const current = session.current_participants ?? 0

      return {
        id: session.id,
        date: session.date,
        day: new Date(session.date).toLocaleDateString('en-IE', {
          weekday: 'long',
        }),
        // Stored as `HH:MM:SS`; the UI only shows hours and minutes.
        time: (session.start_time ?? '').slice(0, 5),
        spots: Math.max(0, max - current),
      }
    })
    .filter((session) => session.spots > 0)
}
