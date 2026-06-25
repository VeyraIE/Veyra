'use client'

import Link from 'next/link'
import { Heart, MapPin, Star, Clock, Users, BadgeCheck, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Activity } from '@/lib/types'

interface ActivityCardProps {
  activity: Activity
  onFavoriteToggle?: (id: string) => void
  isFavorited?: boolean
  variant?: 'default' | 'compact' | 'horizontal'
}

export function ActivityCard({ 
  activity, 
  onFavoriteToggle, 
  isFavorited = false,
  variant = 'default' 
}: ActivityCardProps) {
  const formatPrice = (price: number | null, priceType: string) => {
    if (price === null || price === 0) return 'Free'
    const formatted = new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
    }).format(price)
    
    if (priceType === 'per_session') return `${formatted}/session`
    if (priceType === 'per_package') return `${formatted}/package`
    if (priceType === 'subscription') return `${formatted}/month`
    return formatted
  }

  const formatAgeRange = (min: number | null, max: number | null) => {
    if (min === null && max === null) return 'All ages'
    if (min === null) return `Up to ${max} years`
    if (max === null || max >= 100) return `${min}+ years`
    return `${min}-${max} years`
  }

  if (variant === 'horizontal') {
    return (
      <Link
        href={`/activity/${activity.id}`}
        className="group flex gap-4 rounded-2xl border bg-card p-3 transition-all hover:shadow-soft"
      >
        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl">
          <img
            src={activity.cover_image || '/placeholder-activity.jpg'}
            alt={activity.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
        <div className="flex flex-1 flex-col justify-between py-1">
          <div>
            <h3 className="font-semibold line-clamp-1 group-hover:text-primary">
              {activity.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-1">
              {activity.provider?.business_name}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-sm">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="font-medium">{activity.rating.toFixed(1)}</span>
            </div>
            <span className="font-semibold text-primary">
              {formatPrice(activity.price, activity.price_type)}
            </span>
          </div>
        </div>
      </Link>
    )
  }

  if (variant === 'compact') {
    return (
      <Link
        href={`/activity/${activity.id}`}
        className="group block rounded-2xl border bg-card transition-all hover:shadow-soft"
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl">
          <img
            src={activity.cover_image || '/placeholder-activity.jpg'}
            alt={activity.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
        <div className="p-3">
          <h3 className="font-semibold line-clamp-1 group-hover:text-primary">
            {activity.title}
          </h3>
          <div className="mt-1 flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span>{activity.rating.toFixed(1)}</span>
            </div>
            <span className="font-semibold text-primary">
              {formatPrice(activity.price, activity.price_type)}
            </span>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <div className="group relative overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-soft-lg">
      {/* Image */}
      <Link href={`/activity/${activity.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl">
          <img
            src={activity.cover_image || '/placeholder-activity.jpg'}
            alt={activity.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            {activity.is_featured && (
              <Badge className="bg-highlight text-highlight-foreground">Featured</Badge>
            )}
            {activity.provider?.is_verified && (
              <Badge variant="secondary" className="border border-border bg-background/85 text-foreground backdrop-blur">
                <BadgeCheck className="mr-1 h-3 w-3 text-primary" />
                Verified
              </Badge>
            )}
            {activity.provider?.is_garda_vetted && (
              <Badge variant="secondary" className="border border-border bg-background/85 text-foreground backdrop-blur">
                <Shield className="mr-1 h-3 w-3 text-primary" />
                Garda Vetted
              </Badge>
            )}
          </div>

          {/* Favorite Button */}
          {onFavoriteToggle && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-3 top-3 h-9 w-9 rounded-full border border-border bg-background/80 backdrop-blur hover:bg-background"
              onClick={(e) => {
                e.preventDefault()
                onFavoriteToggle(activity.id)
              }}
            >
              <Heart
                className={cn(
                  'h-5 w-5 transition-colors',
                  isFavorited ? 'fill-destructive text-destructive' : 'text-foreground'
                )}
              />
            </Button>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        <Link href={`/activity/${activity.id}`} className="block">
          {/* Category & Provider */}
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-primary">{activity.category?.name}</span>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="font-medium">{activity.rating.toFixed(1)}</span>
              <span className="text-muted-foreground">({activity.review_count})</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="mt-2 font-display text-lg font-bold line-clamp-2 group-hover:text-primary">
            {activity.title}
          </h3>

          {/* Provider */}
          <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
            by {activity.provider?.business_name}
          </p>

          {/* Details */}
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{activity.county}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{activity.duration_minutes} min</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{formatAgeRange(activity.min_age, activity.max_age)}</span>
            </div>
          </div>

          {/* Price */}
          <div className="mt-4 flex items-center justify-between">
            <span className="text-lg font-bold text-primary">
              {formatPrice(activity.price, activity.price_type)}
            </span>
            {activity.instant_booking && (
              <Badge variant="outline" className="text-xs">
                Instant Booking
              </Badge>
            )}
          </div>
        </Link>
      </div>
    </div>
  )
}
