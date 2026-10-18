import 'server-only'
import { marketplaceDatabase } from './server'

export type BookableOffer = {
  id: string; slug: string; title: string; description: string; county: string; category: string;
  image_url: string; unit_amount: number; currency: string; pricing_mode: 'per_person' | 'per_group';
  max_guests: number; cancellation_terms: string; provider: { business_name: string };
  slots: { id: string; starts_at: string; capacity: number }[];
}

export async function getBookableOffers(): Promise<BookableOffer[]> {
  try {
    const { data, error } = await marketplaceDatabase().from('veyra_marketplace_offers')
      .select('id,slug,title,description,county,category,image_url,unit_amount,currency,pricing_mode,max_guests,cancellation_terms,provider:veyra_marketplace_providers!inner(business_name,approval_status,payments_ready),slots:veyra_marketplace_slots(id,starts_at,capacity,active)')
      .eq('active', true).eq('provider.approval_status', 'approved').eq('provider.payments_ready', true)
      .order('created_at', { ascending: false })
    if (error) return []
    return (data ?? []).map(item => ({ ...item, slots: item.slots.filter(slot => slot.active && Date.parse(slot.starts_at) > Date.now() + 3600000).sort((first, second) => Date.parse(first.starts_at) - Date.parse(second.starts_at)) }))
      .filter(item => item.slots.length > 0) as unknown as BookableOffer[]
  } catch {
    return []
  }
}

export async function getBookableOffer(slug: string) {
  return (await getBookableOffers()).find(offer => offer.slug === slug) ?? null
}
