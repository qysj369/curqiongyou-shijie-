import { useTranslation } from 'react-i18next'
import { useFavorites } from '../hooks/useFavorites'
import { useToast } from '../contexts/ToastContext'

export default function FavoriteButton({ articleId, className = '' }) {
  const { t } = useTranslation()
  const { isFavorite, toggleFavorite } = useFavorites()
  const { toast } = useToast()
  const active = isFavorite(articleId)

  const handleClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(articleId)
    toast(active ? t('toast.unfavorited') : t('toast.favorited'))
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium transition ${active ? 'bg-rose-500 text-white' : 'bg-slate-200 text-slate-600 hover:bg-rose-100 hover:text-rose-600'} ${className}`}
      title={active ? t('common.favorited') : t('common.favorite')}
      aria-pressed={active}
    >
      <span>{active ? '♥' : '♡'}</span>
      <span>{active ? t('common.favorited') : t('common.favorite')}</span>
    </button>
  )
}
