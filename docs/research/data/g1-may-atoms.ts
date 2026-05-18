/**
 * DERIVED DATA: hand-ported from docs/research/path-explorer-sample-g1-may.md.
 *
 * That Markdown file is the content basis/source of truth for prose and curation.
 * Do not edit prose here directly; edit the MD, then re-port this projection.
 * The atomic + curated-view model is defined in the MD's model section.
 */

export const PATH_ATOM_STAGE_SLUG = "g1-to-g3-foundation";

export const PATH_SCHEDULE_KINDS = ["ALWAYS_ON", "WINDOW"] as const;
export const PATH_WINDOW_TYPES = [
  "SOLAR_TERM",
  "HOLIDAY",
  "SEASON_WINDOW",
] as const;
export const PATH_CADENCE_ROLES = [
  "ONE_SHOT",
  "LIGHT_RECURRING",
  "ANNUAL_RITUAL",
] as const;
export const PATH_SETTINGS = ["OUTDOOR", "INDOOR", "EITHER"] as const;
export const PATH_INTEREST_TAGS = [
  "nature",
  "culture",
  "craft",
  "foundation",
  "birding",
  "flower",
] as const;

export type PathScheduleKind = (typeof PATH_SCHEDULE_KINDS)[number];
export type PathWindowType = (typeof PATH_WINDOW_TYPES)[number];
export type PathCadenceRole = (typeof PATH_CADENCE_ROLES)[number];
export type PathSetting = (typeof PATH_SETTINGS)[number];
export type PathInterestTag = (typeof PATH_INTEREST_TAGS)[number];

export interface PathAtomSeedRow {
  slug: string;
  title: string;
  body: string;
  gradeFrom: number;
  gradeTo: number;
  interests: readonly PathInterestTag[];
  scheduleKind: PathScheduleKind;
  windowType: PathWindowType | null;
  cadenceRole: PathCadenceRole;
  frictionLevel: number;
  setting: PathSetting;
  displayOrder: number;
}

export interface PathCuratedViewSeedRow {
  slug: string;
  title: string;
  month: number;
  leadLine: string | null;
  whySpecial: string;
  heart: string;
  output: string | null;
  serendipity: string | null;
  proseBlocks: readonly PathCuratedViewProseBlockSeedRow[];
  defaultTightRatio: 50;
  frictionCeilingDefault: 3;
  displayOrder: number;
}

export interface PathCuratedViewProseBlockSeedRow {
  key: string;
  label: string;
  value: string;
}

export interface PathCuratedViewAtomSeedRow {
  viewSlug: string;
  atomSlug: string;
}

export interface G1MayAtomSeed {
  stageSlug: typeof PATH_ATOM_STAGE_SLUG;
  slugPrefix: "g1-may-";
  atoms: PathAtomSeedRow[];
  curatedViews: PathCuratedViewSeedRow[];
  viewAtomLinks: PathCuratedViewAtomSeedRow[];
}

const NATURE_INTEREST = ["nature"] as const;
const FOUNDATION_INTEREST = ["foundation"] as const;
const NATURE_CULTURE_INTEREST = ["nature", "culture"] as const;
const CULTURE_INTEREST = ["culture"] as const;
const NATURE_CRAFT_INTEREST = ["nature", "craft"] as const;
const NATURE_BIRDING_INTEREST = ["nature", "birding"] as const;
const NATURE_FLOWER_INTEREST = ["nature", "flower"] as const;

const DONGTAN_MAIN_BODY =
  "5/10 前看最后一批迁徙候鸟。现场不求 5 种全看到，能认出 1-2 种就是这一次的收获。";

const DONGTAN_PREP_GUIDE = `**可能看到的候鸟（春末 5 月上中旬典型 5 种）**：

| 中文名 | 辨识特征 | 难度 |
|---|---|---|
| 反嘴鹬 | 黑白相间，嘴长且向上翘，像"反"过来的针 | 易（特征最明显）|
| 黑翅长脚鹬 | 背黑、腹白、粉红色腿超长，远看像踩高跷 | 易 |
| 金眶鸻 | 小型鸻鹬，眼周金黄色环。G1 可能看不清细节，但"小圆身" 好认 | 中 |
| 黑腹滨鹬 | 繁殖羽时腹部明显黑色斑，群体活动 | 中 |
| 红嘴鸥 | 红色嘴、灰白身。常见种，5 月仍在尾声群 | 易（最普及）|

不求 5 种全看到，能认出 1-2 种就是这一次的收获。`;

const DONGTAN_HOW_TO = `1. **周一查**：[上海观鸟会 shwbs.org](http://www.shwbs.org) 公众号，看 5/1-15 有没有家庭公开带队活动。
2. **有带队跟团**：带望远镜（没有也行，用手机最大变焦）+ 防晒 + 防蚊喷雾 + 水 + 零食。带队会讲解。
3. **无带队自行去**：崇明东滩南六公路入口，[dongtan.cn](https://www.dongtan.cn) 查当日开放时间。
4. **现场**：**不求看到多少种**。能认出上面表里任意 1-2 种 + 看到一次"一群飞起"或"一次进食"，就已经值了。G1 注意力有限，30-60 分钟静观察就够。
5. **拍摄指引**：现场拍 5-10 张照片 + 2-3 段 15 秒视频足够。回家不留全部——**家长 5 分钟挑出 1-2 张有鸟 + 1 段群体活动**的最好素材，放到一个命名文件夹（比如 \`2026-05-10 东滩\`）。其他删掉。长期下来这些素材就是 portfolio 的 raw material。
6. **回家本子**：记 1-2 种观察到的鸟 + 日期 + 天气 + 简单印象句。文件夹里挑的那 1-2 张照片可以打印出来贴在本子旁边。`;

