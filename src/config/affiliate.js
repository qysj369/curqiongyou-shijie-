/**
 * 电商变现配置：机票、酒店、当地游等链接（可替换为带佣金的联盟链接）
 * 通过环境变量 VITE_LINK_FLIGHTS / VITE_LINK_HOTELS / VITE_LINK_TOURS 覆盖
 */
const getEnv = (key, fallback) => (typeof import.meta !== 'undefined' && import.meta.env?.[key]) || fallback

function withDest(url, dest) {
  if (!url || url === '#') return url
  const encoded = encodeURIComponent(dest || '')
  return url.replace(/\{\{dest\}\}/gi, encoded)
}

/** 基础链接（可带联盟 ID），支持占位符 {{dest}} 用于目的地名 */
export function getServiceLinks(destinationName = '') {
  const dest = destinationName || ''
  const q = encodeURIComponent(dest)
  return {
    flights: withDest(getEnv('VITE_LINK_FLIGHTS', `https://www.google.com/search?q=${q}+机票+比价`), dest) || '#',
    hotels: withDest(getEnv('VITE_LINK_HOTELS', `https://www.google.com/search?q=${q}+酒店+预订`), dest) || '#',
    tours: withDest(getEnv('VITE_LINK_TOURS', `https://www.google.com/search?q=${q}+当地游+一日游`), dest) || '#',
  }
}

/**
 * 品牌联盟 / 推荐服务（佣金、合作推广）
 * 可在运行时或构建时替换为实际合作方
 */
export const partnerBrands = [
  {
    id: 'flights',
    name: '机票比价',
    nameEn: 'Flight compare',
    desc: '比价下单，省下一程路费',
    descEn: 'Compare and save on flights',
    url: getEnv('VITE_LINK_FLIGHTS', 'https://www.google.com/search?q=机票比价'),
    icon: '✈️',
  },
  {
    id: 'hotels',
    name: '酒店预订',
    nameEn: 'Hotels',
    desc: '青旅到民宿，按预算选',
    descEn: 'Hostels to stays by budget',
    url: getEnv('VITE_LINK_HOTELS', 'https://www.google.com/search?q=酒店预订'),
    icon: '🏨',
  },
  {
    id: 'tours',
    name: '当地游',
    nameEn: 'Local tours',
    desc: '一日游、体验活动',
    descEn: 'Day tours & experiences',
    url: getEnv('VITE_LINK_TOURS', 'https://www.google.com/search?q=当地游'),
    icon: '🎫',
  },
  {
    id: 'insurance',
    name: '旅行保险',
    nameEn: 'Travel insurance',
    desc: '出行前备一份安心',
    descEn: 'Cover before you go',
    url: getEnv('VITE_LINK_INSURANCE', 'https://www.google.com/search?q=旅行保险'),
    icon: '🛡️',
  },
]
