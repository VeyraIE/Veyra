'use client'

import { useState } from 'react'
import type { FormEvent } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Check, Copy, Mail } from 'lucide-react'
import { PageShell } from './site-shell'
import { experiences } from '@/lib/experience-edit'

const requestTypes = [{ value: 'concierge', label: 'Plan with a concierge' }, { value: 'experience', label: 'Enquire about an experience' }, { value: 'provider', label: 'Become a provider partner' }, { value: 'hotel', label: 'Explore a hotel partnership' }]

export function RequestForm({ initialType = 'concierge', experienceSlug, reference }: { initialType?: string; experienceSlug?: string; reference?: string }) {
  const [type, setType] = useState(requestTypes.some(item => item.value === initialType) ? initialType : 'concierge')
  const selectedExperience = experiences.find(item => item.slug === experienceSlug)
  const [draft, setDraft] = useState<{ subject: string; body: string } | null>(null)
  const [copied, setCopied] = useState(false)
  const partnership = type === 'provider' || type === 'hotel'
  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const subject = `Veyra · ${requestTypes.find(item => item.value === type)?.label}${type === 'experience' && selectedExperience ? ` · ${selectedExperience.title}` : ''}`
    const body = [`Hello Veyra,`, '', `I’d like to ${requestTypes.find(item => item.value === type)?.label.toLowerCase()}.`, '', `Name: ${data.get('name')}`, `Reply email: ${data.get('email')}`, ...(partnership ? [`Business / property: ${data.get('business')}`, `Website: ${data.get('website') || 'Not provided'}`] : [`Experience: ${data.get('experience') || 'Open to ideas'}`, `Preferred date: ${data.get('date') || 'Flexible'}`, `Guests: ${data.get('guests')}`, `Budget: ${data.get('budget') || 'To discuss'}`]), `Location: ${data.get('location') || 'Open to suggestions'}`, '', 'A little more about my plans:', `${data.get('details')}`, '', 'I understand this is an enquiry, not a confirmed booking.'].join('\n')
    setDraft({ subject, body })
    setCopied(false)
  }
  async function copyDraft() {
    if (!draft) return
    try { await navigator.clipboard.writeText(`Subject: ${draft.subject}\n\n${draft.body}`); setCopied(true) } catch { setCopied(false) }
  }
  return (
    <PageShell>
      <section className="v-wrap v-request-layout">
        <div className="v-request-intro">
          <span className="v-eyebrow">Every good plan starts here</span>
          <h1>Tell us a little.<br /><em>We’ll take it<br />from there.</em></h1>
          <p>Whether you have the whole day pictured or just the beginning of an idea, we’d love to hear it.</p>
          <div className="v-request-promise">
            <span><Check size={16} /> A personal conversation</span>
            <span><Check size={16} /> No account or app needed</span>
            <span><Check size={16} /> Pricing agreed before you commit</span>
          </div>
          <a href="mailto:hello@veyra.ie" className="v-underlined">Prefer to write directly? <ArrowUpRight size={16} /></a>
        </div>
        <div className="v-request-panel">
          {!draft ? (
            <form onSubmit={prepare}>
              <h2>Start something good.</h2>
              <p className="v-form-intro">Prepare an enquiry, then send it to our team by email.</p>
              <label>
                I’d like to
                <select value={type} onChange={event => setType(event.target.value)} name="type">
                  {requestTypes.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}
                </select>
              </label>
              <div className="v-form-grid">
                <label>Your name<input name="name" autoComplete="name" required maxLength={100} placeholder="Full name" /></label>
                <label>Email address<input name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@example.com" /></label>
              </div>
              {partnership ? (
                <>
                  <label>
                    {type === 'hotel' ? 'Hotel or property name' : 'Business name'}
                    <input name="business" required maxLength={150} placeholder="The name of your business" />
                  </label>
                  <label>Website <span>(optional)</span><input name="website" type="url" placeholder="https://" maxLength={300} /></label>
                </>
              ) : (
                <>
                  <label>
                    Experience or occasion
                    <input name="experience" defaultValue={selectedExperience?.title ?? reference?.slice(0, 200) ?? ''} placeholder="A coastal reset, a birthday, a weekend away…" maxLength={200} />
                  </label>
                  <div className="v-form-grid">
                    <label>Preferred date <span>(optional)</span><input type="date" name="date" min={new Date().toLocaleDateString('en-CA')} /></label>
                    <label>Number of guests<input type="number" name="guests" min={1} max={500} defaultValue={2} required /></label>
                  </div>
                  <label>
                    Budget <span>(optional)</span>
                    <select name="budget">
                      <option value="">Let’s discuss</option>
                      <option>Under €100 per person</option>
                      <option>€100–€250 per person</option>
                      <option>€250–€500 per person</option>
                      <option>€500+ per person</option>
                    </select>
                  </label>
                </>
              )}
              <label>
                {partnership ? 'Where are you based?' : 'Where in Ireland?'}
                <input name="location" placeholder="County, town, or open to ideas" maxLength={150} required={partnership} />
              </label>
              <label>
                {partnership ? 'Tell us about your business' : 'What would make it special?'}
                <textarea name="details" required rows={4} maxLength={2000} placeholder={partnership ? 'Your offering, your guests, and what you have in mind for a partnership…' : 'Interests, occasion, flexibility, and anything else you’d like us to know…'} />
              </label>
              <label className="v-consent">
                <input type="checkbox" required />
                <span>I agree to share these details with Veyra to respond to my enquiry. <Link href="/privacy">How we use your information</Link>.</span>
              </label>
              <button className="v-button" type="submit">Prepare my enquiry <ArrowUpRight size={18} /></button>
              <p className="v-form-note">Nothing is sent by this form. You’ll review your enquiry and send it from your email app. No payment is taken and no availability is reserved.</p>
            </form>
          ) : (
            <div className="v-draft" aria-live="polite">
              <span className="v-eyebrow">One more step</span>
              <h2>Your enquiry is ready.<br /><em>Let’s send it.</em></h2>
              <p>Open your email app to review and send your enquiry to <strong>hello@veyra.ie</strong>. It has not been sent yet.</p>
              <a href={'mailto:hello@veyra.ie?subject=' + encodeURIComponent(draft.subject) + '&body=' + encodeURIComponent(draft.body)} className="v-button">
                <Mail size={17} /> Open my email app <ArrowUpRight size={17} />
              </a>
              <button className="v-copy" onClick={copyDraft}><Copy size={15} />{copied ? 'Copied to clipboard' : 'Copy enquiry instead'}</button>
              <details>
                <summary>Review my enquiry</summary>
                <pre>{draft.body}</pre>
              </details>
              <p className="v-form-note">No email app? Copy the enquiry and send it using your usual email service. Your booking is confirmed only once our team has agreed the details with you.</p>
              <button className="v-underlined" onClick={() => setDraft(null)}>Start a new enquiry</button>
            </div>
          )}
        </div>
      </section>
    </PageShell>
  )
}