const DONGTAN_BACKUP_PLAN = `G1 去东滩 carry 一定挫败风险（远 + 天气依赖 + 鸟靠运气）。预先和孩子说好 "如果今天运气不好看不到鸟，我们 plan B"，挫败感就降一半。

- **就近 backup（东滩同日）**：崇明岛内 [东平国家森林公园](http://www.dpforest.com)，G1 适合的小规模自然探索 + 岛上农家菜收尾。
- **回程 backup**：[辰山植物园](http://www.csnbgsh.cn)（松江，5 月花季高峰，月季 / 鸢尾 / 栀子花同开，适合 G1 的视觉冲击强度）。
- **完全不去崇明 backup**（出门前天气预报糟糕直接放弃）：
  - [世纪公园](http://www.centurypark.com.cn)（浦东，市区观鸟常见地，能看到白鹭 / 夜鹭 / 翠鸟）
  - [佘山国家森林公园](http://www.shfestival.com/sheshan)（松江，5 月林下植物 + 昆虫多）`;

const DONGTAN_BACKUP_HEART =
  '提前准备 2-3 个"退一步也 OK"的替代方案，家长才敢带孩子出门。一次成功记忆 × 几次"退一步也 OK"记忆 = 她长期对"自然探索"不抗拒。这个基线比"每次都看到鸟"更重要。';

const DONGPING_BACKUP_BODY =
  "**就近 backup（东滩同日）**：崇明岛内 [东平国家森林公园](http://www.dpforest.com)，G1 适合的小规模自然探索 + 岛上农家菜收尾。";

const CHENSHAN_BACKUP_BODY =
  "**回程 backup**：[辰山植物园](http://www.csnbgsh.cn)（松江，5 月花季高峰，月季 / 鸢尾 / 栀子花同开，适合 G1 的视觉冲击强度）。";

const CENTURY_PARK_BACKUP_BODY =
  "**完全不去崇明 backup**（出门前天气预报糟糕直接放弃）：\n\n- [世纪公园](http://www.centurypark.com.cn)（浦东，市区观鸟常见地，能看到白鹭 / 夜鹭 / 翠鸟）";

const SHESHAN_BACKUP_BODY =
  "**完全不去崇明 backup**（出门前天气预报糟糕直接放弃）：\n\n- [佘山国家森林公园](http://www.shfestival.com/sheshan)（松江，5 月林下植物 + 昆虫多）";

const NEIGHBORHOOD_SPECIES_GUIDE = `**5 种家门口可见的初夏生物**（带辨识特征）：

| 物种 | 家门口哪看 | 怎么让 G1 记住 |
|---|---|---|
| 菜粉蝶（白蝴蝶） | 小区花坛，任何开花植物 | "白色小蝴蝶"—— 她第一个认识的蝴蝶 |
| 玉带凤蝶（大黑黄蝴蝶） | 公园里，飞得高 | "大蝴蝶"—— 比菜粉蝶大 3 倍，她一眼能感觉出"不一样" |
| 家蚁 / 黑蚁 | 任何人行道砖缝 | 带她看 **蚁道**（一队蚂蚁搬东西的路线）—— 社会性昆虫第一印象 |
| 西瓜虫（潮虫） | 花盆底 / 落叶下 / 石头下 | "会缩成球的小灰虫"—— G1 最爱的触碰互动 |
| 树麻雀（家麻雀） | 家楼下、街角、任何树上 | 最熟悉的鸟。重点是让她意识到"这也是鸟"—— 不是只有东滩才有鸟 |`;

const NEIGHBORHOOD_HOW_TO = `1. **蚁道观察**（15 分钟）：选一段有蚂蚁活动的人行道砖缝，和她一起蹲下来看 **5 分钟**。看蚂蚁从哪到哪、搬什么、怎么遇到同伴。回来本子画一条蚁道。
2. **蝴蝶追踪**（20 分钟）：小区花坛边等 5 分钟，通常会有 1-2 种蝴蝶来。不追蝶（小孩跑得慢），只看它停下来的那几秒。
3. **潮虫探险**（10 分钟）：搬开花盆 / 石头 / 落叶堆，看底下的西瓜虫 / 蚯蚓 / 各种小东西。**用手轻轻碰一下西瓜虫**，看它蜷成球。G1 对这种即时 feedback 最有感。
4. **楼下鸟声**（5 分钟）：阳台静坐，听不同的鸟叫。麻雀的"喳喳" / 斑鸠的"咕咕" / 白头鹎清晨的歌声。她能分出 2 种就够。`;

const NEIGHBORHOOD_SOURCES = `- [图鉴] 《身边的昆虫》（科普出版社）/ 《中国鸟类野外手册》（湖南教育出版社，G2-G3 用）
- iNaturalist APP 里"上海" 区域的 top observed species list`;

