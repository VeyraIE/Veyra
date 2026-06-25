'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Menu, X, Search, Heart, User, Bell, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

interface HeaderProps {
  user?: {
    id: string
    email: string
    full_name: string | null
    avatar_url: string | null
    role: 'user' | 'provider' | 'admin'
  } | null
}

const experienceCategories = [
  { label: 'Move', href: '/discover?category=fitness' },
  { label: 'Recover', href: '/discover?category=wellness' },
  { label: 'Explore', href: '/discover?category=adventure' },
  { label: 'Learn', href: '/discover?category=learning' },
  { label: 'Compete', href: '/discover?category=sport' },
  { label: 'Family', href: '/discover?category=family' },
]

export function Header({ user }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const isHome = pathname === '/'

  useEffect(() => {
    if (!isHome) return
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isHome])

  const transparent = isHome && !scrolled && !mobileMenuOpen

  return (
    <header
      className={cn(
        'z-50 w-full transition-all duration-300',
        isHome ? 'fixed top-0' : 'sticky top-0',
        transparent
          ? 'border-b border-transparent bg-transparent'
          : 'border-b border-border bg-background/80 backdrop-blur-xl'
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-[0.25em] text-foreground">VEYRA</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 md:flex">
          <Link
            href="/discover"
            className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Discover
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                Experiences
                <ChevronDown className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-52">
              {experienceCategories.map((cat) => (
                <DropdownMenuItem key={cat.label} asChild>
                  <Link href={cat.href}>{cat.label}</Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/discover" className="font-medium text-primary">
                  View all experiences
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link
            href="/pricing"
            className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            For Providers
          </Link>
          <Link
            href="/about"
            className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            About
          </Link>
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/discover">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Link>
          </Button>

          {user ? (
            <>
              <Button variant="ghost" size="icon" asChild>
                <Link href="/dashboard/favorites">
                  <Heart className="h-5 w-5" />
                  <span className="sr-only">Favorites</span>
                </Link>
              </Button>
              <Button variant="ghost" size="icon" className="relative" asChild>
                <Link href="/dashboard/notifications">
                  <Bell className="h-5 w-5" />
                  <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary" />
                  <span className="sr-only">Notifications</span>
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    {user.avatar_url ? (
                      <img
                        src={user.avatar_url || "/placeholder.svg"}
                        alt={user.full_name || 'User'}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user.full_name || 'User'}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/bookings">My Bookings</Link>
                  </DropdownMenuItem>
                  {user.role === 'provider' && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/provider">Provider Dashboard</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  {user.role === 'admin' && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin">Admin Panel</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/auth/logout" className="text-destructive">
                      Sign Out
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button asChild className="rounded-full">
                <Link href="/auth/sign-up">Join Early Access</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={cn(
          'absolute left-0 right-0 top-16 z-50 border-b border-border bg-background md:hidden',
          mobileMenuOpen ? 'block' : 'hidden'
        )}
      >
        <div className="space-y-1 px-4 pb-4 pt-2">
          <Link
            href="/discover"
            className="block rounded-lg px-3 py-2 text-base font-medium hover:bg-accent"
            onClick={() => setMobileMenuOpen(false)}
          >
            Discover
          </Link>
          {experienceCategories.map((cat) => (
            <Link
              key={cat.label}
              href={cat.href}
              className="block rounded-lg px-3 py-2 text-base font-medium hover:bg-accent"
              onClick={() => setMobileMenuOpen(false)}
            >
              {cat.label}
            </Link>
          ))}
          <Link
            href="/pricing"
            className="block rounded-lg px-3 py-2 text-base font-medium hover:bg-accent"
            onClick={() => setMobileMenuOpen(false)}
          >
            For Providers
          </Link>
          <Link
            href="/about"
            className="block rounded-lg px-3 py-2 text-base font-medium hover:bg-accent"
            onClick={() => setMobileMenuOpen(false)}
          >
            About
          </Link>

          <div className="my-4 border-t border-border pt-4">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="block rounded-lg px-3 py-2 text-base font-medium hover:bg-accent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/auth/logout"
                  className="block rounded-lg px-3 py-2 text-base font-medium text-destructive hover:bg-accent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Out
                </Link>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Button variant="outline" asChild className="w-full rounded-full">
                  <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                    Sign In
                  </Link>
                </Button>
                <Button asChild className="w-full rounded-full">
                  <Link href="/auth/sign-up" onClick={() => setMobileMenuOpen(false)}>
                    Join Early Access
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
