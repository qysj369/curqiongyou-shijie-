/**
 * 天坛结伴风格主图（接近设计稿）→ public/hero-home.jpg
 * 若你有千图/设计稿原图，请用: node scripts/install-hero.mjs "<路径>"
 */
import { createWriteStream } from 'fs'
import { pipeline } from 'stream/promises'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { spawnSync } from 'child_process'

const candidates = [
  'https://images.unsplash.com/photo-1547981609-4b6a09b7a341?auto=format&fit=crop&w=2400&q=88',
  'https://images.unsplash.com/photo-1516026676472-233613957a81?auto=format&fit=crop&w=2400&q=88',
  'https://images.unsplash.com/photo-1529156069898-bcefb029e104?auto=format&fit=crop&w=2400&q=88',
]

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const out = join(root, 'public', 'hero-home.jpg')

let ok = false
for (const url of candidates) {
  try {
    const res = await fetch(url, { redirect: 'follow', headers: { 'User-Agent': 'RoamwiseBuild/1' } })
    if (!res.ok) {
      console.warn('[fetch-hero-temple] skip', res.status, url)
      continue
    }
    await pipeline(res.body, createWriteStream(out))
    console.log('[fetch-hero-temple] ok', url)
    ok = true
    break
  } catch (e) {
    console.warn('[fetch-hero-temple] fail', url, e.message)
  }
}

if (!ok) {
  console.error('[fetch-hero-temple] 全部下载失败。请用设计稿文件:')
  console.error('  node scripts/install-hero.mjs "你的图片路径.jpg"')
  process.exit(1)
}

spawnSync('npm', ['run', 'resize-hero'], { cwd: root, stdio: 'inherit', shell: true })
