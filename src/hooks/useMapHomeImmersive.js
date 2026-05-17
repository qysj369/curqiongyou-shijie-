import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * 移动端 `/` `/map`：高德式全屏地图首页（与桌面端「长首页」区分）。
 * 设置 `VITE_MAP_HOME_IMMERSIVE=0` 可关闭沉浸式，始终使用经典首页布局。
 */
export function useMapHomeImmersive() {
  const { pathname } = useLocation()
  const envOff = import.meta.env.VITE_MAP_HOME_IMMERSIVE === '0'
  const [narrow, setNarrow] = useState(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false
    return window.matchMedia('(max-width: 767px)').matches
  })

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return
    const mq = window.matchMedia('(max-width: 767px)')
    const fn = () => setNarrow(mq.matches)
    fn()
    mq.addEventListener('change', fn)
    return () => mq.removeEventListener('change', fn)
  }, [])

  const mapPaths = pathname === '/' || pathname === '/map'
  return !envOff && narrow && mapPaths
}
