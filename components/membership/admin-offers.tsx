'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { MemberOffer } from '@/lib/membership/server'
import { buttonClass, fieldClass, secondaryClass } from '@/components/marketplace/presentation'

export function AdminMemberOffers({ offers, services }: { offers: MemberOffer[]; services: { id: string; title: string }[] }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [kind, setKind] = useState('venue')
  async function save(body: Record<string, unknown>) {
    if (busy) return false
    setBusy(true)
    setMessage('')
    try {
      const response = await fetch('/api/admin/member-offers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Could not save this offer.')
      setMessage('Member offer saved.')
      router.refresh()
      return true
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Please retry.'); return false }
    finally { setBusy(false) }
  }
  return <div className="space-y-8">{message && <p role="status" className="rounded-xl border border-primary/40 p-4">{message}</p>}<form className="space-y-5 rounded-2xl border border-border p-6 sm:p-8" onSubmit={async event => { event.preventDefault(); const form = event.currentTarget; const data = new FormData(form); const ends = String(data.get('endsAt')); if (await save({ ...Object.fromEntries(data.entries()), endsAt: new Date(ends).toISOString(), active: data.get('active') === 'on', agreed: data.get('agreed') === 'on' })) form.reset() }}><h2 className="font-bold" style={{ fontSize: '1.6rem' }}>Add a genuine member offer</h2><p className="text-sm text-muted-foreground">Only publish benefits agreed with the provider or venue. No invented discount, redemption code or partner claim. Experience discounts reduce the booking price before Veyra’s commission is calculated; agree the impact on provider proceeds.</p><div className="grid gap-5 md:grid-cols-2"><label className="text-sm">Offer title<input name="title" required minLength={3} maxLength={140} className={fieldClass} /></label><label className="text-sm">Type<select name="kind" value={kind} onChange={event => setKind(event.target.value)} className={fieldClass}><option value="venue">Partner venue offer</option><option value="experience">Experience booking discount</option><option value="benefit">Member benefit</option></select></label><label className="text-sm">Provider / venue name<input name="venue" required minLength={2} maxLength={150} className={fieldClass} /></label><label className="text-sm">County<input name="county" required minLength={2} maxLength={80} className={fieldClass} /></label>{kind === 'experience' && <><label className="text-sm">Published experience<select name="offerId" required className={fieldClass}><option value="">Choose a service</option>{services.map(service => <option key={service.id} value={service.id}>{service.title}</option>)}</select></label><label className="text-sm">Agreed discount %<input name="discountPercent" type="number" min="0.01" max="99" step="0.01" required className={fieldClass} /></label></>}<label className="text-sm">Offer expires · your device’s local time<input name="endsAt" required type="datetime-local" className={fieldClass} /></label></div><label className="block text-sm">Public offer description and terms<textarea name="description" required minLength={10} maxLength={3000} rows={4} className={fieldClass} /></label><label className="block text-sm">Private redemption instructions · paid members only<textarea name="redemption" required minLength={10} maxLength={3000} rows={4} className={fieldClass} /></label><label className="flex items-start gap-3 text-sm"><input name="agreed" required type="checkbox" className="mt-1 size-5 shrink-0 accent-[#00D38A]" />I confirm this offer and its financial/redemption terms have been agreed with the named provider or venue.</label><label className="flex items-center gap-3 text-sm"><input name="active" type="checkbox" className="size-5 accent-[#00D38A]" />Publish this offer</label><button disabled={busy} className={buttonClass}>Save member offer</button></form><section><h2 className="mb-5 font-bold" style={{ fontSize: '1.6rem' }}>Offer management</h2><div className="space-y-4">{offers.length === 0 && <p className="text-muted-foreground">No member offers yet. Paid subscriptions remain unavailable until genuine offers are published.</p>}{offers.map(offer => <article key={offer.id} className="rounded-2xl border border-border p-5"><h3 style={{ fontSize: '1.3rem' }} className="font-bold">{offer.title}</h3><p className="mt-3 text-sm text-muted-foreground">{offer.venue} · {offer.county} · {offer.active ? 'Published' : 'Draft'} · expires {new Date(offer.ends_at).toLocaleDateString('en-IE', { timeZone: 'Europe/Dublin' })}</p><button className={secondaryClass + ' mt-4'} disabled={busy} onClick={() => save({ action: 'toggle', id: offer.id, active: !offer.active })}>{offer.active ? 'Unpublish' : 'Publish'}</button></article>)}</div></section></div>
}
