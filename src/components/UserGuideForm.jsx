import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useToast } from '../contexts/ToastContext'
import { containsProfanity } from '../utils/profanityFilter'
import { addUserGuide } from '../data/userGuidesStore'
import { pushInbox } from '../data/notificationsStore'
import { destinations } from '../data/mockData'

const destinationNames = [...new Set(destinations.map((d) => d.name).filter(Boolean))].sort()

const inputClass =
  'min-h-11 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400'
const textareaClass =
  'w-full min-h-[5.5rem] px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-y'
const labelClass = 'block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1'
const btnSubmitClass =
  'min-h-11 px-6 py-2.5 rounded-xl bg-amber-500 text-white font-medium hover:bg-amber-600 dark:hover:bg-amber-600 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500'

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
    pushInbox({
      title: t('notifications.submissionReceivedTitle'),
      body: t('notifications.submissionReceivedBody'),
      kind: 'review',
    })
    onSuccess?.()
  }

  if (compact) {
    return (
      <form
        onSubmit={handleSubmit}
        className={`bg-amber-50/80 dark:bg-amber-950/25 rounded-xl p-4 border border-amber-100 dark:border-amber-900/50 ${className}`}
      >
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-1">{t('userGuide.shareExperience')}</h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 mb-2 leading-relaxed">{t('governance.submitCompactHint')}</p>
        <p className="text-xs text-amber-800/90 dark:text-amber-300/95 mb-3">{t('governance.reviewHintShort')}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('userGuide.titlePlaceholder')}
            className={`col-span-full sm:col-span-1 ${inputClass}`}
            maxLength={80}
          />
          <select
            value={destinationName}
            onChange={(e) => setDestinationName(e.target.value)}
            className={inputClass}
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
            className={inputClass}
          />
          <input
            type="number"
            min="0"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder={t('userGuide.budgetPlaceholder')}
            className={inputClass}
          />
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={t('userGuide.contentPlaceholder')}
          rows={3}
          className={`${textareaClass} mb-2`}
          maxLength={2000}
        />
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder={t('userGuide.authorPlaceholder')}
            className={`flex-1 min-w-[120px] ${inputClass}`}
            maxLength={30}
          />
          <button type="submit" className={`shrink-0 ${btnSubmitClass} text-sm`}>
            {t('userGuide.submit')}
          </button>
        </div>
      </form>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 ${className}`}
    >
      <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">{t('userGuide.formTitle')}</h2>
      <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">{t('userGuide.formHint')}</p>
      <div
        className="rounded-xl border border-amber-200/90 dark:border-amber-800/60 bg-amber-50/70 dark:bg-amber-950/30 px-4 py-3 mb-4"
        role="note"
      >
        <p className="text-sm font-semibold text-amber-900 dark:text-amber-200 mb-1">{t('governance.submitSpecTitle')}</p>
        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{t('governance.submitSpecBody')}</p>
        <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">{t('governance.reviewHintShort')}</p>
      </div>
      <div className="space-y-4">
        <div>
          <label className={labelClass}>{t('userGuide.destination')} *</label>
          <select
            value={destinationName}
            onChange={(e) => setDestinationName(e.target.value)}
            className={`w-full ${inputClass}`}
            required
          >
            <option value="">{t('userGuide.destinationPlaceholder')}</option>
            {destinationNames.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>{t('userGuide.title')} *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('userGuide.titlePlaceholder')}
            className={`w-full ${inputClass}`}
            maxLength={80}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>{t('userGuide.budget')}</label>
            <input
              type="number"
              min="0"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder={t('userGuide.budgetPlaceholder')}
              className={`w-full ${inputClass}`}
            />
          </div>
          <div>
            <label className={labelClass}>{t('userGuide.days')}</label>
            <input
              type="number"
              min="0"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              placeholder={t('userGuide.daysPlaceholder')}
              className={`w-full ${inputClass}`}
            />
          </div>
        </div>
        <div>
          <label className={labelClass}>{t('userGuide.content')} *</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={t('userGuide.contentPlaceholder')}
            rows={5}
            className={textareaClass}
            maxLength={2000}
            required
          />
        </div>
        <div>
          <label className={labelClass}>{t('userGuide.author')}</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder={t('userGuide.authorPlaceholder')}
            className={`w-full ${inputClass}`}
            maxLength={30}
          />
        </div>
        <p className="text-amber-700 dark:text-amber-400/95 text-xs">{t('board.guidelinesShort')}</p>
        <button type="submit" className={btnSubmitClass}>
          {t('userGuide.submit')}
        </button>
      </div>
    </form>
  )
}