export const G1_MAY_ATOMS: PathAtomSeedRow[] = [
  {
    slug: "g1-may-neighborhood-park-walk",
    title: "小区/公园观察 walk",
    body: "春末夏初素材密度最高（落花/新叶/第一批小虫）。带本子 walk 10-20 分钟，想画什么画什么，频次不强求",
    gradeFrom: 1,
    gradeTo: 12,
    interests: NATURE_INTEREST,
    scheduleKind: "ALWAYS_ON",
    windowType: null,
    cadenceRole: "LIGHT_RECURRING",
    frictionLevel: 0,
    setting: "OUTDOOR",
    displayOrder: 1,
  },
  {
    slug: "g1-may-observation-notebook",
    title: "观察本记录",
    body: "干啥都接 1 页。她自己的方式随便画写。（与立夏共用同一原子）",
    gradeFrom: 1,
    gradeTo: 12,
    interests: FOUNDATION_INTEREST,
    scheduleKind: "ALWAYS_ON",
    windowType: null,
    cadenceRole: "LIGHT_RECURRING",
    frictionLevel: 0,
    setting: "EITHER",
    displayOrder: 2,
  },
  {
    slug: "g1-may-bowu-may-reading",
    title: "《博物》5 月号阅读",
    body: "到家翻一翻，挑 1 篇一起读",
    gradeFrom: 1,
    gradeTo: 12,
    interests: NATURE_CULTURE_INTEREST,
    scheduleKind: "ALWAYS_ON",
    windowType: null,
    cadenceRole: "LIGHT_RECURRING",
    frictionLevel: 0,
    setting: "INDOOR",
    displayOrder: 3,
  },
  {
    slug: "g1-may-bilibili-nature-watch",
    title: "B 站陪看",
    body: '周末晚 20-30 分钟，"无穷小亮"/"星球研究所" 1 期。不需每周',
    gradeFrom: 1,
    gradeTo: 12,
    interests: NATURE_INTEREST,
    scheduleKind: "ALWAYS_ON",
    windowType: null,
    cadenceRole: "LIGHT_RECURRING",
    frictionLevel: 0,
    setting: "INDOOR",
    displayOrder: 4,
  },
  {
    slug: "g1-may-shanghai-natural-history-route",
    title: "场馆·上海自然博物馆动线",
    body: `5 月推荐自博或海洋馆（室内，天气稍热更舒适）。避开 5/1-3 人流峰值，挪 5/4 或 5/5。

**上海自然博物馆 · G1-G3 推荐路线（90 分钟，按龄调档）**：

1. 进门先直奔 **生命长河**（恐龙 + 古生物大厅）— 20-25 min。视觉冲击强，全龄高能区。
2. 转 **生态万象** 看上海 / 华东本土生态 — 15-20 min。她在东滩 / 动物园看到的活物，这里能看到 permanent 展陈版本。
3. **探索中心** 互动玩 — 20-25 min。小孩能摸能玩的展区，注意力尾声释放。
4. 礼品店 5 min（她选 1 个 ≤ ¥50 的小东西，建立"博物馆正向记忆"）。

**按龄调档**（同一条线，难度旋钮拧一下，不是另写一条）：
- **G1**：上面 4 步原样。每区停留短，重"看到 + 有印象"，不要求记名字。家长全程带。
- **G2**：每区多停 5-10 min；生态万象让她**自己找** 1-2 种"在东滩见过的"，建立"展陈 ↔ 野外"对应。回家本子记 2-3 种。
- **G3**：路线她**自己看导览图带路**；生命长河加一个"挑一种最感兴趣的回家查它吃什么/活在哪个年代"的小任务；探索中心选一个互动展深玩而不是走马观花。家长退到旁观。

_[具体展区位置以自博当日导览图为准，展区会不定期更新 — 家长可提前 [snhm.org.cn](https://www.snhm.org.cn) 查当月特展]_

**讲解 info 的使用方式**（挂在两条场馆动线原子上）：家长不用提前背。**现场她指着哪个，家长打开 Vela 这张卡，找到对应展区的 trivia 点开念一两条就行**。Vela 是家长的 speaking-point teleprompter，不是 homework。`,
    gradeFrom: 1,
    gradeTo: 3,
    interests: NATURE_INTEREST,
    scheduleKind: "ALWAYS_ON",
    windowType: null,
    cadenceRole: "ONE_SHOT",
    frictionLevel: 1,
    setting: "INDOOR",
    displayOrder: 5,
  },
  {
    slug: "g1-may-shanghai-ocean-aquarium-route",
    title: "场馆·上海海洋水族馆动线",
    body: `**上海海洋水族馆 · G1 推荐路线（90 分钟）**：

1. **海底隧道** 先给她 wow 体验 — 10-15 min。水下穿行感 = 很多 G1 第一次。
2. **长江区（中国淡水）** — 15-20 min。中华鲟 / 扬子鳄这些本土物种，可以讲"这些动物就住在离我们不远的长江"。
   - 💬 **可以讲的小故事**（家长现场点开看，挑一个讲）：
     - 中华鲟是"活化石"——这个家族 1.5 亿年前就在地球上，和恐龙生活在同一个时代，也熬过了恐龙灭绝后的漫长时间
     - 中华鲟每年会从东海游回长江产卵，一路能游 2000 多公里
     - 扬子鳄是地球上只有中国才有的鳄鱼，全世界就它一种"只住中国"
     - 长江江豚被叫"微笑天使"，2022 年普查约 1200 多头，数量第一次回升
3. **非洲区 + 南极区** — 20-25 min。看大型鱼 + 企鹅。
   - 💬 **可以讲的小故事**：
     - 企鹅不是"北极动物"——野生企鹅主要在南半球，北极没有
     - 企鹅的翅膀不是用来飞的，是演化成了"游泳桨"
4. **互动触摸池**（若开放）— 10-15 min。
5. 出口 5 min。

**按龄调档**：
- **G1**：上面路线原样，家长带着看，重"看到 + 哇一下"。
- **G2**：长江区多停 5 min，让她自己找 1 种"本土物种"，说出它为什么和长江有关。
- **G3**：她自己选 1 个展区查证 1 个问题，比如"企鹅为什么不是北极动物"，回家写 2 句。

_[展区以馆当日实际开放为准，[sh-aquarium.com](https://www.sh-aquarium.com/zh/html/index.aspx) 查当日动线]_

**讲解 info 的使用方式**（挂在两条场馆动线原子上）：家长不用提前背。**现场她指着哪个，家长打开 Vela 这张卡，找到对应展区的 trivia 点开念一两条就行**。Vela 是家长的 speaking-point teleprompter，不是 homework。`,
    gradeFrom: 1,
    gradeTo: 3,
    interests: NATURE_INTEREST,
    scheduleKind: "ALWAYS_ON",
    windowType: null,
    cadenceRole: "ONE_SHOT",
    frictionLevel: 1,
    setting: "INDOOR",
    displayOrder: 6,
  },
  {
    slug: "g1-may-labor-century-gongqing-parks",
    title: "世纪公园 / 共青森林公园",
    body: "家门口 walk + 观察本。几乎对任何家庭都可作探索项",
    gradeFrom: 1,
    gradeTo: 12,
    interests: NATURE_INTEREST,
    scheduleKind: "WINDOW",
    windowType: "HOLIDAY",
    cadenceRole: "ONE_SHOT",
    frictionLevel: 0,
    setting: "OUTDOOR",
    displayOrder: 7,
  },
  {
    slug: "g1-may-labor-sheshan-forest-park",
    title: "佘山国家森林公园",
    body: "5 月林下植物 + 昆虫开始多。G1 走马观花、G3 可带任务找物种",
    gradeFrom: 1,
    gradeTo: 3,
    interests: NATURE_INTEREST,
    scheduleKind: "WINDOW",
    windowType: "HOLIDAY",
    cadenceRole: "ONE_SHOT",
    frictionLevel: 1,
    setting: "OUTDOOR",
    displayOrder: 8,
  },
  {
    slug: "g1-may-labor-dongtan-birding-day-trip",
    title: "崇明东滩观鸟（日返）",
    body: "5/10 前看最后一批迁徙候鸟（深内容见东滩段原子）",
    gradeFrom: 1,
    gradeTo: 6,
    interests: NATURE_BIRDING_INTEREST,
    scheduleKind: "WINDOW",
    windowType: "HOLIDAY",
    cadenceRole: "ONE_SHOT",
    frictionLevel: 2,
    setting: "OUTDOOR",
    displayOrder: 9,
  },
  {
    slug: "g1-may-labor-ningbo-youngor-zoo",
    title: "宁波雅戈尔动物园",
    body: "近年口碑好",
    gradeFrom: 1,
    gradeTo: 3,
    interests: NATURE_INTEREST,
    scheduleKind: "WINDOW",
    windowType: "HOLIDAY",
    cadenceRole: "ONE_SHOT",
    frictionLevel: 3,
    setting: "OUTDOOR",
    displayOrder: 10,
  },
  {
    slug: "g1-may-labor-nanjing-hongshan-zoo",
    title: "南京红山动物园",
    body: "本土物种丰富，G1-G3 都很合适",
    gradeFrom: 1,
    gradeTo: 3,
    interests: NATURE_INTEREST,
    scheduleKind: "WINDOW",
    windowType: "HOLIDAY",
    cadenceRole: "ONE_SHOT",
    frictionLevel: 3,
    setting: "OUTDOOR",
    displayOrder: 11,
  },
  {
    slug: "g1-may-labor-suzhou-taihu-wetland",
    title: "苏州太湖湿地公园",
    body: "家庭观鸟入门友好",
    gradeFrom: 1,
    gradeTo: 3,
    interests: NATURE_BIRDING_INTEREST,
    scheduleKind: "WINDOW",
    windowType: "HOLIDAY",
    cadenceRole: "ONE_SHOT",
    frictionLevel: 3,
    setting: "OUTDOOR",
    displayOrder: 12,
  },
  {
    slug: "g1-may-lixia-outdoor-observation",
    title: "立夏·外观察",
    body: "小区/公园/阳台看今天 vs 4 月初：①叶色 嫩绿→深绿 ②第一批夏虫（蚁、蝶比 4 月多）③花谢花开。5-10 分钟",
    gradeFrom: 1,
    gradeTo: 12,
    interests: NATURE_INTEREST,
    scheduleKind: "WINDOW",
    windowType: "SOLAR_TERM",
    cadenceRole: "ANNUAL_RITUAL",
    frictionLevel: 0,
    setting: "OUTDOOR",
    displayOrder: 13,
  },
  {
    slug: "g1-may-lixia-egg-battle",
    title: "立夏·斗蛋",
    body: '煮蛋、棉线网兜挂胸前，蛋尖对撞比谁壳不碎——传统"斗蛋"',
    gradeFrom: 1,
    gradeTo: 6,
    interests: CULTURE_INTEREST,
    scheduleKind: "WINDOW",
    windowType: "SOLAR_TERM",
    cadenceRole: "ANNUAL_RITUAL",
    frictionLevel: 0,
    setting: "INDOOR",
    displayOrder: 14,
  },
  {
    slug: "g1-may-lixia-weighing",
    title: "立夏·秤人",
    body: '体重秤称她，"立夏称了夏天长得顺"。每年同一天秤一次，看 1 年长多少',
    gradeFrom: 1,
    gradeTo: 12,
    interests: CULTURE_INTEREST,
    scheduleKind: "WINDOW",
    windowType: "SOLAR_TERM",
    cadenceRole: "ANNUAL_RITUAL",
    frictionLevel: 0,
    setting: "INDOOR",
    displayOrder: 15,
  },
  {
    slug: "g1-may-lixia-plant-a-seed",
    title: "立夏·种一颗",
    body: "绿豆/黄豆/向日葵种小花盆，每天记发芽长高。节气起止 = 种子时间坐标",
    gradeFrom: 1,
    gradeTo: 12,
    interests: NATURE_INTEREST,
    scheduleKind: "WINDOW",
    windowType: "SOLAR_TERM",
    cadenceRole: "ANNUAL_RITUAL",
    frictionLevel: 0,
    setting: "EITHER",
    displayOrder: 16,
  },
  {
    slug: "g1-may-lixia-green-bookmark",
    title: "立夏·采新绿书签",
    body: "捡地上 2-3 片新叶（不折树上的），夹书一周晾干做节气书签",
    gradeFrom: 1,
    gradeTo: 12,
    interests: NATURE_CRAFT_INTEREST,
    scheduleKind: "WINDOW",
    windowType: "SOLAR_TERM",
    cadenceRole: "ANNUAL_RITUAL",
    frictionLevel: 0,
    setting: "EITHER",
    displayOrder: 17,
  },
  {
    slug: "g1-may-lixia-observation-note",
    title: "立夏·观察本记录",
    body: '1 页"5 月 5 日 立夏 我看到…"，她自己的方式随便画写',
    gradeFrom: 1,
    gradeTo: 12,
    interests: FOUNDATION_INTEREST,
    scheduleKind: "WINDOW",
    windowType: "SOLAR_TERM",
    cadenceRole: "ANNUAL_RITUAL",
    frictionLevel: 0,
    setting: "EITHER",
    displayOrder: 18,
  },
  {
    slug: "g1-may-lixia-solar-term-reading",
    title: "立夏·节气阅读",
    body: "《二十四节气诗》立夏篇（陆游《立夏前二日作》、朱淑真《立夏》）；《博物》历年 5 月号立夏栏目。**按龄唯一调档**：G1 家长念 / G2 一起读 / G3 自读 + 说一句\"立夏和清明哪不一样\"",
    gradeFrom: 1,
    gradeTo: 12,
    interests: CULTURE_INTEREST,
    scheduleKind: "WINDOW",
    windowType: "SOLAR_TERM",
    cadenceRole: "ANNUAL_RITUAL",
    frictionLevel: 0,
    setting: "INDOOR",
    displayOrder: 19,
  },
  {
    slug: "g1-may-dongtan-birding-main",
    title: "东滩观鸟（主）",
    body: DONGTAN_MAIN_BODY,
    gradeFrom: 1,
    gradeTo: 6,
    interests: NATURE_BIRDING_INTEREST,
    scheduleKind: "WINDOW",
    windowType: "SEASON_WINDOW",
    cadenceRole: "ONE_SHOT",
    frictionLevel: 3,
    setting: "OUTDOOR",
    displayOrder: 20,
  },
  {
    slug: "g1-may-dongping-forest-backup",
    title: "东平国家森林公园（崇明同日 backup）",
    body: DONGPING_BACKUP_BODY,
    gradeFrom: 1,
    gradeTo: 3,
    interests: NATURE_INTEREST,
    scheduleKind: "WINDOW",
    windowType: "SEASON_WINDOW",
    cadenceRole: "ONE_SHOT",
    frictionLevel: 2,
    setting: "OUTDOOR",
    displayOrder: 21,
  },
  {
    slug: "g1-may-chenshan-botanical-backup",
    title: "辰山植物园（回程 backup）",
    body: CHENSHAN_BACKUP_BODY,
    gradeFrom: 1,
    gradeTo: 3,
    interests: NATURE_FLOWER_INTEREST,
    scheduleKind: "WINDOW",
    windowType: "SEASON_WINDOW",
    cadenceRole: "ONE_SHOT",
    frictionLevel: 2,
    setting: "OUTDOOR",
    displayOrder: 22,
  },
  {
    slug: "g1-may-dongtan-century-park-backup",
    title: "世纪公园（不去崇明 backup）",
    body: CENTURY_PARK_BACKUP_BODY,
    gradeFrom: 1,
    gradeTo: 12,
    interests: NATURE_INTEREST,
    scheduleKind: "WINDOW",
    windowType: "SEASON_WINDOW",
    cadenceRole: "ONE_SHOT",
    frictionLevel: 0,
    setting: "OUTDOOR",
    displayOrder: 23,
  },
  {
    slug: "g1-may-dongtan-sheshan-backup",
    title: "佘山国家森林公园（不去崇明 backup）",
    body: SHESHAN_BACKUP_BODY,
    gradeFrom: 1,
    gradeTo: 3,
    interests: NATURE_INTEREST,
    scheduleKind: "WINDOW",
    windowType: "SEASON_WINDOW",
    cadenceRole: "ONE_SHOT",
    frictionLevel: 1,
    setting: "OUTDOOR",
    displayOrder: 24,
  },
  {
    slug: "g1-may-neighborhood-ant-trail",
    title: "蚁道观察",
    body: "**蚁道观察**（15 分钟）：选一段有蚂蚁活动的人行道砖缝，和她一起蹲下来看 **5 分钟**。看蚂蚁从哪到哪、搬什么、怎么遇到同伴。回来本子画一条蚁道。",
    gradeFrom: 1,
    gradeTo: 12,
    interests: NATURE_INTEREST,
    scheduleKind: "WINDOW",
    windowType: "SEASON_WINDOW",
    cadenceRole: "LIGHT_RECURRING",
    frictionLevel: 0,
    setting: "OUTDOOR",
    displayOrder: 25,
  },
  {
    slug: "g1-may-neighborhood-butterfly-tracking",
    title: "蝴蝶追踪",
    body: "**蝴蝶追踪**（20 分钟）：小区花坛边等 5 分钟，通常会有 1-2 种蝴蝶来。不追蝶（小孩跑得慢），只看它停下来的那几秒。",
    gradeFrom: 1,
    gradeTo: 12,
    interests: NATURE_INTEREST,
    scheduleKind: "WINDOW",
    windowType: "SEASON_WINDOW",
    cadenceRole: "LIGHT_RECURRING",
    frictionLevel: 0,
    setting: "OUTDOOR",
    displayOrder: 26,
  },
  {
    slug: "g1-may-neighborhood-pillbug-exploration",
    title: "潮虫探险",
    body: "**潮虫探险**（10 分钟）：搬开花盆 / 石头 / 落叶堆，看底下的西瓜虫 / 蚯蚓 / 各种小东西。**用手轻轻碰一下西瓜虫**，看它蜷成球。G1 对这种即时 feedback 最有感。",
    gradeFrom: 1,
    gradeTo: 12,
    interests: NATURE_INTEREST,
    scheduleKind: "WINDOW",
    windowType: "SEASON_WINDOW",
    cadenceRole: "LIGHT_RECURRING",
    frictionLevel: 0,
    setting: "OUTDOOR",
    displayOrder: 27,
  },
  {
    slug: "g1-may-neighborhood-bird-sounds",
    title: "楼下鸟声",
    body: '**楼下鸟声**（5 分钟）：阳台静坐，听不同的鸟叫。麻雀的"喳喳" / 斑鸠的"咕咕" / 白头鹎清晨的歌声。她能分出 2 种就够。',
    gradeFrom: 1,
    gradeTo: 12,
    interests: NATURE_INTEREST,
    scheduleKind: "WINDOW",
    windowType: "SEASON_WINDOW",
    cadenceRole: "LIGHT_RECURRING",
    frictionLevel: 0,
    setting: "OUTDOOR",
    displayOrder: 28,
  },
];

