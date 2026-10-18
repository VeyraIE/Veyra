'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export function BookingStatus({ reservationId }: { reservationId: string }) {
  const router = useRouter()
  const [message, setMessage] = useState('Checking your payment…')
  useEffect(() => {
    let stopped = false
    let attempts = 0
    const timer = window.setInterval(async () => {
      if (++attempts > 24) { window.clearInterval(timer); setMessage('Confirmation is taking longer than expected. Keep your reference and contact hello@veyra.ie. Do not pay again.'); return }
      try {
        const response = await fetch('/api/marketplace/status', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ reservationId }) })
        const result = await response.json()
        if (!stopped && response.ok && result.status !== 'held') { window.clearInterval(timer); router.refresh() }
      } catch { }
    }, 5000)
    return () => { stopped = true; window.clearInterval(timer) }
  }, [reservationId, router])
  return <p role="status" className="mt-5 text-sm text-muted-foreground">{message}</p>
}
