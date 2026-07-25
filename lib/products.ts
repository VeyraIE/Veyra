export interface Product {
  id: string
  name: string
  description: string
  priceInCents: number
  type: 'subscription' | 'one_time'
  interval?: 'month' | 'year'
  features?: string[]
}

// Parent/User Premium subscription
export const SUBSCRIPTION_PRODUCTS: Product[] = [
  {
    id: 'premium-monthly',
    name: 'Activio Premium - Monthly',
    description: 'Unlock exclusive discounts and premium features',
    priceInCents: 499, // €4.99/month
    type: 'subscription',
    interval: 'month',
    features: [
      'Up to 15% off all bookings',
      'Early access to new activities',
      'Priority booking for popular sessions',
      'No booking fees',
      'Exclusive member-only activities',
      'Family account (up to 4 children)',
      'Free cancellation up to 24hrs',
      'Premium support',
    ],
  },
  {
    id: 'premium-yearly',
    name: 'Activio Premium - Yearly',
    description: 'Unlock exclusive discounts and premium features',
    priceInCents: 3999, // €39.99/year (save €20)
    type: 'subscription',
    interval: 'year',
    features: [
      'Up to 15% off all bookings',
      'Early access to new activities',
      'Priority booking for popular sessions',
      'No booking fees',
      'Exclusive member-only activities',
      'Family account (up to 4 children)',
      'Free cancellation up to 24hrs',
      'Premium support',
      '2 months free vs monthly',
    ],
  },
]

// Helper to get product by ID
export function getProductById(productId: string): Product | undefined {
  return SUBSCRIPTION_PRODUCTS.find((p) => p.id === productId)
}

// Helper to format price for display
export function formatPrice(priceInCents: number): string {
  return new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR',
  }).format(priceInCents / 100)
}
