/**
 * 为「目的地详情 / 列表」补足穷游路线数量：在核心文章之外按目的地补齐到下限。
 * destination 字段须与 mockData 中 destinations[].name 完全一致。
 */

import { PRIMARY_IMAGE_BY_COUNTRY } from './destinationPrimaryImages.js'
import { buildCoverUrlPoolForDestination } from './coverPoolUrls.js'
import { pickWeightedStrongGeoCover } from './geoStrongMarkers.js'
import { ensureLandmarkInTitle } from './geoLandmarkPools.js'
import { ALL_DESTINATION_NAMES } from './un193MembersZh.js'
import { inferChinaCityFromTitle, inferChinaRegionFromTitle } from '../utils/chinaCityFromTitle.js'

/** 全球 193 国 + 地区；与 un193MembersZh / mockData 对齐 */
export const DESTINATION_NAMES = ALL_DESTINATION_NAMES

/** 仅当目的地名未在 PRIMARY_IMAGE_BY_COUNTRY 注册时使用（应极少发生） */
export const FALLBACK_EXTRA_COVER =
  'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600'

const AUTHORS = [
  '背包客小明',
  '穷游达人',
  '路书编辑部',
  '环球慢游',
  '低预算旅行家',
  '城市漫游者',
  '铁道迷阿伟',
  '签证小助手',
  '美食暴走团',
  '独行地图君',
]

/** 中国攻略专用笔名轮换 */
const CHINA_AUTHORS = [
  '江浙沪慢游',
  '川藏线老赵',
  '西北风物志',
  '滇南编辑部',
  '高铁背包客',
  '胡同与雪山',
  '丝路手记',
  '岭南吃货地图',
]

/** 中国攻略封面：均为中国境内景观；长城构图 id 仅用于北京/京津冀标题（见 chinaCoverFromTitle），不放入通用轮换池 */
export const CHINA_COVER_POOL = [
  'https://images.unsplash.com/photo-1478865858807-4fd415904439?w=600',
  'https://images.unsplash.com/photo-1519046904884-02404a0b2ec9?w=600',
  'https://images.unsplash.com/photo-1528164344705-47542687000d?w=600',
  'https://images.unsplash.com/photo-1547981609-4b6a09b7a341?w=600',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600',
  'https://images.unsplash.com/photo-1465188162883-09ebb8c9e17a?w=600',
]

/** 珠三角 / 粤港澳等标题专用（维港城市天际线，与富士山景区分） */
export const CHINA_COVER_PEARL_DELTA =
  'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab1?w=600'
export const CHINA_COVER_YANGTZE_DELTA =
  'https://images.unsplash.com/photo-1536599018102-23f4bdd2356d?w=600'
export const CHINA_COVER_BEIJING_TJ_HE =
  'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=600'

function hashStr(s) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return Math.abs(h)
}

function pickDays(seed) {
  const opts = [5, 6, 7, 8, 9, 10, 11, 12, 14]
  return opts[seed % opts.length]
}

function estimateBudget(name, days, salt) {
  const base = 80 + (hashStr(name + salt) % 420)
  return Math.max(800, Math.round((days * base) / 100) * 100)
}

const TITLE_BUILDERS = [
  (n, seq) => `${n}${[7, 10, 5][seq % 3]}日穷游骨架路线（预算友好）`,
  (n, seq) => `${n}慢游${[10, 12, 8][seq % 3]}日：交通住宿省钱组合`,
  (n, seq) => `${n}双城/双主题${[6, 9, 11][seq % 3]}日行程参考`,
  (n, seq) => `${n}快闪延展线：${[4, 5, 6][seq % 3]}日低预算玩法`,
  (n, seq) => `${n}首次到访${[6, 8, 9][seq % 3]}日：新手少踩坑路线`,
  (n, seq) => `${n}公交/火车${[5, 7, 10][seq % 3]}日：大交通省钱排期`,
  (n, seq) => `${n}淡季/错峰${[7, 9, 12][seq % 3]}日：机票与住宿砍价思路`,
  (n, seq) => `${n}城市+自然${[8, 11, 6][seq % 3]}日：动静搭配玩法`,
  (n, seq) => `${n}市集与街头美食${[4, 5, 6][seq % 3]}日：人均百元吃到撑`,
  (n, seq) => `${n}博物馆+步行街区${[3, 4, 5][seq % 3]}日：文化线暴走`,
  (n, seq) => `${n}自驾/包车备选${[6, 8, 10][seq % 3]}日：分段报价参考`,
  (n, seq) => `${n}海岛/湖滨（若适用）${[5, 7, 9][seq % 3]}日：躺平与一日团组合`,
  (n, seq) => `${n}签证与入境备忘+${[7, 10, 8][seq % 3]}日行程打包`,
  (n, seq) => `${n}亲子/老人友好${[6, 8, 7][seq % 3]}日：节奏放慢版`,
  (n, seq) => `${n}徒步/户外加项${[5, 7, 9][seq % 3]}日：装备与保险清单`,
  (n, seq) => `${n}夜巴/红眼衔接${[8, 9, 11][seq % 3]}日：省一晚住宿的排法`,
  (n, seq) => `${n}世界遗产+老城步行${[4, 5, 6][seq % 3]}日（地标串联）`,
  (n, seq) => `${n}经典地标+河畔/海滨${[5, 6, 7][seq % 3]}日摄影线`,
  (n, seq) => `${n}市立博物馆+主教堂/清真寺周边${[3, 4, 5][seq % 3]}日文化线`,
  (n, seq) => `${n}古城墙/堡垒+主广场${[4, 5, 6][seq % 3]}日（步行友好）`,
  (n, seq) => `${n}地标建筑晨昏+夜景${[3, 4, 5][seq % 3]}日（错峰入园）`,
  (n, seq) => `${n}主教堂/圣殿+老市场${[4, 5, 6][seq % 3]}日（建筑与人文）`,
  (n, seq) => `${n}河畔天际线+桥梁地标${[3, 4, 5][seq % 3]}日城市名片`,
  (n, seq) => `${n}高山/火山口湖（若适用）${[5, 6, 7][seq % 3]}日自然地标`,
  (n, seq) => `${n}滨海大道+灯塔/城堡海岸${[4, 5, 6][seq % 3]}日线`,
]

