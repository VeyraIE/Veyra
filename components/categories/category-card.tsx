'use client'

import Link from 'next/link'
import { 
  Trophy, Waves, Music, Swords, Music2, Tent, Dumbbell, Heart, 
  Palette, BookOpen, Code, Circle, LucideIcon 
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Category } from '@/lib/types'

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  football: Trophy,
  waves: Waves,
  music: Music,
  swords: Swords,
  'music-2': Music2,
  tent: Tent,
  dumbbell: Dumbbell,
  heart: Heart,
  palette: Palette,
  'book-open': BookOpen,
  trophy: Trophy,
  rugby: Trophy,
  circle: Circle,
  horse: Trophy,
  code: Code,
}

interface CategoryCardProps {
  category: Category
  variant?: 'default' | 'compact' | 'icon-only'
  className?: string
}

export function CategoryCard({ category, variant = 'default', className }: CategoryCardProps) {
  const Icon = iconMap[category.icon] || Trophy

  if (variant === 'icon-only') {
    return (
      <Link
        href={`/discover?category=${category.slug}`}
        className={cn(
          'flex flex-col items-center gap-2 rounded-xl p-3 transition-all hover:bg-accent',
          className
        )}
      >
        <div
          className="flex h-12 w-12 items-center justify-center rounded-full"
          style={{ backgroundColor: `${category.color}15` }}
        >
          <Icon className="h-6 w-6" style={{ color: category.color || undefined }} />
        </div>
        <span className="text-xs font-medium text-center line-clamp-1">{category.name}</span>
      </Link>
    )
  }

  if (variant === 'compact') {
    return (
      <Link
        href={`/discover?category=${category.slug}`}
        className={cn(
          'flex items-center gap-3 rounded-xl border bg-card p-3 transition-all hover:shadow-soft hover:border-primary/20',
          className
        )}
      >
        <div
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${category.color}15` }}
        >
          <Icon className="h-5 w-5" style={{ color: category.color || undefined }} />
        </div>
        <span className="font-medium">{category.name}</span>
      </Link>
    )
  }

  return (
    <Link
      href={`/discover?category=${category.slug}`}
      className={cn(
        'group relative overflow-hidden rounded-2xl border bg-card p-6 transition-all hover:shadow-soft-lg hover:border-primary/20',
        className
      )}
    >
      <div
        className="absolute inset-0 opacity-5 transition-opacity group-hover:opacity-10"
        style={{ backgroundColor: category.color || '#16a34a' }}
      />
      <div className="relative">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${category.color}15` }}
        >
          <Icon className="h-7 w-7" style={{ color: category.color || undefined }} />
        </div>
        <h3 className="mt-4 text-lg font-semibold">{category.name}</h3>
        {category.description && (
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {category.description}
          </p>
        )}
      </div>
    </Link>
  )
}

// Quick category shortcuts for homepage
export function CategoryShortcuts({ variant = 'default' }: { variant?: 'default' | 'hero' }) {
  const shortcuts = [
    { name: 'Football', slug: 'football', icon: 'trophy', color: '#16a34a' },
    { name: 'Swimming', slug: 'swimming', icon: 'waves', color: '#0ea5e9' },
    { name: 'Dance', slug: 'dance', icon: 'music', color: '#ec4899' },
    { name: 'Martial Arts', slug: 'martial-arts', icon: 'swords', color: '#ef4444' },
    { name: 'Music', slug: 'music', icon: 'music-2', color: '#8b5cf6' },
    { name: 'Camps', slug: 'camps', icon: 'tent', color: '#f59e0b' },
    { name: 'Fitness', slug: 'fitness', icon: 'dumbbell', color: '#06b6d4' },
    { name: 'Yoga', slug: 'yoga', icon: 'heart', color: '#10b981' },
    { name: 'Art', slug: 'art', icon: 'palette', color: '#f97316' },
    { name: 'Tutoring', slug: 'tutoring', icon: 'book-open', color: '#6366f1' },
  ]

  const isHero = variant === 'hero'

  return (
    <div className={cn('flex gap-2 overflow-x-auto pb-2 no-scrollbar', isHero && 'justify-start sm:justify-center')}>
      {shortcuts.map((cat) => {
        const Icon = iconMap[cat.icon] || Trophy
        return (
          <Link
            key={cat.slug}
            href={`/discover?category=${cat.slug}`}
            className={cn(
              'flex flex-shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-all',
              isHero
                ? 'border border-foreground/15 bg-foreground/10 text-foreground backdrop-blur hover:border-primary/50 hover:bg-foreground/15'
                : 'border bg-card hover:border-primary/20 hover:shadow-soft'
            )}
          >
            <Icon className="h-4 w-4" style={{ color: isHero ? undefined : cat.color }} />
            <span>{cat.name}</span>
          </Link>
        )
      })}
    </div>
  )
}
