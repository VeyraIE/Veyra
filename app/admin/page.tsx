"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  Users, 
  Building2, 
  Calendar, 
  Star, 
  TrendingUp, 
  DollarSign,
  Shield,
  AlertCircle,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Ban,
  Check,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const stats = [
  { label: "Total Users", value: "12,847", change: "+12%", icon: Users, color: "text-blue-600" },
  { label: "Active Providers", value: "1,234", change: "+8%", icon: Building2, color: "text-emerald-600" },
  { label: "Total Bookings", value: "45,678", change: "+23%", icon: Calendar, color: "text-purple-600" },
  { label: "Revenue (MTD)", value: "€89,450", change: "+18%", icon: DollarSign, color: "text-amber-600" },
]

const pendingProviders = [
  { id: 1, name: "Dublin Dance Academy", email: "info@dublindance.ie", date: "2024-01-15", type: "Dance Studio" },
  { id: 2, name: "Galway Swim School", email: "hello@galwayswim.ie", date: "2024-01-14", type: "Swimming" },
  { id: 3, name: "Cork Martial Arts", email: "contact@corkma.ie", date: "2024-01-14", type: "Martial Arts" },
  { id: 4, name: "Limerick Music Academy", email: "info@limerickmusic.ie", date: "2024-01-13", type: "Music" },
]

const recentReviews = [
  { id: 1, user: "Sarah M.", activity: "Kids Football Camp", rating: 5, comment: "Amazing experience for my son!", status: "approved" },
  { id: 2, user: "John D.", activity: "Adult Yoga Classes", rating: 4, comment: "Great instructor, peaceful environment", status: "pending" },
  { id: 3, user: "Emma K.", activity: "Swimming Lessons", rating: 2, comment: "Pool was too cold, not happy", status: "flagged" },
  { id: 4, user: "Michael O.", activity: "Coding for Kids", rating: 5, comment: "My daughter loved it!", status: "approved" },
]

