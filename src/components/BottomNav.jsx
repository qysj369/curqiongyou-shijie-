import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

/**
 * @param {{ mapHomeImmersive?: boolean }} [props]
 */
export default function BottomNav({ mapHomeImmersive = false } = {}) {
  const { t } = useTranslation()
  const { pathname } = useLocation()

  const homeActive = pathname === '/' || pathname === '/map'
  const exploreActive =
    pathname === '/routes' ||
    pathname.startsWith('/routes/') ||
    pathname.startsWith('/articles/')
  const aiActive = pathname === '/trip-ai'
  const budgetActive = pathname === '/budget'
  const meActive = pathname === '/me'

  const tabClass = (active) =>
    `flex min-w-0 flex-col items-center justify-end gap-0.5 pb-1 text-[10px] sm:text-xs font-medium transition ${
      active
        ? 'text-sky-600 dark:text-sky-400'
        : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
    }`

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200/90 bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgba(15,23,42,0.06)] backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 ${mapHomeImmersive ? 'pt-1' : ''}`}
      aria-label={t('a11y.bottomTabBar')}
    >
      <div className="mx-auto grid h-[4.25rem] max-w-7xl grid-cols-5 items-end gap-0 px-0.5">
        <Link to="/map" className={tabClass(homeActive)} aria-current={homeActive ? 'page' : undefined}>
          <span className={`text-xl leading-none ${homeActive ? '' : 'opacity-90'}`} aria-hidden>
            ⌂
          </span>
          <span className="truncate">{t('common.bottomNavHome')}</span>
        </Link>

        <Link
          to="/routes"
          className={tabClass(exploreActive)}
          aria-current={exploreActive ? 'page' : undefined}
        >
          <span className="text-xl leading-none" aria-hidden>
            ◎
          </span>
          <span className="truncate">{t('common.bottomNavExplore')}</span>
        </Link>

        <div className="flex justify-center pb-1">
          <Link
            to="/trip-ai"
            className={`relative -top-3 flex h-14 w-14 flex-col items-center justify-center rounded-full text-[10px] font-bold shadow-lg ring-2 ring-white transition dark:ring-slate-900 ${
              aiActive
                ? 'bg-sky-600 text-white'
                : 'bg-gradient-to-b from-sky-500 to-sky-700 text-white hover:from-sky-600 hover:to-sky-800'
            }`}
            aria-current={aiActive ? 'page' : undefined}
            aria-label={t('common.bottomNavAiCenter')}
          >
            <span className="text-xl leading-none drop-shadow" aria-hidden>
              ✦
            </span>
            <span className="mt-0.5 max-w-[4.5rem] truncate px-0.5 text-center leading-none">
              {t('common.bottomNavAiCenter')}
            </span>
          </Link>
        </div>

        <Link
          to="/budget"
          className={tabClass(budgetActive)}
          aria-current={budgetActive ? 'page' : undefined}
        >
          <span className="text-xl leading-none" aria-hidden>
            ◇
          </span>
          <span className="truncate">{t('common.bottomNavBudget')}</span>
        </Link>

        <Link to="/me" className={tabClass(meActive)} aria-current={meActive ? 'page' : undefined}>
          <span className="text-xl leading-none" aria-hidden>
            👤
          </span>
          <span className="truncate">{t('common.bottomNavMe')}</span>
        </Link>
      </div>
    </nav>
  )
}
