"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { MobileNav } from "@/components/layout/mobile-nav"
import { ActivityCard } from "@/components/activities/activity-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SlidersHorizontal, MapPin, Grid3X3, List } from "lucide-react"
import type { Activity, Category } from "@/lib/types"

type SortOption = "popular" | "price-asc" | "price-desc" | "rating"

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "popular", label: "Most Popular" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
]

interface CategoryClientProps {
  category: Category
  activities: Activity[]
  relatedCategories: Category[]
}

export function CategoryClient({
  category,
  activities,
  relatedCategories,
}: CategoryClientProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState<SortOption>("popular")
  const [selectedCounty, setSelectedCounty] = useState<string | null>(null)

  // Counties that actually have activities in this category
  const availableCounties = useMemo(
    () =>
      Array.from(new Set(activities.map((a) => a.county).filter(Boolean) as string[])).sort(),
    [activities],
  )

  const visibleActivities = useMemo(() => {
    const filtered = selectedCounty
      ? activities.filter((a) => a.county === selectedCounty)
      : [...activities]

    switch (sortBy) {
      case "price-asc":
        return filtered.sort((a, b) => (a.price ?? 0) - (b.price ?? 0))
      case "price-desc":
        return filtered.sort((a, b) => (b.price ?? 0) - (a.price ?? 0))
      case "rating":
        return filtered.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
      default:
        return filtered.sort((a, b) => (b.booking_count ?? 0) - (a.booking_count ?? 0))
    }
  }, [activities, selectedCounty, sortBy])

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pb-24 md:pb-0">
        {/* Hero */}
        <section
          className="py-12 md:py-20"
          style={category.color ? { backgroundColor: `${category.color}10` } : undefined}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <Badge
                className="mb-4"
                style={
                  category.color
                    ? { backgroundColor: category.color, color: "var(--color-primary-foreground)" }
                    : undefined
                }
              >
                {category.name}
              </Badge>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
                {category.name} Activities in Ireland
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {category.description ||
                  `Discover the best ${category.name.toLowerCase()} activities for all ages across Ireland. From beginners to advanced, find the perfect class for you.`}
              </p>
            </div>
          </div>
        </section>

        {/* Filters Bar */}
        <section className="sticky top-16 z-30 bg-background/95 backdrop-blur-sm border-b border-border py-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 -mb-2 scrollbar-hide">
                <Button variant="outline" size="sm" className="rounded-full whitespace-nowrap" asChild>
                  <Link href={`/discover?category=${category.slug}`}>
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    All Filters
                  </Link>
                </Button>
                {selectedCounty && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full whitespace-nowrap text-muted-foreground"
                    onClick={() => setSelectedCounty(null)}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Clear location
                  </Button>
                )}
                {availableCounties.map((county) => (
                  <Badge
                    key={county}
                    variant={selectedCounty === county ? "default" : "secondary"}
                    className="cursor-pointer hover:bg-secondary/80 whitespace-nowrap"
                    onClick={() =>
                      setSelectedCounty(selectedCounty === county ? null : county)
                    }
                  >
                    {county}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => setViewMode("grid")}
                  aria-label="Grid view"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => setViewMode("list")}
                  aria-label="List view"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">{visibleActivities.length}</span>{" "}
                {visibleActivities.length === 1 ? "activity" : "activities"} found
              </p>
              <label className="sr-only" htmlFor="sort-activities">
                Sort activities
              </label>
              <select
                id="sort-activities"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="text-sm border border-border rounded-lg px-3 py-2 bg-background text-foreground"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {visibleActivities.length > 0 ? (
              <div
                className={`grid gap-6 ${
                  viewMode === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    : "grid-cols-1 max-w-3xl"
                }`}
              >
                {visibleActivities.map((activity) => (
                  <ActivityCard
                    key={activity.id}
                    activity={activity}
                    variant={viewMode === "list" ? "horizontal" : "default"}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Grid3X3 className="h-8 w-8 text-muted-foreground" />
                </div>
                <h2 className="text-lg font-semibold text-foreground mb-2">No activities found</h2>
                <p className="text-muted-foreground mb-6">
                  We couldn&apos;t find any {category.name.toLowerCase()} activities
                  {selectedCounty ? ` in ${selectedCounty}` : ""} right now.
                </p>
                {selectedCounty && (
                  <Button variant="outline" className="rounded-full" onClick={() => setSelectedCounty(null)}>
                    Clear Filters
                  </Button>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Related Categories */}
        {relatedCategories.length > 0 && (
          <section className="py-12 border-t border-border">
            <div className="container mx-auto px-4">
              <h2 className="text-xl font-semibold text-foreground mb-6">Related Categories</h2>
              <div className="flex flex-wrap gap-2">
                {relatedCategories.map((cat) => (
                  <Link key={cat.id} href={`/category/${cat.slug}`}>
                    <Badge
                      variant="secondary"
                      className="py-2 px-4 cursor-pointer hover:bg-secondary/80"
                      style={cat.color ? { borderColor: cat.color } : undefined}
                    >
                      {cat.name}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
      <MobileNav />
    </div>
  )
}
