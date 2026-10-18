import { membershipFeatures, membershipName, membershipPrice } from '@/lib/membership/constants'

export interface Product {
  id: string
  name: string
  description: string
  priceInCents: number
  type: 'subscription' | 'one_time'
  interval?: 'month' | 'year'
  features?: string[]
}

export const SUBSCRIPTION_PRODUCTS: Product[] = [{
  id: 'premium-monthly',
  name: membershipName,
  description: 'Member benefits, participating experience discounts and partner venue offers.',
  priceInCents: membershipPrice,
  type: 'subscription',
  interval: 'month',
  features: membershipFeatures,
}]

export function getProductById(productId: string): Product | undefined {
  return SUBSCRIPTION_PRODUCTS.find(product => product.id === productId)
}

export function formatPrice(priceInCents: number): string {
  return new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(priceInCents / 100)
}


