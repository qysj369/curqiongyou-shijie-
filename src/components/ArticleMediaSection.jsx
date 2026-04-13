import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import OptimizedImage from './OptimizedImage'

/**
 * 攻略页动态图集 + 可选视频（YouTube 嵌入或 MP4），参考 OTA 详情富媒体区块，素材来自本站数据。
 * @param {{ gallery?: string[], videoYoutubeId?: string, videoMp4?: string, title?: string, className?: string }} props
 */
export default function ArticleMediaSection({
  gallery = [],
  videoYoutubeId = '',
  videoMp4 = '',
  title = '',
  className = '',
}) {
  const { t } = useTranslation()
  const images = Array.isArray(gallery) ? gallery.filter(Boolean) : []
  const [index, setIndex] = useState(0)
  const hasGallery = images.length > 0
  const hasVideo = Boolean(videoYoutubeId || videoMp4)
  if (!hasGallery && !hasVideo) return null

  const go = useCallback(
    (dir) => {
      if (!hasGallery) return
      setIndex((i) => (i + dir + images.length) % images.length)
    },
    [hasGallery, images.length],
  )

  return (
    <section className={`space-y-6 print:hidden ${className}`} aria-label={t('media.sectionLabel')}>
      {hasGallery && (
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
            <span aria-hidden>📷</span>
            {t('media.galleryTitle')}
          </h2>
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-600 bg-slate-900 shadow-lg">
            <div className="aspect-video relative">
              <OptimizedImage
                src={images[index]}
                alt={title ? `${title} · ${index + 1}/${images.length}` : t('media.galleryImageAlt', { n: index + 1, total: images.length })}
                w={1600}
                h={900}
                q={80}
                className="w-full h-full object-cover"
              />
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/45 text-white w-10 h-10 text-lg hover:bg-black/65 min-h-11 min-w-11 flex items-center justify-center"
                    aria-label={t('media.prev')}
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/45 text-white w-10 h-10 text-lg hover:bg-black/65 min-h-11 min-w-11 flex items-center justify-center"
                    aria-label={t('media.next')}
                  >
                    ›
                  </button>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto p-3 bg-slate-950/90 scrollbar-thin">
                {images.map((src, i) => (
                  <button
                    key={src + i}
                    type="button"
                    onClick={() => setIndex(i)}
                    className={`shrink-0 rounded-lg overflow-hidden ring-2 transition ${i === index ? 'ring-amber-400' : 'ring-transparent opacity-70 hover:opacity-100'}`}
                    aria-label={t('media.thumbAlt', { n: i + 1 })}
                  >
                    <OptimizedImage src={src} alt="" w={160} h={90} q={70} className="h-14 w-24 object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {hasVideo && (
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
            <span aria-hidden>🎬</span>
            {t('media.videoTitle')}
          </h2>
          <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-600 shadow-lg bg-black aspect-video max-w-4xl">
            {videoYoutubeId ? (
              <iframe
                title={title || 'video'}
                src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoYoutubeId)}?rel=0`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
              />
            ) : (
              <video src={videoMp4} className="w-full h-full" controls playsInline preload="metadata" />
            )}
          </div>
        </div>
      )}
    </section>
  )
}
