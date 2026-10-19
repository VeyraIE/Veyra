import { PageShell } from '@/components/veyra/site-shell'

export default function Loading() {
  return <PageShell><section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8" aria-busy="true"><p role="status" className="text-sm text-muted-foreground">Loading Veyra…</p><div aria-hidden="true" className="mt-8 space-y-5 motion-safe:animate-pulse"><div className="h-10 max-w-lg rounded-xl bg-muted" /><div className="h-4 max-w-2xl rounded-lg bg-muted" /><div className="h-52 rounded-2xl border border-border bg-card" /></div></section></PageShell>
}
