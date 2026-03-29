import { useTranslation } from 'react-i18next'
import { partnerBrands } from '../config/affiliate'

/**
 * 品牌联盟 / 推荐服务展示（佣金、合作推广）
 */
export default function PartnerShowcase({ className = '' }) {
  const { t, i18n } = useTranslation()
  const isEn = i18n.language?.startsWith?.('en') ?? false
  return (
    <section className={className}>
      <h2 className="text-lg font-bold text-slate-800 mb-3">{t('commerce.partnerTitle')}</h2>
      <p className="text-slate-500 text-sm mb-4">{t('commerce.partnerDesc')}</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {partnerBrands.map((p) => (
          <a
            key={p.id}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center text-center p-4 rounded-xl bg-white border border-slate-200 hover:border-amber-200 hover:shadow-md transition"
          >
            <span className="text-2xl mb-2">{p.icon}</span>
            <span className="font-medium text-slate-800 text-sm">{isEn ? p.nameEn : p.name}</span>
            <span className="text-slate-500 text-xs mt-0.5">{isEn ? p.descEn : p.desc}</span>
          </a>
        ))}
      </div>
    </section>
  )
}
