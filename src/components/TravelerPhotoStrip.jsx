import { useTranslation } from 'react-i18next'
import OptimizedImage from './OptimizedImage'

/**
 * 旅行者晒图横滑（对标点评站「旅行者相册」）
 */
export default function TravelerPhotoStrip({ photos = [], destinationName = '', className = '' }) {
  const { t } = useTranslation()
  const list = Array.isArray(photos) ? photos.filter(Boolean) : []
  if (list.length === 0) return null

  return (
    <section className={className}>
      <div className="flex items-baseline justify-between gap-3 mb-3">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{t('travelerVoice.photosTitle')}</h2>
        <span className="text-xs text-slate-500 dark:text-slate-400">{t('travelerVoice.photosHint', { name: destinationName })}</span>
      </div>
      <div className="touch-scroll-x flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide snap-x snap-mandatory">
        {list.map((src, i) => (
          <div
            key={`${src}-${i}`}
            className="snap-start shrink-0 w-40 h-28 md:w-48 md:h-32 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-600 shadow-sm"
          >
            <OptimizedImage src={src} alt="" w={400} h={300} q={78} className="w-full h-full object-cover hover:scale-105 transition duration-300" />
          </div>
        ))}
      </div>
    </section>
  )
}
