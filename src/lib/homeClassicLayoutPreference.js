/** 移动端强制使用经典长首页（非全屏地图首屏）。 */
export const HOME_CLASSIC_LAYOUT_KEY = 'roamwise-home-classic-v1'
export const HOME_CLASSIC_LAYOUT_CHANGED = 'roamwise-home-classic-changed'

export function readHomeClassicLayoutEnabled() {
  if (typeof window === 'undefined') return false
  try {
    return window.sessionStorage.getItem(HOME_CLASSIC_LAYOUT_KEY) === '1'
  } catch {
    return false
  }
}

export function writeHomeClassicLayoutEnabled(enabled) {
  if (typeof window === 'undefined') return
  try {
    if (enabled) window.sessionStorage.setItem(HOME_CLASSIC_LAYOUT_KEY, '1')
    else window.sessionStorage.removeItem(HOME_CLASSIC_LAYOUT_KEY)
  } catch {
    /* noop */
  }
  window.dispatchEvent(new CustomEvent(HOME_CLASSIC_LAYOUT_CHANGED))
}
