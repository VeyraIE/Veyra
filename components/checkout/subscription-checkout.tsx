'use client'

import { useCallback } from 'react'
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

import { startSubscriptionCheckout } from '@/app/actions/stripe'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface SubscriptionCheckoutProps {
  productId: string
}

export default function SubscriptionCheckout({ productId }: SubscriptionCheckoutProps) {
  const fetchClientSecret = useCallback(
    () => startSubscriptionCheckout(productId),
    [productId]
  )

  return (
    <div id="checkout" className="w-full">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{ fetchClientSecret }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  )
}
