import { timingSafeEqual } from 'node:crypto'
import { NextResponse } from 'next/server'
import { marketplaceDatabase, marketplaceStripe, synchronizePayment } from '@/lib/marketplace/server'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  const expected = process.env.CRON_SECRET
  const supplied = request.headers.get('authorization') ?? ''
  if (!expected || supplied.length !== ('Bearer ' + expected).length || !timingSafeEqual(Buffer.from(supplied), Buffer.from('Bearer ' + expected))) return NextResponse.json({ error: 'Unauthorised.' }, { status: 401 })
  try {
    const database = marketplaceDatabase()
    const { data, error } = await database.from('veyra_marketplace_reservations').select('id,stripe_session_id').eq('status', 'held').lt('expires_at', new Date().toISOString()).not('stripe_session_id', 'is', null).order('expires_at').limit(50)
    if (error) throw error
    let reconciled = 0
    let retry = 0
    for (const reservation of data ?? []) {
      try { await synchronizePayment(await marketplaceStripe().checkout.sessions.retrieve(reservation.stripe_session_id)); reconciled++ } catch { retry++ }
    }
    return NextResponse.json({ reconciled, retry }, { headers: { 'Cache-Control': 'no-store' } })
  } catch { return NextResponse.json({ error: 'Reconciliation needs a retry.' }, { status: 500 }) }
}
