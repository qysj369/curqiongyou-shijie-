/** 仅作展示用的示意汇率，非牌价、非理财建议 */
const CNY_PER_USD = 7.2

export function localeTagFromI18n(lng) {
  void lng
  return 'zh-CN'
}

export function formatInteger(value, lng) {
  const n = Number(value)
  if (!Number.isFinite(n)) return String(value ?? '')
  return new Intl.NumberFormat(localeTagFromI18n(lng), {
    maximumFractionDigits: 0,
  }).format(n)
}

function normalizeDateInput(value) {
  if (!value) return null
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? null : d
}

export function formatDate(value, lng) {
  const d = normalizeDateInput(value)
  if (!d) return ''
  return new Intl.DateTimeFormat(localeTagFromI18n(lng), {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d)
}

export function formatDateTime(value, lng) {
  const d = normalizeDateInput(value)
  if (!d) return ''
  return new Intl.DateTimeFormat(localeTagFromI18n(lng), {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

/** @returns {number|null} 按日人均 CNY 折算的美元整数（约） */
export function approxUsdPerDayFromCny(cnyDaily) {
  const n = Number(cnyDaily)
  if (!Number.isFinite(n)) return null
  return Math.max(0, Math.round(n / CNY_PER_USD))
}

/** @returns {number|null} CNY 折算美元整数（约） */
export function approxUsdFromCny(cnyAmount) {
  return approxUsdPerDayFromCny(cnyAmount)
}
