import { useTranslation } from 'react-i18next'
import { socialLinks, socialLinkKeys } from '../config/social'

const LABELS = {
  weibo: '微博',
  douyin: '抖音',
  xiaohongshu: '小红书',
  bilibili: 'B站',
  youtube: 'YouTube',
  twitter: 'Twitter',
  instagram: 'Instagram',
}

export default function SocialFollow({ className = '' }) {
  const { t } = useTranslation()
  const hasAny = socialLinkKeys.some((k) => socialLinks[k])
  if (!hasAny) return null

  return (
    <div className={`text-center ${className}`}>
      <p className="text-amber-400/90 text-sm font-medium mb-1">{t('social.followUs')}</p>
      <p className="text-slate-400 text-xs mb-2">{t('social.followUsDesc')}</p>
      <div className="flex flex-wrap justify-center gap-2">
        {socialLinkKeys.map((key) => {
          const url = socialLinks[key]
          if (!url) return null
          return (
            <a
              key={key}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-700/80 text-slate-200 text-sm hover:bg-amber-500/20 hover:text-amber-300 transition"
            >
              {LABELS[key] || key}
            </a>
          )
        })}
      </div>
    </div>
  )
}
