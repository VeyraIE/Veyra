import type { Metadata, Viewport } from 'next'
import { Inter, Geist_Mono, Bricolage_Grotesque } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
})

const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: '--font-geist-mono',
  display: 'swap',
})

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: '--font-bricolage',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'VEYRA - Discover Ireland Beyond the Ordinary',
    template: '%s | VEYRA',
  },
  description: 'Find and book experiences, wellness, sport, adventure and everything worth doing across Ireland — all in one seamless, premium platform.',
  keywords: ['experiences', 'Ireland', 'wellness', 'adventure', 'fitness', 'booking', 'lifestyle', 'sport', 'things to do', 'retreats'],
  authors: [{ name: 'VEYRA' }],
  creator: 'VEYRA',
  openGraph: {
    type: 'website',
    locale: 'en_IE',
    url: 'https://veyra.ie',
    siteName: 'VEYRA',
    title: 'VEYRA - Discover Ireland Beyond the Ordinary',
    description: 'Find and book experiences, wellness, sport, adventure and everything worth doing across Ireland.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'VEYRA',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VEYRA - Discover Ireland Beyond the Ordinary',
    description: 'Find and book experiences, wellness, sport, adventure and everything worth doing across Ireland.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  themeColor: '#0A0A0A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${geistMono.variable} ${bricolage.variable} bg-background`}>
      <body className="font-sans antialiased min-h-screen">
        {children}
        <Toaster 
          position="top-center" 
          richColors 
          closeButton
          toastOptions={{
            className: 'font-sans',
          }}
        />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
