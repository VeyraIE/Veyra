"use client"

import { useState, useTransition } from "react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { 
  ChevronLeft, 
  Calendar, 
  Clock, 
  User, 
  Shield,
  CheckCircle2,
  Lock,
  Tag,
  Info
} from "lucide-react"
import BookingCheckout from "@/components/checkout/booking-checkout"
import { validatePromoCode } from "@/app/actions/bookings"
import type { BookableSession } from "@/lib/queries"
import type { Activity } from "@/lib/types"

type BookingStep = "booking" | "payment" | "confirmation"

const SERVICE_FEE = 2.5

export default function BookClient({
  activity,
  sessions,
}: {
  activity: Activity
  sessions: BookableSession[]
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dateParam = searchParams.get("date")
  const timeParam = searchParams.get("time")

  const firstSession = sessions[0]

  const [currentStep, setCurrentStep] = useState<BookingStep>("booking")
  const [selectedDate, setSelectedDate] = useState(dateParam || firstSession?.date || "")
  const [selectedTime, setSelectedTime] = useState(timeParam || firstSession?.time || "")
  const [participantType, setParticipantType] = useState<"self" | "child">("self")
  const [participantName, setParticipantName] = useState("")
  const [participantAge, setParticipantAge] = useState("")
  const [specialRequirements, setSpecialRequirements] = useState("")
  const [promoCode, setPromoCode] = useState("")
  const [promoDiscount, setPromoDiscount] = useState(0)
  const [promoError, setPromoError] = useState<string | null>(null)
  const [isValidatingPromo, startPromoValidation] = useTransition()
  const [showStripeCheckout, setShowStripeCheckout] = useState(false)

  const upcomingSessions = sessions

  const basePrice = activity.price ?? 0
  const discount = promoDiscount
  const serviceFee = SERVICE_FEE
  const total = Math.max(0, basePrice - discount) + serviceFee
  const promoApplied = promoDiscount > 0

  /** Validates the promo code against the promo_codes table on the server. */
  const handleApplyPromo = () => {
    const code = promoCode.trim()
    if (!code) return

    setPromoError(null)
    startPromoValidation(async () => {
      const result = await validatePromoCode(code, activity.id)
      if (result.ok) {
        setPromoDiscount(result.discount)
      } else {
        setPromoDiscount(0)
        setPromoError(result.error)
      }
    })
  }

  const steps = [
    { id: "booking", label: "Booking" },
    { id: "payment", label: "Payment" },
    { id: "confirmation", label: "Done" },
  ]

  const currentStepIndex = steps.findIndex(s => s.id === currentStep)

  const bookingComplete =
    !!selectedDate &&
    !!selectedTime &&
    (participantType === "self" || (!!participantName && !!participantAge))

  const participantSummary =
    participantType === "child" ? participantName : "Myself"

  if (currentStep === "confirmation") {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-3xl font-display font-extrabold text-foreground mb-2">Booking Confirmed</h1>
            <p className="text-muted-foreground mb-8">
              You&apos;re all set. We&apos;ve sent the details to your email.
            </p>

            <Card className="text-left mb-8">
              <CardContent className="p-6">
                <div className="flex gap-4 mb-6">
                  <div className="w-24 h-24 rounded-xl overflow-hidden relative shrink-0">
                    <Image unoptimized
                      src={activity.cover_image || activity.images?.[0] || "/placeholder.jpg"}
                      alt={activity.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{activity.title}</h3>
                    <p className="text-sm text-muted-foreground">{activity.provider?.business_name}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(selectedDate).toLocaleDateString('en-IE', { weekday: 'long', month: 'long', day: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {selectedTime}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Participant</span>
                    <span className="text-foreground">{participantSummary || "Self"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Confirmation #</span>
                    <span className="font-mono text-foreground">AH-2026-{Math.random().toString(36).substring(2, 8).toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Total Paid</span>
                    <span className="text-primary">€{total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" onClick={() => router.push("/dashboard")}>
                View My Bookings
              </Button>
              <Button onClick={() => router.push("/discover")}>
                Discover More
              </Button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 max-w-5xl">
        {/* Back Button */}
        <button
          onClick={() => currentStep === "booking" ? router.back() : setCurrentStep("booking")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
          Back
        </button>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-10">
          {steps.slice(0, -1).map((step, idx) => (
            <div key={step.id} className="flex items-center">
              <div className="flex items-center gap-2">
                <div className={`flex items-center justify-center h-9 w-9 rounded-full text-sm font-semibold transition-colors ${
                  idx <= currentStepIndex
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {idx < currentStepIndex ? <CheckCircle2 className="h-5 w-5" /> : idx + 1}
                </div>
                <span className={`text-sm font-medium hidden sm:block ${
                  idx <= currentStepIndex ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {step.label}
                </span>
              </div>
              {idx < steps.length - 2 && (
                <div className={`w-16 sm:w-28 h-0.5 mx-3 rounded ${
                  idx < currentStepIndex ? 'bg-primary' : 'bg-border'
                }`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {currentStep === "booking" && (
              <>
                {/* Session selection */}
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-display font-bold text-foreground mb-1">Choose a session</h2>
                    <p className="text-sm text-muted-foreground mb-5">Pick a date and time that works for you.</p>

                    {upcomingSessions.length === 0 && (
                      <div className="p-6 rounded-xl bg-muted/50 text-center">
                        <p className="font-medium text-foreground">No upcoming sessions</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          This activity has no scheduled sessions right now. Please check back soon.
                        </p>
                      </div>
                    )}

                    <div className="space-y-3">
                      {upcomingSessions.map((session, idx) => {
                        const selected = selectedDate === session.date && selectedTime === session.time
                        return (
                          <button
                            key={idx}
                            onClick={() => {
                              setSelectedDate(session.date)
                              setSelectedTime(session.time)
                            }}
                            className={`w-full p-4 rounded-xl border text-left transition-all ${
                              selected
                                ? 'border-primary bg-primary/10 ring-2 ring-primary/30'
                                : 'border-border hover:border-primary/50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-xl bg-muted flex flex-col items-center justify-center">
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(session.date).toLocaleDateString('en-IE', { month: 'short' })}
                                  </span>
                                  <span className="font-bold text-foreground">
                                    {new Date(session.date).getDate()}
                                  </span>
                                </div>
                                <div>
                                  <span className="font-medium text-foreground block">
                                    {session.day}
                                  </span>
                                  <span className="text-muted-foreground flex items-center gap-1 text-sm">
                                    <Clock className="h-4 w-4" />
                                    {session.time} · {activity.duration_minutes} mins
                                  </span>
                                </div>
                              </div>
                              <div className="text-right flex items-center gap-3">
                                <span className={`text-sm font-medium ${session.spots <= 3 ? 'text-destructive' : 'text-primary'}`}>
                                  {session.spots} spots left
                                </span>
                                {selected && (
                                  <CheckCircle2 className="h-5 w-5 text-primary" />
                                )}
                              </div>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Participant details */}
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-display font-bold text-foreground mb-1">Who&apos;s it for?</h2>
                    <p className="text-sm text-muted-foreground mb-5">Tell us who will be taking part.</p>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setParticipantType("self")}
                        className={`p-4 rounded-xl border text-center transition-all ${
                          participantType === "self"
                            ? 'border-primary bg-primary/10 ring-2 ring-primary/30'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <User className="h-6 w-6 mx-auto mb-2" />
                        <span className="font-medium">Myself</span>
                      </button>
                      <button
                        onClick={() => setParticipantType("child")}
                        className={`p-4 rounded-xl border text-center transition-all ${
                          participantType === "child"
                            ? 'border-primary bg-primary/10 ring-2 ring-primary/30'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <User className="h-6 w-6 mx-auto mb-2" />
                        <span className="font-medium">Someone else</span>
                      </button>
                    </div>

                    {participantType === "child" && (
                      <div className="space-y-4 mt-5">
                        <div>
                          <label className="text-sm font-medium text-foreground mb-2 block">
                            Participant&apos;s name
                          </label>
                          <Input
                            value={participantName}
                            onChange={(e) => setParticipantName(e.target.value)}
                            placeholder="Enter full name"
                            className="h-12"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-foreground mb-2 block">
                            Age
                          </label>
                          <Input
                            type="number"
                            value={participantAge}
                            onChange={(e) => setParticipantAge(e.target.value)}
                            placeholder="Enter age"
                            min={activity.min_age ?? undefined}
                            max={activity.max_age ?? undefined}
                            className="h-12"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            This activity is for ages {activity.min_age}-{activity.max_age}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="mt-5">
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Special requirements (optional)
                      </label>
                      <textarea
                        value={specialRequirements}
                        onChange={(e) => setSpecialRequirements(e.target.value)}
                        placeholder="Any allergies, medical conditions, or anything we should know?"
                        className="w-full p-4 rounded-xl border border-border bg-background min-h-[90px] resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>

                    <Button
                      onClick={() => setCurrentStep("payment")}
                      className="w-full mt-6"
                      size="lg"
                      disabled={!bookingComplete}
                    >
                      Continue to Payment
                    </Button>
                  </CardContent>
                </Card>
              </>
            )}

            {currentStep === "payment" && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-display font-bold text-foreground mb-5">Payment</h2>
                  
                  {!showStripeCheckout ? (
                    <>
                      {/* Promo Code */}
                      <div className="mb-6">
                        <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                          <Tag className="h-4 w-4" />
                          Promo code (optional)
                        </label>
                        <div className="flex gap-3">
                          <Input
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            placeholder="Enter code"
                            className="h-12"
                            disabled={promoApplied}
                          />
                          <Button 
                            variant="outline" 
                            onClick={handleApplyPromo}
                            disabled={promoApplied || !promoCode || isValidatingPromo}
                          >
                            {promoApplied ? "Applied" : isValidatingPromo ? "Checking..." : "Apply"}
                          </Button>
                        </div>
                        {promoApplied && (
                          <p className="text-sm text-primary mt-2 flex items-center gap-1">
                            <CheckCircle2 className="h-4 w-4" />
                            {`€${discount.toFixed(2)} discount applied`}
                          </p>
                        )}
                        {promoError && (
                          <p className="text-sm text-destructive mt-2" role="alert">
                            {promoError}
                          </p>
                        )}
                      </div>

                      {/* Security Note */}
                      <div className="mb-6 p-4 rounded-xl bg-muted/50 flex items-start gap-3">
                        <Lock className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div className="text-sm text-muted-foreground">
                          <p className="font-medium text-foreground">Secure payment</p>
                          <p>Processed securely by Stripe. We never store your card details.</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button 
                          variant="outline"
                          onClick={() => setCurrentStep("booking")} 
                          className="flex-1"
                          size="lg"
                        >
                          Back
                        </Button>
                        <Button 
                          onClick={() => setShowStripeCheckout(true)} 
                          className="flex-1"
                          size="lg"
                        >
                          Pay €{total.toFixed(2)}
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="mb-4">
                        <Button 
                          variant="ghost"
                          onClick={() => setShowStripeCheckout(false)} 
                          size="sm"
                        >
                          <ChevronLeft className="h-4 w-4 mr-1" />
                          Back
                        </Button>
                      </div>
                      
                      <BookingCheckout
                        activityId={activity.id}
                        activityTitle={activity.title}
                        sessionDate={selectedDate}
                        sessionTime={selectedTime}
                        participantName={participantSummary || "Self"}
                        priceInCents={Math.round(total * 100)}
                      />
                    </>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-4">Order summary</h3>
                
                <div className="flex gap-4 mb-6">
                  <div className="w-20 h-20 rounded-xl overflow-hidden relative shrink-0">
                    <Image unoptimized
                      src={activity.cover_image || activity.images?.[0] || "/placeholder.jpg"}
                      alt={activity.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground line-clamp-2">{activity.title}</h4>
                    <p className="text-sm text-muted-foreground">{activity.provider?.business_name}</p>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {selectedDate ? new Date(selectedDate).toLocaleDateString('en-IE', { weekday: 'long', month: 'long', day: 'numeric' }) : "Select a date"}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {selectedTime || "Select a time"} · {activity.duration_minutes} mins
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-4 w-4" />
                    {participantSummary || "Add participant"}
                  </div>
                </div>

                <div className="border-t border-border mt-6 pt-6 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Activity price</span>
                    <span className="text-foreground">€{basePrice.toFixed(2)}</span>
                  </div>
                  {promoApplied && (
                    <div className="flex justify-between text-primary">
                      <span>Promo discount</span>
                      <span>-€{discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground flex items-center gap-1">
                      Service fee
                      <Info className="h-3 w-3" />
                    </span>
                    <span className="text-foreground">€{serviceFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg pt-3 border-t border-border">
                    <span>Total</span>
                    <span className="text-primary">€{total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-border">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Shield className="h-5 w-5 text-primary" />
                    <span>Free cancellation up to 24 hours before</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
