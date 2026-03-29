import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { destinations } from '../data/mockData'
import CommunityGuidelines from '../components/CommunityGuidelines'
import Breadcrumbs from '../components/Breadcrumbs'
import { useToast } from '../contexts/ToastContext'
import { containsProfanity } from '../utils/profanityFilter'

const STORAGE_POSTS = 'budget-travel-board-posts'
const STORAGE_LIKES = 'budget-travel-board-likes'

const TYPES = [
  { value: 'share', labelKey: 'board.typeShare' },
  { value: 'complaint', labelKey: 'board.typeComplaint' },
  { value: 'other', labelKey: 'board.typeOther' },
]

function loadPosts() {
  try {
    const raw = localStorage.getItem(STORAGE_POSTS)
    if (!raw) return []
    const list = JSON.parse(raw)
    return Array.isArray(list) ? list : []
  } catch {
    return []
  }
}

function savePosts(list) {
  try {
    localStorage.setItem(STORAGE_POSTS, JSON.stringify(list))
  } catch {}
}

function loadLikes() {
  try {
    const raw = localStorage.getItem(STORAGE_LIKES)
    if (!raw) return {}
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

function saveLikes(likes) {
  try {
    localStorage.setItem(STORAGE_LIKES, JSON.stringify(likes))
  } catch {}
}

export default function MessageBoard() {
  const { t } = useTranslation()
  const { toast } = useToast()
  const [posts, setPosts] = useState(loadPosts)
  const [likes, setLikes] = useState(loadLikes)
  const [countryFilter, setCountryFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [formCountry, setFormCountry] = useState('')
  const [formType, setFormType] = useState('share')
  const [formContent, setFormContent] = useState('')

  const countryList = useMemo(
    () => [...new Set(destinations.map((d) => d.country).filter(Boolean))].sort(),
    [],
  )

  useEffect(() => {
    setPosts(loadPosts())
    setLikes(loadLikes())
  }, [])

  const filteredPosts = useMemo(() => {
    let list = [...posts].sort((a, b) => new Date(b.at) - new Date(a.at))
    if (countryFilter) list = list.filter((p) => p.country === countryFilter)
    if (typeFilter) list = list.filter((p) => p.type === typeFilter)
    return list
  }, [posts, countryFilter, typeFilter])

  const handleSubmit = (e) => {
    e.preventDefault()
    const content = formContent.trim()
    if (!content) {
      toast(t('board.contentRequired'))
      return
    }
    if (containsProfanity(content)) {
      toast(t('board.noProfanity'))
      return
    }
    const newPost = {
      id: `p-${Date.now()}`,
      country: formCountry || undefined,
      type: formType,
      content,
      likes: 0,
      at: new Date().toISOString(),
    }
    const next = [newPost, ...posts]
    setPosts(next)
    savePosts(next)
    setFormContent('')
    toast(t('board.postSuccess'))
  }

  const handleLike = (postId) => {
    const currentlyLiked = likes[postId]
    setLikes((prev) => {
      const next = { ...prev }
      next[postId] = !next[postId]
      saveLikes(next)
      return next
    })
    setPosts((prev) => {
      const next = prev.map((p) =>
        p.id === postId
          ? { ...p, likes: Math.max(0, (p.likes || 0) + (currentlyLiked ? -1 : 1)) }
          : p,
      )
      savePosts(next)
      return next
    })
  }


  const breadcrumbs = [
    { label: t('common.home'), to: '/' },
    { label: t('board.title') },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbs} />
        <h1 className="text-3xl font-bold text-slate-800 mb-2">{t('board.title')}</h1>
        <p className="text-slate-600 mb-6">{t('board.subtitle')}</p>

        <CommunityGuidelines className="mb-6" />

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">{t('board.postNew')}</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                {t('board.countryOptional')}
              </label>
              <select
                value={formCountry}
                onChange={(e) => setFormCountry(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-700 focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
              >
                <option value="">{t('board.countryNone')}</option>
                {countryList.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                {t('board.type')}
              </label>
              <div className="flex flex-wrap gap-2">
                {TYPES.map((opt) => (
                  <label key={opt.value} className="inline-flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      value={opt.value}
                      checked={formType === opt.value}
                      onChange={() => setFormType(opt.value)}
                      className="text-amber-500 focus:ring-amber-400"
                    />
                    <span className="text-sm text-slate-700">{t(opt.labelKey)}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                {t('board.content')}
              </label>
              <textarea
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
                placeholder={t('board.contentPlaceholder')}
                rows={3}
                maxLength={500}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 resize-y"
              />
              <p className="text-xs text-slate-400 mt-1">{formContent.length}/500</p>
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-amber-500 text-white font-medium hover:bg-amber-600 transition"
            >
              {t('board.submit')}
            </button>
          </div>
        </form>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-slate-600 text-sm font-medium">{t('board.filterBy')}</span>
          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 text-sm"
          >
            <option value="">{t('board.allCountries')}</option>
            {countryList.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 text-sm"
          >
            <option value="">{t('board.allTypes')}</option>
            {TYPES.map((opt) => (
              <option key={opt.value} value={opt.value}>{t(opt.labelKey)}</option>
            ))}
          </select>
        </div>

        <div className="space-y-4">
          {filteredPosts.length === 0 ? (
            <p className="text-slate-500 text-center py-12">{t('board.empty')}</p>
          ) : (
            filteredPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-xl shadow-sm p-5 border border-slate-100"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 mb-2">
                      {post.country && (
                        <span className="px-2 py-0.5 bg-slate-100 rounded">{post.country}</span>
                      )}
                      <span className="text-amber-600 font-medium">
                        {t(`board.type${post.type === 'share' ? 'Share' : post.type === 'complaint' ? 'Complaint' : 'Other'}`)}
                      </span>
                      <span>{new Date(post.at).toLocaleString()}</span>
                    </div>
                    <p className="text-slate-800 whitespace-pre-wrap">{post.content}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleLike(post.id)}
                    className={`flex-shrink-0 flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-medium transition ${
                      likes[post.id]
                        ? 'bg-rose-100 text-rose-600'
                        : 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-500'
                    }`}
                    title={t('board.like')}
                  >
                    <span aria-hidden>♥</span>
                    <span>{post.likes || 0}</span>
                  </button>
                </div>
              </article>
            ))
          )}
        </div>

        <p className="text-slate-400 text-xs mt-8 text-center">{t('board.localOnly')}</p>
      </div>
    </div>
  )
}
