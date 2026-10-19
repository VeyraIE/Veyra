export function supabaseFetch(input: RequestInfo | URL, options?: RequestInit) {
  const timeout = AbortSignal.timeout(10000)
  const signal = options?.signal ? AbortSignal.any([options.signal, timeout]) : timeout
  return fetch(input, { ...options, signal })
}
