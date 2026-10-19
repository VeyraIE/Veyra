import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const unavailable = { available: false, email: false, google: false, apple: false, message: 'Account registration and sign-in are temporarily unavailable. The Veyra account service needs to be reconnected. Please contact hello@veyra.ie.' }
  if (!url || !key) return NextResponse.json(unavailable, { status: 503, headers: { 'Cache-Control': 'no-store' } })
  try {
    const result = await fetch(new URL('/auth/v1/settings', url), { headers: { apikey: key }, cache: 'no-store', signal: AbortSignal.timeout(5000) })
    if (!result.ok) throw new Error('Account service unavailable')
    const settings = await result.json()
    return NextResponse.json({
      available: true, email: settings.external?.email === true, signup: settings.disable_signup !== true,
      google: settings.external?.google === true, apple: settings.external?.apple === true,
      message: settings.disable_signup === true ? 'New account registration is currently disabled by the account service.' : '',
    }, { headers: { 'Cache-Control': 'private, max-age=30' } })
  } catch { return NextResponse.json(unavailable, { status: 503, headers: { 'Cache-Control': 'no-store' } }) }
}
