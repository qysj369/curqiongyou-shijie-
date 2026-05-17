/**
 * 攻略 ↔ 地图 POI 绑定（bindings/）
 *
 * - `kind: 'custom'` + `id: 'intent:…'` 为行程语义占位，便于在高德检索到正式 id 后改为 `kind: 'amap'`。
 * - 已有高德密钥时，在地图 Web 端或「地点搜索」结果里复制 POI id 填入即可。
 *
 * @type {import('../schema').GuidePoiBinding[]}
 */
export const guidePoiBindings = [
  {
    articleId: 'a1',
    stationKey: 'th-bangkok',
    poiRefs: [
      { kind: 'custom', id: 'intent:bangkok-grand-palace', nameZh: '大皇宫' },
      { kind: 'custom', id: 'intent:bangkok-khaosan', nameZh: '考山路夜市' },
    ],
    note: '替换 intent: 为高德 POI id 后改 kind: amap',
  },
  {
    articleId: 'a1',
    stationKey: 'th-chiangmai',
    poiRefs: [
      { kind: 'custom', id: 'intent:chiangmai-old-city', nameZh: '清迈古城' },
      { kind: 'custom', id: 'intent:chiangmai-doi-suthep', nameZh: '素贴山双龙寺' },
    ],
    note: '同上',
  },
  {
    articleId: 'a2',
    stationKey: 'vn-hanoi',
    poiRefs: [
      { kind: 'custom', id: 'intent:hanoi-old-quarter', nameZh: '河内老城/还剑湖' },
    ],
    note: '同上',
  },
  {
    articleId: 'a2',
    stationKey: 'vn-hochiminh',
    poiRefs: [
      { kind: 'custom', id: 'intent:hcmc-ben-thanh', nameZh: '范五老街区域' },
    ],
    note: '同上',
  },
  {
    articleId: 'a3',
    stationKey: 'jp-osaka',
    poiRefs: [{ kind: 'custom', id: 'intent:osaka-namba', nameZh: '难波/心斋桥' }],
    note: '同上',
  },
  {
    articleId: 'a3',
    stationKey: 'jp-kyoto',
    poiRefs: [{ kind: 'custom', id: 'intent:kyoto-gion', nameZh: '祇园/河原町' }],
    note: '同上',
  },
]
