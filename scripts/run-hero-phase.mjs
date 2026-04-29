/**
 * 逐个洲跑头图校验：不必手写环境变量。
 * 用法: node scripts/run-hero-phase.mjs <1|2|3|4|5|6|7>
 *   1亚洲 2欧洲 3非洲 4美洲 5大洋洲 6南极洲 7全站
 */
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const phase = process.argv[2]

if (phase === undefined || phase === '' || !/^[1-7]$/.test(phase)) {
  console.log('用法: node scripts/run-hero-phase.mjs <1|2|3|4|5|6|7>')
  console.log('  1=亚洲 2=欧洲 3=非洲 4=美洲 5=大洋洲 6=南极洲 7=全站')
  console.log('可选: HERO_STRICT=1 存在问题则 exit 1')
  process.exit(phase === undefined || phase === '' ? 1 : 0)
}

const script = path.join(__dirname, 'validate-hero-rollout.mjs')
const r = spawnSync(process.execPath, [script], {
  env: { ...process.env, HERO_PHASE: phase },
  stdio: 'inherit',
})
process.exit(r.status ?? 1)
