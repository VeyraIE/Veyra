const destinations = ['/account', '/provider/dashboard', '/provider/onboarding', '/admin/marketplace', '/dashboard']

export function authDestination(value: string | null | undefined, fallback = '/account') {
  return destinations.includes(value ?? '') ? value! : fallback
}
