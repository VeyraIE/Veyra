import { RequestForm } from '@/components/veyra/request-form'

export const metadata = { title: 'Start something good', description: 'Enquire about an experience, plan with a personal concierge, or explore a provider or hotel partnership with Veyra.' }

export default async function RequestPage({ searchParams }: { searchParams: Promise<{ type?: string; experience?: string; reference?: string }> }) {
  const params = await searchParams
  return <RequestForm key={[params.type, params.experience, params.reference].join(':')} initialType={params.type} experienceSlug={params.experience} reference={params.reference} />
}

