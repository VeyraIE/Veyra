'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { buttonClass, secondaryClass, fieldClass } from './presentation'
import { formatMoney, formatSession } from '@/lib/marketplace/validation'

type Provider = { id: string; business_name: string; description: string; county: string; approval_status: string; commission_bps: number | null }
type Booking = { id: string; title: string; status: string; customer_name: string; customer_email: string; total_amount: number; application_fee: number; starts_at: string }

export function AdminPanel({ providers, bookings, paymentSetup }: { providers: Provider[]; bookings: Booking[]; paymentSetup: boolean }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  async function perform(body: Record<string, unknown>) {
    if (busy) return
    setBusy(true)
    setMessage('')
    try {
      const response = await fetch('/api/marketplace/admin', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Could not complete request.')
      setMessage('Saved successfully.')
      router.refresh()
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Please retry.') }
    finally { setBusy(false) }
  }
  return <div className="space-y-10">{message && <p role="status" className="rounded-xl border border-primary/50 p-4">{message}</p>}<p className="text-sm text-muted-foreground">Payment configuration: {paymentSetup ? 'Present — end-to-end verification still required before launch' : 'Incomplete — checkout is disabled'}. Veyra receives the charge and retains the agreed commission. Stripe processing fees and applicable Connect costs are borne by Veyra.</p><section><h2 className="mb-5 text-2xl font-bold">Provider applications & commission</h2><p className="mb-5 text-sm text-muted-foreground">Agree commercial terms with each provider before approval. Changing commission affects new reservations only. No default rate is assumed.</p><div className="space-y-5">{providers.length === 0 && <p>No provider applications yet.</p>}{providers.map(provider => <article key={provider.id} className="rounded-2xl border border-border p-6"><h3 className="text-xl font-bold">{provider.business_name}</h3><p className="mt-2 text-sm text-primary">{provider.county} · {provider.approval_status}</p><p className="mt-3 whitespace-pre-wrap text-sm text-muted-foreground">{provider.description}</p><form className="mt-5 flex flex-wrap items-end gap-3" onSubmit={event => { event.preventDefault(); const data = new FormData(event.currentTarget); perform({ action: 'review-provider', providerId: provider.id, approved: true, commissionPercent: data.get('commissionPercent') }) }}><label className="text-sm">Agreed Veyra commission %<input name="commissionPercent" type="number" min="0" max="99" step="0.01" required defaultValue={provider.commission_bps === null ? '' : provider.commission_bps / 100} className={fieldClass} /></label><button className={buttonClass} disabled={busy}>Approve / update terms</button><button type="button" disabled={busy} className={secondaryClass} onClick={() => { if (window.confirm('Reject or suspend this provider? Existing paid bookings are not canceled.')) perform({ action: 'review-provider', providerId: provider.id, approved: false, commissionPercent: provider.commission_bps === null ? 0 : provider.commission_bps / 100 }) }}>Reject / suspend</button></form></article>)}</div></section><section><h2 className="mb-5 text-2xl font-bold">Payments & refunds</h2><p className="mb-5 text-sm text-muted-foreground">Full refunds reverse the provider transfer and return Veyra’s commission. Stripe fees may not be returned. Only refund after checking the provider’s cancellation terms.</p><div className="space-y-4">{bookings.length === 0 && <p>No payment records yet.</p>}{bookings.map(booking => <article key={booking.id} className="rounded-2xl border border-border p-6"><h3 className="font-bold">{booking.title}</h3><p className="mt-2 text-sm">{formatSession(booking.starts_at)} · {booking.status.replaceAll('_', ' ')}</p><p className="mt-2 break-words text-sm text-muted-foreground">{booking.customer_name} · {booking.customer_email}</p><p className="mt-2 text-sm">{formatMoney(booking.total_amount)} total · {formatMoney(booking.application_fee)} commission</p><p className="mt-2 break-all text-xs text-muted-foreground">Reference {booking.id}</p>{booking.status === 'confirmed' && <button className={secondaryClass + ' mt-4'} disabled={busy} onClick={() => { if (window.confirm('Issue a full refund of ' + formatMoney(booking.total_amount) + '? This reverses the provider transfer and commission.')) perform({ action: 'refund', reservationId: booking.id }) }}>Issue full refund</button>}{booking.status === 'held' && <p className="mt-3 text-xs text-muted-foreground">Not confirmed. Reconcile with Stripe before releasing capacity. Never mark paid manually.</p>}</article>)}</div></section></div>
}
