/**
 * 校验攻略 cover 的 Unsplash id 是否在「目的地允许集合」内（结构白名单 + coverAllowlistExtras）。
 */
import { articles } from '../src/data/articlesData.js'
import { buildFullCoverAllowlistByDestination, extractUnsplashPhotoId, isCoverAllowedForDestination } from '../src/data/coverGeoAllowlist.js'

const full = buildFullCoverAllowlistByDestination()
const problems = []

function checkUrl(dest, url, label, article) {
  const r = isCoverAllowedForDestination(dest, url, full)
  if (r.ok) return
  problems.push({
    id: article.id,
    destination: dest,
    title: article.title,
    field: label,
    url,
    photoId: r.id,
  })
}

for (const a of articles) {
  const dest = a.destination
  if (!dest) continue
  checkUrl(dest, a.cover, 'cover', a)
  const g = a.gallery
  if (Array.isArray(g)) {
    g.forEach((u, i) => checkUrl(dest, u, `gallery[${i}]`, a))
  }
}

if (problems.length === 0) {
  console.log(`validate:cover OK — ${articles.length} articles checked.`)
  process.exit(0)
}

console.error(`validate:cover FAILED — ${problems.length} problem(s):\n`)
for (const p of problems.slice(0, 80)) {
  console.error(`— ${p.id} [${p.destination}] ${p.field}`)
  console.error(`  title: ${p.title}`)
  console.error(`  photoId: ${p.photoId} (not allowed for this destination)`)
  console.error(`  url: ${p.url?.slice?.(0, 100)}…`)
  console.error('')
}
if (problems.length > 80) console.error(`… and ${problems.length - 80} more.\n`)
console.error('Tip: run `node scripts/sync-cover-extras.mjs` after confirming covers are geographically correct, or fix the cover URL.\n')
process.exit(1)
