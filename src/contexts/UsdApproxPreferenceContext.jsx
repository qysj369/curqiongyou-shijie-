import { createContext, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useUsdApproxPreference } from '../hooks/useUsdApproxPreference'

const UsdApproxPreferenceContext = createContext(null)

export function UsdApproxPreferenceProvider({ children }) {
  const { i18n } = useTranslation()
  const [showUsdApprox, toggleUsdApprox] = useUsdApproxPreference(i18n.language)

  return (
    <UsdApproxPreferenceContext.Provider value={{ showUsdApprox, toggleUsdApprox }}>
      {children}
    </UsdApproxPreferenceContext.Provider>
  )
}

export function useUsdApproxDisplay() {
  const ctx = useContext(UsdApproxPreferenceContext)
  if (!ctx) {
    throw new Error('useUsdApproxDisplay must be used within UsdApproxPreferenceProvider')
  }
  return ctx
}
