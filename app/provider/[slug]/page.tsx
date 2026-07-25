import type { Metadata } from "next"
import { notFound } from "next/navigation"
import {
  getProvider,
  getProviderActivities,
  getProviderReviews,
} from "@/lib/queries"
import ProviderClient from "./provider-client"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const provider = await getProvider(slug)

  if (!provider) {
    return { title: "Provider not found | Veyra" }
  }

  return {
    title: `${provider.business_name} | Veyra`,
    description:
      provider.description?.slice(0, 155) ??
      `Activities and classes from ${provider.business_name} in ${provider.county}.`,
    openGraph: {
      title: provider.business_name,
      description: provider.description ?? undefined,
      images: provider.cover_image_url ? [provider.cover_image_url] : undefined,
    },
  }
}

export default async function ProviderPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const provider = await getProvider(slug)

  if (!provider) {
    notFound()
  }

  const [providerActivities, providerReviews] = await Promise.all([
    getProviderActivities(provider.id),
    getProviderReviews(provider.id),
  ])

  return (
    <ProviderClient
      provider={provider}
      providerActivities={providerActivities}
      providerReviews={providerReviews}
    />
  )
}
