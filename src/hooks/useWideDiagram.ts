import { useCallback, useState, useSyncExternalStore } from 'react'

export const WIDE_DIAGRAM_QUERY = '(min-width: 768px)'

export function useWideDiagram(): boolean {
  const [mediaQuery] = useState(() => (
    typeof window.matchMedia === 'function'
      ? window.matchMedia(WIDE_DIAGRAM_QUERY)
      : null
  ))
  const subscribe = useCallback((onChange: () => void) => {
    mediaQuery?.addEventListener('change', onChange)
    return () => mediaQuery?.removeEventListener('change', onChange)
  }, [mediaQuery])
  const getSnapshot = useCallback(() => mediaQuery?.matches ?? false, [mediaQuery])

  return useSyncExternalStore(subscribe, getSnapshot)
}