export const G1_MAY_CURATED_VIEWS: PathCuratedViewSeedRow[] = [
  {
    slug: "g1-may-baseline",
    title: "5 月底盘",
    month: 5,
    leadLine: "5 月春末夏初，天气刚好。周末 routine 2-3 次小 action 保持观察本在用。",
    whySpecial: "一个月 3-5 次 weekend 半天。≤ 总周末时间 40%，留一半以上给别的。",
    heart: '5 月是过渡月，不追求"做什么大事"。你能坚持 4 月的 routine 就是胜利。',
    output: "本子多 1-3 页图文；场馆去 1 次（累积）；杂志看 1-2 篇；视频 1-2 期。",
    serendipity: null,
    proseBlocks: [
      {
        key: "leadLine",
        label: "一句话",
        value: "5 月春末夏初，天气刚好。周末 routine 2-3 次小 action 保持观察本在用。",
      },
      {
        key: "timeBudget",
        label: "时间占用",
        value: "一个月 3-5 次 weekend 半天。≤ 总周末时间 40%，留一半以上给别的。",
      },
      {
        key: "output",
        label: "产出",
        value: "本子多 1-3 页图文；场馆去 1 次（累积）；杂志看 1-2 篇；视频 1-2 期。",
      },
      {
        key: "heart",
        label: "心法",
        value: '5 月是过渡月，不追求"做什么大事"。你能坚持 4 月的 routine 就是胜利。',
      },
    ],
    defaultTightRatio: 50,
    frictionCeilingDefault: 3,
    displayOrder: 1,
  },
  {
    slug: "g1-may-labor-holiday",
    title: "劳动节 5 天段",
    month: 5,
    leadLine: "每年 5/1-5 假期。2026 年为 5/1（周五）到 5/5（周二）。",
    whySpecial: "5 天里用 **1-2 天** 做 nature-themed 活动，3-4 天给家庭别的事。不要 5 天全排 Vela。",
    heart: '劳动节不是"冲刺日程"，是"改变节奏"的机会。让她看到平常不看到的地方，不在于多。',
    output: "一次 mini-trip，照片若干 + 观察本上 1-2 页新地方的记录。",
    serendipity: null,
    proseBlocks: [
      {
        key: "leadLine",
        label: "触发条件",
        value: "每年 5/1-5 假期。2026 年为 5/1（周五）到 5/5（周二）。",
      },
      {
        key: "precondition",
        label: "前置",
        value: "家里有基本出行 planning 能力，没特别要求。",
      },
      {
        key: "timeBudget",
        label: "时间预算",
        value: "5 天里用 **1-2 天** 做 nature-themed 活动，3-4 天给家庭别的事。不要 5 天全排 Vela。",
      },
      {
        key: "output",
        label: "产出",
        value: "一次 mini-trip，照片若干 + 观察本上 1-2 页新地方的记录。",
      },
      {
        key: "pitfalls",
        label: "避坑",
        value: "5/1-3 上海各场馆人流峰值。提前预约票 + 尽量挪到 5/4 或 5/5。",
      },
      {
        key: "heart",
        label: "心法",
        value: '劳动节不是"冲刺日程"，是"改变节奏"的机会。让她看到平常不看到的地方，不在于多。',
      },
    ],
    defaultTightRatio: 50,
    frictionCeilingDefault: 3,
    displayOrder: 2,
  },
  {
    slug: "g1-may-lixia-solar-term",
    title: "立夏节气段",
    month: 5,
    leadLine: "每年 5 月上旬立夏节气。2026 年为 **5 月 5 日（周二）**，刚好在劳动节假期内。",
    whySpecial: "立夏是 culture + nature 双触发点——有传统习俗（秤人、立夏蛋、养蚕），也是春末转夏的明显自然变化节点。一年 24 节气是她和自然对表的锚点。",
    heart: '节气不是传统文化 performance，是季节感的 anchor。让她知道一年的 cycle 不只是"放假 / 上学"。',
    output: "节气 log 1 页 + 家里 1 个 artifact（蛋 / 种子 / 书签 / 秤数值）。**关键**：每年 5 月 5 日她再看这一页，会看到自己 1 年的变化 layer——这是 portfolio 里不刻意的 serendipity。",
    serendipity: null,
    proseBlocks: [
      {
        key: "leadLine",
        label: "触发条件",
        value: "每年 5 月上旬立夏节气。2026 年为 **5 月 5 日（周二）**，刚好在劳动节假期内。",
      },
      { key: "precondition", label: "前置", value: "无。" },
      { key: "time", label: "时间", value: "1-2 小时，不占 weekend 半天。" },
      {
        key: "whySpecial",
        label: "为什么特别",
        value: "立夏是 culture + nature 双触发点——有传统习俗（秤人、立夏蛋、养蚕），也是春末转夏的明显自然变化节点。一年 24 节气是她和自然对表的锚点。",
      },
      {
        key: "output",
        label: "产出",
        value: "节气 log 1 页 + 家里 1 个 artifact（蛋 / 种子 / 书签 / 秤数值）。**关键**：每年 5 月 5 日她再看这一页，会看到自己 1 年的变化 layer——这是 portfolio 里不刻意的 serendipity。",
      },
      {
        key: "heart",
        label: "心法",
        value: '节气不是传统文化 performance，是季节感的 anchor。让她知道一年的 cycle 不只是"放假 / 上学"。',
      },
    ],
    defaultTightRatio: 50,
    frictionCeilingDefault: 3,
    displayOrder: 3,
  },
  {
    slug: "g1-may-dongtan-migration-tail",
    title: "东滩迁徙尾声段",
    month: 5,
    leadLine: "每年 5 月上中旬，春季候鸟最后一批离开上海。5 月中旬后进入夏候鸟期，基本看不到了。",
    whySpecial: '春季鸟类迁徙主季是 3-4 月，但 5 月初还能赶上最后一批。错过就要等 10 月秋季迁徙。这是她第一次理解"自然有档期"的机会。',
    heart: "自然有档期。错过这次等半年。这条经验她会记很久。",
    output: "迁徙季最后一次观察记录。portfolio 多 1 条独特的 season-specific 素材（文字 + 视觉 + 文件时间戳）。",
    serendipity: null,
    proseBlocks: [
      {
        key: "leadLine",
        label: "触发条件",
        value: "每年 5 月上中旬，春季候鸟最后一批离开上海。5 月中旬后进入夏候鸟期，基本看不到了。",
      },
      {
        key: "precondition",
        label: "前置",
        value: "至少 1 次场馆观察经验（有\"安静看动物\"的习惯）。G1 没有的话，改用佘山 / 世纪公园 + 望远镜替代。",
      },
      { key: "time", label: "时间", value: "半天，6-8 小时含往返交通。" },
      {
        key: "whySpecial",
        label: "为什么是这个时间窗",
        value: '春季鸟类迁徙主季是 3-4 月，但 5 月初还能赶上最后一批。错过就要等 10 月秋季迁徙。这是她第一次理解"自然有档期"的机会。',
      },
      {
        key: "prepGuide",
        label: "出发前准备（家长花 5-10 分钟翻下面 5 种就够）",
        value: DONGTAN_PREP_GUIDE,
      },
      {
        key: "howTo",
        label: "怎么做（按顺序）",
        value: DONGTAN_HOW_TO,
      },
      {
        key: "output",
        label: "产出",
        value: "迁徙季最后一次观察记录。portfolio 多 1 条独特的 season-specific 素材（文字 + 视觉 + 文件时间戳）。",
      },
      {
        key: "pitfalls",
        label: "避坑",
        value: "5 月中旬后基本看不到春季候鸟，别白跑。自驾往返 2 小时 + 现场 30 分钟看不到鸟，小孩挫败感重。宁可 5/10 前去。",
      },
      {
        key: "backupPlan",
        label: "Backup plan（看不到鸟 / 天气不行时的替代）",
        value: DONGTAN_BACKUP_PLAN,
      },
      {
        key: "backupHeart",
        label: "重要心法",
        value: DONGTAN_BACKUP_HEART,
      },
      {
        key: "heart",
        label: "心法",
        value: "自然有档期。错过这次等半年。这条经验她会记很久。",
      },
    ],
    defaultTightRatio: 50,
    frictionCeilingDefault: 3,
    displayOrder: 4,
  },
  {
    slug: "g1-may-neighborhood-ecology",
    title: "初夏家门口生态段",
    month: 5,
    leadLine: "每年 5 月下旬起（上海大致 5/20 后），气温稳定 20°C 以上，第一批初夏物种开始在城市绿化 / 小区 / 公园大量出现。",
    whySpecial: "前面几张卡（场馆 / 东滩 / 节气）都有某种\"去某处 / 某日做某事\"的 barrier。这张卡反过来——**告诉家长她家 50 米内就有 100 种生物**。低门槛、高频次，是月度 baseline 的支撑面。",
    heart: "自然不只在远方的保护区。家门口 50 米内就有完整的城市生态系统。这张卡的真正价值 = **让她每天下楼的路变成实地课堂**，门槛为 0，频次无限。长期下来，她对\"自然\"的语言会从\"我在公园里看到过\"变成\"我家楼下的麻雀今年比去年少\"。",
    output: '本子上的 "家门口生物 count"——一个月累积能记 10-20 种。这个数字她自己看着会长骄傲。',
    serendipity: null,
    proseBlocks: [
      {
        key: "leadLine",
        label: "触发条件",
        value: "每年 5 月下旬起（上海大致 5/20 后），气温稳定 20°C 以上，第一批初夏物种开始在城市绿化 / 小区 / 公园大量出现。",
      },
      {
        key: "precondition",
        label: "前置",
        value: "家附近有任何绿化（小区内花坛 / 楼下绿地 / 社区公园即可）。完全 0 门槛。",
      },
      {
        key: "time",
        label: "时间",
        value: "一次 15-30 分钟。可以拆成一周 2-3 次，每次 15 分钟。",
      },
      {
        key: "whySpecial",
        label: "为什么特别",
        value: "前面几张卡（场馆 / 东滩 / 节气）都有某种\"去某处 / 某日做某事\"的 barrier。这张卡反过来——**告诉家长她家 50 米内就有 100 种生物**。低门槛、高频次，是月度 baseline 的支撑面。",
      },
      {
        key: "speciesGuide",
        label: "5 种家门口可见的初夏生物（带辨识特征）",
        value: NEIGHBORHOOD_SPECIES_GUIDE,
      },
      {
        key: "howTo",
        label: "怎么做（随意组合）",
        value: NEIGHBORHOOD_HOW_TO,
      },
      {
        key: "output",
        label: "产出",
        value: '本子上的 "家门口生物 count"——一个月累积能记 10-20 种。这个数字她自己看着会长骄傲。',
      },
      {
        key: "pitfalls",
        label: "避坑",
        value: `- **别用昆虫盒装回家**。G1 好奇心强 easily escalates 到 "抓"。教育重点是**观察在野外**，不是"带回家养死"。
- **别用杀虫剂 / 驱蚊液喷她的观察对象**。她看蝴蝶不用喷。
- **别强求"记住拉丁名"**。中文名 / 她起的外号 / "那种会飞的蓝蝴蝶" 都行。`,
      },
      {
        key: "heart",
        label: "心法",
        value: `自然不只在远方的保护区。家门口 50 米内就有完整的城市生态系统。这张卡的真正价值 = **让她每天下楼的路变成实地课堂**，门槛为 0，频次无限。长期下来，她对"自然"的语言会从"我在公园里看到过"变成"我家楼下的麻雀今年比去年少"。

这是城市 G1 孩子的**唯一低成本、高频次、可持续的自然连接方式**。东滩 / 自博是 monthly events，家门口生态是 daily baseline。`,
      },
      {
        key: "sources",
        label: "Sources",
        value: NEIGHBORHOOD_SOURCES,
      },
    ],
    defaultTightRatio: 50,
    frictionCeilingDefault: 3,
    displayOrder: 5,
  },
];

