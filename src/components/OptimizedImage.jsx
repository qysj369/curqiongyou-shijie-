import { useState, useMemo } from 'react'
import { optimizeUnsplashUrl } from '../utils/optimizeUnsplashUrl'

const SIZE_CLASS =
  /\b(aspect-video|aspect-\[[^\]]+\]|w-[\w./[\]-]+|h-[\w./[\]-]+|max-w-[\w./[\]-]+|min-h-[\w./[\]-]+|rounded(?:-[\w]+)?|flex-shrink-\d+)\b/g

/**
 * @param {string} className
 * @returns {{ wrapper: string; imgExtra: string }}
 */
function splitSizing(className) {
  const sizing = []
  let m
  const re = new RegExp(SIZE_CLASS.source, 'g')
  while ((m = re.exec(className)) !== null) sizing.push(m[0])
  const wrapper = sizing.join(' ')
  const imgExtra = className
    .replace(SIZE_CLASS, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return { wrapper, imgExtra }
}

/**
 * Lazy-loaded image with skeleton + LQIP blur for Unsplash; plain <img> for other URLs.
 */
export default function OptimizedImage({ src, alt = '', className = '', w = 800, h, q = 75, loading = 'lazy', ...rest }) {
  const [loaded, setLoaded] = useState(false)
  const isUnsplash = typeof src === 'string' && src.includes('images.unsplash.com')
  const fullSrc = isUnsplash ? optimizeUnsplashUrl(src, { w, h, q }) : src
  const lqipH = h && w ? Math.max(24, Math.round((h / w) * 48)) : undefined
  const lqipSrc = isUnsplash ? optimizeUnsplashUrl(src, { w: 48, h: lqipH, q: 25 }) : ''

  const { wrapper, imgExtra } = useMemo(() => splitSizing(className), [className])

  if (!isUnsplash) {
    return <img src={src} alt={alt} className={className} loading={loading} decoding="async" {...rest} />
  }

  const outerClass = `relative block overflow-hidden ${wrapper}`.trim()
  const mainClass =
    `absolute inset-0 h-full w-full object-cover transition-opacity duration-300 motion-reduce:transition-none z-[1] ` +
    `${loaded ? 'opacity-100' : 'opacity-0'} ${imgExtra}`.trim()

  return (
    <span className={outerClass}>
      <span className="absolute inset-0 z-0 bg-slate-200 dark:bg-slate-800" aria-hidden />
      {!loaded && (
        <img
          src={lqipSrc}
          alt=""
          className="absolute inset-0 z-0 h-full w-full scale-110 object-cover opacity-60 blur-md motion-reduce:blur-none pointer-events-none"
          aria-hidden
        />
      )}
      <img
        src={fullSrc}
        alt={alt}
        loading={loading}
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={mainClass}
        {...rest}
      />
    </span>
  )
}
