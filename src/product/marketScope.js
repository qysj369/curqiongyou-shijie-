/**
 * 市场范围（先行策略）
 *
 * 当前阶段只把 **中国版** 当作已搭建、可验收的产品骨架：
 * - 界面与文案：`zh-CN` 单一语言包（见 `src/i18n.js`）
 * - 货币与示意：人民币为主，美元仅为可选参考
 * - 地图与合规：国内链路以高德为主轴；世界底图为过渡/演示同源数据
 *
 * 其它国家与地区沿用同一套代码与数据结构，属于 **待验收的扩展面**：
 * 在单独里程碑（内容、地图、支付/预订、合规与客服）通过评审前，不视为已对访客承诺的交付范围。
 *
 * 复制到新区时：优先拷贝「中国版已验证」的页面与数据管道，再替换目的地库、地图提供商与本地化资源。
 */

/** ISO 3166-1 alpha-2：当前先行市场 */
export const PRIMARY_MARKET_CODE = 'CN'

/** 本构建中参与契约测试的市场代码列表（仅中国） */
export const SUPPORTED_MARKET_CODES = Object.freeze([PRIMARY_MARKET_CODE])

/** @returns {boolean} 是否以中国版为唯一先行市场（当前恒为 true） */
export function isChinaPrimaryMarket() {
  return true
}

/** @param {string} code */
export function isSupportedMarketCode(code) {
  return SUPPORTED_MARKET_CODES.includes(String(code).toUpperCase())
}
