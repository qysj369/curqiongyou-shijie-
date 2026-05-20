import { useEffect, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import {
  readHomeClassicLayoutEnabled,
  HOME_CLASSIC_LAYOUT_CHANGED,
} from '../lib/homeClassicLayoutPreference.js'

/**
 * 移动端 `/` `/map`：高德式全屏地图首页（与桌面端「长首页」区分）。
 * 设置 `VITE_MAP_HOME_IMMERSIVE=0` 可关闭沉浸式，始终使用经典首页布局。
 * 用户可在「更多」中切到经典首页，或访问 `/?classic=1`。
 */
export function useMapHomeImmersive() {
  const { pathname } = useLocation()
  const [searchParams] = useSearchParams()
  const envOff = import.meta.env.VITE_MAP_HOME_IMMERSIVE === '0'
  const [narrow, setNarrow] = useState(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false
    return window.matchMedia('(max-width: 767px)').matches
  })
  const [classicLayout, setClassicLayout] = useState(readHomeClassicLayoutEnabled)

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return
    const mq = window.matchMedia('(max-width: 767px)')
    const fn = () => setNarrow(mq.matches)
    fn()
    mq.addEventListener('change', fn)
    return () => mq.removeEventListener('change', fn)
  }, [])

  useEffect(() => {
    if (searchParams.get('classic') === '1' || searchParams.get('layout') === 'classic') {
      try {
        window.sessionStorage.setItem('roamwise-home-classic-v1', '1')
      } catch {
        /* noop */
      }
      setClassicLayout(true)
    }
  }, [searchParams])

  useEffect(() => {
    const sync = () => setClassicLayout(readHomeClassicLayoutEnabled())
    window.addEventListener(HOME_CLASSIC_LAYOUT_CHANGED, sync)
    return () => window.removeEventListener(HOME_CLASSIC_LAYOUT_CHANGED, sync)
  }, [])

  const mapPaths = pathname === '/' || pathname === '/map'
  const forceClassic =
    classicLayout ||
    searchParams.get('classic') === '1' ||
    searchParams.get('layout') === 'classic'

  /** 默认使用设计稿经典首页；仅 `?immersive=1` 时移动端全屏地图首屏 */
  const forceImmersive = searchParams.get('immersive') === '1'
  return !envOff && narrow && mapPaths && forceImmersive && !forceClassic
}
