/**
 * 替换首页主图（支持中文路径，不依赖 PowerShell 引号）
 * 用法：node scripts/install-hero.mjs "C:\Users\Administrator\Desktop\xxx.jpg"
 */
import { copyFileSync, existsSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { spawnSync } from 'child_process'

const src = process.argv[2]
if (!src?.trim()) {
  console.error('用法: node scripts/install-hero.mjs "<图片完整路径>"')
  console.error('例: node scripts/install-hero.mjs "C:\\Users\\Administrator\\Desktop\\161ed02777d7c643e091a3654f63d3cc.jpg"')
  process.exit(1)
}

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dest = join(root, 'public', 'hero-home.jpg')

if (!existsSync(src)) {
  console.error('找不到文件:', src)
  console.error('请运行: node scripts/list-desktop-images.mjs  查看桌面上的图片路径')
  process.exit(1)
}

copyFileSync(src, dest)
console.log('[install-hero] 已复制到 public/hero-home.jpg')

const r = spawnSync('npm', ['run', 'resize-hero'], { cwd: root, stdio: 'inherit', shell: true })
process.exit(r.status === 0 ? 0 : r.status ?? 1)