/** 中国专项：区域/主题标题轮换，体现线路多样性（与全球通用模板区分） */
export const CHINA_ROUTE_TITLES = [
  '京津冀：北京天安门·紫禁城周边胡同+承德避暑山庄6日',
  '长三角：上海外滩苏州园林杭州西湖7日高铁联游',
  '珠三角：广深珠港澳衔接8日（证件与签注行前核对）',
  '川西：成都—四姑娘山—丹巴—塔公草原9日（高反应对）',
  '滇西北：丽江香格里拉泸沽湖8日慢游',
  '滇南：昆明建水元阳梯田摄影7日',
  '贵州：贵阳黄果树荔波小七孔西江苗寨8日',
  '广西：桂林阳朔漓江遇龙河5日',
  '海南：海口三亚环岛东线6日',
  '西北大环线：西宁青海湖茶卡敦煌张掖9日包车参考',
  '新疆北疆：乌鲁木齐喀纳斯禾木8日（季节性强）',
  '新疆南疆：喀什塔县帕米尔高原7日',
  '西藏：拉萨林芝羊湖8日（边防证与适应日）',
  '陕西：西安兵马俑华山回民街5日',
  '山西：平遥古城云冈石窟五台山7日',
  '内蒙古：呼伦贝尔草原满洲里6日夏季线',
  '东北：哈尔滨雪乡长白山7日冬季线',
  '山东：济南趵突泉+泰山+青岛海岸7日',
  '福建：厦门鼓浪屿土楼永定南靖6日',
  '安徽：黄山宏村西递5日',
  '江西：南昌庐山景德镇婺源7日',
  '湖南：张家界凤凰古城5日',
  '湖北：武汉黄鹤楼宜昌三峡大坝6日',
  '重庆+三峡：山城夜景与游轮分段5日',
  '四川：成都乐山峨眉山6日',
  '甘肃：兰州敦煌嘉峪关河西走廊7日',
  '宁夏：银川沙坡头西夏王陵5日',
  '青海：青海湖环湖骑行/包车4日',
  '粤港澳：深圳香港澳门城市暴走6日',
  '丝绸之路东段：西安兵马俑·天水·兰州6日火车线',
  '江南水乡：乌镇周庄同里古镇4日',
  '川藏线入门：成都宽窄巷子·康定新都桥5日（勿赶海拔）',
  '阿里南线概念：拉萨日喀则珠峰大本营10日（高海拔慎行）',
  '闽东：福州平潭岛霞浦滩涂5日',
  '粤西：湛江北海衔接涠洲岛6日',
  '滇东：罗平油菜花季摄影3日（花季）',
  '大兴安岭：漠河北极村夏季避暑5日',
  '闽南：厦门泉州漳州土楼6日',
  '长江三峡游轮：宜昌重庆上水5日参考价',
  '大运河：扬州苏州杭州文化线6日',
  '秦岭：西安城墙·汉中·广元蜀道5日',
  '湘西鄂西：恩施大峡谷张家界连线7日',
  '祁连山：西宁门源张掖丹霞6日夏季',
  '呼伦贝尔+阿尔山：草原与森林交界8日',
  '海南岛西线：儋州昌江棋子湾小众5日',
  '粤港澳高铁：广深港一日多城快闪3日',
  '世界遗产密集线：洛阳龙门石窟少林寺开封6日',
  '客家围屋：赣州龙岩永定5日',
  '茶马古道片段：丽江香格里拉徒步概念4日',
  '东北边境：丹东鸭绿江长白山连线6日',
  '无锡鼋头渚+扬州瘦西湖春日园林4日',
  '绍兴古城+宁波普陀山海天佛国5日',
  '潮汕：揭阳潮州汕头美食与骑楼5日',
  '丽水松阳古村+云和梯田摄影5日',
  '温州雁荡山+楠溪江山水4日',
  '胶东海岸：威海荣成烟台蓬莱5日',
  '洛阳龙门石窟+老君山金顶5日',
  '开封清明上河园+铁塔寺汴梁2日拼装',
  '襄阳古城+武当山道教名山6日',
  '恩施屏山峡谷+土司城+女儿城5日',
  '荔波茂兰喀斯特森林徒步4日',
  '兴义万峰林+马岭河峡谷3日',
  '崇左德天瀑布+明仕田园田园4日',
  '阳朔兴坪漓江徒步+遇龙河漂流3日',
  '龙脊梯田平安寨+金坑大寨观景3日',
  '西双版纳中科院植物园+傣族园4日',
  '腾冲和顺古镇+热海火山地质公园5日',
  '独库公路南段：库车大峡谷+巴音布鲁克5日（仅开放季）',
  '伊犁环线：赛里木湖+果子沟+霍尔果斯6日夏季',
  '那拉提+喀拉峻草原骑马摄影5日',
  '可可托海额尔齐斯大峡谷秋色4日',
  '额济纳旗胡杨林摄影5日（秋季限定）',
  '阿尔山国家森林公园秋景+天池5日',
  '赤峰乌兰布统坝上草原摄影4日',
  '秦皇岛北戴河+山海关老龙头海岸4日',
  '大同华严寺+悬空寺+恒山一日游拼装',
  '呼和浩特希拉穆仁草原+响沙湾边缘5日',
  '银川西夏陵+贺兰山岩画+镇北堡影城5日',
  '青海湖+茶卡盐湖两湖两日经典线',
  '敦煌莫高窟+鸣沙山月牙泉3日深度预约版',
  '嘉峪关城楼+长城第一墩+讨赖河半日拼装',
  '兰州省博+黄河风情线+牛肉面城市2日',
  '甘南概念：夏河拉卜楞寺+桑科草原5日',
  '梵净山+云舍侗寨铜仁连线4日',
  '赤水丹霞佛光岩+丙安古镇4日',
  '普者黑荷花季+青龙山日出4日（夏季）',
  '抚仙湖澄江环湖骑行+日出3日',
  '大理苍山洱海环湖慢行+喜洲4日',
  '沙溪古镇+剑川白族聚落慢游3日',
  '南浔+乌镇西栅错峰水乡4日',
  '西塘+朱家角上海周边古镇周末2日',
  '东极岛/嵊泗枸杞跳岛4日（船班行前核对）',
  '平潭岛蓝眼泪季海岸摄影3日（季节）',
  '武夷山天游峰+九曲溪漂流+大红袍3日',
  '泰宁大金湖+寨下大峡谷丹霞4日',
  '龙虎山天师府+竹筏丹霞4日',
  '三清山玉京峰云海日出周末3日',
  '武功山金顶徒步两日一夜入门',
  '老君山金顶日落冬雪4日',
  '云台山红石峡+茱萸峰3日',
  '太行山大峡谷+王莽岭挂壁公路4日',
  '镜泊湖吊水楼+地下森林3日夏季',
  '五大连池温泊+老黑山2日',
  '漠河龙江第一湾+北红村3日（旺季控期望）',
  '亚布力滑雪入门+雪乡夜景4日',
  '湖州莫干山民宿+安吉竹海3日',
  '千岛湖骑行+中心湖区游船3日',
  '衢州江郎山廿八都古镇4日',
  '金华横店影视城两日票错峰3日',
  '宜兴竹海+紫砂壶文化2日',
  '溧阳天目湖南山竹海2日',
  '南通狼山+濠河夜游城市2日',
  '盐城丹顶鹤湿地+麋鹿园生态3日',
  '连云港花果山+连岛海滨3日',
  '徐州汉文化景区+龟山汉墓2日',
  '宿迁骆马湖+项王故里2日',
  '淮安周恩来故居+河下古镇2日',
  '滁州琅琊山醉翁亭一日+南京中山陵衔接3日',
  '马鞍山采石矶+李白文化1日拼装',
  '芜湖方特/古镇自选周末2日',
  '铜陵九华山礼佛三日精华',
  '安庆天柱山+宏村衔接拼装5日',
  '池州九华山+太平湖4日',
  '黄山北门松谷庵徒步小众4日',
  '歙县徽州古城+棠樾牌坊群2日',
  '泾县查济古村+桃花潭3日',
  '宁德太姥山+霞浦滩涂5日',
  '漳州东山岛+火山岛海岸4日',
  '泉州海丝古迹+蟳埔女文化3日',
  '龙岩永定初溪土楼深度2日',
  '三明泰宁古城+尚书第2日拼装',
  '南平邵武天成奇峡小众3日',
  '龙岩冠豸山石门湖4日',
  '海南中线：五指山雨林+保亭温泉5日',
  '海南西线儋州东坡书院+昌江棋子湾4日',
  '北海银滩+涠洲岛火山口5日',
  '柳州螺蛳粉城市+龙潭公园2日',
  '桂林龙胜温泉+少数民族村寨3日',
  '河池巴马长寿村概念3日（理性预期）',
  '百色通灵大峡谷+靖西鹅泉4日',
  '贺州黄姚古镇+姑婆山3日',
  '崇左花山岩画世界遗产半日拼装',
  '昆明东川红土地摄影3日',
  '玉溪抚仙湖+星云湖环湖3日',
  '普洱景迈山古茶林世界遗产4日',
  '临沧冰岛茶山概念线3日（茶友向）',
  '大理诺邓古村+沙溪衔接4日',
  '怒江丙中洛概念线6日（路况行前确认）',
  '迪庆梅里雪山飞来寺日照金山4日（天气随缘）',
  '丽江虎跳峡高路徒步两日入门',
  '稻城亚丁长线短线5日（高反慎行）',
  '海螺沟冰川+泸定桥红旅3日',
  '四姑娘山双桥沟一日+长坪沟徒步拼装',
  '毕棚沟秋景+古尔沟温泉3日',
  '达古冰川周末两日（海拔注意）',
  '色达五明佛学院概念线5日（政策行前确认）',
  '若尔盖花湖+黄河九曲第一湾4日夏季',
  '扎尕那石城徒步概念4日',
  '敦煌阳关玉门关西线一日拼装',
  '哈密大海道边缘概念越野2日（勿擅闯无人区）',
  '吐鲁番火焰山+葡萄沟+坎儿井2日',
  '库尔勒博斯腾湖+罗布人村寨3日',
  '喀什古城开城仪式+牛羊巴扎半日',
  '和田玉石巴扎+沙漠公路概念3日（安全优先）',
  '阿勒泰禾木晨雾+喀纳斯湖三湾5日秋季',
  '布尔津五彩滩日落+哈巴河白桦4日',
  '克拉玛依魔鬼城+乌尔禾摄影半日',
  '赛里木湖环湖自驾/包车两日慢版',
  '巴音布鲁克九曲十八弯日落（独库开放季）',
  '特克斯八卦城+喀拉峻人体草原5日',
  '昭苏夏塔古道概念徒步4日（开放季）',
  '天山天池一日游+阜康衔接（高海拔轻量）',
  '银川沙湖+水洞沟史前遗址5日',
  '中卫沙坡头黄河滑索+腾格里边缘3日',
  '固原须弥山石窟+六盘山2日拼装',
  '榆林镇北台红石峡+毛乌素边缘3日',
  '延安壶口瀑布+黄帝陵4日红旅拼装',
  '汉中石门栈道+青木川古镇4日',
  '宝鸡太白山森林公园3日（季节开放核对）',
  '运城盐湖+关帝庙+普救寺3日',
  '晋城皇城相府+王莽岭4日',
  '忻州五台山礼佛大朝台概念5日',
  '廊坊天下第一城+天津衔接周末2日',
  '秦皇岛阿那亚社区海岸摄影2日（预约政策）',
  '承德木兰围场坝上秋景4日',
  '张家口草原天路自驾2日（路况核对）',
  '乌兰察布火山群摄影2日',
  '锡林郭勒草原那达慕概念3日（节庆随缘）',
  '阿拉善左旗胡杨与沙漠摄影4日（秋季）',
  '呼伦贝尔莫尔道嘎森林+室韦边境6日',
  '满洲里国门+呼伦湖两日拼装',
  '大兴安岭加格达奇鄂伦春概念3日',
  '沈阳故宫+张氏帅府+中街2日',
  '大连滨海路+金石滩3日',
  '丹东虎山长城+鸭绿江断桥1日拼装',
  '长春净月潭+伪满皇宫博物院2日',
  '长白山北坡天池+瀑布3日夏季',
  '哈尔滨中央大街+索菲亚教堂+冰雪大世界冬季',
  '齐齐哈尔扎龙丹顶鹤湿地一日',
  '五大连池+伊春林海5日避暑',
  '佳木斯三江口+同江赫哲族文化3日',
  '黑河瑷珲历史陈列+中俄双子城2日',
  '绥芬河口岸城市+东宁要塞3日',
  '威海刘公岛甲午战争纪念2日',
  '青岛崂山太清仰口两日徒步',
  '烟台蓬莱阁+长岛跳岛3日（船班核对）',
  '济南趵突泉+大明湖+千佛山2日',
  '泰安泰山夜爬日出周末版',
  '曲阜三孔文化一日游拼装',
  '临沂沂蒙山+地下大峡谷3日',
  '枣庄台儿庄古城夜景2日',
  '徐州云龙湖+汉画像石馆2日',
  '宿迁洪泽湖湿地+三台山2日',
  '扬州东关街+瘦西湖+个园2日',
  '镇江金山寺+西津渡一日拼装',
  '苏州园林留园拙政园错峰2日',
  '无锡灵山胜境+拈花湾禅意小镇2日',
  '常州天目湖+南山竹海2日',
  '南通濠河夜游+狼山一日',
  '上海外滩豫园+苏州河Citywalk2日拼装',
  '杭州西湖环湖+灵隐寺+法喜寺2日',
  '宁波天一阁+老外滩+舟山跨海大桥衔接3日',
  '温州楠溪江漂流+石桅岩2日',
  '台州天台山国清寺+石梁飞瀑3日',
  '丽水缙云仙都+鼎湖峰2日',
  '衢州江郎山+廿八都4日',
  '南昌滕王阁+海昏侯国遗址博物馆2日',
  '九江庐山牯岭镇避暑3日',
  '景德镇陶溪川+古窑民俗博览区2日',
  '上饶三清山+婺源篁岭晒秋4日秋季',
  '宜春明月山温泉+温汤镇2日',
  '萍乡武功山反穿两日户外版',
  '新余仙女湖+分宜洞都2日',
  '鹰潭龙虎山竹筏+天师府（与福建线互补）',
  '赣州宋城古城墙+八境台2日',
  '吉安井冈山红旅+杜鹃山3日',
  '抚州大觉山+资溪面包之乡2日',
  '长沙橘子洲+岳麓书院+省博2日',
  '岳阳楼洞庭湖+君山岛2日',
  '常德桃花源+柳叶湖2日',
  '张家界天门山+武陵源核心3日',
  '湘西芙蓉镇+红石林3日',
  '怀化洪江古商城+通道侗寨4日',
  '邵阳崀山丹霞世界遗产3日',
  '衡阳南岳衡山祝融峰两日',
  '郴州东江湖雾漫小东江+高椅岭3日',
  '永州柳子庙+零陵古城2日拼装',
  '广西崇左宁明花山岩画半日拼装',
  '贵州毕节百里杜鹃4日（春季）',
  '贵州安顺龙宫+屯堡文化3日',
  '贵州兴义马岭河+万峰林深度3日',
  '贵州赤水竹海+佛光岩4日',
  '贵州从江加榜梯田+岜沙苗寨5日',
  '贵州镇远古城+舞阳河夜景3日',
  '贵州荔波大小七孔深度两日慢游',
  '贵州织金洞地质公园一日游拼装',
  '贵州六盘水乌蒙大草原避暑3日夏季',
  '云南建水古城小火车+朱家花园3日',
  '云南弥勒东风韵+红酒庄2日',
  '云南石林+九乡溶洞一日游拼装',
  '云南抚仙湖帆船体验+环湖骑行3日',
  '云南普者黑青龙山+仙人洞村3日',
  '云南元阳多依树日出老虎嘴日落摄影4日',
  '云南红河哈尼梯田世界遗产深度5日',
  '云南碧色寨米轨+蒙自过桥米线2日',
  '云南普达措属都湖+松赞林寺香格里拉3日',
  '云南梅里雨崩徒步概念6日（户外门槛高）',
  '四川广元剑门关蜀道3日',
  '四川阆中古城风水格局2日',
  '四川宜宾李庄古镇+五粮液园区2日',
  '四川自贡灯会+盐业历史博物馆2日冬季',
  '四川泸州尧坝古镇+赤水河2日拼装',
  '四川乐山美食跷脚牛肉+大佛错峰2日',
  '四川眉山三苏祠+彭祖山2日',
  '四川雅安碧峰峡熊猫基地2日',
  '四川西昌邛海泸山+螺髻山温泉4日',
  '四川阿坝黄龙五彩池+九寨沟错峰5日',
  '四川理县毕棚沟+古尔沟温泉3日',
  '四川马尔康卓克基官寨+色达概念5日',
  '四川甘孜塔公草原+墨石公园3日',
  '四川泸沽湖四川侧草海走婚桥2日',
  '重庆武隆天生三桥+龙水峡地缝2日',
  '重庆大足石刻宝顶北山一日游拼装',
  '重庆酉阳桃花源+龚滩古镇乌江画廊4日',
  '重庆奉节白帝城+巫山小三峡3日',
  '重庆万州大瀑布+三峡移民纪念馆2日',
  '湖北神农架大九湖避暑5日夏季',
  '湖北武当山金顶两日礼佛徒步',
  '湖北宜昌清江画廊+三峡人家3日',
  '湖北恩施大峡谷七星寨+云龙地缝2日',
  '湖北襄阳唐城影视基地夜游2日',
  '湖北荆州古城墙+博物馆2日',
  '湖北咸宁九宫山避暑3日夏季',
  '湖北黄石仙岛湖天空之城2日',
  '河南安阳殷墟+红旗渠精神3日',
  '河南新乡郭亮挂壁公路+万仙山3日',
  '河南焦作云台山红石峡深度2日',
  '河南洛阳白马寺+龙门石窟一日拼装',
  '河南登封少林寺+嵩阳书院2日',
  '河南开封铁塔繁塔古城徒步2日',
  '河南商丘芒砀山汉墓群2日',
  '河南许昌曹魏古城+春秋楼2日',
  '河北承德避暑山庄外八庙2日深度',
  '河北秦皇岛山海关老龙头+孟姜女庙1日拼装',
  '河北正定隆兴寺+荣国府2日',
  '河北赵州桥+柏林禅寺1日拼装',
  '河北保定直隶总督署+古莲花池2日',
  '河北野三坡百里峡+拒马河漂流3日夏季',
  '山西运城盐湖+关帝庙+永乐宫壁画3日',
  '山西临汾壶口瀑布陕西侧观景拼装说明',
  '山西晋城王莽岭锡崖沟挂壁3日',
  '山西忻州雁门关+代县古城2日',
  '山西吕梁碛口古镇黄河壁画3日',
  '内蒙古额济纳怪树林黑城摄影4日',
  '内蒙古阿拉善巴丹吉林沙漠边缘摄影3日（安全跟队）',
  '内蒙古通辽科尔沁草原那达慕概念3日',
  '内蒙古锡林郭勒元上都遗址+金莲川2日',
  '内蒙古二连浩特国门恐龙地质公园2日',
  '甘肃甘南扎尕那+郎木寺4日',
  '甘肃天水麦积山石窟+伏羲庙2日',
  '甘肃平凉崆峒山道教名山2日',
  '甘肃武威雷台汉墓+文庙2日',
  '甘肃张掖平山湖大峡谷+七彩丹霞两日',
  '甘肃酒泉卫星发射中心外围概念1日（政策）',
  '甘肃敦煌西千佛洞+阳关玉门关一日',
  '甘肃陇南官鹅沟森林公园3日夏季',
  '青海三江源外围概念科普线4日（生态敏感勿擅入）',
  '青海茫崖翡翠湖+艾肯泉恶魔之眼3日（路况）',
  '青海冷湖火星营地概念摄影2日（跟队）',
  '新疆吐鲁番交河故城+苏公塔1日拼装',
  '新疆鄯善库木塔格沙漠冲浪半日',
  '新疆奇台江布拉克麦浪摄影3日秋季',
  '新疆富蕴可可托海三号矿坑一日',
  '新疆布尔津禾木晨雾摄影两日',
  '新疆喀纳斯观鱼台+三湾徒步一日',
  '新疆白哈巴边境村落概念2日（边防证）',
  '新疆吉木乃草原石城小众2日',
  '新疆克拉玛依黑油山+九龙潭城市半日',
  '新疆奎屯独山子大峡谷半日拼装',
  '新疆伊昭公路概念自驾2日（开放季）',
  '新疆夏塔古道轻徒步两日（开放季）',
  '新疆琼库什台村落概念3日',
  '新疆库尔德宁云杉林小众3日',
  '新疆那拉提空中草原+河谷草原两日',
  '新疆巴音布鲁克天鹅湖+九曲十八弯',
  '新疆库车克孜尔千佛洞+天山神秘大峡谷2日',
  '新疆阿克苏温宿大峡谷摄影2日',
  '新疆和田团城夜市+玉石巴扎1日',
  '新疆莎车叶尔羌汗国王陵2日',
  '新疆塔什库尔干石头城金草滩2日',
  '西藏山南羊卓雍措半日+卡若拉冰川拼装',
  '西藏日喀则扎什伦布寺+珠峰大本营概念5日',
  '西藏林芝雅鲁藏布大峡谷+索松村桃花季4日春季',
  '西藏波密然乌湖来古冰川4日',
  '西藏阿里冈仁波齐转山概念15日（极高门槛）',
  '西藏纳木错扎西半岛两日（高反注意）',
  '西藏昌都强巴林寺+三江并流概念4日',
  '宁夏中卫黄河宿集+66号公路摄影2日',
  '陕西韩城司马迁祠+党家村古村2日',
  '陕西榆林镇北台红石峡半日拼装',
  '陕西延安宝塔山+枣园革命旧址1日拼装',
  '陕西汉中青木川古镇+昭化古城3日',
  '陕西商洛金丝峡大峡谷2日夏季',
  '陕西渭南华山北上西下两日徒步',
  '陕西宝鸡法门寺+太白山北坡3日',
  '四川广安邓小平故里+华蓥山2日',
  '四川遂宁死海漂浮体验周末2日',
  '四川南充阆中风水古城深度2日',
  '贵州遵义会议会址+赤水丹霞4日',
  '贵州铜仁梵净山红云金顶两日（预约）',
  '贵州六盘水乌蒙大草原骑马3日',
  '云南楚雄彝人古镇+元谋土林3日',
  '云南昭通大山包黑颈鹤冬季摄影3日',
  '云南曲靖罗平油菜花海3日春季',
  '海南文昌航天科普+东郊椰林2日',
  '海南万宁日月湾冲浪入门3日',
  '海南陵水分界洲岛潜水2日',
  '海南保亭呀诺达雨林+七仙岭温泉3日',
  '广东韶关丹霞山阳元石长老峰2日',
  '广东清远英西峰林徒步+溶洞3日',
  '广东梅州客家围龙屋+雁南飞茶田3日',
  '广东潮州古城牌坊街+广济桥夜景2日',
  '广东汕头南澳岛环岛2日',
  '广东珠海长隆海洋王国+情侣路2日',
  '广东佛山祖庙+岭南天地+顺德美食2日',
  '广东江门开平碉楼世界遗产一日游拼装',
  '广东阳江海陵岛十里银滩2日',
  '广东湛江硇洲岛火山海岸2日',
  '广西柳州三江程阳八寨侗族风雨桥3日',
  '广西来宾金秀圣堂山避暑3日夏季',
  '广西玉林大容山森林公园2日',
  '广西北海涠洲岛火山口鳄鱼山+滴水丹屏3日',
  '西藏拉萨八廓街转经+甜茶馆城市慢行1日拼装',
]

