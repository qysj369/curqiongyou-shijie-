import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import BrandLogo from './BrandLogo'
import { useToast } from '../contexts/ToastContext'
import { useMinimalUi } from '../contexts/MinimalUiContext'
import { readAutoLocateEnabled, writeAutoLocateEnabled } from '../lib/homeAutoLocatePreference.js'
import {
  readHomeClassicLayoutEnabled,
  writeHomeClassicLayoutEnabled,
} from '../lib/homeClassicLayoutPreference.js'

/**
 * 极简「更多」：仅穷游延伸工具与品牌说明，不堆功能、不做导购式入口。
 */
export default function MoreMenuDrawer({ open, onClose }) {
  const { t } = useTranslation()
  const { toast } = useToast()
  const { minimal, toggleMinimal } = useMinimalUi()
  const navigate = useNavigate()
  const location = useLocation()
  const [autoLocateOn, setAutoLocateOn] = useState(() => readAutoLocateEnabled())
  const [classicHome, setClassicHome] = useState(() => readHomeClassicLayoutEnabled())

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    setAutoLocateOn(readAutoLocateEnabled())
    setClassicHome(readHomeClassicLayoutEnabled())
  }, [open])

  if (!open) return null

  const rowClass =
    'block rounded-xl px-3 py-3 text-[15px] font-medium text-slate-800 transition hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-slate-800'

  return (
    <div className="fixed inset-0 z-[60] flex justify-end" role="dialog" aria-modal="true" aria-label={t('common.moreMenuTitle')}>
      <button type="button" className="absolute inset-0 bg-slate-900/50" aria-label={t('a11y.closeMenu')} onClick={onClose} />
      <div className="relative z-[61] flex h-full w-full max-w-sm flex-col overflow-y-auto bg-white shadow-xl dark:bg-slate-900">
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-4 py-4 dark:border-slate-800">
          <div className="min-w-0">
            <BrandLogo size="sm" className="justify-start" />
            <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{t('footer.missionShort')}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-10 min-w-10 shrink-0 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label={t('a11y.closeMenu')}
          >
            <span className="text-xl" aria-hidden>
              ✕
            </span>
          </button>
        </div>

        <div className="flex-1 space-y-6 px-4 py-5 text-sm">
          <section>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {t('common.moreGroupHome')}
            </p>
            <ul className="space-y-1">
              <li>
                <button
                  type="button"
                  className={`${rowClass} w-full text-left`}
                  aria-pressed={minimal}
                  onClick={() => {
                    toggleMinimal()
                    onClose()
                  }}
                >
                  {minimal ? t('minimalUi.meToggleToOff') : t('minimalUi.meToggleToOn')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`${rowClass} w-full text-left`}
                  aria-pressed={autoLocateOn}
                  onClick={() => {
                    const next = !readAutoLocateEnabled()
                    writeAutoLocateEnabled(next)
                    setAutoLocateOn(next)
                    toast(next ? t('home.autoLocateEnabled') : t('home.autoLocateDisabled'))
                  }}
                >
                  {autoLocateOn ? t('home.autoLocateOn') : t('home.autoLocateOff')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`${rowClass} w-full text-left`}
                  aria-pressed={classicHome}
                  onClick={() => {
                    const next = !readHomeClassicLayoutEnabled()
                    writeHomeClassicLayoutEnabled(next)
                    setClassicHome(next)
                    toast(next ? t('home.classicLayoutOn') : t('home.classicLayoutOff'))
                    onClose()
                    if (next && (location.pathname === '/' || location.pathname === '/map')) {
                      navigate({ pathname: location.pathname, search: '?classic=1' }, { replace: true })
                    }
                  }}
                >
                  {classicHome ? t('home.classicLayoutOnLabel') : t('home.classicLayoutOffLabel')}
                </button>
              </li>
            </ul>
          </section>

          <section>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {t('common.moreGroupTools')}
            </p>
            <ul className="space-y-1">
              <li>
                <Link to="/map-hub" className={rowClass} onClick={onClose}>
                  {t('common.navMapHub')}
                </Link>
              </li>
              <li>
                <Link to="/plan" className={rowClass} onClick={onClose}>
                  {t('common.navPlanHub')}
                </Link>
              </li>
              <li>
                <Link to="/library" className={rowClass} onClick={onClose}>
                  {t('common.navLibrary')}
                </Link>
              </li>
              <li>
                <Link to="/steward" className={rowClass} onClick={onClose}>
                  {t('common.navSteward')}
                </Link>
              </li>
            </ul>
          </section>

          <section>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {t('common.moreGroupCommunity')}
            </p>
            <ul className="space-y-1">
              <li>
                <Link to="/community" className={rowClass} onClick={onClose}>
                  {t('common.navCommunity')}
                </Link>
              </li>
              <li>
                <Link to="/board" className={rowClass} onClick={onClose}>
                  {t('common.navBoard')}
                </Link>
              </li>
            </ul>
          </section>

          <section>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {t('common.moreGroupBrand')}
            </p>
            <ul className="space-y-1">
              <li>
                <Link to="/about" className={rowClass} onClick={onClose}>
                  {t('common.navAbout')}
                </Link>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
