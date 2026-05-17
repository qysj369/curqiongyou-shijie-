import AMapLoader from '@amap/amap-jsapi-loader'

let loadPromise = null
const DEFAULT_PLUGINS = ['AMap.Scale', 'AMap.ToolBar', 'AMap.PlaceSearch']

/**
 * @param {string[]} [plugins]
 * @returns {Promise<typeof window.AMap>}
 */
export function loadAmapApi(plugins = DEFAULT_PLUGINS) {
  const key = import.meta.env.VITE_AMAP_KEY
  if (!key || !String(key).trim()) {
    return Promise.reject(new Error('Missing VITE_AMAP_KEY'))
  }

  const securityJsCode = import.meta.env.VITE_AMAP_SECURITY_CODE
  if (typeof window !== 'undefined' && securityJsCode && String(securityJsCode).trim()) {
    window._AMapSecurityConfig = {
      securityJsCode: String(securityJsCode).trim(),
    }
  }

  if (!loadPromise) {
    loadPromise = AMapLoader.load({
      key: String(key).trim(),
      version: '2.0',
      plugins,
    })
  }
  return loadPromise
}

export function hasAmapKey() {
  const key = import.meta.env.VITE_AMAP_KEY
  return Boolean(key && String(key).trim())
}
