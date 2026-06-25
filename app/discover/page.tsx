"use client"

import { useState, useMemo } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { MobileNav } from "@/components/layout/mobile-nav"
import { ActivityCard } from "@/components/activities/activity-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Search, 
  MapPin, 
  SlidersHorizontal, 
  X, 
  Map, 
  LayoutGrid,
  ChevronDown
} from "lucide-react"
import { demoActivities, demoCategories, counties } from "@/lib/demo-data"

const ageRanges = [
  { label: "All Ages", value: "all" },
  { label: "0-3 years", value: "0-3" },
  { label: "4-6 years", value: "4-6" },
  { label: "7-10 years", value: "7-10" },
  { label: "11-14 years", value: "11-14" },
  { label: "15-17 years", value: "15-17" },
  { label: "Adults (18+)", value: "18+" },
]

const priceRanges = [
  { label: "Any Price", value: "all" },
  { label: "Free", value: "free" },
  { label: "Under €10", value: "0-10" },
  { label: "€10 - €25", value: "10-25" },
  { label: "€25 - €50", value: "25-50" },
  { label: "€50+", value: "50+" },
]

const skillLevels = [
  { label: "All Levels", value: "all" },
  { label: "Beginner", value: "beginner" },
  { label: "Intermediate", value: "intermediate" },
  { label: "Advanced", value: "advanced" },
]

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedCounty, setSelectedCounty] = useState<string>("all")
  const [selectedAge, setSelectedAge] = useState<string>("all")
  const [selectedPrice, setSelectedPrice] = useState<string>("all")
  const [selectedSkill, setSelectedSkill] = useState<string>("all")
  const [selectedEnvironment, setSelectedEnvironment] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [favorites, setFavorites] = useState<string[]>([])

  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (selectedCategory !== "all") count++
    if (selectedCounty !== "all") count++
    if (selectedAge !== "all") count++
    if (selectedPrice !== "all") count++
    if (selectedSkill !== "all") count++
    if (selectedEnvironment !== "all") count++
    return count
  }, [selectedCategory, selectedCounty, selectedAge, selectedPrice, selectedSkill, selectedEnvironment])

  const filteredActivities = useMemo(() => {
    return demoActivities.filter(activity => {
      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch = 
          activity.title.toLowerCase().includes(query) ||
          activity.description?.toLowerCase().includes(query) ||
          activity.provider?.business_name.toLowerCase().includes(query) ||
          activity.tags?.some(tag => tag.toLowerCase().includes(query))
        if (!matchesSearch) return false
      }

      // Category filter
      if (selectedCategory !== "all") {
        if (activity.category?.slug !== selectedCategory) return false
      }

      // County filter
      if (selectedCounty !== "all") {
        if (activity.county?.toLowerCase() !== selectedCounty.toLowerCase()) return false
      }

      // Age filter
      if (selectedAge !== "all") {
        const [minAge, maxAge] = selectedAge === "18+" 
          ? [18, 100] 
          : selectedAge.split("-").map(Number)
        
        if (activity.min_age !== undefined && activity.max_age !== undefined) {
          if (activity.max_age < minAge || activity.min_age > maxAge) return false
        }
      }

      // Price filter
      if (selectedPrice !== "all" && activity.price !== undefined) {
        if (selectedPrice === "free" && activity.price !== 0) return false
        if (selectedPrice === "0-10" && activity.price > 10) return false
        if (selectedPrice === "10-25" && (activity.price < 10 || activity.price > 25)) return false
        if (selectedPrice === "25-50" && (activity.price < 25 || activity.price > 50)) return false
        if (selectedPrice === "50+" && activity.price < 50) return false
      }

      // Skill level filter
      if (selectedSkill !== "all") {
        if (activity.skill_level !== selectedSkill && activity.skill_level !== "all") return false
      }

      // Environment filter
      if (selectedEnvironment !== "all") {
        if (selectedEnvironment === "indoor" && !activity.is_indoor) return false
        if (selectedEnvironment === "outdoor" && !activity.is_outdoor) return false
      }

      return true
    })
  }, [searchQuery, selectedCategory, selectedCounty, selectedAge, selectedPrice, selectedSkill, selectedEnvironment])

  const clearFilters = () => {
    setSelectedCategory("all")
    setSelectedCounty("all")
    setSelectedAge("all")
    setSelectedPrice("all")
    setSelectedSkill("all")
    setSelectedEnvironment("all")
    setSearchQuery("")
  }

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 pb-20 md:pb-0">
        {/* Search Header */}
        <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
          <div className="container mx-auto px-4 py-4">
            {/* Search Bar */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search activities, sports, camps..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 h-12 rounded-full bg-muted/50 border-0 focus-visible:ring-2 focus-visible:ring-primary"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <Button
                variant="outline"
                size="icon"
                className={`h-12 w-12 rounded-full shrink-0 ${showFilters ? 'bg-primary text-primary-foreground' : ''}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="h-5 w-5" />
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>
            </div>

            {/* Quick Category Pills */}
            <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                size="sm"
                className="rounded-full shrink-0"
                onClick={() => setSelectedCategory("all")}
              >
                All
              </Button>
              {demoCategories.slice(0, 8).map((category) => (
                <Button
                  key={category.slug}
                  variant={selectedCategory === category.slug ? "default" : "outline"}
                  size="sm"
                  className="rounded-full shrink-0"
                  onClick={() => setSelectedCategory(category.slug)}
                >
                  {category.name}
                </Button>
              ))}
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full shrink-0 text-primary"
              >
                More <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                <Select value={selectedCounty} onValueChange={setSelectedCounty}>
                  <SelectTrigger className="rounded-xl">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="County" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Counties</SelectItem>
                    {counties.map((county) => (
                      <SelectItem key={county} value={county.toLowerCase()}>
                        {county}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedAge} onValueChange={setSelectedAge}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Age Range" />
                  </SelectTrigger>
                  <SelectContent>
                    {ageRanges.map((range) => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedPrice} onValueChange={setSelectedPrice}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Price" />
                  </SelectTrigger>
                  <SelectContent>
                    {priceRanges.map((range) => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedSkill} onValueChange={setSelectedSkill}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Skill Level" />
                  </SelectTrigger>
                  <SelectContent>
                    {skillLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedEnvironment} onValueChange={setSelectedEnvironment}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Indoor/Outdoor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any</SelectItem>
                    <SelectItem value="indoor">Indoor</SelectItem>
                    <SelectItem value="outdoor">Outdoor</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="ghost"
                  className="text-muted-foreground"
                  onClick={clearFilters}
                >
                  Clear All
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="container mx-auto px-4 py-6">
          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {selectedCategory !== "all" 
                  ? demoCategories.find(c => c.slug === selectedCategory)?.name || "Activities"
                  : "All Activities"}
              </h1>
              <p className="text-muted-foreground mt-1">
                {filteredActivities.length} {filteredActivities.length === 1 ? 'activity' : 'activities'} found
                {selectedCounty !== "all" && ` in ${selectedCounty}`}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "map" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("map")}
              >
                <Map className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Active Filters */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedCategory !== "all" && (
                <Badge variant="secondary" className="pl-3 pr-2 py-1 rounded-full">
                  {demoCategories.find(c => c.slug === selectedCategory)?.name}
                  <button onClick={() => setSelectedCategory("all")} className="ml-2">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {selectedCounty !== "all" && (
                <Badge variant="secondary" className="pl-3 pr-2 py-1 rounded-full">
                  {selectedCounty}
                  <button onClick={() => setSelectedCounty("all")} className="ml-2">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {selectedAge !== "all" && (
                <Badge variant="secondary" className="pl-3 pr-2 py-1 rounded-full">
                  {ageRanges.find(r => r.value === selectedAge)?.label}
                  <button onClick={() => setSelectedAge("all")} className="ml-2">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {selectedPrice !== "all" && (
                <Badge variant="secondary" className="pl-3 pr-2 py-1 rounded-full">
                  {priceRanges.find(r => r.value === selectedPrice)?.label}
                  <button onClick={() => setSelectedPrice("all")} className="ml-2">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}

          {viewMode === "grid" ? (
            <>
              {filteredActivities.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredActivities.map((activity) => (
                    <ActivityCard
                      key={activity.id}
                      activity={activity}
                      isFavorite={favorites.includes(activity.id)}
                      onFavoriteToggle={() => toggleFavorite(activity.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                    <Search className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">No activities found</h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your filters or search terms
                  </p>
                  <Button onClick={clearFilters}>Clear Filters</Button>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-2xl overflow-hidden border border-border bg-muted h-[600px] flex items-center justify-center">
              <div className="text-center">
                <Map className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">Map View</h3>
                <p className="text-muted-foreground">
                  Interactive map coming soon
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  )
}
