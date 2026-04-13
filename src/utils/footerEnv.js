/**
 * @returns {{ label: string; url: string }[]}
 */
export function parseFriendlyLinks() {
  const raw = typeof import.meta !== 'undefined' && import.meta.env?.VITE_FRIENDLY_LINKS_JSON
    ? String(import.meta.env.VITE_FRIENDLY_LINKS_JSON).trim()
    : ''
  if (!raw) return []
  try {
    const j = JSON.parse(raw)
    if (!Array.isArray(j)) return []
    return j
      .filter((x) => x && typeof x.label === 'string' && typeof x.url === 'string')
      .map((x) => ({ label: x.label.trim(), url: x.url.trim() }))
      .filter((x) => x.label && x.url)
  } catch {
    return []
  }
}

/** 工信部备案号文案，不含「备案」二字也可 */
export function getIcpFilingText() {
  const v = typeof import.meta !== 'undefined' && import.meta.env?.VITE_ICP_FILING
    ? String(import.meta.env.VITE_ICP_FILING).trim()
    : ''
  return v
}
