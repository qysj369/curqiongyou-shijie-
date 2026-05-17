import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

/**
 * 离线时提示：地图瓦片与 AI 需联网；本地 dev 仍可浏览攻略与预算工具。
 */
export default function NetworkStatusBanner() {
  const { t } = useTranslation()
  const [offline, setOffline] = useState(() =>
    typeof navigator !== 'undefined' ? navigator.onLine === false : false,
  )

  useEffect(() => {
    const onOnline = () => setOffline(false)
    const onOffline = () => setOffline(true)
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)
    return () => {
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
    }
  }, [])

  if (!offline) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="border-b border-slate-300 bg-slate-800 px-4 py-2 text-center text-xs font-medium text-slate-100 dark:border-slate-700 dark:bg-slate-900"
    >
      {t('common.offlineBanner')}
    </div>
  )
}
