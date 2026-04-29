import { approxUsdFromCny, formatInteger } from './localeFormat'

/** 攻略/卡片用预算文案：与页眉 USD 开关一致 */
export function formatGuideBudgetLine(budget, { showUsdApprox, t, lng }) {
  const cny = formatInteger(budget, lng)
  const usd = approxUsdFromCny(budget)
  if (showUsdApprox && usd != null) {
    return t('articleDetail.budgetWithUsd', { cny, usd })
  }
  return `¥${cny}`
}
