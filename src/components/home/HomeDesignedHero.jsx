import { useTranslation } from 'react-i18next'

const HERO_FALLBACK =
  'https://images.unsplash.com/photo-1547981609-a4e886b04c1f?w=1920&q=80'

/**
 * 设计稿首屏：全宽结伴旅行主图 + 底部胶囊搜索条。
 */
export default function HomeDesignedHero({ search, setSearch, onSubmit }) {
  const { t } = useTranslation()
  const base = import.meta.env.BASE_URL || '/'
  const heroBase = `${base}hero-home`.replace(/\/{2,}/g, '/')

  return (
    <section className="home-designed-hero" aria-label={t('home.designedHeroAria')}>
      <picture className="home-designed-hero__media">
        <source
          type="image/jpeg"
          srcSet={`${heroBase}-640w.jpg 640w, ${heroBase}-960w.jpg 960w, ${heroBase}-1280w.jpg 1280w, ${heroBase}-1920w.jpg 1920w`}
          sizes="100vw"
        />
        <img
          src={`${heroBase}-1280w.jpg`}
          alt=""
          width={1920}
          height={1080}
          decoding="async"
          fetchPriority="high"
          className="home-designed-hero__img"
          onError={(e) => {
            if (e.currentTarget.src !== HERO_FALLBACK) e.currentTarget.src = HERO_FALLBACK
          }}
        />
      </picture>
      <div className="home-designed-hero__scrim" aria-hidden />
      <form
        role="search"
        aria-label={t('a11y.homeSearchForm')}
        className="home-designed-hero__search"
        onSubmit={onSubmit}
      >
        <label htmlFor="home-designed-search" className="sr-only">
          {t('a11y.homeSearchQueryLabel')}
        </label>
        <input
          id="home-designed-search"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('home.designedSearchPlaceholder')}
          autoComplete="off"
          enterKeyHint="search"
          className="home-designed-hero__input"
        />
        <button type="submit" className="home-designed-hero__submit" aria-label={t('a11y.homeSearchSubmit')}>
          <span aria-hidden className="home-designed-hero__submit-icon">
            ⌕
          </span>
        </button>
      </form>
    </section>
  )
}
