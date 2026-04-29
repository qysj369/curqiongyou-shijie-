import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'roamwise-show-usd-approx'
/** 同标签页内多组件实例同步（storage 事件仅在其它标签页触发） */
const SYNC_EVENT = 'roamwise-show-usd-approx-changed'

function readStored() {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v === 'true') return true
    if (v === 'false') return false
    return null
  } catch {
    return null
  }
}

function writeStored(value) {
  try {
    localStorage.setItem(STORAGE_KEY, value ? 'true' : 'false')
    window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: value }))
  } catch {
    /* ignore quota / private mode */
  }
}

function defaultFromLanguage(lng) {
  return lng === 'en' || (typeof lng === 'string' && lng.startsWith('en'))
}

/**
 * 美元估算显示：有本地记录则尊重用户选择，否则随界面语言默认（英文开、中文关）。
 */
export function useUsdApproxPreference(i18nLanguage) {
  const [showUsdApprox, setShowUsdApprox] = useState(() => {
    const stored = readStored()
    if (stored !== null) return stored
    return defaultFromLanguage(i18nLanguage)
  })

  useEffect(() => {
    const stored = readStored()
    if (stored !== null) {
      setShowUsdApprox(stored)
      return
    }
    setShowUsdApprox(defaultFromLanguage(i18nLanguage))
  }, [i18nLanguage])

  useEffect(() => {
    const applyRaw = (raw) => {
      if (raw === 'true') {
        setShowUsdApprox(true)
        return
      }
      if (raw === 'false') {
        setShowUsdApprox(false)
        return
      }
      const stored = readStored()
      if (stored !== null) {
        setShowUsdApprox(stored)
        return
      }
      setShowUsdApprox(defaultFromLanguage(i18nLanguage))
    }

    const onStorage = (e) => {
      if (e.storageArea !== localStorage || e.key !== STORAGE_KEY) return
      applyRaw(e.newValue)
    }

    const onSync = (e) => {
      if (typeof e.detail === 'boolean') setShowUsdApprox(e.detail)
    }

    window.addEventListener('storage', onStorage)
    window.addEventListener(SYNC_EVENT, onSync)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener(SYNC_EVENT, onSync)
    }
  }, [i18nLanguage])

  const toggleUsdApprox = useCallback(() => {
    setShowUsdApprox((prev) => {
      const next = !prev
      writeStored(next)
      return next
    })
  }, [])

  return [showUsdApprox, toggleUsdApprox]
}
