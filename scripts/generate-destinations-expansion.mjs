/**
 * 生成「联合国 193 国中尚未收录的会员国 + 观察员/联系实体」目的地条目，
 * 写入 src/data/destinationsExpansionData.js，并更新 budgetRouteGenerator DESTINATION_NAMES。
 * 用法：node scripts/generate-destinations-expansion.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { DESTINATION_NAMES } from '../src/data/budgetRouteGenerator.js'
import { UN_193_MEMBER_NAMES_ZH, EXTRA_DESTINATION_NAMES_ZH } from '../src/data/un193MembersZh.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const IMG = {
  亚洲: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=600',
  欧洲: 'https://images.unsplash.com/photo-1559827260-dc66d43bef33?w=600',
  非洲: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=600',
  北美: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600',
  南美: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=600',
  大洋洲: 'https://images.unsplash.com/photo-1523482580671-f216ba185ece?w=600',
  南极: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600',
}

/** 中文国名 → 大洲（联合国地域粗分） */
const NAME_CONTINENT = new Map(
  [
    [
      [
        '阿尔及利亚',
        '安哥拉',
        '贝宁',
        '博茨瓦纳',
        '布基纳法索',
        '布隆迪',
        '佛得角',
        '喀麦隆',
        '中非',
        '乍得',
        '科摩罗',
        '刚果（布）',
        '刚果（金）',
        '科特迪瓦',
        '吉布提',
        '埃及',
        '赤道几内亚',
        '厄立特里亚',
        '斯威士兰',
        '埃塞俄比亚',
        '加蓬',
        '冈比亚',
        '加纳',
        '几内亚',
        '几内亚比绍',
        '肯尼亚',
        '莱索托',
        '利比里亚',
        '利比亚',
        '马达加斯加',
        '马拉维',
        '马里',
        '毛里塔尼亚',
        '毛里求斯',
        '摩洛哥',
        '莫桑比克',
        '纳米比亚',
        '尼日尔',
        '尼日利亚',
        '卢旺达',
        '圣多美和普林西比',
        '塞内加尔',
        '塞舌尔',
        '塞拉利昂',
        '索马里',
        '南非',
        '南苏丹',
        '苏丹',
        '坦桑尼亚',
        '多哥',
        '突尼斯',
        '乌干达',
        '赞比亚',
        '津巴布韦',
      ],
      '非洲',
    ],
    [
      [
        '加拿大',
        '美国',
        '墨西哥',
        '伯利兹',
        '哥斯达黎加',
        '萨尔瓦多',
        '危地马拉',
        '洪都拉斯',
        '尼加拉瓜',
        '巴拿马',
        '巴哈马',
        '巴巴多斯',
        '多米尼克',
        '多米尼加',
        '格林纳达',
        '海地',
        '牙买加',
        '圣基茨和尼维斯',
        '圣卢西亚',
        '圣文森特和格林纳丁斯',
        '特立尼达和多巴哥',
        '安提瓜和巴布达',
        '古巴',
      ],
      '北美',
    ],
    [
      [
        '阿根廷',
        '玻利维亚',
        '巴西',
        '智利',
        '哥伦比亚',
        '厄瓜多尔',
        '圭亚那',
        '巴拉圭',
        '秘鲁',
        '苏里南',
        '乌拉圭',
        '委内瑞拉',
      ],
      '南美',
    ],
    [
      [
        '澳大利亚',
        '斐济',
        '基里巴斯',
        '马绍尔群岛',
        '密克罗尼西亚联邦',
        '瑙鲁',
        '新西兰',
        '帕劳',
        '巴布亚新几内亚',
        '萨摩亚',
        '所罗门群岛',
        '汤加',
        '图瓦卢',
        '瓦努阿图',
      ],
      '大洋洲',
    ],
    [
      [
        '奥地利',
        '比利时',
        '波黑',
        '保加利亚',
        '克罗地亚',
        '捷克',
        '丹麦',
        '爱沙尼亚',
        '芬兰',
        '法国',
        '德国',
        '希腊',
        '匈牙利',
        '冰岛',
        '爱尔兰',
        '意大利',
        '拉脱维亚',
        '列支敦士登',
        '立陶宛',
        '卢森堡',
        '马耳他',
        '摩纳哥',
        '黑山',
        '荷兰',
        '北马其顿',
        '挪威',
        '波兰',
        '葡萄牙',
        '摩尔多瓦',
        '罗马尼亚',
        '圣马力诺',
        '塞尔维亚',
        '斯洛伐克',
        '斯洛文尼亚',
        '西班牙',
        '瑞典',
        '瑞士',
        '乌克兰',
        '英国',
        '安道尔',
        '阿尔巴尼亚',
        '白俄罗斯',
        '俄罗斯',
      ],
      '欧洲',
    ],
    [
      [
        '阿富汗',
        '巴林',
        '孟加拉国',
        '不丹',
        '文莱',
        '柬埔寨',
        '中国',
        '朝鲜',
        '韩国',
        '印度',
        '印度尼西亚',
        '伊朗',
        '伊拉克',
        '以色列',
        '日本',
        '约旦',
        '哈萨克斯坦',
        '科威特',
        '吉尔吉斯斯坦',
        '老挝',
        '黎巴嫩',
        '马来西亚',
        '马尔代夫',
        '蒙古',
        '缅甸',
        '尼泊尔',
        '阿曼',
        '巴基斯坦',
        '巴勒斯坦',
        '菲律宾',
        '卡塔尔',
        '沙特阿拉伯',
        '新加坡',
        '斯里兰卡',
        '叙利亚',
        '塔吉克斯坦',
        '泰国',
        '东帝汶',
        '土耳其',
        '土库曼斯坦',
        '阿联酋',
        '乌兹别克斯坦',
        '越南',
        '也门',
        '格鲁吉亚',
        '亚美尼亚',
        '阿塞拜疆',
        '塞浦路斯',
      ],
      '亚洲',
    ],
    [['巴勒斯坦'], '亚洲'],
    [['梵蒂冈'], '欧洲'],
    [['库克群岛', '纽埃'], '大洋洲'],
  ].flatMap(([names, c]) => names.map((n) => [n, c])),
)

