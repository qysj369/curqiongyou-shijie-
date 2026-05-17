/**
 * 攻略侧车：形态 / 主题轴 / 关联城市分站（facets/）
 * 与 `articlesData` 中 `id` 对齐；未列出的文章视为无 facet。
 *
 * @type {import('../schema').GuideArticleFacet[]}
 */
export const guideArticleFacets = [
  {
    articleId: 'a1',
    kinds: ['route'],
    topicIds: ['route_multi_day', 'save_money', 'stay_hostel', 'food_street'],
    stationKeys: ['th-bangkok', 'th-chiangmai'],
  },
  {
    articleId: 'a2',
    kinds: ['route'],
    topicIds: ['route_multi_day', 'local_transport', 'save_money'],
    stationKeys: ['vn-hanoi', 'vn-hochiminh'],
  },
  {
    articleId: 'a3',
    kinds: ['route'],
    topicIds: ['route_multi_day', 'stay_hostel', 'food_street'],
    stationKeys: ['jp-osaka', 'jp-kyoto', 'jp-nara'],
  },
]
