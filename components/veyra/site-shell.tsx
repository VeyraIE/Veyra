'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { ArrowUpRight, Menu, X } from 'lucide-react'

export function Header(_props: { user?: unknown }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const links = [{ href: '/discover', label: 'Discover' }, { href: '/concierge', label: 'Concierge' }, { href: '/partners', label: 'Partner with us' }]
  return <header className="v-header"><a className="v-skip" href="#main">Skip to content</a><div className="v-nav v-wrap">
    <Link href="/" className="v-logo" aria-label="Veyra home">veyra<span>•</span></Link>
    <nav aria-label="Main navigation" className="v-desktop-nav">{links.map(link => <Link key={link.href} href={link.href} aria-current={pathname === link.href ? 'page' : undefined}>{link.label}</Link>)}</nav>
    <div className="v-nav-actions"><span className="v-ireland"><span /> Ireland, first.</span><Link className="v-button v-button-small" href="/request">Plan something good <ArrowUpRight size={15} /></Link><button className="v-menu" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button></div>
  </div>{open && <nav id="mobile-navigation" className="v-mobile-nav" aria-label="Mobile navigation">{links.map(link => <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}<ArrowUpRight size={18} /></Link>)}<Link href="/request" onClick={() => setOpen(false)}>Plan something good<ArrowUpRight size={18} /></Link></nav>}</header>
}

export function Footer() {
  return <footer className="v-footer"><div className="v-wrap"><div className="v-footer-top"><div><Link href="/" className="v-logo">veyra<span>•</span></Link><p>A life well experienced.<br />Starting in Ireland.</p></div><div><span className="v-eyebrow">Make the most of it</span><Link href="/discover">Discover experiences</Link><Link href="/concierge">Your personal concierge</Link><Link href="/request">Make an enquiry</Link></div><div><span className="v-eyebrow">Better, together</span><Link href="/partners?type=provider">For experience providers</Link><Link href="/partners?type=hotel">For hotels & stays</Link><a href="mailto:hello@veyra.ie">hello@veyra.ie <ArrowUpRight size={14} /></a></div></div><div className="v-footer-bottom"><span>© {new Date().getFullYear()} Veyra</span><span>Thoughtfully discovered. Personally arranged.</span><Link href="/privacy">Privacy</Link></div></div></footer>
}

export function PageShell({ children }: { children: React.ReactNode }) {
  return <div className="v-site"><Header /><main id="main">{children}</main><Footer /></div>
}

