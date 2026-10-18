import type { Metadata, Viewport } from 'next'
import { Inter, Geist_Mono, Fraunces } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import './globals.css'
import './veyra.css'

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

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: '--font-fraunces',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'VEYRA — A life well experienced',
    template: '%s | VEYRA',
  },
  description: 'Discover Irish experiences, thoughtful escapes and personal concierge. Your time, beautifully spent.',
  keywords: ['experiences', 'Ireland', 'wellness', 'adventure', 'fitness', 'booking', 'lifestyle', 'sport', 'things to do', 'retreats'],
  authors: [{ name: 'VEYRA' }],
  creator: 'VEYRA',
  openGraph: {
    type: 'website',
    locale: 'en_IE',
    url: 'https://veyra.ie',
    siteName: 'VEYRA',
    title: 'VEYRA — A life well experienced',
    description: 'Discover Irish experiences, thoughtful escapes and personal concierge. Your time, beautifully spent.',
    images: [
      {
        url: '/veyra/hero.png',
        width: 1200,
        height: 630,
        alt: 'VEYRA',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VEYRA — A life well experienced',
    description: 'Discover Irish experiences, thoughtful escapes and personal concierge. Your time, beautifully spent.',
    images: ['/veyra/hero.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#0A0A0A',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en-IE" className={`dark ${inter.variable} ${geistMono.variable} ${fraunces.variable} bg-background`}>
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


