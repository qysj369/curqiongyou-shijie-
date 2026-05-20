import { useTranslation } from 'react-i18next'
import { HOME_HERO_FALLBACK, homeHeroAsset } from '../../utils/homeHeroAsset.js'

/**
 * 设计稿首屏：全宽结伴旅行主图（public/hero-home.jpg）+ 底部胶囊搜索条。
 */
export default function HomeDesignedHero({ search, setSearch, onSubmit }) {
  const { t } = useTranslation()

  const src640 = homeHeroAsset('hero-home-640w.jpg')
  const src960 = homeHeroAsset('hero-home-960w.jpg')
  const src1280 = homeHeroAsset('hero-home-1280w.jpg')
  const src1920 = homeHeroAsset('hero-home-1920w.jpg')

  return (
    <section className="home-designed-hero" aria-label={t('home.designedHeroAria')}>
      <img
        src={src1280}
        srcSet={`${src640} 640w, ${src960} 960w, ${src1280} 1280w, ${src1920} 1920w`}
        sizes="100vw"
        alt=""
        width={1920}
        height={1080}
        decoding="async"
        fetchPriority="high"
        className="home-designed-hero__img"
        onError={(e) => {
          const img = e.currentTarget
          if (img.dataset.fallback === '1') return
          img.dataset.fallback = '1'
          img.removeAttribute('srcset')
          img.removeAttribute('sizes')
          img.src = HOME_HERO_FALLBACK
        }}
      />
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