function buildChinaTitle(seqForDest) {
  return CHINA_ROUTE_TITLES[seqForDest % CHINA_ROUTE_TITLES.length]
}

/** 美国专项：标题须含城市/国家公园地理标志，与通用「美国N日骨架」区分 */
export const USA_ROUTE_TITLES = [
  '纽约：自由女神岛+曼哈顿天际线+时代广场3日',
  '纽约：中央公园+大都会博物馆+百老汇区2日',
  '纽约：布鲁克林大桥+DUMBO+高线公园概念2日',
  '美东：华盛顿国会山+林肯纪念堂+史密森尼博物馆4日',
  '费城：独立宫自由钟+艺术博物馆一日拼装',
  '波士顿：自由之路+哈佛麻省理工校园2日',
  '迈阿密南海滩+装饰艺术区+大沼泽国家公园3日',
  '奥兰多迪士尼/环球影城择一+肯尼迪航天中心概念5日',
  '芝加哥：千禧公园云门+建筑游船+威利斯塔2日',
  '洛杉矶：好莱坞标志+环球影城+圣莫尼卡码头3日',
  '旧金山：金门大桥+渔人码头+九曲花街2日',
  '拉斯维加斯：大道夜景+红峡谷周边2日',
  '西雅图：太空针塔+派克市场+普吉特海湾2日',
  '夏威夷：檀香山威基基+珍珠港历史遗址3日',
  '亚利桑那：科罗拉多大峡谷南缘+塞多纳红岩3日',
  '犹他州：锡安国家公园+布莱斯峡谷拱门概念4日',
  '怀俄明：黄石老忠实泉+大提顿雪山连线5日',
  '阿拉斯加：安克雷奇峡湾+迪纳利远眺概念4日',
  '德州：休斯顿太空中心+奥斯汀音乐街+圣安东尼奥河畔3日',
  '新奥尔良：法国区爵士乐+鳄鱼沼泽游船2日',
  '纳什维尔乡村音乐馆+孟菲斯猫王故居概念3日',
  '科罗拉多：丹佛落基山门户+博尔德小镇2日',
  '南达科他：总统山+疯马纪念馆+恶地国家公园3日',
  '北卡大雾山国家公园+蓝岭公路片段3日',
  '尼亚加拉瀑布：布法罗过境+雾中少女号概念2日',
  '加州一号公路：卡梅尔+大苏尔海岸一日拼装',
  '优胜美地：半圆顶谷+马里波萨巨杉两日',
  '盐湖城：摩门圣殿广场+大盐湖观景1日拼装',
  '死亡谷国家公园：沙丘+恶水盆地两日（夏季慎行）',
  '新墨西哥州：圣菲土坯城+白沙国家公园3日',
  '明尼苏达：明尼阿波利斯瀑布城+边界水域概念2日',
  '俄勒冈州：波特兰玫瑰园+哥伦比亚河谷瀑布2日',
  '北加州：纳帕酒庄+红木国家公园概念2日',
  '圣地亚哥：巴尔博亚公园+中途岛航母博物馆2日',
  '凤凰城周边：塞多纳红岩+仙人掌国家公园2日',
  '亚特兰大：可口可乐世界+佐治亚水族馆1日拼装',
  '坦帕湾：清水海滩+布希花园一日',
  '盐湖城黄石西口：西黄石小镇衔接概念2日',
  '蒙大拿：冰河国家公园向阳大道自驾两日',
  '华盛顿州：奥林匹克国家公园飓风脊+雨林海岸3日',
  '阿拉斯加费尔班克斯：极光季概念4日（冬季）',
  '罗德岛：普罗维登斯布朗大学+纽波特海岸豪宅2日',
  '密歇根：麦基诺岛马车+湖滨公路2日',
  '威斯康星：密尔沃基湖滨+奶制品体验2日',
  '爱荷华州：得梅因州府+田野公路摄影1日拼装',
  '内华达里诺：太浩湖滑雪+赌场城2日冬季',
  '佛蒙特：伯灵顿湖滨+枫叶季公路3日秋季',
]

