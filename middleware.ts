import { updateSession } from '@/lib/supabase/middleware'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  if (pathname === '/api/marketplace/checkout' || pathname === '/api/marketplace/status' || pathname === '/api/stripe/webhook' || pathname === '/api/marketplace/reconcile') return NextResponse.next()
  if (pathname === '/book' || pathname.startsWith('/book/')) {
    const response = NextResponse.next()
    if (!/^[a-f0-9]{64}$/.test(request.cookies.get('veyra_booking_guest')?.value ?? '')) {
      const token = Array.from(crypto.getRandomValues(new Uint8Array(32)), value => value.toString(16).padStart(2, '0')).join('')
      response.cookies.set('veyra_booking_guest', token, { httpOnly: true, secure: request.nextUrl.protocol === 'https:', sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 30 })
    }
    return response
  }
  const publicPages = ['/', '/discover', '/concierge', '/partners', '/request', '/privacy', '/about', '/pricing', '/providers', '/membership']
  if (publicPages.includes(pathname) || pathname.startsWith('/experiences/') || pathname.startsWith('/book/') || pathname === '/provider/onboarding') {
    return NextResponse.next()
  }
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

