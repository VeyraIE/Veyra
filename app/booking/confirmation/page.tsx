"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, 
  Calendar, 
  Clock, 
  MapPin, 
  Download,
  Share2,
  CalendarPlus,
  ArrowRight,
  QrCode
} from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

function ConfirmationContent() {
  // In a real app, this would come from the booking context or URL params
  const booking = {
    id: "BK-2024-001234",
    activity: {
      title: "Junior Swimming Lessons",
      provider: "Dublin Aquatics Academy",
      image: "https://images.unsplash.com/photo-1560089000-7433a4ebbd64?w=800"
    },
    date: "Saturday, May 25, 2024",
    time: "10:00 AM - 11:00 AM",
    location: "National Aquatic Centre, Dublin",
    participant: "Emma Murphy",
    amount: 25.00,
    qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=BK-2024-001234"
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pb-24 md:pb-0">
        <div className="container mx-auto px-4 py-8 md:py-16">
          <div className="max-w-2xl mx-auto">
            {/* Success Header */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Booking Confirmed!
              </h1>
              <p className="text-muted-foreground">
                Your booking has been successfully confirmed. We&apos;ve sent the details to your email.
              </p>
            </div>

            {/* Booking Card */}
            <div className="bg-card rounded-2xl border border-border overflow-hidden mb-6">
              {/* Activity Header */}
              <div className="p-6 border-b border-border">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-xl bg-muted flex-shrink-0 overflow-hidden">
                    <img 
                      src={booking.activity.image} 
                      alt={booking.activity.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="font-semibold text-foreground text-lg">
                      {booking.activity.title}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {booking.activity.provider}
                    </p>
                    <p className="text-sm font-medium text-primary mt-1">
                      Booking #{booking.id}
                    </p>
                  </div>
                </div>
              </div>

              {/* Booking Details */}
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium text-foreground">{booking.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Time</p>
                    <p className="font-medium text-foreground">{booking.time}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium text-foreground">{booking.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <QrCode className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Participant</p>
                    <p className="font-medium text-foreground">{booking.participant}</p>
                  </div>
                </div>
              </div>

              {/* QR Code */}
              <div className="p-6 border-t border-border bg-muted/30">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-3">
                    Show this QR code at check-in
                  </p>
                  <div className="inline-block p-4 bg-white rounded-xl shadow-sm">
                    <img 
                      src={booking.qrCode} 
                      alt="Booking QR Code"
                      className="w-32 h-32"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="p-6 border-t border-border">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Paid</span>
                  <span className="text-2xl font-bold text-foreground">
                    €{booking.amount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="grid sm:grid-cols-3 gap-3 mb-8">
              <Button variant="outline" className="rounded-full">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" className="rounded-full">
                <CalendarPlus className="h-4 w-4 mr-2" />
                Add to Calendar
              </Button>
              <Button variant="outline" className="rounded-full">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>

            {/* What's Next */}
            <div className="bg-muted/30 rounded-2xl p-6 mb-8">
              <h3 className="font-semibold text-foreground mb-4">What&apos;s Next?</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    Confirmation email sent to your registered email address
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    Reminder will be sent 24 hours before your session
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    Arrive 10 minutes early for check-in with your QR code
                  </span>
                </li>
              </ul>
            </div>

            {/* Navigation */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="outline" 
                className="rounded-full flex-1"
                asChild
              >
                <Link href="/dashboard">
                  View My Bookings
                </Link>
              </Button>
              <Button 
                className="rounded-full flex-1"
                asChild
              >
                <Link href="/discover">
                  Discover More Activities
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}

export default function BookingConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <ConfirmationContent />
    </Suspense>
  );
}
