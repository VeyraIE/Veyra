import { IRISH_COUNTIES } from '@/lib/types'

/**
 * Filter option lists for the discover and category pages.
 *
 * The county list is re-exported from `lib/types` rather than duplicated so
 * there is a single source of truth for Irish counties.
 */
export const counties = IRISH_COUNTIES

export const ageRanges = [
  { label: 'All Ages', value: 'all' },
  { label: '0-3 years', value: '0-3' },
  { label: '4-6 years', value: '4-6' },
  { label: '7-10 years', value: '7-10' },
  { label: '11-14 years', value: '11-14' },
  { label: '15-17 years', value: '15-17' },
  { label: 'Adults (18+)', value: '18+' },
]

export const priceRanges = [
  { label: 'Any Price', value: 'all' },
  { label: 'Free', value: 'free' },
  { label: 'Under €10', value: '0-10' },
  { label: '€10 - €25', value: '10-25' },
  { label: '€25 - €50', value: '25-50' },
  { label: '€50+', value: '50+' },
]

export const skillLevels = [
  { label: 'All Levels', value: 'all' },
  { label: 'Beginner', value: 'beginner' },
  { label: 'Intermediate', value: 'intermediate' },
  { label: 'Advanced', value: 'advanced' },
]
