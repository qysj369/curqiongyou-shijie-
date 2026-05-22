import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { optimizeUnsplashUrl } from '../../utils/optimizeUnsplashUrl'

const FALLBACK_COVER =
  'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80'

/**
 * 设计稿「旅游攻略」：居中标题 + 明亮圆角缩略图横滑。
 */
export default function HomeGuideStrip({ items }) {
  const { t } = useTranslation()

  if (!items?.length) return null

  return (
    <section
      id="guides"
      className="home-designed-guides scroll-mt-24"
      aria-labelledby="home-designed-guides-title"
    >
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <header className="mb-6 text-center">
          <h2
            id="home-designed-guides-title"
            className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-2xl"
          >
            {t('home.designedGuidesTitle')}
          </h2>
          <Link
            to="/routes?sort=budgetAsc"
            className="mt-2 inline-block text-sm font-medium text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300"
          >
            {t('home.viewAllGuides')}
          </Link>
        </header>
        <ul className="home-designed-guides__list touch-scroll-x flex justify-start gap-3 overflow-x-auto pb-1 sm:justify-center sm:gap-4 snap-x snap-mandatory scrollbar-hide">
          {items.map(({ item, cover }) => (
            <GuideThumb key={item.id} item={item} cover={cover} />
          ))}
        </ul>
      </div>
    </section>
  )
}

function GuideThumb({ item, cover }) {
  const initial =
    typeof cover === 'string' && cover.startsWith('http')
      ? optimizeUnsplashUrl(cover, { w: 480, h: 360, q: 80 })
      : FALLBACK_COVER
  const [src, setSrc] = useState(initial)

  return (
    <li className="home-designed-guides__item snap-center shrink-0">
      <Link
        to={`/routes/${item.id}`}
        className="home-designed-guides__card group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
        title={item.title}
      >
        <div className="home-designed-guides__thumb relative overflow-hidden bg-gradient-to-br from-sky-100 to-emerald-50">
          <img
            src={src}
            alt=""
            width={360}
            height={360}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
            onError={() => {
              if (src !== FALLBACK_COVER) setSrc(FALLBACK_COVER)
            }}
          />
          {item.city || item.destination ? (
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent px-2 pb-2 pt-8 text-center text-[11px] font-semibold text-white">
              {item.city || item.destination}
            </span>
          ) : null}
        </div>
      </Link>
    </li>
  )
}
