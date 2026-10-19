'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { buttonClass, fieldClass, secondaryClass } from './presentation'
import { formatMoney, formatSession } from '@/lib/marketplace/validation'

type Provider = { id: string; business_name: string; approval_status: string; commission_bps: number | null; payments_ready: boolean; stripe_account_id: string | null }
type Offer = { id: string; slug: string; title: string; active: boolean; unit_amount: number; pricing_mode: string; slots: { id: string; starts_at: string; capacity: number }[] }
type Booking = { id: string; title: string; starts_at: string; guests: number; total_amount: number; application_fee: number; customer_name: string; customer_email: string; status: string }

export function ProviderPortal({ provider, offers, bookings, configured }: { provider: Provider | null; offers: Offer[]; bookings: Booking[]; configured: boolean }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  async function perform(body: Record<string, unknown>) {
    if (busy) return false
    setBusy(true)
    setMessage('')
    try {
      const response = await fetch('/api/marketplace/provider', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Could not complete this request.')
      if (result.url) window.location.assign(result.url)
      else { setMessage(result.ready === false ? 'Stripe still needs information. Complete payment setup, then check again.' : 'Saved successfully.'); router.refresh() }
      return true
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Please retry.'); return false }
    finally { setBusy(false) }
  }
  if (!configured) return <div className="rounded-2xl border border-border p-6"><h2 className="text-xl font-bold">Provider registration is being prepared</h2><p className="mt-3 text-muted-foreground">Veyra is setting up provider accounts and secure payments. Contact hello@veyra.ie to register your interest.</p></div>
  const approved = provider?.approval_status === 'approved'
  return <div className="space-y-8">
    {message && <p role="status" className="rounded-xl border border-primary/40 p-4 text-sm">{message}</p>}
    {!provider && <form className="max-w-2xl space-y-5 rounded-2xl border border-border p-6 sm:p-8" onSubmit={async event => { event.preventDefault(); const data = new FormData(event.currentTarget); await perform({ action: 'apply', ...Object.fromEntries(data.entries()) }) }}>
      <h2 className="text-2xl font-bold">Apply to become a provider</h2><p className="text-sm text-muted-foreground">We review every application before you can add services or accept payments. No listing or subscription fee is taken here.</p>
      <label className="block text-sm">Business name<input name="businessName" required minLength={2} maxLength={150} className={fieldClass} autoComplete="organization" /></label>
      <label className="block text-sm">County<input name="county" required minLength={2} maxLength={80} className={fieldClass} /></label>
      <label className="block text-sm">Tell us about your services<textarea name="description" required minLength={20} maxLength={3000} rows={5} className={fieldClass} /></label>
      <button className={buttonClass} disabled={busy}>Submit for approval</button>
    </form>}
    {provider && !approved && <section className="rounded-2xl border border-border p-8"><h2 className="text-2xl font-bold">{provider.approval_status === 'pending' ? 'Your application is under review' : 'Please contact the Veyra team'}</h2><p className="mt-3 text-muted-foreground">{provider.business_name} · {provider.approval_status === 'pending' ? 'Once approved, you can add your own services, prices and sessions.' : 'Your application was not approved. Email hello@veyra.ie to discuss it.'}</p></section>}
    {provider && approved && <>
      <section className="rounded-2xl border border-border p-6 sm:p-8"><h2 className="text-2xl font-bold">{provider.business_name}</h2><p className="mt-3 text-sm text-muted-foreground">Approved provider · Veyra commission: {((provider.commission_bps ?? 0) / 100).toFixed(2)}%. Your share is transferred to Stripe after payment. Bank payout timing is managed by Stripe.</p><p className="mt-3 text-sm">Payments: <strong className="text-primary">{provider.payments_ready ? 'Ready' : 'Setup required'}</strong></p><div className="mt-5 flex flex-wrap gap-3"><button disabled={busy} className={buttonClass} onClick={() => perform({ action: 'connect' })}>Set up / manage payments</button><button disabled={busy} className={secondaryClass} onClick={() => perform({ action: 'refresh-payments' })}>Check payment status</button>{provider.stripe_account_id && <button disabled={busy} className={secondaryClass} onClick={() => perform({ action: 'payout-dashboard' })}>View payouts</button>}</div></section>
      <form className="space-y-5 rounded-2xl border border-border p-6 sm:p-8" onSubmit={async event => { event.preventDefault(); const form = event.currentTarget; const data = new FormData(form); const local = String(data.get('startsAt')); if (!local || Number.isNaN(Date.parse(local))) { setMessage('Choose a valid session date.'); return }; if (await perform({ action: 'create-offer', ...Object.fromEntries(data.entries()), startsAt: new Date(local).toISOString(), publish: data.get('publish') === 'on' })) form.reset() }}>
        <h2 className="text-2xl font-bold">Add a service</h2><p className="text-sm text-muted-foreground">Set your price, session and cancellation policy. Enter times in your device’s local time; customers see Ireland time. Category imagery is supplied initially.</p>
        <div className="grid gap-5 md:grid-cols-2">
          <label className="block text-sm">Service title<input className={fieldClass} name="title" required minLength={3} maxLength={140} /></label>
          <label className="block text-sm">County<input className={fieldClass} name="county" required minLength={2} maxLength={80} /></label>
          <label className="block text-sm">Category<select className={fieldClass} name="category"><option value="wellness">Wellness & recovery</option><option value="adventure">Adventure</option><option value="fitness">Fitness & sport</option><option value="learning">Learning & workshops</option><option value="family">Family</option></select></label>
          <label className="block text-sm">Price in euro<input className={fieldClass} name="price" required type="number" min="0.50" max="100000" step="0.01" /></label>
          <label className="block text-sm">Price basis<select className={fieldClass} name="pricingMode"><option value="per_person">Per person</option><option value="per_group">Per group</option></select></label>
          <label className="block text-sm">Maximum guests per booking<input className={fieldClass} name="maxGuests" required type="number" min="1" max="100" /></label>
          <label className="block text-sm">First session · your local time<input className={fieldClass} name="startsAt" required type="datetime-local" /></label>
          <label className="block text-sm">Total guest capacity for this session<input className={fieldClass} name="capacity" required type="number" min="1" max="10000" /></label>
        </div>
        <label className="block text-sm">Description, location and what is included<textarea className={fieldClass} name="description" required minLength={30} maxLength={5000} rows={5} /></label>
        <label className="block text-sm">Cancellation and refund terms<textarea className={fieldClass} name="cancellationTerms" required minLength={10} maxLength={3000} rows={3} /></label>
        <label className="flex items-center gap-3 text-sm"><input type="checkbox" name="publish" disabled={!provider.payments_ready} className="size-5 accent-[#00D38A]" />Publish now (requires completed payment setup)</label>
        <button className={buttonClass} disabled={busy}>Save service & session</button>
      </form>
      <section><h2 className="mb-5 text-2xl font-bold">Your services</h2>{offers.length === 0 && <p className="text-muted-foreground">Your services will appear here once you add them.</p>}<div className="space-y-5">{offers.map(offer => <article key={offer.id} className="rounded-2xl border border-border p-6"><div className="flex flex-wrap items-start justify-between gap-4"><div><h3 className="text-xl font-bold">{offer.title}</h3><p className="mt-2 text-sm text-muted-foreground">{formatMoney(offer.unit_amount)} {offer.pricing_mode === 'per_person' ? 'per person' : 'per group'} · {offer.active ? 'Published' : 'Draft'}</p></div><button className={secondaryClass} disabled={busy || (!offer.active && !provider.payments_ready)} onClick={() => perform({ action: 'toggle-offer', offerId: offer.id, active: !offer.active })}>{offer.active ? 'Unpublish' : 'Publish'}</button></div><ul className="mt-4 space-y-2 text-sm text-muted-foreground">{offer.slots.map(slot => <li key={slot.id}>{formatSession(slot.starts_at)} (Ireland) · capacity {slot.capacity}</li>)}</ul><form className="mt-5 flex flex-wrap items-end gap-3" onSubmit={event => { event.preventDefault(); const data = new FormData(event.currentTarget); const local = String(data.get('startsAt')); if (local) perform({ action: 'add-slot', offerId: offer.id, startsAt: new Date(local).toISOString(), capacity: data.get('capacity') }) }}><label className="text-sm">Add a session · your local time<input name="startsAt" type="datetime-local" required className={fieldClass} /></label><label className="text-sm">Guest capacity<input name="capacity" type="number" required min="1" max="10000" className={fieldClass} /></label><button disabled={busy} className={secondaryClass}>Add session</button></form>{offer.active && <Link className="mt-4 inline-block text-sm text-primary" href={'/experiences/' + offer.slug}>View public listing →</Link>}</article>)}</div></section>
      <section><h2 className="mb-5 text-2xl font-bold">Bookings</h2><p className="mb-5 text-sm text-muted-foreground">Only verified payments appear here. Contact Veyra for cancellations or refunds.</p><div className="space-y-4">{bookings.length === 0 && <p className="text-muted-foreground">No paid bookings yet.</p>}{bookings.map(booking => <article key={booking.id} className="rounded-2xl border border-border p-5"><h3 className="font-bold">{booking.title}</h3><p className="mt-2 text-sm">{formatSession(booking.starts_at)} (Ireland) · {booking.guests} guests · {booking.status.replaceAll('_', ' ')}</p><p className="mt-2 break-words text-sm text-muted-foreground">{booking.customer_name} · {booking.customer_email}</p><p className="mt-2 text-sm text-primary">{formatMoney(booking.total_amount)} paid · {formatMoney(booking.application_fee)} commission · {formatMoney(booking.total_amount - booking.application_fee)} provider share before adjustments</p><p className="mt-2 break-all text-xs text-muted-foreground">Reference {booking.id}</p></article>)}</div></section>
    </>}
  </div>
}
