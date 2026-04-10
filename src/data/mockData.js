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
  { id: '111', name: '塞浦路斯', country: '塞浦路斯', region: '地中海', continent: '欧洲', dailyBudget: 320, visaType: '签证（常与申根衔接，行前确认）', tags: ['海滩', '古迹', '双文化'], image: 'https://images.unsplash.com/photo-1533105077500-1b7a6ea907da?w=600', routeCount: 4, description: '尼科西亚、帕福斯、阿依纳帕' },
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
  { id: '127', name: '卡塔尔', country: '卡塔尔', region: '西亚', continent: '亚洲', dailyBudget: 420, visaType: '免签', tags: ['沙漠', '现代', '博物馆'], image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600', routeCount: 2, description: '多哈城市与沙漠一日' },
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
  {
    id: 'a16',
    title: '法国10日：巴黎深度+卢瓦尔城堡+圣米歇尔山',
    cover: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600',
    author: '欧陆背包客',
    date: '2025-03-01',
    destination: '法国',
    budget: 7800,
    days: 10,
    likes: 612,
    views: 8900,
    tags: ['申根', '火车', '博物馆'],
  },
  {
    id: 'a17',
    title: '德国9日：柏林历史线+慕尼黑啤酒节路线+新天鹅堡',
    cover: 'https://images.unsplash.com/photo-1560930950-5cc20e80e392?w=600',
    author: '铁道迷阿乐',
    date: '2025-03-05',
    destination: '德国',
    budget: 7200,
    days: 9,
    likes: 534,
    views: 7600,
    tags: ['火车', '城堡', '博物馆'],
  },
  {
    id: 'a18',
    title: '英国9日：伦敦博物馆+剑桥一日+爱丁堡古城',
    cover: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600',
    author: '英伦慢行',
    date: '2025-03-08',
    destination: '英国',
    budget: 9800,
    days: 9,
    likes: 445,
    views: 6200,
    tags: ['博物馆', '火车', '古城'],
  },
  {
    id: 'a19',
    title: '意大利11日：罗马佛罗伦萨威尼斯经典三角',
    cover: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=600',
    author: '文艺复兴迷',
    date: '2025-03-12',
    destination: '意大利',
    budget: 9200,
    days: 11,
    likes: 889,
    views: 11200,
    tags: ['艺术', '高铁', '世界遗产'],
  },
  {
    id: 'a20',
    title: '印尼12日：巴厘岛乌布+佩尼达+日惹婆罗浮屠',
    cover: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600',
    author: '赤道潜水员',
    date: '2025-03-15',
    destination: '印度尼西亚',
    budget: 5200,
    days: 12,
    likes: 723,
    views: 9800,
    tags: ['海岛', '古迹', '火山'],
  },
  {
    id: 'a21',
    title: '斯里兰卡9日：茶园火车+雅拉Safari+南部海岸',
    cover: 'https://images.unsplash.com/photo-1580619305218-8423a7ef79d0?w=600',
    author: '锡兰慢旅',
    date: '2025-03-18',
    destination: '斯里兰卡',
    budget: 4300,
    days: 9,
    likes: 567,
    views: 8100,
    tags: ['火车', '野生动物', '海滩'],
  },
  {
    id: 'a22',
    title: '马来西亚8日：吉隆坡双子塔+槟城壁画+兰卡威跳岛',
    cover: 'https://images.unsplash.com/photo-1596422846543-75c6ee1976e5?w=600',
    author: '南洋吃货',
    date: '2025-03-20',
    destination: '马来西亚',
    budget: 3600,
    days: 8,
    likes: 698,
    views: 9400,
    tags: ['美食', '海岛', '便宜'],
  },
  {
    id: 'a23',
    title: '土耳其11日：伊斯坦布尔双洲+卡帕热气球+棉花堡',
    cover: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600',
    author: '丝路行者',
    date: '2025-03-22',
    destination: '土耳其',
    budget: 5800,
    days: 11,
    likes: 812,
    views: 10500,
    tags: ['热气球', '古迹', '温泉'],
  },
  {
    id: 'a24',
    title: '墨西哥9日：坎昆周边+奇琴伊察+图卢姆滨海玛雅',
    cover: 'https://images.unsplash.com/photo-1518638150340-f706e16654f4?w=600',
    author: '玛雅迷',
    date: '2025-03-25',
    destination: '墨西哥',
    budget: 6400,
    days: 9,
    likes: 398,
    views: 5400,
    tags: ['玛雅', '海滩', '自驾'],
  },
  {
    id: 'a25',
    title: '新西兰南岛11日：特卡波星空+库克山+皇后镇米尔福德',
    cover: 'https://images.unsplash.com/photo-1469521669194-babb45f83517?w=600',
    author: '中土自驾',
    date: '2025-03-28',
    destination: '新西兰',
    budget: 15200,
    days: 11,
    likes: 921,
    views: 13400,
    tags: ['自驾', '徒步', '湖光'],
  },
  {
    id: 'a26',
    title: '捷奥10日：布拉格+CK小镇+维也纳音乐之城',
    cover: 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=600',
    author: '中欧小城控',
    date: '2025-04-01',
    destination: '捷克',
    budget: 6500,
    days: 10,
    likes: 655,
    views: 8800,
    tags: ['古城', '申根', '音乐'],
  },
  {
    id: 'a27',
    title: '希腊9日：雅典卫城+圣托里尼蓝白小镇+米克诺斯',
    cover: 'https://images.unsplash.com/photo-1533105077500-1b7a6ea907da?w=600',
    author: '爱琴海日落',
    date: '2025-04-04',
    destination: '希腊',
    budget: 7600,
    days: 9,
    likes: 1024,
    views: 15600,
    tags: ['海岛', '古迹', '日落'],
  },
  {
    id: 'a28',
    title: '新加坡5日：滨海湾夜景+牛车水美食+圣淘沙轻度假',
    cover: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600',
    author: '狮城暴走',
    date: '2025-04-08',
    destination: '新加坡',
    budget: 4200,
    days: 5,
    likes: 887,
    views: 12100,
    tags: ['城市', '美食', '亲子'],
  },
  {
    id: 'a29',
    title: '加拿大10日：温哥华市区+班夫路易斯湖+贾斯珀冰原大道',
    cover: 'https://images.unsplash.com/photo-1519832979-6fa011b87667?w=600',
    author: '落基山自驾',
    date: '2025-04-10',
    destination: '加拿大',
    budget: 11800,
    days: 10,
    likes: 756,
    views: 9900,
    tags: ['自驾', '国家公园', '湖光'],
  },
  {
    id: 'a30',
    title: '阿根廷12日：布宜诺斯艾利斯探戈+伊瓜苏瀑布+巴里洛切湖光',
    cover: 'https://images.unsplash.com/photo-1612296480922-207807b05c99?w=600',
    author: '南美长线',
    date: '2025-04-12',
    destination: '阿根廷',
    budget: 9200,
    days: 12,
    likes: 512,
    views: 6800,
    tags: ['瀑布', '徒步', '城市'],
  },
  {
    id: 'a31',
    title: '挪威10日：罗弗敦群岛徒步+特罗姆瑟极光+奥斯陆峡湾',
    cover: 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?w=600',
    author: '北极圈追光',
    date: '2025-04-15',
    destination: '挪威',
    budget: 14500,
    days: 10,
    likes: 634,
    views: 8900,
    tags: ['极光', '徒步', '摄影'],
  },
  {
    id: 'a32',
    title: '瑞典8日：斯德哥尔摩群岛+基律纳冰酒店+阿比斯库国家公园',
    cover: 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?w=600',
    author: '北欧慢旅',
    date: '2025-04-18',
    destination: '瑞典',
    budget: 11200,
    days: 8,
    likes: 498,
    views: 7200,
    tags: ['极光', '设计', '自然'],
  },
  {
    id: 'a33',
    title: '荷兰7日：阿姆斯特丹运河+风车村+海牙莫瑞泰斯皇家美术馆',
    cover: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=600',
    author: '单车与郁金香',
    date: '2025-04-20',
    destination: '荷兰',
    budget: 6800,
    days: 7,
    likes: 721,
    views: 9500,
    tags: ['博物馆', '运河', '骑行'],
  },
  {
    id: 'a34',
    title: '瑞士9日：苏黎世进日内瓦出+因特拉肯少女峰+琉森湖游船',
    cover: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=600',
    author: '阿尔卑斯控',
    date: '2025-04-22',
    destination: '瑞士',
    budget: 13800,
    days: 9,
    likes: 892,
    views: 11800,
    tags: ['雪山', '火车', '徒步'],
  },
  {
    id: 'a35',
    title: '匈牙利6日：布达佩斯温泉浴场+渔人堡夜景+巴拉顿湖小镇',
    cover: 'https://images.unsplash.com/photo-1559827260-dc66d43bef33?w=600',
    author: '多瑙河之夜',
    date: '2025-04-25',
    destination: '匈牙利',
    budget: 4800,
    days: 6,
    likes: 589,
    views: 8100,
    tags: ['温泉', '古城', '物价友好'],
  },
  {
    id: 'a36',
    title: '克罗地亚8日：杜布罗夫尼克君临城+斯普利特戴克里先宫+十六湖',
    cover: 'https://images.unsplash.com/photo-1559827260-dc66d43bef33?w=600',
    author: '亚得里亚海',
    date: '2025-04-28',
    destination: '克罗地亚',
    budget: 7200,
    days: 8,
    likes: 812,
    views: 10400,
    tags: ['世界遗产', '海岛', '权游'],
  },
  {
    id: 'a37',
    title: '芬兰8日：赫尔辛基设计之都+罗瓦涅米圣诞老人村+极地博物馆',
    cover: 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?w=600',
    author: '拉普兰雪线',
    date: '2025-05-01',
    destination: '芬兰',
    budget: 10500,
    days: 8,
    likes: 578,
    views: 8200,
    tags: ['极光', '桑拿', '亲子'],
  },
  {
    id: 'a38',
    title: '丹麦6日：哥本哈根自行车之城+欧登塞安徒生+比隆乐高一日',
    cover: 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?w=600',
    author: '童话骑行',
    date: '2025-05-03',
    destination: '丹麦',
    budget: 7200,
    days: 6,
    likes: 612,
    views: 8800,
    tags: ['亲子', '设计', '骑行'],
  },
  {
    id: 'a39',
    title: '智利10日：圣地亚哥+瓦尔帕莱索彩色港+阿塔卡马星空沙漠',
    cover: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600',
    author: '安第斯之风',
    date: '2025-05-06',
    destination: '智利',
    budget: 9800,
    days: 10,
    likes: 423,
    views: 6100,
    tags: ['沙漠', '徒步', '摄影'],
  },
  {
    id: 'a40',
    title: '南非12日：开普敦桌山+花园大道+赫曼努斯观鲸（季）',
    cover: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=600',
    author: '好望角之路',
    date: '2025-05-08',
    destination: '南非',
    budget: 11200,
    days: 12,
    likes: 389,
    views: 5500,
    tags: ['自驾', '海岸', '野生动物'],
  },
  {
    id: 'a41',
    title: '波兰10日：华沙老城重生+克拉科夫古城+奥斯维辛一日+扎科帕内山区',
    cover: 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=600',
    author: '东欧史迹',
    date: '2025-05-10',
    destination: '波兰',
    budget: 6200,
    days: 10,
    likes: 501,
    views: 7400,
    tags: ['历史', '申根', '雪山'],
  },
  {
    id: 'a42',
    title: '爱尔兰8日：都柏林文学酒馆+莫赫悬崖+高威西海岸',
    cover: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600',
    author: '绿岛漫游',
    date: '2025-05-12',
    destination: '爱尔兰',
    budget: 8900,
    days: 8,
    likes: 467,
    views: 6900,
    tags: ['自然', '海岸', '威士忌'],
  },
  {
    id: 'a43',
    title: '约旦8日：安曼城堡山+佩特拉古城+瓦迪拉姆火星营地+死海漂浮',
    cover: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=600',
    author: '玫瑰红城',
    date: '2025-05-15',
    destination: '约旦',
    budget: 6800,
    days: 8,
    likes: 934,
    views: 11900,
    tags: ['世界遗产', '沙漠', '死海'],
  },
  {
    id: 'a44',
    title: '突尼斯7日：迦太基遗址+蓝白小镇西迪布赛义德+苏塞麦地那',
    cover: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=600',
    author: '地中海门户',
    date: '2025-05-18',
    destination: '突尼斯',
    budget: 4500,
    days: 7,
    likes: 356,
    views: 4800,
    tags: ['古迹', '免签', '海岸'],
  },
  {
    id: 'a45',
    title: '巴西9日：里约基督山+糖面包山+伊瓜苏瀑布（巴西侧全景）',
    cover: 'https://images.unsplash.com/photo-1612296480922-207807b05c99?w=600',
    author: '桑巴海岸',
    date: '2025-05-20',
    destination: '巴西',
    budget: 10500,
    days: 9,
    likes: 628,
    views: 8600,
    tags: ['瀑布', '海滩', '城市'],
  },
  {
    id: 'a46',
    title: '坦桑尼亚10日：塞伦盖蒂Safari+恩戈罗火山口+桑给巴尔白沙滩',
    cover: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600',
    author: '东非大裂谷',
    date: '2025-05-25',
    destination: '坦桑尼亚',
    budget: 15800,
    days: 10,
    likes: 712,
    views: 9800,
    tags: ['Safari', '海岛', '摄影'],
  },
  {
    id: 'a47',
    title: '高加索10日：格鲁吉亚雪山红酒乡+亚美尼亚修道院与塞凡湖',
    cover: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600',
    author: '高加索联线',
    date: '2025-05-28',
    destination: '格鲁吉亚',
    budget: 7200,
    days: 10,
    likes: 645,
    views: 9100,
    tags: ['徒步', '红酒', '古迹'],
  },
  {
    id: 'a48',
    title: '秘鲁10日：利马美食+库斯科适应+圣谷+彩虹山+马丘比丘火车全攻略',
    cover: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=600',
    author: '安第斯之门',
    date: '2025-06-01',
    destination: '秘鲁',
    budget: 8900,
    days: 10,
    likes: 834,
    views: 12100,
    tags: ['世界遗产', '徒步', '火车'],
  },
  {
    id: 'a49',
    title: '纳米比亚10日：45号沙丘日出+死亡谷+鲸湾火烈鸟+埃托沙自驾',
    cover: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=600',
    author: '红沙漠与星轨',
    date: '2025-06-04',
    destination: '纳米比亚',
    budget: 13200,
    days: 10,
    likes: 521,
    views: 7600,
    tags: ['自驾', '沙漠', '野生动物'],
  },
  {
    id: 'a50',
    title: '肯尼亚8日：马赛马拉大迁徙季Safari+纳瓦沙湖+内罗毕长颈鹿中心',
    cover: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600',
    author: '东非稀树草原',
    date: '2025-06-06',
    destination: '肯尼亚',
    budget: 12500,
    days: 8,
    likes: 688,
    views: 9400,
    tags: ['Safari', '野生动物', '摄影'],
  },
  {
    id: 'a51',
    title: '缅甸10日：仰光大金塔+蒲甘日出佛塔+曼德勒乌本桥+茵莱湖单脚划船',
    cover: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600',
    author: '万塔之国',
    date: '2025-06-08',
    destination: '缅甸',
    budget: 4600,
    days: 10,
    likes: 412,
    views: 5800,
    tags: ['佛教', '人文', '日出'],
  },
  {
    id: 'a52',
    title: '老挝9日：琅勃拉邦布施+光西瀑布+万荣户外+四千美岛慢生活',
    cover: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=600',
    author: '湄公慢船',
    date: '2025-06-10',
    destination: '老挝',
    budget: 3200,
    days: 9,
    likes: 756,
    views: 10200,
    tags: ['便宜', '户外', '佛教'],
  },
  {
    id: 'a53',
    title: '乌兹别克斯坦12日：撒马尔罕蓝色穹顶+布哈拉古城+希瓦花剌子模',
    cover: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600',
    author: '丝路古城记',
    date: '2025-06-12',
    destination: '乌兹别克斯坦',
    budget: 5800,
    days: 12,
    likes: 598,
    views: 8100,
    tags: ['丝绸之路', '免签', '摄影'],
  },
  {
    id: 'a54',
    title: '巴尔干8日：黑山科托尔峡湾+杜米托尔国家公园+塞尔维亚贝尔格莱德',
    cover: 'https://images.unsplash.com/photo-1559827260-dc66d43bef33?w=600',
    author: '亚得里亚内陆',
    date: '2025-06-15',
    destination: '黑山',
    budget: 6900,
    days: 8,
    likes: 623,
    views: 8900,
    tags: ['峡湾', '徒步', '夜生活'],
  },
  {
    id: 'a55',
    title: '摩洛哥12日：马拉喀什红城+撒哈拉梅尔祖卡骆驼露营+菲斯迷宫+舍夫沙万蓝白小镇',
    cover: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=600',
    author: '撒哈拉之门',
    date: '2025-06-18',
    destination: '摩洛哥',
    budget: 7200,
    days: 12,
    likes: 945,
    views: 13200,
    tags: ['沙漠', '古城', '摄影'],
  },
  {
    id: 'a56',
    title: '冰岛10日：黄金圈+南岸瀑布黑沙滩+杰古沙龙冰河湖+斯奈山半岛精华环岛',
    cover: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=600',
    author: '极光与瀑布',
    date: '2025-06-20',
    destination: '冰岛',
    budget: 15800,
    days: 10,
    likes: 1102,
    views: 16800,
    tags: ['自驾', '极光', '徒步'],
  },
  {
    id: 'a57',
    title: '蒙古8日：乌兰巴托苏赫巴托广场+特勒吉国家公园草原+哈勒和林遗址一日',
    cover: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600',
    author: '草原那达慕',
    date: '2025-06-22',
    destination: '蒙古',
    budget: 4800,
    days: 8,
    likes: 334,
    views: 5100,
    tags: ['草原', '骑马', '小众'],
  },
  {
    id: 'a58',
    title: '不丹7日：廷布大佛+帕罗河谷+虎穴寺徒步（政策与每日最低消费说明）',
    cover: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600',
    author: '雷龙之国',
    date: '2025-06-25',
    destination: '不丹',
    budget: 13500,
    days: 7,
    likes: 567,
    views: 8900,
    tags: ['徒步', '佛教', '幸福国'],
  },
  {
    id: 'a59',
    title: '埃塞俄比亚10日：拉利贝拉岩石教堂+阿克苏姆方尖碑+青尼罗河瀑布',
    cover: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600',
    author: '东非高原',
    date: '2025-06-28',
    destination: '埃塞俄比亚',
    budget: 6800,
    days: 10,
    likes: 289,
    views: 4200,
    tags: ['世界遗产', '咖啡', '人文'],
  },
  {
    id: 'a60',
    title: '伊朗12日：德黑兰国家博物馆+卡尚古城+伊斯法罕伊玛目广场+设拉子粉红清真寺',
    cover: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600',
    author: '波斯之路',
    date: '2025-07-01',
    destination: '伊朗',
    budget: 5600,
    days: 12,
    likes: 478,
    views: 6700,
    tags: ['古迹', '便宜', '摄影'],
  },
  {
    id: 'a61',
    title: '阿联酋7日：迪拜老城阿法迪+沙漠冲沙+阿布扎比大清真寺+卢浮宫海上馆',
    cover: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600',
    author: '海湾轻奢穷游',
    date: '2025-07-03',
    destination: '阿联酋',
    budget: 8200,
    days: 7,
    likes: 891,
    views: 11500,
    tags: ['沙漠', '现代', '博物馆'],
  },
  {
    id: 'a62',
    title: '菲律宾9日：马尼拉转机+爱妮岛跳岛+普林塞萨地下河+科隆沉船潜水入门',
    cover: 'https://images.unsplash.com/photo-1584118624014-d89a2c218c60?w=600',
    author: '巴拉望蓝洞',
    date: '2025-07-05',
    destination: '菲律宾',
    budget: 5200,
    days: 9,
    likes: 756,
    views: 10100,
    tags: ['海岛', '潜水', '跳岛'],
  },
  {
    id: 'a63',
    title: '尼泊尔9日：加德满都杜巴广场+博卡拉费瓦湖+萨朗科日出+班迪普尔山居',
    cover: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=600',
    author: '喜马拉雅门户',
    date: '2025-07-08',
    destination: '尼泊尔',
    budget: 3800,
    days: 9,
    likes: 923,
    views: 12800,
    tags: ['雪山', '徒步', '便宜'],
  },
  {
    id: 'a64',
    title: '越南南部9日：胡志明范五老街+美奈沙丘+大叻山城+芽庄出海（Open Bus）',
    cover: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=600',
    author: '湄公向南',
    date: '2025-07-12',
    destination: '越南',
    budget: 3800,
    days: 9,
    likes: 1045,
    views: 14200,
    tags: ['海滩', '便宜', '大巴'],
  },
  {
    id: 'a65',
    title: '日本北海道10日：札幌拉面+小樽运河+富良野花田+旭山动物园+网走流冰（季）',
    cover: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600',
    author: '雪国列车',
    date: '2025-07-15',
    destination: '日本',
    budget: 11200,
    days: 10,
    likes: 1211,
    views: 17600,
    tags: ['温泉', '亲子', '美食'],
  },
  {
    id: 'a66',
    title: '卡塔尔5日：多哈滨海大道+伊斯兰艺术博物馆+瓦其夫集市+沙漠内海冲沙',
    cover: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600',
    author: '海湾转机游',
    date: '2025-07-18',
    destination: '卡塔尔',
    budget: 6800,
    days: 5,
    likes: 412,
    views: 6200,
    tags: ['沙漠', '博物馆', '现代'],
  },
  {
    id: 'a67',
    title: '阿曼8日：马斯喀特大清真寺+尼兹瓦古堡+瓦希巴沙漠星空+苏尔海龟滩（季）',
    cover: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600',
    author: '乳香之路',
    date: '2025-07-20',
    destination: '阿曼',
    budget: 7500,
    days: 8,
    likes: 389,
    views: 5400,
    tags: ['沙漠', '古堡', '海岸'],
  },
  {
    id: 'a68',
    title: '澳大利亚塔斯马尼亚8日：霍巴特萨拉曼卡+酒杯湾+摇篮山+朗塞斯顿峡谷',
    cover: 'https://images.unsplash.com/photo-1523482580671-f216ba185ece?w=600',
    author: '世界尽头岛',
    date: '2025-07-22',
    destination: '澳大利亚',
    budget: 9800,
    days: 8,
    likes: 556,
    views: 7800,
    tags: ['徒步', '自然', '自驾'],
  },
  {
    id: 'a69',
    title: '玻利维亚8日：拉巴斯缆车之城+乌尤尼天空之镜+高原日出星轨（防高反）',
    cover: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=600',
    author: '天空之镜',
    date: '2025-07-25',
    destination: '玻利维亚',
    budget: 6200,
    days: 8,
    likes: 887,
    views: 11500,
    tags: ['高原', '摄影', '便宜'],
  },
  {
    id: 'a70',
    title: '哥伦比亚10日：波哥大黄金博物馆+麦德林Comuna 13+卡塔赫纳加勒比老城',
    cover: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=600',
    author: '咖啡与海岸',
    date: '2025-07-28',
    destination: '哥伦比亚',
    budget: 7200,
    days: 10,
    likes: 498,
    views: 6900,
    tags: ['咖啡', '古城', '海岸'],
  },
  {
    id: 'a71',
    title: '英国苏格兰10日：爱丁堡城堡+高地A82公路+格伦科+尼斯湖+天空岛波特里',
    cover: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600',
    author: '高地风笛',
    date: '2025-08-01',
    destination: '英国',
    budget: 10500,
    days: 10,
    likes: 834,
    views: 11100,
    tags: ['自驾', '湖光', '古堡'],
  },
  {
    id: 'a72',
    title: '留尼汪7日：富尔奈斯活火山徒步+三大冰斗小镇+锡拉奥瀑布与法式克里奥尔味',
    cover: 'https://images.unsplash.com/photo-1523482580671-f216ba185ece?w=600',
    author: '印度洋火山岛',
    date: '2025-08-04',
    destination: '留尼汪',
    budget: 11200,
    days: 7,
    likes: 445,
    views: 6100,
    tags: ['火山', '徒步', '申根'],
  },
  {
    id: 'a73',
    title: '韩国济州岛6日：城山日出峰+涉地可支+涯月咖啡街+汉拿山御里牧线（择）',
    cover: 'https://images.unsplash.com/photo-1596402184320-feea2f6e31b7?w=600',
    author: '海风橘子',
    date: '2025-08-08',
    destination: '韩国',
    budget: 4600,
    days: 6,
    likes: 1523,
    views: 19800,
    tags: ['海岛', '自驾', '咖啡'],
  },
  {
    id: 'a74',
    title: '马达加斯加10日：塔那那利佛+昂达西贝狐猴+穆龙达瓦猴面包树大道+奇灵地石林',
    cover: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600',
    author: '印度洋狐猴',
    date: '2025-08-10',
    destination: '马达加斯加',
    budget: 9200,
    days: 10,
    likes: 367,
    views: 5100,
    tags: ['自然', '摄影', '小众'],
  },
  {
    id: 'a75',
    title: '马来西亚沙巴7日：亚庇丹绒亚路日落+神山公园+红树林长鼻猴+马穆迪跳岛',
    cover: 'https://images.unsplash.com/photo-1596422847843-1e0c32d7e0c5?w=600',
    author: '婆罗洲潜水猫',
    date: '2025-08-12',
    destination: '马来西亚',
    budget: 5200,
    days: 7,
    likes: 1288,
    views: 17100,
    tags: ['海岛', '便宜', '亲子'],
  },
  {
    id: 'a76',
    title: '乌拉圭8日：蒙得维的亚老城+科洛尼亚德尔萨克拉门托世界遗产+埃斯特角城海滩',
    cover: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=600',
    author: '拉普拉塔河岸',
    date: '2025-08-15',
    destination: '乌拉圭',
    budget: 7400,
    days: 8,
    likes: 298,
    views: 4200,
    tags: ['古城', '海岸', '安静'],
  },
  {
    id: 'a77',
    title: '厄瓜多尔10日：基多老城赤道碑+巴尼奥斯秋千瀑布+昆卡殖民建筑+加拉帕戈斯（可选延伸）',
    cover: 'https://images.unsplash.com/photo-1566438480290-6bedf4b00678?w=600',
    author: '安第斯赤道',
    date: '2025-08-18',
    destination: '厄瓜多尔',
    budget: 8000,
    days: 10,
    likes: 512,
    views: 6800,
    tags: ['高原', '瀑布', '殖民风'],
  },
  {
    id: 'a78',
    title: '文莱5日：杰米清真寺+苏丹纪念馆+水上人家Kampong Ayer+淡布隆乌卢克腾格鲁雨林',
    cover: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=600',
    author: '和平之邦',
    date: '2025-08-20',
    destination: '文莱',
    budget: 5500,
    days: 5,
    likes: 401,
    views: 5900,
    tags: ['雨林', '清真寺', '小众'],
  },
  {
    id: 'a79',
    title: '塞浦路斯7日：帕福斯考古马赛克+尼科西亚分治线+阿依纳帕蓝洞出海+特罗多斯山村',
    cover: 'https://images.unsplash.com/photo-1580742543506-94a427b58d31?w=600',
    author: '地中海橄榄',
    date: '2025-08-22',
    destination: '塞浦路斯',
    budget: 8400,
    days: 7,
    likes: 356,
    views: 4800,
    tags: ['古迹', '海滩', '分治线'],
  },
  {
    id: 'a80',
    title: '斯洛文尼亚6日：卢布尔雅那城堡集市+布莱德湖划船+文特加峡谷+斯科契扬溶洞',
    cover: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600',
    author: '阿尔卑斯绿心',
    date: '2025-08-25',
    destination: '斯洛文尼亚',
    budget: 6800,
    days: 6,
    likes: 623,
    views: 8200,
    tags: ['湖光', '徒步', '申根'],
  },
  {
    id: 'a81',
    title: '巴拿马7日：巴拿马运河船闸观景台+老城卡斯柯维霍+圣布拉斯群岛原住民离岛（择）',
    cover: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600',
    author: '两洋运河',
    date: '2025-08-28',
    destination: '巴拿马',
    budget: 7200,
    days: 7,
    likes: 444,
    views: 6100,
    tags: ['运河', '古城', '海岛'],
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

const a16Content = `
## 行程概览
- **总预算**：7800元/人（不含国际段签证与申根）
- **天数**：10天9晚
- **交通**：巴黎进出 + SNCF 高铁/OUIGO 廉价高铁 + 区域大巴

## 费用拆分（人均参考）
| 项目 | 费用 |
|------|------|
| 中欧往返机票 | 3800–4500元 |
| 法国境内火车（含预订费） | 900–1200元 |
| 住宿（青旅/民宿混住） | 1800–2200元 |
| 博物馆通票/单馆 | 400–600元 |
| 餐饮+市内交通 | 1200–1600元 |

## Day 1–3 巴黎
- **住宿**：10–11区或北站 OUIGO 沿线青旅，提前订约 180–280 元/晚。
- **动线**：卢浮宫（网上订时段）、奥赛、杜乐丽；傍晚塞纳河步行或埃菲尔铁塔夜景。
- **通票**：若 4 天以上多馆，算一下「巴黎博物馆通票」是否划算；凡尔赛单独留一整天。
- **餐饮**：超市+面包房早餐，午餐简餐，晚餐可试一次法式小馆午市套餐（比晚餐便宜）。

## Day 4 凡尔赛宫
RER C 往返；宫殿+花园至少 5–6 小时。花园大，穿舒适鞋；夏季有音乐喷泉日可查官网。

## Day 5–6 卢瓦尔河谷城堡群
巴黎 Montparnasse 高铁到 **图尔 Tours**（约 1h），住图尔或布卢瓦。
- **舍农索、香波堡**：可报当地一日团或租车 1 天（2–3 人拼车更省）。
- 城堡间公交班次有限，**提前查 SNCF bus / BlaBlaCar**。

## Day 7–8 圣米歇尔山
图尔/巴黎转 **雷恩 Rennes**，再大巴到圣米歇尔山游客中心，接驳车上岛。
- 住山脚村镇比岛上便宜很多；可看潮汐时刻表，涨潮时拍「孤岛」。
- 修道院门票单独购买，清晨或闭园前人少。

## Day 9 回巴黎补货/蒙马特
老佛爷/玛黑区二手店；蒙马特圣心日落注意财物安全。

## Day 10 返程
戴高乐建议预留 3h+；廉航注意航站楼与退税柜台位置。

## 省钱 Tips
1. **OUIGO** 行李规格严，超重现场贵；普通 TGV 早订有 Prem’s 票。
2. 周日部分商店关门，餐饮提前备零食。
3. 自备水壶，街头饮水点可接水。
`

const a17Content = `
## 行程概览
- **总预算**：7200元/人（不含签证）
- **天数**：9天8晚
- **交通**：柏林进慕尼黑出（或反向）+ Deutsche Bahn 早鸟票 + 拜仁州票

## 费用拆分
| 项目 | 费用 |
|------|------|
| 机票（开口程） | 4200–5000元 |
| DB 火车（含巴伐利亚州票） | 700–1000元 |
| 住宿 | 1600–2000元 |
| 城堡门票+新天鹅堡接驳 | 350–500元 |
| 餐饮 | 1000–1300元 |

## Day 1–2 柏林
东边画廊、勃兰登堡门、国会大厦（免费需预约）、犹太博物馆。住米特区/克罗伊茨贝格青旅。
交通买 **24h/48h AB 票**；博物馆岛通票按兴趣选买。

## Day 3 柏林深度
查理检查站、柏林墙遗址公园；可选佩加蒙博物馆半日。

## Day 4 柏林 → 慕尼黑
ICE 早鸟约 3.5–4h；住慕尼黑 Hauptbahnhof 周边方便转车。
傍晚玛丽亚广场、谷物市场 Viktualienmarkt。

## Day 5 慕尼黑
宁芬堡、英国花园（看冲浪）；晚上 **Hofbräu** 或小众啤酒花园，大杯啤酒配烤鸡。

## Day 6 新天鹅堡
慕尼黑坐火车到 **Füssen**，公交到施万高；门票含导览时段，**务必按预约时间**。
下山可走玛丽安桥拍全景；冬季部分路段关闭查官网。

## Day 7 国王湖或萨尔茨堡（二选一）
- **国王湖**：拜仁州票覆盖区域火车+公交，游船另付；洋葱顶教堂经典机位要早到。
- **萨尔茨堡**：州票可到边境再奥地利本地票，要塞+粮食胡同 1 日够。

## Day 8 慕尼黑周边或奥特莱斯
Ingolstadt 奥特莱斯大巴；或市区德意志博物馆。

## Day 9 返程
慕尼黑机场退税预留时间；廉航注意行李。

## 省钱 Tips
1. **DB Super Sparpreis** 提前 2–6 周锁价；周末用 **拜仁州票** 2–5 人同行摊薄。
2. 超市 Aldi/Lidl 便当+啤酒，晚餐一顿吃好即可。
3. 新天鹅堡现场买票可能排队，官网预约省时间。
`

const a18Content = `
## 行程概览
- **总预算**：9800元/人（不含英签）
- **天数**：9天8晚
- **交通**：伦敦进出 + National Rail 提前票 + 爱丁堡卧铺/日间火车

## 费用拆分
| 项目 | 费用 |
|------|------|
| 机票 | 4800–6000元 |
| 伦敦牡蛎卡/Contactless | 约 300–400元 |
| 伦敦–爱丁堡火车 | 800–1400元（浮动大） |
| 住宿 | 2200–2800元 |
| 门票+餐饮 | 1200–1600元 |

## Day 1–3 伦敦
大英博物馆（免费）、国家美术馆；**大本钟/西敏寺**外观+泰特现代。
**牡蛎卡日封顶**比单程划算；避开高峰地铁票价。

## Day 4 剑桥一日
利物浦街或国王十字火车到 Cambridge，往返早订。
康河撑篙可拼船；国王学院礼拜堂门票单独买。

## Day 5 伦敦–爱丁堡
LNER 日间约 4.5h；或 **Caledonian Sleeper** 省一晚住宿（票贵需早订）。
住旧城区 Royal Mile 附近步行逛。

## Day 6–7 爱丁堡
爱丁堡城堡（早订票）、卡尔顿山日落、荷里路德宫；一天 **亚瑟王座** 徒步（看天气）。
威士忌体验可选基础 tour。

## Day 8 格拉斯哥半日或高地一日团（可选）
预算紧可格拉斯哥乔治广场+凯文葛罗夫博物馆（免费）当日往返。

## Day 9 返程
爱丁堡或回伦敦飞；注意英国离境退税政策变动，以现场为准。

## 省钱 Tips
1. **Trainline / LNER 官网**早鸟；周二周三往往便宜。
2. 博物馆多数捐款制或免费，特展另买票。
3. Tesco Meal Deal 解决午餐，一顿正式炸鱼薯条体验即可。
`

const a19Content = `
## 行程概览
- **总预算**：9200元/人（不含申根）
- **天数**：11天10晚
- **交通**：罗马进威尼斯出（或反向）+ Italo/Trenitalia 高铁 + 城内步行/公交

## 费用拆分
| 项目 | 费用 |
|------|------|
| 开口机票 | 4500–5500元 |
| 意铁三段（罗–佛–威） | 600–900元 |
| 住宿 | 2000–2600元 |
| 景点门票 | 800–1100元 |
| 餐饮 | 1300–1700元 |

## Day 1–3 罗马
斗兽场+古罗马广场+帕拉蒂尼 **联票务必预约时段**；万神殿、纳沃纳广场、特雷维喷泉清晨去。
梵蒂冈博物馆周日闭馆（除特殊周末），**圣彼得大教堂登顶**另排队。

## Day 4–5 佛罗伦萨
乌菲兹美术馆（早场票）、老桥、米开朗基罗广场日落。
**T骨牛排**选口碑店看谷歌评价；奥特莱斯 The Mall 大巴半日可选。

## Day 6 托斯卡纳乡村（可选）
火车到 **Siena** 或报一日基安蒂酒庄+圣吉米尼亚诺团。

## Day 7–9 威尼斯
主岛步行+水上巴士通票按天买；玻璃岛、彩色岛半日。
**圣马可钟楼**预约；总督宫联票看兴趣。

## Day 10–11 威尼斯离境
马可波罗机场水上巴士或陆路 ACTV；廉航注意手提行李尺寸。

## 省钱 Tips
1. **Italo** 促销票常比国铁便宜；越早订越稳。
2. 罗马、威尼斯中心住宿贵，选 Mestre/罗马 Termini 外 1–2 站地铁。
3. 站立咖啡 bar 价比座位便宜一半，学本地人站着喝 espresso。
`

const a20Content = `
## 行程概览
- **总预算**：5200元/人（不含机票与电子签）
- **天数**：12天11晚
- **交通**：雅加达或巴厘岛进出 + 岛内包车/Grab + 渡轮佩尼达

## 费用拆分
| 项目 | 费用 |
|------|------|
| 国际机票 | 1800–2800元 |
| 印尼国内段（飞日惹） | 400–700元 |
| 住宿（民宿+青旅） | 1200–1600元 |
| 包车/跳岛/门票 | 800–1100元 |
| 餐饮 | 800–1000元 |

## Day 1–2 库塔/水明漾适应
换汇用正规店；买 SIM 卡；海滩日落。

## Day 3–5 乌布
梯田 **Tegalalang**、圣猴林（收好眼镜）、乌布皇宫与市场。
瑜伽课体验可团购；脏鸭餐试一次即可。

## Day 6 佩尼达岛一日
Sanur 早班船；**Kelingking、Broken Beach、Angel Billabong** 路陡穿运动鞋。
跟团含午餐省心；自驾摩托仅适合老手。

## Day 7–8 图兰奔或艾湄湾（潜水可选）
岸潜看沉船；无证可体验潜。不潜水可改罗威纳追海豚（凌晨出发）。

## Day 9–10 日惹
婆罗浮屠日出票贵但值得；普兰巴南日落。
市区马车/Grab；尝试 Gudeg 传统炖菠萝蜜饭。

## Day 11–12 返程
日惹飞雅加达或直飞回国；注意火山灰航班延误买延误险。

## 省钱 Tips
1. **Grab + GoJek** 摩托车便宜但注意安全与头盔。
2. 包车按线路砍价，用地图算公里心里有数。
3. 佩尼达别穿拖鞋爬精灵坠崖；带防晒与肠胃药。
`

const a21Content = `
## 行程概览
- **总预算**：4300元/人（不含机票与 ETA）
- **天数**：9天8晚
- **交通**：科伦坡进出 + 火车高山线/海边线 + 包车段

## 费用拆分
| 项目 | 费用 |
|------|------|
| 机票 | 1600–2200元 |
| 火车（一等/二等座） | 200–350元 |
| 包车（3–4 段拼车） | 600–900元 |
| 住宿 | 900–1200元 |
| 门票+Safari | 700–1000元 |
| 餐饮 | 400–600元 |

## Day 1 尼甘布/科伦坡
鱼市、荷兰运河；休整换汇。

## Day 2–3 康提
佛牙寺（着装过膝遮肩）、康提湖；皇家植物园可选。
香料园购物点可礼貌跳过。

## Day 4 高山茶园火车
康提–努沃勒埃利耶或直达埃勒，**二等座挂车门**体验提前占座。
茶园工厂参观买茶比价。

## Day 5 埃勒
小亚当峰日出、九孔桥；民宿多风景好。

## Day 6 雅拉国家公园 Safari
吉普拼车清晨进园；看锡兰豹靠运气，象群较常见。
防尘防晒，别穿鲜艳衣服。

## Day 7–8 美瑞莎/加勒
观鲸季（11–4 月）早出海；加勒古堡漫步、灯塔日落。
海边火车 **加勒–科伦坡** 段选下午靠左座位。

## Day 9 返程
科伦坡独立广场、ODEL 补手信。

## 省钱 Tips
1. 火车票价极低，一等需早买；二等当地人友好但拥挤。
2. Safari 别信路边低价陷阱，用酒店/平台预订明码标价。
3. 咖喱饭手抓是文化体验，备湿巾；瓶装水认准密封。
`

const a22Content = `
## 行程概览
- **总预算**：3600元/人（不含机票）
- **天数**：8天7晚
- **交通**：吉隆坡进出 + 亚航国内线 + Grab + 渡轮兰卡威

## 费用拆分
| 项目 | 费用 |
|------|------|
| 机票（含槟城/兰卡威段） | 1200–1800元 |
| 住宿 | 800–1100元 |
| 市内交通+船票 | 350–500元 |
| 餐饮 | 700–950元 |
| 门票 | 200–350元 |

## Day 1–2 吉隆坡
双子塔外观夜景、独立广场、茨厂街；**黑风洞**免费注意猴子抢食。
地铁+Grab 混合；肉骨茶、椰浆饭必试。

## Day 3–4 马六甲一日/一夜
大巴 TBS 到 Melaka；红屋、鸡场街夜市、河畔夜景。
娘惹菜选老字号；三叔公手信可比价。

## Day 5–6 槟城
壁画街、姓氏桥、升旗山缆车日落。
榴莲季（6–8 月）吃猫山王；炒粿条、叻沙路边摊即可。

## Day 7 兰卡威
跳岛游（湿米岛、孕妇岛）半日；天空之桥看天气开闭。
免税巧克力可少量带，注意行李额。

## Day 8 返程
飞回吉隆坡或槟城直飞回国。

## 省钱 Tips
1. **亚航**大促锁票；手提行李称重严。
2. Grab 远途可打「拼车」类选项（如有）。
3. 兰卡威租车右舵，新手慎选；摩托需国际驾照配合当地规定。
`

const a23Content = `
## 行程概览
- **总预算**：5800元/人（不含签证）
- **天数**：11天10晚
- **交通**：伊斯坦布尔进出 + 国内飞开塞利/代尼兹利 + 大巴

## 费用拆分
| 项目 | 费用 |
|------|------|
| 机票（含两程土国国内） | 3500–4200元 |
| 住宿 | 1100–1500元 |
| 热气球+红线/绿线 | 1200–1800元（浮动大） |
| 餐饮+交通 | 800–1100元 |

## Day 1–3 伊斯坦布尔
苏丹艾哈迈德清真寺、圣索菲亚、地下水宫、大巴扎（砍价狠）。
渡轮跨欧亚看日落；独立大街叮叮车。

## Day 4–6 卡帕多奇亚
格雷梅露天博物馆、玫瑰谷徒步；**热气球**首飞看日出，淡季可到场砍价（旺季务必提前订）。
地下城选 **代林库尤** 或 **凯马克勒** 其一即可。

## Day 7–8 安塔利亚或棉花堡（路线二选一）
- **棉花堡**：代尼兹利机场大巴到 Pamukkale，钙化池赤脚疼带厚袜；希拉波利斯古城联游。
- **安塔利亚**：老城卡莱伊奇、杜登瀑布入海。

## Day 9–10 回伊斯坦布尔
博斯普鲁斯游船长途线；多尔玛巴赫切宫可选。

## Day 11 返程
IST/SAW 机场分清；退税柜台提前查。

## 省钱 Tips
1. 博物馆 **Museum Pass** 按停留天数买；圣索菲亚政策变动以现场为准。
2. 卡帕混合线团比全私人便宜；热气球认准有民航许可公司名单。
3. 餐厅前看菜单价格单位，海鲜按重量先确认。
`

const a24Content = `
## 行程概览
- **总预算**：6400元/人（不含美签/墨签政策以当时为准）
- **天数**：9天8晚
- **交通**：坎昆进出 + ADO 大巴 + 本地一日团/包车

## 费用拆分
| 项目 | 费用 |
|------|------|
| 机票 | 3800–5000元 |
| ADO 大巴 | 300–500元 |
| 住宿（坎昆酒店区外/普拉亚） | 1200–1800元 |
| 奇琴伊察+天坑一日 | 350–550元 |
| 餐饮 | 700–1000元 |

## Day 1–2 坎昆/普拉亚德尔卡曼
海滩公立入口 **Playa Delfines**；酒店区消费高可住市中心或普拉亚。
超市买水防晒，比景区便宜一半。

## Day 3 奇琴伊察 + Ik Kil 天坑
跟团含交通省折腾；金字塔 **羽蛇神光影** 春秋分前后有奇观查日历。
天坑可游泳带泳衣毛巾。

## Day 4–5 图卢姆滨海遗址
古城遗址+加勒比海同框；下午 **Gran Cenote** 浮潜早到避旅行团。
自行车租一辆沿海边公路很爽。

## Day 6 科巴或女人岛（二选一）
科巴金字塔可爬（注意台阶陡）；女人岛高尔夫车环岛。

## Day 7–8 放松或 Xcaret/Xplor（可选）
主题公园票贵，提前官网促销；穷游可海滩免费日。

## Day 9 返程
坎昆机场还车/打车预留堵车。

## 省钱 Tips
1. **ADO** 官网提前买票；大巴空调冷带外套。
2. 景区周边换汇差，市区 ATM 取比索+手续费有时更优。
3. 防晒珊瑚礁友好型；别摸玛雅石刻。
`

const a25Content = `
## 行程概览
- **总预算**：15200元/人（不含签证）
- **天数**：11天10晚
- **交通**：基督城或皇后镇进出 + 租车自驾（右舵）

## 费用拆分
| 项目 | 费用 |
|------|------|
| 机票 | 5500–7000元 |
| 租车+全险+油费 | 3200–4200元 |
| 住宿（汽车旅馆+青旅混） | 3800–4800元 |
| 活动（峡湾船、跳伞自选） | 1500–3000元 |
| 餐饮超市自炊 | 1200–1600元 |

## Day 1–2 基督城
取车适应右舵市区慢开；雅芳河、纸板大教堂。
超市采购米面肉蛋为后续自炊备货。

## Day 3 特卡波湖
好牧羊人教堂星空，**注意暗天空保护禁强光手电**。
冬春季鲁冰花；夏季观星团提前订。

## Day 4–5 普卡基湖–库克山
普卡基湖牛奶蓝路边停车点多；胡克谷步道 3h 往返平路为主。
山区天气多变带防风防水。

## Day 6–7 瓦纳卡
孤独树打卡；罗伊峰一日徒步体力要求高（8h+）慎选。
迷宫世界亲子向。

## Day 8–9 皇后镇
天空缆车+luge；格林诺奇魔戒取景半日。
**米尔福德峡湾** 往返一日车程长，可改飞机+船（贵）。

## Day 10 箭镇或水果镇克伦威尔
秋季箭镇极美；樱桃季克伦威尔采摘。

## Day 11 返程
异地还车费高尽量环线；满油还车。

## 省钱 Tips
1. 租车对比 **租租车** 与官网；全险含碎石险（挡风玻璃）。
2. 青旅厨房晚餐自炊，一顿羊排超市买比餐厅省很多。
3. 加油站自助，先查折扣卡；南岛柴油车有时更省油价低。
`

const a26Content = `
## 行程概览
- **总预算**：6500元/人（不含申根）
- **天数**：10天9晚
- **交通**：布拉格进维也纳出 + RegioJet/ÖBB + 大巴 CK 小镇

## 费用拆分
| 项目 | 费用 |
|------|------|
| 开口机票 | 3800–4800元 |
| 火车+大巴 | 500–800元 |
| 住宿 | 1400–1800元 |
| 门票+音乐会站票 | 500–900元 |
| 餐饮 | 900–1200元 |

## Day 1–3 布拉格
老城广场天文钟、查理大桥清晨去；城堡区圣维特大教堂、黄金巷。
**城堡通票**按兴趣选；啤酒浴体验可团购。

## Day 4–5 克鲁姆洛夫 Český Krumlov
Student Agency 大巴约 3h；城堡塔楼俯瞰马蹄湾伏尔塔瓦河。
漂流夏季可玩；晚上别醉走夜路石板滑。

## Day 6–7 维也纳
美泉宫（大圈票累选小圈）、霍夫堡、艺术史博物馆。
**国立歌剧院站票** 提前 1h 排队；金色大厅注意演出季与旅游团套餐区别。

## Day 8–9 维也纳慢游
纳许市场、百水屋、多瑙河岛骑行。
萨赫蛋糕咖啡馆人多可外带。

## Day 10 返程
维也纳机场退税；捷克克朗与欧元混用别剩太多克朗。

## 省钱 Tips
1. RegioJet 含免费热饮座位宽敞；ÖBB 夜车省住宿看行程。
2. 布拉格换汇**零手续费店**也有坑汇率，用卡或 ATM 更透明。
3. 维也纳超市 Hofer/Aldi 便当，餐厅主菜一份够两人分食（量大）。
`

const a27Content = `
## 行程概览
- **总预算**：7600元/人（不含申根）
- **天数**：9天8晚
- **交通**：雅典进出 + Blue Star/Seajets 渡轮 + 岛内公交

## 费用拆分
| 项目 | 费用 |
|------|------|
| 机票 | 3200–4200元 |
| 渡轮（雅典–米岛–圣岛） | 600–1000元 |
| 住宿 | 1600–2200元 |
| 门票+日落点 | 400–600元 |
| 餐饮 | 1200–1600元 |

## Day 1–2 雅典
卫城 **早 8 点开门冲**，卫城博物馆下午避暑。
普拉卡老城区散步；狼山 Lycabettus 日落打车或徒步。

## Day 3–4 米克诺斯
天堂/超级天堂海滩派对季 7–8 月；风车与小威尼斯日落。
水上出租车贵，公交够用小巴时刻表店门口可查。

## Day 5–7 圣托里尼
费拉–伊亚步道 10km 徒步看悬崖酒店全景；伊亚日落提前 2h 占位或订餐厅露台。
红沙滩、黑沙滩选其一；酒庄日落 tour 可拼团。

## Day 8 回雅典
夜船卧铺省住宿或早班飞机；比雷埃夫斯港地铁直达市区。

## Day 9 返程
机场免税橄榄油手信注意托运重量。

## 省钱 Tips
1. **Blue Star** 慢船便宜可甲板看海；Seajets 快但晃，易晕船备药。
2. 圣岛悬崖酒店贵，住 **Fira 外围**或 Perissa 黑沙滩侧性价比高。
3. 餐厅海鲜按公斤标价先确认；免费面包蘸酱可能收费问清楚。
`

const a28Content = `
## 行程概览
- **总预算**：4200元/人（不含机票与签证）
- **天数**：5天4晚
- **交通**：地铁 MRT/LRT + 公交 + 步行（EZ-Link / 信用卡 Contactless）

## 费用拆分
| 项目 | 费用 |
|------|------|
| 机票 | 1500–2500元 |
| 住宿（牛车水/武吉士青旅或民宿） | 900–1400元 |
| 门票（滨海湾花园冷室、动物园等选玩） | 400–800元 |
| 餐饮+交通卡 | 900–1300元 |

## Day 1 抵达樟宜
星耀樟宜瀑布免费看；地铁进市区办交通卡。
傍晚 **滨海湾** 金沙外圈散步，灯光秀 19:45/20:45（以官网为准）。

## Day 2 经典地标
鱼尾狮、老巴刹午餐；下午 **牛车水** 佛牙寺、马里安曼庙。
晚上克拉码头或东海岸吃辣椒蟹（可先查套餐价）。

## Day 3 圣淘沙轻度假
vivo city 缆车上岛或步行栈道；**巴拉湾海滩** 亚洲大陆最南端吊桥。
环球影城全天较累，穷游可改 **海洋馆 + 西乐索海滩** 半日。

## Day 4 文化与自然
小印度、甘榜格南哈芝巷拍照；下午 **滨海湾花园** 云雾林+花穹（室内冷带外套）。
可选河川生态园或飞禽公园（二选一）。

## Day 5 返程
乌节路补货；机场提前退税与安检，樟宜再逛一圈。

## 省钱 Tips
1. **Tap 信用卡** 可直接刷地铁（视发卡行）；EZ-Link 便利店可充。
2. 食阁 Hawker Centre 一餐 30–60 元人民币能吃饱，别总在景区餐厅。
3. 瓶装水贵，自带杯有饮水机；室内空调冷带薄外套。
`

const a29Content = `
## 行程概览
- **总预算**：11800元/人（不含签证）
- **天数**：10天9晚
- **交通**：温哥华取车 + 1 号公路/冰原大道自驾（左舵与国内一致）

## 费用拆分
| 项目 | 费用 |
|------|------|
| 机票 | 4500–6000元 |
| 租车+全险+油费 | 2800–3600元 |
| 住宿 | 2600–3400元 |
| 国家公园门票/停车 | 400–700元 |
| 餐饮（超市自炊为主） | 1100–1500元 |

## Day 1–2 温哥华
史丹利公园骑行、格兰维尔岛、煤气镇蒸汽钟。
华人超市采购后续火锅食材。

## Day 3–4 基洛纳/奥根娜根湖
夏季酒庄；秋季苹果园。住湖边汽车旅馆。

## Day 5–6 班夫镇
班夫缆车、硫磺山温泉（自带泳衣）；朱砂湖日落免费。
露易丝湖清晨去占停车位；梦莲湖需预约班车 **以公园官网为准**。

## Day 7–8 冰原大道 班夫–贾斯珀
佩托湖、弓湖、哥伦比亚冰原雪车（票贵可选步道远观）。
阿萨巴斯卡瀑布；沿途看野生动物勿下车靠近。

## Day 9 贾斯珀
玛琳湖精灵岛游船或湖边徒步；派翠西亚湖日落。

## Day 10 返程
开回卡尔加里或温哥华异地还车（有附加费）；满油还车。

## 省钱 Tips
1. 国家公园 **年票** 多人一车摊薄；露营地需早订。
2. 班夫镇住宿贵，可住 **坎莫尔 Canmore** 开车 15 分钟。
3. 野生动物垃圾一定进防熊桶；加油站先查会员价。
`

const a30Content = `
## 行程概览
- **总预算**：9200元/人（不含机票与签证政策以当时为准）
- **天数**：12天11晚
- **交通**：境内飞机（布宜–伊瓜苏–巴里洛切）+ 市区地铁/大巴 + 巴里洛切环湖公交

## 费用拆分
| 项目 | 费用 |
|------|------|
| 国际机票 | 5500–8000元 |
| 境内三段机票 | 1200–2000元 |
| 住宿 | 1400–2000元 |
| 门票+团费 | 800–1200元 |
| 餐饮 | 800–1100元 |

## Day 1–3 布宜诺斯艾利斯
博卡区 Caminito（白天去、财物小心）、五月广场、玫瑰宫外观。
圣特尔莫周日跳蚤市场；晚上 **探戈秀** 选含晚餐套餐比价。
牛排馆按公斤点肉，先问价格单位。

## Day 4–6 伊瓜苏（阿根廷侧+巴西侧若签证允许）
阿根廷侧魔鬼咽喉步道；巴西侧全景（需巴西签证/政策）。
带防水袋；瀑布水雾大相机注意防潮。

## Day 7–10 巴里洛切安第斯山湖区
**Circuito Chico** 公交或租车环湖；小瑞士镇拍照。
可报 **卡特德拉尔山** 一日徒步或滑雪季滑雪。

## Day 11–12 返程
回布宜飞离；机场 **蓝税退税** 先海关盖章再办。

## 省钱 Tips
1. 阿根廷汇率波动大，**蓝美元/官方汇率** 策略行前查最新攻略；多用现金或当地支付 App 有时更优。
2. 打车用 **Cabify/Uber**；地铁 Subte 便宜。
3. 伊瓜苏园内餐饮贵，可自带三明治（遵守公园规定）。
`

const a31Content = `
## 行程概览
- **总预算**：14500元/人（不含申根签证，挪威属申根区）
- **天数**：10天9晚
- **交通**：奥斯陆进出 + 境内航班/渡轮至罗弗敦 + 罗弗敦租车或公交

## 费用拆分
| 项目 | 费用 |
|------|------|
| 机票 | 5500–7500元 |
| 挪威境内飞/船/火车 | 2000–3500元 |
| 租车或公交包 | 800–1800元 |
| 住宿（青旅/民宿混） | 3500–5000元 |
| 餐饮超市 | 1200–1800元 |

## Day 1–2 奥斯陆
歌剧院屋顶漫步免费；维京船博物馆与民俗博物馆选其一。
超市采购，挪威外食极贵。

## Day 3–4 飞往 Evenes / Bodø 转罗弗敦
雷讷 Reine、哈姆诺伊经典机位；奥镇 Å 世界最短地名小镇。
徒步 **Reinebringen**（台阶陡，量力而行）。

## Day 5–6 罗弗敦海岛慢游
白沙滩、海钓体验团；夏季午夜太阳，冬季极光看指数与云图。

## Day 7–8 特罗姆瑟
北极大教堂、缆车山顶；极光团或自驾追光（租车防滑胎）。
狗拉雪橇/驯鹿体验提前订。

## Day 9 奥斯陆或卑尔根（若时间允许）
弗洛姆高山火车贵，穷游可跳过改市区。

## Day 10 返程

## 省钱 Tips
1. **Widerøe** 小航线行李额查清楚；渡轮比直飞有时便宜但耗时。
2. 超市 **REMA 1000/Kiwi** 便当+热狗，外食一顿披萨够两人价。
3. 极光无保证，连订 3 晚以上提高概率；下载 Aurora 预报 App。
`

const a32Content = `
## 行程概览
- **总预算**：11200元/人（不含申根）
- **天数**：8天7晚
- **交通**：斯德哥尔摩进出 + 夜火车/飞基律纳 + SJ 铁路

## 费用拆分
| 项目 | 费用 |
|------|------|
| 机票 | 4200–5800元 |
| 火车/境内飞 | 1500–2500元 |
| 住宿 | 2800–4000元 |
| 活动（冰酒店参观票等） | 800–1500元 |
| 餐饮 | 1000–1400元 |

## Day 1–3 斯德哥尔摩
老城 Gamla Stan、瓦萨博物馆（沉船震撼）、市政厅（导览票）。
地铁艺术站打卡 **Stadion/Rådhuset** 买次票即可。
群岛 Ferry 半日用 SL 通票部分航线可达。

## Day 4–5 夜火车或飞基律纳
**SJ 卧铺** 省一晚住宿；基律纳铁矿城搬迁故事可参观。
冰酒店 **Icehotel** 参观票与住宿分开，住宿极贵可只买参观。

## Day 6 阿比斯库
火车到 Abisko，国家公园短途徒步；极光季住湖边小木屋。

## Day 7 返回斯德哥尔摩
现代博物馆、宜家博物馆（Älmhult 远，可选）。

## Day 8 返程
阿兰达机场快线比出租车便宜；退税先盖章。

## 省钱 Tips
1. **SJ 早鸟票**；青年/学生卡若有可折扣。
2. Systembolaget 买酒注意营业时间，周六下午早关门。
3. 冬季日照短，行程别排太满；头灯必备。
`

const a33Content = `
## 行程概览
- **总预算**：6800元/人（不含申根）
- **天数**：7天6晚
- **交通**：阿姆斯特丹进出 + NS 火车 + 市内 OV 卡/次票 + 单车租赁

## 费用拆分
| 项目 | 费用 |
|------|------|
| 机票 | 3200–4200元 |
| NS 火车（阿姆–鹿特丹–海牙） | 350–550元 |
| 住宿 | 1400–1900元 |
| 博物馆门票 | 400–700元 |
| 餐饮 | 900–1200元 |

## Day 1–2 阿姆斯特丹
国立博物馆、梵高博物馆 **务必预约时段**；运河带散步。
红灯区尊重禁止拍照规定；大麻咖啡馆非必须体验。

## Day 3 桑斯安斯风车村或小孩堤防
风车村偏旅游商业化但出片；小孩堤防更原生态，公交+船衔接查 9292 App。

## Day 4 鹿特丹一日
立体方块屋、市场大厅；马士基大楼外观。

## Day 5 海牙
莫瑞泰斯皇家美术馆《戴珍珠耳环的少女》；海边席凡宁根海滩日落。

## Day 6 库肯霍夫（3–5 月花季）
门票+往返大巴套餐提前订；花季周末人爆炸多建议工作日。

## Day 7 返程
史基浦机场提前到；奶酪木鞋手信超市比机场便宜。

## 省钱 Tips
1. **GVB 日票** 仅在阿姆斯特丹有效，跨城用 NS。
2. 单车有专用道，别逆行；锁车两把锁防偷。
3. 超市 Albert Heijn 简餐，炸鱼薯条码头店比价。
`

const a34Content = `
## 行程概览
- **总预算**：13800元/人（不含申根）
- **天数**：9天8晚
- **交通**：苏黎世进日内瓦出 + SBB 火车 + 部分游船

## 费用拆分
| 项目 | 费用 |
|------|------|
| 开口机票 | 4800–6500元 |
| SBB（半价卡/通票按行程细算） | 2200–3500元 |
| 住宿 | 3800–5200元 |
| 少女峰等山顶门票 | 800–1200元 |
| 餐饮超市 | 1400–1900元 |

## Day 1–2 苏黎世
苏黎世湖、林登霍夫俯瞰；瑞士国家博物馆可选。
超市 Coop/Migros 烤鸡便当经典穷游餐。

## Day 3–5 琉森
卡佩尔廊桥、狮子纪念碑；**瑞吉山** 或皮拉图斯选一条（通票部分含）。
琉森湖游船段用通票或单程票。

## Day 6–8 因特拉肯与少女峰地区
住 **格林德瓦** 或劳特布龙嫩比因特拉肯风景好。
少女峰火车票极贵，**早鸟票**或 First 徒步 **巴哈尔普湖** 性价比更高。
米伦小镇无机动车，缆车+徒步。

## Day 9 日内瓦返程
联合国总部外观、大喷泉；机场还退税。

## 省钱 Tips
1. **SBB Mobile** 查点对点早鸟；半价卡停留长才划算，算总账再买。
2. 自带水壶接喷泉直饮水；餐厅自来水可点免费（Tap water）。
3. 住宿含厨房优先，奶酪火锅超市买 kit 比餐厅省一半。
`

const a35Content = `
## 行程概览
- **总预算**：4800元/人（不含申根）
- **天数**：6天5晚
- **交通**：布达佩斯进出 + 市内地铁 M1–M4 + 巴拉顿湖火车

## 费用拆分
| 项目 | 费用 |
|------|------|
| 机票 | 2200–3200元 |
| 住宿 | 700–1000元 |
| 温泉浴场门票 | 350–600元 |
| 火车巴拉顿往返 | 150–250元 |
| 餐饮 | 600–900元 |

## Day 1–2 佩斯侧
国会大厦外观夜景；中央市场二楼吃兰戈斯 Lángos。
废墟酒吧 Ruin Pub 选一两家即可，酒水先问价。

## Day 3 布达侧
渔人堡清晨免费时段或买票登塔；马加什教堂、布达城堡区步行下坡回链桥。

## Day 4 赛切尼温泉浴场
自带拖鞋泳衣泳帽（部分池要求）；储物柜硬币或手环。
周末本地人多，平日稍空。

## Day 5 巴拉顿湖蒂豪尼半岛
火车到 Balatonfüred 或 Siófok；蒂豪尼修道院俯瞰湖景。
湖边吃烤鱼套餐比价。

## Day 6 返程
多瑙河游船短线可选；机场 100E 大巴比出租车省。

## 省钱 Tips
1. **布达佩斯卡** 按你要去的浴场+博物馆数量算是否回本。
2. 福林标价心算除以 50 约人民币；别在机场换汇极差。
3. 电车 2 号线沿河风景好，单程票记得打票。
`

const a36Content = `
## 行程概览
- **总预算**：7200元/人（不含申根）
- **天数**：8天7晚
- **交通**：杜布罗夫尼克进萨格勒布出（或反向）+ 大巴 FlixBus / Croatia Bus + 杜城步行城墙

## 费用拆分
| 项目 | 费用 |
|------|------|
| 开口机票 | 3800–5000元 |
| 大巴（杜城–斯普利特–十六湖–萨格勒布） | 600–900元 |
| 住宿 | 1400–2000元 |
| 城墙+国家公园门票 | 500–800元 |
| 餐饮 | 700–1000元 |

## Day 1–3 杜布罗夫尼克
古城城墙 **早开门去** 避旅行团晒；要塞 Lovrijenac 联票。
Banje 海滩晒太阳；缆车山顶看老城全景（票贵可改步行省道）。
《权游》取景点多，别挤在正午拍。

## Day 4–5 斯普利特
戴克里先宫免费穿行；地宫与钟楼票可选。
跳岛 **赫瓦尔** 或 **蓝洞** 一日团比价，晕船备药。

## Day 6 十六湖国家公园
预留整天步行+船+摆渡车；上湖区下湖区经典环线 6–8h。
园内简餐贵，可自带三明治（垃圾带走）。

## Day 7 萨格勒布
圣马可教堂彩色屋顶、石门、失恋博物馆（门票小贵选去）。

## Day 8 返程

## 省钱 Tips
1. 杜城 **Dubrovnik Pass** 含城墙与公交是否划算按停留算。
2. 老城住宿贵，住 **Lapad** 公交 10 分钟内进城。
3. 大巴行李可能收费提前查；夏季渡轮班次多可改水路少晕车。
`

const a37Content = `
## 行程概览
- **总预算**：10500元/人（不含申根）
- **天数**：8天7晚
- **交通**：赫尔辛基进出 + VR 夜火车/飞罗瓦涅米 + 市内公交/HSL

## 费用拆分
| 项目 | 费用 |
|------|------|
| 机票 | 4200–5800元 |
| 赫尔辛基–罗瓦涅米（火车卧铺或机票） | 800–1600元 |
| 住宿 | 2800–4000元 |
| 圣诞老人村活动+博物馆 | 500–900元 |
| 餐饮超市 | 900–1300元 |

## Day 1–2 赫尔辛基
白教堂、红教堂乌斯别斯基；岩石教堂门票入内。
设计区 Design District 橱窗漫步；桑拿体验选公共桑拿 **Allas Sea Pool** 或传统木桑拿。

## Day 3–4 罗瓦涅米
圣诞老人村 **北极圈线** 跨一步；驯鹿雪橇/哈士奇（冬季）提前比价。
北极博物馆 Arktikum 了解萨米文化；河边步道看极光指数（冬季）。

## Day 5–6 拉普兰慢活
雪地摩托或森林徒步（按季节）；滑雪选小型雪场日票。
超市采购驯鹿肉、浆果酱自炊。

## Day 7 回赫尔辛基
坦佩雷或图尔库中转可选；赫尔辛基补货 Marimekko 奥特莱斯。

## Day 8 返程
万塔机场退税；液体蓝湖化妆品手信比价。

## 省钱 Tips
1. **VR 早鸟** 夜火车省住宿；飞机有时比火车便宜看促销。
2. 外食极贵，**K-Supermarket/S-Market** 热食柜台解决晚餐。
3. 冬季防滑鞋、分层穿衣；手机低温掉电快贴暖宝宝。
`

const a38Content = `
## 行程概览
- **总预算**：7200元/人（不含申根）
- **天数**：6天5晚
- **交通**：哥本哈根进出 + DSB 火车 + 自行车租赁

## 费用拆分
| 项目 | 费用 |
|------|------|
| 机票 | 3200–4200元 |
| 火车票（哥–欧登塞–比隆） | 400–700元 |
| 住宿 | 1400–2000元 |
| 乐高乐园门票 | 400–600元 |
| 餐饮 | 800–1100元 |

## Day 1–2 哥本哈根
小美人鱼清晨去；新港彩色屋拍照。
圆塔俯瞰老城；趣伏里乐园（夏季）或国家博物馆免费日查官网。
**自行车** 租一天沿海滨骑到管风琴教堂。

## Day 3 哥本哈根
克里斯钦自由城（尊重规矩禁拍照区）；食品市场 Torvehallerne 尝开放三明治 Smørrebrød。

## Day 4 欧登塞
安徒生故居与博物馆；老城步行街。
火车约 1.5h，住欧登塞或当日回哥本哈根（看票价）。

## Day 5 比隆乐高乐园
DSB 到 Vejle 转巴士；亲子向成人也可玩 Miniland。
自带水壶园内续杯贵。

## Day 6 返程
哥本哈根机场 **无申根转机** 注意签证；蓝罐曲奇超市比机场便宜。

## 省钱 Tips
1. **City Pass** 按你要去的区买小圈即可，别盲目买大圈。
2. 超市 Netto/Lidl 便当；瓶装押金瓶别扔可退。
3. 自行车锁两把，哥本哈根偷车多发生在夜间。
`

const a39Content = `
## 行程概览
- **总预算**：9800元/人（不含签证）
- **天数**：10天9晚
- **交通**：圣地亚哥进出 + 国内飞卡拉马 + 大巴/报团阿塔卡马

## 费用拆分
| 项目 | 费用 |
|------|------|
| 国际机票 | 5500–7500元 |
| 圣地亚哥–卡拉马 机票 | 400–800元 |
| 住宿 | 1200–1800元 |
| 阿塔卡马日出星空团 | 800–1400元 |
| 餐饮+市内交通 | 800–1200元 |

## Day 1–2 圣地亚哥
武器广场、大教堂；圣克里斯托瓦尔山缆车看城景。
普罗维登西亚区安全相对好，别露富。

## Day 3 瓦尔帕莱索一日
地铁+巴士往返；彩色涂鸦街、聂鲁达故居（预约）。
注意扒手，相机挂胸前。

## Day 4–5 圣地亚哥休整+飞卡拉马
中央市场海鲜饭；葡萄酒产区一日游（可选）。

## Day 6–8 圣佩德罗德阿塔卡马
月亮谷日落团、高原间歇泉日出（极早多穿）。
盐湖 **Laguna Cejar** 漂浮、星空团带三脚架。
海拔 2400m+，第一天勿洗澡勿饮酒，防高反药遵医嘱。

## Day 9–10 返程
卡拉马飞圣地亚哥衔接回国；红沙漠防晒 SPF50+。

## 省钱 Tips
1. 小镇报团多比价，含接送的半日团有时比租车划算。
2. 智利比索波动，刷卡与现金比价。
3. 干燥涂润唇膏；隐形眼镜用户备人工泪液。
`

const a40Content = `
## 行程概览
- **总预算**：11200元/人（不含签证）
- **天数**：12天11晚
- **交通**：开普敦取还车 + 花园大道自驾（左舵）

## 费用拆分
| 项目 | 费用 |
|------|------|
| 机票 | 5500–7500元 |
| 租车+全险+油费 | 2200–3200元 |
| 住宿 | 2000–2800元 |
| 门票（桌山缆车等） | 400–700元 |
| 餐饮 | 1000–1400元 |

## Day 1–3 开普敦
桌山缆车 **看风大关闭** 改信号山；博卡普马来区彩色房子。
好望角一日自驾，企鹅滩西蒙镇；酒庄路线选 Stellenbosch 一两家即可。

## Day 4–6 花园大道
赫曼努斯 **6–11 月观鲸季**；克尼斯纳泻湖头；野地国家公园步道。

## Day 7–8 齐齐卡马
风暴河悬索桥；树冠滑索可选。

## Day 9–10 阿多或卡鲁国家公园（可选）
小型 Safari 看象群；时间紧可压缩直接回伊丽莎白港。

## Day 11–12 返程
伊丽莎白港或开普敦飞；机场还车满油。

## 省钱 Tips
1. **左行** 环岛让行规则先复习；车内勿放包防砸窗。
2. 大型超市买 Braai 烤肉食材自炊；加油站便利店贵。
3. 部分路段收费 E-toll，租车公司合同看清。
`

const a41Content = `
## 行程概览
- **总预算**：6200元/人（不含申根）
- **天数**：10天9晚
- **交通**：华沙进克拉科夫出（或反向）+ PKP 城际火车 + 大巴扎科帕内

## 费用拆分
| 项目 | 费用 |
|------|------|
| 开口机票 | 3200–4200元 |
| 火车华沙–克拉科夫–扎科帕内 | 350–600元 |
| 住宿 | 900–1400元 |
| 奥斯维辛+盐矿团 | 400–700元 |
| 餐饮 | 600–900元 |

## Day 1–2 华沙
老城重建区、皇宫城堡；犹太人区纪念碑。
肖邦音乐会休闲厅平价场可查。

## Day 3–5 克拉科夫
中央广场、纺织会馆；瓦维尔城堡与教堂。
卡齐米日区犹太遗迹与咖啡馆夜生活。

## Day 6 奥斯维辛-比克瑙
**官网预约** 免费时段或早班团；内容沉重心理准备。
穿舒适鞋园区大。

## Day 7–8 维利奇卡盐矿或扎科帕内
盐矿地下教堂震撼；扎科帕内塔特拉山缆车 **夏季徒步冬季滑雪**。

## Day 9–10 返程
波兰饺子 Pierogi 超市冷冻款便宜；机场伏特加手信限价。

## 省钱 Tips
1. **PKP Intercity** 早鸟；周末票有时促销。
2. 兹罗提标价÷4 约人民币；小费非强制。
3. 奥斯维辛自带简餐，园内餐饮点少。
`

const a42Content = `
## 行程概览
- **总预算**：8900元/人（不含英签/爱尔兰签证政策以当时为准）
- **天数**：8天7晚
- **交通**：都柏林进出 + Bus Éireann / GoBus + 西海岸一日团或自驾

## 费用拆分
| 项目 | 费用 |
|------|------|
| 机票 | 3800–5000元 |
| 大巴/一日团 | 400–800元 |
| 住宿 | 1800–2600元 |
| 门票+黑啤体验 | 300–500元 |
| 餐饮 | 1000–1400元 |

## Day 1–2 都柏林
三一学院老图书馆《凯尔经》（预约）；健力士仓库体验 **票提前订**。
圣殿酒吧区晚上嘈杂，财物贴身。

## Day 3–4 高威
拉丁区现场音乐；阿伦群岛一日渡轮（看风浪）。
生蚝季海边小馆尝鲜。

## Day 5 莫赫悬崖
悬崖步道免费区注意安全风大；一日团含巴伦石灰岩地貌讲解。
摄影别站边缘松土。

## Day 6 本拉提城堡或丁格尔半岛（二选一）
中世纪晚宴表演票贵选白天参观即可。

## Day 7 回都柏林
凯尔莫尔修道院（若走康尼马拉线）。

## Day 8 返程
都柏林机场 **欧盟外退税** 先海关盖章。

## 省钱 Tips
1. **Leap Visitor Card** 都柏林公交上限划算天数。
2. 超市 Tesco 便当；酒吧黑啤比餐吧正餐省。
3. 天气多变防水外套+围巾常备。
`

const a43Content = `
## 行程概览
- **总预算**：6800元/人（不含签证与 Jordan Pass 策略）
- **天数**：8天7晚
- **交通**：安曼进出 + JETT 大巴 + 佩特拉瓦迪拉姆包车/拼车

## 费用拆分
| 项目 | 费用 |
|------|------|
| 机票 | 3200–4500元 |
| Jordan Pass（含多景点） | 约 700–900 元档 |
| 包车段（佩特拉–瓦迪拉姆–亚喀巴） | 800–1200元 |
| 住宿 | 900–1400元 |
| 餐饮 | 500–800元 |

## Day 1–2 安曼
城堡山俯瞰罗马剧场；彩虹街咖啡。
死海一日或最后两天安排，漂浮 **勿浸脸** 盐水刺痛。

## Day 3–4 佩特拉
**蛇道清晨进** 避旅行团高峰；卡兹尼神殿后爬山线 **代尔修道院** 费体力备水。
佩特拉之夜（周一三五）另买票看灯光秀评价两极。

## Day 5 瓦迪拉姆
吉普红沙漠日落；火星帐篷营地观星。
骆驼体验比吉普慢，按时间选。

## Day 6 亚喀巴（可选）
红海浮潜半日；或缩短直接回安曼。

## Day 7 死海漂浮
住死海沿岸酒店日票海滩；泥浆涂抹后冲洗干净。

## Day 8 返程

## 省钱 Tips
1. **Jordan Pass** 停留 3 晚以上且去佩特拉通常回本，含落地签费档核对。
2. 打车先谈价或用 Uber（覆盖有限）；佩特拉马夫开价狠砍价或步行。
3. 防晒+大檐帽；尊重当地保守着装，清真寺勿短裤无袖。
`

const a44Content = `
## 行程概览
- **总预算**：4500元/人（不含机票）
- **天数**：7天6晚
- **交通**：突尼斯市进出 + Louage 小巴/火车 + 包车迦太基一日

## 费用拆分
| 项目 | 费用 |
|------|------|
| 机票 | 1800–2800元 |
| 住宿 | 700–1100元 |
| 包车/打车+门票 | 400–700元 |
| 餐饮 | 500–800元 |

## Day 1–2 突尼斯市
布尔吉巴大街、麦地那老城迷宫集市；宰游客先对半砍价。
巴尔杜国家博物馆马赛克精品。

## Day 3 迦太基遗址+蓝白小镇
包车半日串联；**西迪布赛义德** 咖啡馆露台看海，别在第一家就坐先比价。

## Day 4–5 苏塞或哈马马特
滨海度假区民宿；麦地那城墙、里巴特要塞。
海鲜烧烤排档看海鲜是否鲜活称重。

## Day 6 埃尔·杰姆斗兽场（可选）
一日往返略赶，兴趣高可去罗马第二大竞技场。

## Day 7 返程
机场换汇差，市区先换好第纳尔；剩余硬币尽量花掉。

## 省钱 Tips
1. Louage 满发车，行李可能加价先问清。
2. 清真寺非穆斯林部分仅外观；周五礼拜避开嘈杂路段。
3. 夏季酷热带防晒；自来水建议烧开或瓶装。
`

const a45Content = `
## 行程概览
- **总预算**：10500元/人（不含签证）
- **天数**：9天8晚
- **交通**：里约进福斯伊瓜苏出（或反向）+ 境内飞 + 地铁/uber

## 费用拆分
| 项目 | 费用 |
|------|------|
| 国际+国内机票 | 6500–9000元 |
| 住宿 | 1400–2200元 |
| 基督山+糖面包门票缆车 | 350–550元 |
| 伊瓜苏国家公园（巴西侧） | 约 300–500 元档 |
| 餐饮 | 800–1200元 |

## Day 1–3 里约热内卢
**基督像** 小火车或面包车团早出发少雾；糖面包山日落缆车。
塞拉隆阶梯、拉帕拱门；海滩 **科帕卡巴纳** 游泳别带贵重物品。

## Day 4–5 里约安全区慢游
植物园、圣特雷莎区；桑巴体验课或球赛（若赛季提前买票）。
贫民窟「旅游团」争议大，尊重当地政策与个人安全选择。

## Day 6–8 福斯伊瓜苏
巴西侧公园 **全景步道** 半天；魔鬼咽喉在阿根廷侧若你有阿根廷签证可过境一日。
鸟园 Parque das Aves 值得半日。

## Day 9 返程
巴西侧机场 IGU；暴雨航班易延误买延误险。

## 省钱 Tips
1. 里约 **地铁+Uber** 组合，夜间少步行偏僻巷。
2. 巴西签证/政策行前确认；阿根廷侧联游需多次入境规划。
3. 牛排自助 Churrascaria 按体重或固定价先问清；果汁鲜榨贵可点白水。
`

const a46Content = `
## 行程概览
- **总预算**：15800元/人（不含机票与黄热疫苗等政策）
- **天数**：10天9晚
- **交通**：乞力马扎罗或阿鲁沙进 + **封闭 Safari 越野车** + 小飞机/渡轮桑给巴尔

## 费用拆分
| 项目 | 费用 |
|------|------|
| 国际机票 | 7000–9500元 |
| Safari 套餐（车+向导+营地/帐篷酒店） | 5500–8000元 |
| 桑岛住宿+活动 | 1800–2800元 |
| 小费+保险 | 500–800元 |

## Day 1–2 阿鲁沙/莫希
休整适应；咖啡庄园或文化博物馆可选。
检查长焦镜头、防尘罩、常用药。

## Day 3–5 塞伦盖蒂
**大迁徙** 7–10 月北部马拉河、2–3 月产仔季南部，行前与地接确认区域。
全日游猎早晚光线最佳；车内禁站立，勿投喂野生动物。

## Day 6 恩戈罗恩戈罗火山口
一日下火山口盆地看犀牛概率相对高；尘土大备口罩。

## Day 7–8 桑给巴尔石头城
奴隶博物馆、古堡；香料市场砍价。
**宗教保守** 海滩外着装注意。

## Day 9 桑岛北部/监狱岛
龟岛、浮潜；海豚出海早班。

## Day 10 返程

## 省钱 Tips
1. **拼团 Jeep** 比私人车便宜；住宿从 luxury lodge 降到 tented camp 省一大块。
2. 向导小费按天给美元惯例；美元纸币新净无折痕当地更认。
3. 桑岛飞达累斯萨拉姆衔接国际航班留足转机时间。
`

const a47Content = `
## 行程概览
- **总预算**：7200元/人（不含双国签证）
- **天数**：10天9晚
- **交通**：第比利斯进出 + 包车/Marshrutka + 跨境陆路入境亚美尼亚

## 费用拆分
| 项目 | 费用 |
|------|------|
| 机票 | 3200–4500元 |
| 包车/拼车（卡兹别克、西格纳吉段） | 800–1400元 |
| 住宿 | 1200–1800元 |
| 餐饮+门票 | 1000–1500元 |

## Day 1–2 第比利斯
圣三一大教堂、纳里卡拉要塞缆车；干桥跳蚤市场淘苏联徽章。
硫磺浴 **Abanotubani** 按小时收费先问清。

## Day 3–4 卡兹别克
**圣三一教堂 Gergeti** 徒步或拼车山路上去；山区天气多变带冲锋衣。
斯特潘茨明达小镇民宿观景。

## Day 5 西格纳吉
爱情小镇城墙、品酒 cellar tour；回第比利斯或住一晚。

## Day 6–7 过境亚美尼亚 埃里温
共和广场、大阶梯 Cascade；种族灭绝纪念馆（沉重预留半日）。
亚拉拉特山远景天气好可见。

## Day 8 塞凡湖与塞凡修道院
湖边鱼餐尝鳟鱼；海拔较高注意保暖。

## Day 9 加尔尼希腊神庙或霍爾維拉普（可选）
包车一日；修道院对着装要求过膝。

## Day 10 返程

## 省钱 Tips
1. **Bolt/Yandex** 第比利斯便宜；郊区线路用 Marshrutka 小巴对号下车。
2. 葡萄酒产区买瓶比餐厅单杯划算。
3. 亚美尼亚德拉姆、格鲁吉亚拉里分开换，别混算汇率。
`

const a48Content = `
## 行程概览
- **总预算**：8900元/人（不含美签等过境政策）
- **天数**：10天9晚
- **交通**：利马进库斯科出（或环线）+ **PeruRail/IncaRail** + 包车圣谷

## 费用拆分
| 项目 | 费用 |
|------|------|
| 国际机票 | 4500–6500元 |
| 马丘比丘门票+巴士+火车 | 1200–1800元 |
| 住宿 | 1000–1600元 |
| 圣谷+彩虹山团 | 800–1200元 |
| 餐饮 | 600–900元 |

## Day 1–2 利马
米拉弗洛雷斯滨海道；**美食** Central/Maido 贵，穷游选 ceviche 小馆与中餐区。
换少量索尔现金，山区刷卡不稳。

## Day 3–5 库斯科适应海拔
萨克赛瓦曼、太阳神殿；喝 **古柯茶** 缓解高反勿过量。
不洗头不喝酒前两天。

## Day 6 圣谷
皮萨克集市、奥扬泰坦博；火车票从奥扬坦博出发比库斯科便宜。

## Day 7 彩虹山（可选）
凌晨出发高海拔徒步 **5km+**；体力差或高反明显改皮图西赖山半日。
租马上下山另收费先谈价。

## Day 8–9 马丘比丘
热水镇住一晚 **清晨第一批** 进园；华纳比丘票另买且限流。
下山火车别误点；防雨冲锋衣必备。

## Day 10 返程

## 省钱 Tips
1. 火车票早订；**秘鲁居民价**不适用游客别信黄牛。
2. 库斯科买羊驼围巾多比价，「baby alpaca」标签鱼龙混杂。
3. 小费 10% 餐厅已含服务费看账单。
`

const a49Content = `
## 行程概览
- **总预算**：13200元/人（不含签证）
- **天数**：10天9晚
- **交通**：温得和克租车四驱 + 砂石路经验必备

## 费用拆分
| 项目 | 费用 |
|------|------|
| 机票 | 6500–9000元 |
| 租车四驱+全险+油费 | 3200–4500元 |
| 住宿（营地+山庄混） | 2200–3200元 |
| 国家公园门票 | 400–700元 |
| 餐饮超市 | 800–1200元 |

## Day 1 温得和克
超市补给水、零食、备胎检查；取车验车录像。

## Day 2–3 索斯斯黎红沙漠
**45 号沙丘** 日出前 1h 出发占机位；死亡谷枯树清晨光影。
园区大门开门时间严格，迟到只能等次日。

## Day 4–5 鲸湾与斯瓦科普蒙德
火烈鸟泻湖、三明治港冲沙（报团）；冷海雾多带防风外套。

## Day 6–8 埃托沙国家公园
自驾 **水坑边静候** 大象犀牛；日落前出园或住园内营地。
营地栅栏外勿下车。

## Day 9 猎豹基地或回温得和克（可选）

## Day 10 返程
加满油还车；纳米比亚右舵与南非类似。

## 省钱 Tips
1. **Etosha** 园内营地比园外 lodge 便宜需早订。
2. 砂石路胎压按租车公司建议；备胎会用再上路。
3. 水按车存每人每天 3L+；紫外线极强 SPF50+。
`

const a50Content = `
## 行程概览
- **总预算**：12500元/人（不含电子签）
- **天数**：8天7晚
- **交通**：内罗毕进出 + Safari 包车/拼团 + 湖区包车

## 费用拆分
| 项目 | 费用 |
|------|------|
| 机票 | 5500–7500元 |
| 马赛马拉 3 日游猎套餐 | 4000–6000元 |
| 纳瓦沙+长颈鹿中心+住宿 | 1500–2200元 |
| 小费保险 | 400–600元 |

## Day 1 内罗毕
长颈鹿中心 Gigi 喂食；凯伦故居《走出非洲》。
**夜间勿单独步行** 用酒店接送。

## Day 2–4 马赛马拉
**7–10 月角马过河** 看天吃饭，多留一天提高概率。
热气球贵可选清晨游猎替代。

## Day 5 纳瓦沙湖
游船看河马 **勿靠近**、鹈鹕；湖畔步行结伴。

## Day 6 地狱之门或纳库鲁（可选）
一日徒步或观火烈鸟。

## Day 7 内罗毕补货
咖啡红茶手信超市买。

## Day 8 返程

## 省钱 Tips
1. **拼 Jeep 6 人座** 比私猎便宜；住宿 tented camp 档性价比高。
2. 向导司机小费分开放；美元现金备足。
3. 黄热疫苗与新冠政策以入境时要求为准。
`

const a51Content = `
## 行程概览
- **总预算**：4600元/人（不含机票与签证政策）
- **天数**：10天9晚
- **交通**：国内段飞机+夜班大巴+茵莱船

## 费用拆分
| 项目 | 费用 |
|------|------|
| 机票 | 1800–2800元 |
| 境内飞/大巴 | 400–700元 |
| 住宿 | 800–1200元 |
| 蒲甘通票+茵莱船 | 350–500元 |
| 餐饮 | 600–900元 |

## Day 1–2 仰光
瑞光大金塔 **赤脚** 穿易脱鞋；茵雅湖日落。
政局与旅行警告行前务必查外交部提醒。

## Day 3–5 蒲甘
租电动车 **戴头盔** 看日出佛塔；塔攀爬政策变动以现场为准别硬闯。
防尘口罩必备。

## Day 6–7 曼德勒
乌本桥日落早占机位；千人僧饭（尊重礼仪禁怼脸拍）。
实皆、因瓦古城包车一日。

## Day 8–9 茵莱湖
船游独脚划船、跳猫寺、水上菜园；船费按船谈好时长。

## Day 10 返程

## 省钱 Tips
1. 美元换基亚特新钞汇率好；旧钞被拒收常见。
2. 佛塔日出多带手电；尊重佛教勿指尖指佛像。
3. SIM 卡机场买比市区贵，可让酒店帮订车去市区办。
`

const a52Content = `
## 行程概览
- **总预算**：3200元/人（不含机票）
- **天数**：9天8晚
- **交通**：琅勃拉邦进巴色或万象出 + minivan + 慢船（可选）

## 费用拆分
| 项目 | 费用 |
|------|------|
| 机票 | 1200–2000元 |
| 城际交通 | 250–400元 |
| 住宿 | 500–800元 |
| 户外活动（轮胎漂流等） | 300–500元 |
| 餐饮 | 450–700元 |

## Day 1–3 琅勃拉邦
清晨 **布施** 保持距离勿闪光灯；香通寺、王宫博物馆。
光西瀑布跳水带泳衣；普西山日落人挤早到。

## Day 4–5 万荣
轮胎漂流 Nam Song、蓝湖 zip line；户外店比价 **含保险**。
酒吧街别喝断片，河水深浅不一。

## Day 6–8 四千美岛 Don Det / Khone
慢生活骑车环岛；老法铁路桥、湄公河豚（极难见到管理预期）。
柬埔寨过境一日游（签证自理）可选。

## Day 9 返程
巴色飞万象或陆路回国口岸查开放。

## 省钱 Tips
1. 基普现金为主，ATM 手续费高一次取够。
2. 琅勃拉邦按摩街按小时明码标价先确认。
3. 慢船到会晒耗时长，赶飞机改飞。
`

const a53Content = `
## 行程概览
- **总预算**：5800元/人（不含机票）
- **天数**：12天11晚
- **交通**：塔什干进出 + **Afrosiyob 高铁** + 夜班火车希瓦

## 费用拆分
| 项目 | 费用 |
|------|------|
| 机票 | 2800–4000元 |
| 高铁+卧铺火车 | 400–700元 |
| 住宿 | 900–1400元 |
| 景点门票联票 | 400–600元 |
| 餐饮 | 600–900元 |

## Day 1–2 塔什干
哈兹拉提伊玛目、楚苏大巴扎；地铁苏联风拍照 **勿拍军警**。
抓饭中心尝 plov。

## Day 3–5 撒马尔罕
雷吉斯坦广场夜景另买票；夏伊辛达陵墓清晨蓝瓷砖。
兀鲁伯天文台、古尔埃米尔陵。

## Day 6–8 布哈拉
雅克城堡、卡隆宣礼塔；池边茶馆发呆。
阿拉克要塞日落。

## Day 9–11 希瓦
伊钦卡拉古城一日通票；登库希纳堡看全景。
日落骑骆驼（可选）先谈价。

## Day 12 返程
火车/飞回塔什干；藏红花葡萄干大巴扎比机场便宜。

## 省钱 Tips
1. **Yandex Go** 打车便宜；司机少找零备零钱苏姆。
2. 高铁票护照购买；空调冷带外套。
3. 尊重穆斯林习俗清真寺脱鞋；夏季暴晒帽子必备。
`

const a54Content = `
## 行程概览
- **总预算**：6900元/人（不含申根/黑山入境政策）
- **天数**：8天7晚
- **交通**：蒂瓦特/波德戈里察进 + 大巴 + 贝尔格莱德出

## 费用拆分
| 项目 | 费用 |
|------|------|
| 开口机票 | 3800–5200元 |
| 大巴黑山–塞尔维亚 | 200–350元 |
| 住宿 | 1000–1500元 |
| 国家公园门票 | 150–300元 |
| 餐饮 | 700–1000元 |

## Day 1–3 科托尔
古城城墙 **清晨爬** 避暑避团；海事博物馆。
佩拉斯特双岛游船拼船。

## Day 4 布德瓦海滩
老城城墙小；海滩日光浴注意财物。

## Day 5 杜米托尔国家公园
黑湖徒步；塔拉河大桥《桥》取景地。
山区气温低即使夏季带外套。

## Day 6–7 贝尔格莱德
米哈伊洛大公街、卡莱梅格丹要塞日落。
**夜生活** 船屋酒吧区先问价再点。

## Day 8 返程
尼古拉·特斯拉博物馆（预约）；机场退税。

## 省钱 Tips
1. 黑山欧元通用；塞尔维亚第纳尔另换。
2. 科托尔邮轮日人潮汹涌，住一晚清晨独享古城。
3. 大巴跨境预留边境排队 1–2h；备零食水。
`

const a55Content = `
## 行程概览
- **总预算**：7200元/人（不含机票）
- **天数**：12天11晚
- **交通**：卡萨布兰卡/马拉喀什进出 + CTM/Supratours 大巴 + 沙漠团拼车

## 费用拆分
| 项目 | 费用 |
|------|------|
| 机票 | 3500–5000元 |
| 大巴+沙漠3日团 | 1200–1800元 |
| 住宿（里亚德混住） | 1400–2000元 |
| 门票+向导小费 | 600–900元 |
| 餐饮 | 800–1200元 |

## Day 1–2 卡萨布兰卡 / 马拉喀什
哈桑二世清真寺（周五礼拜时间受限）；马若雷勒花园 **预约**。
德吉玛广场夜市烧烤先问价再坐；蛇舞拍照收小费。

## Day 3–4 马拉喀什深度
巴伊亚宫、萨阿迪王朝陵墓；老城迷路正常，离线地图备好。

## Day 5–7 撒哈拉梅尔祖卡
**3 日沙漠团** 含托德拉峡谷、骑骆驼、帐篷营（卫浴等级问清）。
星空拍摄带三脚架；沙尘护相机。

## Day 8–9 菲斯
麦地那九千巷 **雇官方向导半天** 比瞎转省时间；皮革染坊味道大带薄荷。
铜器店「手工」先砍价。

## Day 10–11 舍夫沙万
蓝巷清晨光线柔；后山西班牙清真寺看日落。
别在民居门口大声喧哗。

## Day 12 返程
CTM 大巴回卡萨或直飞；迪拉姆现金留够车费。

## 省钱 Tips
1. 沙漠团**马拉喀什拼团**比私人便宜；检查是否含午餐水。
2. 塔吉锅吃多会腻，穿插法式长棍三明治。
3. 斋月白天部分餐厅关门，自备零食；尊重当地习俗。
`

const a56Content = `
## 行程概览
- **总预算**：15800元/人（不含申根）
- **天数**：10天9晚
- **交通**：凯夫拉维克取还车 + 环岛一号公路（冬季慎行部分路段）

## 费用拆分
| 项目 | 费用 |
|------|------|
| 机票 | 5500–7500元 |
| 租车+全险+油费 | 3800–5200元 |
| 住宿（青旅+民宿） | 4200–5800元 |
| 停车+温泉 | 400–700元 |
| 超市餐饮 | 900–1300元 |

## Day 1 黄金圈
辛格维利尔、盖歇尔间歇泉、黄金瀑布；住塞尔福斯或弗洛德附近。

## Day 2–3 南岸
塞里雅兰瀑布可绕后、斯科加瀑布；维克黑沙滩 **勿背对海浪**。
飞机残骸 DC-3 摆渡车预约制查官网。

## Day 4 杰古沙龙冰河湖
两栖船或皮划艇看浮冰；钻石沙滩捡冰注意安全别走远。

## Day 5 赫本小镇
龙虾餐贵可超市买；东峡湾若时间紧可驱车略过。

## Day 6–7 米湖 / 黛提瀑布 / 胡萨维克（观鲸季）
黛提瀑布水量夏季大；观鲸晕船药必备。

## Day 8 斯奈山半岛
教会山 Kirkjufell 经典机位；海豹沙滩 Ytri Tunga。

## Day 9 蓝湖或天空之湖（可选）
温泉票提前订；自带泳衣。

## Day 10 返程凯夫拉维克

## 省钱 Tips
1. **Bonus 超市** 自炊；加油站热狗救急。
2. 风大车门别猛开防吹断；砂石路段买全险。
3. 极光冬季看指数，不强求环岛同时完成追光。
`

const a57Content = `
## 行程概览
- **总预算**：4800元/人（不含签证）
- **天数**：8天7晚
- **交通**：乌兰巴托包车/拼车 + 国内航班戈壁段（可选）

## 费用拆分
| 项目 | 费用 |
|------|------|
| 机票 | 2200–3500元 |
| 草原住宿（蒙古包） | 800–1200元 |
| 包车一日游 | 600–1000元 |
| 餐饮 | 500–800元 |

## Day 1–2 乌兰巴托
苏赫巴托广场、甘丹寺；国家博物馆了解游牧史。
成吉思汗广场夜景。

## Day 3–4 特勒吉 Terelj
乌龟石、骑马 **戴头盔**；蒙古包体验奶食与手抓肉。
昼夜温差大带羽绒内胆。

## Day 5–6 哈勒和林或额尔德尼召（二选一）
遗址+博物馆；路况颠簸 SUV 为宜。

## Day 7 乌兰巴托购物
羊绒围巾比价；戈壁羊绒品牌店略贵。

## Day 8 返程

## 省钱 Tips
1. **图格里克** 现金为主；美元换汇找正规点。
2. 草原厕所简陋心理建设；湿巾多带。
3. 那达慕大会期间住宿暴涨早订。
`

const a58Content = `
## 行程概览
- **总预算**：13500元/人（为参考档，**以不丹政府核准的每日套餐/税费政策为准**）
- **天数**：7天6晚
- **交通**：全程由**持牌旅行社**安排车辆与向导（不丹自助行受限）

## 重要说明
不丹对国际游客实行 **「最低每日消费/可持续发展费」** 政策，费用随官方调整，需通过当地旅行社打包 **签证+酒店+餐+车导**。下文为体验结构参考，**报价以合同为准**。

## 行程结构
| 模块 | 内容 |
|------|------|
| 廷布 | 大佛、扎西却宗外观、周末集市 |
| 普那卡 | 普那卡堡、切米拉康「疯庙」 |
| 帕罗 | 国家博物馆、帕罗宗 |
| 虎穴寺 | 往返徒步约 4–6h，海拔爬升大 |

## Day 1–2 廷布
适应海拔；参观纺织博物馆可选。

## Day 3 普那卡
多楚拉山口 108 塔；春季杜鹃花期美。

## Day 4–5 帕罗河谷
河谷徒步轻松日；为虎穴寺储备体力。

## Day 6 虎穴寺 Taktsang
清晨出发；骑马只到半山腰仍需步行。
雨雾天可能看不清寺体，心态放平。

## Day 7 返程
帕罗机场小而美；喜马拉雅航线选窗边。

## 省钱 Tips
1. **淡季**（雨季/冬季）套餐价可能略低，观景各有取舍。
2. 小费非强制，服务特别好可酌情。
3. 尊重宗教：进寺脱帽脱鞋、勿指佛像、勿大声。
`

const a59Content = `
## 行程概览
- **总预算**：6800元/人（不含机票与电子签）
- **天数**：10天9晚
- **交通**：亚的斯亚贝巴进出 + 境内航班拉利贝拉 + 包车段

## 费用拆分
| 项目 | 费用 |
|------|------|
| 机票 | 3800–5200元 |
| 境内飞+包车 | 1200–1800元 |
| 住宿 | 800–1200元 |
| 门票 | 400–700元 |
| 餐饮 | 500–800元 |

## Day 1–2 亚的斯亚贝巴
国家博物馆「露西」；Mercato 大市场杂乱少带贵重物品。
咖啡仪式体验小馆。

## Day 3–5 拉利贝拉
**11 座岩石教堂** 分两组日逛完；早 6 点礼拜仪式感强。
凿岩建筑雨季注意防滑鞋。

## Day 6 青尼罗河瀑布巴赫达尔（可选）
或改亚的斯周边一日游。

## Day 7–8 贡德尔城堡链（可选）
历史迷可选；车程长。

## Day 9 阿克苏姆
方尖碑、示巴女王浴池遗址；请向导讲解更懂脉络。

## Day 10 返程

## 省钱 Tips
1. 比尔现金+刷卡混合；机场换汇差。
2. 境内航班行李额紧，轻装。
3. 政局与安全提醒**行前查外交部领事网**。
`

const a60Content = `
## 行程概览
- **总预算**：5600元/人（不含签证与政策变动）
- **天数**：12天11晚
- **交通**：德黑兰进出 + VIP 大巴/国内飞设拉子 + Snapp 打车

## 费用拆分
| 项目 | 费用 |
|------|------|
| 机票 | 3200–4500元 |
| 大巴+境内飞 | 400–800元 |
| 住宿 | 900–1400元 |
| 门票 | 500–800元 |
| 餐饮 | 500–800元 |

## Day 1–2 德黑兰
古列斯坦宫、国家珍宝馆（开放日查）；阿扎迪塔夜景。
**女性头巾** 入境全程遵守当地着装规定。

## Day 3–4 卡尚
费恩花园、布鲁杰迪宅邸；沙漠边缘奥比扬奈古村半日。

## Day 5–7 伊斯法罕
伊玛目广场、谢赫洛特芙拉清真寺、三十三孔桥夜景。
大巴扎铜器与蜜饯手信。

## Day 8–10 设拉子
粉红清真寺 **早 8 点前到**；灯王之墓着装严。
波斯波利斯一日包车；防晒无遮阴。

## Day 11–12 返程
哈菲兹墓花园；德黑兰离境。

## 省钱 Tips
1. **里亚尔/土曼** 标价混乱，手机计算器当面算清。
2. Snapp 便宜；别拍敏感设施。
3. 国际制裁下信用卡常不可用，**美元欧元现金**备足。
`

const a61Content = `
## 行程概览
- **总预算**：8200元/人（免签入境政策以当时为准）
- **天数**：7天6晚
- **交通**：迪拜地铁+Red Abra+包车阿布扎比一日

## 费用拆分
| 项目 | 费用 |
|------|------|
| 机票 | 2800–4000元 |
| 酒店（避开旺季会展） | 2200–3500元 |
| 景点+沙漠团 | 1200–2000元 |
| 餐饮 | 1000–1500元 |

## Day 1–2 迪拜
阿法迪历史区、迪拜博物馆；黄金香料市集砍价狠。
迪拜相框远观即可省钱。

## Day 3 朱美拉公共海滩
帆船酒店外观；轻轨棕榈岛 **买往返**。

## Day 4 沙漠冲沙
含营地晚餐肚皮舞；晕车药+别吃太多再上 dunes。

## Day 5 阿布扎比
谢赫扎耶德大清真寺 **长袖长裤头巾**；卢浮宫阿布扎比海上馆预约时段。

## Day 6 迪拜 MALL / 音乐喷泉
登哈利法塔票贵可改 Dubai Mall 二层免费视角。

## Day 7 返程

## 省钱 Tips
1. **Nol 银卡** 地铁比打车省；周五部分线路时刻变。
2. 餐厅水贵可超市大瓶；猪肉制品禁忌。
3. 夏季户外极热，安排室内 midday。
`

const a62Content = `
## 行程概览
- **总预算**：5200元/人（不含签证）
- **天数**：9天8晚
- **交通**：马尼拉飞普林塞萨/布桑加 + 螃蟹船跳岛

## 费用拆分
| 项目 | 费用 |
|------|------|
| 机票 | 2000–3200元 |
| 跳岛+公园环保费 | 800–1200元 |
| 住宿 | 900–1400元 |
| 餐饮 | 600–900元 |

## Day 1 马尼拉转机
黎刹公园、王城区；机场换汇少换够用即可。

## Day 2–4 爱妮岛 El Nido
Tour A/C 经典跳岛 **大泻湖皮划艇另费**；防水袋必备。
别碰珊瑚；防晒霜改珊瑚友好型。

## Day 5–6 普林塞萨地下河
世界遗产一日团含许可证；蝙蝠洞味道重口罩。

## Day 7–8 科隆 Coron
凯央根湖爬台阶累；沉船浮潜深潜选证。
温泉海湖体验傍晚去。

## Day 9 返程

## 省钱 Tips
1. 宿务航空行李额提前买；秤重超一点可能被卡。
2. 岛上 ATM 少，现金带够。
3. 台风季留意停航；买旅行险。
`

const a63Content = `
## 行程概览
- **总预算**：3800元/人（不含签证）
- **天数**：9天8晚
- **交通**：加德满都往返博卡拉（大巴/小飞机）+ 出租车议价

## 费用拆分
| 项目 | 费用 |
|------|------|
| 机票 | 1500–2200元 |
| 大巴/小飞机 | 150–400元 |
| 住宿 | 600–900元 |
| 门票+萨朗科车费 | 200–350元 |
| 餐饮 | 400–600元 |

## Day 1–2 加德满都
杜巴广场、猴庙；烧尸庙尊重礼仪勿嬉笑拍照。
泰米尔区换汇多比几家。

## Day 3–5 博卡拉
费瓦湖划船；世界和平塔日落。
滑翔伞 **选口碑公司** 看天气风大取消正常。

## Day 6 萨朗科日出
凌晨吉普车上山；鱼尾峰日照金山看运气。
羽绒服必备。

## Day 7 班迪普尔 Newar 古镇
山居俯瞰喜马拉雅；客车颠簸备晕车药。

## Day 8 回加德满都
帕坦古城；最后补羊绒围巾。

## Day 9 返程

## 省钱 Tips
1. 大巴「旅游巴士」比本地慢车舒适价差一倍值。
2. 小飞机天气取消常见，留缓冲日。
3. 徒步线若延伸 ABC/ACT 需另加进山证与向导预算。
`

const a64Content = `
## 行程概览
- **总预算**：3800元/人（不含签证）
- **天数**：9天8晚
- **交通**：Open Bus / 卧铺大巴 + Grab 短途

## 费用拆分
| 项目 | 费用 |
|------|------|
| 机票 | 1200–2000元 |
| Open Bus 多段 | 200–400元 |
| 住宿 | 700–1100元 |
| 芽庄出海/门票 | 250–450元 |
| 餐饮 | 450–700元 |

## Day 1–2 胡志明市
范五老街夜生活吵，住稍远巷子里安静些。
战争遗迹博物馆、中央邮局；摩托车洪流过马路跟本地人节奏。

## Day 3–4 美奈
红白沙丘日出吉普；渔村买海鲜加工比价。
风筝冲浪看浪况，新手别硬上。

## Day 5–6 大叻
疯狂屋、旧火车站；山城早晚凉带薄外套。
春香湖周边咖啡屋发呆。

## Day 7–8 芽庄
四岛游或黑岛深潜看证；泥浆浴提前订票。
海滩躺椅收费问清再坐。

## Day 9 返程

## 省钱 Tips
1. Open Bus 提前一天订票旺季易满。
2. 出租车打表或 Grab；别跟路边拉客走。
3. 海鲜按公斤算清再下锅。
`

const a65Content = `
## 行程概览
- **总预算**：11200元/人（不含签证）
- **天数**：10天9晚
- **交通**：JR 北海道铁路周游券 / 巴士 + 市内电车

## 费用拆分
| 项目 | 费用 |
|------|------|
| 机票 | 3500–5500元 |
| JR Pass / 巴士 | 1200–1800元 |
| 住宿 | 2800–4200元 |
| 动物园+农场+温泉 | 600–1000元 |
| 餐饮 | 2200–3500元 |

## Day 1–2 札幌
大通公园、计时台；狸小路药妆比价。
汤咖喱、成吉思汗烤肉排队久可错峰。

## Day 3 小樽
运河仓库、北一硝子；音乐盒堂别冲动买太多。
天狗山夜景看天气。

## Day 4–5 富良野·美瑛
花田 7–8 月盛；拼布之路租电动自行车注意防晒。
农场冰淇淋必吃。

## Day 6–7 旭川
旭山动物园冬季企鹅散步经典；市内拉面村尝几家小碗。
层云峡或美瑛延伸看时间。

## Day 8–9 网走·知床（冬季）
流冰船 1–3 月季；知床五湖雪鞋团需预约。
非冬季可改洞爷湖或登别温泉日归。

## Day 10 返程

## 省钱 Tips
1. JR 北海道周游按行程算是否回本；短程单买有时更省。
2. 温泉酒店含早晚餐套餐提前订。
3. 冬季防滑靴+分层穿衣；相机电池低温多备。
`

const a66Content = `
## 行程概览
- **总预算**：6800元/人（不含签证）
- **天数**：5天4晚
- **交通**：多哈地铁 + Karwa 出租车 / 包车沙漠一日

## 费用拆分
| 项目 | 费用 |
|------|------|
| 机票 | 2500–4500元 |
| 住宿 | 1800–2800元 |
| 博物馆+球场外观/入内 | 200–500元 |
| 沙漠半日/一日 | 400–900元 |
| 餐饮 | 1200–2000元 |

## Day 1 多哈滨海
西湾天际线日落；珍珠岛人工岛散步。
着装公共场合保守些。

## Day 2 伊斯兰艺术博物馆 + 瓦其夫
贝聿铭建筑提前官网订票时段。
瓦其夫集市猎鹰、香料摊拍照先征得同意。

## Day 3 文化村 + 国家博物馆
卡塔尔文化村建筑拍照；了解半岛历史。
午后咖啡馆避暑。

## Day 4 沙漠内海冲沙
四驱冲沙+骑骆驼日落套餐；备头巾防晒。
回城晚高峰预留时间。

## Day 5 返程

## 省钱 Tips
1. 常作欧美中转，联程票有时比专程便宜。
2. 夏季酷热，户外安排清晨傍晚。
3. 球场参观政策变动快，行前查官网。
`

const a67Content = `
## 行程概览
- **总预算**：7500元/人（不含签证）
- **天数**：8天7晚
- **交通**：租车 / 包车 + 城际公路

## 费用拆分
| 项目 | 费用 |
|------|------|
| 机票 | 3200–5200元 |
| 租车/油费/停车 | 1400–2200元 |
| 住宿 | 1600–2400元 |
| 古堡+清真寺+沙漠营地 | 400–800元 |
| 餐饮 | 900–1400元 |

## Day 1–2 马斯喀特
苏丹卡布斯大清真寺非穆斯林指定时段；长袖长裤。
马特拉集市买乳香、咖啡壶。

## Day 3 尼兹瓦
尼兹瓦古堡日出；周五部分设施休息查好。
传统市集看匕首工艺品勿随意砍价开玩笑。

## Day 4–5 瓦希巴沙漠
贝都因营地星空；滑沙鞋袜进沙多带一双。
白天沙面烫脚。

## Day 6 苏尔
造船厂观摩；海龟产卵夜观 **7–10 月季** 需向导许可。
海滩勿留垃圾。

## Day 7 回马斯喀特
皇家歌剧院外观或演出票提前订。
滨海大道慢跑段风景好。

## Day 8 返程

## 省钱 Tips
1. 油价低但租车保险买全；沙漠别单车闯未知沙丘。
2. 现金+卡并行，小镇 ATM 少。
3. 尊重当地服饰与摄影礼仪，军警设施勿拍。
`

const a68Content = `
## 行程概览
- **总预算**：9800元/人（不含签证）
- **天数**：8天7晚
- **交通**：霍巴特/朗塞租车 + 渡轮（若从墨尔本来）

## 费用拆分
| 项目 | 费用 |
|------|------|
| 机票+岛内段 | 4000–6500元 |
| 租车 | 1800–2800元 |
| 住宿 | 2200–3400元 |
| 国家公园门票/停车 | 150–300元 |
| 餐饮 | 1200–2000元 |

## Day 1–2 霍巴特
萨拉曼卡周六市集；MONA 艺术博物馆渡轮往返留半天。
惠灵顿山看云开雾散碰运气。

## Day 3–4 酒杯湾
菲欣纳国家公园徒步观景台；沙滩往返累带水。
塔斯马尼亚恶魔保护中心可选。

## Day 5–6 摇篮山
鸽湖环湖步道早去停车位；天气多变冲锋衣。
夜间观袋熊 **勿用强光直射**。

## Day 7 朗塞斯顿
卡德奈特峡谷步行桥与孔雀；薰衣草农场夏季。
酒庄品酒别酒驾。

## Day 8 返程

## 省钱 Tips
1. 租车全险+注意袋鼠黄昏路段减速。
2. 超市自炊省一半；海鲜码头早市新鲜。
3. 摇篮山巴士接驳旺季订位。
`

const a69Content = `
## 行程概览
- **总预算**：6200元/人（不含签证）
- **天数**：8天7晚
- **交通**：拉巴斯缆车+小巴 + 乌尤尼三日团

## 费用拆分
| 项目 | 费用 |
|------|------|
| 机票 | 2800–4800元 |
| 乌尤尼三日团 | 900–1600元 |
| 住宿 | 700–1200元 |
| 缆车+市内交通 | 80–150元 |
| 餐饮+水 | 500–900元 |

## Day 1–2 拉巴斯
拉巴斯缆车（Mi Teleférico）俯瞰城景；女巫市场看看即可别乱买「护身」药。
海拔 3600m+，首日少酒少剧烈运动。

## Day 3–5 乌尤尼三日
天空之镜雨季（约12–3月）水深倒影；旱季盐壳几何图案。
盐湖 **防晒墨镜**；鞋套租或自备。

## Day 6 高原湖泊与火烈鸟（团内）
红湖绿湖风大温差大；多穿可脱层。
拍照尊重当地司机规定停车点。

## Day 7 回拉巴斯
补买羊驼围巾；咖啡海拔高沸点低口味淡正常。

## Day 8 返程

## 省钱 Tips
1. 团费问清是否含热水淋浴、充电时段。
2. 高反药、可可茶因人而异；严重则下撤。
3. 美元小额现金备用；刷卡小镇不稳。
`

const a70Content = `
## 行程概览
- **总预算**：7200元/人（不含签证）
- **天数**：10天9晚
- **交通**：境内廉航 + 巴士 + 城市打车软件

## 费用拆分
| 项目 | 费用 |
|------|------|
| 国际机票 | 3500–6000元 |
| 境内航班 | 600–1200元 |
| 住宿 | 1400–2200元 |
| 咖啡园+博物馆+城堡 | 300–600元 |
| 餐饮 | 1000–1600元 |

## Day 1–3 波哥大
黄金博物馆、蒙塞拉特山缆车； altitude 高第一晚早睡。
咖啡品鉴课预约口碑庄园。

## Day 4–6 麦德林
Comuna 13 涂鸦区跟正规导览团；扶梯社区尊重居民勿大声喧哗。
植物园、广场夜景。

## Day 7–9 卡塔赫纳
老城城墙日落；罗萨里奥群岛一日浮潜比价。
加勒比湿热防蚊防晒。

## Day 10 返程

## 省钱 Tips
1. 城市间廉航行李额单买；提前线上值机。
2. 现金分袋放；夜间少炫耀电子设备。
3. 英语旅游区价高，学几句西班牙语砍价友好。
`

const a71Content = `
## 行程概览
- **总预算**：10500元/人（不含签证）
- **天数**：10天9晚
- **交通**：爱丁堡火车 + 高地跟团或自驾右舵

## 费用拆分
| 项目 | 费用 |
|------|------|
| 机票 | 3800–6000元 |
| 火车/巴士/租车 | 1600–2600元 |
| 住宿 | 2800–4200元 |
| 城堡+湖区游船 | 400–800元 |
| 餐饮 | 1800–2800元 |

## Day 1–3 爱丁堡
城堡提前订票入场；皇家一英里街头艺人打赏随意。
卡尔顿山日落免费。

## Day 4–5 格拉斯哥·罗蒙湖
凯文葛罗夫艺术画廊；罗蒙湖鲍尔小镇徒步一段。

## Day 6–7 高地 A82
格伦科峡谷停车观景注意后方来车；威廉堡补给。
尼斯湖游船别期待「必然见怪」。

## Day 8–9 天空岛
波特里彩色房子拍照；老人峰徒步看体能与雾。
羊肠小路会车慢，预留时间。

## Day 10 返程

## 省钱 Tips
1. 火车早鸟票；高地跟团含住宿有时比自驾省心。
2. 防风防水外套必备；夏季也有冷雨。
3. 城堡通票是否划算按行程表算。
`

const a72Content = `
## 行程概览
- **总预算**：11200元/人（不含申根/法签入境材料）
- **天数**：7天6晚
- **交通**：环岛租车 + 山区弯道多

## 费用拆分
| 项目 | 费用 |
|------|------|
| 机票（经巴黎等） | 4500–7500元 |
| 租车+油 | 1400–2200元 |
| 住宿 | 2200–3500元 |
| 火山徒步向导/许可 | 300–600元 |
| 餐饮 | 1200–2000元 |

## Day 1–2 圣但尼 / 西部
首府补给；火山博物馆了解富尔奈斯活动状态。
法式面包房早餐性价比高。

## Day 3 富尔奈斯火山
徒步看熔岩台地；气体警示区服从关闭牌。
防晒+水 2L+；鞋底要抓地。

## Day 4 锡拉奥冰斗
「千弯」公路晕车药；瀑布步道雨后滑。
小镇克里奥尔炖菜试一家。

## Day 5 马法特或萨拉济冰斗
徒步或直升机观光看预算；天气取消常见留缓冲。
留尼汪属法国海外省，**驾车习惯与欧盟类似**。

## Day 6 圣吉尔莱班海岸
潟湖浮潜；珊瑚区勿踩踏。
傍晚法式冰淇淋店散步。

## Day 7 返程

## 省钱 Tips
1. 通常需有效申根类型覆盖海外省，行前核对签证条款。
2. 超市采购+民宿厨房省餐厅服务费。
3. 山区天气多变，勿赶夜路。
`

const a73Content = `
## 行程概览
- **总预算**：4600元/人（不含签证）
- **天数**：6天5晚
- **交通**：济州租车 / 公交 + 的士短途

## 费用拆分
| 项目 | 费用 |
|------|------|
| 机票 | 1200–2200元 |
| 租车+油 | 800–1300元 |
| 住宿 | 900–1400元 |
| 门票+缆车 | 200–400元 |
| 餐饮 | 800–1200元 |

## Day 1 济州市区
东门市场夜宵；黑猪肉一条街比价再入座。
便利店 T-money 类交通卡可问最新政策。

## Day 2 东线 城山·涉地可支
城山日出峰早到避旅行团高峰。
涉地可支风大外套；涉地可支灯塔步道拍照留足时间。

## Day 3 汉拿山或西归浦择一
御里牧线上山较缓，天气差果断改博物馆+偶来小路。
登山鞋必备；官方开放信息每日查。

## Day 4 涯月·翰林海岸
涯月咖啡街停车难，错峰。
挟才海水浴场夏季人多；防晒。

## Day 5 南线 柱状节理带·泰迪熊博物馆（择）
中文观光区选 1–2 个点即可避免门票堆叠。
橘子巧克力当手信超市买往往更便宜。

## Day 6 返程

## 省钱 Tips
1. 国内多城直飞济州，红眼+早订票省大头。
2. 租车需国际驾照认证件，行前确认租车行规则。
3. 垃圾严格分类，街头垃圾桶少，自备袋。
`

const a74Content = `
## 行程概览
- **总预算**：9200元/人（不含签证与小费）
- **天数**：10天9晚
- **交通**：境内小飞机+包车段+短途摩托出租（择）

## 费用拆分
| 项目 | 费用 |
|------|------|
| 国际机票 | 4500–8000元 |
| 境内航班/包车 | 1800–2800元 |
| 住宿 | 1200–2000元 |
| 国家公园门票向导 | 600–1200元 |
| 餐饮 | 800–1400元 |

## Day 1–2 塔那那利佛
女王宫、老城区集市；换汇与治安多留心。
海拔温和，适应非洲节奏。

## Day 3–4 昂达西贝
夜访寻狐猴跟正规向导；手电勿直射动物眼睛。
雨林蜱虫驱蚊液+长裤。

## Day 5–7 穆龙达瓦
猴面包树大道日出日落；土路颠簸晕车药。
尊重村落拍照先询问。

## Day 8–9 奇灵地或贝马拉哈石林（择）
石林徒步鞋防滑；旱季尘土大口罩。
包车价格提前书面确认公里与停留点。

## Day 10 返程

## 省钱 Tips
1. 机票常有埃塞、肯亚枢纽中转，比价留足转机时间。
2. 现金与欧元小额备用；刷卡仅限大城市部分酒店。
3. 旱季（约4–11月）路况相对好；雨季部分路断改行程。
`

const a75Content = `
## 行程概览
- **总预算**：5200元/人（不含签证）
- **天数**：7天6晚
- **交通**：Grab + 一日游拼团 + 跳岛船

## 费用拆分
| 项目 | 费用 |
|------|------|
| 机票 | 800–1800元 |
| 住宿 | 1000–1600元 |
| 神山/红树林/跳岛 | 700–1200元 |
| 餐饮 | 800–1300元 |

## Day 1 亚庇市区
丹绒亚路海滩日落；大茄来海鲜排队久可换本地人排档。
加雅街周末市集。

## Day 2 神山公园一日
高山牧场+树冠吊桥；海拔高带薄外套。
体力一般别硬走登顶线。

## Day 3 红树林长鼻猴+萤火虫
选口碑船家；防蚊液厚涂。
夜晚拍照关闪光灯。

## Day 4–5 跳岛 马穆迪沙比等
浮潜面镜可自带；救生衣全程穿好。
岛上自助餐性价比参差，可自带干粮。

## Day 6 马里马里文化村或沙巴博物馆（择）
了解原住民文化；演出时间提前查。

## Day 7 返程

## 省钱 Tips
1. 亚庇机票促销时往返极低，搭配亚航行李额提前买。
2. 跳岛打包价多比价；别在码头临时被拉客溢价。
3. 尊重海洋公园规定，勿摸海龟、勿留塑料。
`

const a76Content = `
## 行程概览
- **总预算**：7400元/人（不含签证）
- **天数**：8天7晚
- **交通**：巴士+步行；科洛尼亚可渡轮往返布宜诺斯艾利斯（择）

## 费用拆分
| 项目 | 费用 |
|------|------|
| 机票 | 3800–6500元 |
| 巴士/渡轮 | 400–800元 |
| 住宿 | 1800–2800元 |
| 门票 | 150–300元 |
| 餐饮 | 900–1400元 |

## Day 1–3 蒙得维的亚
独立广场、老城门；马黛茶杯可在集市买简易款。
海滨大道慢跑安全白天更佳。

## Day 4–5 科洛尼亚
石板街世界遗产；日落河边喝啤酒别过量。
从阿根廷侧一日往返记得看清签注与渡轮时刻。

## Day 6–7 埃斯特角城+何塞伊格纳西奥（择）
南半球夏季海滩；风浪大注意旗帜。
高端季房价高，提早订民宿。

## Day 8 返程

## 省钱 Tips
1. 与阿根廷、智利连线可省一段国际机票；注意跨境巴士证件。
2. 牛肉质量好超市自烤省餐厅费。
3. 乌拉圭物价高于邻国，现金美元小额可应急兑换。
`

const a77Content = `
## 行程概览
- **总预算**：8000元/人（不含签证；不含加拉帕戈斯延伸大交通）
- **天数**：10天9晚
- **交通**：境内巴士+偶尔境内飞；基多缆车公交

## 费用拆分
| 项目 | 费用 |
|------|------|
| 国际机票 | 3500–6000元 |
| 境内交通 | 800–1400元 |
| 住宿 | 1400–2400元 |
| 温泉秋千等活动 | 400–900元 |
| 餐饮 | 900–1500元 |

## Day 1–2 基多
老城海拔 2800m+，首日少饮酒。
赤道纪念碑一脚跨南北半球；面包山缆车瞰城。

## Day 3–5 巴尼奥斯
瀑布 Route 租山地车下坡注意安全。
「世界尽头秋千」多机构比价；系好安全绳听指挥。

## Day 6–8 昆卡
殖民建筑、巴拿马帽工坊；周日集市淘手作。
城市节奏慢适合咖啡館办公旅。

## Day 9 加拉帕戈斯或奥塔瓦洛集市（择）
加拉帕戈斯需另加机票+公园费+船宿预算；行前单独做表。
奥塔瓦洛周六印第安集市买羊驼织品注意称重砍价。

## Day 10 返程

## 省钱 Tips
1. 美元流通但备零钱；小摊找零有时困难。
2. 长途夜巴省住宿但注意财物贴身。
3. 高反敏感者从低海拔昆卡先玩也可调整顺序。
`

const a78Content = `
## 行程概览
- **总预算**：5500元/人（不含签证）
- **天数**：5天4晚
- **交通**：包车/打车 + 淡布隆一日河船团

## 费用拆分
| 项目 | 费用 |
|------|------|
| 机票 | 1800–3200元 |
| 住宿 | 1200–2000元 |
| 清真寺+博物馆 | 50–150元 |
| 淡布隆一日游 | 400–800元 |
| 餐饮 | 700–1200元 |

## Day 1 斯里巴加湾
杰米清真寺非祈祷时段参观，着装遮盖肩膀膝盖。
加东夜市烤鸡屁股等特色小吃浅尝即可。

## Day 2 水上人家 Kampong Ayer
坐船逛村落；学校区域保持安静。
买手信别冲动，超市巧克力价格透明。

## Day 3 苏丹纪念馆+帝国酒店外观
了解王室历史；奢华酒店下午茶需预约着正装。

## Day 4 淡布隆国家公园
长船进雨林，看长鼻猴概率靠运气。
防水包+驱蚊；听向导勿单独离队。

## Day 5 返程

## 省钱 Tips
1. 文莱消费偏高，选含早酒店+超市补货。
2. 全国禁酒，别托运酒入境惹麻烦。
3. 淡布隆团费含午餐与否问清；周末班次可能减少。
`

const a79Content = `
## 行程概览
- **总预算**：8400元/人（不含签证；能否凭有效申根等入境以领馆与护照类型为准）
- **天数**：7天6晚
- **交通**：租车 / 城际巴士；北塞过境步行或报团

## 费用拆分
| 项目 | 费用 |
|------|------|
| 机票 | 3200–5500元 |
| 租车/巴士 | 900–1500元 |
| 住宿 | 2200–3600元 |
| 出海+考古点联票 | 400–800元 |
| 餐饮 | 1200–2000元 |

## Day 1–2 拉纳卡·莱夫卡拉
盐湖火烈鸟 **季候性**；山村蕾丝手工可看。
机场提车注意全险。

## Day 3–4 帕福斯
国王陵墓、马赛克遗址；日落海边步道。
考古公园联票是否划算按兴趣算。

## Day 5 尼科西亚
绿线分治瞭望点尊重警示牌；一日过境北塞需证件与政策确认。
老城区咖啡馆歇脚。

## Day 6 阿依纳帕或拉纳卡蓝洞出海
夏季海上项目多；晕船药提前吃。
防晒每小时补涂。

## Day 7 返程

## 省钱 Tips
1. 签证与南北塞过境规则变动频繁，**必须与行程单、护照类型一并核对领馆**。
2. 油费不低，二人以上租车往往优于全程打车。
3. 餐厅服务费已含与否看账单，避免重复小费。
`

const a80Content = `
## 行程概览
- **总预算**：6800元/人（不含申根）
- **天数**：6天5晚
- **交通**：火车+巴士；布莱德段可骑车

## 费用拆分
| 项目 | 费用 |
|------|------|
| 机票 | 2200–4000元 |
| 火车巴士 | 400–700元 |
| 住宿 | 1800–2800元 |
| 布莱德船+溶洞门票 | 250–450元 |
| 餐饮 | 900–1400元 |

## Day 1–2 卢布尔雅那
城堡缆车或步行上山；中央市场尝奶酪与南瓜籽油。
龙桥雕像别爬。

## Day 3–4 布莱德湖
传统木船登岛敲钟；环湖骑行注意机动车道。
清晨湖雾摄影绝佳。

## Day 5 文特加峡谷+博希尼（择）
木栈道湿滑穿抓地鞋。
时间紧可放弃博希尼只走峡谷精华段。

## Day 6 斯科契扬溶洞返程日
洞内恒温带外套；跟团英文场次提前订。
下午回卢布尔雅那或口岸离境。

## 省钱 Tips
1. 斯洛文尼亚物价高于部分东欧邻国，住宿早订。
2. Julian Alps 延伸需另加天数与车票。
3. 溶洞内禁止无人机与闪光，遵守讲解员规则。
`

const a81Content = `
## 行程概览
- **总预算**：7200元/人（不含签证）
- **天数**：7天6晚
- **交通**：老城步行+地铁公交；圣布拉斯需小飞机+船

## 费用拆分
| 项目 | 费用 |
|------|------|
| 机票 | 2800–5000元 |
| 市内交通+运河参观 | 200–500元 |
| 住宿 | 2000–3200元 |
| 圣布拉斯一日或两日游 | 400–1200元 |
| 餐饮 | 1200–2000元 |

## Day 1–2 巴拿马城新城·老城
米拉弗洛雷斯船闸观景台看巨轮过闸；早到占栏杆位。
卡斯柯维霍彩色建筑防小偷，背包前背。

## Day 3 巴拿马运河博物馆+古城徒步
了解运河历史；烈日帽子冰袖。
咖啡庄园半日（择）需预约。

## Day 4–5 圣布拉斯群岛（择）
原住民领地尊重摄影协议；海况差可能取消。
现金付岛民手工艺品比刷卡现实。

## Day 6 太平洋侧塔博加岛一日（择）
近郊船班固定；浮潜装备可租。
不跳岛可改生物博物馆亲子。

## Day 7 返程

## 省钱 Tips
1. 美元官方流通，备小钞；找零常混用巴波亚硬币。
2. 雨季午后暴雨，室外安排上午。
3. 圣布拉斯低价团要问清是否含岛费与餐食，避免隐性收费。
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
  a16: Object.assign(articles.find(a => a.id === 'a16'), { content: a16Content }),
  a17: Object.assign(articles.find(a => a.id === 'a17'), { content: a17Content }),
  a18: Object.assign(articles.find(a => a.id === 'a18'), { content: a18Content }),
  a19: Object.assign(articles.find(a => a.id === 'a19'), { content: a19Content }),
  a20: Object.assign(articles.find(a => a.id === 'a20'), { content: a20Content }),
  a21: Object.assign(articles.find(a => a.id === 'a21'), { content: a21Content }),
  a22: Object.assign(articles.find(a => a.id === 'a22'), { content: a22Content }),
  a23: Object.assign(articles.find(a => a.id === 'a23'), { content: a23Content }),
  a24: Object.assign(articles.find(a => a.id === 'a24'), { content: a24Content }),
  a25: Object.assign(articles.find(a => a.id === 'a25'), { content: a25Content }),
  a26: Object.assign(articles.find(a => a.id === 'a26'), { content: a26Content }),
  a27: Object.assign(articles.find(a => a.id === 'a27'), { content: a27Content }),
  a28: Object.assign(articles.find(a => a.id === 'a28'), { content: a28Content }),
  a29: Object.assign(articles.find(a => a.id === 'a29'), { content: a29Content }),
  a30: Object.assign(articles.find(a => a.id === 'a30'), { content: a30Content }),
  a31: Object.assign(articles.find(a => a.id === 'a31'), { content: a31Content }),
  a32: Object.assign(articles.find(a => a.id === 'a32'), { content: a32Content }),
  a33: Object.assign(articles.find(a => a.id === 'a33'), { content: a33Content }),
  a34: Object.assign(articles.find(a => a.id === 'a34'), { content: a34Content }),
  a35: Object.assign(articles.find(a => a.id === 'a35'), { content: a35Content }),
  a36: Object.assign(articles.find(a => a.id === 'a36'), { content: a36Content }),
  a37: Object.assign(articles.find(a => a.id === 'a37'), { content: a37Content }),
  a38: Object.assign(articles.find(a => a.id === 'a38'), { content: a38Content }),
  a39: Object.assign(articles.find(a => a.id === 'a39'), { content: a39Content }),
  a40: Object.assign(articles.find(a => a.id === 'a40'), { content: a40Content }),
  a41: Object.assign(articles.find(a => a.id === 'a41'), { content: a41Content }),
  a42: Object.assign(articles.find(a => a.id === 'a42'), { content: a42Content }),
  a43: Object.assign(articles.find(a => a.id === 'a43'), { content: a43Content }),
  a44: Object.assign(articles.find(a => a.id === 'a44'), { content: a44Content }),
  a45: Object.assign(articles.find(a => a.id === 'a45'), { content: a45Content }),
  a46: Object.assign(articles.find(a => a.id === 'a46'), { content: a46Content }),
  a47: Object.assign(articles.find(a => a.id === 'a47'), { content: a47Content }),
  a48: Object.assign(articles.find(a => a.id === 'a48'), { content: a48Content }),
  a49: Object.assign(articles.find(a => a.id === 'a49'), { content: a49Content }),
  a50: Object.assign(articles.find(a => a.id === 'a50'), { content: a50Content }),
  a51: Object.assign(articles.find(a => a.id === 'a51'), { content: a51Content }),
  a52: Object.assign(articles.find(a => a.id === 'a52'), { content: a52Content }),
  a53: Object.assign(articles.find(a => a.id === 'a53'), { content: a53Content }),
  a54: Object.assign(articles.find(a => a.id === 'a54'), { content: a54Content }),
  a55: Object.assign(articles.find(a => a.id === 'a55'), { content: a55Content }),
  a56: Object.assign(articles.find(a => a.id === 'a56'), { content: a56Content }),
  a57: Object.assign(articles.find(a => a.id === 'a57'), { content: a57Content }),
  a58: Object.assign(articles.find(a => a.id === 'a58'), { content: a58Content }),
  a59: Object.assign(articles.find(a => a.id === 'a59'), { content: a59Content }),
  a60: Object.assign(articles.find(a => a.id === 'a60'), { content: a60Content }),
  a61: Object.assign(articles.find(a => a.id === 'a61'), { content: a61Content }),
  a62: Object.assign(articles.find(a => a.id === 'a62'), { content: a62Content }),
  a63: Object.assign(articles.find(a => a.id === 'a63'), { content: a63Content }),
  a64: Object.assign(articles.find(a => a.id === 'a64'), { content: a64Content }),
  a65: Object.assign(articles.find(a => a.id === 'a65'), { content: a65Content }),
  a66: Object.assign(articles.find(a => a.id === 'a66'), { content: a66Content }),
  a67: Object.assign(articles.find(a => a.id === 'a67'), { content: a67Content }),
  a68: Object.assign(articles.find(a => a.id === 'a68'), { content: a68Content }),
  a69: Object.assign(articles.find(a => a.id === 'a69'), { content: a69Content }),
  a70: Object.assign(articles.find(a => a.id === 'a70'), { content: a70Content }),
  a71: Object.assign(articles.find(a => a.id === 'a71'), { content: a71Content }),
  a72: Object.assign(articles.find(a => a.id === 'a72'), { content: a72Content }),
  a73: Object.assign(articles.find(a => a.id === 'a73'), { content: a73Content }),
  a74: Object.assign(articles.find(a => a.id === 'a74'), { content: a74Content }),
  a75: Object.assign(articles.find(a => a.id === 'a75'), { content: a75Content }),
  a76: Object.assign(articles.find(a => a.id === 'a76'), { content: a76Content }),
  a77: Object.assign(articles.find(a => a.id === 'a77'), { content: a77Content }),
  a78: Object.assign(articles.find(a => a.id === 'a78'), { content: a78Content }),
  a79: Object.assign(articles.find(a => a.id === 'a79'), { content: a79Content }),
  a80: Object.assign(articles.find(a => a.id === 'a80'), { content: a80Content }),
  a81: Object.assign(articles.find(a => a.id === 'a81'), { content: a81Content }),
}

export function getArticleDetail(id) {
  return articleDetails[id] ?? null
}

/** @deprecated 使用 getArticleDetail(id) 或 articleDetails[id] */
export const articleDetail = articleDetails.a1

export const latestArticles = articles
export const popularDestinations = destinations
export const routeToArticle = { r1: 'a1', r2: 'a2', r3: 'a3', r4: 'a4' }
export const featuredRoutesForHome = articles.slice(0, 54).map((a) => ({ ...a, cover: a.cover, id: a.id }))
