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

export type PathScheduleKind = (typeof PATH_SCHEDULE_KINDS)[number];
export type PathWindowType = (typeof PATH_WINDOW_TYPES)[number];
export type PathCadenceRole = (typeof PATH_CADENCE_ROLES)[number];
export type PathSetting = (typeof PATH_SETTINGS)[number];

export interface PathAtomSeedRow {
  slug: string;
  title: string;
  body: string;
  gradeFrom: number;
  gradeTo: number;
  interests: ["nature"];
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
  month: 5;
  leadLine: string | null;
  whySpecial: string;
  heart: string;
  output: string | null;
  serendipity: string | null;
  defaultTightRatio: 50;
  frictionCeilingDefault: 3;
  displayOrder: number;
}

export interface PathCuratedViewAtomSeedRow {
  viewSlug: string;
  atomSlug: string;
}

export interface G1MayAtomSeed {
  stageSlug: typeof PATH_ATOM_STAGE_SLUG;
  atoms: PathAtomSeedRow[];
  curatedViews: PathCuratedViewSeedRow[];
  viewAtomLinks: PathCuratedViewAtomSeedRow[];
}

const NATURE_INTEREST: ["nature"] = ["nature"];

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
    interests: NATURE_INTEREST,
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
    interests: NATURE_INTEREST,
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

上海自然博物馆 · G1-G3 推荐路线（90 分钟，按龄调档）：

1. 进门先直奔 生命长河（恐龙 + 古生物大厅）— 20-25 min。视觉冲击强，全龄高能区。
2. 转 生态万象 看上海 / 华东本土生态 — 15-20 min。她在东滩 / 动物园看到的活物，这里能看到 permanent 展陈版本。
3. 探索中心 互动玩 — 20-25 min。小孩能摸能玩的展区，注意力尾声释放。
4. 礼品店 5 min（她选 1 个 ≤ ¥50 的小东西，建立"博物馆正向记忆"）。

按龄调档：G1 重"看到 + 有印象"；G2 找 1-2 种"在东滩见过的"；G3 自己看导览图带路，挑一种最感兴趣的回家查它吃什么/活在哪个年代。`,
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
    body: `上海海洋水族馆 · G1 推荐路线（90 分钟）：

1. 海底隧道 先给她 wow 体验 — 10-15 min。
2. 长江区（中国淡水）— 15-20 min。中华鲟 / 扬子鳄这些本土物种，可以讲"这些动物就住在离我们不远的长江"。
3. 非洲区 + 南极区 — 20-25 min。看大型鱼 + 企鹅。
4. 互动触摸池（若开放）— 10-15 min。
5. 出口 5 min。

讲解 info 的使用方式：家长不用提前背。现场她指着哪个，家长打开 Vela 这张卡，找到对应展区的 trivia 点开念一两条就行。`,
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
    interests: NATURE_INTEREST,
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
    interests: NATURE_INTEREST,
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
    interests: NATURE_INTEREST,
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
    interests: NATURE_INTEREST,
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
    interests: NATURE_INTEREST,
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
    interests: NATURE_INTEREST,
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
    interests: NATURE_INTEREST,
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
    body: `兴趣对得上才进贴身；否则不推。

春季鸟类迁徙主季是 3-4 月，但 5 月初还能赶上最后一批。错过就要等 10 月秋季迁徙。这是她第一次理解"自然有档期"的机会。

现场不求看到多少种。能认出任意 1-2 种 + 看到一次"一群飞起"或"一次进食"，就已经值了。G1 注意力有限，30-60 分钟静观察就够。`,
    gradeFrom: 1,
    gradeTo: 6,
    interests: NATURE_INTEREST,
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
    body: "失败友好 backup",
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
    body: "失败友好 backup；花季视觉强",
    gradeFrom: 1,
    gradeTo: 3,
    interests: NATURE_INTEREST,
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
    body: "失败友好 backup；也是跨段通用低折腾探索原子",
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
    body: "失败友好 backup；与劳动节段共用同一原子",
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
    body: "砖缝看蚂蚁 5 分钟，回来画一条蚁道",
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
    body: "花坛边等 5 分钟，只看停下来那几秒，不追",
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
    body: "搬开花盆/石头看西瓜虫，轻碰看蜷球",
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
    body: "阳台静坐听鸟叫，能分 2 种就够",
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
    serendipity: "每年 5 月 5 日她再看这一页，会看到自己 1 年的变化 layer——这是 portfolio 里不刻意的 serendipity。",
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
    serendipity: "portfolio 多 1 条独特的 season-specific 素材（文字 + 视觉 + 文件时间戳）。",
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
    serendipity: '长期下来，她对"自然"的语言会从"我在公园里看到过"变成"我家楼下的麻雀今年比去年少"。',
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
  atoms: G1_MAY_ATOMS,
  curatedViews: G1_MAY_CURATED_VIEWS,
  viewAtomLinks: G1_MAY_VIEW_ATOM_LINKS,
};
