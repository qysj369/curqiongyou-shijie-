/**
 * 打印全站目的地按洲纠错顺序：亚洲 → 欧洲 → 非洲 → 美洲（北美+南美）→ 大洋洲 → 南极洲。
 * 用法: node scripts/report-hero-audit-order.mjs
 */
import { heroAuditBatchesInOrder } from '../src/data/heroCoverRollout.js'

const batches = heroAuditBatchesInOrder()

console.log('=== 网站目的地头图/地标纠错顺序（逐洲覆盖）===\n')
console.log('原则：**先亚洲**，再按洲推进，直至覆盖**全部国家**；全站复查为 (7)。\n')
console.log('顺序：亚洲(1) → 欧洲(2) → 非洲(3) → 美洲(4) → 大洋洲(5) → 南极洲(6) → 全站复查(7)\n')
console.log('校验：HERO_PHASE=1..6 单洲，HERO_PHASE=7 全站；详见 npm run validate:hero:report\n')

for (const { region, phase, destinations } of batches) {
  console.log(`【${region}】HERO_PHASE=${phase} · 共 ${destinations.length} 个目的地`)
  console.log(destinations.join('、'))
  console.log('')
}
