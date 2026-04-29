import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function Me() {
  const { t } = useTranslation()

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
        {t('common.navMe')}
      </h1>
      <p className="mt-2 text-slate-600 dark:text-slate-300">{t('me.lead')}</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Link
          to="/favorites"
          className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 hover:border-sky-400 transition"
        >
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">{t('common.navFavorites')}</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{t('me.favoritesHint')}</p>
        </Link>
        <Link
          to="/community/qa"
          className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 hover:border-sky-400 transition"
        >
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">{t('community.qa')}</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{t('me.qaHint')}</p>
        </Link>
        <Link
          to="/community/buddies"
          className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 hover:border-sky-400 transition"
        >
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">{t('community.buddies')}</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{t('me.buddiesHint')}</p>
        </Link>
        <Link
          to="/budget"
          className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 hover:border-sky-400 transition"
        >
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">{t('common.navBudget')}</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{t('me.budgetHint')}</p>
        </Link>
      </div>
    </div>
  )
}