export const G1_MAY_VIEW_ATOM_LINKS: PathCuratedViewAtomSeedRow[] = [
  { viewSlug: "g1-may-baseline", atomSlug: "g1-may-neighborhood-park-walk" },
  { viewSlug: "g1-may-baseline", atomSlug: "g1-may-observation-notebook" },
  { viewSlug: "g1-may-baseline", atomSlug: "g1-may-bowu-may-reading" },
  { viewSlug: "g1-may-baseline", atomSlug: "g1-may-bilibili-nature-watch" },
  { viewSlug: "g1-may-baseline", atomSlug: "g1-may-shanghai-natural-history-route" },
  { viewSlug: "g1-may-baseline", atomSlug: "g1-may-shanghai-ocean-aquarium-route" },

  { viewSlug: "g1-may-labor-holiday", atomSlug: "g1-may-labor-century-gongqing-parks" },
  { viewSlug: "g1-may-labor-holiday", atomSlug: "g1-may-labor-sheshan-forest-park" },
  { viewSlug: "g1-may-labor-holiday", atomSlug: "g1-may-labor-dongtan-birding-day-trip" },
  { viewSlug: "g1-may-labor-holiday", atomSlug: "g1-may-labor-ningbo-youngor-zoo" },
  { viewSlug: "g1-may-labor-holiday", atomSlug: "g1-may-labor-nanjing-hongshan-zoo" },
  { viewSlug: "g1-may-labor-holiday", atomSlug: "g1-may-labor-suzhou-taihu-wetland" },

  { viewSlug: "g1-may-lixia-solar-term", atomSlug: "g1-may-lixia-outdoor-observation" },
  { viewSlug: "g1-may-lixia-solar-term", atomSlug: "g1-may-lixia-egg-battle" },
  { viewSlug: "g1-may-lixia-solar-term", atomSlug: "g1-may-lixia-weighing" },
  { viewSlug: "g1-may-lixia-solar-term", atomSlug: "g1-may-lixia-plant-a-seed" },
  { viewSlug: "g1-may-lixia-solar-term", atomSlug: "g1-may-lixia-green-bookmark" },
  { viewSlug: "g1-may-lixia-solar-term", atomSlug: "g1-may-lixia-observation-note" },
  { viewSlug: "g1-may-lixia-solar-term", atomSlug: "g1-may-lixia-solar-term-reading" },

  { viewSlug: "g1-may-dongtan-migration-tail", atomSlug: "g1-may-dongtan-birding-main" },
  { viewSlug: "g1-may-dongtan-migration-tail", atomSlug: "g1-may-dongping-forest-backup" },
  { viewSlug: "g1-may-dongtan-migration-tail", atomSlug: "g1-may-chenshan-botanical-backup" },
  { viewSlug: "g1-may-dongtan-migration-tail", atomSlug: "g1-may-dongtan-century-park-backup" },
  { viewSlug: "g1-may-dongtan-migration-tail", atomSlug: "g1-may-dongtan-sheshan-backup" },

  { viewSlug: "g1-may-neighborhood-ecology", atomSlug: "g1-may-neighborhood-ant-trail" },
  { viewSlug: "g1-may-neighborhood-ecology", atomSlug: "g1-may-neighborhood-butterfly-tracking" },
  { viewSlug: "g1-may-neighborhood-ecology", atomSlug: "g1-may-neighborhood-pillbug-exploration" },
  { viewSlug: "g1-may-neighborhood-ecology", atomSlug: "g1-may-neighborhood-bird-sounds" },
];

export const G1_MAY_ATOM_SEED: G1MayAtomSeed = {
  stageSlug: PATH_ATOM_STAGE_SLUG,
  slugPrefix: "g1-may-",
  atoms: G1_MAY_ATOMS,
  curatedViews: G1_MAY_CURATED_VIEWS,
  viewAtomLinks: G1_MAY_VIEW_ATOM_LINKS,
};
