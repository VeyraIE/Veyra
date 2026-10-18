'use server'

import { stripe } from '@/lib/stripe'

export async function startSubscriptionCheckout(productId: string): Promise<string> {
  void productId
  throw new Error('Sign in to your Veyra account to subscribe securely.')
}

// Start a checkout session for activity booking
export async function startBookingCheckout(bookingDetails: {
  activityId: string
  activityTitle: string
  sessionDate: string
  sessionTime: string
  participantName: string
  priceInCents: number
}): Promise<string> {
  void bookingDetails
  throw new Error('Use the secure Veyra marketplace checkout for bookings.')
}

// Get checkout session status
export async function getCheckoutSessionStatus(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId)
  
  return {
    status: session.status,
    paymentStatus: session.payment_status,
  }
}

