import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useToast } from '../contexts/ToastContext'

const STORAGE_COUNTS = 'budget-travel-article-likes-count'
const STORAGE_LIKED = 'budget-travel-article-liked'

function loadCounts() {
  try {
    const raw = localStorage.getItem(STORAGE_COUNTS)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveCounts(counts) {
  try {
    localStorage.setItem(STORAGE_COUNTS, JSON.stringify(counts))
  } catch {}
}

function loadLiked() {
  try {
    const raw = localStorage.getItem(STORAGE_LIKED)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveLiked(liked) {
  try {
    localStorage.setItem(STORAGE_LIKED, JSON.stringify(liked))
  } catch {}
}

export default function ArticleLikeButton({ articleId }) {
  const { t } = useTranslation()
  const { toast } = useToast()
  const [counts, setCounts] = useState(loadCounts)
  const [liked, setLiked] = useState(loadLiked)

  useEffect(() => {
    setCounts(loadCounts())
    setLiked(loadLiked())
  }, [])

  const count = counts[articleId] ?? 0
  const isLiked = liked[articleId] ?? false

  const handleClick = () => {
    const nextLiked = { ...liked, [articleId]: !isLiked }
    setLiked(nextLiked)
    saveLiked(nextLiked)
    const nextCounts = { ...counts, [articleId]: Math.max(0, count + (isLiked ? -1 : 1)) }
    setCounts(nextCounts)
    saveCounts(nextCounts)
    toast(isLiked ? t('articleDetail.unlike') : t('articleDetail.likeSuccess'))
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition print:hidden ${
        isLiked ? 'bg-sky-600 text-white' : 'bg-slate-200 text-slate-600 hover:bg-sky-100 hover:text-sky-700'
      }`}
      title={t('articleDetail.likeThis')}
      aria-pressed={isLiked}
      aria-label={`${t('a11y.likeGuide')} · ${count}`}
    >
      <span aria-hidden>♥</span>
      <span>{count}</span>
    </button>
  )
}
