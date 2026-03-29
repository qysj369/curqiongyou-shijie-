import { useTranslation } from 'react-i18next'

export default function CommunityGuidelines({ className = '' }) {
  const { t } = useTranslation()
  return (
    <div className={`rounded-xl bg-amber-50 border border-amber-200 p-4 ${className}`}>
      <p className="text-amber-800 text-sm font-medium mb-1">{t('board.guidelinesTitle')}</p>
      <p className="text-amber-700 text-sm">{t('board.guidelinesBody')}</p>
    </div>
  )
}
