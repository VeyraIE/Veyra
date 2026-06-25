"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar, 
  Clock, 
  Users,
  Plus,
  TrendingUp,
  DollarSign,
  Star,
  MessageCircle,
  Settings,
  BarChart3,
  CalendarDays,
  List,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Edit,
  MoreHorizontal
} from "lucide-react"
import { demoActivities } from "@/lib/demo-data"

const providerStats = {
  totalBookings: 156,
  bookingsChange: 12,
  revenue: 4250,
  revenueChange: 8,
  rating: 4.8,
  ratingChange: 0.2,
  views: 2340,
  viewsChange: 15
}

const upcomingSessions = [
  { id: "1", activity: "Junior Football Academy", time: "10:00", attendees: 12, max: 15, status: "confirmed" },
  { id: "2", activity: "Swimming Lessons (Beginners)", time: "11:30", attendees: 8, max: 8, status: "full" },
  { id: "3", activity: "Junior Football Academy", time: "14:00", attendees: 10, max: 15, status: "confirmed" },
]

const recentBookings = [
  { id: "1", customer: "Sarah Murphy", activity: "Junior Football Academy", child: "Liam (8)", date: "May 17", amount: 25, status: "confirmed" },
  { id: "2", customer: "John O'Brien", activity: "Swimming Lessons", child: "Aoife (6)", date: "May 17", amount: 30, status: "confirmed" },
  { id: "3", customer: "Mary Kelly", activity: "Junior Football Academy", child: "Sean (9)", date: "May 18", amount: 25, status: "pending" },
]

const recentMessages = [
  { id: "1", from: "Sarah Murphy", message: "Hi, can we reschedule Liam's session to next week?", time: "2 hours ago", unread: true },
  { id: "2", from: "John O'Brien", message: "Thank you for the great class today!", time: "5 hours ago", unread: false },
]

type DashboardView = "overview" | "bookings" | "activities" | "schedule" | "analytics" | "messages" | "settings"