const recentUsers = [
  { id: 1, name: "Aoife Murphy", email: "aoife@email.com", joined: "2024-01-15", bookings: 3, status: "active" },
  { id: 2, name: "Cian O'Brien", email: "cian@email.com", joined: "2024-01-14", bookings: 1, status: "active" },
  { id: 3, name: "Siobhan Kelly", email: "siobhan@email.com", joined: "2024-01-14", bookings: 0, status: "pending" },
  { id: 4, name: "Padraig Walsh", email: "padraig@email.com", joined: "2024-01-13", bookings: 5, status: "active" },
]

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "providers" | "reviews" | "analytics">("overview")
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Admin Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="text-sm font-bold text-primary-foreground">A</span>
              </div>
              <span className="font-semibold">Activio Admin</span>
            </Link>
            <Badge variant="secondary" className="bg-amber-100 text-amber-700">
              Admin Panel
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">View Site</Link>
            </Button>
            <Button variant="ghost" size="icon">
              <AlertCircle className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Navigation Tabs */}
        <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
          {[
            { id: "overview", label: "Overview", icon: TrendingUp },
            { id: "users", label: "Users", icon: Users },
            { id: "providers", label: "Providers", icon: Building2 },
            { id: "reviews", label: "Reviews", icon: Star },
            { id: "analytics", label: "Analytics", icon: TrendingUp },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className="flex items-center gap-2"
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </Button>
          ))}
        </div>

        {activeTab === "overview" && (
          <>
            {/* Stats Grid */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <Card key={stat.label}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-sm text-emerald-600">{stat.change} this month</p>
                      </div>
                      <div className={`rounded-full bg-muted p-3 ${stat.color}`}>
                        <stat.icon className="h-6 w-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              {/* Pending Provider Approvals */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-amber-600" />
                    Pending Provider Approvals
                  </CardTitle>
                  <Badge variant="secondary">{pendingProviders.length} pending</Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingProviders.map((provider) => (
                      <div key={provider.id} className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                          <p className="font-medium">{provider.name}</p>
                          <p className="text-sm text-muted-foreground">{provider.email}</p>
                          <div className="mt-1 flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">{provider.type}</Badge>
                            <span className="text-xs text-muted-foreground">{provider.date}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50">
                            <XCircle className="mr-1 h-4 w-4" />
                            Reject
                          </Button>
                          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                            <CheckCircle className="mr-1 h-4 w-4" />
                            Approve
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Reviews */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-amber-500" />
                    Recent Reviews
                  </CardTitle>
                  <Button variant="ghost" size="sm">View All</Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentReviews.map((review) => (
                      <div key={review.id} className="flex items-start justify-between rounded-lg border p-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{review.user}</p>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-3 w-3 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} 
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{review.activity}</p>
                          <p className="mt-1 text-sm">{review.comment}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={
                              review.status === "approved" ? "default" : 
                              review.status === "flagged" ? "destructive" : "secondary"
                            }
                            className={review.status === "approved" ? "bg-emerald-600" : ""}
                          >
                            {review.status}
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem><Eye className="mr-2 h-4 w-4" /> View</DropdownMenuItem>
                              <DropdownMenuItem><Check className="mr-2 h-4 w-4" /> Approve</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600"><Ban className="mr-2 h-4 w-4" /> Remove</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {activeTab === "users" && (
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle>User Management</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input 
                      placeholder="Search users..." 
                      className="pl-9 w-64"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left text-sm text-muted-foreground">
                      <th className="pb-3 font-medium">Name</th>
                      <th className="pb-3 font-medium">Email</th>
                      <th className="pb-3 font-medium">Joined</th>
                      <th className="pb-3 font-medium">Bookings</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {recentUsers.map((user) => (
                      <tr key={user.id}>
                        <td className="py-4 font-medium">{user.name}</td>
                        <td className="py-4 text-muted-foreground">{user.email}</td>
                        <td className="py-4 text-muted-foreground">{user.joined}</td>
                        <td className="py-4">{user.bookings}</td>
                        <td className="py-4">
                          <Badge variant={user.status === "active" ? "default" : "secondary"} 
                            className={user.status === "active" ? "bg-emerald-600" : ""}>
                            {user.status}
                          </Badge>
                        </td>
                        <td className="py-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem><Eye className="mr-2 h-4 w-4" /> View Profile</DropdownMenuItem>
                              <DropdownMenuItem><Calendar className="mr-2 h-4 w-4" /> View Bookings</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600"><Ban className="mr-2 h-4 w-4" /> Suspend</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Showing 1-4 of 12,847 users</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "providers" && (
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle>Provider Management</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Search providers..." className="pl-9 w-64" />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingProviders.map((provider) => (
                  <div key={provider.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Building2 className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{provider.name}</p>
                        <p className="text-sm text-muted-foreground">{provider.email}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <Badge variant="outline">{provider.type}</Badge>
                          <span className="text-xs text-muted-foreground">Applied: {provider.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">0 activities</p>
                        <p className="text-xs text-muted-foreground">0 bookings</p>
                      </div>
                      <Badge variant="secondary" className="bg-amber-100 text-amber-700">Pending</Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem><Eye className="mr-2 h-4 w-4" /> View Details</DropdownMenuItem>
                          <DropdownMenuItem><Check className="mr-2 h-4 w-4" /> Approve</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600"><XCircle className="mr-2 h-4 w-4" /> Reject</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "reviews" && (
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle>Review Moderation</CardTitle>
                <div className="flex gap-2">
                  <Button variant={true ? "default" : "outline"} size="sm">All</Button>
                  <Button variant="outline" size="sm">Pending</Button>
                  <Button variant="outline" size="sm">Flagged</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentReviews.map((review) => (
                  <div key={review.id} className="rounded-lg border p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{review.user}</p>
                          <span className="text-muted-foreground">on</span>
                          <p className="font-medium text-primary">{review.activity}</p>
                        </div>
                        <div className="mt-1 flex items-center gap-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} 
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">2 days ago</span>
                        </div>
                        <p className="mt-2">{review.comment}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={
                            review.status === "approved" ? "default" : 
                            review.status === "flagged" ? "destructive" : "secondary"
                          }
                          className={review.status === "approved" ? "bg-emerald-600" : ""}
                        >
                          {review.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="mr-1 h-4 w-4" /> View Activity
                      </Button>
                      {review.status !== "approved" && (
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                          <Check className="mr-1 h-4 w-4" /> Approve
                        </Button>
                      )}
                      <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50">
                        <Ban className="mr-1 h-4 w-4" /> Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "analytics" && (
          <div className="grid gap-8">
            <div className="grid gap-4 sm:grid-cols-3">
              <Card>
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-3xl font-bold">€234,567</p>
                  <p className="text-sm text-emerald-600">+23% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground">Platform Fee Earned</p>
                  <p className="text-3xl font-bold">€23,456</p>
                  <p className="text-sm text-emerald-600">10% commission</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground">Average Booking Value</p>
                  <p className="text-3xl font-bold">€45.80</p>
                  <p className="text-sm text-emerald-600">+5% from last month</p>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Revenue Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex h-64 items-center justify-center rounded-lg bg-muted/50">
                  <p className="text-muted-foreground">Revenue chart visualization would go here</p>
                </div>
              </CardContent>
            </Card>
            <div className="grid gap-4 sm:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Top Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "Football", bookings: 1234, revenue: "€45,678" },
                      { name: "Swimming", bookings: 987, revenue: "€34,567" },
                      { name: "Dance", bookings: 876, revenue: "€28,456" },
                      { name: "Martial Arts", bookings: 654, revenue: "€21,345" },
                    ].map((cat) => (
                      <div key={cat.name} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{cat.name}</p>
                          <p className="text-sm text-muted-foreground">{cat.bookings} bookings</p>
                        </div>
                        <p className="font-semibold">{cat.revenue}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Top Providers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "Dublin Soccer Academy", bookings: 456, revenue: "€12,345" },
                      { name: "Swim Ireland Dublin", bookings: 389, revenue: "€10,234" },
                      { name: "Elite Dance Studio", bookings: 312, revenue: "€8,456" },
                      { name: "Cork Martial Arts", bookings: 278, revenue: "€7,234" },
                    ].map((provider) => (
                      <div key={provider.name} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{provider.name}</p>
                          <p className="text-sm text-muted-foreground">{provider.bookings} bookings</p>
                        </div>
                        <p className="font-semibold">{provider.revenue}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
