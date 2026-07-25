import type { Metadata } from "next"
import { getActivities, getCategories } from "@/lib/queries"
import { DiscoverClient } from "./discover-client"

export const metadata: Metadata = {
  title: "Discover Activities | Veyra",
  description:
    "Browse kids' activities, sports clubs, classes and camps across Ireland. Filter by county, age, price and skill level to find the right fit for your family.",
}

export default async function DiscoverPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; county?: string; q?: string }>
}) {
  const params = await searchParams
  const [activities, categories] = await Promise.all([
    getActivities(),
    getCategories(),
  ])

  return (
    <DiscoverClient
      activities={activities}
      categories={categories}
      initialCategory={params.category ?? "all"}
      initialCounty={params.county ?? "all"}
      initialQuery={params.q ?? ""}
    />
  )
}
