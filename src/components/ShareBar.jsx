import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import html2canvas from 'html2canvas'
import { useToast } from '../contexts/ToastContext'
import { getWeiboShareUrl, getTwitterShareUrl, getQZoneShareUrl } from '../config/social'

/** 有明确分享 URL 的平台：打开即带当前页链接 */
function getSharePlatforms(shareUrl, shareTitle, shareText) {
  return [
    { key: 'weibo', url: getWeiboShareUrl(shareUrl, shareTitle), labelKey: 'share.weibo' },
    { key: 'twitter', url: getTwitterShareUrl(shareUrl, shareText), labelKey: 'share.twitter' },
    { key: 'qzone', url: getQZoneShareUrl(shareUrl, shareTitle), labelKey: 'share.qzone' },
  ]
}

/** 媒体/视频站首页（复制链接后去发） */
const MEDIA_LINKS = [
  { key: 'douyin', url: 'https://www.douyin.com/', labelKey: 'share.douyin' },
  { key: 'kuaishou', url: 'https://www.kuaishou.com/', labelKey: 'share.kuaishou' },
  { key: 'xiaohongshu', url: 'https://www.xiaohongshu.com/', labelKey: 'share.xiaohongshu' },
  { key: 'bilibili', url: 'https://www.bilibili.com/', labelKey: 'share.bilibili' },
  { key: 'youtube', url: 'https://www.youtube.com/', labelKey: 'share.youtube' },
  { key: 'instagram', url: 'https://www.instagram.com/', labelKey: 'share.instagram' },
]

export default function ShareBar({ articleRef, shareUrl, shareTitle, shareText }) {
  const { t } = useTranslation()
  const { toast } = useToast()
  const [linkCopied, setLinkCopied] = useState(false)
  const [screenshotting, setScreenshotting] = useState(false)
  const toastRef = useRef(null)

  const handleShare = async () => {
    if (navigator.share && shareUrl) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        })
      } catch (err) {
        if (err.name !== 'AbortError') copyLink()
      }
    } else {
      copyLink()
    }
  }

  const copyLink = async () => {
    if (!shareUrl) return
    try {
      await navigator.clipboard.writeText(shareUrl)
      setLinkCopied(true)
      toast(t('share.linkCopied'))
      if (toastRef.current) clearTimeout(toastRef.current)
      toastRef.current = setTimeout(() => setLinkCopied(false), 2000)
    } catch {
      setLinkCopied(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleScreenshot = async () => {
    if (!articleRef?.current) return
    setScreenshotting(true)
    try {
      const canvas = await html2canvas(articleRef.current, {
        useCORS: true,
        scale: 2,
        logging: false,
        backgroundColor: '#ffffff',
      })
      const link = document.createElement('a')
      link.download = `${shareTitle || 'guide'}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (err) {
      console.error(err)
    } finally {
      setScreenshotting(false)
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={handleShare}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-sm font-medium transition"
      >
        <span aria-hidden>📤</span>
        <span>{t('share.share')}</span>
      </button>
      <button
        type="button"
        onClick={copyLink}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-sm font-medium transition"
      >
        <span aria-hidden>{linkCopied ? '✓' : '🔗'}</span>
        <span>{linkCopied ? t('share.linkCopied') : t('share.copyLink')}</span>
      </button>
      <button
        type="button"
        onClick={handlePrint}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-sm font-medium transition"
      >
        <span aria-hidden>🖨️</span>
        <span>{t('share.print')}</span>
      </button>
      <button
        type="button"
        onClick={handleScreenshot}
        disabled={screenshotting}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-sm font-medium transition disabled:opacity-50"
      >
        <span aria-hidden>📷</span>
        <span>{screenshotting ? '...' : t('share.screenshot')}</span>
      </button>
      <span className="text-slate-400 text-sm mx-1">|</span>
      <span className="text-slate-500 text-sm">{t('share.shareTo')}:</span>
      {getSharePlatforms(shareUrl, shareTitle, shareText).map((p) => (
        <a
          key={p.key}
          href={p.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-3 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-amber-100 hover:text-amber-700 text-sm font-medium transition"
        >
          {t(p.labelKey)}
        </a>
      ))}
      {MEDIA_LINKS.map((p) => (
        <a
          key={p.key}
          href={p.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-3 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-amber-100 hover:text-amber-700 text-sm font-medium transition"
        >
          {t(p.labelKey)}
        </a>
      ))}
    </div>
  )
}
