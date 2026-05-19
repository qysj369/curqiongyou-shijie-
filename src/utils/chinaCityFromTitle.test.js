import { describe, it, expect } from 'vitest'
import {
  inferChinaCityFromTitle,
  inferChinaRegionFromTitle,
  matchesArticleDestinationFilter,
} from './chinaCityFromTitle.js'

describe('chinaCityFromTitle', () => {
  it('infers city from china route title', () => {
    expect(inferChinaCityFromTitle('四川：成都乐山峨眉山6日')).toBe('成都')
    expect(inferChinaCityFromTitle('闽南：厦门泉州漳州土楼6日')).toBe('厦门')
    expect(inferChinaRegionFromTitle('四川：成都乐山峨眉山6日')).toBe('四川')
  })

  it('matches city filter on china articles', () => {
    const article = {
      destination: '中国',
      city: '成都',
      title: '四川：成都乐山峨眉山6日',
    }
    expect(matchesArticleDestinationFilter(article, '成都')).toBe(true)
    expect(matchesArticleDestinationFilter(article, '中国')).toBe(true)
    expect(matchesArticleDestinationFilter(article, '厦门')).toBe(false)
  })

  it('does not infer beihai from hokkaido titles', () => {
    expect(inferChinaCityFromTitle('日本北海道10日：札幌小樽')).toBe(null)
    expect(inferChinaCityFromTitle('广西北海银滩涠洲岛5日')).toBe('北海')
  })

  it('infers ansun from huangguoshu titles', () => {
    expect(inferChinaCityFromTitle('贵州安顺龙宫+黄果树深度3日')).toBe('安顺')
    expect(inferChinaCityFromTitle('梵净山+云舍侗寨铜仁连线4日')).toBe('铜仁')
  })

  it('infers niche china destinations from keywords', () => {
    expect(inferChinaCityFromTitle('额济纳胡杨林摄影4日')).toBe('额济纳')
    expect(inferChinaCityFromTitle('漠河北极村找北3日')).toBe('漠河')
    expect(inferChinaCityFromTitle('波密桃花沟自驾4日')).toBe('波密')
  })
})
