/**
 * 城市分站注册表（底座 2 · stations/）
 * parentPlaceId 与 `placeModel` / `mockData` 里 destinations.id 一致。
 *
 * @type {import('../schema').GuideStation[]}
 */
export const guideStations = [
  {
    key: 'th-bangkok',
    nameZh: '曼谷',
    nameEn: 'Bangkok',
    parentPlaceId: '1',
    regionHint: '泰国中部',
    center: { lng: 100.5018, lat: 13.7563 },
  },
  {
    key: 'th-chiangmai',
    nameZh: '清迈',
    nameEn: 'Chiang Mai',
    parentPlaceId: '1',
    regionHint: '泰国北部',
    center: { lng: 98.9853, lat: 18.7883 },
  },
  {
    key: 'vn-hanoi',
    nameZh: '河内',
    nameEn: 'Hanoi',
    parentPlaceId: '2',
    regionHint: '越南北部',
    center: { lng: 105.8342, lat: 21.0278 },
  },
  {
    key: 'vn-hochiminh',
    nameZh: '胡志明市',
    nameEn: 'Ho Chi Minh City',
    parentPlaceId: '2',
    regionHint: '越南南部',
    center: { lng: 106.6297, lat: 10.8231 },
  },
  {
    key: 'jp-osaka',
    nameZh: '大阪',
    nameEn: 'Osaka',
    parentPlaceId: '3',
    regionHint: '关西',
    center: { lng: 135.5023, lat: 34.6937 },
  },
  {
    key: 'jp-kyoto',
    nameZh: '京都',
    nameEn: 'Kyoto',
    parentPlaceId: '3',
    regionHint: '关西',
    center: { lng: 135.7681, lat: 35.0116 },
  },
  {
    key: 'jp-nara',
    nameZh: '奈良',
    nameEn: 'Nara',
    parentPlaceId: '3',
    regionHint: '关西',
    center: { lng: 135.8049, lat: 34.6851 },
  },
]
