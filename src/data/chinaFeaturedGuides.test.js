import { describe, it, expect } from 'vitest'
import { articles } from './articlesData.js'
import { getArticleDetail } from './articleContent.js'
import { INTENT_VARIANTS_PER_CITY } from './chinaIntentVariants.js'
import { matchesArticleDestinationFilter } from '../utils/chinaCityFromTitle.js'
import { matchesGuideCard } from '../utils/searchMatch.js'

describe('china featured guides', () => {
  it('includes featured articles with city field', () => {
    const chengdu = articles.find((a) => a.id === 'cn-feat-chengdu')
    expect(chengdu?.city).toBe('成都')
    expect(chengdu?.featured).toBe(true)
  })

  it('serves full content for chengdu featured guide', () => {
    const detail = getArticleDetail('cn-feat-chengdu')
    expect(detail?.content).toContain('大熊猫')
    expect(detail?.content).not.toContain('路线骨架')
  })

  it('filters by city on china articles', () => {
    const guilin = articles.filter((a) => matchesArticleDestinationFilter(a, '桂林'))
    expect(guilin.some((a) => a.id === 'cn-feat-guilin')).toBe(true)
    expect(guilin.length).toBeGreaterThan(1)

    const shanghai = articles.filter((a) => matchesArticleDestinationFilter(a, '上海'))
    expect(shanghai.some((a) => a.id === 'cn-feat-shanghai')).toBe(true)

    const chengdu = articles.filter((a) => matchesArticleDestinationFilter(a, '成都'))
    expect(chengdu.some((a) => a.id === 'cn-feat-chengdu')).toBe(true)
    expect(chengdu.length).toBeGreaterThanOrEqual(1 + INTENT_VARIANTS_PER_CITY)
    expect(chengdu.some((a) => a.id === 'cn-var-chengdu-hsr')).toBe(true)
    expect(chengdu.some((a) => a.id === 'cn-var-chengdu-drive')).toBe(true)
    expect(chengdu.some((a) => a.id === 'cn-var-chengdu-photo')).toBe(true)
    expect(chengdu.some((a) => a.id === 'cn-var-chengdu-food')).toBe(true)
    expect(chengdu.some((a) => a.id === 'cn-var-chengdu-couple')).toBe(true)
    expect(chengdu.some((a) => a.id === 'cn-var-chengdu-hike')).toBe(true)
    expect(chengdu.some((a) => a.id === 'cn-var-chengdu-autumn')).toBe(true)
    expect(chengdu.some((a) => a.id === 'cn-var-chengdu-hotspring')).toBe(true)
    expect(chengdu.some((a) => a.id === 'cn-var-chengdu-winter')).toBe(true)
    expect(chengdu.some((a) => a.id === 'cn-var-chengdu-night')).toBe(true)
    expect(chengdu.some((a) => a.id === 'cn-var-chengdu-blossom')).toBe(true)
    expect(chengdu.some((a) => a.id === 'cn-var-chengdu-pet')).toBe(true)
    expect(chengdu.length).toBeGreaterThanOrEqual(1 + INTENT_VARIANTS_PER_CITY)
  })

  it('ships intent variants per featured city', () => {
    const variants = articles.filter((a) => a.intentVariant && a.id.startsWith('cn-var-'))
    const featured = articles.filter((a) => a.featured && a.id.startsWith('cn-feat-'))
    expect(variants.length).toBe(featured.length * INTENT_VARIANTS_PER_CITY)
    const hsr = variants.find((a) => a.id === 'cn-var-chengdu-hsr')
    expect(hsr?.guideAnchorId).toBe('cn-feat-chengdu')
    expect(hsr?.contentTier).toBe('intent')
    expect(hsr?.intentKind).toBe('hsr')
    expect(hsr?.intentSummary?.length).toBeGreaterThan(20)
    const drive = variants.find((a) => a.id === 'cn-var-mohe-drive')
    expect(drive?.tags).toContain('自驾')
    expect(drive?.guideAnchorId).toBe('cn-feat-mohe')
  })

  it('matches expanded intent titles in keyword search', () => {
    const drive = articles.find((a) => a.id === 'cn-var-ejina-drive')
    const photo = articles.find((a) => a.id === 'cn-var-guilin-photo')
    const food = articles.find((a) => a.id === 'cn-var-chengdu-food')
    expect(drive).toBeTruthy()
    expect(photo).toBeTruthy()
    expect(food).toBeTruthy()
    expect(matchesGuideCard(drive, '额济纳 自驾')).toBe(true)
    expect(matchesGuideCard(photo, '桂林 摄影')).toBe(true)
    expect(matchesGuideCard(food, '成都 美食')).toBe(true)
    expect(matchesGuideCard(food, '菜市场')).toBe(true)
    const autumn = articles.find((a) => a.id === 'cn-var-ejina-autumn')
    expect(matchesGuideCard(autumn, '额济纳 红叶')).toBe(true)
  })

  it('serves intent variant detail without generic route skeleton', () => {
    const detail = getArticleDetail('cn-var-chengdu-couple')
    expect(detail?.content).toContain('意图摘要')
    expect(detail?.content).toContain('情侣慢游')
    expect(detail?.content).not.toMatch(/## 路线骨架/)
    expect(detail?.content).toContain('cn-feat-chengdu')
  })

  it('ships one hundred twelve featured china guides with full content', () => {
    const featured = articles.filter((a) => a.featured && a.id.startsWith('cn-feat-'))
    expect(featured.length).toBe(112)
    for (const id of [
      'cn-feat-beijing',
      'cn-feat-shanghai',
      'cn-feat-guangzhou',
      'cn-feat-sanya',
      'cn-feat-lijiang',
      'cn-feat-zhangjiajie',
      'cn-feat-shenzhen',
      'cn-feat-haerbin',
      'cn-feat-nanjing',
      'cn-feat-changsha',
      'cn-feat-wulumuqi',
      'cn-feat-suzhou',
      'cn-feat-guiyang',
      'cn-feat-fuzhou',
      'cn-feat-tianjin',
      'cn-feat-xishuangbanna',
      'cn-feat-dalian',
      'cn-feat-jinan',
      'cn-feat-zhengzhou',
      'cn-feat-nanning',
      'cn-feat-dunhuang',
      'cn-feat-shenyang',
      'cn-feat-haikou',
      'cn-feat-luoyang',
      'cn-feat-quanzhou',
      'cn-feat-huangshan',
      'cn-feat-nanchang',
      'cn-feat-hefei',
      'cn-feat-taiyuan',
      'cn-feat-yinchuan',
      'cn-feat-weihai',
      'cn-feat-huhehaote',
      'cn-feat-lanzhou',
      'cn-feat-xining',
      'cn-feat-yantai',
      'cn-feat-jingdezhen',
      'cn-feat-shijiazhuang',
      'cn-feat-changchun',
      'cn-feat-ningbo',
      'cn-feat-wuxi',
      'cn-feat-leshan',
      'cn-feat-zunyi',
      'cn-feat-yangzhou',
      'cn-feat-qinhuangdao',
      'cn-feat-xianggelila',
      'cn-feat-yanji',
      'cn-feat-zhanjiang',
      'cn-feat-huizhou',
      'cn-feat-zhenjiang',
      'cn-feat-tengchong',
      'cn-feat-enshi',
      'cn-feat-changzhou',
      'cn-feat-shaoxing',
      'cn-feat-taizhou',
      'cn-feat-langzhong',
      'cn-feat-kaili',
      'cn-feat-taizhoujiang',
      'cn-feat-nantong',
      'cn-feat-huzhou',
      'cn-feat-mangshi',
      'cn-feat-linzhi',
      'cn-feat-jiaxing',
      'cn-feat-jinhua',
      'cn-feat-weifang',
      'cn-feat-jiayuguan',
      'cn-feat-daocheng',
      'cn-feat-yiwu',
      'cn-feat-baoding',
      'cn-feat-xiangyang',
      'cn-feat-yichang',
      'cn-feat-beihai',
      'cn-feat-zhuzhou',
      'cn-feat-changde',
      'cn-feat-yueyang',
      'cn-feat-zhangzhou',
      'cn-feat-lianyungang',
      'cn-feat-hengyang',
      'cn-feat-xiangtan',
      'cn-feat-liuzhou',
      'cn-feat-huaian',
      'cn-feat-suqian',
      'cn-feat-ganzhou',
      'cn-feat-shangrao',
      'cn-feat-yichun',
      'cn-feat-panzhihua',
      'cn-feat-kuerle',
      'cn-feat-xichang',
      'cn-feat-liupanshui',
      'cn-feat-xingyi',
      'cn-feat-yining',
      'cn-feat-kashi',
      'cn-feat-aletai',
      'cn-feat-hetian',
      'cn-feat-anshun',
      'cn-feat-tongren',
      'cn-feat-fangchenggang',
      'cn-feat-rikaze',
      'cn-feat-manzhouli',
      'cn-feat-mohe',
      'cn-feat-ejina',
      'cn-feat-bomi',
    ]) {
      const detail = getArticleDetail(id)
      expect(detail?.content?.length).toBeGreaterThan(400)
      expect(detail?.content).not.toContain('路线骨架')
    }
  })
})
