import { useEffect, useState } from 'react'
import { client, sanityEnabled } from './sanity'

type State<T> = { data: T | null; loading: boolean; error: Error | null }

export function useSanityQuery<T>(query: string, params?: Record<string, unknown>): State<T> {
  const [state, setState] = useState<State<T>>({
    data: null,
    loading: sanityEnabled,
    error: null,
  })

  // Stable params key so callers can pass inline objects without causing loops.
  const paramsKey = params ? JSON.stringify(params) : ''

  useEffect(() => {
    if (!sanityEnabled || !client) {
      setState({ data: null, loading: false, error: null })
      return
    }
    let cancelled = false
    setState((s) => ({ ...s, loading: true }))
    client
      .fetch<T>(query, params ?? {})
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null })
      })
      .catch((error: unknown) => {
        if (!cancelled)
          setState({
            data: null,
            loading: false,
            error: error instanceof Error ? error : new Error(String(error)),
          })
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, paramsKey])

  return state
}
