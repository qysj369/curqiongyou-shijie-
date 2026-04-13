/**
 * 目的地精选口碑（模拟旅行者点评）；无定制条目时使用通用模板。
 */
const SNIPPETS = {
  1: [
    {
      id: 'th-1',
      author: '曼谷暴走族',
      rating: 5,
      date: '2025-02',
      tripType: '独行',
      text: '曼谷+清迈组合太经典了，青旅+Grab+711，人均三千多玩一周完全可行。',
    },
    {
      id: 'th-2',
      author: '海岛控',
      rating: 4,
      date: '2025-01',
      tripType: '情侣',
      text: '注意雨季和机票促销时间，提前盯廉航能省一大截。',
    },
  ],
  2: [
    {
      id: 'vn-1',
      author: '火车迷阿伟',
      rating: 5,
      date: '2025-02',
      tripType: '独行',
      text: '南北火车线风景绝了，sleeping bus 省住宿但要带好耳塞。',
    },
  ],
  3: [
    {
      id: 'jp-1',
      author: '关西三日',
      rating: 4,
      date: '2025-03',
      tripType: '闺蜜',
      text: '便利店+青旅真的省钱，JR 通票是否划算要看你移动距离。',
    },
  ],
  4: [
    {
      id: 'np-1',
      author: 'ABC徒步',
      rating: 5,
      date: '2024-12',
      tripType: '结伴',
      text: '尼泊尔徒步性价比无敌，记得办登山证和买保险。',
    },
  ],
  5: [
    {
      id: 'tr-1',
      author: '欧亚穿行',
      rating: 4,
      date: '2025-01',
      tripType: '独行',
      text: '里拉波动大，消费尽量用卡或提前换好里拉现金。',
    },
  ],
}

function genericFor(dest) {
  const name = dest?.name || '这里'
  const id = String(dest?.id ?? 'x')
  return [
    {
      id: `gen-${id}-a`,
      author: '匿名旅友',
      rating: 5,
      date: '2024-11',
      tripType: '穷游',
      text: `${name}整体性价比不错，路线参考站内攻略后少踩了不少坑。`,
    },
    {
      id: `gen-${id}-b`,
      author: '路上见',
      rating: 4,
      date: '2024-10',
      tripType: '独行',
      text: `一个人去${name}也能玩得很充实，签证和换汇提前功课做足就行。`,
    },
  ]
}

function helpfulFromId(reviewId) {
  const s = String(reviewId)
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return 12 + (h % 520)
}

function withHelpful(list) {
  return list.map((r) => ({
    ...r,
    helpfulCount: r.helpfulCount ?? helpfulFromId(r.id),
  }))
}

export function getDestinationReviews(dest) {
  if (!dest) return []
  const custom = SNIPPETS[dest.id]
  if (custom?.length) return withHelpful(custom)
  return withHelpful(genericFor(dest))
}
