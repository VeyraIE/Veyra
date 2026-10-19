'use client'

export function AuthServiceStatus({ status, retry, signup = false }: { status: { available: boolean; signup?: boolean; message: string } | null; retry: () => void; signup?: boolean }) {
  if (!status) return <p role="status" className="mb-5 text-sm text-muted-foreground">Checking account service…</p>
  if (status.available && (!signup || status.signup)) return null
  return <div role="alert" className="mb-5 rounded-xl border border-primary/40 bg-primary/5 p-4 text-sm"><p>{status.message}</p><button type="button" className="mt-3 font-semibold text-primary underline" onClick={retry}>Check again</button></div>
}
