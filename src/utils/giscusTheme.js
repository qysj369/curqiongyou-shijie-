/** @returns {'light' | 'dark'} */
export function getPreferredGiscusTheme() {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/** @param {'light' | 'dark' | string} theme */
export function postGiscusTheme(theme) {
  const iframe = document.querySelector('iframe.giscus-frame')
  if (!iframe?.contentWindow) return
  try {
    iframe.contentWindow.postMessage({ giscus: { setConfig: { theme } } }, 'https://giscus.app')
  } catch {
    // ignore
  }
}
