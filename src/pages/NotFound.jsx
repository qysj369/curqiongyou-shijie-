import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function NotFound() {
  const { t } = useTranslation()
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <p className="text-6xl font-bold text-amber-500">404</p>
      <p className="mt-2 text-slate-600">{t('notFound.text')}</p>
      <Link
        to="/"
        className="mt-6 px-5 py-2.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
      >
        {t('notFound.backHome')}
      </Link>
      <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm">
        <Link to="/destinations" className="text-amber-600 hover:underline">{t('common.destinations')}</Link>
        <Link to="/articles" className="text-amber-600 hover:underline">{t('common.articles')}</Link>
        <Link to="/board" className="text-amber-600 hover:underline">{t('common.board')}</Link>
      </div>
    </div>
  )
}