function buildUsaTitle(seqForDest) {
  return USA_ROUTE_TITLES[seqForDest % USA_ROUTE_TITLES.length]
}

/** 美国攻略封面：均为美国境内景观；与 USA_ROUTE_TITLES 地域词联动 */
export const USA_COVER_POOL = [
  'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600',
  'https://images.unsplash.com/photo-1485738422979-f5c18d67c959?w=600',
  'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=600',
  'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600',
  'https://images.unsplash.com/photo-1474044150017-7c79bc86aa21?w=600',
  'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600',
  'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?w=600',
  'https://images.unsplash.com/photo-1501596812083-862921f1e7e6?w=600',
  'https://images.unsplash.com/photo-1513828749310-ddb00316be76?w=600',
  'https://images.unsplash.com/photo-1605836246008-cf8b9492bef4?w=600',
  'https://images.unsplash.com/photo-1617581430595-89734ae4426c?w=600',
  'https://images.unsplash.com/photo-1542259679001-c17332acc90a?w=600',
  'https://images.unsplash.com/photo-1494522358652-f3c3b5f45e8d?w=600',
  'https://images.unsplash.com/photo-1506929562872-b94aa2565b4b?w=600',
]

function usaCoverFromTitle(title, seqForDest) {
  if (/纽约|曼哈顿|时代广场|自由女神|布鲁克林|费城|波士顿/.test(title))
    return 'https://images.unsplash.com/photo-1485738422979-f5c18d67c959?w=600'
  if (/旧金山|金门|硅谷|一号公路|卡梅尔|蒙特雷|优胜美地|纳帕|索诺玛/.test(title))
    return 'https://images.unsplash.com/photo-1501596812083-862921f1e7e6?w=600'
  if (/洛杉矶|好莱坞|环球|圣莫尼卡|圣地亚哥/.test(title))
    return 'https://images.unsplash.com/photo-1513828749310-ddb00316be76?w=600'
  if (/拉斯维加斯/.test(title)) return 'https://images.unsplash.com/photo-1605836246008-cf8b9492bef4?w=600'
  if (/华盛顿州|西雅图|奥林匹克国家|雷尼尔|普吉特/.test(title))
    return 'https://images.unsplash.com/photo-1494522358652-f3c3b5f45e8d?w=600'
  if (/华盛顿(?![州县])|哥伦比亚特区|白宫|国会山|林肯纪念|史密森尼/.test(title))
    return 'https://images.unsplash.com/photo-1617581430595-89734ae4426c?w=600'
  if (/大峡谷|黄石|大提顿|锡安|布莱斯|优胜美地|死亡谷|拱门|落基山/.test(title))
    return 'https://images.unsplash.com/photo-1474044150017-7c79bc86aa21?w=600'
  if (/夏威夷|檀香山|欧胡|茂宜|大岛|威基基/.test(title))
    return 'https://images.unsplash.com/photo-1542259679001-c17332acc90a?w=600'
  if (/芝加哥|密歇根湖|西雅图|太空针|派克市场/.test(title))
    return 'https://images.unsplash.com/photo-1494522358652-f3c3b5f45e8d?w=600'
  if (/迈阿密|奥兰多|大沼泽|基韦斯特/.test(title))
    return 'https://images.unsplash.com/photo-1506929562872-b94aa2565b4b?w=600'
  return USA_COVER_POOL[seqForDest % USA_COVER_POOL.length]
}