export default function ProviderDashboardPage() {
  const [activeView, setActiveView] = useState<DashboardView>("overview")

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "bookings", label: "Bookings", icon: Calendar, badge: "3" },
    { id: "activities", label: "Activities", icon: List },
    { id: "schedule", label: "Schedule", icon: CalendarDays },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
    { id: "messages", label: "Messages", icon: MessageCircle, badge: "1" },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-background min-h-[calc(100vh-64px)] sticky top-16">
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                DA
              </div>
              <div>
                <p className="font-semibold text-foreground">Dublin Academy</p>
                <div className="flex items-center gap-1">
                  <Badge className="bg-emerald-500/10 text-emerald-600 border-0 text-xs">
                    Verified
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          <nav className="flex-1 p-2">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id as DashboardView)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl mb-1 transition-colors ${
                  activeView === item.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted text-foreground'
                }`}
              >
                <span className="flex items-center gap-3">
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </span>
                {item.badge && (
                  <Badge variant={activeView === item.id ? "secondary" : "default"} className="h-5 min-w-[20px]">
                    {item.badge}
                  </Badge>
                )}
              </button>
            ))}
          </nav>
          <div className="p-4 border-t border-border">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4">
                <p className="font-medium text-foreground mb-1">Upgrade to Pro</p>
                <p className="text-sm text-muted-foreground mb-3">Get more features and grow your business</p>
                <Button size="sm" className="w-full">View Plans</Button>
              </CardContent>
            </Card>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeView === "overview" && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
                  <p className="text-muted-foreground">Welcome back! Here&apos;s what&apos;s happening today.</p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    May 12, 2026
                  </Button>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Activity
                  </Button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Bookings</p>
                        <p className="text-3xl font-bold text-foreground">{providerStats.totalBookings}</p>
                        <p className="text-sm text-emerald-600 flex items-center gap-1 mt-1">
                          <ArrowUpRight className="h-4 w-4" />
                          +{providerStats.bookingsChange}% this month
                        </p>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Revenue</p>
                        <p className="text-3xl font-bold text-foreground">€{providerStats.revenue.toLocaleString()}</p>
                        <p className="text-sm text-emerald-600 flex items-center gap-1 mt-1">
                          <ArrowUpRight className="h-4 w-4" />
                          +{providerStats.revenueChange}% this month
                        </p>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                        <DollarSign className="h-6 w-6 text-emerald-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Rating</p>
                        <p className="text-3xl font-bold text-foreground">{providerStats.rating}</p>
                        <p className="text-sm text-emerald-600 flex items-center gap-1 mt-1">
                          <ArrowUpRight className="h-4 w-4" />
                          +{providerStats.ratingChange} this month
                        </p>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                        <Star className="h-6 w-6 text-amber-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Profile Views</p>
                        <p className="text-3xl font-bold text-foreground">{providerStats.views.toLocaleString()}</p>
                        <p className="text-sm text-emerald-600 flex items-center gap-1 mt-1">
                          <ArrowUpRight className="h-4 w-4" />
                          +{providerStats.viewsChange}% this week
                        </p>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                        <Eye className="h-6 w-6 text-blue-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Today's Sessions & Recent Bookings */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Today's Sessions */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Today&apos;s Sessions</CardTitle>
                    <Button variant="ghost" size="sm">View All</Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {upcomingSessions.map((session) => (
                      <div key={session.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Clock className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{session.activity}</p>
                            <p className="text-sm text-muted-foreground">{session.time}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className={`text-sm font-medium ${session.attendees === session.max ? 'text-red-500' : 'text-foreground'}`}>
                              {session.attendees}/{session.max}
                            </span>
                          </div>
                          <Badge variant={session.status === "full" ? "destructive" : "secondary"} className="mt-1">
                            {session.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Recent Bookings */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Recent Bookings</CardTitle>
                    <Button variant="ghost" size="sm">View All</Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentBookings.map((booking) => (
                        <div key={booking.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                              <Users className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{booking.customer}</p>
                              <p className="text-sm text-muted-foreground">{booking.child} - {booking.activity}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-foreground">€{booking.amount}</p>
                            <Badge variant={booking.status === "confirmed" ? "secondary" : "outline"} className="mt-1">
                              {booking.status === "confirmed" ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <AlertCircle className="h-3 w-3 mr-1" />}
                              {booking.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Messages & Activities */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent Messages */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Messages</CardTitle>
                    <Badge>1 new</Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recentMessages.map((message) => (
                      <div key={message.id} className={`p-4 rounded-xl ${message.unread ? 'bg-primary/5 border border-primary/20' : 'bg-muted/50'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-foreground">{message.from}</span>
                          <span className="text-xs text-muted-foreground">{message.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{message.message}</p>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full">View All Messages</Button>
                  </CardContent>
                </Card>

                {/* Your Activities */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Your Activities</CardTitle>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add New
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {demoActivities.slice(0, 3).map((activity) => (
                      <div key={activity.id} className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden relative shrink-0">
                          <Image
                            src={activity.cover_image || activity.images?.[0] || "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=100"}
                            alt={activity.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">{activity.title}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-sm text-muted-foreground">€{activity.price}/session</span>
                            <div className="flex items-center gap-1 text-amber-500">
                              <Star className="h-3 w-3 fill-current" />
                              <span className="text-xs">{activity.rating}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeView === "activities" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Activities</h1>
                  <p className="text-muted-foreground">Manage your activity listings</p>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Activity
                </Button>
              </div>

              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {demoActivities.slice(0, 6).map((activity) => (
                  <Card key={activity.id} className="overflow-hidden">
                    <div className="aspect-video relative">
                      <Image
                        src={activity.cover_image || activity.images?.[0] || "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400"}
                        alt={activity.title}
                        fill
                        className="object-cover"
                      />
                      <Badge className="absolute top-3 left-3">{activity.is_active ? "Active" : "Inactive"}</Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-foreground mb-1">{activity.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">Ages {activity.min_age}-{activity.max_age}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-sm">
                          <span className="font-semibold text-foreground">€{activity.price}</span>
                          <div className="flex items-center gap-1 text-amber-500">
                            <Star className="h-4 w-4 fill-current" />
                            <span>{activity.rating}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeView !== "overview" && activeView !== "activities" && (
            <div className="flex flex-col items-center justify-center h-[60vh]">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                {activeView === "bookings" && <Calendar className="h-8 w-8 text-muted-foreground" />}
                {activeView === "schedule" && <CalendarDays className="h-8 w-8 text-muted-foreground" />}
                {activeView === "analytics" && <TrendingUp className="h-8 w-8 text-muted-foreground" />}
                {activeView === "messages" && <MessageCircle className="h-8 w-8 text-muted-foreground" />}
                {activeView === "settings" && <Settings className="h-8 w-8 text-muted-foreground" />}
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2 capitalize">{activeView}</h2>
              <p className="text-muted-foreground">This section is coming soon</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
