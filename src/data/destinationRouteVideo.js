/**
 * 路书视频：按目的地匹配有代表性的免版税素材（Pexels / Mixkit），避免全站同一支占位片。
 * 若攻略本身已配置有效 videoYoutubeId / videoMp4，则优先使用。
 */

import { destinations } from './mockData.js'

/** @typedef {{ videoYoutubeId: string, videoMp4: string }} ResolvedVideo */

const PLACEHOLDER_SUBSTR = 'flower.mp4'

/** 经本机 HEAD 校验可直连的 MP4（Mixkit / Pexels 许可见各站 License 页） */
const V = {
  thailand: 'https://videos.pexels.com/video-files/18529921/18529921-hd_1920_1080_30fps.mp4',
  malaysia: 'https://videos.pexels.com/video-files/12260195/12260195-hd_1920_1080_30fps.mp4',
  vietnam: 'https://videos.pexels.com/video-files/19135704/19135704-hd_1920_1080_25fps.mp4',
  japanDrone: 'https://videos.pexels.com/video-files/7082731/7082731-hd_1920_1080_30fps.mp4',
  japanTower: 'https://videos.pexels.com/video-files/4711694/4711694-hd_1920_1080_30fps.mp4',
  japanStreet: 'https://videos.pexels.com/video-files/3942468/3942468-hd_1920_1080_30fps.mp4',
  harbourNight: 'https://videos.pexels.com/video-files/5396816/5396816-hd_1920_1080_30fps.mp4',
  usa: 'https://videos.pexels.com/video-files/4970413/4970413-hd_1920_1080_30fps.mp4',
  mountain: 'https://videos.pexels.com/video-files/4763824/4763824-hd_1920_1080_24fps.mp4',
  ice: 'https://videos.pexels.com/video-files/3214448/3214448-hd_1920_1080_25fps.mp4',
  oceanWildlife: 'https://videos.pexels.com/video-files/1526909/1526909-hd_1920_1080_24fps.mp4',
  oceanSunrise: 'https://assets.mixkit.co/videos/1086/1086-720.mp4',
  parisStreet: 'https://assets.mixkit.co/videos/4348/4348-720.mp4',
  cityMorning: 'https://assets.mixkit.co/videos/4169/4169-720.mp4',
  waterfall: 'https://assets.mixkit.co/videos/2213/2213-720.mp4',
  highwayMountain: 'https://assets.mixkit.co/videos/4633/4633-720.mp4',
  palm: 'https://assets.mixkit.co/videos/4645/4645-720.mp4',
  wavesBeach: 'https://assets.mixkit.co/videos/5016/5016-720.mp4',
  whiteSandBeach: 'https://assets.mixkit.co/videos/1564/1564-720.mp4',
  beachAerial: 'https://assets.mixkit.co/videos/51500/51500-720.mp4',
  meadow: 'https://assets.mixkit.co/videos/4075/4075-720.mp4',
  curvedHighway: 'https://assets.mixkit.co/videos/41576/41576-720.mp4',
  desertSahara: 'https://assets.mixkit.co/videos/4149/4149-720.mp4',
  camelsDesert: 'https://assets.mixkit.co/videos/4285/4285-720.mp4',
  camelCaravan: 'https://assets.mixkit.co/videos/7320/7320-720.mp4',
  desertBaja: 'https://assets.mixkit.co/videos/4049/4049-720.mp4',
  desertPlateau: 'https://assets.mixkit.co/videos/2092/2092-720.mp4',
}

function hashString(s) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return Math.abs(h)
}

function pick(pool, name) {
  if (!pool.length) return V.wavesBeach
  return pool[hashString(name) % pool.length]
}