/** 未列入上面的用亚洲兜底（应极少） */
function continentOf(name) {
  return NAME_CONTINENT.get(name) ?? '亚洲'
}

function regionHint(name, continent) {
  if (continent === '非洲') return '撒哈拉以南/北非（行前分区核对）'
  if (continent === '欧洲') return '西欧/东欧（申根与签证政策依行程）'
  if (continent === '北美') return name === '加拿大' || name === '美国' ? '北美' : '中美/加勒比'
  if (continent === '南美') return '南美'
  if (continent === '大洋洲') return '太平洋'
  if (continent === '南极') return '南极'
  return '西亚/中亚/南亚/东亚（行前核对）'
}

const existing = new Set(DESTINATION_NAMES)
const target = [...UN_193_MEMBER_NAMES_ZH, ...EXTRA_DESTINATION_NAMES_ZH]
const toAdd = target.filter((n) => !existing.has(n)).sort((a, b) => a.localeCompare(b, 'zh-Hans-CN'))

let nextId = 130
const rows = []
for (const name of toAdd) {
  const continent = name === '南极洲' ? '南极' : continentOf(name)
  const cont =
    continent === '南极' ? '南极洲' : continent === '南美' ? '南美' : continent === '北美' ? '北美' : continent === '大洋洲' ? '大洋洲' : continent === '非洲' ? '非洲' : continent === '欧洲' ? '欧洲' : '亚洲'
  const imgKey =
    continent === '南极' ? '南极' : continent === '南美' ? '南美' : continent === '北美' ? '北美' : continent === '大洋洲' ? '大洋洲' : continent === '非洲' ? '非洲' : continent === '欧洲' ? '欧洲' : '亚洲'
  const img = IMG[imgKey] ?? IMG.亚洲
  rows.push({
    id: String(nextId++),
    name,
    country: name,
    region: regionHint(name, continent === '南极' ? '南极' : continent),
    continent: cont,
    dailyBudget:
      continent === '欧洲' || continent === '北美'
        ? 340
        : continent === '大洋洲'
          ? 340
          : continent === '非洲'
            ? 220
            : continent === '南美'
              ? 260
              : 260,
    visaType: '行前核对签证与入境政策',
    tags: ['全球目的地', '穷游参考'],
    image: img,
    routeCount: 2,
    description: `${name}：联合国会员国或常用旅行目的地；行前核对签证、安全与交通。`,
  })
}

const outPath = path.join(__dirname, '../src/data/destinationsExpansionData.js')
fs.writeFileSync(outPath, '/**\n * 由 scripts/generate-destinations-expansion.mjs 生成。\n */\nexport const DESTINATIONS_EXPANSION = ' + JSON.stringify(rows, null, 2) + '\n', 'utf8')
console.log('written', outPath, 'rows', rows.length)

/** 生成完整 DESTINATION_NAMES 导出片段（供粘贴） */
const fullNames = [...new Set([...DESTINATION_NAMES, ...target])].sort((a, b) => a.localeCompare(b, 'zh-Hans-CN'))
console.log('total destinations:', fullNames.length)

const namesPath = path.join(__dirname, '../src/data/generatedDestinationNames.txt')
fs.writeFileSync(namesPath, JSON.stringify(fullNames, null, 2), 'utf8')
console.log('wrote name list for budgetRouteGenerator:', namesPath)
