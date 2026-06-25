"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { MobileNav } from "@/components/layout/mobile-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Heart, 
  Bell, 
  Settings, 
  User,
  ChevronRight,
  Star,
  QrCode,
  X,
  Plus,
  History,
  CreditCard
} from "lucide-react"
import { demoActivities } from "@/lib/demo-data"

// Demo data for user
const demoUser = {
  name: "Sarah Murphy",
  email: "sarah.murphy@email.com",
  avatar: null,
  memberSince: "January 2026"
}

const demoChildren = [
  { id: "1", name: "Liam", age: 8, interests: ["Football", "Swimming"] },
  { id: "2", name: "Emma", age: 6, interests: ["Dance", "Art"] },
]

const demoUpcomingBookings = [
  {
    id: "1",
    activity: demoActivities[0],
    date: "2026-05-17",
    time: "10:00",
    child: "Liam",
    status: "confirmed",
    qrCode: "AH-2026-ABC123"
  },
  {
    id: "2",
    activity: demoActivities[2],
    date: "2026-05-18",
    time: "14:00",
    child: "Emma",
    status: "confirmed",
    qrCode: "AH-2026-DEF456"
  },
]

const demoPastBookings = [
  {
    id: "3",
    activity: demoActivities[1],
    date: "2026-05-10",
    time: "09:00",
    child: "Liam",
    status: "completed"
  },
]

const demoNotifications = [
  { id: "1", type: "reminder", message: "Liam's Football Academy session tomorrow at 10:00", time: "2 hours ago", read: false },
  { id: "2", type: "promo", message: "Get 10% off your next booking with code SPRING10", time: "1 day ago", read: false },
  { id: "3", type: "update", message: "New swimming classes available in your area", time: "3 days ago", read: true },
]

