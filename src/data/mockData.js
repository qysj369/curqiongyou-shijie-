// 穷游世界 - 模拟数据

// 大洲映射：东南亚/东亚/南亚/西亚 -> 亚洲
const regionToContinent = { 东南亚: '亚洲', 东亚: '亚洲', 南亚: '亚洲', 西亚: '亚洲', 欧洲: '欧洲' }

export const destinations = [
  {
    id: '1',
    name: '泰国',
    region: '东南亚',
    continent: '亚洲',
    country: '泰国',
    dailyBudget: 150,
    visaType: '落地签',
    tags: ['便宜', '新手友好', '美食'],
    image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=600',
    routeCount: 12,
    description: '性价比之王，适合第一次出境穷游',
  },
  {
    id: '2',
    name: '越南',
    country: '越南',
    region: '东南亚',
    continent: '亚洲',
    dailyBudget: 120,
    visaType: '另纸签/电子签',
    tags: ['超便宜', '海岸线', '咖啡'],
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=600',
    routeCount: 8,
    description: '河内到胡志明，一路向南的经典路线',
  },
  {
    id: '3',
    name: '日本',
    country: '日本',
    region: '东亚',
    continent: '亚洲',
    dailyBudget: 350,
    visaType: '签证',
    tags: ['文化', '美食', '交通便利'],
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600',
    routeCount: 15,
    description: '穷游也能玩转关西关东',
  },
  {
    id: '4',
    name: '尼泊尔',
    country: '尼泊尔',
    region: '南亚',
    continent: '亚洲',
    dailyBudget: 100,
    visaType: '落地签',
    tags: ['徒步', '雪山', '宗教'],
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600',
    routeCount: 6,
    description: '徒步天堂，预算极低',
  },
  {
    id: '5',
    name: '土耳其',
    country: '土耳其',
    region: '西亚',
    continent: '亚洲',
    dailyBudget: 200,
    visaType: '电子签',
    tags: ['热气球', '历史', '东西方交汇'],
    image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600',
    routeCount: 9,
    description: '横跨欧亚的浪漫之旅',
  },
  {
    id: '6',
    name: '葡萄牙',
    country: '葡萄牙',
    region: '欧洲',
    continent: '欧洲',
    dailyBudget: 280,
    visaType: '申根签',
    tags: ['海岸', '物价友好', '建筑'],
    image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600',
    routeCount: 5,
    description: '欧洲性价比之选',
  },
  {
    id: '7',
    name: '美国',
    country: '美国',
    region: '北美',
    continent: '北美',
    dailyBudget: 450,
    visaType: '签证',
    tags: ['自驾', '国家公园', '城市'],
    image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600',
    routeCount: 8,
    description: '东西海岸、国家公园穷游路线',
  },
  {
    id: '8',
    name: '西班牙',
    country: '西班牙',
    region: '欧洲',
    continent: '欧洲',
    dailyBudget: 300,
    visaType: '申根签',
    tags: ['建筑', '美食', '海岸'],
    image: 'https://images.unsplash.com/photo-1543785734-4b6e564642f8?w=600',
    routeCount: 6,
    description: '巴塞罗那、马德里、安达卢西亚',
  },
  {
    id: '9',
    name: '意大利',
    country: '意大利',
    region: '欧洲',
    continent: '欧洲',
    dailyBudget: 320,
    visaType: '申根签',
    tags: ['艺术', '美食', '历史'],
    image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=600',
    routeCount: 10,
    description: '罗马、佛罗伦萨、威尼斯穷游',
  },
  {
    id: '10',
    name: '希腊',
    country: '希腊',
    region: '欧洲',
    continent: '欧洲',
    dailyBudget: 250,
    visaType: '申根签',
    tags: ['海岛', '古迹', '物价友好'],
    image: 'https://images.unsplash.com/photo-1533105077500-1b7a6ea907da?w=600',
    routeCount: 5,
    description: '圣托里尼、雅典、扎金索斯',
  },
  {
    id: '11',
    name: '秘鲁',
    country: '秘鲁',
    region: '南美',
    continent: '南美',
    dailyBudget: 220,
    visaType: '免签/美签',
    tags: ['马丘比丘', '徒步', '文化'],
    image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=600',
    routeCount: 4,
    description: '马丘比丘与亚马逊穷游',
  },
  {
    id: '12',
    name: '巴西',
    country: '巴西',
    region: '南美',
    continent: '南美',
    dailyBudget: 280,
    visaType: '签证/电子签',
    tags: ['海滩', '狂欢节', '雨林'],
    image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=600',
    routeCount: 5,
    description: '里约、伊瓜苏、亚马逊',
  },
  {
    id: '13',
    name: '柬埔寨',
    country: '柬埔寨',
    region: '东南亚',
    continent: '亚洲',
    dailyBudget: 130,
    visaType: '电子签/落地签',
    tags: ['吴哥窟', '便宜', '历史'],
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600',
    routeCount: 6,
    description: '吴哥窟与金边高性价比路线',
  },
  {
    id: '14',
    name: '印度尼西亚',
    country: '印度尼西亚',
    region: '东南亚',
    continent: '亚洲',
    dailyBudget: 180,
    visaType: '免签',
    tags: ['海岛', '火山', '便宜'],
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600',
    routeCount: 9,
    description: '巴厘岛、日惹、科莫多穷游',
  },
  {
    id: '15',
    name: '澳大利亚',
    country: '澳大利亚',
    region: '大洋洲',
    continent: '大洋洲',
    dailyBudget: 400,
    visaType: '电子签',
    tags: ['自驾', '海岸', '自然'],
    image: 'https://images.unsplash.com/photo-1523482580671-f216ba185ece?w=600',
    routeCount: 7,
    description: '东海岸、大洋路、大堡礁',
  },
  {
    id: '16',
    name: '新西兰',
    country: '新西兰',
    region: '大洋洲',
    continent: '大洋洲',
    dailyBudget: 450,
    visaType: '电子签',
    tags: ['自然', '徒步', '自驾'],
    image: 'https://images.unsplash.com/photo-1507699629798-6870a1e2d1d8?w=600',
    routeCount: 6,
    description: '南岛北岛环线穷游',
  },
  {
    id: '17',
    name: '摩洛哥',
    country: '摩洛哥',
    region: '北非',
    continent: '非洲',
    dailyBudget: 200,
    visaType: '免签',
    tags: ['沙漠', '古城', '色彩'],
    image: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=600',
    routeCount: 5,
    description: '撒哈拉、菲斯、舍夫沙万',
  },
  {
    id: '18',
    name: '埃及',
    country: '埃及',
    region: '北非',
    continent: '非洲',
    dailyBudget: 180,
    visaType: '落地签',
    tags: ['金字塔', '历史', '红海'],
    image: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=600',
    routeCount: 5,
    description: '开罗、卢克索、红海穷游',
  },
  {
    id: '19',
    name: '肯尼亚',
    country: '肯尼亚',
    region: '东非',
    continent: '非洲',
    dailyBudget: 350,
    visaType: '电子签',
    tags: ['Safari', '动物', '自然'],
    image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600',
    routeCount: 3,
    description: '马赛马拉、纳库鲁观兽',
  },
  {
    id: '20',
    name: '南极洲',
    country: '南极洲',
    region: '南极',
    continent: '南极洲',
    dailyBudget: 8000,
    visaType: '科考/游轮',
    tags: ['极地', '探险', '小众'],
    image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600',
    routeCount: 2,
    description: '游轮探险与极地体验',
  },
  { id: '21', name: '印度', country: '印度', region: '南亚', continent: '亚洲', dailyBudget: 120, visaType: '电子签', tags: ['文化', '便宜', '宗教'], image: 'https://images.unsplash.com/photo-1524492479098-5e0a4b2f52e0?w=600', routeCount: 8, description: '北印金三角与南印海岸' },
  { id: '22', name: '马来西亚', country: '马来西亚', region: '东南亚', continent: '亚洲', dailyBudget: 180, visaType: '电子签', tags: ['海岛', '美食', '便宜'], image: 'https://images.unsplash.com/photo-1596422846543-75c6ee1976e5?w=600', routeCount: 6, description: '吉隆坡、槟城、兰卡威' },
  { id: '23', name: '新加坡', country: '新加坡', region: '东南亚', continent: '亚洲', dailyBudget: 400, visaType: '免签', tags: ['城市', '美食', '交通便利'], image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600', routeCount: 4, description: '城市国家精致穷游' },
  { id: '24', name: '韩国', country: '韩国', region: '东亚', continent: '亚洲', dailyBudget: 350, visaType: '签证/免签', tags: ['美食', '购物', '文化'], image: 'https://images.unsplash.com/photo-1534274867514-d5b47ef89ed7?w=600', routeCount: 7, description: '首尔、釜山、济州' },
  { id: '25', name: '菲律宾', country: '菲律宾', region: '东南亚', continent: '亚洲', dailyBudget: 160, visaType: '签证', tags: ['海岛', '便宜', '潜水'], image: 'https://images.unsplash.com/photo-1584118624014-d89a2c218c60?w=600', routeCount: 5, description: '长滩、薄荷、巴拉望' },
  { id: '26', name: '阿联酋', country: '阿联酋', region: '西亚', continent: '亚洲', dailyBudget: 500, visaType: '免签', tags: ['沙漠', '现代', '购物'], image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600', routeCount: 4, description: '迪拜、阿布扎比' },
  { id: '27', name: '斯里兰卡', country: '斯里兰卡', region: '南亚', continent: '亚洲', dailyBudget: 150, visaType: '电子签', tags: ['茶园', '海岸', '古迹'], image: 'https://images.unsplash.com/photo-1580619305218-8423a7ef79d0?w=600', routeCount: 5, description: '环岛火车与古城' },
  { id: '28', name: '法国', country: '法国', region: '西欧', continent: '欧洲', dailyBudget: 450, visaType: '申根签', tags: ['艺术', '美食', '浪漫'], image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600', routeCount: 12, description: '巴黎、南法、卢瓦尔' },
  { id: '29', name: '德国', country: '德国', region: '中欧', continent: '欧洲', dailyBudget: 380, visaType: '申根签', tags: ['历史', '建筑', '啤酒'], image: 'https://images.unsplash.com/photo-1560930950-5cc20e80e392?w=600', routeCount: 8, description: '柏林、慕尼黑、新天鹅堡' },
  { id: '30', name: '英国', country: '英国', region: '西欧', continent: '欧洲', dailyBudget: 500, visaType: '签证', tags: ['文化', '城市', '历史'], image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600', routeCount: 9, description: '伦敦、苏格兰、湖区' },
  { id: '31', name: '荷兰', country: '荷兰', region: '西欧', continent: '欧洲', dailyBudget: 420, visaType: '申根签', tags: ['运河', '艺术', '单车'], image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=600', routeCount: 5, description: '阿姆斯特丹与郁金香' },
  { id: '32', name: '捷克', country: '捷克', region: '东欧', continent: '欧洲', dailyBudget: 280, visaType: '申根签', tags: ['建筑', '物价友好', '啤酒'], image: 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=600', routeCount: 4, description: '布拉格、CK小镇' },
  { id: '33', name: '冰岛', country: '冰岛', region: '北欧', continent: '欧洲', dailyBudget: 700, visaType: '申根签', tags: ['极光', '自然', '小众'], image: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=600', routeCount: 4, description: '环岛自驾与极光' },
  { id: '34', name: '加拿大', country: '加拿大', region: '北美', continent: '北美', dailyBudget: 450, visaType: '签证', tags: ['自然', '自驾', '多元'], image: 'https://images.unsplash.com/photo-1519832979-6fa011b87667?w=600', routeCount: 6, description: '落基山、多伦多、温哥华' },
  { id: '35', name: '墨西哥', country: '墨西哥', region: '北美', continent: '北美', dailyBudget: 280, visaType: '签证/美签', tags: ['古迹', '海滩', '文化'], image: 'https://images.unsplash.com/photo-1518638150340-f706e16654f4?w=600', routeCount: 6, description: '坎昆、玛雅遗迹、瓜纳华托' },
  { id: '36', name: '阿根廷', country: '阿根廷', region: '南美', continent: '南美', dailyBudget: 350, visaType: '电子签', tags: ['探戈', '冰川', '牛排'], image: 'https://images.unsplash.com/photo-1612296480922-207807b05c99?w=600', routeCount: 5, description: '布宜诺斯艾利斯、乌斯怀亚' },
  { id: '37', name: '智利', country: '智利', region: '南美', continent: '南美', dailyBudget: 320, visaType: '免签', tags: ['沙漠', 'Patagonia', '葡萄酒'], image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600', routeCount: 4, description: '复活节岛、阿塔卡马' },
  { id: '38', name: '哥伦比亚', country: '哥伦比亚', region: '南美', continent: '南美', dailyBudget: 220, visaType: '免签', tags: ['咖啡', '古城', '海岸'], image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=600', routeCount: 4, description: '卡塔赫纳、麦德林' },
  { id: '39', name: '南非', country: '南非', region: '南部非洲', continent: '非洲', dailyBudget: 300, visaType: '签证', tags: ['Safari', '海岸', '葡萄酒'], image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=600', routeCount: 6, description: '开普敦、克鲁格、花园大道' },
  { id: '40', name: '坦桑尼亚', country: '坦桑尼亚', region: '东非', continent: '非洲', dailyBudget: 400, visaType: '落地签', tags: ['Safari', '乞力马扎罗', '桑给巴尔'], image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600', routeCount: 4, description: '塞伦盖蒂与桑岛' },
  { id: '41', name: '斐济', country: '斐济', region: '太平洋', continent: '大洋洲', dailyBudget: 450, visaType: '免签', tags: ['海岛', '潜水', '度假'], image: 'https://images.unsplash.com/photo-1540202404-a2f29016b523?w=600', routeCount: 3, description: '南太平洋岛国穷游' },
  { id: '42', name: '蒙古', country: '蒙古', region: '东亚', continent: '亚洲', dailyBudget: 200, visaType: '签证', tags: ['草原', '小众', '自然'], image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600', routeCount: 3, description: '乌兰巴托与戈壁' },
  { id: '43', name: '格鲁吉亚', country: '格鲁吉亚', region: '高加索', continent: '亚洲', dailyBudget: 220, visaType: '电子签', tags: ['葡萄酒', '雪山', '物价友好'], image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600', routeCount: 4, description: '第比利斯、卡兹别克' },
  { id: '44', name: '挪威', country: '挪威', region: '北欧', continent: '欧洲', dailyBudget: 650, visaType: '申根签', tags: ['峡湾', '极光', '自然'], image: 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?w=600', routeCount: 5, description: '峡湾与罗弗敦' },
  { id: '45', name: '克罗地亚', country: '克罗地亚', region: '东欧', continent: '欧洲', dailyBudget: 320, visaType: '申根签', tags: ['海岸', '古城', '权游'], image: 'https://images.unsplash.com/photo-1559827260-dc66d43bef33?w=600', routeCount: 4, description: '杜布罗夫尼克与十六湖' },
  { id: '46', name: '厄瓜多尔', country: '厄瓜多尔', region: '南美', continent: '南美', dailyBudget: 200, visaType: '免签', tags: ['加拉帕戈斯', '赤道', '雨林'], image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=600', routeCount: 4, description: '基多与加拉帕戈斯' },
  { id: '47', name: '玻利维亚', country: '玻利维亚', region: '南美', continent: '南美', dailyBudget: 180, visaType: '落地签', tags: ['天空之镜', '高原', '便宜'], image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=600', routeCount: 3, description: '乌尤尼与拉巴斯' },
  { id: '48', name: '纳米比亚', country: '纳米比亚', region: '南部非洲', continent: '非洲', dailyBudget: 350, visaType: '签证', tags: ['沙漠', '野生动物', '摄影'], image: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=600', routeCount: 3, description: '红沙漠与埃托沙' },
  { id: '49', name: '突尼斯', country: '突尼斯', region: '北非', continent: '非洲', dailyBudget: 220, visaType: '免签', tags: ['沙漠', '罗马遗迹', '地中海'], image: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=600', routeCount: 3, description: '撒哈拉门户与蓝白小镇' },
  { id: '50', name: '老挝', country: '老挝', region: '东南亚', continent: '亚洲', dailyBudget: 140, visaType: '落地签', tags: ['便宜', '佛教', '自然'], image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=600', routeCount: 4, description: '琅勃拉邦、万荣、四千美岛' },
  { id: '51', name: '缅甸', country: '缅甸', region: '东南亚', continent: '亚洲', dailyBudget: 150, visaType: '电子签', tags: ['佛塔', '小众', '人文'], image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600', routeCount: 4, description: '蒲甘、曼德勒、茵莱湖' },
  { id: '52', name: '伊朗', country: '伊朗', region: '西亚', continent: '亚洲', dailyBudget: 200, visaType: '签证', tags: ['波斯', '古迹', '物价友好'], image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600', routeCount: 4, description: '伊斯法罕、设拉子、波斯波利斯' },
  { id: '53', name: '约旦', country: '约旦', region: '西亚', continent: '亚洲', dailyBudget: 280, visaType: '签证/落地签', tags: ['佩特拉', '沙漠', '死海'], image: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=600', routeCount: 4, description: '佩特拉、瓦迪拉姆、死海' },
  { id: '54', name: '马尔代夫', country: '马尔代夫', region: '南亚', continent: '亚洲', dailyBudget: 600, visaType: '免签', tags: ['海岛', '潜水', '蜜月'], image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600', routeCount: 3, description: '居民岛穷游与跳岛' },
  { id: '55', name: '哈萨克斯坦', country: '哈萨克斯坦', region: '中亚', continent: '亚洲', dailyBudget: 250, visaType: '免签', tags: ['草原', '丝绸之路', '小众'], image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600', routeCount: 3, description: '阿拉木图、大阿拉木图湖' },
  { id: '56', name: '以色列', country: '以色列', region: '西亚', continent: '亚洲', dailyBudget: 450, visaType: '签证', tags: ['宗教', '死海', '历史'], image: 'https://images.unsplash.com/photo-1512632579908-17e19e3d2b3e?w=600', routeCount: 4, description: '耶路撒冷、特拉维夫、死海' },
  { id: '57', name: '瑞士', country: '瑞士', region: '中欧', continent: '欧洲', dailyBudget: 600, visaType: '申根签', tags: ['雪山', '湖光', '火车'], image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=600', routeCount: 6, description: '因特拉肯、采尔马特、卢塞恩' },
  { id: '58', name: '奥地利', country: '奥地利', region: '中欧', continent: '欧洲', dailyBudget: 380, visaType: '申根签', tags: ['音乐', '建筑', '阿尔卑斯'], image: 'https://images.unsplash.com/photo-1540840454462-646b2f466833?w=600', routeCount: 5, description: '维也纳、萨尔茨堡、哈尔施塔特' },
  { id: '59', name: '波兰', country: '波兰', region: '东欧', continent: '欧洲', dailyBudget: 260, visaType: '申根签', tags: ['历史', '物价友好', '古城'], image: 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=600', routeCount: 5, description: '克拉科夫、华沙、格但斯克' },
  { id: '60', name: '匈牙利', country: '匈牙利', region: '东欧', continent: '欧洲', dailyBudget: 280, visaType: '申根签', tags: ['温泉', '建筑', '物价友好'], image: 'https://images.unsplash.com/photo-1559827260-dc66d43bef33?w=600', routeCount: 4, description: '布达佩斯、巴拉顿湖' },
  { id: '61', name: '爱尔兰', country: '爱尔兰', region: '西欧', continent: '欧洲', dailyBudget: 450, visaType: '签证', tags: ['自然', '城堡', '威士忌'], image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600', routeCount: 4, description: '都柏林、高威、莫赫悬崖' },
  { id: '62', name: '瑞典', country: '瑞典', region: '北欧', continent: '欧洲', dailyBudget: 480, visaType: '申根签', tags: ['极光', '设计', '自然'], image: 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?w=600', routeCount: 5, description: '斯德哥尔摩、基律纳、阿比斯库' },
  { id: '63', name: '古巴', country: '古巴', region: '加勒比', continent: '北美', dailyBudget: 250, visaType: '签证', tags: ['老爷车', '音乐', '复古'], image: 'https://images.unsplash.com/photo-1518638150340-f706e16654f4?w=600', routeCount: 4, description: '哈瓦那、特立尼达、巴拉德罗' },
  { id: '64', name: '哥斯达黎加', country: '哥斯达黎加', region: '中美洲', continent: '北美', dailyBudget: 350, visaType: '免签', tags: ['雨林', '火山', '生态'], image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=600', routeCount: 4, description: '蒙特韦尔德、曼努埃尔安东尼奥' },
  { id: '65', name: '巴拿马', country: '巴拿马', region: '中美洲', continent: '北美', dailyBudget: 320, visaType: '免签', tags: ['运河', '雨林', '海岸'], image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=600', routeCount: 4, description: '巴拿马城、圣布拉斯、博卡斯' },
  { id: '66', name: '乌拉圭', country: '乌拉圭', region: '南美', continent: '南美', dailyBudget: 300, visaType: '免签', tags: ['海滩', '殖民', '安全'], image: 'https://images.unsplash.com/photo-1612296480922-207807b05c99?w=600', routeCount: 3, description: '蒙得维的亚、科洛尼亚' },
  { id: '67', name: '乌干达', country: '乌干达', region: '东非', continent: '非洲', dailyBudget: 280, visaType: '电子签', tags: ['大猩猩', '野生动物', '小众'], image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600', routeCount: 3, description: '金贾、布温迪观猩猩' },
  { id: '68', name: '卢旺达', country: '卢旺达', region: '东非', continent: '非洲', dailyBudget: 350, visaType: '落地签', tags: ['大猩猩', '火山', '清洁'], image: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=600', routeCount: 3, description: '火山国家公园观猩猩' },
  { id: '69', name: '博茨瓦纳', country: '博茨瓦纳', region: '南部非洲', continent: '非洲', dailyBudget: 450, visaType: '签证', tags: ['Safari', '奥卡万戈', '野生动物'], image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=600', routeCount: 3, description: '奥卡万戈三角洲、乔贝' },
  { id: '70', name: '毛里求斯', country: '毛里求斯', region: '印度洋', continent: '非洲', dailyBudget: 400, visaType: '免签', tags: ['海岛', '潜水', '多元'], image: 'https://images.unsplash.com/photo-1540202404-a2f29016b523?w=600', routeCount: 4, description: '环岛与七色土' },
  { id: '71', name: '马达加斯加', country: '马达加斯加', region: '东非', continent: '非洲', dailyBudget: 220, visaType: '落地签', tags: ['狐猴', '独特', '自然'], image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600', routeCount: 4, description: '狐猴、猴面包树、石林' },
  { id: '72', name: '帕劳', country: '帕劳', region: '太平洋', continent: '大洋洲', dailyBudget: 500, visaType: '落地签', tags: ['潜水', '水母湖', '海岛'], image: 'https://images.unsplash.com/photo-1584118624014-d89a2c218c60?w=600', routeCount: 3, description: '潜水天堂与水母湖' },
  { id: '73', name: '瓦努阿图', country: '瓦努阿图', region: '太平洋', continent: '大洋洲', dailyBudget: 350, visaType: '免签', tags: ['火山', '文化', '小众'], image: 'https://images.unsplash.com/photo-1540202404-a2f29016b523?w=600', routeCount: 3, description: '火山与原始文化' },
  { id: '74', name: '文莱', country: '文莱', region: '东南亚', continent: '亚洲', dailyBudget: 350, visaType: '签证', tags: ['清真', '石油', '雨林'], image: 'https://images.unsplash.com/photo-1596422846543-75c6ee1976e5?w=600', routeCount: 2, description: '斯里巴加湾与水上村' },
  { id: '75', name: '巴基斯坦', country: '巴基斯坦', region: '南亚', continent: '亚洲', dailyBudget: 150, visaType: '电子签', tags: ['喀喇昆仑', '人文', '便宜'], image: 'https://images.unsplash.com/photo-1524492479098-5e0a4b2f52e0?w=600', routeCount: 4, description: '罕萨、拉合尔、卡拉奇' },
  { id: '76', name: '乌兹别克斯坦', country: '乌兹别克斯坦', region: '中亚', continent: '亚洲', dailyBudget: 200, visaType: '免签', tags: ['丝绸之路', '古城', '撒马尔罕'], image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600', routeCount: 4, description: '撒马尔罕、布哈拉、希瓦' },
  { id: '77', name: '阿塞拜疆', country: '阿塞拜疆', region: '高加索', continent: '亚洲', dailyBudget: 280, visaType: '电子签', tags: ['火之国', '现代', '古城'], image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600', routeCount: 3, description: '巴库、戈布斯坦、舍基' },
  { id: '78', name: '比利时', country: '比利时', region: '西欧', continent: '欧洲', dailyBudget: 400, visaType: '申根签', tags: ['巧克力', '啤酒', '欧盟中心'], image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=600', routeCount: 4, description: '布鲁塞尔、布鲁日、根特' },
  { id: '79', name: '丹麦', country: '丹麦', region: '北欧', continent: '欧洲', dailyBudget: 500, visaType: '申根签', tags: ['设计', '童话', '自行车'], image: 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?w=600', routeCount: 4, description: '哥本哈根、欧登塞、乐高乐园' },
  { id: '80', name: '芬兰', country: '芬兰', region: '北欧', continent: '欧洲', dailyBudget: 480, visaType: '申根签', tags: ['极光', '桑拿', '圣诞老人'], image: 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?w=600', routeCount: 5, description: '赫尔辛基、罗瓦涅米、拉普兰' },
  { id: '81', name: '罗马尼亚', country: '罗马尼亚', region: '东欧', continent: '欧洲', dailyBudget: 220, visaType: '申根签', tags: ['城堡', '吸血鬼', '物价友好'], image: 'https://images.unsplash.com/photo-1559827260-dc66d43bef33?w=600', routeCount: 4, description: '布兰城堡、锡纳亚、锡吉什瓦拉' },
  { id: '82', name: '斯洛文尼亚', country: '斯洛文尼亚', region: '东欧', continent: '欧洲', dailyBudget: 300, visaType: '申根签', tags: ['布莱德湖', '溶洞', '阿尔卑斯'], image: 'https://images.unsplash.com/photo-1559827260-dc66d43bef33?w=600', routeCount: 4, description: '布莱德、卢布尔雅那、皮兰' },
  { id: '83', name: '牙买加', country: '牙买加', region: '加勒比', continent: '北美', dailyBudget: 350, visaType: '免签', tags: ['雷鬼', '海滩', '蓝山咖啡'], image: 'https://images.unsplash.com/photo-1518638150340-f706e16654f4?w=600', routeCount: 3, description: '蒙特戈贝、金斯敦、蓝山' },
  { id: '84', name: '危地马拉', country: '危地马拉', region: '中美洲', continent: '北美', dailyBudget: 200, visaType: '免签', tags: ['玛雅', '火山', '安提瓜'], image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=600', routeCount: 4, description: '蒂卡尔、安提瓜、阿蒂特兰湖' },
  { id: '85', name: '委内瑞拉', country: '委内瑞拉', region: '南美', continent: '南美', dailyBudget: 180, visaType: '签证', tags: ['天使瀑布', '加勒比', '小众'], image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=600', routeCount: 3, description: '天使瀑布、洛斯罗克斯' },
  { id: '86', name: '巴拉圭', country: '巴拉圭', region: '南美', continent: '南美', dailyBudget: 180, visaType: '签证', tags: ['伊瓜苏', '内陆', '小众'], image: 'https://images.unsplash.com/photo-1612296480922-207807b05c99?w=600', routeCount: 3, description: '亚松森、伊泰普' },
  { id: '87', name: '津巴布韦', country: '津巴布韦', region: '南部非洲', continent: '非洲', dailyBudget: 280, visaType: '落地签', tags: ['维多利亚瀑布', 'Safari', '古迹'], image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=600', routeCount: 4, description: '维多利亚瀑布、万基国家公园' },
  { id: '88', name: '赞比亚', country: '赞比亚', region: '南部非洲', continent: '非洲', dailyBudget: 260, visaType: '电子签', tags: ['维多利亚瀑布', 'Safari', '河游'], image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600', routeCount: 4, description: '利文斯敦、南卢安瓜' },
  { id: '89', name: '加纳', country: '加纳', region: '西非', continent: '非洲', dailyBudget: 220, visaType: '签证', tags: ['海岸', '历史', '文化'], image: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=600', routeCount: 3, description: '阿克拉、海岸角、库马西' },
  { id: '90', name: '塞内加尔', country: '塞内加尔', region: '西非', continent: '非洲', dailyBudget: 250, visaType: '签证', tags: ['玫瑰湖', '达喀尔', '文化'], image: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=600', routeCount: 3, description: '达喀尔、圣路易、玫瑰湖' },
  { id: '91', name: '汤加', country: '汤加', region: '太平洋', continent: '大洋洲', dailyBudget: 380, visaType: '免签', tags: ['观鲸', '海岛', '王室'], image: 'https://images.unsplash.com/photo-1540202404-a2f29016b523?w=600', routeCount: 2, description: '观鲸与南太平洋文化' },
  { id: '92', name: '萨摩亚', country: '萨摩亚', region: '太平洋', continent: '大洋洲', dailyBudget: 350, visaType: '免签', tags: ['海岛', '瀑布', '文化'], image: 'https://images.unsplash.com/photo-1540202404-a2f29016b523?w=600', routeCount: 3, description: '乌波卢与萨瓦伊' },
  { id: '93', name: '巴布亚新几内亚', country: '巴布亚新几内亚', region: '太平洋', continent: '大洋洲', dailyBudget: 400, visaType: '签证', tags: ['部落', '潜水', '小众'], image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600', routeCount: 3, description: '部落文化与珊瑚海' },
  { id: '94', name: '亚美尼亚', country: '亚美尼亚', region: '高加索', continent: '亚洲', dailyBudget: 200, visaType: '电子签', tags: ['修道院', '葡萄酒', '物价友好'], image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600', routeCount: 4, description: '埃里温、塞凡湖、塔特夫' },
  { id: '95', name: '黎巴嫩', country: '黎巴嫩', region: '西亚', continent: '亚洲', dailyBudget: 350, visaType: '落地签', tags: ['古迹', '地中海', '雪松'], image: 'https://images.unsplash.com/photo-1512632579908-17e19e3d2b3e?w=600', routeCount: 4, description: '贝鲁特、巴勒贝克、的黎波里' },
  { id: '96', name: '阿尔巴尼亚', country: '阿尔巴尼亚', region: '东欧', continent: '欧洲', dailyBudget: 220, visaType: '免签', tags: ['海岸', '物价友好', '小众'], image: 'https://images.unsplash.com/photo-1559827260-dc66d43bef33?w=600', routeCount: 4, description: '地拉那、萨兰达、培拉特' },
  { id: '97', name: '黑山', country: '黑山', region: '东欧', continent: '欧洲', dailyBudget: 280, visaType: '签证', tags: ['峡湾', '古城', '海岸'], image: 'https://images.unsplash.com/photo-1559827260-dc66d43bef33?w=600', routeCount: 4, description: '科托尔、布德瓦、杜米托尔' },
  { id: '98', name: '尼加拉瓜', country: '尼加拉瓜', region: '中美洲', continent: '北美', dailyBudget: 180, visaType: '落地签', tags: ['火山', '殖民', '便宜'], image: 'https://images.unsplash.com/photo-1518638150340-f706e16654f4?w=600', routeCount: 3, description: '格拉纳达、奥梅特佩、莱昂' },
  { id: '99', name: '厄立特里亚', country: '厄立特里亚', region: '东非', continent: '非洲', dailyBudget: 200, visaType: '签证', tags: ['红海', '意式', '小众'], image: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=600', routeCount: 2, description: '阿斯马拉与马萨瓦' },
  { id: '100', name: '阿曼', country: '阿曼', region: '西亚', continent: '亚洲', dailyBudget: 350, visaType: '电子签', tags: ['沙漠', '古堡', '海岸'], image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600', routeCount: 4, description: '马斯喀特、尼兹瓦、瓦希巴沙漠' },
  { id: '101', name: '吉尔吉斯斯坦', country: '吉尔吉斯斯坦', region: '中亚', continent: '亚洲', dailyBudget: 180, visaType: '免签', tags: ['天山', '骑马', '湖泊'], image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600', routeCount: 4, description: '伊塞克湖、比什凯克、阿尔斯兰博布' },
  { id: '102', name: '不丹', country: '不丹', region: '南亚', continent: '亚洲', dailyBudget: 250, visaType: '签证', tags: ['幸福', '寺庙', '徒步'], image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600', routeCount: 4, description: '廷布、帕罗、虎穴寺' },
  { id: '103', name: '东帝汶', country: '东帝汶', region: '东南亚', continent: '亚洲', dailyBudget: 150, visaType: '落地签', tags: ['潜水', '小众', '便宜'], image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600', routeCount: 3, description: '帝力与阿陶罗岛' },
  { id: '104', name: '孟加拉国', country: '孟加拉国', region: '南亚', continent: '亚洲', dailyBudget: 120, visaType: '签证', tags: ['便宜', '人文', '红树林'], image: 'https://images.unsplash.com/photo-1524492479098-5e0a4b2f52e0?w=600', routeCount: 3, description: '达卡、库卡塔、孙德尔本斯' },
  { id: '105', name: '卢森堡', country: '卢森堡', region: '西欧', continent: '欧洲', dailyBudget: 450, visaType: '申根签', tags: ['城堡', '欧盟', '小国'], image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=600', routeCount: 3, description: '卢森堡城与 Mullerthal' },
  { id: '106', name: '斯洛伐克', country: '斯洛伐克', region: '东欧', continent: '欧洲', dailyBudget: 260, visaType: '申根签', tags: ['城堡', '塔特拉山', '物价友好'], image: 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=600', routeCount: 4, description: '布拉迪斯拉发、高塔特拉' },
  { id: '107', name: '立陶宛', country: '立陶宛', region: '波罗的海', continent: '欧洲', dailyBudget: 280, visaType: '申根签', tags: ['十字架山', '琥珀', '古城'], image: 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=600', routeCount: 4, description: '维尔纽斯、特拉凯、十字架山' },
  { id: '108', name: '爱沙尼亚', country: '爱沙尼亚', region: '波罗的海', continent: '欧洲', dailyBudget: 300, visaType: '申根签', tags: ['数字', '古城', '森林'], image: 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?w=600', routeCount: 4, description: '塔林、拉赫马国家公园' },
  { id: '109', name: '塞尔维亚', country: '塞尔维亚', region: '东欧', continent: '欧洲', dailyBudget: 220, visaType: '免签', tags: ['物价友好', '夜生活', '修道院'], image: 'https://images.unsplash.com/photo-1559827260-dc66d43bef33?w=600', routeCount: 4, description: '贝尔格莱德、诺维萨德' },
  { id: '110', name: '马耳他', country: '马耳他', region: '地中海', continent: '欧洲', dailyBudget: 350, visaType: '申根签', tags: ['海岛', '历史', '蓝洞'], image: 'https://images.unsplash.com/photo-1533105077500-1b7a6ea907da?w=600', routeCount: 4, description: '瓦莱塔、戈佐、蓝洞' },
  { id: '111', name: '塞浦路斯', country: '塞浦路斯', region: '地中海', continent: '欧洲', dailyBudget: 320, visaType: '申根签', tags: ['海滩', '古迹', '双文化'], image: 'https://images.unsplash.com/photo-1533105077500-1b7a6ea907da?w=600', routeCount: 4, description: '尼科西亚、帕福斯、阿依纳帕' },
  { id: '112', name: '多米尼加', country: '多米尼加', region: '加勒比', continent: '北美', dailyBudget: 280, visaType: '免签', tags: ['海滩', '殖民', '便宜'], image: 'https://images.unsplash.com/photo-1518638150340-f706e16654f4?w=600', routeCount: 4, description: '圣多明各、蓬塔卡纳' },
  { id: '113', name: '伯利兹', country: '伯利兹', region: '中美洲', continent: '北美', dailyBudget: 300, visaType: '签证', tags: ['大蓝洞', '玛雅', '潜水'], image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=600', routeCount: 4, description: '大蓝洞、伯利兹城、卡约' },
  { id: '114', name: '圭亚那', country: '圭亚那', region: '南美', continent: '南美', dailyBudget: 250, visaType: '签证', tags: ['凯厄图尔', '雨林', '小众'], image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=600', routeCount: 3, description: '凯厄图尔瀑布与乔治城' },
  { id: '115', name: '苏里南', country: '苏里南', region: '南美', continent: '南美', dailyBudget: 280, visaType: '签证', tags: ['雨林', '多元', '小众'], image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=600', routeCount: 3, description: '帕拉马里博与内陆' },
  { id: '116', name: '埃塞俄比亚', country: '埃塞俄比亚', region: '东非', continent: '非洲', dailyBudget: 180, visaType: '电子签', tags: ['咖啡', '拉利贝拉', '人文'], image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600', routeCount: 5, description: '拉利贝拉、阿克苏姆、奥莫河谷' },
  { id: '117', name: '马拉维', country: '马拉维', region: '东部非洲', continent: '非洲', dailyBudget: 200, visaType: '落地签', tags: ['马拉维湖', '友好', '小众'], image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=600', routeCount: 3, description: '利隆圭、马拉维湖' },
  { id: '118', name: '莫桑比克', country: '莫桑比克', region: '东南非洲', continent: '非洲', dailyBudget: 220, visaType: '落地签', tags: ['海滩', '海岛', '潜水'], image: 'https://images.unsplash.com/photo-1540202404-a2f29016b523?w=600', routeCount: 4, description: '马普托、巴扎鲁托、伊尼扬巴内' },
  { id: '119', name: '所罗门群岛', country: '所罗门群岛', region: '太平洋', continent: '大洋洲', dailyBudget: 350, visaType: '签证', tags: ['二战', '潜水', '小众'], image: 'https://images.unsplash.com/photo-1540202404-a2f29016b523?w=600', routeCount: 3, description: '瓜达尔卡纳尔与潜水' },
  { id: '120', name: '保加利亚', country: '保加利亚', region: '东欧', continent: '欧洲', dailyBudget: 220, visaType: '申根签', tags: ['玫瑰', '修道院', '物价友好'], image: 'https://images.unsplash.com/photo-1559827260-dc66d43bef33?w=600', routeCount: 4, description: '索菲亚、普罗夫迪夫、里拉修道院' },
  { id: '121', name: '北马其顿', country: '北马其顿', region: '东欧', continent: '欧洲', dailyBudget: 200, visaType: '签证', tags: ['奥赫里德', '物价友好', '历史'], image: 'https://images.unsplash.com/photo-1559827260-dc66d43bef33?w=600', routeCount: 4, description: '斯科普里、奥赫里德湖' },
  { id: '122', name: '拉脱维亚', country: '拉脱维亚', region: '波罗的海', continent: '欧洲', dailyBudget: 280, visaType: '申根签', tags: ['里加', '新艺术', '海滩'], image: 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?w=600', routeCount: 4, description: '里加、尤尔马拉、锡古尔达' },
  { id: '123', name: '洪都拉斯', country: '洪都拉斯', region: '中美洲', continent: '北美', dailyBudget: 200, visaType: '签证', tags: ['科潘', '潜水', '玛雅'], image: 'https://images.unsplash.com/photo-1518638150340-f706e16654f4?w=600', routeCount: 4, description: '科潘遗址、罗阿坦岛' },
  { id: '124', name: '科威特', country: '科威特', region: '西亚', continent: '亚洲', dailyBudget: 400, visaType: '签证', tags: ['现代', '沙漠', '海湾'], image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600', routeCount: 3, description: '科威特城与沙漠' },
  { id: '125', name: '塞舌尔', country: '塞舌尔', region: '印度洋', continent: '非洲', dailyBudget: 600, visaType: '免签', tags: ['海岛', '潜水', '蜜月'], image: 'https://images.unsplash.com/photo-1540202404-a2f29016b523?w=600', routeCount: 3, description: '马埃、普拉兰、拉迪格' },
  { id: '126', name: '留尼汪', country: '留尼汪', region: '印度洋', continent: '非洲', dailyBudget: 450, visaType: '申根签', tags: ['火山', '徒步', '法属'], image: 'https://images.unsplash.com/photo-1523482580671-f216ba185ece?w=600', routeCount: 3, description: '火山与环岛' },
]

export const featuredRoutes = [
  {
    id: 'r1',
    title: '3000元环游泰国7天',
    budget: 3000,
    days: 7,
    destination: '泰国',
    image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600',
    cover: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600',
    tags: ['曼谷', '清迈', '海岛'],
  },
  {
    id: 'r2',
    title: '5000元越南南北穿越10天',
    budget: 5000,
    days: 10,
    destination: '越南',
    image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=600',
    cover: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=600',
    tags: ['河内', '岘港', '芽庄'],
  },
  {
    id: 'r3',
    title: '8000元穷游日本关西5天',
    budget: 8000,
    days: 5,
    destination: '日本',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600',
    cover: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600',
    tags: ['大阪', '京都', '奈良'],
  },
  {
    id: 'r4',
    title: '2000元尼泊尔徒步7天',
    budget: 2000,
    days: 7,
    destination: '尼泊尔',
    image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=600',
    cover: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=600',
    tags: ['加德满都', '博卡拉', 'ABC小环线'],
  },
]

export const articles = [
  {
    id: 'a1',
    title: '曼谷+清迈7日穷游攻略：人均3000玩到爽',
    cover: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600',
    author: '背包客小明',
    date: '2025-02-15',
    destination: '泰国',
    budget: 3000,
    days: 7,
    likes: 1280,
    views: 15600,
    tags: ['独行', '美食', '寺庙'],
  },
  {
    id: 'a2',
    title: '越南火车旅行：河内到胡志明省钱攻略',
    cover: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=600',
    author: '穷游达人',
    date: '2025-02-10',
    destination: '越南',
    budget: 4500,
    days: 10,
    likes: 892,
    views: 12300,
    tags: ['火车', '海岸线', '咖啡'],
  },
  {
    id: 'a3',
    title: '日本关西5日游：青旅+便利店省钱大法',
    cover: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600',
    author: '樱花妹',
    date: '2025-02-05',
    destination: '日本',
    budget: 7500,
    days: 5,
    likes: 2103,
    views: 28900,
    tags: ['情侣', '美食', '购物'],
  },
  {
    id: 'a4',
    title: '尼泊尔ABC徒步：2000元完成雪山梦',
    cover: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=600',
    author: '徒步爱好者',
    date: '2025-01-28',
    destination: '尼泊尔',
    budget: 2000,
    days: 7,
    likes: 1567,
    views: 18900,
    tags: ['徒步', '独行', '雪山'],
  },
  {
    id: 'a5',
    title: '美国西海岸15天穷游：洛杉矶-旧金山-一号公路',
    cover: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600',
    author: '公路旅行',
    date: '2025-02-01',
    destination: '美国',
    budget: 12000,
    days: 15,
    likes: 756,
    views: 9800,
    tags: ['自驾', '海岸', '国家公园'],
  },
  {
    id: 'a6',
    title: '西班牙8日：巴塞罗那+马德里+安达卢西亚',
    cover: 'https://images.unsplash.com/photo-1543785734-4b6e564642f8?w=600',
    author: '欧洲穷游',
    date: '2025-01-20',
    destination: '西班牙',
    budget: 8500,
    days: 8,
    likes: 1102,
    views: 14200,
    tags: ['建筑', '美食', '城市'],
  },
  {
    id: 'a7',
    title: '澳大利亚东海岸10天：悉尼-大洋路-大堡礁',
    cover: 'https://images.unsplash.com/photo-1523482580671-f216ba185ece?w=600',
    author: '澳新玩家',
    date: '2025-01-15',
    destination: '澳大利亚',
    budget: 15000,
    days: 10,
    likes: 934,
    views: 11500,
    tags: ['自驾', '海岸', '自然'],
  },
  {
    id: 'a8',
    title: '秘鲁马丘比丘+亚马逊7日穷游攻略',
    cover: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=600',
    author: '南美背包客',
    date: '2025-01-10',
    destination: '秘鲁',
    budget: 6500,
    days: 7,
    likes: 678,
    views: 8900,
    tags: ['徒步', '文化', '雨林'],
  },
  {
    id: 'a9',
    title: '柬埔寨吴哥窟+金边5日：人均2000',
    cover: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600',
    author: '东南亚控',
    date: '2025-01-05',
    destination: '柬埔寨',
    budget: 2000,
    days: 5,
    likes: 1456,
    views: 16800,
    tags: ['古迹', '便宜', '独行'],
  },
  {
    id: 'a10',
    title: '摩洛哥撒哈拉+菲斯+舍夫沙万9日',
    cover: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=600',
    author: '非洲行者',
    date: '2024-12-28',
    destination: '摩洛哥',
    budget: 5500,
    days: 9,
    likes: 823,
    views: 10200,
    tags: ['沙漠', '古城', '摄影'],
  },
  {
    id: 'a11',
    title: '冰岛环岛7日：极光与冰川',
    cover: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=600',
    author: '极光控',
    date: '2025-01-08',
    destination: '冰岛',
    budget: 12000,
    days: 7,
    likes: 612,
    views: 7600,
    tags: ['极光', '自然', '自驾'],
  },
  {
    id: 'a12',
    title: '格鲁吉亚5日：第比利斯与卡兹别克',
    cover: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600',
    author: '高加索迷',
    date: '2025-01-02',
    destination: '格鲁吉亚',
    budget: 3500,
    days: 5,
    likes: 445,
    views: 5800,
    tags: ['物价友好', '葡萄酒', '雪山'],
  },
  {
    id: 'a13',
    title: '韩国首尔釜山5日：美食与海岸',
    cover: 'https://images.unsplash.com/photo-1534274867514-d5b47ef89ed7?w=600',
    author: '韩流旅人',
    date: '2024-12-20',
    destination: '韩国',
    budget: 4500,
    days: 5,
    likes: 520,
    views: 6200,
    tags: ['美食', '购物', '海岸'],
  },
  {
    id: 'a14',
    title: '葡萄牙里斯本波尔图6日',
    cover: 'https://images.unsplash.com/photo-1555881400-74d7eac7b127?w=600',
    author: '欧陆控',
    date: '2024-12-15',
    destination: '葡萄牙',
    budget: 5500,
    days: 6,
    likes: 488,
    views: 5400,
    tags: ['海岸', '物价友好', '建筑'],
  },
  {
    id: 'a15',
    title: '埃及开罗卢克索阿斯旺7日',
    cover: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=600',
    author: '古文明迷',
    date: '2024-12-10',
    destination: '埃及',
    budget: 5000,
    days: 7,
    likes: 556,
    views: 7100,
    tags: ['古迹', '尼罗河', '人文'],
  },
]

const a1Content = `
## 行程概览
- **总预算**：3000元/人（不含签证）
- **天数**：7天6晚
- **交通**：亚航往返 + 泰国国内飞机

## 费用拆分
| 项目 | 费用 |
|------|------|
| 机票 | 1200元 |
| 住宿（青旅） | 600元 |
| 交通+门票 | 800元 |
| 餐饮 | 400元 |

## Day 1-2 曼谷
大皇宫、卧佛寺、考山路夜市。住宿推荐考山路青旅，一晚约80元。

## Day 3-4 清迈
飞清迈（亚航约200元），古城漫步、素贴山、周末夜市。青旅一晚约60元。

## Day 5-6 清莱/拜县
一日游白庙黑庙，或去拜县住一晚。摩托车租金约50元/天。

## Day 7 返程
清迈飞曼谷转机回国。

## 省钱Tips
1. 提前3个月盯亚航大促
2. 711解决早餐，人均10元
3. 用Grab打车比出租车便宜
`

const a2Content = `
## 行程概览
- **总预算**：4500元/人（不含签证）
- **天数**：10天9晚
- **交通**：火车南北线 + 大巴/拼车

## 费用拆分
| 项目 | 费用 |
|------|------|
| 机票 | 1800元 |
| 火车+大巴 | 600元 |
| 住宿（青旅/民宿） | 900元 |
| 餐饮 | 800元 |
| 门票+其他 | 400元 |

## Day 1-2 河内
还剑湖、老城区、火车街咖啡馆。夜宿河内，青旅约60元/晚。

## Day 3-4 岘港/会安
火车或sleeping bus 到岘港，巴拿山或海滩；会安古城夜景。住宿会安约80元/晚。

## Day 5-6 芽庄
占婆塔、泥浆浴、四岛游（报团约150元）。海边青旅约70元/晚。

## Day 7-9 大叻/美奈/胡志明
大叻疯狂屋、美奈红白沙丘；最后胡志明统一宫、范五老街。大巴分段约200元。

## Day 10 返程
胡志明飞回国。

## 省钱Tips
1. 火车选软座夜车省一晚住宿
2. 路边 phở、bánh mì 人均15元内
3.  Grab 比出租车便宜，提前比价
`

const a3Content = `
## 行程概览
- **总预算**：7500元/人（不含签证）
- **天数**：5天4晚
- **交通**：关西机场进出 +  JR/地铁

## 费用拆分
| 项目 | 费用 |
|------|------|
| 机票 | 2500元 |
| 住宿（青旅/胶囊） | 800元 |
| 交通（IC卡+周游券） | 600元 |
| 餐饮 | 2500元 |
| 门票+其他 | 1100元 |

## Day 1 大阪
关西机场南海电铁到难波。心斋桥、道顿堀、梅田。青旅约200元/晚。

## Day 2 大阪-京都
JR 或京阪到京都，伏见稻荷、清水寺周边。宿京都站或祇园，约220元/晚。

## Day 3 京都
金阁寺、岚山或二条城。便利店+平价定食控制餐饮。

## Day 4 奈良一日
近铁奈良，奈良公园、东大寺。傍晚回大阪。

## Day 5 返程
临空城奥特莱斯或市区补货后机场返程。

## 省钱Tips
1. 关西广域周游券按行程算是否划算
2. 便利店早餐、松屋/吉野家正餐人均40–60元
3. 青旅提前订，周末涨价明显
`

const a4Content = `
## 行程概览
- **总预算**：2000元/人（不含签证）
- **天数**：7天6晚
- **交通**：加德满都进出 + 博卡拉往返 + 徒步

## 费用拆分
| 项目 | 费用 |
|------|------|
| 机票 | 800元 |
| 加德满都-博卡拉大巴 | 150元 |
| 徒步许可+背夫/向导（可选） | 300元 |
| 住宿+餐饮（山上） | 500元 |
| 其余住宿+餐饮 | 250元 |

## Day 1-2 加德满都
泰米尔办进山证、换汇。杜巴广场、猴庙。宿泰米尔青旅约40元/晚。

## Day 3 博卡拉
大巴约7小时。费瓦湖、滑翔伞（约500元可选）。宿湖边约50元/晚。

## Day 4-6 ABC 小环线
Nayapul 进山，经 Ghorepani、Poon Hill 日出、Tadapani 到 Chomrong 折返；或短线到 Australian Camp。山上住宿+餐约80–120元/天。

## Day 7 返程
博卡拉回加德满都，次日或当晚飞离。

## 省钱Tips
1. 淡季进山证有折扣
2. 不请背夫可省一大笔，轻装即可
3. 山上热水、充电多数另收费，带充电宝
`

const a5Content = `
## 行程概览
- **总预算**：12000元/人（不含签证）
- **天数**：15天14晚
- **交通**：洛杉矶进出 + 自驾一号公路段

## 费用拆分
| 项目 | 费用 |
|------|------|
| 机票 | 4500元 |
| 租车+油费 | 2200元 |
| 住宿（汽车旅馆/青旅） | 2800元 |
| 餐饮 | 1800元 |
| 门票+其他 | 700元 |

## Day 1-3 洛杉矶
好莱坞、圣莫尼卡、环球影城（可选）。青旅约200元/晚。

## Day 4-6 一号公路
圣巴巴拉、索尔万、赫氏古堡、大苏尔。宿蒙特雷或卡梅尔。

## Day 7-9 旧金山
金门大桥、渔人码头、恶魔岛（预约）。市区青旅约250元/晚。

## Day 10-12 优胜美地/拉斯维加斯（二选一或绕道）
优胜美地露营或园内住宿；或拉斯维加斯住 strip 外省钱。

## Day 13-15 返程
开回洛杉矶或异地还车，购物/海滩后返程。

## 省钱Tips
1. 租车比价 + 满油还车
2. 超市自炊、In-N-Out 等快餐控餐饮
3. 国家公园年卡多人合用更划算
`

const a6Content = `
## 行程概览
- **总预算**：8500元/人（不含签证）
- **天数**：8天7晚
- **交通**：马德里或巴塞罗那进出 + 高铁/大巴

## 费用拆分
| 项目 | 费用 |
|------|------|
| 机票 | 3500元 |
| 高铁/大巴 | 800元 |
| 住宿（青旅） | 1600元 |
| 餐饮 | 2000元 |
| 门票+其他 | 600元 |

## Day 1-2 巴塞罗那
圣家堂、米拉之家、兰布拉大道、海边。青旅约220元/晚。

## Day 3 巴塞罗那-马德里
高铁约3小时。下午普拉多或索菲亚王后美术馆。

## Day 4-5 马德里
王宫、太阳门、丽池公园。周边托莱多一日游可选。

## Day 6-7 安达卢西亚
高铁到塞维利亚，西班牙广场、主教堂；可选科尔多瓦/格拉纳达阿尔罕布拉宫。

## Day 8 返程
塞维利亚或马德里飞回国。

## 省钱Tips
1. 高铁早订有优惠，大巴更便宜
2. 菜单 del día 午餐约12–15欧
3. 博物馆免费时段提前查
`

const a7Content = `
## 行程概览
- **总预算**：15000元/人（不含签证）
- **天数**：10天9晚
- **交通**：悉尼进出 + 国内段飞机 + 自驾

## 费用拆分
| 项目 | 费用 |
|------|------|
| 机票 | 5500元 |
| 国内段+租车油费 | 2500元 |
| 住宿 | 3000元 |
| 餐饮+门票 | 4000元 |

## Day 1-2 悉尼
歌剧院、海港大桥、邦迪海滩。青旅约250元/晚。

## Day 3-4 大洋路
墨尔本取车，大洋路两日：十二门徒、洛克阿德峡湾。宿阿波罗湾或坎贝尔港。

## Day 5-6 墨尔本
市区、菲利普岛企鹅（可选）。还车后飞凯恩斯或布里斯班。

## Day 7-9 大堡礁/凯恩斯
出海一日游（浮潜约400元）、库兰达雨林。宿凯恩斯约200元/晚。

## Day 10 返程
凯恩斯或悉尼飞回国。

## 省钱Tips
1. 国内段捷星/虎航提前买
2. 超市 Woolworths/Coles 自炊
3. 大堡礁选含装备的一日游即可
`

const a8Content = `
## 行程概览
- **总预算**：6500元/人（不含签证）
- **天数**：7天6晚
- **交通**：利马进出 + 库斯科/马丘比丘 + 雨林可选

## 费用拆分
| 项目 | 费用 |
|------|------|
| 机票 | 2800元 |
| 利马-库斯科机票 | 600元 |
| 马丘比丘火车+门票 | 900元 |
| 住宿+餐饮 | 1600元 |
| 雨林/其他 | 600元 |

## Day 1 利马
老城区、爱情公园、Miraflores。宿 Miraflores 青旅约120元/晚。

## Day 2-3 库斯科
飞库斯科适应海拔。武器广场、萨克塞瓦曼。宿库斯科约100元/晚。

## Day 4 马丘比丘
热水镇火车往返（或徒步印加古道需提前预约）。马丘比丘门票+巴士，全天游览。

## Day 5 库斯科-雨林
可选飞 Puerto Maldonado 或 Iquitos 进亚马逊，两日一夜雨林团约500元。

## Day 6-7 利马返程
利马补货、海边，飞回国。

## 省钱Tips
1. 马丘比丘门票和火车尽早订
2. 库斯科多喝古柯茶防高反
3. 雨林团比单独订住宿+船划算
`

const a9Content = `
## 行程概览
- **总预算**：2000元/人（不含签证）
- **天数**：5天4晚
- **交通**：暹粒进出 + 金边可选

## 费用拆分
| 项目 | 费用 |
|------|------|
| 机票 | 900元 |
| 吴哥三日票 | 约400元 |
| 住宿（青旅） | 300元 |
| 包车/突突+餐饮 | 500元 |

## Day 1 暹粒
下午到，逛老市场、酒吧街。宿青旅约60元/晚。

## Day 2 吴哥小圈
小吴哥日出、巴戎寺、塔布隆寺等。突突车一日约25美元。

## Day 3 吴哥大圈
女王宫、崩密列（需另购票）等。继续突突或拼车。

## Day 4 外圈或洞里萨湖
女王宫+高布斯滨；或洞里萨湖水上村落。傍晚可大巴去金边。

## Day 5 金边/返程
金边王宫、S21（可选），或直接暹粒飞回国。

## 省钱Tips
1. 三日票比单日划算，按需选
2. 突突比轿车便宜，提前谈好路线
3. 路边炒面、法棍人均10元内
`

const a10Content = `
## 行程概览
- **总预算**：5500元/人（不含签证）
- **天数**：9天8晚
- **交通**：卡萨布兰卡或马拉喀什进出 + 包车/大巴

## 费用拆分
| 项目 | 费用 |
|------|------|
| 机票 | 2800元 |
| 沙漠团+包车 | 1200元 |
| 住宿 | 800元 |
| 餐饮+门票 | 700元 |

## Day 1-2 马拉喀什
杰马夫纳广场、马若雷勒花园、老城。宿 Riad 约150元/晚。

## Day 3 撒哈拉两日团
经阿伊特本哈杜、达德斯峡谷进沙漠，骑骆驼、宿营地。拼团约500元/人。

## Day 4-5 菲斯
菲斯老城、皮革染坊、布日卢蓝门。宿麦地那内约120元/晚。

## Day 6 舍夫沙万
大巴到蓝色小镇，拍照、闲逛。宿约100元/晚。

## Day 7-8 丹吉尔/拉巴特
丹吉尔地中海角、或拉巴特王宫与乌达雅堡。

## Day 9 返程
卡萨布兰卡或拉巴特飞回国。

## 省钱Tips
1. 沙漠团多比价，含住宿和餐
2. 麦地那内问路多问几家防带路费
3. 砍价从三分之一起，礼貌坚持
`

const a11Content = `
## 行程概览
- **总预算**：12000元/人（不含签证）
- **天数**：7天6晚
- **交通**：雷克雅未克进出 + 租车环岛

## 费用拆分
| 项目 | 费用 |
|------|------|
| 机票 | 4500元 |
| 租车+油费 | 3500元 |
| 住宿 | 2500元 |
| 餐饮+门票 | 1500元 |

## Day 1 雷克雅未克
蓝湖（可选）、市区、哈尔格林姆大教堂。宿市区约400元/晚。

## Day 2-3 黄金圈与南岸
辛格韦德利、间歇泉、黄金瀑布；塞里雅兰瀑布、黑沙滩。宿维克或霍夫。

## Day 4-5 冰川与冰河湖
杰古沙龙、钻石沙滩、冰川徒步（报团）。宿霍芬或附近。

## Day 6 北部或返程南线
可选米湖、黛提瀑布；或经阿克雷里回雷市。宿雷市。

## Day 7 返程
市区补货、机场。极光季夜间可追极光。

## 省钱Tips
1. 多人拼车摊薄租车与油费
2. 超市 Bónus 自炊，住宿选带厨房
3. 极光免费，选无光害地点即可
`

const a12Content = `
## 行程概览
- **总预算**：3500元/人（不含签证）
- **天数**：5天4晚
- **交通**：第比利斯进出 + 包车/拼车

## 费用拆分
| 项目 | 费用 |
|------|------|
| 机票 | 1800元 |
| 包车/拼车 | 600元 |
| 住宿 | 600元 |
| 餐饮+门票 | 500元 |

## Day 1 第比利斯
老城、硫磺浴、母亲堡垒、旱桥市场。宿老城约120元/晚。

## Day 2 姆茨赫塔与古道里
世界遗产姆茨赫塔、古道里（冬季滑雪）。宿第比利斯或古道里。

## Day 3 卡兹别克
军事大道、阿纳努里城堡、格俄友谊纪念碑、斯特潘茨明达、圣三一教堂。宿卡兹别克约150元/晚。

## Day 4 西格纳吉或返程
葡萄酒小镇西格纳吉一日；或回第比利斯闲逛。

## Day 5 返程
第比利斯飞回国。

## 省钱Tips
1. 拼车用 marshrutka 或提前约人
2. 本地酒与餐厅便宜，大胆尝试
3. 电子签方便，提前办好
`

const a13Content = `
## 行程概览
- **总预算**：4500元/人（不含签证）
- **天数**：5天4晚
- **交通**：首尔进出 + KTX 往返釜山

## 费用拆分
| 项目 | 费用 |
|------|------|
| 机票 | 1800元 |
| KTX+市内交通 | 400元 |
| 住宿 | 1000元 |
| 餐饮+门票 | 1300元 |

## Day 1-2 首尔
景福宫、北村、明洞/弘大。宿弘大或明洞约220元/晚。

## Day 3 釜山
KTX 约 3 小时。甘川洞、海云台、札嘎其市场。宿海云台约250元/晚。

## Day 4 釜山
太宗台、松岛缆车或影岛。傍晚 KTX 回首尔。

## Day 5 返程
首尔市区补货，仁川机场返程。

## 省钱Tips
1. 提前买 KTX 有折扣
2. 便利店与街头小吃控餐饮
3. 免税店与奥特莱斯比价
`

const a14Content = `
## 行程概览
- **总预算**：5500元/人（不含签证）
- **天数**：6天5晚
- **交通**：里斯本进出 + 火车往返波尔图

## 费用拆分
| 项目 | 费用 |
|------|------|
| 机票 | 2800元 |
| 火车+市内 | 400元 |
| 住宿 | 1200元 |
| 餐饮+门票 | 1100元 |

## Day 1-2 里斯本
贝伦塔、热罗尼莫斯修道院、28 路电车、阿尔法玛。宿约 220 元/晚。

## Day 3 辛特拉一日
火车往返，佩纳宫、罗卡角。宿里斯本。

## Day 4-5 波尔图
火车约 3 小时。路易一世大桥、利贝拉、酒窖。宿约 200 元/晚。

## Day 6 返程
波尔图或里斯本飞回国。

## 省钱Tips
1. 里斯本卡按需买
2. 蛋挞与海鲜实惠
3. 火车早订有优惠
`

const a15Content = `
## 行程概览
- **总预算**：5000元/人（不含签证）
- **天数**：7天6晚
- **交通**：开罗进出 + 夜火车/飞机 卢克索/阿斯旺

## 费用拆分
| 项目 | 费用 |
|------|------|
| 机票 | 2200元 |
| 国内交通+门票 | 1200元 |
| 住宿 | 800元 |
| 餐饮+包车 | 800元 |

## Day 1-2 开罗
金字塔、埃及博物馆、哈利利。宿约 120 元/晚。

## Day 3 飞卢克索
卡纳克、卢克索神庙。夜宿卢克索或夜火车往阿斯旺。

## Day 4-5 阿斯旺
阿布辛贝（凌晨出发）、菲莱神庙、努比亚村。宿阿斯旺。

## Day 6 卢克索西岸
帝王谷、哈特谢普苏特神庙。宿卢克索。

## Day 7 返程
卢克索或开罗飞回国。

## 省钱Tips
1. 门票用埃镑现场买
2. 包车与导游多比价
3. 阿布辛贝跟团省心
`

export const articleDetails = {
  a1: Object.assign(articles.find(a => a.id === 'a1'), { content: a1Content }),
  a2: Object.assign(articles.find(a => a.id === 'a2'), { content: a2Content }),
  a3: Object.assign(articles.find(a => a.id === 'a3'), { content: a3Content }),
  a4: Object.assign(articles.find(a => a.id === 'a4'), { content: a4Content }),
  a5: Object.assign(articles.find(a => a.id === 'a5'), { content: a5Content }),
  a6: Object.assign(articles.find(a => a.id === 'a6'), { content: a6Content }),
  a7: Object.assign(articles.find(a => a.id === 'a7'), { content: a7Content }),
  a8: Object.assign(articles.find(a => a.id === 'a8'), { content: a8Content }),
  a9: Object.assign(articles.find(a => a.id === 'a9'), { content: a9Content }),
  a10: Object.assign(articles.find(a => a.id === 'a10'), { content: a10Content }),
  a11: Object.assign(articles.find(a => a.id === 'a11'), { content: a11Content }),
  a12: Object.assign(articles.find(a => a.id === 'a12'), { content: a12Content }),
  a13: Object.assign(articles.find(a => a.id === 'a13'), { content: a13Content }),
  a14: Object.assign(articles.find(a => a.id === 'a14'), { content: a14Content }),
  a15: Object.assign(articles.find(a => a.id === 'a15'), { content: a15Content }),
}

export function getArticleDetail(id) {
  return articleDetails[id] ?? null
}

/** @deprecated 使用 getArticleDetail(id) 或 articleDetails[id] */
export const articleDetail = articleDetails.a1

export const latestArticles = articles
export const popularDestinations = destinations
export const routeToArticle = { r1: 'a1', r2: 'a2', r3: 'a3', r4: 'a4' }
export const featuredRoutesForHome = articles.slice(0, 4).map(a => ({ ...a, cover: a.cover, id: a.id }))
