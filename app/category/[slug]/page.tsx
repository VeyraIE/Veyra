"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ActivityCard } from "@/components/activities/activity-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  SlidersHorizontal,
  MapPin,
  Grid3X3,
  List
} from "lucide-react";
import { demoActivities, demoCategories } from "@/lib/demo-data";
import { useState } from "react";
import { use } from "react";

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Find category by slug
  const category = demoCategories.find(c => c.slug === slug) || demoCategories[0];
  
  // Get activities for this category
  const categoryActivities = demoActivities.filter(a => a.category_id === category.id);

  const counties = ["Dublin", "Cork", "Galway", "Limerick", "Waterford"];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pb-24 md:pb-0">
        {/* Hero */}
        <section 
          className="py-12 md:py-20"
          style={{ backgroundColor: `${category.color}10` }}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <Badge 
                className="mb-4"
                style={{ backgroundColor: category.color, color: 'white' }}
              >
                {category.name}
              </Badge>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                {category.name} Activities in Ireland
              </h1>
              <p className="text-lg text-muted-foreground">
                {category.description || `Discover the best ${category.name.toLowerCase()} activities for all ages across Ireland. From beginners to advanced, find the perfect class for you.`}
              </p>
            </div>
          </div>
        </section>

        {/* Filters Bar */}
        <section className="sticky top-16 z-30 bg-background/95 backdrop-blur-sm border-b border-border py-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 -mb-2 scrollbar-hide">
                <Button variant="outline" size="sm" className="rounded-full whitespace-nowrap">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                <Button variant="outline" size="sm" className="rounded-full whitespace-nowrap">
                  <MapPin className="h-4 w-4 mr-2" />
                  Location
                </Button>
                {counties.slice(0, 4).map((county) => (
                  <Badge 
                    key={county}
                    variant="secondary"
                    className="cursor-pointer hover:bg-secondary/80 whitespace-nowrap"
                  >
                    {county}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => setViewMode('list')}
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
                <span className="font-medium text-foreground">{categoryActivities.length}</span> activities found
              </p>
              <select className="text-sm border border-border rounded-lg px-3 py-2 bg-background">
                <option>Most Popular</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Highest Rated</option>
                <option>Nearest</option>
              </select>
            </div>

            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1 max-w-3xl'
            }`}>
              {categoryActivities.map((activity) => (
                <ActivityCard key={activity.id} activity={activity} />
              ))}
            </div>

            {categoryActivities.length === 0 && (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Grid3X3 className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No activities found
                </h3>
                <p className="text-muted-foreground mb-6">
                  We couldn&apos;t find any {category.name.toLowerCase()} activities matching your criteria.
                </p>
                <Button variant="outline" className="rounded-full">
                  Clear Filters
                </Button>
              </div>
            )}

            {/* Load More */}
            {categoryActivities.length > 0 && (
              <div className="text-center mt-12">
                <Button variant="outline" size="lg" className="rounded-full">
                  Load More Activities
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Related Categories */}
        <section className="py-12 border-t border-border">
          <div className="container mx-auto px-4">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              Related Categories
            </h2>
            <div className="flex flex-wrap gap-2">
              {demoCategories
                .filter(c => c.id !== category.id)
                .slice(0, 8)
                .map((cat) => (
                  <Badge
                    key={cat.id}
                    variant="secondary"
                    className="py-2 px-4 cursor-pointer hover:bg-secondary/80"
                    style={{ borderColor: cat.color }}
                  >
                    {cat.name}
                  </Badge>
                ))
              }
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
