import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Hero } from '@/components/veyra/hero'
import { DiscoveryGrid } from '@/components/veyra/discovery-grid'
import { ProblemSection } from '@/components/veyra/problem-section'
import { FeaturedExperiences } from '@/components/veyra/featured-experiences'
import { TrustSystem } from '@/components/veyra/trust-system'
import { WeekendPlanner } from '@/components/veyra/weekend-planner'
import { ProvidersSection } from '@/components/veyra/providers-section'
import { AppPreview } from '@/components/veyra/app-preview'

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <Hero />
        <DiscoveryGrid />
        <ProblemSection />
        <FeaturedExperiences />
        <TrustSystem />
        <WeekendPlanner />
        <ProvidersSection />
        <AppPreview />
      </main>

      <Footer />
    </div>
  )
}
