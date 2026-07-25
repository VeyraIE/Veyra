import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getActivitiesByCategory, getCategories, getCategory } from "@/lib/queries"
import { CategoryClient } from "./category-client"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategory(slug)

  if (!category) {
    return { title: "Category not found | Veyra" }
  }

  return {
    title: `${category.name} Activities in Ireland | Veyra`,
    description:
      category.description ??
      `Find ${category.name.toLowerCase()} activities, classes and clubs for all ages across Ireland.`,
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const category = await getCategory(slug)

  if (!category) {
    notFound()
  }

  const [activities, allCategories] = await Promise.all([
    getActivitiesByCategory(slug),
    getCategories(),
  ])

  const relatedCategories = allCategories
    .filter((c) => c.id !== category.id)
    .slice(0, 8)

  return (
    <CategoryClient
      category={category}
      activities={activities}
      relatedCategories={relatedCategories}
    />
  )
}
