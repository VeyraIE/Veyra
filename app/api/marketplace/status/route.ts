import { NextResponse } from 'next/server'
import { z } from 'zod'
import { assertSameOrigin, marketplaceStripe, ownedReservation, synchronizePayment } from '@/lib/marketplace/server'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    assertSameOrigin(request)
    const { reservationId } = z.object({ reservationId: z.string().uuid() }).parse(await request.json())
    let booking = await ownedReservation(reservationId)
    if (!booking) return NextResponse.json({ error: 'Booking not found.' }, { status: 404 })
    if (booking.status === 'held' && booking.stripe_session_id) {
      await synchronizePayment(await marketplaceStripe().checkout.sessions.retrieve(booking.stripe_session_id))
      booking = await ownedReservation(reservationId)
    }
    return NextResponse.json({ status: booking?.status ?? 'held' }, { headers: { 'Cache-Control': 'no-store' } })
  } catch { return NextResponse.json({ error: 'Could not verify your booking. Please retry.' }, { status: 400 }) }
}
