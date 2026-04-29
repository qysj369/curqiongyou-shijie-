/**
 * 由 public/hero-home.jpg 生成多宽度版本供 srcset 使用（构建前运行）。
 */
import { existsSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicDir = join(__dirname, '..', 'public')
const src = join(publicDir, 'hero-home.jpg')

if (!existsSync(src)) {
  console.warn('[resize-hero] skip: public/hero-home.jpg not found')
  process.exit(0)
}

const widths = [640, 960, 1280, 1920]

for (const w of widths) {
  const out = join(publicDir, `hero-home-${w}w.jpg`)
  await sharp(src)
    .resize({ width: w, withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(out)
  console.log('[resize-hero]', `hero-home-${w}w.jpg`)
}
