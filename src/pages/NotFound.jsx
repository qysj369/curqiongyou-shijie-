import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import CopyPageLinkButton from '../components/CopyPageLinkButton'

export default function NotFound() {
  const { t } = useTranslation()
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <p className="text-6xl font-bold text-sky-600">404</p>
      <p className="mt-2 text-slate-600">{t('notFound.text')}</p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/map"
          className="px-5 py-2.5 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition min-h-11 inline-flex items-center"
        >
          {t('notFound.backHome')}
        </Link>
        <CopyPageLinkButton />
      </div>
      <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm">
        <Link to="/routes" className="text-sky-700 hover:underline">{t('common.articles')}</Link>
        <Link to="/board" className="text-sky-700 hover:underline">{t('common.board')}</Link>
      </div>
    </div>
  )
}
