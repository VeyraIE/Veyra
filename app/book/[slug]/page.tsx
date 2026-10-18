import { redirect } from 'next/navigation'

export default async function BookPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  redirect(`/request?type=experience&reference=${encodeURIComponent(slug)}`)
}