/** 日本：区域/主题标题轮换，避免与全球「日本N日骨架」模板雷同 */
export const JAPAN_ROUTE_TITLES = [
  '北海道：札幌小樽运河+白色恋人公园4日',
  '北海道：富良野美瑛花田骑行夏季线5日',
  '北海道：旭山动物园+美瑛青池+层云峡6日',
  '北海道：道东钏路湿原+阿寒湖鹤居4日',
  '北海道：网走流冰季+知床五湖冬季概念5日',
  '东北：仙台松岛海岸+牛舌美食2日拼装',
  '东北：青森苹果之路+十和田湖奥入濑溪流3日',
  '东北：秋田角馆武家屋敷+乳头温泉乡3日',
  '关东：东京晴空塔浅草寺+秋叶原暴走3日',
  '关东：富士山河口湖+忍野八海+富士急乐园3日',
  '关东：箱根温泉旅馆+大涌谷芦之湖海贼船2日',
  '关东：镰仓大佛江之电+湘南海岸一日',
  '关东：日光东照宫+华严瀑布二荒山神社2日',
  '关东：轻井泽高原Outlet+云场池散步2日夏季',
  '中部：金泽兼六园+东茶屋街+近江町市场2日',
  '中部：立山黑部阿尔卑斯路线（雪墙季）概念3日',
  '中部：高山古街+白川乡合掌村一日游拼装',
  '中部：名古屋城+乐高乐园+味噌猪排2日',
  '中部：下吕温泉+高山飞驒牛美食3日',
  '关西：大阪道顿堀USJ+梅田夜景3日',
  '关西：京都清水寺祇园+岚山竹林2日',
  '关西：奈良东大寺若草山+宇治抹茶半日拼装',
  '关西：神户北野异人馆+有马温泉六甲山夜景2日',
  '关西：姬路城书写山圆教寺一日',
  '关西：和歌山熊野古道入门那智大社2日',
  '中国：广岛平和纪念资料馆+宫岛严岛神社2日',
  '中国：冈山后乐园仓敷美观地区2日',
  '四国：濑户内艺术祭岛屿跳岛（直岛丰岛）概念4日',
  '四国：道后温泉本馆+松山城+今治岛波海道3日',
  '四国：高知桂滨+四万十川清流3日',
  '九州：福冈天神博多拉面+太宰府天满宫2日',
  '九州：熊本城+阿苏火山草千里概念3日（火山活动行前确认）',
  '九州：鹿儿岛樱岛渡轮+指宿砂蒸温泉2日',
  '九州：长崎原爆资料馆+哥拉巴园稻佐山夜景2日',
  '九州：由布院金鳞湖+别府地狱巡游温泉2日',
  '九州：黑川温泉旅馆一泊二食慢游2日',
  '冲绳：那霸首里城迹+国际通+美军基地展望台2日',
  '冲绳：恩纳万座毛+美ら海水族馆北部两日',
  '冲绳：石垣岛竹富岛星砂海岸跳岛3日',
  '冲绳：宫古岛与那霸前滨海滩3日',
  '信州：长野善光寺+户隐神社+野猿公苑雪猴冬季',
  '伊豆：热海温泉街+大室山城崎海岸2日',
  '琵琶湖：彦根城+近江八幡水乡2日',
  '北陆：福井东寻坊越前海岸+恐龙博物馆2日',
  '山阴：鸟取砂丘+境港鬼太郎街道2日',
  '山阴：出云大社+足立美术馆松江2日',
  '东海：静冈茶田+富士山本栖湖芝樱季4-5月',
  '纪南：白滨温泉三段壁圆月岛2日',
  'JR全国Pass：东京晴空塔·浅草—大阪城·梅田新干线7日机动',
  '地方铁道：江之电+叡山电车+嵯峨野观光列车拼装',
  '温泉巡礼：草津温泉+伊香保温泉群马2日',
  '红叶季：京都岚山+永观堂南禅寺追枫3日',
  '赏樱季：东京目黑川+千鸟渊+新宿御苑概念3日',
  '滑雪：苗场神乐+白马八方尾根入门周末版',
  '花火：隅田川淀川长冈（日期随缘）概念1日',
  '离岛：小豆岛橄榄公园+天使散步道2日',
  '离岛：对马岛严原港+宗家宅邸历史2日',
  '动漫圣地：东京台场御台场+镰仓巡礼拼装2日',
  '美食：大阪黑门市场+京都锦市场+神户牛一日拼装',
  '米其林省预算：午餐定食+便利店早餐组合策略',
  '青森睡魔祭+弘前城樱花（季节）2日',
  '札幌啤酒博物馆+白色恋人公园半日拼装',
  '函馆山百万夜景+朝市海鲜丼2日',
  '登别地狱谷+洞爷湖昭和新山熊牧场2日',
  '知床流冰漫步+宇登吕温泉冬季概念3日',
  '钏路湿原SL冬季蒸汽（开放日确认）1日',
  '松本城+上高地徒步入门2日夏季',
  '高山阵屋+宫川朝市+飞驒牛午餐一日',
  '白川乡点灯季夜间巴士（预约制）概念1日',
  '金泽21世纪美术馆+东茶屋街散策半日',
  '能登半岛和仓温泉+千里滨渚车道2日',
  '敦贺若狭湾三方五湖+熊川宿2日',
  '天桥立伞松公园+伊根舟屋京都府北2日',
  '淡路岛鸣门漩涡+神户淡路鸣门自动车道2日',
  '鸣门涡之道+大鸣门桥观景半日',
  '屋久岛绳文杉徒步概念3日（预约向导）',
  '奄美大岛德之岛线跳岛4日',
  '小笠原父岛概念船班（船期长，慎选）',
  '东京下北泽古着+下町谷中银座散步1日',
  '横滨红砖仓库+中华街+港未来夜景1日',
  '川越藏造老街+冰川神社小江户1日',
  '秩父长瀞溪谷荒川漂流夏季半日',
  '奥多摩奥多摩湖+冰川徒步一日',
  '茨城国营常陆海滨公园扫帚草秋季',
  '栃木日光江户村+鬼怒川温泉2日',
  '群马草津温泉汤畑+温泉街夜游1日',
  '新潟越后汤泽滑雪+清酒藏见学冬季',
  '石川加贺温泉乡山代山中片山津2日',
  '福井永平寺+东寻坊越前蟹季冬季',
  '滋贺彦根城+近江八幡水乡巡游2日',
  '奈良吉野山千本樱（春季）1日',
  '和歌山高野山宿坊体验一晚（宗教礼仪）',
  '三重伊势神宫+鸟羽志摩英虞湾2日',
  '爱知名古屋城+丰田纪念馆+大须商店街2日',
  '静冈大室山+城崎海岸+仙人掌动物园伊豆2日',
  '岐阜郡上八幡+白川乡冬季点灯拼车概念',
]

