import { useState, useMemo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useToast } from '../contexts/ToastContext'
import { containsProfanity } from '../utils/profanityFilter'
import { getAllBuddyPosts, addBuddyPost } from '../data/buddiesStore'
import { destinations } from '../data/mockData'
import Breadcrumbs from '../components/Breadcrumbs'
import CopyPageLinkButton from '../components/CopyPageLinkButton'
import CommunityGuidelines from '../components/CommunityGuidelines'
import { getDestinationNamesForForms } from '../utils/destinationFormOptions'

const destinationNames = getDestinationNamesForForms(destinations)

export default function CommunityBuddies() {
  const { t } = useTranslation()
  const { toast } = useToast()
  const [posts, setPosts] = useState(getAllBuddyPosts())
  const [destFilter, setDestFilter] = useState('')
  const [formDest, setFormDest] = useState('')
  const [formDateFrom, setFormDateFrom] = useState('')
  const [formDateTo, setFormDateTo] = useState('')
  const [formIntro, setFormIntro] = useState('')
  const [formAuthor, setFormAuthor] = useState('')

  const filtered = useMemo(() => {
    let list = [...posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    if (destFilter) list = list.filter((p) => p.destination === destFilter)
    return list
  }, [posts, destFilter])

  useEffect(() => {
    if (destFilter && !destinationNames.includes(destFilter)) setDestFilter('')
  }, [destFilter])

  useEffect(() => {
    if (formDest && !destinationNames.includes(formDest)) setFormDest('')
  }, [formDest])

  const handleSubmit = (e) => {
    e.preventDefault()
    const intro = formIntro.trim()
    const dest = formDest.trim()
    if (!dest) {
      toast(t('buddies.destinationRequired'))
      return
    }
    if (!intro) {
      toast(t('buddies.introRequired'))
      return
    }
    if (containsProfanity(intro + formAuthor)) {
      toast(t('board.noProfanity'))
      return
    }
    addBuddyPost({
      destination: dest,
      dateFrom: formDateFrom.trim(),
      dateTo: formDateTo.trim(),
      intro,
      author: formAuthor.trim() || t('buddies.anonymous'),
    })
    setPosts(getAllBuddyPosts())
    setFormDest('')
    setFormDateFrom('')
    setFormDateTo('')
    setFormIntro('')
    setFormAuthor('')
    toast(t('buddies.postSubmitted'))
  }

  const breadcrumbs = [
    { label: t('common.navMap'), to: '/map' },
    { label: t('community.title'), to: '/community' },
    { label: t('community.buddies') },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <Breadcrumbs items={breadcrumbs} />
          <CopyPageLinkButton />
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">{t('community.buddies')}</h1>
        <p className="text-slate-600 mb-6">{t('buddies.subtitle')}</p>

        <CommunityGuidelines className="mb-6" />

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">{t('buddies.postLooking')}</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="buddies-form-dest" className="block text-sm font-medium text-slate-600 mb-1">
                {t('buddies.destination')} *
              </label>
              <select
                id="buddies-form-dest"
                value={formDest}
                onChange={(e) => setFormDest(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-700 focus:ring-2 focus:ring-sky-400"
                required
              >
                <option value="">{t('buddies.chooseDest')}</option>
                {destinationNames.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="buddies-form-date-from" className="block text-sm font-medium text-slate-600 mb-1">
                  {t('buddies.dateFrom')}
                </label>
                <input
                  id="buddies-form-date-from"
                  type="text"
                  value={formDateFrom}
                  onChange={(e) => setFormDateFrom(e.target.value)}
                  placeholder={t('buddies.datePlaceholder')}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sky-400"
                />
              </div>
              <div>
                <label htmlFor="buddies-form-date-to" className="block text-sm font-medium text-slate-600 mb-1">
                  {t('buddies.dateTo')}
                </label>
                <input
                  id="buddies-form-date-to"
                  type="text"
                  value={formDateTo}
                  onChange={(e) => setFormDateTo(e.target.value)}
                  placeholder={t('buddies.datePlaceholder')}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sky-400"
                />
              </div>
            </div>
            <div>
              <label htmlFor="buddies-form-intro" className="block text-sm font-medium text-slate-600 mb-1">
                {t('buddies.intro')} *
              </label>
              <textarea
                id="buddies-form-intro"
                value={formIntro}
                onChange={(e) => setFormIntro(e.target.value)}
                placeholder={t('buddies.introPlaceholder')}
                rows={4}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sky-400 resize-y"
                maxLength={500}
                required
              />
            </div>
            <div>
              <label htmlFor="buddies-form-author" className="block text-sm font-medium text-slate-600 mb-1">
                {t('buddies.yourName')}
              </label>
              <input
                id="buddies-form-author"
                type="text"
                value={formAuthor}
                onChange={(e) => setFormAuthor(e.target.value)}
                placeholder={t('buddies.anonymous')}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sky-400 max-w-xs"
                maxLength={30}
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-sky-600 text-white font-medium hover:bg-sky-700 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2"
            >
              {t('buddies.submit')}
            </button>
          </div>
        </form>

        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-slate-600 font-medium text-sm">{t('buddies.filterByDest')}</span>
          <select
            id="buddies-filter-dest"
            aria-label={t('buddies.filterByDest')}
            value={destFilter}
            onChange={(e) => setDestFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 text-slate-700 text-sm focus:ring-2 focus:ring-sky-400"
          >
            <option value="">{t('buddies.allDestinations')}</option>
            {destinationNames.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="space-y-4">
          {filtered.length === 0 ? (
            <p className="text-slate-500 text-center py-8">{t('buddies.noPostsYet')}</p>
          ) : (
            filtered.map((p) => (
              <article
                key={p.id}
                className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 motion-safe:hover:shadow-md motion-safe:transition"
              >
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 text-sm font-medium">{p.destination}</span>
                  {(p.dateFrom || p.dateTo) && (
                    <span className="text-slate-500 text-sm">
                      {[p.dateFrom, p.dateTo].filter(Boolean).join(' ~ ')}
                    </span>
                  )}
                </div>
                <p className="text-slate-700 whitespace-pre-wrap">{p.intro}</p>
                <p className="text-slate-400 text-xs mt-3">{p.author} · {p.createdAt.slice(0, 10)}</p>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
