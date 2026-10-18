import { PageShell } from '@/components/veyra/site-shell'

export const metadata = { title: 'Your enquiry & privacy' }

export default function PrivacyPage() {
  return <PageShell><article className="v-wrap v-prose"><span className="v-eyebrow">Your information</span><h1>A personal service.<br /><em>A considered approach.</em></h1><h2>When you make an enquiry</h2><p>The enquiry form prepares an email on your device. Its contents are not submitted to a Veyra database. You choose whether to send the email to hello@veyra.ie using your own email service.</p><h2>What to include</h2><p>Share your name, reply address and the information we need to understand your request. Please avoid including payment details or sensitive personal information in an initial enquiry.</p><h2>How we use it</h2><p>Information you email to Veyra is used to respond to your request and discuss arrangements. Any details needed by a provider to deliver an experience should be agreed with you during that conversation. Enquiring does not sign you up to marketing.</p><h2>Questions or requests</h2><p>Contact <a href="mailto:hello@veyra.ie">hello@veyra.ie</a> if you have a question about your enquiry or want to request access, correction or deletion of information you have shared.</p></article></PageShell>
}

