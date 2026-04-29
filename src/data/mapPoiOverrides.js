// 可维护的地图 POI 覆盖配置（destinationName + category）
// category: blue | green | orange(=yellow)
export const MAP_POI_OVERRIDES = {
  日本: {
    blue: {
      placeNameEn: 'Tokyo Free View Spot',
      savingTips: '都厅免费展望台 + 城市步行线，预算约 ¥0-80',
      highlights: '新宿都厅、浅草周边街景、河畔日落',
      transport: '地铁一日券 + 步行',
      pitfall: '热门观景位排队时间长，建议错峰',
    },
    green: {
      placeNameEn: 'Tokyo Budget Food Lane',
      savingTips: '便利店早餐 + 站前定食，预算约 ¥40-130',
      highlights: '平价食堂、夜间小吃街',
      transport: 'JR/地铁短途 + 步行',
      pitfall: '旅游区菜单溢价高，先看门口价目',
    },
    yellow: {
      placeNameEn: 'Tokyo Hostel Deal Zone',
      savingTips: '青旅床位 + 提前预订特价房，预算约 ¥90-220',
      highlights: '交通枢纽周边青年旅舍密集区',
      transport: '地铁到站后步行 5-10 分钟',
      pitfall: '确认税费、清洁费与最晚入住时间',
    },
  },
  泰国: {
    blue: {
      placeNameEn: 'Bangkok Free Sunset Spot',
      savingTips: '河岸步行 + 免费观景点，预算约 ¥0-60',
      highlights: '河畔日落、老城区街景',
      transport: 'BTS/公交 + 渡船短驳',
      pitfall: '码头/景区周边临时报价波动大',
    },
    green: {
      placeNameEn: 'Bangkok Budget Food Market',
      savingTips: '夜市与本地食堂组合，预算约 ¥20-90',
      highlights: '夜市、小吃摊、平价咖啡',
      transport: '公交直达市场，回程步行',
      pitfall: '避免无标价摊位，先问清总价',
    },
    yellow: {
      placeNameEn: 'Bangkok Hostel Value Area',
      savingTips: '青旅拼房 + 周中房价更低，预算约 ¥50-160',
      highlights: '背包客街区、便捷换乘点',
      transport: '轨道交通 + 步行',
      pitfall: '留意噪音区与押金条款',
    },
  },
}

