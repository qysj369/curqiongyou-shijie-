/**
 * 主图（PRIMARY_IMAGE_BY_COUNTRY）Unsplash photo-id 复用分析：
 * - 跨大洲共用同一主图 → 高概率地理标志错误
 * - 同洲但子区域差异大（尤其亚洲：西亚 vs 东南亚 等）→ 高风险
 * - 其余同图多国家 → 供抽查（多为泛用风光占位）
 *
 * 用法：
 *   node scripts/analyze-primary-image-collisions.mjs
 *   node scripts/analyze-primary-image-collisions.mjs --json
 *   node scripts/analyze-primary-image-collisions.mjs --fail-on-risk   # 存在跨洲或亚洲子区冲突时 exit 1
 */
import { PRIMARY_IMAGE_BY_COUNTRY } from '../src/data/destinationPrimaryImages.js'
import { destinations } from '../src/data/mockData.js'

function extractUnsplashPhotoId(url) {
  const m = /images\.unsplash\.com\/photo-(\d+)-/i.exec(url || '')
  return m ? m[1] : null
}

/** 完整 slug，避免只显示时间戳片段 */
function photoSlugFromUrl(url) {
  const m = /images\.unsplash\.com\/photo-(\d+-[a-f0-9]+)/i.exec(url || '')
  return m ? m[1] : extractUnsplashPhotoId(url) || '?'
}

/** @type {Map<string, { continent: string, region: string }>} */
const metaByName = new Map(
  destinations.map((d) => [d.name, { continent: d.continent || '', region: d.region || '' }]),
)

/**
 * 粗分子区域，用于同大洲内发现「西亚图配到东南亚」等错配
 * @param {string} name
 */
function geoSubBucket(name) {
  const m = metaByName.get(name)
  if (!m) return '（未在 mockData 注册）'
  const { continent, region } = m
  const r = region
  if (continent === '亚洲') {
    // 必须先匹配「东南亚」，否则「东南亚」含子串「南亚」会被误判
    if (/东南亚/.test(r)) return '亚洲·东南亚'
    // 须在「东亚」之前：复合 region 常含「…/东亚」，避免误桶到东亚
    if (/中亚/.test(r) || /西亚|中东|高加索/.test(r)) return '亚洲·西亚与中亚（粗分）'
    if (/东亚/.test(r)) return '亚洲·东亚'
    if (/南亚/.test(r)) return '亚洲·南亚'
    return `亚洲·其他（${r.slice(0, 12)}）`
  }
  if (continent === '欧洲') {
    if (/东欧|中欧|巴尔干|北欧|西欧|南欧|波罗的海|地中海/.test(r)) {
      if (/北欧/.test(r)) return '欧洲·北欧'
      if (/东欧|巴尔干|中欧|波罗的海|地中海/.test(r)) return '欧洲·中东欧与地中海/波罗的海（粗分）'
      return `欧洲·${r.slice(0, 8)}`
    }
    return '欧洲·其他'
  }
  if (continent === '非洲') {
    // 「东南非洲」含子串「南非」，须先于「南非」单独匹配
    if (/东南非洲/.test(r)) return '非洲·次撒哈拉（粗分）'
    // 次撒哈拉广域：含印度洋岛国（与撒哈拉以南占位图策略一致，避免假阳性子区冲突）
    if (/撒哈拉以南|南部非洲|东非|东部非洲|西非|南非|中非/.test(r) || /印度洋/.test(r))
      return '非洲·次撒哈拉（粗分）'
    if (/北非|马格里布/.test(r)) return '非洲·北非'
    if (/撒哈拉/.test(r)) return '非洲·撒哈拉地带'
    return '非洲·其他'
  }
  if (continent === '北美') {
    // 「中美洲」含子串「中美」；墨西哥主图常与加勒比/中美共用，按名称并入粗分桶
    if (name === '墨西哥' || /加勒比|中美/.test(r)) return '北美·中美与加勒比（粗分）'
    return '北美·其他'
  }
  return continent || '未知'
}

/** @param {string[]} names */
function uniqueContinents(names) {
  return [...new Set(names.map((n) => metaByName.get(n)?.continent).filter(Boolean))]
}

/** @param {string[]} names */
function uniqueSubBuckets(names) {
  return [...new Set(names.map((n) => geoSubBucket(n)))]
}

const args = process.argv.slice(2)
const jsonOut = args.includes('--json')
const failOnRisk = args.includes('--fail-on-risk')

/** @type {Map<string, string[]>} */
const idToCountries = new Map()