type DashboardTab = "upcoming" | "past" | "favorites" | "children" | "settings"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<DashboardTab>("upcoming")
  const [showQrModal, setShowQrModal] = useState<string | null>(null)

  const tabs = [
    { id: "upcoming", label: "Upcoming", icon: Calendar, count: demoUpcomingBookings.length },
    { id: "past", label: "Past", icon: History },
    { id: "favorites", label: "Favorites", icon: Heart },
    { id: "children", label: "Children", icon: User, count: demoChildren.length },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      <Header />
      
      <main className="flex-1 pb-20 md:pb-0">
        <div className="container mx-auto px-4 py-6">
          {/* User Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{demoUser.name}</h1>
                <p className="text-muted-foreground">Member since {demoUser.memberSince}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  {demoNotifications.filter(n => !n.read).length}
                </span>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/discover">
                  <Plus className="h-5 w-5 mr-2" />
                  Book Activity
                </Link>
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{demoUpcomingBookings.length}</p>
                    <p className="text-sm text-muted-foreground">Upcoming</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <History className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">12</p>
                    <p className="text-sm text-muted-foreground">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-rose-500/10 flex items-center justify-center">
                    <Heart className="h-5 w-5 text-rose-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">8</p>
                    <p className="text-sm text-muted-foreground">Favorites</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                    <Star className="h-5 w-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">4</p>
                    <p className="text-sm text-muted-foreground">Reviews</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs and Content */}
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-2">
                  <nav className="space-y-1">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as DashboardTab)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${
                          activeTab === tab.id
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-muted text-foreground'
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <tab.icon className="h-5 w-5" />
                          {tab.label}
                        </span>
                        {tab.count !== undefined && (
                          <Badge variant={activeTab === tab.id ? "secondary" : "outline"}>
                            {tab.count}
                          </Badge>
                        )}
                      </button>
                    ))}
                  </nav>
                </CardContent>
              </Card>

              {/* Notifications Preview */}
              <Card className="mt-4">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center justify-between">
                    Notifications
                    <Badge variant="secondary">{demoNotifications.filter(n => !n.read).length} new</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {demoNotifications.slice(0, 2).map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-xl text-sm ${notification.read ? 'bg-muted/50' : 'bg-primary/5'}`}
                    >
                      <p className="text-foreground line-clamp-2">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                    </div>
                  ))}
                  <Button variant="ghost" className="w-full text-sm">View All</Button>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {activeTab === "upcoming" && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-foreground">Upcoming Bookings</h2>
                  {demoUpcomingBookings.length > 0 ? (
                    demoUpcomingBookings.map((booking) => (
                      <Card key={booking.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="flex flex-col sm:flex-row">
                            <div className="sm:w-40 h-32 sm:h-auto relative">
                              <Image
                                src={booking.activity.cover_image || booking.activity.images?.[0] || "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300"}
                                alt={booking.activity.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 p-4">
                              <div className="flex items-start justify-between">
                                <div>
                                  <Badge className="mb-2 bg-emerald-500/10 text-emerald-600 border-0">
                                    {booking.status}
                                  </Badge>
                                  <h3 className="font-semibold text-foreground">{booking.activity.title}</h3>
                                  <p className="text-sm text-muted-foreground">{booking.activity.provider?.business_name}</p>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setShowQrModal(booking.qrCode)}
                                >
                                  <QrCode className="h-4 w-4 mr-2" />
                                  Check-in
                                </Button>
                              </div>
                              <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  {new Date(booking.date).toLocaleDateString('en-IE', { weekday: 'short', month: 'short', day: 'numeric' })}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {booking.time}
                                </span>
                                <span className="flex items-center gap-1">
                                  <User className="h-4 w-4" />
                                  {booking.child}
                                </span>
                              </div>
                              <div className="flex gap-2 mt-4">
                                <Button variant="outline" size="sm">Reschedule</Button>
                                <Button variant="ghost" size="sm" className="text-destructive">Cancel</Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="font-semibold text-foreground mb-2">No upcoming bookings</h3>
                        <p className="text-muted-foreground mb-4">Find an activity for your child today!</p>
                        <Button asChild>
                          <Link href="/discover">Browse Activities</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {activeTab === "past" && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-foreground">Past Bookings</h2>
                  {demoPastBookings.map((booking) => (
                    <Card key={booking.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-xl relative overflow-hidden shrink-0">
                            <Image
                              src={booking.activity.cover_image || booking.activity.images?.[0] || "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=100"}
                              alt={booking.activity.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground">{booking.activity.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {new Date(booking.date).toLocaleDateString('en-IE', { month: 'long', day: 'numeric', year: 'numeric' })} at {booking.time}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">Book Again</Button>
                            <Button variant="ghost" size="sm">
                              <Star className="h-4 w-4 mr-1" />
                              Review
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {activeTab === "favorites" && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-foreground">Saved Activities</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {demoActivities.slice(0, 4).map((activity) => (
                      <Card key={activity.id} className="overflow-hidden">
                        <div className="aspect-video relative">
                          <Image
                            src={activity.cover_image || activity.images?.[0] || "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400"}
                            alt={activity.title}
                            fill
                            className="object-cover"
                          />
                          <button className="absolute top-3 right-3 h-8 w-8 rounded-full bg-background/90 flex items-center justify-center">
                            <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                          </button>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-foreground">{activity.title}</h3>
                          <p className="text-sm text-muted-foreground">{activity.provider?.business_name}</p>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-1 text-amber-500">
                              <Star className="h-4 w-4 fill-current" />
                              <span className="text-sm font-medium text-foreground">{activity.rating}</span>
                            </div>
                            <span className="font-semibold text-primary">€{activity.price}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "children" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-foreground">Child Profiles</h2>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Child
                    </Button>
                  </div>
                  {demoChildren.map((child) => (
                    <Card key={child.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-4">
                            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="h-8 w-8 text-primary" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-foreground">{child.name}</h3>
                              <p className="text-muted-foreground">{child.age} years old</p>
                              <div className="flex gap-2 mt-2">
                                {child.interests.map((interest) => (
                                  <Badge key={interest} variant="secondary">{interest}</Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon">
                            <ChevronRight className="h-5 w-5" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {activeTab === "settings" && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-foreground">Account Settings</h2>
                  <Card>
                    <CardContent className="p-0">
                      <Link href="/dashboard/settings/profile" className="flex items-center justify-between p-4 border-b border-border hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                            <User className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">Profile</p>
                            <p className="text-sm text-muted-foreground">Manage your personal information</p>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </Link>
                      <Link href="/dashboard/settings/notifications" className="flex items-center justify-between p-4 border-b border-border hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                            <Bell className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">Notifications</p>
                            <p className="text-sm text-muted-foreground">Email and push notification preferences</p>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </Link>
                      <Link href="/dashboard/settings/payment" className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                            <CreditCard className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">Payment Methods</p>
                            <p className="text-sm text-muted-foreground">Manage your saved cards</p>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </Link>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* QR Code Modal */}
        {showQrModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
            <Card className="w-full max-w-sm">
              <CardContent className="p-6 text-center">
                <button
                  onClick={() => setShowQrModal(null)}
                  className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
                <h3 className="text-lg font-semibold text-foreground mb-4">Check-in QR Code</h3>
                <div className="w-48 h-48 mx-auto bg-muted rounded-xl flex items-center justify-center mb-4">
                  <QrCode className="h-32 w-32 text-foreground" />
                </div>
                <p className="font-mono text-sm text-muted-foreground mb-4">{showQrModal}</p>
                <p className="text-sm text-muted-foreground">
                  Show this code to the instructor when you arrive
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <Footer />
      <MobileNav />
    </div>
  )
}