/** 富士+忠霊塔经典构图：仅在与富士/河口湖相关的标题中注入，避免配到关西/九州等线 */
export const JAPAN_COVER_FUJI_CHUREITO =
  'https://images.unsplash.com/photo-1490763939896-063c038d71f0?w=600'

export const JAPAN_COVER_POOL = [
  'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600',
  'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600',
  'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=600',
  'https://images.unsplash.com/photo-1549692520-acc6669e2f0c?w=600',
  'https://images.unsplash.com/photo-1528360983277-f517a76965d4?w=600',
  'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600',
  'https://images.unsplash.com/photo-1578469550956-0e2f21ccb196?w=600',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600',
  'https://images.unsplash.com/photo-1464822759023-fed6222882c7?w=600',
  'https://images.unsplash.com/photo-1545569341-eeb0e44ee2f5?w=600',
  'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600',
]

const JAPAN_AUTHORS = [
  '关东漫游',
  '关西吃遍',
  '北海道雪友',
  '九州铁道控',
  '冲绳海岛记',
  '温泉巡礼',
  'JR通票党',
  '樱花季编辑部',
]

function buildJapanTitle(seqForDest) {
  return JAPAN_ROUTE_TITLES[seqForDest % JAPAN_ROUTE_TITLES.length]
}

