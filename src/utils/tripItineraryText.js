const KIND_LABEL = {
  blue: '观景/免费',
  green: '吃喝省钱',
  orange: '交通/住宿',
}

function kindLabel(kind) {
  return KIND_LABEL[kind] || kind || '点位'
}

/**
 * 将单条行程线格式化为可读的 Markdown（内容导出用）。
 * @param {object} spec
 * @param {{ legLabel?: string }} [opts]
 */
export function formatItineraryLegMarkdown(spec, opts = {}) {
  if (!spec) return ''
  const lines = []
  const legLabel = opts.legLabel ? `（${opts.legLabel}）` : ''
  lines.push(`# ${spec.title || spec.destination || '行程'}${legLabel}`)
  lines.push('')
  lines.push(
    `- **目的地**：${spec.destination || '—'}`,
    `- **总预算**：约 ¥${spec.totalBudget ?? '—'}`,
    `- **天数**：${spec.days?.length ?? 0} 天`,
  )
  lines.push('')
  for (const d of spec.days || []) {
    lines.push(`## 第 ${d.day} 天 · ${d.theme || '行程'}`)
    lines.push('')
    lines.push(`- **当日预算**：约 ¥${d.dayBudget ?? '—'}`)
    lines.push(`- **交通**：${d.transport || '—'}`)
    lines.push('')
    lines.push('### 点位')
    for (const p of d.pois || []) {
      lines.push(
        `- **${p.name}** · ${kindLabel(p.kind)}${p.budgetHint ? ` · ${p.budgetHint}` : ''}`,
      )
    }
    lines.push('')
  }
  if ((spec.replacements || []).length) {
    lines.push('## 省钱替换')
    lines.push('')
    for (const r of spec.replacements) {
      lines.push(`- ${r.from} → ${r.to}（约省 ¥${r.save}）`)
    }
    lines.push('')
  }
  return lines.join('\n').trim()
}

/**
 * @param {{ primary?: object, alternate?: object, countryCode?: string }} bundle
 */
export function formatItineraryBundleMarkdown(bundle) {
  if (!bundle?.primary) return ''
  const parts = [
    formatItineraryLegMarkdown(bundle.primary, { legLabel: '主推线' }),
    bundle.alternate
      ? formatItineraryLegMarkdown(bundle.alternate, { legLabel: '备选线' })
      : '',
  ].filter(Boolean)
  const header = bundle.countryCode
    ? `> 国家/地区代码：${bundle.countryCode}\n\n`
    : ''
  return `${header}${parts.join('\n\n---\n\n')}`.trim()
}

/**
 * 短摘要（结果区顶部阅读用，纯文本）。
 * @param {object} spec
 */
/**
 * 单日短文案（朋友圈/聊天分享）。
 * @param {object} spec
 * @param {number} dayNum
 */
export function formatItineraryDayShareText(spec, dayNum) {
  if (!spec?.days?.length) return ''
  const d = spec.days.find((x) => Number(x.day) === Number(dayNum))
  if (!d) return ''
  const route = (d.pois || [])
    .map((p) => String(p.name || '').replace(/\s*·\s*.*$/, '').trim())
    .filter(Boolean)
    .join(' → ')
  const dest = spec.destination || '目的地'
  return [
    `【${dest} · 第${d.day}天 · ${d.theme || '行程'}】`,
    `交通：${d.transport || '—'}`,
    route ? `动线：${route}` : '',
    `当日约 ¥${d.dayBudget ?? '—'} · ${spec.title || 'Roamwise 行程'}`,
  ]
    .filter(Boolean)
    .join('\n')
}

export function formatItineraryLegSummary(spec) {
  if (!spec?.days?.length) return ''
  const dayBits = spec.days.map((d) => {
    const names = (d.pois || [])
      .slice(0, 3)
      .map((p) => p.name)
      .filter(Boolean)
    const tail = (d.pois || []).length > 3 ? '…' : ''
    return `第${d.day}天（${d.theme || '行程'}）：${names.join('、')}${tail}`
  })
  return dayBits.join('；')
}
