"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { MobileNav } from "@/components/layout/mobile-nav"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Star,
  MapPin,
  Clock,
  Users,
  Calendar,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Shield,
  CheckCircle2,
  Info,
  User,
  MessageCircle,
  ExternalLink,
} from "lucide-react"
import type { Activity, Review, Session } from "@/lib/types"

const PLACEHOLDER = "/placeholder.svg"

interface ActivityClientProps {
  activity: Activity
  reviews: Review[]
  sessions: Session[]
  similarActivities: Activity[]
}

export function ActivityClient({
  activity,
  reviews,
  sessions,
  similarActivities,
}: ActivityClientProps) {
  const router = useRouter()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null)

  const images = activity.images?.length
    ? activity.images
    : [activity.cover_image || PLACEHOLDER]

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % images.length)
  const prevImage = () =>
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)

  const selectedSession = sessions.find((s) => s.id === selectedSessionId)

  const handleBookNow = () => {
    if (selectedSession) {
      router.push(
        `/book/${activity.slug}?session=${selectedSession.id}&date=${selectedSession.date}&time=${selectedSession.start_time}`,
      )
    } else {
      router.push(`/book/${activity.slug}`)
    }
  }

  const formatTime = (time: string) => time.slice(0, 5)

  const priceSuffix =
    activity.price_type === "per_session"
      ? "session"
      : activity.price_type === "per_package"
        ? "package"
        : activity.price_type === "subscription"
          ? "month"
          : activity.price_type

  const ageRange =
    activity.min_age !== null && activity.max_age !== null
      ? `${activity.min_age}-${activity.max_age}`
      : activity.min_age !== null
        ? `${activity.min_age}+`
        : "All ages"

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 pb-24 md:pb-0">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 py-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/discover" className="hover:text-foreground transition-colors">
              Discover
            </Link>
            <span>/</span>
            <span className="text-foreground">{activity.title}</span>
          </nav>
        </div>

        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Image Gallery */}
              <div className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-muted">
                <Image unoptimized
                  src={images[currentImageIndex] || PLACEHOLDER}
                  alt={activity.title}
                  fill
                  className="object-cover"
                  priority
                />

                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      aria-label="Previous image"
                      className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-background transition-colors"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      aria-label="Next image"
                      className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-background transition-colors"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          aria-label={`Go to image ${idx + 1}`}
                          className={`h-2 rounded-full transition-all ${
                            idx === currentImageIndex ? "w-6 bg-background" : "w-2 bg-background/50"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}

                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    aria-label={isFavorite ? "Remove from favourites" : "Add to favourites"}
                    aria-pressed={isFavorite}
                    className="h-10 w-10 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-background transition-colors"
                  >
                    <Heart className={`h-5 w-5 ${isFavorite ? "fill-destructive text-destructive" : ""}`} />
                  </button>
                  <button
                    aria-label="Share this activity"
                    className="h-10 w-10 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-background transition-colors"
                  >
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>

                <div className="absolute top-4 left-4">
                  <Badge className="bg-primary text-primary-foreground">
                    {activity.category?.name || "Activity"}
                  </Badge>
                </div>
              </div>

              {/* Title and Quick Info */}
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground text-balance">
                      {activity.title}
                    </h1>
                    <p className="text-lg text-muted-foreground mt-2">
                      by {activity.provider?.business_name}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="h-5 w-5 fill-current" />
                      <span className="font-semibold text-foreground">{activity.rating}</span>
                      <span className="text-muted-foreground">({activity.review_count} reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mt-6">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-5 w-5" />
                    <span>{activity.address || activity.county}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-5 w-5" />
                    <span>{activity.duration_minutes} mins</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-5 w-5" />
                    <span>Ages {ageRange}</span>
                  </div>
                  {activity.skill_level && (
                    <Badge variant="outline" className="capitalize">
                      {activity.skill_level}
                    </Badge>
                  )}
                </div>

                {activity.tags && activity.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {activity.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="rounded-full">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Description */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">About this activity</h2>
                  <p className="text-muted-foreground leading-relaxed">{activity.description}</p>
                </CardContent>
              </Card>

              {/* What you'll learn */}
              {activity.what_to_learn && activity.what_to_learn.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold text-foreground mb-4">What you&apos;ll learn</h2>
                    <ul className="space-y-3">
                      {activity.what_to_learn.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* What to bring */}
              {activity.what_to_bring && activity.what_to_bring.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold text-foreground mb-4">What to bring</h2>
                    <ul className="space-y-3">
                      {activity.what_to_bring.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <Info className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Provider Info */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">About the provider</h2>
                  <div className="flex items-start gap-4">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
                      {activity.provider?.logo_url ? (
                        <Image unoptimized
                          src={activity.provider.logo_url}
                          alt={activity.provider.business_name}
                          width={64}
                          height={64}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-8 w-8 text-primary" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-foreground">
                          {activity.provider?.business_name}
                        </h3>
                        {activity.provider?.is_verified && (
                          <Badge className="bg-primary/10 text-primary border-0">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                        {activity.provider?.is_garda_vetted && (
                          <Badge className="bg-emerald-500/10 text-emerald-600 border-0">
                            <Shield className="h-3 w-3 mr-1" />
                            Garda Vetted
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground mt-2">{activity.provider?.description}</p>
                      <div className="flex items-center gap-4 mt-4 flex-wrap">
                        <div className="flex items-center gap-1 text-amber-500">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="font-medium text-foreground">{activity.provider?.rating}</span>
                          <span className="text-muted-foreground text-sm">
                            ({activity.provider?.review_count} reviews)
                          </span>
                        </div>
                        <Button variant="outline" size="sm">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Contact
                        </Button>
                        {activity.provider?.slug && (
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/provider/${activity.provider.slug}`}>
                              <ExternalLink className="h-4 w-4 mr-2" />
                              View Profile
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Safety Information */}
              <Card className="border-emerald-200 bg-emerald-50/50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                      <Shield className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-foreground mb-2">Safety &amp; Trust</h2>
                      <ul className="space-y-2 text-muted-foreground">
                        {activity.provider?.is_garda_vetted && (
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            All staff are Garda vetted
                          </li>
                        )}
                        {activity.provider?.insurance_verified && (
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            Full insurance coverage
                          </li>
                        )}
                        {activity.provider?.certifications?.map((cert) => (
                          <li key={cert} className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            {cert}
                          </li>
                        ))}
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          Secure booking and payments
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Reviews */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-foreground">Reviews</h2>
                    <Button variant="outline" size="sm">
                      Write a Review
                    </Button>
                  </div>

                  {reviews.length > 0 ? (
                    <>
                      <div className="flex items-center gap-6 mb-6 pb-6 border-b border-border">
                        <div className="text-center">
                          <div className="text-4xl font-bold text-foreground">{activity.rating}</div>
                          <div className="flex items-center gap-1 text-amber-500 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < Math.floor(activity.rating || 0) ? "fill-current" : ""}`}
                              />
                            ))}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {activity.review_count} reviews
                          </p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        {reviews.slice(0, 3).map((review) => (
                          <div key={review.id} className="pb-6 border-b border-border last:border-0">
                            <div className="flex items-start gap-4">
                              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                                <User className="h-5 w-5 text-muted-foreground" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-foreground">
                                    {review.user?.full_name || "Anonymous"}
                                  </span>
                                  {review.is_verified && (
                                    <Badge variant="secondary" className="text-xs">
                                      Verified
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="flex items-center gap-0.5 text-amber-500">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`h-3 w-3 ${i < review.rating ? "fill-current" : ""}`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-sm text-muted-foreground">
                                    {new Date(review.created_at).toLocaleDateString("en-IE")}
                                  </span>
                                </div>
                                {review.title && (
                                  <h3 className="font-medium text-foreground mb-1">{review.title}</h3>
                                )}
                                <p className="text-muted-foreground">{review.comment}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {reviews.length > 3 && (
                        <Button variant="outline" className="w-full mt-6">
                          View All {reviews.length} Reviews
                        </Button>
                      )}
                    </>
                  ) : (
                    <p className="text-muted-foreground">
                      No reviews yet — be the first to share your experience.
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Similar Activities */}
              {similarActivities.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-4">Similar activities</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {similarActivities.map((similar) => (
                      <Link key={similar.id} href={`/activity/${similar.slug}`}>
                        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                          <div className="aspect-video relative">
                            <Image unoptimized
                              src={similar.cover_image || similar.images?.[0] || PLACEHOLDER}
                              alt={similar.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-semibold text-foreground">{similar.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {similar.provider?.business_name}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-1 text-amber-500">
                                <Star className="h-4 w-4 fill-current" />
                                <span className="text-sm font-medium text-foreground">
                                  {similar.rating}
                                </span>
                              </div>
                              <span className="font-semibold text-primary">€{similar.price}</span>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Booking Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <Card className="shadow-xl">
                  <CardContent className="p-6">
                    <div className="flex items-baseline justify-between mb-6">
                      <div>
                        <span className="text-3xl font-bold text-foreground">€{activity.price}</span>
                        <span className="text-muted-foreground">/{priceSuffix}</span>
                      </div>
                      {activity.instant_booking && (
                        <Badge className="bg-emerald-500/10 text-emerald-600 border-0">
                          Instant Book
                        </Badge>
                      )}
                    </div>

                    {/* Session Selection */}
                    <div className="mb-6">
                      <h2 className="font-medium text-foreground mb-3 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Select a session
                      </h2>
                      {sessions.length > 0 ? (
                        <div className="space-y-2 max-h-80 overflow-y-auto">
                          {sessions.slice(0, 8).map((session) => {
                            const spots =
                              (session.max_participants ?? 0) - (session.current_participants ?? 0)
                            const isSelected = selectedSessionId === session.id
                            return (
                              <button
                                key={session.id}
                                onClick={() => setSelectedSessionId(session.id)}
                                disabled={spots <= 0}
                                aria-pressed={isSelected}
                                className={`w-full p-3 rounded-xl border text-left transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                                  isSelected
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:border-primary/50"
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <span className="font-medium text-foreground">
                                      {new Date(session.date).toLocaleDateString("en-IE", {
                                        weekday: "short",
                                        month: "short",
                                        day: "numeric",
                                      })}
                                    </span>
                                    <span className="text-muted-foreground ml-2">
                                      {formatTime(session.start_time)}
                                    </span>
                                  </div>
                                  <span
                                    className={`text-sm ${spots <= 3 ? "text-destructive" : "text-muted-foreground"}`}
                                  >
                                    {spots > 0 ? `${spots} spots left` : "Full"}
                                  </span>
                                </div>
                              </button>
                            )
                          })}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No upcoming sessions scheduled. Contact the provider for availability.
                        </p>
                      )}
                    </div>

                    <Button onClick={handleBookNow} className="w-full h-12 text-lg rounded-xl" size="lg">
                      Book Now
                    </Button>

                    <p className="text-center text-sm text-muted-foreground mt-4">
                      {activity.cancellation_policy || "Free cancellation up to 24 hours before"}
                    </p>

                    <div className="mt-6 pt-6 border-t border-border space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Duration</span>
                        <span className="font-medium text-foreground">
                          {activity.duration_minutes} minutes
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Age range</span>
                        <span className="font-medium text-foreground">{ageRange} years</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Group size</span>
                        <span className="font-medium text-foreground">
                          Max {activity.max_participants} participants
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Location</span>
                        <span className="font-medium text-foreground">
                          {activity.is_indoor && activity.is_outdoor
                            ? "Indoor & Outdoor"
                            : activity.is_indoor
                              ? "Indoor"
                              : "Outdoor"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="mt-4 overflow-hidden">
                  <div className="h-40 bg-muted flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">{activity.county}</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Booking Bar */}
      <div className="fixed bottom-16 md:bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border p-4 md:hidden">
        <div className="flex items-center justify-between gap-4">
          <div>
            <span className="text-2xl font-bold text-foreground">€{activity.price}</span>
            <span className="text-muted-foreground text-sm">/{priceSuffix}</span>
          </div>
          <Button onClick={handleBookNow} size="lg" className="flex-1 max-w-[200px]">
            Book Now
          </Button>
        </div>
      </div>

      <Footer />
      <MobileNav />
    </div>
  )
}