// 国家级四块模板（优先用于弹卡四项输出）
// 未来扩展建议：
// 1) 本地继续追加国家键；
// 2) 接入远程接口后，在运行时 merge 远程模板；
// 3) 字段保持四块稳定，便于前端长期兼容。
export const MAP_COUNTRY_TEMPLATES = {
  日本: {
    freeScenic: '都厅免费展望台、浅草河畔日落与老城步行线',
    foodUnder200: '便利店早餐 + 平价定食组合，日均控制 ¥200 内',
    lowCostStay: '优先交通枢纽周边青旅床位与早鸟特价酒店',
    realPitfall: '避开网红溢价餐厅，先看本地评分与门口明码',
  },
  泰国: {
    freeScenic: '河岸日落步行线、老城区街景与免费寺外观景点',
    foodUnder200: '夜市 + 社区食堂搭配，日均控制 ¥200 内',
    lowCostStay: '背包客街区青旅拼房 + 周中特价房',
    realPitfall: '谨防景区临时报价与无标价摊位，先问总价',
  },
  越南: {
    freeScenic: '河内老城步行、岘港海边日落与会安夜景',
    foodUnder200: '路边粉面 + 市场小吃，日均控制 ¥200 内',
    lowCostStay: '古城外沿青旅与家庭旅馆，优先含早低价房',
    realPitfall: '热门街区易出现游客价，先看本地评价与菜单',
  },
  马来西亚: {
    freeScenic: '槟城老街、城市海滨日落与免费公共景点',
    foodUnder200: '食阁 + 夜市组合，日均控制 ¥200 内',
    lowCostStay: '交通枢纽附近青旅/公寓特价房',
    realPitfall: '订房前确认税费与清洁费，避免到店补价',
  },
  土耳其: {
    freeScenic: '伊斯坦布尔老城步行、海峡日落与街区观景点',
    foodUnder200: '本地餐馆套餐 + 市集小吃，日均控制 ¥200 内',
    lowCostStay: '核心区外一站地铁范围找青旅与特价酒店',
    realPitfall: '景区周边餐厅溢价高，先比价再入座',
  },
  格鲁吉亚: {
    freeScenic: '第比利斯老城步行线、山城观景与河谷日落',
    foodUnder200: '面包店 + 家常餐馆，日均控制 ¥200 内',
    lowCostStay: '老城外沿民宿和青旅床位性价比更高',
    realPitfall: '网红餐吧加价明显，优先本地社区店',
  },
  葡萄牙: {
    freeScenic: '里斯本观景台、海岸步道与老城街景',
    foodUnder200: '平价套餐店 + 市场熟食，日均控制 ¥200 内',
    lowCostStay: '电车/地铁沿线青旅与周中特价房',
    realPitfall: '旅游区附加服务费多，结账前确认明细',
  },
  西班牙: {
    freeScenic: '老城步行、海滨日落与公共观景点',
    foodUnder200: '菜单日套餐 + 市场小吃，日均控制 ¥200 内',
    lowCostStay: '市中心外一圈青旅与民宿更划算',
    realPitfall: '热门广场餐厅溢价显著，避开第一排门店',
  },
  意大利: {
    freeScenic: '古城街巷、河岸步行与公共广场观景',
    foodUnder200: '披萨切片 + 本地简餐，日均控制 ¥200 内',
    lowCostStay: '火车站周边青旅床位与早订特价房',
    realPitfall: '景点周边餐厅服务费/座位费要提前确认',
  },
  法国: {
    freeScenic: '河岸散步线、城市公园与日落机位',
    foodUnder200: '面包店 + 午间套餐，日均控制 ¥200 内',
    lowCostStay: '地铁沿线青旅和郊区特价酒店',
    realPitfall: '景区咖啡座溢价高，优先本地社区餐馆',
  },
  德国: {
    freeScenic: '老城步行线、河岸公园与免费观景点',
    foodUnder200: '超市熟食 + 平价餐馆，日均控制 ¥200 内',
    lowCostStay: '交通枢纽周边青旅与商务特价房',
    realPitfall: '节庆期间房价暴涨，务必提前锁价',
  },
  英国: {
    freeScenic: '城市免费博物馆周边与河岸日落线',
    foodUnder200: '超市+连锁平价餐，日均控制 ¥200 内',
    lowCostStay: '郊区轨道沿线青旅，通勤换住宿成本',
    realPitfall: '核心景点区餐饮与住宿溢价明显',
  },
  荷兰: {
    freeScenic: '运河步行、公园日落与街区骑行线',
    foodUnder200: '超市热食 + 市场小吃，日均控制 ¥200 内',
    lowCostStay: '外围车站附近青旅与多人拼住',
    realPitfall: '中心区酒店税费和旺季溢价较高',
  },
  希腊: {
    freeScenic: '海岸步道、白墙老城与日落观景点',
    foodUnder200: '本地烤肉/沙拉店组合，日均控制 ¥200 内',
    lowCostStay: '港口外侧青旅民宿与淡季特价房',
    realPitfall: '岛间交通旺季紧张，票务需提前锁定',
  },
  捷克: {
    freeScenic: '老城广场、河岸步行与城堡外景',
    foodUnder200: '本地餐馆午市套餐，日均控制 ¥200 内',
    lowCostStay: '老城外沿青旅与公寓短租',
    realPitfall: '景点核心区兑换汇率不友好，谨慎换汇',
  },
  匈牙利: {
    freeScenic: '多瑙河岸步行、山丘观景与老城街景',
    foodUnder200: '本地汤饭套餐 + 市场小吃，日均控制 ¥200 内',
    lowCostStay: '地铁旁青旅床位 + 周中折扣房',
    realPitfall: '景区周边菜单隐性加价，先看总价',
  },
  奥地利: {
    freeScenic: '老城步行、河岸公园与山景观景点',
    foodUnder200: '超市熟食 + 平价简餐，日均控制 ¥200 内',
    lowCostStay: '交通枢纽周边青旅及早鸟折扣房',
    realPitfall: '演出季与节假日住宿价格波动大',
  },
  克罗地亚: {
    freeScenic: '海岸老城步行、城墙外景与日落点',
    foodUnder200: '本地面食 + 市集小吃，日均控制 ¥200 内',
    lowCostStay: '老城外侧民宿与青旅拼房',
    realPitfall: '古城核心区住宿/餐饮普遍溢价',
  },
  美国: {
    freeScenic: '城市公园、海岸步道与公共观景点',
    foodUnder200: '超市+快餐组合，日均控制 ¥200 内需严控区域',
    lowCostStay: '郊区交通节点青旅/汽车旅馆特价房',
    realPitfall: '景区停车与税费高，避免临时消费叠加',
  },
  加拿大: {
    freeScenic: '湖畔步行、公园观景与城市日落点',
    foodUnder200: '超市简餐 + 平价连锁，日均控制 ¥200 内',
    lowCostStay: '轨道沿线青旅和郊区折扣酒店',
    realPitfall: '旺季自然景区交通和住宿需提前预订',
  },
  墨西哥: {
    freeScenic: '老城广场、海岸日落与公共街区景点',
    foodUnder200: '本地小店 + 市场小吃，日均控制 ¥200 内',
    lowCostStay: '主干道附近青旅与家庭旅馆',
    realPitfall: '夜间偏僻区域安全风险高，避免单独行动',
  },
  巴西: {
    freeScenic: '海滩步行、城市高点日落与老街区',
    foodUnder200: '本地自助餐 + 市场小吃，日均控制 ¥200 内',
    lowCostStay: '地铁可达青旅和商旅折扣房',
    realPitfall: '贵重物品外露风险高，热门区注意防盗',
  },
  阿根廷: {
    freeScenic: '河岸步行、老城街区与日落观景点',
    foodUnder200: '本地套餐 + 平价面包咖啡，日均控制 ¥200 内',
    lowCostStay: '交通节点外圈青旅民宿组合',
    realPitfall: '汇率波动大，支付方式要提前规划',
  },
  摩洛哥: {
    freeScenic: '老城步行、海岸日落与免费观景坡道',
    foodUnder200: '市集熟食 + 本地餐馆，日均控制 ¥200 内',
    lowCostStay: '里亚德外圈房源与青旅拼房',
    realPitfall: '市场议价空间大，先问价再消费',
  },
  埃及: {
    freeScenic: '尼罗河岸步行、老城街景与日落点',
    foodUnder200: '本地小店套餐 + 市场补给，日均控制 ¥200 内',
    lowCostStay: '核心景点外沿青旅与经济酒店',
    realPitfall: '景区临时收费项目多，提前确认票种',
  },
  南非: {
    freeScenic: '海岸步道、城市观景与免费自然点',
    foodUnder200: '平价餐馆 + 超市组合，日均控制 ¥200 内',
    lowCostStay: '交通节点周边经济旅馆与青旅',
    realPitfall: '夜间治安分区差异大，严格避开高风险区',
  },
  澳大利亚: {
    freeScenic: '海岸步行线、城市公园与免费观景点',
    foodUnder200: '超市+平价外卖组合，日均控制 ¥200 内',
    lowCostStay: '火车沿线青旅床位和淡季折扣房',
    realPitfall: '跨城距离远，交通预算需提前锁定',
  },
  新西兰: {
    freeScenic: '湖区步道、海岸日落与免费观景点',
    foodUnder200: '自炊 + 超市熟食，日均控制 ¥200 内',
    lowCostStay: '背包客旅舍与营地式低价住宿',
    realPitfall: '旺季热门区域房源紧张，提前预订',
  },
  印度尼西亚: {
    freeScenic: '海滩日落、梯田步行线与老城街景',
    foodUnder200: '本地战饭 + 夜市小吃，日均控制 ¥200 内',
    lowCostStay: '离景区一段距离的青旅和民宿更划算',
    realPitfall: '景区周边交通议价波动大，先谈好总价',
  },
  菲律宾: {
    freeScenic: '海岛海岸步行、公共海滩与日落点',
    foodUnder200: '市场海鲜 + 本地餐馆，日均控制 ¥200 内',
    lowCostStay: '码头外圈青旅和特价民宿',
    realPitfall: '跳岛与船期受天气影响，预留机动天数',
  },
}

export function getCountryTemplate(destinationName) {
  if (!destinationName) return null
  // 预留运行时远程扩展入口：window.__ROAMWISE_COUNTRY_TEMPLATES__
  const runtime =
    typeof window !== 'undefined' && window.__ROAMWISE_COUNTRY_TEMPLATES__
      ? window.__ROAMWISE_COUNTRY_TEMPLATES__
      : null
  const runtimeTemplate = runtime?.[destinationName]
  return runtimeTemplate || MAP_COUNTRY_TEMPLATES[destinationName] || null
}
