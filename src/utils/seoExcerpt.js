/**
 * @param {string} text
 * @param {{ maxLen?: number, stripMarkdown?: boolean }} [opts]
 */
export function excerptForMeta(text, opts = {}) {
  const maxLen = opts.maxLen ?? 155
  const stripMarkdown = opts.stripMarkdown ?? false
  if (!text || typeof text !== 'string') return ''
  let s = text
  if (stripMarkdown) s = s.replace(/[#*|`\[\]_]/g, ' ')
  const plain = s.replace(/\s+/g, ' ').trim()
  if (plain.length <= maxLen) return plain
  return `${plain.slice(0, maxLen)}…`
}
