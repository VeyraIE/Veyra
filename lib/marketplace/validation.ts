import { z } from 'zod'

export const applicationSchema = z.object({
  businessName: z.string().trim().min(2).max(150),
  county: z.string().trim().min(2).max(80),
  description: z.string().trim().min(20).max(3000),
})

export const offerSchema = z.object({
  title: z.string().trim().min(3).max(140),
  description: z.string().trim().min(30).max(5000),
  county: z.string().trim().min(2).max(80),
  category: z.enum(['wellness', 'adventure', 'fitness', 'learning', 'family']),
  price: z.string().regex(/^\d{1,6}(\.\d{1,2})?$/).transform(value => Math.round(Number(value) * 100)).refine(value => value >= 50 && value <= 10000000),
  pricingMode: z.enum(['per_person', 'per_group']),
  maxGuests: z.coerce.number().int().min(1).max(100),
  startsAt: z.string().datetime({ offset: true }).refine(value => Date.parse(value) > Date.now() + 3600000),
  capacity: z.coerce.number().int().min(1).max(10000),
  cancellationTerms: z.string().trim().min(10).max(3000),
  publish: z.boolean(),
})

export const checkoutSchema = z.object({
  offerId: z.string().uuid(),
  slotId: z.string().uuid(),
  requestKey: z.string().uuid(),
  guests: z.coerce.number().int().min(1).max(100),
  name: z.string().trim().min(2).max(150),
  email: z.string().trim().email().max(254).transform(value => value.toLowerCase()),
  acceptTerms: z.literal(true),
})

export function formatMoney(amount: number, currency = 'eur') {
  return new Intl.NumberFormat('en-IE', { style: 'currency', currency }).format(amount / 100)
}

export function formatSession(startsAt: string) {
  return new Intl.DateTimeFormat('en-IE', { timeZone: 'Europe/Dublin', dateStyle: 'medium', timeStyle: 'short' }).format(new Date(startsAt))
}