/** 与目的地强绑定的「名片级」画面 */
const EXACT = {
  泰国: V.thailand,
  越南: V.vietnam,
  柬埔寨: V.thailand,
  老挝: V.thailand,
  缅甸: V.vietnam,
  马来西亚: V.malaysia,
  新加坡: V.harbourNight,
  文莱: V.harbourNight,
  印度尼西亚: V.beachAerial,
  菲律宾: V.harbourNight,
  东帝汶: V.oceanSunrise,
  日本: V.japanDrone,
  韩国: V.japanStreet,
  蒙古: V.meadow,
  印度: V.cityMorning,
  尼泊尔: V.mountain,
  不丹: V.mountain,
  斯里兰卡: V.whiteSandBeach,
  马尔代夫: V.whiteSandBeach,
  孟加拉国: V.waterfall,
  巴基斯坦: V.mountain,
  美国: V.usa,
  加拿大: V.ice,
  墨西哥: V.desertBaja,
  古巴: V.palm,
  巴西: V.beachAerial,
  阿根廷: V.highwayMountain,
  智利: V.highwayMountain,
  秘鲁: V.mountain,
  哥伦比亚: V.palm,
  厄瓜多尔: V.mountain,
  玻利维亚: V.mountain,
  乌拉圭: V.wavesBeach,
  巴拉圭: V.meadow,
  委内瑞拉: V.palm,
  圭亚那: V.waterfall,
  苏里南: V.waterfall,
  法国: V.parisStreet,
  英国: V.cityMorning,
  德国: V.cityMorning,
  意大利: V.cityMorning,
  西班牙: V.palm,
  葡萄牙: V.wavesBeach,
  荷兰: V.cityMorning,
  比利时: V.cityMorning,
  瑞士: V.mountain,
  奥地利: V.mountain,
  捷克: V.cityMorning,
  匈牙利: V.cityMorning,
  波兰: V.cityMorning,
  希腊: V.wavesBeach,
  克罗地亚: V.wavesBeach,
  冰岛: V.ice,
  挪威: V.ice,
  瑞典: V.ice,
  芬兰: V.ice,
  丹麦: V.cityMorning,
  爱尔兰: V.waterfall,
  罗马尼亚: V.meadow,
  保加利亚: V.meadow,
  塞尔维亚: V.cityMorning,
  斯洛文尼亚: V.waterfall,
  斯洛伐克: V.waterfall,
  阿尔巴尼亚: V.wavesBeach,
  北马其顿: V.meadow,
  黑山: V.wavesBeach,
  立陶宛: V.meadow,
  拉脱维亚: V.waterfall,
  爱沙尼亚: V.waterfall,
  卢森堡: V.cityMorning,
  马耳他: V.wavesBeach,
  塞浦路斯: V.wavesBeach,
  土耳其: V.cityMorning,
  以色列: V.desertPlateau,
  约旦: V.camelCaravan,
  阿联酋: V.harbourNight,
  卡塔尔: V.harbourNight,
  科威特: V.desertSahara,
  阿曼: V.camelsDesert,
  伊朗: V.desertPlateau,
  黎巴嫩: V.wavesBeach,
  格鲁吉亚: V.mountain,
  亚美尼亚: V.mountain,
  阿塞拜疆: V.meadow,
  哈萨克斯坦: V.meadow,
  乌兹别克斯坦: V.desertSahara,
  吉尔吉斯斯坦: V.mountain,
  埃及: V.desertSahara,
  摩洛哥: V.camelsDesert,
  突尼斯: V.desertSahara,
  南非: V.oceanWildlife,
  肯尼亚: V.meadow,
  坦桑尼亚: V.meadow,
  纳米比亚: V.desertPlateau,
  博茨瓦纳: V.meadow,
  津巴布韦: V.waterfall,
  赞比亚: V.waterfall,
  乌干达: V.meadow,
  卢旺达: V.meadow,
  马拉维: V.meadow,
  莫桑比克: V.wavesBeach,
  马达加斯加: V.palm,
  埃塞俄比亚: V.meadow,
  厄立特里亚: V.desertSahara,
  加纳: V.palm,
  塞内加尔: V.wavesBeach,
  澳大利亚: V.oceanWildlife,
  新西兰: V.curvedHighway,
  斐济: V.whiteSandBeach,
  帕劳: V.beachAerial,
  瓦努阿图: V.oceanSunrise,
  汤加: V.oceanSunrise,
  萨摩亚: V.whiteSandBeach,
  巴布亚新几内亚: V.waterfall,
  所罗门群岛: V.oceanSunrise,
  南极洲: V.ice,
  哥斯达黎加: V.waterfall,
  巴拿马: V.wavesBeach,
  尼加拉瓜: V.palm,
  洪都拉斯: V.palm,
  危地马拉: V.waterfall,
  伯利兹: V.wavesBeach,
  多米尼加: V.palm,
  牙买加: V.palm,
  毛里求斯: V.whiteSandBeach,
  塞舌尔: V.beachAerial,
  留尼汪: V.mountain,
  卡塔尔: V.harbourNight,
}

