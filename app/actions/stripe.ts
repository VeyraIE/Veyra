'use server'

import { stripe } from '@/lib/stripe'
import { getProductById, SUBSCRIPTION_PRODUCTS } from '@/lib/products'

// Start a checkout session for provider subscriptions
export async function startSubscriptionCheckout(productId: string) {
  const product = getProductById(productId)
  if (!product) {
    throw new Error(`Product with id "${productId}" not found`)
  }

  if (product.type !== 'subscription') {
    throw new Error('This product is not a subscription')
  }

  const session = await stripe.checkout.sessions.create({
    ui_mode: 'embedded',
    redirect_on_completion: 'never',
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: product.name,
            description: product.description,
          },
          unit_amount: product.priceInCents,
          recurring: product.interval ? {
            interval: product.interval,
          } : undefined,
        },
        quantity: 1,
      },
    ],
    mode: 'subscription',
  })

  return session.client_secret
}

// Start a checkout session for activity booking
export async function startBookingCheckout(bookingDetails: {
  activityId: string
  activityTitle: string
  sessionDate: string
  sessionTime: string
  participantName: string
  priceInCents: number
}) {
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

