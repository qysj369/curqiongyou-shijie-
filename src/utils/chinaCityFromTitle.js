import { CHINA_TRIP_DEFAULT_CITIES } from '../data/chinaTripDefaultCities.js'

/** 列表筛选用：优先展示高频旅游城市 */
export const CHINA_GUIDE_FILTER_CITIES = [
  '成都',
  '西安',
  '厦门',
  '昆明',
  '重庆',
  '杭州',
  '北京',
  '上海',
  '广州',
  '深圳',
  '青岛',
  '大理',
  '丽江',
  '拉萨',
  '乌鲁木齐',
  '哈尔滨',
  '南京',
  '武汉',
  '长沙',
  '桂林',
  '三亚',
  '张家界',
  '苏州',
  '贵阳',
  '福州',
  '天津',
  '西双版纳',
  '大连',
  '济南',
  '郑州',
  '南宁',
  '敦煌',
  '沈阳',
  '海口',
  '洛阳',
  '泉州',
  '黄山',
  '南昌',
  '合肥',
  '太原',
  '银川',
  '威海',
  '呼和浩特',
  '兰州',
  '西宁',
  '烟台',
  '景德镇',
  '石家庄',
  '长春',
  '宁波',
  '无锡',
  '乐山',
  '遵义',
  '扬州',
  '秦皇岛',
  '香格里拉',
  '延吉',
  '湛江',
  '惠州',
  '镇江',
  '腾冲',
  '恩施',
  '常州',
  '绍兴',
  '台州',
  '阆中',
  '凯里',
  '泰州',
  '南通',
  '湖州',
  '芒市',
  '林芝',
  '嘉兴',
  '金华',
  '潍坊',
  '嘉峪关',
  '稻城',
  '义乌',
  '保定',
  '襄阳',
  '宜昌',
  '北海',
  '株洲',
  '常德',
  '岳阳',
  '漳州',
  '连云港',
  '衡阳',
  '湘潭',
  '柳州',
  '淮安',
  '宿迁',
  '赣州',
  '上饶',
  '宜春',
  '攀枝花',
  '库尔勒',
  '西昌',
  '六盘水',
  '兴义',
  '伊宁',
  '喀什',
  '阿勒泰',
  '和田',
  '安顺',
  '铜仁',
  '防城港',
  '日喀则',
  '满洲里',
  '漠河',
  '额济纳',
  '波密',
]

const CITY_POOL = [...new Set([...CHINA_TRIP_DEFAULT_CITIES, ...CHINA_GUIDE_FILTER_CITIES])].sort(
  (a, b) => b.length - a.length,
)

const REGION_IN_TITLE =
  /(北京|天津|上海|重庆|河北|山西|内蒙古|辽宁|吉林|黑龙江|江苏|浙江|安徽|福建|江西|山东|河南|湖北|湖南|广东|广西|海南|四川|贵州|云南|西藏|陕西|甘肃|青海|宁夏|新疆|粤港澳|京津冀|长三角|川西|闽南|西北|青藏)/

/**
 * 从「中国」线路标题推断主城市（最长子串匹配，避免「南昌」误中「南」）。
 * @param {string} title
 * @returns {string|null}
 */
export function inferChinaCityFromTitle(title) {
  const t = String(title || '')
  if (!t) return null
  for (const city of CITY_POOL) {
    if (!t.includes(city)) continue
    if (city === '北海' && /北海道/.test(t)) continue
    return city
  }
  if (/版纳|西双版纳/.test(t)) return '西双版纳'
  if (/德宏|芒市/.test(t)) return '芒市'
  if (/亚丁|稻城/.test(t)) return '稻城'
  if (/喀纳斯|禾木|阿勒泰/.test(t)) return '阿勒泰'
  if (/黄果树|龙宫/.test(t)) return '安顺'
  if (/梵净山/.test(t)) return '铜仁'
  if (/额济纳|胡杨林/.test(t)) return '额济纳'
  if (/波密|桃花沟/.test(t)) return '波密'
  if (/漠河|北极村/.test(t)) return '漠河'
  if (/张家界/.test(t)) return '张家界'
  return null
}

/**
 * @param {string} title
 * @returns {string|null}
 */
export function inferChinaRegionFromTitle(title) {
  const m = String(title || '').match(REGION_IN_TITLE)
  return m ? m[1] : null
}

/**
 * 攻略列表「目的地」筛选：支持国家名、城市名、以及中国线路的 city 字段。
 * @param {{ destination?: string, city?: string, title?: string }} article
 * @param {string} filter 筛选值（非 any）
 */
export function matchesArticleDestinationFilter(article, filter) {
  if (!filter || filter === 'any') return true
  const dest = article?.destination || ''
  const city = article?.city || ''
  const title = article?.title || ''
  if (dest === filter || city === filter) return true
  if (dest === '中国' && filter !== '中国') {
    if (city === filter) return true
    if (title.includes(filter)) return true
    if (inferChinaCityFromTitle(title) === filter) return true
  }
  return false
}
