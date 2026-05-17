/** 首页首次自动定位偏好（与 Home 同步，可在「更多」里开关） */
export const AUTO_LOCATE_ENABLED_KEY = 'roamwise-auto-locate-enabled-v1'
export const AUTO_LOCATE_PREF_CHANGED = 'roamwise:auto-locate-pref-changed'

export function readAutoLocateEnabled() {
  if (typeof window === 'undefined') return true
  try {
    const v = window.localStorage.getItem(AUTO_LOCATE_ENABLED_KEY)
    if (v == null) return true
    return v !== '0'
  } catch {
    return true
  }
}

export function writeAutoLocateEnabled(enabled) {
  try {
    window.localStorage.setItem(AUTO_LOCATE_ENABLED_KEY, enabled ? '1' : '0')
  } catch {
    /* noop */
  }
  window.dispatchEvent(new CustomEvent(AUTO_LOCATE_PREF_CHANGED))
}
