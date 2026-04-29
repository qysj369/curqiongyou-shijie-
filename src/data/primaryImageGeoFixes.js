/**
 * 地理标志定向修正：覆盖 `destinationPrimaryImages` 主表中与国别/区域明显不符的条目。
 * 原则：禁止用明显属于其他大洲/典型他国地标的主图；相近区域仅作氛围示意时选用中性风光。
 * 后项与 articles/mockData 中的旧 URL 合并时以此为准。
 *
 * 自动排查主图复用：npm run analyze:primary-collisions
 * （跨大洲/子区域冲突列表；加 --json 输出机器可读）
 */

export const PRIMARY_IMAGE_GEO_FIXES = {
  // —— 北极/北欧/波罗的海：不得共用哥本哈根新港同一张 ——
  冰岛: 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=600',
  挪威: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
  瑞典: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600',
  芬兰: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600',
  丹麦: 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?w=600',
  /** 塔林老城屋顶/建筑群 */
  爱沙尼亚: 'https://images.unsplash.com/photo-1575561003164-f36f2e28a524?w=600',
  /** 里加老城钟楼与街景 */
  拉脱维亚: 'https://images.unsplash.com/photo-1685470934582-3636319a3be9?w=600',
  /** 维尔纽斯大教堂广场方向 */
  立陶宛: 'https://images.unsplash.com/photo-1667743350028-e0a17093d7e4?w=600',

  // —— 南亚：拆 photo-1524492479098（南亚泛用田园/山地占位）——
  /** 阿格拉泰姬陵 */
  印度: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600',
  /** 加德满都谷地寺庙/宫殿 */
  尼泊尔: 'https://images.unsplash.com/photo-1592285896110-8d88b5b3a5d8?w=600',
  /** 达卡河网与城区 */
  孟加拉国: 'https://images.unsplash.com/photo-1706640254398-3b04782e8c76?w=600',
  /** 宗堡/山地聚落 */
  不丹: 'https://images.unsplash.com/photo-1637825987997-6e6d117b81b1?w=600',
  /** 拉合尔古堡一带 */
  巴基斯坦: 'https://images.unsplash.com/photo-1622546758596-f1f06ba11f58?w=600',

  // —— 东南亚：泰国主图用泰式街景；拆柬埔寨/老挝/缅甸同 id ——
  /** 勿与非洲批次共用 photo-1508009603885（analyze:primary-collisions 跨洲复用） */
  泰国: 'https://images.unsplash.com/photo-1563495905-ba971552c9ab?w=600',
  /** 琅勃拉邦佛寺/街景 */
  老挝: 'https://images.unsplash.com/photo-1610426714962-83caa2244105?w=600',
  /** 吴哥窟 */
  柬埔寨: 'https://images.unsplash.com/photo-1566706546199-a93ba33ce9f7?w=600',
  /** 蒲甘塔林 */
  缅甸: 'https://images.unsplash.com/photo-1676439063812-13eda274e0ec?w=600',
  /** 双子塔与吉隆坡城景 */
  马来西亚: 'https://images.unsplash.com/photo-1472017053394-b29fded587cd?w=600',
  /** 斯里巴加湾市街景 */
  文莱: 'https://images.unsplash.com/photo-1709808972524-a4ad69939bb2?w=600',
  /** 首尔宫殿区城景 */
  韩国: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=600',

  // —— 中东 / 西亚 / 中亚：不用东南亚海滩图；与北非荒漠公路图区分 ——
  /** 1524231757912 实为中亚伊斯兰建筑群（撒马尔罕雷吉斯坦一带），仅保留给乌兹别克斯坦；其余西亚国改用本国强锚点 */
  /** 海湾：打散迪拜天际线泛用 id；阿联酋仍用滨海高层 */
  阿联酋: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=600',
  /** 萨那古城高层建筑群氛围 */
  也门: 'https://images.unsplash.com/photo-1656416584402-b720e0d786dc?w=600',
  /** 巴格达城区鸟瞰 */
  伊拉克: 'https://images.unsplash.com/photo-1608925086961-dbcd276a0e71?w=600',
  /** 大马士革城区地标建筑（巴拉达河沿岸一带街景） */
  叙利亚: 'https://images.unsplash.com/photo-1580310219243-dbad8c44e576?w=600',
  阿富汗: 'https://images.unsplash.com/photo-1675946785591-ce04cc9d9db3?w=600',
  /** 利雅得市中心高层城景 */
  沙特阿拉伯: 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?w=600',
  /** 伯利恒钟楼/老城方向 */
  巴勒斯坦: 'https://images.unsplash.com/photo-1691077038630-6affb7db1e7a?w=600',
  /** 科威特城滨海高层 */
  科威特: 'https://images.unsplash.com/photo-1558634742-56096b49522b?w=600',
  /** 多哈滨海城景 */
  卡塔尔: 'https://images.unsplash.com/photo-1539475314840-751cecc1dacd?w=600',
  /** 麦纳麦滨海与桥梁 */
  巴林: 'https://images.unsplash.com/photo-1588172739763-08df442057f9?w=600',
  /** 马斯喀特滨海/清真寺方向 */
  阿曼: 'https://images.unsplash.com/photo-1606813332135-228593b6e201?w=600',
  /** 佩特拉卡兹尼神殿一带 */
  约旦: 'https://images.unsplash.com/photo-1712323028707-6e59c3d2271a?w=600',
  /** 贝鲁特城区/滨海 */
  黎巴嫩: 'https://images.unsplash.com/photo-1716932815898-2fedc060d092?w=600',
  /** 耶路撒冷老城街巷 */
  以色列: 'https://images.unsplash.com/photo-1636349474056-97a28738944d?w=600',
  /** 伊斯法罕清真寺穹顶/内饰（波斯建筑） */
  伊朗: 'https://images.unsplash.com/photo-1635800063077-ca924ec7fe58?w=600',
  /** 阿什哈巴德机场/新城区（白色建筑群氛围） */
  土库曼斯坦: 'https://images.unsplash.com/photo-1764505878518-00e3ed563d6f?w=600',
  哈萨克斯坦: 'https://images.unsplash.com/photo-1717486489848-5c79b4d45879?w=600',
  塔吉克斯坦: 'https://images.unsplash.com/photo-1726547507141-524321eb781f?w=600',
  吉尔吉斯斯坦: 'https://images.unsplash.com/photo-1689788648053-cd482d1acd9c?w=600',
  // 土耳其：卡帕岩质地貌（链可访问）；勿用失效 152783… / Galata 类塔楼泛用图
  土耳其: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=600',
  // 意大利：罗马地标（与旧「威尼斯塔楼」泛用图区分）
  意大利: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=600',

  // —— 西欧 / 西北欧：拆低地三国、瑞列圣、德英爱等同 id ——
  /** 柏林国会大厦一带 */
  德国: 'https://images.unsplash.com/photo-1618259278412-2819cbdea4dc?w=600',
  /** 伦敦威斯敏斯特与大本钟方向 */
  英国: 'https://images.unsplash.com/photo-1486299267070-83823f5448dd?w=600',
  /** 都柏林街巷与教堂方向 */
  爱尔兰: 'https://images.unsplash.com/photo-1549918864-48ac978761a4?w=600',
  /** 布鲁塞尔原子球塔一带 */
  比利时: 'https://images.unsplash.com/photo-1573995890753-a4f23342db17?w=600',
  /** 阿姆斯特丹运河屋 */
  荷兰: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=600',
  /** 卢森堡峡谷老城鸟瞰 */
  卢森堡: 'https://images.unsplash.com/photo-1588336899284-950764f07147?w=600',
  /** 苏黎世老城与利马特河 */
  瑞士: 'https://images.unsplash.com/photo-1573137785546-9d19e4f33f87?w=600',
  /** 里斯本黄色电车与山坡城区 */
  葡萄牙: 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=600',

  // —— 北非 / 马格里布：与撒哈拉以南稀树草原图区分；各国独立 photo-id ——
  埃及: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=600',
  摩洛哥: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600',
  /** 阿尔及尔/卡斯巴丘陵氛围 */
  阿尔及利亚: 'https://images.unsplash.com/photo-1591808274629-fafffe21c310?w=600',
  /** 苏塞/地中海滨海城镇方向 */
  突尼斯: 'https://images.unsplash.com/photo-1712520151096-5f2fc1f735eb?w=600',
  /** 的黎波里滨海与城区 */
  利比亚: 'https://images.unsplash.com/photo-1588889802078-67ce0634a6a3?w=600',

  // —— 东非 Safari：肯尼亚 / 坦桑尼亚 拆分同一稀树草原泛用 id ——
  /** 马赛马拉热气球与兽群 */
  肯尼亚: 'https://images.unsplash.com/photo-1519659528534-7fd733a832a0?w=600',
  /** 塞伦盖蒂兽群与金合欢稀树草原 */
  坦桑尼亚: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600',

  // —— 南部非洲：主表曾共用 158006… 稀树草原占位；拆为各国锚点 ——
  /** 开普敦桌山方向 */
  南非: 'https://images.unsplash.com/photo-1708747956368-7583058615a0?w=600',
  /** 奥卡万戈三角洲水道 */
  博茨瓦纳: 'https://images.unsplash.com/photo-1531208853003-c1ec1b8a81d7?w=600',
  /** 维多利亚瀑布 */
  津巴布韦: 'https://images.unsplash.com/photo-1627347456206-d3df7d8484b0?w=600',
  /** 利文斯敦一侧维多利亚瀑布（赞比亚） */
  赞比亚: 'https://images.unsplash.com/photo-1666732566977-8805c13a6ce2?w=600',
  /** 马拉维湖湖滨 */
  马拉维: 'https://images.unsplash.com/photo-1744758039418-474a11a75bb3?w=600',

  // —— 东欧 / 中欧：巴尔干「古城」单 id（1559827260）堆叠过高；拆为地中海港、南欧、中欧街景、山地等 ——
  /** 布拉格伏尔塔瓦河沿岸老城方向 */
  捷克: 'https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=600',
  /** 华沙老城广场一带 */
  波兰: 'https://images.unsplash.com/photo-1573157268794-d13e94d325e6?w=600',
  /** 布拉迪斯拉发圣马丁大教堂一带 */
  斯洛伐克: 'https://images.unsplash.com/photo-1568567259979-a39016d968c7?w=600',
  /** 匈牙利国会大厦与多瑙河沿岸 */
  匈牙利: 'https://images.unsplash.com/photo-1622115469132-124ec9f88fca?w=600',
  /** 布加勒斯特老城街景 */
  罗马尼亚: 'https://images.unsplash.com/photo-1559308573-0abf29faa17d?w=600',
  /** 索菲亚亚历山大·涅夫斯基大教堂一带 */
  保加利亚: 'https://images.unsplash.com/photo-1519429753079-3b0f0a95dea8?w=600',
  /** 杜布罗夫尼克亚得里亚海古城墙 */
  克罗地亚: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600',
  /** 卢布尔雅那三重桥与老城 */
  斯洛文尼亚: 'https://images.unsplash.com/photo-1602619025915-073b0594d662?w=600',
  /** 贝尔格莱德要塞与萨瓦河 */
  塞尔维亚: 'https://images.unsplash.com/photo-1632343084107-353ad9e95e37?w=600',
  /** 莫斯塔尔古桥与内雷特瓦河沿岸 */
  波黑: 'https://images.unsplash.com/photo-1698784849354-c51de4bf731a?w=600',
  /** 科托尔湾与老城 */
  黑山: 'https://images.unsplash.com/photo-1614122027743-50a9e6e8002f?w=600',
  /** 地拉那广场与钟楼 */
  阿尔巴尼亚: 'https://images.unsplash.com/photo-1632353913765-9b56b7b4bd55?w=600',
  /** 奥赫里德湖与教堂山 */
  北马其顿: 'https://images.unsplash.com/photo-1653389167152-7dbd6d165631?w=600',
  /** 基希讷乌钟楼一带 */
  摩尔多瓦: 'https://images.unsplash.com/photo-1690229274545-f2892d180957?w=600',
  /** 基辅独立广场方向城景 */
  乌克兰: 'https://images.unsplash.com/photo-1639341267320-2d062b250c0d?w=600',
  /** 明斯克独立大街/市中心建筑群鸟瞰 */
  白俄罗斯: 'https://images.unsplash.com/photo-1597986762540-76be10541f58?w=600',

  // —— 高加索 ——
  /** 亚拉腊方向山地与城区（高加索修道院/城区氛围） */
  亚美尼亚: 'https://images.unsplash.com/photo-1582798144276-d6c2e81b3025?w=600',
  /** 巴库滨海天际线 */
  阿塞拜疆: 'https://images.unsplash.com/photo-1596306499398-8d88944a5ec4?w=600',
  格鲁吉亚: 'https://images.unsplash.com/photo-1603350576276-24747f7bbf40?w=600',

  // —— 地中海岛国（欧洲）：不用热带沙滩图 ——
  /** 瓦莱塔港与上巴拉卡花园方向 */
  马耳他: 'https://images.unsplash.com/photo-1522307617379-e982f8754d27?w=600',
  /** 利马索尔滨海与老城方向 */
  塞浦路斯: 'https://images.unsplash.com/photo-1655829795205-ca8b326ad4b1?w=600',

  // —— 朝鲜：平壤城区（与韩国首尔主图区分）——
  朝鲜: 'https://images.unsplash.com/photo-1604359896927-0610b7a3a2be?w=600',
  /** 多伦多金小时鸟瞰（与纽约主图区分） */
  加拿大: 'https://images.unsplash.com/photo-1517935706615-2717063c2225?w=600',
  /** 纽约克莱斯勒大厦方向城景 */
  美国: 'https://images.unsplash.com/photo-1570304816841-906a17d7b067?w=600',
  /** 冰川与浮冰区氛围 */
  南极洲: 'https://images.unsplash.com/photo-1551415923-31d2072bc248?w=600',
  // 草原/乌兰巴托近郊（勿用长城泛用 id；京畿长城主图仅用于「中国」+ 北京相关标题）
  蒙古: 'https://images.unsplash.com/photo-1695554534096-71698cd028fc?w=600',

  // —— 印尼：主图用群岛/海岸，不用欧洲街景 ——
  印度尼西亚: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600',
  /** 马尼拉都会带城景 */
  菲律宾: 'https://images.unsplash.com/photo-1607282729548-e1d13feae36f?w=600',

  // —— 大洋洲岛国：太平洋海岸/环礁，不用与非洲/欧洲共用的沙滩主图 ——
  /** 悉尼歌剧院与港湾 */
  澳大利亚: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=600',
  /** 奥克兰天空塔方向 */
  新西兰: 'https://images.unsplash.com/photo-1576828324911-1e301982b17f?w=600',
  /** 斐济外岛沙滩与潟湖 */
  斐济: 'https://images.unsplash.com/photo-1655719647300-5142977bfa79?w=600',
  /** 维拉港一带海岸与植被 */
  瓦努阿图: 'https://images.unsplash.com/photo-1602587557684-11163fe60c87?w=600',
  /** 阿皮亚滨海 */
  萨摩亚: 'https://images.unsplash.com/photo-1714459832262-6193eb524aaa?w=600',
  /** 汤加外岛海岸 */
  汤加: 'https://images.unsplash.com/photo-1549889577-cda81b471223?w=600',
  /** 瑙鲁海岸聚落鸟瞰 */
  瑙鲁: 'https://images.unsplash.com/photo-1546720150-63c3b6475ac6?w=600',
  /** 太平洋环礁潟湖（基里巴斯氛围） */
  基里巴斯: 'https://images.unsplash.com/photo-1712960257446-1f6844e79e2b?w=600',
  /** 富纳富提一带草屋与步道 */
  图瓦卢: 'https://images.unsplash.com/photo-1733714090606-5783cfa670ce?w=600',
  /** 科罗尔湾与岩岛方向 */
  帕劳: 'https://images.unsplash.com/photo-1690649416378-1335211d5864?w=600',
  /** 马朱罗湖岸日落氛围 */
  马绍尔群岛: 'https://images.unsplash.com/photo-1512615228-78951ef305f9?w=600',
  /** 丘克潟湖潜水点方向 */
  密克罗尼西亚联邦: 'https://images.unsplash.com/photo-1545604131-038faea747d5?w=600',
  /** 拉罗汤加棕榈海滩 */
  库克群岛: 'https://images.unsplash.com/photo-1588782461976-eb6b1c500446?w=600',
  /** 纽埃海岸人文（太平洋岛国） */
  纽埃: 'https://images.unsplash.com/photo-1548966067-cee0f5e4cc0e?w=600',
  /** 热带岛屿与海岸丛林 */
  巴布亚新几内亚: 'https://images.unsplash.com/photo-1615608178738-37d47d27c13d?w=600',
  /** 霍尼亚拉一带滨海 */
  所罗门群岛: 'https://images.unsplash.com/photo-1641789107384-67a204447ecd?w=600',
  /** 帝力/东帝汶海岸丘陵聚落 */
  东帝汶: 'https://images.unsplash.com/photo-1707445305630-5962c1e9e1e9?w=600',

  // —— 加勒比：仅用美洲素材池，避免与非洲/大洋洲共用同一 photo-id ——
  /** 拿骚滨海度假区与邮轮港 */
  巴哈马: 'https://images.unsplash.com/photo-1641139404177-bd806ce296bc?w=600',
  /** 布里奇顿海岸与棕榈 */
  巴巴多斯: 'https://images.unsplash.com/photo-1655993084234-16b5ee45d8c3?w=600',
  /** 蒙特哥贝海滩 */
  牙买加: 'https://images.unsplash.com/photo-1530225029356-e301a685e6b1?w=600',
  /** 西班牙港一带滨海鸟瞰 */
  特立尼达和多巴哥: 'https://images.unsplash.com/photo-1602066556450-62f988867a31?w=600',
  /** 安提瓜海岸草地与海湾 */
  安提瓜和巴布达: 'https://images.unsplash.com/photo-1582300857444-5ddd87c86797?w=600',
  /** 罗索邮轮港与海湾 */
  多米尼克: 'https://images.unsplash.com/photo-1649703196751-9019ead6b2f4?w=600',
  /** 圣乔治斯海岸暮色 */
  格林纳达: 'https://images.unsplash.com/photo-1748798634007-2b05cf208b32?w=600',
  /** 卡斯特里河港与城区 */
  圣卢西亚: 'https://images.unsplash.com/photo-1738079003703-c452210314f5?w=600',
  /** 圣基茨海岸与小岛鸟瞰 */
  圣基茨和尼维斯: 'https://images.unsplash.com/photo-1643148610662-bcb78a841790?w=600',
  /** 金斯敦山城与海湾 */
  圣文森特和格林纳丁斯: 'https://images.unsplash.com/photo-1721072153564-e5f22b3087f6?w=600',

  // —— 中美 / 墨西哥以北：与加勒比海滨图区分 ——
  /** 特奥蒂瓦坎金字塔与谷地 */
  墨西哥: 'https://images.unsplash.com/photo-1630646188133-c1db51adad97?w=600',
  /** 阿雷纳尔火山与雨林 */
  哥斯达黎加: 'https://images.unsplash.com/photo-1707074111761-3f1db359269e?w=600',
  /** 伯利兹堡礁潜水视角 */
  伯利兹: 'https://images.unsplash.com/photo-1691684803507-2b1bf8ac695c?w=600',
  /** 危地马拉城谷地城景 */
  危地马拉: 'https://images.unsplash.com/photo-1713063297072-051cb0e1f7f7?w=600',
  /** 特古西加尔巴城区鸟瞰 */
  洪都拉斯: 'https://images.unsplash.com/photo-1610687400070-4a694087f990?w=600',
  /** 圣萨尔瓦多谷地城景 */
  萨尔瓦多: 'https://images.unsplash.com/photo-1690384451505-2aef8ae1b0ef?w=600',
  /** 格拉纳达白教堂与湖滨 */
  尼加拉瓜: 'https://images.unsplash.com/photo-1624256852056-f48987387a3c?w=600',
  /** 巴拿马城滨海天际线 */
  巴拿马: 'https://images.unsplash.com/photo-1598041543955-0d88c390f3b5?w=600',
  /** 哈瓦那老城石板街 */
  古巴: 'https://images.unsplash.com/photo-1748646846416-39b01694700d?w=600',
  /** 圣多明各殖民建筑街区 */
  多米尼加: 'https://images.unsplash.com/photo-1588638260859-cf09d71423d8?w=600',
  /** 拉巴迪/海地北部海岸鸟瞰 */
  海地: 'https://images.unsplash.com/photo-1602027333786-373a1b858831?w=600',

  // —— 南美安第斯与加勒比海滨区分 ——
  /** 里约基督像 */
  巴西: 'https://images.unsplash.com/photo-1518639192441-8fce0a366e2e?w=600',
  /** 拉巴斯高原与山地 */
  玻利维亚: 'https://images.unsplash.com/photo-1596118769843-08e9ad381ab0?w=600',
  /** 基多老城与火山背景 */
  厄瓜多尔: 'https://images.unsplash.com/photo-1566352081904-cfa7024f5d6a?w=600',
  /** 乔治敦海岸剪影 */
  圭亚那: 'https://images.unsplash.com/photo-1564858523844-73ee8233a3a2?w=600',
  /** 苏里南海岸与旗帜（加勒比南美氛围） */
  苏里南: 'https://images.unsplash.com/photo-1663699786656-10ec59717b3a?w=600',
  /** 加拉加斯山谷城景 */
  委内瑞拉: 'https://images.unsplash.com/photo-1714594923299-e915b7d71701?w=600',
  /** 卡塔赫纳老城彩色街巷 */
  哥伦比亚: 'https://images.unsplash.com/photo-1534943441045-1009d7cb0bb9?w=600',
  /** 布宜诺斯艾利斯方尖碑与七月九日大道方向 */
  阿根廷: 'https://images.unsplash.com/photo-1676036633197-d37b327e25ca?w=600',
  /** 亚松森滨河一带 */
  巴拉圭: 'https://images.unsplash.com/photo-1708007736300-89c16fa57b40?w=600',
  /** 蒙得维的亚滨海城景 */
  乌拉圭: 'https://images.unsplash.com/photo-1676164539863-612beb931dfb?w=600',
  /** 利马海滨与岛城氛围 */
  秘鲁: 'https://images.unsplash.com/photo-1577587230708-187fdbef4d91?w=600',
  /** 瓦尔帕莱索/圣地亚哥方向安第斯与城景 */
  智利: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600',

  // —— 非洲岛国 ——
  /** 普拉亚滨海 */
  佛得角: 'https://images.unsplash.com/photo-1672856181212-b5b5a0065a08?w=600',
  /** 港口独桅帆船 */
  科摩罗: 'https://images.unsplash.com/photo-1581412218131-a2b5634c074d?w=600',
  /** 拉迪格/外岛海岸 */
  塞舌尔: 'https://images.unsplash.com/photo-1706088773588-98152aabeb81?w=600',
  /** 毛里求斯海岸与泻湖 */
  毛里求斯: 'https://images.unsplash.com/photo-1513415277900-a62401e19be4?w=600',
  /** 猴面包树林/西海岸 */
  马达加斯加: 'https://images.unsplash.com/photo-1564198729838-cb82ee0c733c?w=600',
  /** 海岸伊尼扬巴内一带 */
  莫桑比克: 'https://images.unsplash.com/photo-1694124087978-de0233d0ead7?w=600',

  // —— 法属留尼汪：印度洋/东非岛链氛围，不用太平洋环礁主图 ——
  /** 火山与冰斗 */
  留尼汪: 'https://images.unsplash.com/photo-1605477162496-e696844a64a3?w=600',

  // —— 东非高原与湖区 ——
  /** 拉利贝拉岩石教堂 */
  埃塞俄比亚: 'https://images.unsplash.com/photo-1518079562269-53db1e4433b8?w=600',
  /** 坎帕拉丘陵聚落 */
  乌干达: 'https://images.unsplash.com/photo-1614852897475-6533db8f3564?w=600',

  // —— 撒哈拉以南 / 萨赫勒 / 西非：各国独立 photo-id ——
  /** 热带雨林河谷 */
  中非: 'https://images.unsplash.com/photo-1704796404511-79709bbe25c6?w=600',
  /** 恩贾梅纳/萨赫勒人文 */
  乍得: 'https://images.unsplash.com/photo-1658677326586-994687c3accc?w=600',
  /** 班珠尔滨海 */
  冈比亚: 'https://images.unsplash.com/photo-1621862681356-6eda413727d27?w=600',
  /** 科纳克里一带街景 */
  几内亚: 'https://images.unsplash.com/photo-1621862681383-11bfff7588e7?w=600',
  // 几内亚湾沿岸示意，勿与北非 medina 混用
  几内亚比绍: 'https://images.unsplash.com/photo-1506929562872-b94aa2565b4b?w=600',
  /** 布拉柴维尔与刚果河 */
  '刚果（布）': 'https://images.unsplash.com/photo-1633960719106-894ffd8b34d2?w=600',
  /** 维龙加旗帜与山地氛围 */
  '刚果（金）': 'https://images.unsplash.com/photo-1692019007460-f1d8ebff108b?w=600',
  /** 蒙罗维亚河港鸟瞰 */
  利比里亚: 'https://images.unsplash.com/photo-1704230093731-8dad84d386a9?w=600',
  /** 海岸角城堡一带 */
  加纳: 'https://images.unsplash.com/photo-1635188271987-377c330444de?w=600',
  /** 利伯维尔滨海棕榈 */
  加蓬: 'https://images.unsplash.com/photo-1594612622464-ab6f730893f6?w=600',
  /** 朱巴人文街景 */
  南苏丹: 'https://images.unsplash.com/photo-1698226789841-19fb26e309eb?w=600',
  /** 基加利丘陵城景 */
  卢旺达: 'https://images.unsplash.com/photo-1687986261123-b17f08f2796c?w=600',
  /** 阿斯马拉高原建筑 */
  厄立特里亚: 'https://images.unsplash.com/photo-1712061377070-2800c603c402?w=600',
  /** 吉布提港城与海湾 */
  吉布提: 'https://images.unsplash.com/photo-1636783186055-69fc2fdbed53?w=600',
  /** 喀麦隆山地聚落 */
  喀麦隆: 'https://images.unsplash.com/photo-1594386479412-fa62932f4cdc?w=600',
  // 大西洋岛链，与摩洛哥 ksar 区分
  圣多美和普林西比: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600',
  /** 达喀尔港湾渔船 */
  塞内加尔: 'https://images.unsplash.com/photo-1648504735627-6af97e8337a9?w=600',
  /** 弗里敦海岸 */
  塞拉利昂: 'https://images.unsplash.com/photo-1632638920424-0033d03a73f6?w=600',
  /** 洛美棕榈城景 */
  多哥: 'https://images.unsplash.com/photo-1734868198180-645349d586f4?w=600',
  /** 罗安达滨海高层 */
  安哥拉: 'https://images.unsplash.com/photo-1676379631346-6688e1408dcf?w=600',
  /** 拉各斯都会鸟瞰 */
  尼日利亚: 'https://images.unsplash.com/photo-1618828665011-0abd973f7bb8?w=600',
  /** 尼亚美城郊与道路 */
  尼日尔: 'https://images.unsplash.com/photo-1669749713424-e7a0dbf605e6?w=600',
  /** 瓦加杜古集市与建筑 */
  布基纳法索: 'https://images.unsplash.com/photo-1718613959712-67dfdcaac833?w=600',
  /** 布琼布拉湖区丘陵 */
  布隆迪: 'https://images.unsplash.com/photo-1739730975779-de868b161717?w=600',
  /** 埃斯瓦蒂尼山地草坡 */
  斯威士兰: 'https://images.unsplash.com/photo-1746189894665-8013666464d9?w=600',
  /** 努瓦克肖特滨海 */
  毛里塔尼亚: 'https://images.unsplash.com/photo-1722224995293-ef11d9826314?w=600',
  /** 阿比让泻湖与城区 */
  科特迪瓦: 'https://images.unsplash.com/photo-1648770664367-54d43741edf1?w=600',
  /** 摩加迪沙海岸 */
  索马里: 'https://images.unsplash.com/photo-1723151684036-d014403c33b2?w=600',
  /** 纳米布红沙漠与枯树 */
  纳米比亚: 'https://images.unsplash.com/photo-1587321174565-73cffc72e10a?w=600',
  // 萨赫勒干旱河岸/尼罗河沿线氛围；与东非兽群稀树草原（1516026672322）及埃及金字塔区分
  苏丹: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=600',
  /** 莱索托高山草甸 */
  莱索托: 'https://images.unsplash.com/photo-1653842045754-59b63ea5a58e?w=600',
  /** 科托努一带城区鸟瞰 */
  贝宁: 'https://images.unsplash.com/photo-1600241005059-71de13374958?w=600',
  /** 马拉博滨海鸟瞰 */
  赤道几内亚: 'https://images.unsplash.com/photo-1557500629-29c45898e875?w=600',
  /** 巴马科尼日尔河畔街景 */
  马里: 'https://images.unsplash.com/photo-1711117078140-050947b67439?w=600',

  // —— 梵蒂冈 / 安道尔 / 圣马力诺 / 摩纳哥：地中海/山城；与巴尔干泛用 1559827260 区分 ——
  /** 圣彼得大教堂穹顶与罗马城景方向（与意大利斗兽场主图区分） */
  梵蒂冈: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600',
  /** 安道尔城山谷城景 */
  安道尔: 'https://images.unsplash.com/photo-1611917436955-d21c1999520c?w=600',
  /** 蒂塔诺山城鸟瞰 */
  圣马力诺: 'https://images.unsplash.com/photo-1708276504555-c915a716571b?w=600',
  /** 蒙特卡洛港湾游艇码头 */
  摩纳哥: 'https://images.unsplash.com/photo-1631173383816-4dcb24950a19?w=600',
  /** 瓦杜兹城堡山方向 */
  列支敦士登: 'https://images.unsplash.com/photo-1658924005376-c2eea09c0f44?w=600',
}