/** 中国：标题地域与封面一致；默认按 seq 轮换（与 buildChinaTitle 同索引系），避免 idNum 与标题错位 */
function chinaCoverFromTitle(title, seqForDest) {
  if (/珠三角|粤港澳|广深|珠港澳|港澳衔接|广深港|深港口岸/.test(title)) return CHINA_COVER_PEARL_DELTA
  if (/长三角|沪苏|上海|苏杭|杭州|南京|苏州|乌镇|周庄|同里/.test(title)) return CHINA_COVER_YANGTZE_DELTA
  if (/京津冀|北京|故宫|紫禁城|承德避暑|天津卫|长城|八达岭|慕田峪/.test(title)) return CHINA_COVER_BEIJING_TJ_HE
  return CHINA_COVER_POOL[seqForDest % CHINA_COVER_POOL.length]
}

/** 日本：富士山景仅在标题含富士/河口湖等时出现，其余按 seq 轮换 */
function japanCoverFromTitle(title, seqForDest) {
  if (/富士|河口湖|忍野|富士急|箱根|镰仓|江之岛|湘南/.test(title)) return JAPAN_COVER_FUJI_CHUREITO
  return JAPAN_COVER_POOL[seqForDest % JAPAN_COVER_POOL.length]
}

/** 韩国：济州/釜山/首尔意象与标题关键词绑定，减少「一国一图」泛用 */
const KOREA_COVER_ROTATION = [
  'https://images.unsplash.com/photo-1534274867514-d5b47ef89ed7?w=600',
  'https://images.unsplash.com/photo-1596402184320-feea2f6e31b7?w=600',
  'https://images.unsplash.com/photo-1543785734-4b6e564642f8?w=600',
  'https://images.unsplash.com/photo-1528181304800-259b08848526?w=600',
  'https://images.unsplash.com/photo-1528127269322-539801943592?w=600',
]

