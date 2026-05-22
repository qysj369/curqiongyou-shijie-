/**
 * 下载明亮结伴旅行主图 → public/hero-home.jpg（设计稿：蓝天 + 结伴出游）
 * 来源：Unsplash 可商用图；你有本地设计稿请用 install-hero.ps1 覆盖。
 */
import { createWriteStream } from 'fs'
import { pipeline } from 'stream/promises'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const out = join(root, 'public', 'hero-home.jpg')

/** 明亮户外结伴旅行；网络受限时请用 install-hero.ps1 放本地设计稿 */
const URL =
  'https://images.unsplash.com/photo-1516026676472-233613957a81?auto=format&fit=crop&w=2400&q=88'

const res = await fetch(URL, { redirect: 'follow' })
if (!res.ok) {
  console.error('[fetch-hero-vibrant] HTTP', res.status)
  process.exit(1)
}
await pipeline(res.body, createWriteStream(out))
console.log('[fetch-hero-vibrant] wrote', out)
