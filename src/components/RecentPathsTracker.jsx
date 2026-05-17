import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { recordRecentPath } from '../lib/recentPaths.js'

/**
 * 将 pathname+search 写入本机最近访问列表，供「我的 → 历史」展示。
 */
export default function RecentPathsTracker() {
  const location = useLocation()

  useEffect(() => {
    recordRecentPath(`${location.pathname}${location.search || ''}`)
  }, [location.pathname, location.search])

  return null
}
