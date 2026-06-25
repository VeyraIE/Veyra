"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ActivityCard } from "@/components/activities/activity-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Star, 
  Shield, 
  CheckCircle2,
  Globe,
  Phone,
  Mail,
  Clock,
  Users,
  Calendar,
  Heart,
  Share2,
  ExternalLink
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { demoActivities, demoProviders, demoReviews } from "@/lib/demo-data";
import { use } from "react";

export default function ProviderPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  
  // Find provider by slug
  const provider = demoProviders.find(p => p.slug === slug) || demoProviders[0];
  
  // Get activities for this provider
  const providerActivities = demoActivities.filter(a => a.provider_id === provider.id);
  
  // Get reviews for this provider
  const providerReviews = demoReviews.filter(r => r.provider_id === provider.id);

  const businessHours = {
    monday: "9:00 AM - 6:00 PM",
    tuesday: "9:00 AM - 6:00 PM",
    wednesday: "9:00 AM - 6:00 PM",
    thursday: "9:00 AM - 8:00 PM",
    friday: "9:00 AM - 6:00 PM",
    saturday: "10:00 AM - 4:00 PM",
    sunday: "Closed"
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pb-24 md:pb-0">
        {/* Cover Image */}
        <div className="relative h-48 md:h-64 lg:h-80 bg-gradient-to-br from-primary/20 to-accent/20">
          {provider.cover_image_url && (
            <Image
              src={provider.cover_image_url}
              alt={provider.business_name}
              fill
              className="object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        </div>

        <div className="container mx-auto px-4">
          {/* Provider Header */}
          <div className="relative -mt-16 md:-mt-20 mb-8">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Logo */}
              <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-2xl border-4 border-background bg-card shadow-lg overflow-hidden">
                {provider.logo_url ? (
                  <Image
                    src={provider.logo_url}
                    alt={provider.business_name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/10">
                    <span className="text-3xl font-bold text-primary">
                      {provider.business_name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 pt-2">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                    {provider.business_name}
                  </h1>
                  {provider.is_verified && (
                    <Badge className="bg-primary/10 text-primary border-0">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                  {provider.is_garda_vetted && (
                    <Badge className="bg-green-100 text-green-700 border-0">
                      <Shield className="h-3 w-3 mr-1" />
                      Garda Vetted
                    </Badge>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {provider.county}, Ireland
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="font-medium text-foreground">{provider.rating}</span>
                    <span>({provider.review_count} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {provider.team_size} team members
                  </div>
                  {provider.founded_year && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Est. {provider.founded_year}
                    </div>
                  )}
                </div>

                <p className="text-muted-foreground max-w-2xl">
                  {provider.description}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 w-full md:w-auto">
                <Button variant="outline" size="icon" className="rounded-full">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Share2 className="h-5 w-5" />
                </Button>
                <Button className="rounded-full flex-1 md:flex-none">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact
                </Button>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 pb-16">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Activities */}
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Activities ({providerActivities.length})
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {providerActivities.map((activity) => (
                    <ActivityCard key={activity.id} activity={activity} />
                  ))}
                </div>
                {providerActivities.length === 0 && (
                  <div className="text-center py-12 bg-muted/30 rounded-2xl">
                    <p className="text-muted-foreground">No activities listed yet</p>
                  </div>
                )}
              </section>

              {/* Reviews */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-foreground">
                    Reviews ({providerReviews.length})
                  </h2>
                  <Button variant="outline" size="sm" className="rounded-full">
                    Write a Review
                  </Button>
                </div>
                <div className="space-y-4">
                  {providerReviews.slice(0, 5).map((review) => (
                    <div 
                      key={review.id}
                      className="bg-card rounded-xl p-4 border border-border"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="font-medium text-foreground">
                              {review.user?.full_name || "Anonymous"}
                            </div>
                            {review.is_verified && (
                              <Badge variant="secondary" className="text-xs">
                                Verified Booking
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star 
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating 
                                    ? 'fill-amber-400 text-amber-400' 
                                    : 'text-muted-foreground/30'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(review.created_at).toLocaleDateString('en-IE', {
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      {review.title && (
                        <h4 className="font-medium text-foreground mb-1">
                          {review.title}
                        </h4>
                      )}
                      <p className="text-sm text-muted-foreground">
                        {review.comment}
                      </p>
                      {review.response && (
                        <div className="mt-3 pl-4 border-l-2 border-primary/20">
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium text-foreground">Response from provider: </span>
                            {review.response}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {providerReviews.length === 0 && (
                  <div className="text-center py-12 bg-muted/30 rounded-2xl">
                    <p className="text-muted-foreground">No reviews yet</p>
                  </div>
                )}
              </section>

              {/* Certifications */}
              {provider.certifications && provider.certifications.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-4">
                    Certifications & Qualifications
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {provider.certifications.map((cert, index) => (
                      <Badge 
                        key={index}
                        variant="secondary"
                        className="py-2 px-4"
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Card */}
              <div className="bg-card rounded-2xl border border-border p-6">
                <h3 className="font-semibold text-foreground mb-4">Contact Information</h3>
                <div className="space-y-3">
                  {provider.address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">
                        {provider.address}, {provider.county}
                        {provider.eircode && <>, {provider.eircode}</>}
                      </span>
                    </div>
                  )}
                  {provider.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      <a 
                        href={`tel:${provider.phone}`}
                        className="text-sm text-primary hover:underline"
                      >
                        {provider.phone}
                      </a>
                    </div>
                  )}
                  {provider.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <a 
                        href={`mailto:${provider.email}`}
                        className="text-sm text-primary hover:underline"
                      >
                        {provider.email}
                      </a>
                    </div>
                  )}
                  {provider.website && (
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-muted-foreground" />
                      <a 
                        href={provider.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline flex items-center gap-1"
                      >
                        Visit Website
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Business Hours */}
              <div className="bg-card rounded-2xl border border-border p-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Business Hours
                </h3>
                <div className="space-y-2 text-sm">
                  {Object.entries(businessHours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between">
                      <span className="text-muted-foreground capitalize">{day}</span>
                      <span className={hours === "Closed" ? "text-destructive" : "text-foreground"}>
                        {hours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Safety & Trust */}
              <div className="bg-card rounded-2xl border border-border p-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Safety & Trust
                </h3>
                <div className="space-y-3">
                  {provider.is_garda_vetted && (
                    <div className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <span className="text-foreground">Garda Vetted</span>
                    </div>
                  )}
                  {provider.insurance_verified && (
                    <div className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <span className="text-foreground">Insurance Verified</span>
                    </div>
                  )}
                  {provider.is_verified && (
                    <div className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <span className="text-foreground">Identity Verified</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Map Preview */}
              <div className="bg-card rounded-2xl border border-border overflow-hidden">
                <div className="h-48 bg-muted flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Map View</p>
                  </div>
                </div>
                <div className="p-4">
                  <Button variant="outline" className="w-full rounded-full" asChild>
                    <a 
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        `${provider.address}, ${provider.county}, Ireland`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Get Directions
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
