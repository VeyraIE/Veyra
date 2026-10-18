'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { ArrowRight, ChevronDown, Menu, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

const navigation = [
  { href: '/discover', label: 'Discover' },
  { href: '/concierge', label: 'Concierge' },
  { href: '/partners', label: 'For Partners' },
]

const categoryLinks = [
  { label: 'Move', category: 'fitness' },
  { label: 'Recover', category: 'wellness' },
  { label: 'Explore', category: 'adventure' },
  { label: 'Learn', category: 'learning' },
  { label: 'Compete', category: 'fitness' },
  { label: 'Family', category: 'family' },
]

export function Header(_props: { user?: unknown }) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const isHome = pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={cn(
      'z-50 w-full transition-all duration-300',
      isHome ? 'fixed top-0' : 'sticky top-0',
      isHome && !scrolled && !mobileMenuOpen
        ? 'border-b border-transparent bg-transparent'
        : 'border-b border-border bg-background/80 backdrop-blur-xl'
    )}>
      <a className="v-skip" href="#main">Skip to content</a>
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <Link href="/" aria-label="Veyra home" className="flex items-center gap-2">
          <span className="font-sans text-xl font-bold tracking-[0.25em] text-foreground">VEYRA</span>
        </Link>
        <div className="hidden items-center gap-1 md:flex">
          <Link href="/discover" className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground" aria-current={pathname === '/discover' ? 'page' : undefined}>Discover</Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">Experiences <ChevronDown className="h-4 w-4" /></button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-52">
              {categoryLinks.map(category => (
                <DropdownMenuItem key={category.label} asChild>
                  <Link href={'/discover?category=' + category.category}>{category.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {navigation.slice(1).map(link => <Link key={link.href} href={link.href} aria-current={pathname === link.href ? 'page' : undefined} className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">{link.label}</Link>)}
        </div>
        <div className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" size="icon" asChild><Link href="/discover" aria-label="Search experiences"><Search className="h-5 w-5" /></Link></Button>
          <Button asChild className="rounded-full"><Link href="/book">Book an Experience</Link></Button>
        </div>
        <Button variant="ghost" size="icon" className="md:hidden" aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileMenuOpen} aria-controls="mobile-navigation" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </nav>
      {mobileMenuOpen && (
        <nav id="mobile-navigation" aria-label="Mobile navigation" className="space-y-1 border-t border-border bg-background px-4 py-4 md:hidden">
          {navigation.map(link => <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-3 py-3 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">{link.label}</Link>)}
          <div className="grid grid-cols-3 gap-2 py-3">
            {categoryLinks.map(category => <Link key={category.label} href={'/discover?category=' + category.category} onClick={() => setMobileMenuOpen(false)} className="rounded-full border border-border px-3 py-2 text-center text-xs">{category.label}</Link>)}
          </div>
          <Button asChild className="w-full rounded-full"><Link href="/book" onClick={() => setMobileMenuOpen(false)}>Book an Experience <ArrowRight className="h-4 w-4" /></Link></Button>
        </nav>
      )}
    </header>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="font-sans text-xl font-bold tracking-[0.25em] text-foreground">VEYRA</Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">Ireland’s premium platform for discovering experiences, wellness, sport and adventure — personally arranged.</p>
            <a className="mt-6 inline-block text-sm text-muted-foreground hover:text-primary" href="mailto:hello@veyra.ie">hello@veyra.ie</a>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Discover</p>
            <ul className="mt-4 space-y-3">{categoryLinks.map(category => <li key={category.label}><Link className="text-sm text-muted-foreground hover:text-primary" href={'/discover?category=' + category.category}>{category.label}</Link></li>)}</ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">For Partners</p>
            <ul className="mt-4 space-y-3">
              <li><Link className="text-sm text-muted-foreground hover:text-primary" href="/provider/onboarding">Become a Provider</Link></li>
              <li><Link className="text-sm text-muted-foreground hover:text-primary" href="/request?type=hotel">For Hotels & Stays</Link></li>
              <li><Link className="text-sm text-muted-foreground hover:text-primary" href="/provider/dashboard">Provider Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">VEYRA</p>
            <ul className="mt-4 space-y-3">
              <li><Link className="text-sm text-muted-foreground hover:text-primary" href="/concierge">Personal Concierge</Link></li>
              <li><Link className="text-sm text-muted-foreground hover:text-primary" href="/request">Contact Us</Link></li>
              <li><Link className="text-sm text-muted-foreground hover:text-primary" href="/privacy">Privacy</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} VEYRA. All rights reserved.</p>
          <span className="text-sm text-muted-foreground">Launching in Ireland. No app required.</span>
        </div>
      </div>
    </footer>
  )
}

export function PageShell({ children }: { children: React.ReactNode }) {
  return <div className="v-site"><Header /><main id="main">{children}</main><Footer /></div>
}
