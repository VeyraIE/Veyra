'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, Calendar, Heart, User } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MobileNavProps {
  user?: {
    id: string
  } | null
}

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/discover', icon: Search, label: 'Discover' },
  { href: '/dashboard/bookings', icon: Calendar, label: 'Bookings', requiresAuth: true },
  { href: '/dashboard/favorites', icon: Heart, label: 'Saved', requiresAuth: true },
  { href: '/dashboard', icon: User, label: 'Account', requiresAuth: true },
]

const navItemsGuest = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/discover', icon: Search, label: 'Discover' },
  { href: '/auth/login', icon: Calendar, label: 'Bookings' },
  { href: '/auth/login', icon: Heart, label: 'Saved' },
  { href: '/auth/login', icon: User, label: 'Sign In' },
]

export function MobileNav({ user }: MobileNavProps) {
  const pathname = usePathname()
  const items = user ? navItems : navItemsGuest

  // Don't show on auth pages or dashboard
  if (pathname.startsWith('/auth') || pathname.startsWith('/provider') || pathname.startsWith('/admin')) {
    return null
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:hidden safe-bottom">
      <div className="flex h-16 items-center justify-around px-2">
        {items.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/' && pathname.startsWith(item.href))
          
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs font-medium transition-colors',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <item.icon className={cn('h-5 w-5', isActive && 'fill-primary/20')} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
