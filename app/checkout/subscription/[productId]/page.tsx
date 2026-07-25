'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Shield, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import SubscriptionCheckout from '@/components/checkout/subscription-checkout'
import { getProductById, formatPrice } from '@/lib/products'

export default function SubscriptionCheckoutPage() {
  const params = useParams()
  const productId = params.productId as string
  const product = getProductById(productId)

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <h1 className="text-xl font-semibold mb-2">Plan Not Found</h1>
            <p className="text-muted-foreground mb-4">
              The subscription plan you&apos;re looking for doesn&apos;t exist.
            </p>
            <Button asChild>
              <Link href="/pricing">View Pricing Plans</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/pricing">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="font-semibold">Complete Your Subscription</h1>
              <p className="text-sm text-muted-foreground">Secure checkout powered by Stripe</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Order Summary */}
          <div className="order-2 lg:order-1">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatPrice(product.priceInCents)}</p>
                    <p className="text-sm text-muted-foreground">
                      /{product.interval === 'month' ? 'mo' : 'yr'}
                    </p>
                  </div>
                </div>

                {product.features && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3">What&apos;s included:</h4>
                    <ul className="space-y-2">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="border-t pt-4">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>{formatPrice(product.priceInCents)}/{product.interval === 'month' ? 'mo' : 'yr'}</span>
                  </div>
                  {product.interval === 'year' && (
                    <p className="text-sm text-emerald-600 mt-1">
                      You&apos;re saving €20 with annual billing!
                    </p>
                  )}
                </div>

                <div className="bg-muted/50 rounded-lg p-4 flex items-start gap-3">
                  <Shield className="h-5 w-5 text-primary mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium">Secure Payment</p>
                    <p className="text-muted-foreground">
                      Your payment is protected by 256-bit SSL encryption
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stripe Checkout */}
          <div className="order-1 lg:order-2">
            <Card>
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
              </CardHeader>
              <CardContent>
                <SubscriptionCheckout productId={productId} />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
