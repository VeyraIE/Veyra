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
  Eye,
  Edit,
  MoreHorizontal
} from "lucide-react"
import type { Activity, Booking, Provider, Session } from "@/lib/types"
import type { ProviderStats } from "@/lib/dashboard-queries"

type DashboardView = "overview" | "bookings" | "activities" | "schedule" | "analytics" | "messages" | "settings"

/** A session happening today, paired with its parent activity. */
export type TodaySession = Session & { activity?: Activity }

export default function ProviderDashboardClient({
  provider,
  activities,
  bookings,
  stats,
  todaySessions,
}: {
  provider: Provider
  activities: Activity[]
  bookings: Booking[]
  stats: ProviderStats
  todaySessions: TodaySession[]
}) {
  const [activeView, setActiveView] = useState<DashboardView>("overview")

  const recentBookings = bookings.slice(0, 5)
  const pendingCount = bookings.filter((b) => b.status === "pending").length

  // Provider initials for the sidebar avatar, e.g. "Dublin Academy" -> "DA".
  const initials = provider.business_name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase()

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "bookings", label: "Bookings", icon: Calendar, badge: pendingCount > 0 ? String(pendingCount) : undefined },
    { id: "activities", label: "Activities", icon: List },
    { id: "schedule", label: "Schedule", icon: CalendarDays },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
    { id: "messages", label: "Messages", icon: MessageCircle },
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
                {initials}
              </div>
              <div>
                <p className="font-semibold text-foreground">{provider.business_name}</p>
                {provider.is_verified && (
                  <div className="flex items-center gap-1">
                    <Badge className="bg-emerald-500/10 text-emerald-600 border-0 text-xs">
                      Verified
                    </Badge>
                  </div>
                )}
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
                        <p className="text-3xl font-bold text-foreground">{stats.totalBookings}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {`${stats.upcomingBookings} upcoming`}
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
                        <p className="text-3xl font-bold text-foreground">
                          {`€${stats.totalRevenue.toLocaleString('en-IE')}`}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">From paid bookings</p>
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
                        <p className="text-3xl font-bold text-foreground">
                          {stats.totalReviews > 0 ? stats.averageRating.toFixed(1) : '—'}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {`${stats.totalReviews} review${stats.totalReviews === 1 ? '' : 's'}`}
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
                        <p className="text-sm text-muted-foreground">Live Listings</p>
                        <p className="text-3xl font-bold text-foreground">{stats.activeActivities}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {`of ${activities.length} total`}
                        </p>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                        <List className="h-6 w-6 text-blue-500" />
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
                    {todaySessions.length === 0 && (
                      <p className="text-sm text-muted-foreground py-4 text-center">
                        No sessions scheduled for today.
                      </p>
                    )}
                    {todaySessions.map((session) => {
                      const capacity = session.max_participants
                      const isFull =
                        capacity !== null && session.current_participants >= capacity
                      return (
                        <div key={session.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                              <Clock className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{session.activity?.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {session.start_time.slice(0, 5)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span className={`text-sm font-medium ${isFull ? 'text-destructive' : 'text-foreground'}`}>
                                {`${session.current_participants}${capacity !== null ? `/${capacity}` : ''}`}
                              </span>
                            </div>
                            <Badge variant={isFull ? "destructive" : "secondary"} className="mt-1">
                              {isFull ? 'full' : session.status}
                            </Badge>
                          </div>
                        </div>
                      )
                    })}
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
                      {recentBookings.length === 0 && (
                        <p className="text-sm text-muted-foreground py-4 text-center">
                          No bookings yet.
                        </p>
                      )}
                      {recentBookings.map((booking) => (
                        <div key={booking.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                              <Users className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">
                                {booking.child?.name ?? booking.participant_name ?? 'Guest'}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {booking.activity?.title}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-foreground">
                              {`€${Number(booking.amount ?? 0).toLocaleString('en-IE')}`}
                            </p>
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

              <div className="grid gap-6">
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
                    {activities.length === 0 && (
                      <p className="text-sm text-muted-foreground py-4 text-center">
                        You haven&apos;t created any activities yet.
                      </p>
                    )}
                    {activities.slice(0, 3).map((activity) => (
                      <div key={activity.id} className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden relative shrink-0 bg-muted">
                          {activity.cover_image && (
                            <Image unoptimized
                              src={activity.cover_image}
                              alt={activity.title}
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">{activity.title}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-sm text-muted-foreground">
                              {`€${activity.price}/session`}
                            </span>
                            {activity.review_count > 0 && (
                              <div className="flex items-center gap-1 text-amber-500">
                                <Star className="h-3 w-3 fill-current" />
                                <span className="text-xs">{activity.rating}</span>
                              </div>
                            )}
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
                {activities.map((activity) => (
                  <Card key={activity.id} className="overflow-hidden">
                    <div className="aspect-video relative bg-muted">
                      {activity.cover_image && (
                        <Image unoptimized
                          src={activity.cover_image}
                          alt={activity.title}
                          fill
                          className="object-cover"
                        />
                      )}
                      <Badge className="absolute top-3 left-3">{activity.is_active ? "Active" : "Inactive"}</Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-foreground mb-1">{activity.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {`Ages ${activity.min_age}-${activity.max_age}`}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-sm">
                          <span className="font-semibold text-foreground">{`€${activity.price}`}</span>
                          {activity.review_count > 0 && (
                            <div className="flex items-center gap-1 text-amber-500">
                              <Star className="h-4 w-4 fill-current" />
                              <span>{activity.rating}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/activity/${activity.slug}`}>
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">{`View ${activity.title}`}</span>
                            </Link>
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
