import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useToast } from '../contexts/ToastContext'
import { containsProfanity } from '../utils/profanityFilter'
import { addUserGuide } from '../data/userGuidesStore'
import { pushInbox } from '../data/notificationsStore'
import { destinations } from '../data/mockData'
import { formatInteger } from '../utils/localeFormat'
import { getDestinationNamesForForms } from '../utils/destinationFormOptions'

const destinationNames = getDestinationNamesForForms(destinations)

function pickAllowedDestination(name) {
  return name && destinationNames.includes(name) ? name : ''
}

const inputClass =
  'min-h-11 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-400'
const textareaClass =
  'w-full min-h-[5.5rem] px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-400 resize-y'
const labelClass = 'block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1'
const btnSubmitClass =
  'min-h-11 px-6 py-2.5 rounded-xl bg-sky-600 text-white font-medium hover:bg-sky-700 dark:hover:bg-sky-600 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500'
const btnPreviewClass =
  'min-h-11 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500'

export default function UserGuideForm({
  initialDestination = '',
  linkedArticleId = null,
  onSuccess,
  compact = false,
  className = '',
}) {
  const { t, i18n } = useTranslation()
  const { toast } = useToast()
  const [destinationName, setDestinationName] = useState(() => pickAllowedDestination(initialDestination))
  const [title, setTitle] = useState('')
  const [budget, setBudget] = useState('')
  const [days, setDays] = useState('')
  const [content, setContent] = useState('')
  const [author, setAuthor] = useState('')
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    setDestinationName(pickAllowedDestination(initialDestination))
  }, [initialDestination])

  const previewMetaParts = () => {
    const parts = []
    parts.push(destinationName || '—')
    const b = Number(budget)
    if (Number.isFinite(b) && b > 0) parts.push(`¥${formatInteger(b, i18n.language)}`)
    const d = Number(days)
    if (Number.isFinite(d) && d > 0) parts.push(t('articleDetail.days', { count: d }))
    parts.push(author.trim() || t('userGuide.anonymous'))
    return parts
  }

  const previewPanel = (compactView) =>
    showPreview ? (
      <section
        aria-label={t('userGuide.previewAria')}
        className={
          compactView
            ? 'mt-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-600 bg-slate-50/90 dark:bg-slate-800/50 p-4'
            : 'mt-6 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-50/90 dark:bg-slate-800/40 p-6'
        }
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-sky-700 dark:text-sky-300 mb-1">
          {t('userGuide.previewBadge')}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">{t('userGuide.previewHint')}</p>
        <h3
          className={
            compactView
              ? 'text-lg font-bold text-slate-900 dark:text-slate-100 mb-2'
              : 'text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3'
          }
        >
          {title.trim() || (
            <span className="text-slate-400 dark:text-slate-500 font-normal">{t('userGuide.previewTitlePlaceholder')}</span>
          )}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{previewMetaParts().join(' · ')}</p>
        <div
          className={`max-w-none whitespace-pre-wrap text-slate-700 dark:text-slate-300 leading-relaxed ${
            compactView ? 'text-sm' : ''
          }`}
        >
          {content.trim() || (
            <span className="text-slate-400 dark:text-slate-500">{t('userGuide.previewContentPlaceholder')}</span>
          )}
        </div>
      </section>
    ) : null

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
        className={`bg-sky-50/80 dark:bg-sky-950/25 rounded-xl p-4 border border-sky-100 dark:border-sky-900/50 ${className}`}
      >
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-1">{t('userGuide.shareExperience')}</h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 mb-2 leading-relaxed">{t('governance.submitCompactHint')}</p>
        <p className="text-xs text-sky-800/90 dark:text-sky-300/95 mb-3">{t('governance.reviewHintShort')}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('userGuide.titlePlaceholder')}
            aria-label={t('userGuide.title')}
            className={`col-span-full sm:col-span-1 ${inputClass}`}
            maxLength={80}
          />
          <select
            value={destinationName}
            onChange={(e) => setDestinationName(e.target.value)}
            aria-label={t('userGuide.destination')}
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
            aria-label={t('userGuide.days')}
            className={inputClass}
          />
          <input
            type="number"
            min="0"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder={t('userGuide.budgetPlaceholder')}
            aria-label={t('userGuide.budget')}
            className={inputClass}
          />
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={t('userGuide.contentPlaceholder')}
          aria-label={t('userGuide.content')}
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
            aria-label={t('userGuide.author')}
            className={`flex-1 min-w-[120px] ${inputClass}`}
            maxLength={30}
          />
          <button
            type="button"
            className={`shrink-0 ${btnPreviewClass} text-sm`}
            onClick={() => setShowPreview((s) => !s)}
          >
            {showPreview ? t('userGuide.previewToggleHide') : t('userGuide.previewToggleShow')}
          </button>
          <button type="submit" className={`shrink-0 ${btnSubmitClass} text-sm`}>
            {t('userGuide.submit')}
          </button>
        </div>
        {previewPanel(true)}
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
        className="rounded-xl border border-sky-200/90 dark:border-sky-800/60 bg-sky-50/70 dark:bg-sky-950/30 px-4 py-3 mb-4"
        role="note"
      >
        <p className="text-sm font-semibold text-sky-900 dark:text-sky-200 mb-1">{t('governance.submitSpecTitle')}</p>
        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{t('governance.submitSpecBody')}</p>
        <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">{t('governance.reviewHintShort')}</p>
      </div>
      <div className="space-y-4">
        <div>
          <label htmlFor="userguide-destination" className={labelClass}>
            {t('userGuide.destination')} *
          </label>
          <select
            id="userguide-destination"
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
          <label htmlFor="userguide-title" className={labelClass}>
            {t('userGuide.title')} *
          </label>
          <input
            id="userguide-title"
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
            <label htmlFor="userguide-budget" className={labelClass}>
              {t('userGuide.budget')}
            </label>
            <input
              id="userguide-budget"
              type="number"
              min="0"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder={t('userGuide.budgetPlaceholder')}
              className={`w-full ${inputClass}`}
            />
          </div>
          <div>
            <label htmlFor="userguide-days" className={labelClass}>
              {t('userGuide.days')}
            </label>
            <input
              id="userguide-days"
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
          <label htmlFor="userguide-content" className={labelClass}>
            {t('userGuide.content')} *
          </label>
          <textarea
            id="userguide-content"
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
          <label htmlFor="userguide-author" className={labelClass}>
            {t('userGuide.author')}
          </label>
          <input
            id="userguide-author"
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder={t('userGuide.authorPlaceholder')}
            className={`w-full ${inputClass}`}
            maxLength={30}
          />
        </div>
        <p className="text-sky-700 dark:text-sky-400/95 text-xs">{t('board.guidelinesShort')}</p>
        <div className="flex flex-wrap gap-3 items-center">
          <button type="button" className={btnPreviewClass} onClick={() => setShowPreview((s) => !s)}>
            {showPreview ? t('userGuide.previewToggleHide') : t('userGuide.previewToggleShow')}
          </button>
          <button type="submit" className={btnSubmitClass}>
            {t('userGuide.submit')}
          </button>
        </div>
        {previewPanel(false)}
      </div>
    </form>
  )
}
