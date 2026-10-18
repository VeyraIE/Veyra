import { redirect } from 'next/navigation'

export default function ProviderOnboardingPage() {
  redirect('/request?type=provider')
}


