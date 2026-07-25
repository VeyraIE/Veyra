'use client'

import { useCallback } from 'react'
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

import { startBookingCheckout } from '@/app/actions/stripe'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface BookingCheckoutProps {
  activityId: string
  activityTitle: string
  sessionDate: string
  sessionTime: string
  participantName: string
  priceInCents: number
}

export default function BookingCheckout({
  activityId,
  activityTitle,
  sessionDate,
  sessionTime,
  participantName,
  priceInCents,
}: BookingCheckoutProps) {
  const fetchClientSecret = useCallback(
    () => startBookingCheckout({
      activityId,
      activityTitle,
      sessionDate,
      sessionTime,
      participantName,
      priceInCents,
    }),
    [activityId, activityTitle, sessionDate, sessionTime, participantName, priceInCents]
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
