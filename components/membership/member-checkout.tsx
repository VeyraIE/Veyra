'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { buttonClass, secondaryClass } from '@/components/marketplace/presentation'

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) : null

export function MemberCheckout({ active, hasSubscription, canManage, available, returning }: { active: boolean; hasSubscription: boolean; canManage: boolean; available: boolean; returning: boolean }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [secret, setSecret] = useState<string | null>(null)
  const submitting = useRef(false)
  useEffect(() => {
    if (!returning || active) return
    let attempts = 0
    const timer = window.setInterval(async () => {
      if (++attempts > 12) { window.clearInterval(timer); setMessage('Payment verification is taking longer than expected. Contact hello@veyra.ie before paying again.'); return }
      try {
        const response = await fetch('/api/membership', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'status' }) })
        const result = await response.json()
        if (response.ok && result.status === 'active' && Date.parse(result.paidUntil ?? '') > Date.now()) { window.clearInterval(timer); router.refresh() }
      } catch { }
    }, 5000)
    return () => window.clearInterval(timer)
  }, [active, returning, router])
  async function request(action: string, acceptRecurring = false) {
    if (submitting.current) return
    submitting.current = true
    setBusy(true)
    setMessage('')
    try {
      const response = await fetch('/api/membership', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action, acceptRecurring }) })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Could not complete this request.')
      if (result.url) window.location.assign(result.url)
      else if (result.clientSecret) setSecret(result.clientSecret)
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Please retry.') }
    finally { setBusy(false); submitting.current = false }
  }
  return <div className="mt-6 space-y-5">
    {message && <p role="alert" className="rounded-xl border border-primary/50 p-4 text-sm">{message}</p>}
    {returning && !active && <p role="status" className="text-sm text-muted-foreground">We’re verifying your subscription. Benefits unlock only after payment confirmation. Please don’t subscribe again.</p>}
    {secret && stripePromise ? <div className="overflow-hidden rounded-2xl bg-white"><EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret: secret, onComplete: () => { setSecret(null); router.replace('/account?membership=return'); router.refresh() } }}><EmbeddedCheckout /></EmbeddedCheckoutProvider></div>
    : !active && !hasSubscription && !returning ? available ? <form className="space-y-5" onSubmit={event => { event.preventDefault(); const data = new FormData(event.currentTarget); request('checkout', data.get('recurring') === 'on') }}><label className="flex items-start gap-3 text-sm"><input name="recurring" type="checkbox" required className="mt-1 size-5 shrink-0 accent-[#00D38A]" /><span>I agree to pay €4.99 every month until I cancel. I can cancel through Manage billing; access continues until the paid period ends. Offers are limited to participating providers and venues, subject to their published terms.</span></label><button className={buttonClass} disabled={busy}>{busy ? 'Preparing checkout…' : 'Subscribe for €4.99/month'}</button></form>
    : <p className="text-sm text-muted-foreground">Your account is ready. Paid membership is not open yet while payment setup and the first genuine partner offers are being prepared. You have not been charged.</p> : null}
    {canManage && <button className={secondaryClass} disabled={busy} onClick={() => request('portal')}>Manage billing & cancellation</button>}
  </div>
}
