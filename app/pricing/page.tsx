"use client"

import { useState } from "react"
import Link from "next/link"
import { Check, X, Sparkles, Users, Building2, Percent, Clock, Shield, Star, Heart, Gift, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

const parentPlans = [
  {
    name: "Free",
    description: "Discover and book activities",
    monthlyPrice: 0,
    yearlyPrice: 0,
    productId: null,
    icon: Users,
    color: "bg-gray-100 text-gray-600",
    features: [
      { text: "Browse all activities", included: true },
      { text: "Book unlimited sessions", included: true },
      { text: "Save favorites", included: true },
      { text: "Activity reviews", included: true },
      { text: "Email support", included: true },
      { text: "1 child profile", included: true },
      { text: "Standard booking fees", included: true },
      { text: "Discounted rates", included: false },
      { text: "Priority booking", included: false },
      { text: "Free cancellation", included: false },
    ],
    cta: "Sign Up Free",
    popular: false,
  },
  {
    name: "Premium",
    description: "Unlock exclusive benefits",
    monthlyPrice: 4.99,
    yearlyPrice: 39.99,
    monthlyProductId: "premium-monthly",
    yearlyProductId: "premium-yearly",
    icon: Sparkles,
    color: "bg-primary/10 text-primary",
    features: [
      { text: "Everything in Free", included: true },
      { text: "Up to 15% off all bookings", included: true },
      { text: "No booking fees", included: true },
      { text: "Priority booking for popular sessions", included: true },
      { text: "Early access to new activities", included: true },
      { text: "Exclusive member-only activities", included: true },
      { text: "Family account (up to 4 children)", included: true },
      { text: "Free cancellation up to 24hrs", included: true },
      { text: "Premium support", included: true },
      { text: "Monthly activity credits", included: true },
    ],
    cta: "Go Premium",
    popular: true,
  },
]

const providerBenefits = [
  {
    icon: Zap,
    title: "Instant Setup",
    description: "Create your listing in minutes and start accepting bookings today",
  },
  {
    icon: Users,
    title: "Reach More Families",
    description: "Connect with thousands of parents actively looking for activities",
  },
  {
    icon: Clock,
    title: "Save Time",
    description: "Automated booking management, reminders, and payment collection",
  },
  {
    icon: Shield,
    title: "Build Trust",
    description: "Verified badges, reviews, and safeguarding features build credibility",
  },
]

const premiumBenefits = [
  {
    icon: Percent,
    title: "Save up to 15%",
    description: "Exclusive discounts on every booking you make",
  },
  {
    icon: Star,
    title: "Priority Access",
    description: "Book popular sessions before they fill up",
  },
  {
    icon: Heart,
    title: "Family Friendly",
    description: "Manage up to 4 children under one account",
  },
  {
    icon: Gift,
    title: "Member Exclusives",
    description: "Access activities only available to Premium members",
  },
]

const faqs = [
  {
    question: "Is Activio really free for providers?",
    answer: "Yes! Listing your activities on Activio is completely free. There are no subscription fees, setup costs, or hidden charges. We only charge a small transaction fee when you receive a booking.",
  },
  {
    question: "What transaction fees do providers pay?",
    answer: "We charge a 5% transaction fee on each successful booking. This covers payment processing, platform maintenance, and customer support.",
  },
  {
    question: "What do I get with Premium?",
    answer: "Premium members get up to 15% off all bookings, no booking fees, priority access to popular sessions, early access to new activities, and can manage up to 4 children under one account.",
  },
  {
    question: "Can I cancel Premium anytime?",
    answer: "Yes! You can cancel your Premium subscription at any time. You'll continue to have access until the end of your billing period.",
  },
  {
    question: "Do I need Premium to book activities?",
    answer: "No! You can browse and book any activity with a free account. Premium just gives you extra discounts and benefits.",
  },
  {
    question: "How much can I save with Premium?",
    answer: "On average, Premium members save over €15 per month on bookings. If you book just 3-4 activities per month, Premium pays for itself!",
  },
]

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pb-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
          <div className="container text-center">
            <Badge variant="secondary" className="mb-4">
              Simple, Fair Pricing
            </Badge>
            <h1 className="text-balance text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Free for providers.<br />Great value for families.
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">
              Providers list activities for free. Parents can book with a free account or go Premium for exclusive discounts and benefits.
            </p>
          </div>
        </section>

        {/* For Providers Section */}
        <section className="container py-16">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">For Providers</Badge>
            <h2 className="text-3xl font-bold">List your activities for free</h2>
            <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
              No subscription fees. No setup costs. Just a small 5% transaction fee when you receive bookings.
            </p>
          </div>

          <Card className="max-w-4xl mx-auto border-2 border-emerald-200 bg-emerald-50/50">
            <CardContent className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-4">
                    <Building2 className="h-4 w-4" />
                    Forever Free
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Everything you need to grow your activity business</h3>
                  <ul className="space-y-3">
                    {[
                      "Unlimited activity listings",
                      "Online booking & payments",
                      "Automated reminders",
                      "Customer reviews",
                      "Analytics dashboard",
                      "Waitlist management",
                      "QR code check-in",
                      "In-app messaging",
                    ].map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-emerald-600 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="text-center md:text-right">
                  <div className="text-5xl font-bold text-emerald-600">€0</div>
                  <div className="text-muted-foreground mb-4">per month, forever</div>
                  <div className="text-sm text-muted-foreground mb-6">
                    Only 5% transaction fee on bookings
                  </div>
                  <Button size="lg" className="w-full md:w-auto" asChild>
                    <Link href="/provider/onboarding">List Your Activity</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Provider Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {providerBenefits.map((benefit) => (
              <Card key={benefit.title} className="text-center">
                <CardContent className="pt-6">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-primary/10 text-primary mb-4">
                    <benefit.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* For Parents Section */}
        <section className="bg-muted/30 py-16">
          <div className="container">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">For Parents & Adults</Badge>
              <h2 className="text-3xl font-bold">Choose your plan</h2>
              <p className="mt-2 text-muted-foreground">
                Book activities for free, or go Premium for exclusive discounts
              </p>
              
              {/* Billing Toggle */}
              <div className="mt-8 flex items-center justify-center gap-4">
                <span className={`text-sm ${!isYearly ? "font-semibold" : "text-muted-foreground"}`}>Monthly</span>
                <Switch
                  checked={isYearly}
                  onCheckedChange={setIsYearly}
                />
                <span className={`text-sm ${isYearly ? "font-semibold" : "text-muted-foreground"}`}>
                  Yearly
                  <Badge variant="secondary" className="ml-2 bg-emerald-100 text-emerald-700">
                    2 months free
                  </Badge>
                </span>
              </div>
            </div>

            {/* Parent Plans */}
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {parentPlans.map((plan) => (
                <Card 
                  key={plan.name} 
                  className={`relative flex flex-col ${plan.popular ? "border-primary shadow-lg ring-2 ring-primary" : ""}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary">Best Value</Badge>
                    </div>
                  )}
                  <CardHeader className="pb-4">
                    <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${plan.color}`}>
                      <plan.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">
                        €{isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                      </span>
                      {plan.monthlyPrice > 0 && (
                        <span className="text-muted-foreground">
                          /{isYearly ? "year" : "month"}
                        </span>
                      )}
                      {plan.monthlyPrice === 0 && (
                        <span className="text-muted-foreground ml-2">forever</span>
                      )}
                    </div>
                    {plan.popular && isYearly && (
                      <p className="text-sm text-emerald-600 mt-2">
                        Save €20 vs monthly billing
                      </p>
                    )}
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col">
                    <ul className="flex-1 space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature.text} className="flex items-start gap-2">
                          {feature.included ? (
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                          ) : (
                            <X className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/50" />
                          )}
                          <span className={feature.included ? "" : "text-muted-foreground"}>{feature.text}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`mt-6 w-full ${plan.popular ? "" : ""}`}
                      variant={plan.popular ? "default" : "outline"}
                      size="lg"
                      asChild
                    >
                      <Link href={
                        plan.productId === null 
                          ? "/auth/sign-up" 
                          : `/checkout/subscription/${isYearly ? plan.yearlyProductId : plan.monthlyProductId}`
                      }>
                        {plan.cta}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Premium Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 max-w-5xl mx-auto">
              {premiumBenefits.map((benefit) => (
                <div key={benefit.title} className="flex items-start gap-3">
                  <div className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10 text-primary shrink-0">
                    <benefit.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="container py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Frequently asked questions</h2>
            <p className="mt-2 text-muted-foreground">Everything you need to know about pricing</p>
          </div>
          
          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
            {faqs.map((faq) => (
              <Card key={faq.question}>
                <CardContent className="p-6">
                  <h3 className="font-semibold">{faq.question}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container">
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="flex flex-col items-center p-12 text-center">
              <h2 className="text-3xl font-bold">Ready to get started?</h2>
              <p className="mt-4 max-w-2xl text-primary-foreground/80">
                Whether you&apos;re a parent looking for activities or a provider wanting to reach more families, Activio makes it easy.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/discover">Find Activities</Link>
                </Button>
                <Button size="lg" variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10" asChild>
                  <Link href="/provider/onboarding">List Your Activity</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  )
}
