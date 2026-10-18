import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Check } from 'lucide-react'
import { PageShell } from '@/components/veyra/site-shell'
import { editImage, requestLink } from '@/lib/experience-edit'

export const metadata = { title: 'Partner with Veyra', description: 'Join Veyra’s Ireland launch as an experience provider or hotel partner. Thoughtful discovery and personal booking support.' }

export default function PartnersPage() {
  return <PageShell>
    <section className="v-wrap v-page-intro">
    <span className="v-eyebrow">For providers, hotels & good company</span>
    <h1>Let’s make more<br />
    <em>of the experience.</em>
    </h1>
    <p>We’re building a considered collection of Irish experiences.<br />Bring your local expertise. We’ll help the right people discover it.</p>
    </section>
    <section className="v-wrap v-partner-cards">
    <article id="providers">
    <Image unoptimized={false} sizes="(max-width: 760px) 100vw, 50vw" src={editImage('providers')} alt="An experience provider welcoming guests to a studio" width={800} height={650} />
    <div>
    <span className="v-eyebrow">Experience providers</span>
    <h2>You do something special.<br />
    <em>Let’s share it.</em>
    </h2>
    <p>From independent studios to outdoor guides and creative hosts, we’re looking for people who care about what they do.</p>
    <ul>{['Add services, prices and sessions after approval', 'Customers book and pay directly on Veyra', 'Agreed commission deducted before your payout'].map(item => <li key={item}>
    <Check size={16} />{item}</li>)}</ul>
    <Link href="/provider/onboarding" className="v-button">Become a provider partner <ArrowUpRight size={17} />
    </Link>
    </div>
    </article>
    <article id="hotels">
    <Image unoptimized={false} sizes="(max-width: 760px) 100vw, 50vw" src={editImage('exp-yoga')} alt="A peaceful Irish stay surrounded by nature" width={800} height={650} />
    <div>
    <span className="v-eyebrow">Hotels & stays</span>
    <h2>A lovely stay.<br />
    <em>An extraordinary visit.</em>
    </h2>
    <p>Give your guests a little more of Ireland with locally informed experiences and a dedicated point of contact for arrangements.</p>
    <ul>{['Thoughtful ideas for your guests', 'Concierge support for individual and group requests', 'A personal partnership for your property'].map(item => <li key={item}>
    <Check size={16} />{item}</li>)}</ul>
    <Link href={requestLink('hotel')} className="v-button">Explore a hotel partnership <ArrowUpRight size={17} />
    </Link>
    </div>
    </article>
    </section>
    <section className="v-wrap v-partner-note">
    <span className="v-eyebrow">Starting with the right people</span>
    <h2>Small beginnings.<br />
    <em>Shared standards.</em>
    </h2>
    <p>Our Ireland launch is personal and hands-on. We review every partnership enquiry and agree the details together, including how requests, confirmations and guest care will work.</p>
    </section>
    </PageShell>
}
