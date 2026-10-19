'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import type { BookableOffer } from '@/lib/marketplace/catalogue'
import { formatMoney, formatSession } from '@/lib/marketplace/validation'
import { buttonClass, fieldClass } from './presentation'

const publicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
const stripePromise = publicKey ? loadStripe(publicKey) : null

export function CheckoutForm({ offer, configured, memberPrice }: { offer: BookableOffer; configured: boolean; memberPrice?: { unitAmount: number; percentage: number } | null }) {
  const router = useRouter()
  const [guests, setGuests] = useState(1)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [checkout, setCheckout] = useState<{ clientSecret: string; reservationId: string } | null>(null)
  const requestKey = useRef<string | null>(null)
  const submitting = useRef(false)
  if (!configured || !stripePromise) return <div className="rounded-2xl border border-border p-6"><h2 className="text-xl font-bold">Payments are not available yet</h2><p className="mt-3 text-muted-foreground">Please contact hello@veyra.ie. No reservation or payment has been made.</p></div>
  if (checkout) return <div><p className="mb-5 text-sm text-muted-foreground">Your session is held for checkout. Complete payment below; a booking is confirmed only after payment is verified.</p><div className="overflow-hidden rounded-2xl bg-white"><EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret: checkout.clientSecret, onComplete: () => router.push('/book/confirmation?reservation=' + checkout.reservationId) }}><EmbeddedCheckout /></EmbeddedCheckoutProvider></div><p className="mt-4 text-sm text-muted-foreground">Veyra collects your payment securely through Stripe. Never send card details by email.</p></div>
  return <form className="space-y-6 rounded-2xl border border-border p-6 sm:p-8" onSubmit={async event => {
    event.preventDefault()
    if (submitting.current) return
    submitting.current = true
    setBusy(true)
    setError('')
    const data = new FormData(event.currentTarget)
    requestKey.current ??= crypto.randomUUID()
    try {
      const response = await fetch('/api/marketplace/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ offerId: offer.id, slotId: data.get('slotId'), guests, name: data.get('name'), email: data.get('email'), acceptTerms: data.get('acceptTerms') === 'on', requestKey: requestKey.current }) })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Could not start checkout.')
      setCheckout(result)
    } catch (issue) { setError(issue instanceof Error ? issue.message : 'Could not start checkout. Please retry.') }
    finally { submitting.current = false; setBusy(false) }
  }}>
    <h2 className="text-2xl font-bold">Book your experience</h2>
    {memberPrice ? <p className="text-sm text-primary">Your member offer: {memberPrice.percentage}% off this experience. Availability and membership are checked again at checkout.</p> : <p className="text-sm text-muted-foreground">Already a member? <Link href="/auth/login?redirect=/account" className="text-primary">Sign in</Link> before booking to use eligible discounts. <Link href="/membership" className="text-primary">Membership is €4.99/month.</Link></p>}
    {error && <p role="alert" className="rounded-xl border border-destructive p-4 text-sm">{error}</p>}
    <label className="block text-sm">Choose a session · Ireland time<select name="slotId" required className={fieldClass} onChange={() => { requestKey.current = null }}><option value="">Select a date and time</option>{offer.slots.map(slot => <option key={slot.id} value={slot.id}>{formatSession(slot.starts_at)}</option>)}</select></label>
    <label className="block text-sm">Guests<input name="guests" type="number" min={1} max={offer.max_guests} required value={guests} onChange={event => { setGuests(Number(event.target.value)); requestKey.current = null }} className={fieldClass} /></label>
    <label className="block text-sm">Your full name<input name="name" autoComplete="name" required minLength={2} maxLength={150} className={fieldClass} onChange={() => { requestKey.current = null }} /></label>
    <label className="block text-sm">Email address<input name="email" type="email" autoComplete="email" required maxLength={254} className={fieldClass} onChange={() => { requestKey.current = null }} /></label>
    <div className="rounded-xl bg-muted/40 p-5"><h3 className="font-semibold">Cancellation & refund terms</h3><p className="mt-3 whitespace-pre-wrap text-sm text-muted-foreground">{offer.cancellation_terms}</p><p className="mt-3 text-sm text-muted-foreground">For assistance or a cancellation request, email hello@veyra.ie with your booking reference. Refunds are subject to these terms and applicable consumer rights.</p></div>
    <label className="flex items-start gap-3 text-sm"><input name="acceptTerms" type="checkbox" required className="mt-0.5 size-5 shrink-0 accent-[#00D38A]" /><span>I accept the cancellation terms above and understand my booking details will be shared with {offer.provider.business_name} to deliver this experience.</span></label>
    <div className="flex flex-wrap items-center justify-between gap-5 border-t border-border pt-5"><p className="text-xl font-bold">{Number.isInteger(guests) && guests > 0 ? formatMoney((memberPrice?.unitAmount ?? offer.unit_amount) * (offer.pricing_mode === 'per_person' ? guests : 1), offer.currency) : 'Choose guests'} <span className="text-sm font-normal text-muted-foreground">total · no added booking fee</span></p><button disabled={busy} className={buttonClass}>{busy ? 'Reserving your session…' : 'Continue to secure payment'}</button></div><p className="text-xs text-muted-foreground">Availability is checked when you continue. No account or app is required. Your card details stay with Stripe.</p>
  </form>
}
