export interface Category {
  id: string
  name: string
  slug: string
  icon: string
  description: string | null
  color: string | null
  created_at: string
}

export interface Profile {
  id: string
  email: string | null
  full_name: string | null
  avatar_url: string | null
  phone: string | null
  role: 'user' | 'provider' | 'admin'
  bio: string | null
  location: string | null
  county: string | null
  notification_preferences: {
    email: boolean
    push: boolean
    sms: boolean
  }
  created_at: string
  updated_at: string
}

export interface ChildProfile {
  id: string
  parent_id: string
  name: string
  date_of_birth: string | null
  age: number | null
  interests: string[] | null
  medical_notes: string | null
  emergency_contact: string | null
  emergency_phone: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Provider {
  id: string
  user_id: string
  business_name: string
  slug: string
  description: string | null
  logo_url: string | null
  cover_image_url: string | null
  website: string | null
  email: string | null
  phone: string | null
  address: string | null
  county: string | null
  eircode: string | null
  lat: number | null
  lng: number | null
  is_verified: boolean
  is_garda_vetted: boolean
  garda_vetting_date: string | null
  insurance_verified: boolean
  rating: number
  review_count: number
  subscription_plan: 'free' | 'starter' | 'professional' | 'enterprise'
  subscription_status: string
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  social_links: Record<string, string>
  business_hours: Record<string, { open: string; close: string }>
  certifications: string[] | null
  team_size: number
  founded_year: number | null
  created_at: string
  updated_at: string
}

export interface Activity {
  id: string
  provider_id: string
  category_id: string | null
  title: string
  slug: string
  description: string | null
  short_description: string | null
  what_to_learn: string[] | null
  what_to_bring: string[] | null
  images: string[] | null
  cover_image: string | null
  price: number | null
  price_type: 'per_session' | 'per_package' | 'subscription' | 'free'
  currency: string
  duration_minutes: number | null
  min_age: number | null
  max_age: number | null
  skill_level: 'beginner' | 'intermediate' | 'advanced' | 'all' | null
  is_indoor: boolean
  is_outdoor: boolean
  max_participants: number | null
  address: string | null
  county: string | null
  eircode: string | null
  lat: number | null
  lng: number | null
  is_active: boolean
  is_featured: boolean
  rating: number
  review_count: number
  booking_count: number
  waitlist_enabled: boolean
  instant_booking: boolean
  cancellation_policy: string | null
  safety_info: string | null
  requirements: string | null
  tags: string[] | null
  created_at: string
  updated_at: string
  // Joined data
  provider?: Provider
  category?: Category
  schedules?: Schedule[]
  sessions?: Session[]
  reviews?: Review[]
}

export interface Schedule {
  id: string
  activity_id: string
  day_of_week: number | null
  start_time: string
  end_time: string
  start_date: string | null
  end_date: string | null
  is_recurring: boolean
  max_participants: number | null
  current_participants: number
  is_active: boolean
  created_at: string
}

export interface Session {
  id: string
  activity_id: string
  schedule_id: string | null
  date: string
  start_time: string
  end_time: string
  max_participants: number | null
  current_participants: number
  status: 'scheduled' | 'cancelled' | 'completed'
  notes: string | null
  created_at: string
}

export interface Booking {
  id: string
  user_id: string
  activity_id: string
  session_id: string | null
  child_id: string | null
  provider_id: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show'
  payment_status: 'pending' | 'paid' | 'refunded' | 'failed'
  amount: number | null
  currency: string
  stripe_payment_intent_id: string | null
  promo_code: string | null
  discount_amount: number
  participant_name: string | null
  participant_age: number | null
  special_requirements: string | null
  qr_code: string | null
  checked_in: boolean
  checked_in_at: string | null
  booking_date: string
  booking_time: string | null
  notes: string | null
  cancellation_reason: string | null
  cancelled_at: string | null
  created_at: string
  updated_at: string
  // Joined data
  activity?: Activity
  session?: Session
  child?: ChildProfile
  provider?: Provider
}

export interface Review {
  id: string
  user_id: string
  activity_id: string
  provider_id: string
  booking_id: string | null
  rating: number
  title: string | null
  comment: string | null
  response: string | null
  response_date: string | null
  is_verified: boolean
  is_approved: boolean
  helpful_count: number
  created_at: string
  updated_at: string
  // Joined data
  user?: Profile
}

export interface Favorite {
  id: string
  user_id: string
  activity_id: string
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  type: string
  title: string
  message: string | null
  data: Record<string, unknown>
  read: boolean
  read_at: string | null
  created_at: string
}

export interface PromoCode {
  id: string
  provider_id: string | null
  code: string
  description: string | null
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  min_purchase: number
  max_uses: number | null
  current_uses: number
  valid_from: string
  valid_until: string | null
  is_active: boolean
  activity_ids: string[] | null
  created_at: string
}

export interface Message {
  id: string
  sender_id: string
  receiver_id: string
  booking_id: string | null
  subject: string | null
  content: string
  read: boolean
  read_at: string | null
  created_at: string
}

// Irish Counties
export const IRISH_COUNTIES = [
  'Antrim', 'Armagh', 'Carlow', 'Cavan', 'Clare', 'Cork', 'Derry', 'Donegal',
  'Down', 'Dublin', 'Fermanagh', 'Galway', 'Kerry', 'Kildare', 'Kilkenny',
  'Laois', 'Leitrim', 'Limerick', 'Longford', 'Louth', 'Mayo', 'Meath',
  'Monaghan', 'Offaly', 'Roscommon', 'Sligo', 'Tipperary', 'Tyrone',
  'Waterford', 'Westmeath', 'Wexford', 'Wicklow'
] as const

export type IrishCounty = typeof IRISH_COUNTIES[number]

// Age ranges for filtering
export const AGE_RANGES = [
  { label: '0-3 years', min: 0, max: 3 },
  { label: '4-6 years', min: 4, max: 6 },
  { label: '7-12 years', min: 7, max: 12 },
  { label: '13-17 years', min: 13, max: 17 },
  { label: '18+ adults', min: 18, max: 100 },
] as const

// Price ranges for filtering
export const PRICE_RANGES = [
  { label: 'Free', min: 0, max: 0 },
  { label: 'Under €10', min: 0.01, max: 10 },
  { label: '€10 - €25', min: 10, max: 25 },
  { label: '€25 - €50', min: 25, max: 50 },
  { label: '€50+', min: 50, max: 10000 },
] as const

// Days of the week
export const DAYS_OF_WEEK = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
] as const
