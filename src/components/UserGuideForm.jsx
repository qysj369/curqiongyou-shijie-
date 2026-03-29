import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useToast } from '../contexts/ToastContext'
import { containsProfanity } from '../utils/profanityFilter'
import { addUserGuide } from '../data/userGuidesStore'
import { destinations } from '../data/mockData'

const destinationNames = [...new Set(destinations.map((d) => d.name).filter(Boolean))].sort()

export default function UserGuideForm({
  initialDestination = '',
  linkedArticleId = null,
  onSuccess,
  compact = false,
  className = '',
}) {
  const { t } = useTranslation()
  const { toast } = useToast()
  const [destinationName, setDestinationName] = useState(initialDestination)
  const [title, setTitle] = useState('')
  const [budget, setBudget] = useState('')
  const [days, setDays] = useState('')
  const [content, setContent] = useState('')
  const [author, setAuthor] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const titleTrim = title.trim()
    const contentTrim = content.trim()
    if (!titleTrim) {
      toast(t('userGuide.titleRequired'))
      return
    }
    if (!contentTrim) {
      toast(t('userGuide.contentRequired'))
      return
    }
    if (!destinationName) {
      toast(t('userGuide.destinationRequired'))
      return
    }
    const checkText = [titleTrim, contentTrim, author].join(' ')
    if (containsProfanity(checkText)) {
      toast(t('board.noProfanity'))
      return
    }
    const budgetNum = Number(budget) || 0
    const daysNum = Number(days) || 0
    addUserGuide({
      destinationName,
      title: titleTrim,
      budget: budgetNum,
      days: daysNum,
      content: contentTrim,
      author: author.trim() || t('userGuide.anonymous'),
      linkedArticleId: linkedArticleId || null,
    })
    setTitle('')
    setBudget('')
    setDays('')
    setContent('')
    setAuthor('')
    if (!initialDestination) setDestinationName('')
    toast(t('userGuide.submitSuccess'))
    onSuccess?.()
  }

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className={`bg-amber-50/80 rounded-xl p-4 border border-amber-100 ${className}`}>
        <h3 className="text-sm font-semibold text-slate-800 mb-3">{t('userGuide.shareExperience')}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('userGuide.titlePlaceholder')}
            className="col-span-full sm:col-span-1 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-amber-400"
            maxLength={80}
          />
          <select
            value={destinationName}
            onChange={(e) => setDestinationName(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 focus:ring-2 focus:ring-amber-400"
          >
            <option value="">{t('userGuide.destinationPlaceholder')}</option>
            {destinationNames.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <input
            type="number"
            min="0"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            placeholder={t('userGuide.daysPlaceholder')}
            className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-amber-400"
          />
          <input
            type="number"
            min="0"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder={t('userGuide.budgetPlaceholder')}
            className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-amber-400"
          />
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={t('userGuide.contentPlaceholder')}
          rows={3}
          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-amber-400 mb-2 resize-y"
          maxLength={2000}
        />
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder={t('userGuide.authorPlaceholder')}
            className="flex-1 min-w-[120px] px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-amber-400"
            maxLength={30}
          />
          <button type="submit" className="px-4 py-2 rounded-lg bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 transition">
            {t('userGuide.submit')}
          </button>
        </div>
      </form>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={`bg-white rounded-2xl shadow-sm p-6 ${className}`}>
      <h2 className="text-lg font-semibold text-slate-800 mb-4">{t('userGuide.formTitle')}</h2>
      <p className="text-slate-600 text-sm mb-4">{t('userGuide.formHint')}</p>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">{t('userGuide.destination')} *</label>
          <select
            value={destinationName}
            onChange={(e) => setDestinationName(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-700 focus:ring-2 focus:ring-amber-400"
            required
          >
            <option value="">{t('userGuide.destinationPlaceholder')}</option>
            {destinationNames.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">{t('userGuide.title')} *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('userGuide.titlePlaceholder')}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 focus:ring-2 focus:ring-amber-400"
            maxLength={80}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">{t('userGuide.budget')}</label>
            <input
              type="number"
              min="0"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder={t('userGuide.budgetPlaceholder')}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 focus:ring-2 focus:ring-amber-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">{t('userGuide.days')}</label>
            <input
              type="number"
              min="0"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              placeholder={t('userGuide.daysPlaceholder')}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 focus:ring-2 focus:ring-amber-400"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">{t('userGuide.content')} *</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={t('userGuide.contentPlaceholder')}
            rows={5}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 focus:ring-2 focus:ring-amber-400 resize-y"
            maxLength={2000}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">{t('userGuide.author')}</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder={t('userGuide.authorPlaceholder')}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 focus:ring-2 focus:ring-amber-400"
            maxLength={30}
          />
        </div>
        <p className="text-amber-700 text-xs">{t('board.guidelinesShort')}</p>
        <button type="submit" className="px-6 py-2.5 rounded-xl bg-amber-500 text-white font-medium hover:bg-amber-600 transition">
          {t('userGuide.submit')}
        </button>
      </div>
    </form>
  )
}
