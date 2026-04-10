import { createContext, useContext, useMemo, useState, useCallback } from 'react'

const SeoOverrideContext = createContext(null)

export function SeoOverrideProvider({ children }) {
  const [override, setOverrideState] = useState(null)
  const setOverride = useCallback((next) => {
    setOverrideState(next && typeof next === 'object' ? next : null)
  }, [])
  const clear = useCallback(() => setOverrideState(null), [])
  const value = useMemo(() => ({ override, setOverride, clear }), [override, setOverride, clear])
  return <SeoOverrideContext.Provider value={value}>{children}</SeoOverrideContext.Provider>
}

export function useSeoOverride() {
  const ctx = useContext(SeoOverrideContext)
  if (!ctx) {
    return {
      override: null,
      setOverride: () => {},
      clear: () => {},
    }
  }
  return ctx
}