for (const [name, url] of Object.entries(PRIMARY_IMAGE_BY_COUNTRY)) {
  const id = extractUnsplashPhotoId(url)
  if (!id) continue
  if (!idToCountries.has(id)) idToCountries.set(id, [])
  idToCountries.get(id).push(name)
}

const crossContinent = []
const crossSubBucket = []
const sameBucketDupes = []

for (const [id, countries] of idToCountries) {
  if (countries.length < 2) continue
  const sorted = [...countries].sort((a, b) => a.localeCompare(b, 'zh-Hans-CN'))
  const continents = uniqueContinents(sorted)
  const buckets = uniqueSubBuckets(sorted)

  const sampleUrl = PRIMARY_IMAGE_BY_COUNTRY[sorted[0]]
  const entry = {
    photoId: id,
    photoSlug: photoSlugFromUrl(sampleUrl),
    count: sorted.length,
    countries: sorted,
    continents,
    subBuckets: buckets,
    sampleUrl,
  }

  if (continents.length > 1) {
    crossContinent.push(entry)
    continue
  }
  if (buckets.length > 1) {
    crossSubBucket.push(entry)
    continue
  }
  sameBucketDupes.push(entry)
}

sameBucketDupes.sort((a, b) => b.count - a.count)
crossSubBucket.sort((a, b) => b.count - a.count)
crossContinent.sort((a, b) => b.count - a.count)

const report = {
  summary: {
    totalDestinations: Object.keys(PRIMARY_IMAGE_BY_COUNTRY).length,
    uniquePhotoIds: idToCountries.size,
    crossContinentClusters: crossContinent.length,
    crossSubBucketClusters: crossSubBucket.length,
    sameBucketDuplicateClusters: sameBucketDupes.length,
  },
  crossContinent,
  crossSubBucket,
  /** 仅列出复用最多的前 40 组同桶重复，避免刷屏 */
  sameBucketDupesTop: sameBucketDupes.slice(0, 40),
}

if (jsonOut) {
  console.log(JSON.stringify(report, null, 2))
} else {
  console.log('=== 主图 Unsplash photo-id 复用分析 ===\n')
  console.log(
    `目的地 ${report.summary.totalDestinations} 个；不同 photo-id ${report.summary.uniquePhotoIds} 个。\n`,
  )

  if (crossContinent.length === 0) {
    console.log('【跨大洲复用】无（同一 photo-id 未同时出现在两个大洲）。\n')
  } else {
    console.log(`【跨大洲复用】${crossContinent.length} 组 — 高概率地理标志错误，应优先拆开：\n`)
    for (const x of crossContinent) {
      console.log(`  photo-${x.photoSlug} ×${x.count}`)
      console.log(`    大洲: ${x.continents.join(' / ')}`)
      console.log(`    国家: ${x.countries.join('、')}`)
      console.log(`    示例 URL: ${x.sampleUrl}\n`)
    }
  }

  if (crossSubBucket.length === 0) {
    console.log('【同洲但子区域冲突】无。\n')
  } else {
    console.log(
      `【同洲但子区域冲突】${crossSubBucket.length} 组 — 常见于「西亚街景 vs 东南亚海滩」等，建议核对：\n`,
    )
    for (const x of crossSubBucket.slice(0, 30)) {
      console.log(`  photo-${x.photoSlug} ×${x.count}`)
      console.log(`    子区域: ${x.subBuckets.join(' / ')}`)
      console.log(`    国家: ${x.countries.join('、')}\n`)
    }
    if (crossSubBucket.length > 30) console.log(`  … 另有 ${crossSubBucket.length - 30} 组未展开\n`)
  }

  console.log(
    `【同子区域内多国家共用】${sameBucketDupes.length} 组（多为泛用占位；已按复用次数排序列出前 40 组）：\n`,
  )
  for (const x of report.sameBucketDupesTop) {
    console.log(
      `  ${x.photoSlug} ×${x.count}  [${x.subBuckets[0] || '?'}]  ${x.countries.slice(0, 8).join('、')}${x.countries.length > 8 ? '…' : ''}`,
    )
  }
  console.log('\n提示: 加 --json 可输出完整 JSON；改主图请编辑 primaryImageGeoFixes.js 或 PRIMARY_IMAGE_BASE。')
}

const riskCount = crossContinent.length + crossSubBucket.length
if (failOnRisk && riskCount > 0) {
  console.error(`\nanalyze-primary-image-collisions: 发现 ${riskCount} 组风险复用（跨洲 ${crossContinent.length} + 子区 ${crossSubBucket.length}），退出码 1。`)
  process.exit(1)
}

process.exit(0)
