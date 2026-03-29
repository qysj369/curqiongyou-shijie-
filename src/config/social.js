/**
 * 各大媒体 / 视频站无缝链接
 * 通过环境变量配置官方账号或分享链接，未配置的入口不展示
 */
const env = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : {}

function get(key, fallback = '') {
  const v = env[key]
  return (v && String(v).trim()) || fallback
}

/** 分享到微博（带当前页 url/title） */
export function getWeiboShareUrl(url = '', title = '') {
  const u = encodeURIComponent(url || (typeof window !== 'undefined' ? window.location.href : ''))
  const t = encodeURIComponent(title || (typeof document !== 'undefined' ? document.title : ''))
  return `https://service.weibo.com/share/share.php?url=${u}&title=${t}`
}

/** 分享到 Twitter/X */
export function getTwitterShareUrl(url = '', text = '') {
  const u = url || (typeof window !== 'undefined' ? window.location.href : '')
  const t = text || (typeof document !== 'undefined' ? document.title : '')
  return `https://twitter.com/intent/tweet?url=${encodeURIComponent(u)}&text=${encodeURIComponent(t)}`
}

/** 分享到 QQ 空间 */
export function getQZoneShareUrl(url = '', title = '') {
  const u = encodeURIComponent(url || (typeof window !== 'undefined' ? window.location.href : ''))
  const t = encodeURIComponent(title || (typeof document !== 'undefined' ? document.title : ''))
  return `https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=${u}&title=${t}`
}

/** 关注我们 - 各平台官方账号链接（未配置则不显示该入口） */
export const socialLinks = {
  weibo: get('VITE_LINK_WEIBO'),
  douyin: get('VITE_LINK_DOUYIN'),
  xiaohongshu: get('VITE_LINK_XIAOHONGSHU'),
  bilibili: get('VITE_LINK_BILIBILI'),
  youtube: get('VITE_LINK_YOUTUBE'),
  twitter: get('VITE_LINK_TWITTER'),
  instagram: get('VITE_LINK_INSTAGRAM'),
}

export const socialLinkKeys = Object.keys(socialLinks)
