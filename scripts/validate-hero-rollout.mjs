/**
 * 攻略头图按大洲逐一校验：HERO_PHASE 1=亚洲 2=欧洲 3=非洲 4=美洲 5=大洋洲 6=南极洲 7=全站；0=跳过。
 *
 * - 默认 HERO_PHASE=0：跳过（不阻断 validate:all）。
 * - 子命令 `report`：按 1→6 各打印该洲范围内问题篇数（默认 exit 0）。
 * - HERO_STRICT=1：存在问题则 exit 1。
 */
import { articles } from '../src/data/articlesData.js'
import { extractUnsplashPhotoId } from '../src/data/coverGeoAllowlist.js'
import {
  heroPhaseMeta,
  HERO_AUDIT_SEQUENCE,
  isDestinationInHeroScope,
  isForbiddenHeroCoverForScope,
} from '../src/data/heroCoverRollout.js'

const argvMode = process.argv[2]
const phaseRaw = argvMode === 'report' ? undefined : process.env.HERO_PHASE
const phase = /** @type {0|1|2|3|4|5|6|7} */ (
  phaseRaw === undefined || phaseRaw === '' ? 0 : Number(phaseRaw)
)
const strict = process.env.HERO_STRICT === '1' || process.env.HERO_STRICT === 'true'

function collectProblemsForPhase(p) {
  const problems = []
  for (const a of articles) {
    const dest = a.destination
    if (!dest || !isDestinationInHeroScope(dest, p)) continue
    const id = extractUnsplashPhotoId(a.cover)
    if (isForbiddenHeroCoverForScope(dest, id, a.title || '')) {
      problems.push({
        id: a.id,
        destination: dest,
        title: a.title,
        photoId: id,
        cover: a.cover,
      })
    }
  }
  return problems
}

if (argvMode === 'report') {
  console.log('=== 头图占位问题按洲统计（纠错顺序：亚洲→欧洲→非洲→美洲→大洋洲→南极洲）===\n')
  let total = 0
  const seen = new Set()
  for (const row of HERO_AUDIT_SEQUENCE) {
    const probs = collectProblemsForPhase(row.phase)
    for (const x of probs) seen.add(x.id)
    total += probs.length
    console.log(`${row.label}（HERO_PHASE=${row.phase}）: ${probs.length} 篇`)
  }
  console.log('')
  console.log(`合计（各洲篇数相加）: ${total}；去重篇数: ${seen.size}（通常二者相等）`)
  console.log('')
  console.log('单项检查：设置 HERO_PHASE=1..6 或 7（全站）；HERO_STRICT=1 失败时 exit 1。\n')
  process.exit(0)
}

if (phase === 0) {
  console.log(
    'validate:hero SKIPPED — HERO_PHASE=0。顺序：1亚洲 2欧洲 3非洲 4美洲 5大洋洲 6南极洲 7全站；子命令 report 可看各洲篇数。',
  )
  process.exit(0)
}

const problems = collectProblemsForPhase(phase)

const meta = heroPhaseMeta(/** @type {1|2|3|4|5|6} */ (phase))
const phaseLabel =
  phase === 7
    ? '全站'
    : meta
      ? meta.label
      : String(phase)

if (problems.length === 0) {
  console.log(`validate:hero OK — HERO_PHASE=${phase}（${phaseLabel}），范围内无禁用占位封面。`)
  process.exit(0)
}

console.error(
  `validate:hero — HERO_PHASE=${phase}（${phaseLabel}）发现 ${problems.length} 篇攻略仍使用禁用占位封面。\n`,
)
for (const p of problems.slice(0, 25)) {
  console.error(`— ${p.id} [${p.destination}] photo-id=${p.photoId}`)
  console.error(`  ${p.title?.slice?.(0, 72)}…\n`)
}
if (problems.length > 25) console.error(`… 另有 ${problems.length - 25} 条。\n`)

if (strict) {
  console.error('HERO_STRICT=1：构建失败。\n')
  process.exit(1)
}

console.error('（宽容模式 exit 0。上线前 CI 可设 HERO_STRICT=1。）\n')
process.exit(0)
