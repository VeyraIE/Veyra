import Link from 'next/link'
import { PageShell } from '@/components/veyra/site-shell'
import { MarketplaceHeading, secondaryClass } from '@/components/marketplace/presentation'
import { BookingStatus } from '@/components/marketplace/booking-status'
import { marketplaceStripe, ownedReservation, synchronizePayment } from '@/lib/marketplace/server'
import { formatMoney, formatSession } from '@/lib/marketplace/validation'

export const dynamic = 'force-dynamic'

export default async function BookingConfirmation({ searchParams }: { searchParams: Promise<{ reservation?: string }> }) {
  const { reservation: id } = await searchParams
  let booking = null
  if (id && /^[0-9a-f-]{36}$/i.test(id)) {
    try {
      booking = await ownedReservation(id)
      if (booking?.status === 'held' && booking.stripe_session_id) {
        try { await synchronizePayment(await marketplaceStripe().checkout.sessions.retrieve(booking.stripe_session_id)); booking = await ownedReservation(id) } catch { }
      }
    } catch { }
  }
  if (!booking) return <PageShell><section className="mx-auto max-w-4xl px-4 py-16"><MarketplaceHeading eyebrow="Your booking" title="We can’t find this booking">Open the confirmation in the same browser used at checkout, or contact hello@veyra.ie with your payment reference. Do not pay again if you have already paid.</MarketplaceHeading><Link className={secondaryClass} href="/book">Browse experiences</Link></section></PageShell>
  const confirmed = booking.status === 'confirmed'
  const pending = booking.status === 'held'
  const refunded = booking.status.startsWith('refund')
  return <PageShell><section className="mx-auto max-w-4xl px-4 py-16 sm:px-6"><MarketplaceHeading eyebrow="Your Veyra experience" title={confirmed ? 'You’re booked.' : pending ? 'Verifying your booking.' : refunded ? 'Your refund status' : 'Checkout expired'}>{confirmed ? 'Your payment has been verified and your place is confirmed. Save this page and reference for your records.' : pending ? 'We’re checking the payment securely with Stripe. Please don’t make a second payment.' : refunded ? 'For help with this booking, contact hello@veyra.ie.' : 'No confirmed booking was created. If you see a charge, contact Veyra before trying again.'}</MarketplaceHeading><div className="space-y-4 rounded-2xl border border-border p-6 sm:p-8"><h2 className="text-2xl font-bold">{booking.title}</h2><p>{formatSession(booking.starts_at)} (Ireland time)</p><p>{booking.guests} guests · {formatMoney(booking.total_amount, booking.currency)}</p><p className="text-sm text-primary">Status: {booking.status.replaceAll('_', ' ')}</p><p className="break-all text-sm text-muted-foreground">Reference: {booking.id}</p><h3 className="pt-4 font-semibold">Cancellation terms</h3><p className="whitespace-pre-wrap text-sm text-muted-foreground">{booking.cancellation_terms}</p><p className="text-sm text-muted-foreground">Contact hello@veyra.ie with your reference for booking assistance. An email confirmation service is not yet enabled.</p>{pending && <BookingStatus reservationId={booking.id} />}</div><Link className={secondaryClass + ' mt-6'} href="/book">Discover more experiences</Link></section></PageShell>
}