function koreaCoverFromTitle(title, seqForDest) {
  const t = title || ''
  if (/济州|济州岛|汉拿|牛岛|涉地可支/.test(t)) return KOREA_COVER_ROTATION[1]
  if (/釜山|海云台|甘川|影岛/.test(t)) return KOREA_COVER_ROTATION[2]
  if (/首尔|景福宫|明洞|北村|汉江|南山塔|乐天世界/.test(t)) return KOREA_COVER_ROTATION[0]
  return KOREA_COVER_ROTATION[seqForDest % KOREA_COVER_ROTATION.length]
}

/** 泰国：海岛/泰北/曼谷意象分池，与 geo 修正主图一致 */
const THAILAND_COVER_ROTATION = [
  'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600',
  'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600',
  'https://images.unsplash.com/photo-1528181304800-259b08848526?w=600',
]

function thailandCoverFromTitle(title, seqForDest) {
  const t = title || ''
  if (/普吉|苏梅|皮皮|甲米|丽贝|斯米兰|沙美|海岛|跳岛/.test(t)) return THAILAND_COVER_ROTATION[2]
  if (/清迈|清莱|拜县|兰纳|白庙|蓝庙/.test(t)) return THAILAND_COVER_ROTATION[1]
  if (/曼谷|大皇宫|湄南|郑王庙|水上市场|暹罗|是隆/.test(t)) return THAILAND_COVER_ROTATION[0]
  return THAILAND_COVER_ROTATION[seqForDest % THAILAND_COVER_ROTATION.length]
}

/** 自动补篇攻略封面：中/日/美/韩/泰用标题关联池；其余用该国主图+轮换池按哈希分散，减少千篇一律 */
function coverForExtraArticle(name, seqForDest, title, idNum) {
  if (name === '中国') return chinaCoverFromTitle(title, seqForDest)
  if (name === '日本') return japanCoverFromTitle(title, seqForDest)
  if (name === '美国') return usaCoverFromTitle(title, seqForDest)
  if (name === '韩国') return koreaCoverFromTitle(title, seqForDest)
  if (name === '泰国') return thailandCoverFromTitle(title, seqForDest)
  return pickWeightedStrongGeoCover(name, title, idNum, seqForDest)
}

function buildExtraArticle(name, idNum, seqForDest) {
  const days = pickDays(hashStr(`${name}d${seqForDest}`))
  const budget = estimateBudget(name, days, String(seqForDest))
  const tplIdx = hashStr(`${name}:${seqForDest}`) % TITLE_BUILDERS.length
  let title =
    name === '中国'
      ? buildChinaTitle(seqForDest)
      : name === '日本'
        ? buildJapanTitle(seqForDest)
        : name === '美国'
          ? buildUsaTitle(seqForDest)
          : TITLE_BUILDERS[tplIdx](name, seqForDest)
  if (name !== '中国') {
    title = ensureLandmarkInTitle(name, seqForDest, title)
  }
  const tagPool = [
    '穷游',
    '路线',
    '交通',
    '住宿',
    '省钱',
    '当地体验',
    '新手友好',
    '深度',
    '美食',
    '签证',
    '淡季',
    '公交',
    '徒步',
    '亲子',
    '摄影',
    '博物馆',
  ]
  const chinaTagExtra = ['高铁', '世界遗产', '高原', '自驾', '江南', '西北', '海岛', '古镇']
  const japanTagExtra = ['JR', '温泉', '红叶季', '北海道', '冲绳', '关西', '关东', '九州', '神社', '赏樱', '雪季', '离岛']
  const pool =
    name === '中国'
      ? [...tagPool, ...chinaTagExtra]
      : name === '日本'
        ? [...tagPool, ...japanTagExtra]
        : tagPool
  const t0 = pool[(idNum + hashStr(name)) % pool.length]
  const t1 = pool[(idNum * 3 + 1) % pool.length]
  const t2 = pool[(idNum * 5 + 2) % pool.length]
  const tags = [...new Set([t0, t1, t2])].slice(0, 3)
  const month = 1 + (idNum % 11)
  const day = 1 + (idNum % 27)
  const cover = coverForExtraArticle(name, seqForDest, title, idNum)
  const urlPool = buildCoverUrlPoolForDestination(name)
  let gallery
  if (urlPool.length >= 2) {
    const i0 = hashStr(`${name}:g0:${idNum}`) % urlPool.length
    let i1 = hashStr(`${name}:g1:${idNum}`) % urlPool.length
    if (i1 === i0) i1 = (i0 + 1) % urlPool.length
    gallery = [urlPool[i0], urlPool[i1]]
  } else if (urlPool.length === 1) {
    gallery = [urlPool[0]]
  }
  const authorName =
    name === '中国'
      ? CHINA_AUTHORS[idNum % CHINA_AUTHORS.length]
      : name === '日本'
        ? JAPAN_AUTHORS[idNum % JAPAN_AUTHORS.length]
        : AUTHORS[idNum % AUTHORS.length]

  const article = {
    id: `a${idNum}`,
    title,
    cover,
    author: authorName,
    date: `2025-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    destination: name,
    budget,
    days,
    likes: 200 + (hashStr(name + idNum) % 2500),
    views: 2000 + (hashStr(String(idNum) + name) % 22000),
    tags,
    ...(gallery ? { gallery } : {}),
  }
  if (name === '中国') {
    const city = inferChinaCityFromTitle(title)
    const region = inferChinaRegionFromTitle(title)
    if (city) article.city = city
    if (region) article.region = region
  }
  return article
}

/**
 * @param {Array<Record<string, unknown>>} coreArticles
 * @param {object} [options]
 * @param {number} [options.minPerDestination]
 * @param {string[]} [options.destinationNames]
 * @param {Record<string, number>} [options.minPerDestinationOverrides] 按目的地名覆盖最低篇数，如 `{ 中国: 180 }`
 */
export function augmentArticlesToMinPerDestination(coreArticles, options = {}) {
  const minPerDestination = options.minPerDestination ?? 4
  const destinationNames = options.destinationNames ?? DESTINATION_NAMES
  const minOverrides = options.minPerDestinationOverrides ?? {}

  const byDest = Object.create(null)
  for (const a of coreArticles) {
    if (!a.destination) continue
    byDest[a.destination] = (byDest[a.destination] || 0) + 1
  }

  let maxId = 0
  for (const a of coreArticles) {
    const m = /^a(\d+)$/.exec(a.id)
    if (m) maxId = Math.max(maxId, parseInt(m[1], 10))
  }

  const extra = []
  for (const name of destinationNames) {
    const have = byDest[name] || 0
    const minForDest = minOverrides[name] ?? minPerDestination
    const need = Math.max(0, minForDest - have)
    for (let i = 0; i < need; i++) {
      maxId += 1
      extra.push(buildExtraArticle(name, maxId, have + i))
      byDest[name] = (byDest[name] || 0) + 1
    }
  }

  return [...coreArticles, ...extra]
}
