import type { Metadata } from "next"
import { notFound } from "next/navigation"
import {
  getActivity,
  getActivityReviews,
  getSimilarActivities,
  getUpcomingSessions,
} from "@/lib/queries"
import { ActivityClient } from "./activity-client"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const activity = await getActivity(slug)

  if (!activity) {
    return { title: "Activity not found | Veyra" }
  }

  return {
    title: `${activity.title} | Veyra`,
    description:
      activity.short_description ??
      activity.description?.slice(0, 155) ??
      undefined,
    openGraph: {
      title: activity.title,
      description: activity.short_description ?? undefined,
      images: activity.cover_image ? [activity.cover_image] : undefined,
    },
  }
}

export default async function ActivityDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const activity = await getActivity(slug)

  if (!activity) {
    notFound()
  }

  const [reviews, sessions, similarActivities] = await Promise.all([
    getActivityReviews(activity.id),
    getUpcomingSessions(activity.id),
    getSimilarActivities(activity.category_id, activity.id),
  ])

  return (
    <ActivityClient
      activity={activity}
      reviews={reviews}
      sessions={sessions}
      similarActivities={similarActivities}
    />
  )
}
