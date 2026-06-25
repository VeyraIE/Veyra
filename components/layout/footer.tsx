import Link from 'next/link'
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin } from 'lucide-react'

const footerLinks = {
  discover: [
    { label: 'Browse Experiences', href: '/discover' },
    { label: 'Move', href: '/discover?category=fitness' },
    { label: 'Recover', href: '/discover?category=wellness' },
    { label: 'Explore', href: '/discover?category=adventure' },
    { label: 'Near Me', href: '/discover?nearby=true' },
  ],
  categories: [
    { label: 'Learn', href: '/discover?category=learning' },
    { label: 'Compete', href: '/discover?category=sport' },
    { label: 'Family', href: '/discover?category=family' },
    { label: 'Wellness Retreats', href: '/discover?category=wellness' },
    { label: 'Adventure', href: '/discover?category=adventure' },
  ],
  providers: [
    { label: 'Become a Provider', href: '/provider/onboarding' },
    { label: 'Provider Dashboard', href: '/provider/dashboard' },
    { label: 'Pricing Plans', href: '/pricing' },
    { label: 'The VEYRA Standard', href: '/about#standard' },
    { label: 'Help Center', href: '/help' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press', href: '/press' },
    { label: 'Contact', href: '/contact' },
    { label: 'Blog', href: '/blog' },
  ],
  legal: [
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'Safeguarding', href: '/safeguarding' },
  ],
}

const socialLinks = [
  { icon: Facebook, href: 'https://facebook.com/veyra', label: 'Facebook' },
  { icon: Instagram, href: 'https://instagram.com/veyra', label: 'Instagram' },
  { icon: Twitter, href: 'https://twitter.com/veyra', label: 'Twitter' },
  { icon: Linkedin, href: 'https://linkedin.com/company/veyra', label: 'LinkedIn' },
]

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-[0.25em] text-foreground">VEYRA</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Ireland&apos;s premium platform for discovering and booking experiences,
              wellness, sport and adventure — all in one place.
            </p>
            <div className="mt-6 flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  <social.icon className="h-5 w-5" />
                  <span className="sr-only">{social.label}</span>
                </a>
              ))}
            </div>
            <div className="mt-6 space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a href="mailto:hello@veyra.ie" className="hover:text-primary">
                  hello@veyra.ie
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <a href="tel:+35312345678" className="hover:text-primary">
                  +353 1 234 5678
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Dublin, Ireland</span>
              </div>
            </div>
          </div>

          {/* Discover */}
          <div>
            <h3 className="text-sm font-semibold">Discover</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.discover.map((link, index) => (
                <li key={`discover-${index}`}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold">Categories</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.categories.map((link, index) => (
                <li key={`category-${index}`}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Providers */}
          <div>
            <h3 className="text-sm font-semibold">For Providers</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.providers.map((link, index) => (
                <li key={`provider-${index}`}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold">Company</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={`company-${index}`}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} VEYRA. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {footerLinks.legal.map((link, index) => (
              <Link
                key={`legal-${index}`}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
