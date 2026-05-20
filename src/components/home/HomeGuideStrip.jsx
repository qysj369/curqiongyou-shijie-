import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import OptimizedImage from '../OptimizedImage'

/**
 * 设计稿「旅游攻略」横滑缩略图条：每卡可点进详情。
 */
export default function HomeGuideStrip({ items }) {
  const { t } = useTranslation()

  if (!items?.length) return null

  return (
    <section className="home-designed-guides bg-white dark:bg-slate-950" aria-labelledby="home-designed-guides-title">
      <div className="mx-auto max-w-6xl px-4 pt-8 pb-6 sm:px-6">
        <div className="flex items-end justify-between gap-3 mb-5">
          <h2
            id="home-designed-guides-title"
            className="text-center flex-1 text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-xl"
          >
            {t('home.designedGuidesTitle')}
          </h2>
          <Link
            to="/routes"
            className="shrink-0 text-xs font-semibold text-sky-700 underline-offset-2 hover:underline dark:text-sky-300"
          >
            {t('home.viewAll')}
          </Link>
        </div>
        <ul className="home-designed-guides__list touch-scroll-x flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 snap-x snap-mandatory scrollbar-hide">
          {items.map(({ item, cover }) => (
            <li key={item.id} className="home-designed-guides__item snap-start shrink-0">
              <Link
                to={`/routes/${item.id}`}
                className="group block w-[9.5rem] sm:w-[11rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 rounded-2xl"
              >
                <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-slate-100 shadow-sm transition group-hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <OptimizedImage
                      src={cover}
                      alt=""
                      loading="lazy"
                      w={440}
                      h={330}
                      q={78}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                    {item.city || item.destination ? (
                      <span className="absolute bottom-1.5 left-1.5 max-w-[90%] truncate rounded-md bg-black/55 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                        {item.city || item.destination}
                      </span>
                    ) : null}
                  </div>
                  <p className="line-clamp-2 px-2.5 py-2 text-[11px] font-semibold leading-snug text-slate-800 dark:text-slate-100">
                    {item.title}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