const REGION_POOLS = {
  东南亚: [V.thailand, V.malaysia, V.vietnam, V.harbourNight, V.beachAerial, V.oceanSunrise],
  东亚: [V.japanDrone, V.japanStreet, V.japanTower, V.meadow],
  南亚: [V.mountain, V.whiteSandBeach, V.waterfall, V.cityMorning],
  中亚: [V.mountain, V.meadow, V.desertSahara],
  西亚: [V.harbourNight, V.desertSahara, V.camelsDesert, V.camelCaravan],
  高加索: [V.mountain, V.meadow, V.waterfall],
  西欧: [V.parisStreet, V.cityMorning, V.waterfall],
  中欧: [V.cityMorning, V.waterfall, V.mountain],
  东欧: [V.cityMorning, V.waterfall, V.meadow],
  北欧: [V.ice, V.waterfall, V.cityMorning],
  波罗的海: [V.waterfall, V.meadow, V.cityMorning],
  地中海: [V.wavesBeach, V.palm, V.parisStreet],
  /** mockData 中葡萄牙/西意希等使用的泛欧标签 */
  欧洲: [V.parisStreet, V.cityMorning, V.waterfall, V.palm, V.wavesBeach],
  北美: [V.usa, V.highwayMountain, V.desertBaja, V.ice],
  中美洲: [V.palm, V.wavesBeach, V.waterfall, V.desertBaja],
  加勒比: [V.palm, V.wavesBeach, V.whiteSandBeach],
  南美: [V.mountain, V.palm, V.beachAerial, V.highwayMountain],
  北非: [V.desertSahara, V.camelsDesert, V.camelCaravan],
  东非: [V.meadow, V.waterfall, V.oceanSunrise],
  东部非洲: [V.meadow, V.waterfall, V.oceanSunrise],
  西非: [V.palm, V.meadow, V.wavesBeach],
  南部非洲: [V.oceanWildlife, V.meadow, V.desertPlateau],
  东南非洲: [V.wavesBeach, V.palm, V.beachAerial],
  印度洋: [V.whiteSandBeach, V.beachAerial, V.oceanSunrise],
  太平洋: [V.oceanSunrise, V.whiteSandBeach, V.wavesBeach],
  大洋洲: [V.oceanWildlife, V.whiteSandBeach, V.curvedHighway],
  南极: [V.ice],
  非洲: [V.meadow, V.desertSahara, V.wavesBeach],
  欧洲: [V.parisStreet, V.cityMorning, V.waterfall, V.mountain],
  亚洲: [V.thailand, V.japanDrone, V.mountain, V.harbourNight],
}

const CONTINENT_POOLS = {
  亚洲: [V.thailand, V.vietnam, V.japanDrone, V.malaysia, V.mountain, V.harbourNight, V.desertSahara],
  欧洲: [V.parisStreet, V.cityMorning, V.waterfall, V.ice, V.meadow],
  北美: [V.usa, V.highwayMountain, V.desertBaja, V.palm],
  南美: [V.mountain, V.palm, V.beachAerial],
  非洲: [V.meadow, V.desertSahara, V.oceanWildlife, V.wavesBeach],
  大洋洲: [V.oceanWildlife, V.whiteSandBeach, V.oceanSunrise],
  南极洲: [V.ice],
}

/** 仅按目的地名解析视频（用于目的地详情页等无完整 article 的场景） */
export function resolveVideoForDestinationName(destinationName) {
  return resolveDestinationRouteVideo({
    destination: destinationName || '',
    videoYoutubeId: '',
    videoMp4: '',
  })
}

/**
 * @param {{ videoYoutubeId?: string, videoMp4?: string, destination?: string }} article
 * @returns {ResolvedVideo}
 */
export function resolveDestinationRouteVideo(article) {
  const yt = (article.videoYoutubeId || '').trim()
  if (yt) return { videoYoutubeId: yt, videoMp4: '' }

  const rawMp4 = (article.videoMp4 || '').trim()
  if (rawMp4 && !rawMp4.includes(PLACEHOLDER_SUBSTR)) {
    return { videoYoutubeId: '', videoMp4: rawMp4 }
  }

  const name = article.destination || ''
  if (EXACT[name]) {
    return { videoYoutubeId: '', videoMp4: EXACT[name] }
  }

  const meta = destinations.find((d) => d.name === name)
  const region = meta?.region
  if (region && REGION_POOLS[region]) {
    return { videoYoutubeId: '', videoMp4: pick(REGION_POOLS[region], name) }
  }

  const continent = meta?.continent || '亚洲'
  const pool = CONTINENT_POOLS[continent] || CONTINENT_POOLS['亚洲']
  return { videoYoutubeId: '', videoMp4: pick(pool, name) }
}
