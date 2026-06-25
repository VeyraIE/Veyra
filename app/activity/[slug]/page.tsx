"use client"

import { useState, use } from "react"
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
  ExternalLink
} from "lucide-react"
import { demoActivities, demoReviews } from "@/lib/demo-data"

export default function ActivityDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const router = useRouter()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  // Find the activity by slug
  const activity = demoActivities.find(a => a.slug === slug) || demoActivities[0]
  const activityReviews = demoReviews.filter(r => r.activity_id === activity.id)

  // Demo upcoming sessions
  const upcomingSessions = [
    { date: "2026-05-15", day: "Thu", time: "10:00", spots: 4 },
    { date: "2026-05-16", day: "Fri", time: "14:00", spots: 6 },
    { date: "2026-05-17", day: "Sat", time: "09:00", spots: 2 },
    { date: "2026-05-17", day: "Sat", time: "11:00", spots: 8 },
    { date: "2026-05-18", day: "Sun", time: "10:00", spots: 5 },
  ]

  const images = activity.images?.length ? activity.images : [
    "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800",
    "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800",
    "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800"
  ]

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const handleBookNow = () => {
    if (selectedDate && selectedTime) {
      router.push(`/book/${activity.slug}?date=${selectedDate}&time=${selectedTime}`)
    } else {
      router.push(`/book/${activity.slug}`)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 pb-24 md:pb-0">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <Link href="/discover" className="hover:text-foreground transition-colors">Discover</Link>
            <span>/</span>
            <span className="text-foreground">{activity.title}</span>
          </nav>
        </div>

        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Images and Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Image Gallery */}
              <div className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-muted">
                <Image
                  src={images[currentImageIndex]}
                  alt={activity.title}
                  fill
                  className="object-cover"
                  priority
                />
                
                {/* Image Navigation */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-background transition-colors"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-background transition-colors"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </>
                )}

                {/* Image Dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`h-2 rounded-full transition-all ${
                        idx === currentImageIndex ? 'w-6 bg-white' : 'w-2 bg-white/50'
                      }`}
                    />
                  ))}
                </div>

                {/* Top Actions */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="h-10 w-10 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-background transition-colors"
                  >
                    <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>
                  <button className="h-10 w-10 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-background transition-colors">
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>

                {/* Category Badge */}
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
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground">
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

                {/* Quick Stats */}
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
                    <span>Ages {activity.min_age}-{activity.max_age}</span>
                  </div>
                  {activity.skill_level && (
                    <Badge variant="outline" className="capitalize">
                      {activity.skill_level}
                    </Badge>
                  )}
                </div>

                {/* Tags */}
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
                  <p className="text-muted-foreground leading-relaxed">
                    {activity.description}
                  </p>
                </CardContent>
              </Card>

              {/* What You&apos;ll Learn */}
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

              {/* What to Bring */}
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
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      {activity.provider?.logo_url ? (
                        <Image
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
                      <p className="text-muted-foreground mt-2">
                        {activity.provider?.description}
                      </p>
                      <div className="flex items-center gap-4 mt-4">
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
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Profile
                        </Button>
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
                      <h2 className="text-xl font-semibold text-foreground mb-2">Safety & Trust</h2>
                      <ul className="space-y-2 text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          All staff are Garda vetted
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          Full insurance coverage
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          First aid certified instructors
                        </li>
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
                    <Button variant="outline" size="sm">Write a Review</Button>
                  </div>

                  <div className="flex items-center gap-6 mb-6 pb-6 border-b border-border">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-foreground">{activity.rating}</div>
                      <div className="flex items-center gap-1 text-amber-500 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < Math.floor(activity.rating || 0) ? 'fill-current' : ''}`} />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{activity.review_count} reviews</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {activityReviews.slice(0, 3).map((review) => (
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
                                <Badge variant="secondary" className="text-xs">Verified</Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex items-center gap-0.5 text-amber-500">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'fill-current' : ''}`} />
                                ))}
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {new Date(review.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            {review.title && (
                              <h4 className="font-medium text-foreground mb-1">{review.title}</h4>
                            )}
                            <p className="text-muted-foreground">{review.comment}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {activityReviews.length > 3 && (
                    <Button variant="outline" className="w-full mt-6">
                      View All {activityReviews.length} Reviews
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Similar Activities */}
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">Similar activities</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {demoActivities
                    .filter(a => a.id !== activity.id && a.category?.slug === activity.category?.slug)
                    .slice(0, 2)
                    .map((similar) => (
                      <Link key={similar.id} href={`/activity/${similar.slug}`}>
                        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                          <div className="aspect-video relative">
                            <Image
                              src={similar.cover_image || similar.images?.[0] || "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400"}
                              alt={similar.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-semibold text-foreground">{similar.title}</h3>
                            <p className="text-sm text-muted-foreground">{similar.provider?.business_name}</p>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-1 text-amber-500">
                                <Star className="h-4 w-4 fill-current" />
                                <span className="text-sm font-medium text-foreground">{similar.rating}</span>
                              </div>
                              <span className="font-semibold text-primary">€{similar.price}</span>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                </div>
              </div>
            </div>

            {/* Right Column - Booking Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <Card className="shadow-xl">
                  <CardContent className="p-6">
                    <div className="flex items-baseline justify-between mb-6">
                      <div>
                        <span className="text-3xl font-bold text-foreground">€{activity.price}</span>
                        <span className="text-muted-foreground">/{activity.price_type === "per_session" ? "session" : activity.price_type}</span>
                      </div>
                      {activity.instant_booking && (
                        <Badge className="bg-emerald-500/10 text-emerald-600 border-0">
                          Instant Book
                        </Badge>
                      )}
                    </div>

                    {/* Date Selection */}
                    <div className="mb-6">
                      <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Select a session
                      </h3>
                      <div className="space-y-2">
                        {upcomingSessions.map((session, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setSelectedDate(session.date)
                              setSelectedTime(session.time)
                            }}
                            className={`w-full p-3 rounded-xl border text-left transition-all ${
                              selectedDate === session.date && selectedTime === session.time
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="font-medium text-foreground">
                                  {session.day}, {new Date(session.date).toLocaleDateString('en-IE', { month: 'short', day: 'numeric' })}
                                </span>
                                <span className="text-muted-foreground ml-2">{session.time}</span>
                              </div>
                              <span className={`text-sm ${session.spots <= 3 ? 'text-red-500' : 'text-muted-foreground'}`}>
                                {session.spots} spots left
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <Button 
                      onClick={handleBookNow} 
                      className="w-full h-12 text-lg rounded-xl"
                      size="lg"
                    >
                      Book Now
                    </Button>

                    <p className="text-center text-sm text-muted-foreground mt-4">
                      Free cancellation up to 24 hours before
                    </p>

                    {/* Quick Info */}
                    <div className="mt-6 pt-6 border-t border-border space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Duration</span>
                        <span className="font-medium text-foreground">{activity.duration_minutes} minutes</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Age range</span>
                        <span className="font-medium text-foreground">{activity.min_age}-{activity.max_age} years</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Group size</span>
                        <span className="font-medium text-foreground">Max {activity.max_participants} participants</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Location</span>
                        <span className="font-medium text-foreground">
                          {activity.is_indoor && activity.is_outdoor ? "Indoor & Outdoor" : activity.is_indoor ? "Indoor" : "Outdoor"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Map Preview */}
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
            <span className="text-muted-foreground text-sm">/{activity.price_type === "per_session" ? "session" : activity.price_type}</span>
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
