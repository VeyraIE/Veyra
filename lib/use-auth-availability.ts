'use client'

import { useCallback, useEffect, useState } from 'react'

type Availability = { available: boolean; email: boolean; signup?: boolean; google: boolean; apple: boolean; message: string }

export function useAuthAvailability() {
  const [status, setStatus] = useState<Availability | null>(null)
  const [attempt, setAttempt] = useState(0)
  const retry = useCallback(() => { setStatus(null); setAttempt(value => value + 1) }, [])
  useEffect(() => {
    const controller = new AbortController()
    fetch('/api/auth/status', { signal: controller.signal, cache: 'no-store' })
      .then(response => response.json())
      .then(result => { if (!controller.signal.aborted) setStatus(result) })
      .catch(() => { if (!controller.signal.aborted) setStatus({ available: false, email: false, google: false, apple: false, message: 'We could not check the account service. Please retry or contact hello@veyra.ie.' }) })
    return () => controller.abort()
  }, [attempt])
  return { status, retry }
}
