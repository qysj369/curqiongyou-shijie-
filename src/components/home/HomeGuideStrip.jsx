import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import OptimizedImage from '../OptimizedImage'

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
        <ul className="home-designed-guides__list touch-scroll-x flex justify-center gap-3 overflow-x-auto pb-1 sm:gap-4 snap-x snap-mandatory scrollbar-hide">
          {items.map(({ item, cover }) => (
            <li key={item.id} className="home-designed-guides__item snap-center shrink-0">
              <Link
                to={`/routes/${item.id}`}
                className="home-designed-guides__card group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
                title={item.title}
              >
                <div className="home-designed-guides__thumb relative overflow-hidden">
                  <OptimizedImage
                    src={cover}
                    alt={item.title}
                    loading="lazy"
                    w={480}
                    h={360}
                    q={82}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                  />
                  {item.city || item.destination ? (
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-2 pb-2 pt-6 text-center text-[10px] font-semibold text-white">
                      {item.city || item.destination}
                    </span>
                  ) : null}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
