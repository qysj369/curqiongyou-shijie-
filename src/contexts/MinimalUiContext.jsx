import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const STORAGE_KEY = 'roamwise:minimal-ui-v1'
const CHANGE_EVENT = 'roamwise:minimal-ui-changed'

function readMinimalFromStorage() {
  if (typeof window === 'undefined') return false
  try {
    return window.localStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

const MinimalUiContext = createContext({
  minimal: false,
  setMinimal: (_v) => {},
  toggleMinimal: () => {},
})

export function MinimalUiProvider({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [minimal, setMinimalState] = useState(readMinimalFromStorage)

  const setMinimal = useCallback((value) => {
    const next = Boolean(value)
    setMinimalState(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next ? '1' : '0')
    } catch {
      /* noop */
    }
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT))
  }, [])

  const toggleMinimal = useCallback(() => {
    setMinimal(!minimal)
  }, [minimal, setMinimal])

  /** 快捷入口：/?minimal=1 或 ?m=1（任意路径一次生效后从地址栏移除） */
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    if (params.get('minimal') !== '1' && params.get('m') !== '1') return
    setMinimalState(true)
    try {
      window.localStorage.setItem(STORAGE_KEY, '1')
    } catch {
      /* noop */
    }
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT))
    params.delete('minimal')
    params.delete('m')
    const qs = params.toString()
    navigate({ pathname: location.pathname, search: qs ? `?${qs}` : '' }, { replace: true })
  }, [location.pathname, location.search, navigate])

  useEffect(() => {
    const sync = () => setMinimalState(readMinimalFromStorage())
    window.addEventListener(CHANGE_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(CHANGE_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  const value = useMemo(
    () => ({
      minimal,
      setMinimal,
      toggleMinimal,
    }),
    [minimal, setMinimal, toggleMinimal],
  )

  return <MinimalUiContext.Provider value={value}>{children}</MinimalUiContext.Provider>
}

export function useMinimalUi() {
  return useContext(MinimalUiContext)
}
