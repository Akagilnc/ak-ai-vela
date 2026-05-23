/**
 * DERIVED DATA: hand-ported from docs/research/path-explorer-sample-g1-jun.md.
 *
 * That Markdown file is the content basis/source of truth for prose and curation.
 * Do not edit prose here directly; edit the MD, then re-port this projection.
 * The atomic + curated-view model is defined in the MD's model section.
 */

import {
  PATH_ATOM_STAGE_SLUG,
  PathAtomSeedRow,
  PathCuratedViewSeedRow,
  PathCuratedViewAtomSeedRow,
} from "./g1-may-atoms";

export const G1_JUN_STAGE_SLUG = PATH_ATOM_STAGE_SLUG;

const NATURE_INTEREST = ["nature"] as const;
const FOUNDATION_INTEREST = ["foundation"] as const;
const NATURE_CULTURE_INTEREST = ["nature", "culture"] as const;
const CULTURE_CRAFT_INTEREST = ["culture", "craft"] as const;
const CULTURE_INTEREST = ["culture"] as const;

// ─────────────────────────────────────────────────────────────────────────────
// PROSE CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const JUNE_END_BLANK_BODY = `上海公办小学一般 6/30 前后开始放暑假。

**6 月底 → 暑期预备指导**：

1. **留白第一**：六月最后一周不用赶活动，留出留白给孩子收尾本学期作业 + 期末。
2. **节奏调整**：期末期间把所有野外高折腾项目暂停，用家门口 10 分钟观察 walk 替代，保住习惯即可。
3. **暑期前瞻**：和孩子一起在本子上留出 2 页，写上“7-8 月我想去的地方/想看的虫子”，建立正向期待。`;

const DRAGON_BOAT_HERB_BODY = `**端午草药 · 现场认 3 种**：

1. **艾草（Artemisia argyi）** —— 灰绿色绒毛叶，揉碎闻 → 苦清香。常见用法：挂门 / 泡脚水。
2. **菖蒲（Acorus calamus）** —— 长条剑叶，闻起来像姜 + 柠檬。和艾草成对挂门驱虫。
3. **雄黄** —— 不是植物，是**含砷矿物粉**，加热分解出三氧化二砷（剧毒、可经吸入累积）。别让孩子接触粉末，也不要让她去闻。古方点额头是仪式感不是药用，**看图认识就行**。`;

const DRAGON_BOAT_LEAF_BODY = `**粽叶其实是箬竹叶（鲜叶 vs 干叶）**：

- **科普**：粽叶不是"竹子的叶子"，是**箬竹（Indocalamus tessellatus）**专门长的宽叶子。江浙家庭包粽用鲜箬叶煮过（消毒 + 软化），北方多用芦苇叶。让孩子比较：**新鲜箬叶 vs 干箬叶**，气味差异很明显。
- **[避坑]**：**市售"粽叶"多数是干箬叶**——颜色偏褐绿、硬。如果想让孩子见到鲜叶，菜场端午前 1 周问"鲜粽叶"，或者江浙短途路上的农家最稳。`;

const RAINY_SEASON_OBSERVATION_BODY = `1. 雨停后第二天**早上 7 点前**出门——太阳一晒蜗牛和蚯蚓就消失了。
2. **带本子 + 铅笔**。每看到一种，画或写下"在哪 / 多少只"，30 秒就行。
3. **不抓不踩**。蜗牛壳薄，捏一下就死。蚯蚓晒干就是干尸。
4. 回家后翻照片对照 iNaturalist app 上海区域热门记录——不强求，玩 5 分钟。`;

const RAINY_SEASON_PITFALLS_BODY = `- **防滑第一**：湿滑石板上别让她跑。雨后小区台阶最滑，务必穿防滑鞋慢行。
- **警惕赤链蛇**：上海市区罕见但闵行 / 浦东郊野公园偶尔有**赤链蛇**（中国蛇咬伤指南 + Wikipedia 列为**无毒**，但牙锋利且**唾液菌群易引起细菌感染**，被咬仍需就医清创）。看到立即拉开距离，**不要尝试抓或赶**。
- **驱蚊安全**：防蚊穿长袖。**给孩子用儿童浓度驱蚊液**（DEET ≤ 30% 或派卡瑞丁 ≤ 20%）。<u>3 岁以下避免柠檬桉油（OLE / PMD）</u>。`;

const FIREFLY_WINDOW_BODY = "夏至到 7 月中旬（约 2026/06/21 – 07/15）为高峰。农历月中前后月光亮反而看不到，闷热无风雨的暗夜最佳。时段 19:30-22:00 最稳";

const FIREFLY_METHOD_BODY = `1. **关闪光灯 / 关手机屏**。光会让萤火虫熄灯。
2. **到了先等 5 分钟让眼睛适应黑暗**。一开始什么都看不到很正常。
3. **不抓**。萤火虫寿命只有 1–2 周成虫期，抓一只就少一只。
4. **安静**。不需要刻意，只是别大声招呼小孩"快来看"。
5. **带防蚊液**。林下夏夜蚊子凶。`;

const FIREFLY_BACKUP_BODY = `- **BBC《地球脉动》"夜的世界"集**有萤火虫长镜头。回家陪她看 5 分钟。
- **《虫师》动画第 8 话"重穴"**——萤火虫主题，画面美。她可能更能记住。
- **明年再去**。"自然不一定每次都看到"是 G1 应该学到的元认知。`;

const FIREFLY_SOURCES_BODY = `- 上海植物园 / 辰山植物园 / 滨江森林公园官方公众号年度萤火虫夜赏公告
- 中国科学院昆明动物研究所 萤火虫保护科普
- iNaturalist 上海近郊 Lampyridae 历年观察记录`;

// ─────────────────────────────────────────────────────────────────────────────
// ATOMS
// ─────────────────────────────────────────────────────────────────────────────

export const G1_JUN_ATOMS: PathAtomSeedRow[] = [
  {
    slug: "g1-jun-observation-notebook",
    title: "观察本 6 月记录",
    body: "干啥都接 1 页。她自己的方式随便画写，形成 6 月特有的观察印记。",
    gradeFrom: 1,
    gradeTo: 12,
    interests: FOUNDATION_INTEREST,
    scheduleKind: "ALWAYS_ON",
    windowType: null,
    cadenceRole: "LIGHT_RECURRING",
    frictionLevel: 0,
    setting: "EITHER",
    displayOrder: 1,
  },
  {
    slug: "g1-jun-bowu-jun-reading",
    title: "《博物》6 月号阅读",
    body: "到家翻一翻，挑 1 篇关于夏至或雨季的文章一起读",
    gradeFrom: 1,
    gradeTo: 12,
    interests: NATURE_CULTURE_INTEREST,
    scheduleKind: "ALWAYS_ON",
    windowType: null,
    cadenceRole: "LIGHT_RECURRING",
    frictionLevel: 0,
    setting: "INDOOR",
    displayOrder: 2,
  },
  {
    slug: "g1-jun-bilibili-nature-watch",
    title: "B 站陪看",
    body: "周末晚 20-30 分钟，\"无穷小亮\"/\"星球研究所\" 1 期。不需每周，精选雨后动物或萤火虫特辑",
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
    slug: "g1-jun-june-end-blank",
    title: "6 月底 · 暑期预备",
    body: JUNE_END_BLANK_BODY,
    gradeFrom: 1,
    gradeTo: 3,
    interests: FOUNDATION_INTEREST,
    scheduleKind: "ALWAYS_ON",
    windowType: null,
    cadenceRole: "LIGHT_RECURRING",
    frictionLevel: 0,
    setting: "INDOOR",
    displayOrder: 4,
  },
  {
    slug: "g1-jun-dragon-boat-minhang-pujiang",
    title: "闵行浦江郊野公园",
    body: "端午前后有官方\"召楼粽情\"端午文化节（非遗市集 + 民俗游戏 + 包粽子体验，文旅部官方推广），4A 景区，一日往返，下午 3 点前回家避高峰",
    gradeFrom: 1,
    gradeTo: 12,
    interests: NATURE_CULTURE_INTEREST,
    scheduleKind: "WINDOW",
    windowType: "HOLIDAY",
    cadenceRole: "ONE_SHOT",
    frictionLevel: 1,
    setting: "OUTDOOR",
    displayOrder: 5,
  },
  {
    slug: "g1-jun-dragon-boat-jiading-maoqiao",
    title: "嘉定毛桥集市",
    body: "生态集市 + 民俗小吃。一日往返，适合轻松闲逛，体验江南乡土物产",
    gradeFrom: 1,
    gradeTo: 3,
    interests: CULTURE_CRAFT_INTEREST,
    scheduleKind: "WINDOW",
    windowType: "HOLIDAY",
    cadenceRole: "ONE_SHOT",
    frictionLevel: 1,
    setting: "OUTDOOR",
    displayOrder: 6,
  },
  {
    slug: "g1-jun-dragon-boat-zhejiang-bayberry",
    title: "江浙短途采杨梅",
    body: "绍兴上虞 / 台州 / 宁波——浙江粽子 + 杨梅核心产区。浙江杨梅 6 月初就开始上市，端午（6/19）正在杨梅季中后期（已熟透到落市前）；可去民宿提前约采摘",
    gradeFrom: 1,
    gradeTo: 3,
    interests: NATURE_INTEREST,
    scheduleKind: "WINDOW",
    windowType: "HOLIDAY",
    cadenceRole: "ONE_SHOT",
    frictionLevel: 3,
    setting: "OUTDOOR",
    displayOrder: 7,
  },
  {
    slug: "g1-jun-dragon-boat-home-moxibustion",
    title: "家里搞艾草与粽叶",
    body: "摸闻认新鲜草药 + 包 5 个粽子绑线，比远途奔波留下的感受更多",
    gradeFrom: 1,
    gradeTo: 12,
    interests: CULTURE_CRAFT_INTEREST,
    scheduleKind: "WINDOW",
    windowType: "HOLIDAY",
    cadenceRole: "ONE_SHOT",
    frictionLevel: 0,
    setting: "INDOOR",
    displayOrder: 8,
  },
  {
    slug: "g1-jun-dragon-boat-herb-id",
    title: "端午草药识别",
    body: DRAGON_BOAT_HERB_BODY,
    gradeFrom: 1,
    gradeTo: 12,
    interests: CULTURE_INTEREST,
    scheduleKind: "WINDOW",
    windowType: "HOLIDAY",
    cadenceRole: "ANNUAL_RITUAL",
    frictionLevel: 0,
    setting: "INDOOR",
    displayOrder: 9,
  },
  {
    slug: "g1-jun-dragon-boat-zongzi-leaf",
    title: "粽叶其实是箬竹叶",
    body: DRAGON_BOAT_LEAF_BODY,
    gradeFrom: 1,
    gradeTo: 12,
    interests: NATURE_CULTURE_INTEREST,
    scheduleKind: "WINDOW",
    windowType: "HOLIDAY",
    cadenceRole: "ANNUAL_RITUAL",
    frictionLevel: 0,
    setting: "INDOOR",
    displayOrder: 10,
  },
  {
    slug: "g1-jun-dragon-boat-notebook",
    title: "端午观察本记录",
    body: "1 页画出艾、菖蒲、箬叶三种叶子的轮廓并记录端午气味",
    gradeFrom: 1,
    gradeTo: 12,
    interests: FOUNDATION_INTEREST,
    scheduleKind: "WINDOW",
    windowType: "HOLIDAY",
    cadenceRole: "ANNUAL_RITUAL",
    frictionLevel: 0,
    setting: "EITHER",
    displayOrder: 11,
  },
  {
    slug: "g1-jun-rainy-season-snail",
    title: "雨后蜗牛与蛞蝓对比",
    body: "雨后清晨找墙面，教孩子辨识有壳蜗牛与无壳蛞蝓，轻触不抓回家",
    gradeFrom: 1,
    gradeTo: 12,
    interests: NATURE_INTEREST,
    scheduleKind: "WINDOW",
    windowType: "SEASON_WINDOW",
    cadenceRole: "LIGHT_RECURRING",
    frictionLevel: 0,
    setting: "OUTDOOR",
    displayOrder: 12,
  },
  {
    slug: "g1-jun-rainy-season-earthworm",
    title: "蚯蚓大救援",
    body: "用小棍轻轻把人行道上脱水的蚯蚓拨回泥土，保护生命",
    gradeFrom: 1,
    gradeTo: 12,
    interests: NATURE_INTEREST,
    scheduleKind: "WINDOW",
    windowType: "SEASON_WINDOW",
    cadenceRole: "LIGHT_RECURRING",
    frictionLevel: 0,
    setting: "OUTDOOR",
    displayOrder: 13,
  },
  {
    slug: "g1-jun-rainy-season-pillbug",
    title: "潮虫陆生甲壳科普",
    body: "翻石头找西瓜虫，轻碰看蜷球，讲述它和虾蟹是亲戚的冷知识",
    gradeFrom: 1,
    gradeTo: 12,
    interests: NATURE_INTEREST,
    scheduleKind: "WINDOW",
    windowType: "SEASON_WINDOW",
    cadenceRole: "LIGHT_RECURRING",
    frictionLevel: 0,
    setting: "OUTDOOR",
    displayOrder: 14,
  },
  {
    slug: "g1-jun-rainy-season-frog",
    title: "傍晚听蛙鸣",
    body: "傍晚 7-9 点带本子静立小区池塘边，听辨蛙鸣，记录叫声频次",
    gradeFrom: 1,
    gradeTo: 12,
    interests: NATURE_INTEREST,
    scheduleKind: "WINDOW",
    windowType: "SEASON_WINDOW",
    cadenceRole: "LIGHT_RECURRING",
    frictionLevel: 0,
    setting: "OUTDOOR",
    displayOrder: 15,
  },
  {
    slug: "g1-jun-rainy-season-observation-steps",
    title: "雨后 30 分钟观察步骤",
    body: RAINY_SEASON_OBSERVATION_BODY,
    gradeFrom: 1,
    gradeTo: 12,
    interests: NATURE_INTEREST,
    scheduleKind: "WINDOW",
    windowType: "SEASON_WINDOW",
    cadenceRole: "ONE_SHOT",
    frictionLevel: 0,
    setting: "OUTDOOR",
    displayOrder: 16,
  },
  {
    slug: "g1-jun-rainy-season-pitfalls",
    title: "梅雨季安全避坑指引",
    body: RAINY_SEASON_PITFALLS_BODY,
    gradeFrom: 1,
    gradeTo: 12,
    interests: NATURE_INTEREST,
    scheduleKind: "WINDOW",
    windowType: "SEASON_WINDOW",
    cadenceRole: "ONE_SHOT",
    frictionLevel: 0,
    setting: "OUTDOOR",
    displayOrder: 17,
  },
  {
    slug: "g1-jun-rainy-season-notebook",
    title: "雨季观察本记录",
    body: "本子上记 \"雨后清单\"——记录日期、气温、发现的雨季动物",
    gradeFrom: 1,
    gradeTo: 12,
    interests: FOUNDATION_INTEREST,
    scheduleKind: "WINDOW",
    windowType: "SEASON_WINDOW",
    cadenceRole: "ANNUAL_RITUAL",
    frictionLevel: 0,
    setting: "EITHER",
    displayOrder: 18,
  },
  {
    slug: "g1-jun-firefly-window",
    title: "观萤时间窗",
    body: FIREFLY_WINDOW_BODY,
    gradeFrom: 1,
    gradeTo: 12,
    interests: NATURE_INTEREST,
    scheduleKind: "WINDOW",
    windowType: "SEASON_WINDOW",
    cadenceRole: "ONE_SHOT",
    frictionLevel: 1,
    setting: "OUTDOOR",
    displayOrder: 19,
  },
  {
    slug: "g1-jun-firefly-spot-binjiang",
    title: "滨江森林公园夜观",
    body: "浦东高桥。近年上海公园里萤火虫最多的点（人民网 / 东方网都报道过）。有官方夜赏活动最稳，地铁 6 号线打车可达",
    gradeFrom: 1,
    gradeTo: 12,
    interests: NATURE_INTEREST,
    scheduleKind: "WINDOW",
    windowType: "SEASON_WINDOW",
    cadenceRole: "ONE_SHOT",
    frictionLevel: 2,
    setting: "OUTDOOR",
    displayOrder: 20,
  },
  {
    slug: "g1-jun-firefly-spot-botanical",
    title: "上海/辰山植物园夜观",
    body: "上海植物园（徐汇）有黄脉翅萤、条背萤等；辰山植物园（松江）夜赏需查公众号确认当年夜场是否开放",
    gradeFrom: 1,
    gradeTo: 12,
    interests: NATURE_INTEREST,
    scheduleKind: "WINDOW",
    windowType: "SEASON_WINDOW",
    cadenceRole: "ONE_SHOT",
    frictionLevel: 2,
    setting: "OUTDOOR",
    displayOrder: 21,
  },
  {
    slug: "g1-jun-firefly-spot-qingpu",
    title: "青浦金泽/朱家角夜观",
    body: "近郊水网地带，光污染低。自驾约 1 小时。密度大但点位多变要靠运气，需向当地观萤群打听",
    gradeFrom: 1,
    gradeTo: 12,
    interests: NATURE_INTEREST,
    scheduleKind: "WINDOW",
    windowType: "SEASON_WINDOW",
    cadenceRole: "ONE_SHOT",
    frictionLevel: 3,
    setting: "OUTDOOR",
    displayOrder: 22,
  },
  {
    slug: "g1-jun-firefly-method",
    title: "观萤现场规范",
    body: FIREFLY_METHOD_BODY,
    gradeFrom: 1,
    gradeTo: 12,
    interests: NATURE_INTEREST,
    scheduleKind: "WINDOW",
    windowType: "SEASON_WINDOW",
    cadenceRole: "ONE_SHOT",
    frictionLevel: 1,
    setting: "OUTDOOR",
    displayOrder: 23,
  },
  {
    slug: "g1-jun-firefly-backup",
    title: "观萤备选方案",
    body: FIREFLY_BACKUP_BODY,
    gradeFrom: 1,
    gradeTo: 12,
    interests: NATURE_CULTURE_INTEREST,
    scheduleKind: "WINDOW",
    windowType: "SEASON_WINDOW",
    cadenceRole: "ONE_SHOT",
    frictionLevel: 0,
    setting: "INDOOR",
    displayOrder: 24,
  },
  {
    slug: "g1-jun-firefly-sources",
    title: "萤火虫科普来源",
    body: FIREFLY_SOURCES_BODY,
    gradeFrom: 1,
    gradeTo: 12,
    interests: NATURE_INTEREST,
    scheduleKind: "WINDOW",
    windowType: "SEASON_WINDOW",
    cadenceRole: "ONE_SHOT",
    frictionLevel: 0,
    setting: "INDOOR",
    displayOrder: 25,
  },
  {
    slug: "g1-jun-firefly-notebook",
    title: "观萤观察本记录",
    body: "1 页记录夏至看萤火虫日记，手绘微光，无视看到与否的诚实记录",
    gradeFrom: 1,
    gradeTo: 12,
    interests: FOUNDATION_INTEREST,
    scheduleKind: "WINDOW",
    windowType: "SEASON_WINDOW",
    cadenceRole: "ANNUAL_RITUAL",
    frictionLevel: 0,
    setting: "EITHER",
    displayOrder: 26,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// CURATED VIEWS
// ─────────────────────────────────────────────────────────────────────────────

export const G1_JUN_CURATED_VIEWS: PathCuratedViewSeedRow[] = [
  {
    slug: "g1-jun-baseline",
    title: "6 月底盘",
    month: 6,
    leadLine: "六月是节气挤、雨水多的过渡月：端午 3 天小长假、入梅前后家门口生态突变、萤火虫高峰只开一周窗。每件事都不必大投入。",
    whySpecial: "4 个半天左右 · 端午一段 + 家门口若干 + 萤火虫一晚。≤ 总周末时间 35%，留一半以上给别的。",
    heart: "六月节气密、家长容易想\"全都做\"。挑 1 件做透比 4 件都做一半强。她记住的是\"6 月看了一次萤火虫\"，不是\"做了 6 件事\"。家门口反而是观察\"自然有节奏\"的最好实验室，因为变化是孩子能在 1 周内自己看见的。",
    output: "本子上 \"6 月观察清单\"——至少 1 个雨季动物 + 1 个夜观记录。两条就够。",
    serendipity: null,
    proseBlocks: [
      {
        key: "leadLine",
        label: "一句话",
        value: "六月是节气挤、雨水多的过渡月：端午 3 天小长假、入梅前后家门口生态突变、萤火虫高峰只开一周窗。每件事都不必大投入。",
      },
      {
        key: "timeBudget",
        label: "时间占用",
        value: "4 个半天左右 · 端午一段 + 家门口若干 + 萤火虫一晚。≤ 总周末时间 35%，留一半以上给别的。",
      },
      {
        key: "output",
        label: "产出",
        value: "本子上 \"6 月观察清单\"——至少 1 个雨季动物 + 1 个夜观记录。两条就够。",
      },
      {
        key: "heart",
        label: "心法",
        value: "六月节气密、家长容易想\"全都做\"。挑 1 件做透比 4 件都做一半强。她记住的是\"6 月看了一次萤火虫\"，不是\"做了 6 件事\"。家门口反而是观察\"自然有节奏\"的最好实验室，因为变化是孩子能在 1 周内自己看见的。",
      },
    ],
    defaultTightRatio: 50,
    frictionCeilingDefault: 3,
    displayOrder: 1,
  },
  {
    slug: "g1-jun-dragon-boat",
    title: "端午 3 天段",
    month: 6,
    leadLine: "每年 6/19–6/21 端午节假期。2026 年端午节假期为 6/19（周五）到 6/21（周日）。",
    whySpecial: "3 天小长假里用 **1 天** 做核心安排，30 分钟家里草药互动，其余时间留给家庭别的事。不要 3 天全排满。",
    heart: "节日仪式 = 一年一次的物候记忆锚点。她明年 6 月再闻到艾草，会自动想起\"哦端午\"。这种气味记忆比\"端午是纪念屈原\"留得更久。",
    output: "本子上画 艾 + 菖蒲 + 箬叶 3 种叶子的轮廓——不必精确，记住\"形状不同\"就行。",
    serendipity: null,
    proseBlocks: [
      {
        key: "leadLine",
        label: "触发条件",
        value: "每年 6/19–6/21 端午节假期。2026 年端午节假期为 6/19（周五）到 6/21（周日）。",
      },
      {
        key: "precondition",
        label: "前置",
        value: "家里有基本出行 planning 能力，没特别要求。",
      },
      {
        key: "timeBudget",
        label: "时间预算",
        value: "3 天小长假里用 **1 天** 做核心安排，30 分钟家里草药互动，其余时间留给家庭别的事。不要 3 天全排满。",
      },
      {
        key: "output",
        label: "产出",
        value: "本子上画 艾 + 菖蒲 + 箬叶 3 种叶子的轮廓——不必精确，记住\"形状不同\"就行。",
      },
      {
        key: "pitfalls",
        label: "避坑",
        value: "端午期间长途奔波容易被堵在路上。江浙短途出行需避开高速 6/19 早 + 6/21 晚两次出行峰值。",
      },
      {
        key: "heart",
        label: "心法",
        value: "节日仪式 = 一年一次的物候记忆锚点。她明年 6 月再闻到艾草，会自动想起\"哦端午\"。这种气味记忆比\"端午是纪念屈原\"留得更久。",
      },
    ],
    defaultTightRatio: 50,
    frictionCeilingDefault: 3,
    displayOrder: 2,
  },
  {
    slug: "g1-jun-rainy-season",
    title: "入梅家门口生态段",
    month: 6,
    leadLine: "2026 上海入梅常年平均 6 月 19 日前后（中下旬，气象局每年临 7 日内公告） · 入梅当天 + 1 周内黄金窗口。",
    whySpecial: "入梅当天 + 之后 1 周是黄金窗口——第一场连续雨之后小生物集体出现。错过这 1 周，很多就回到土里了。这张卡反过来——告诉家长她家 50 米内就有 100 种生物。低门槛、高频次，是月度 baseline 的支撑面。",
    heart: "“雨后第二天 7 点”是一个观察习惯 (routine)。一旦养成，她以后听到下雨就会期待第二天能看到什么。这是观察习惯，不是知识点。",
    output: "本子上 \"雨后清单\"——一次能记到 2–4 种。3 次累积下来，她对家门口物种数量会有自己的估计。",
    serendipity: null,
    proseBlocks: [
      {
        key: "leadLine",
        label: "触发条件",
        value: "2026 上海入梅常年平均 6 月 19 日前后（中下旬，气象局每年临 7 日内公告） · 入梅当天 + 1 周内黄金窗口。",
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
        value: "入梅当天 + 之后 1 周是黄金窗口——第一场连续雨之后小生物集体出现。错过这 1 周，很多就回到土里了。这张卡反过来——告诉家长她家 50 米内就有 100 种生物。低门槛、高频次，是月度 baseline 的支撑面。",
      },
      {
        key: "output",
        label: "产出",
        value: "本子上 \"雨后清单\"——一次能记到 2–4 种。3 次累积下来，她对家门口物种数量会有自己的估计。",
      },
      {
        key: "heart",
        label: "心法",
        value: "“雨后第二天 7 点”是一个观察习惯 (routine)。一旦养成，她以后听到下雨就会期待第二天能看到什么。这是观察习惯，不是知识点。",
      },
    ],
    defaultTightRatio: 50,
    frictionCeilingDefault: 3,
    displayOrder: 3,
  },
  {
    slug: "g1-jun-firefly",
    title: "夏至萤火虫段",
    month: 6,
    leadLine: "上海近郊萤火虫高峰在夏至到 7 月中旬（约 2026/06/21 – 07/15，部分点位窗口偏窄）。",
    whySpecial: "上海近郊萤火虫高峰在夏至到 7 月中旬（约 2026/06/21 – 07/15，部分点位窗口偏窄）。再早成虫期未到，再晚密度骤降。每年只开这一扇窗，错过等下一年。",
    heart: "萤火虫给孩子的不是知识，是\"季节性的稀缺\"。一年只能看一次的东西，比每天都能看的更让她记住。\"等一年再来\"的体验本身就是教育。",
    output: "本子上 1 页 \"6 月夏至看萤火虫\"——看到 / 没看到 都写。如果没看到，写\"明年再来\"。这是 portfolio 里\"自然没保证\"的诚实记录。",
    serendipity: null,
    proseBlocks: [
      {
        key: "leadLine",
        label: "触发条件",
        value: "夏至到 7 月中旬（2026 夏至 = 6/21） · 闷热无月光的夜晚最佳。",
      },
      {
        key: "precondition",
        label: "前置",
        value: "夜间出行心理准备（不怕黑、能遵守安静不亮光的指令）。",
      },
      {
        key: "time",
        label: "时间",
        value: "1 个夜晚 · 出发到回家约 4 小时（市区点）/ 6 小时（远郊）。",
      },
      {
        key: "whySpecial",
        label: "为什么特别",
        value: "上海近郊萤火虫高峰在夏至到 7 月中旬（约 2026/06/21 – 07/15，部分点位窗口偏窄）。再早成虫期未到，再晚密度骤降。每年只开这一扇窗，错过等下一年。",
      },
      {
        key: "output",
        label: "产出",
        value: "本子上 1 页 \"6 月夏至看萤火虫\"——看到 / 没看到 都写。如果没看到，写\"明年再来\"。这是 portfolio 里\"自然没保证\"的诚实记录。",
      },
      {
        key: "heart",
        label: "心法",
        value: "萤火虫给孩子的不是知识，是\"季节性的稀缺\"。一年只能看一次的东西，比每天都能看的更让她记住。\"等一年再来\"的体验本身就是教育。",
      },
    ],
    defaultTightRatio: 50,
    frictionCeilingDefault: 3,
    displayOrder: 4,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// WEAVING JOIN RELATIONS
// ─────────────────────────────────────────────────────────────────────────────

export const G1_JUN_VIEW_ATOM_LINKS: PathCuratedViewAtomSeedRow[] = [
  // 6月底盘 links
  { viewSlug: "g1-jun-baseline", atomSlug: "g1-jun-observation-notebook" },
  { viewSlug: "g1-jun-baseline", atomSlug: "g1-jun-bowu-jun-reading" },
  { viewSlug: "g1-jun-baseline", atomSlug: "g1-jun-bilibili-nature-watch" },
  { viewSlug: "g1-jun-baseline", atomSlug: "g1-jun-june-end-blank" },

  // 端午 3天段 links
  { viewSlug: "g1-jun-dragon-boat", atomSlug: "g1-jun-dragon-boat-minhang-pujiang" },
  { viewSlug: "g1-jun-dragon-boat", atomSlug: "g1-jun-dragon-boat-jiading-maoqiao" },
  { viewSlug: "g1-jun-dragon-boat", atomSlug: "g1-jun-dragon-boat-zhejiang-bayberry" },
  { viewSlug: "g1-jun-dragon-boat", atomSlug: "g1-jun-dragon-boat-home-moxibustion" },
  { viewSlug: "g1-jun-dragon-boat", atomSlug: "g1-jun-dragon-boat-herb-id" },
  { viewSlug: "g1-jun-dragon-boat", atomSlug: "g1-jun-dragon-boat-zongzi-leaf" },
  { viewSlug: "g1-jun-dragon-boat", atomSlug: "g1-jun-dragon-boat-notebook" },

  // 入梅家门口生态段 links
  { viewSlug: "g1-jun-rainy-season", atomSlug: "g1-jun-rainy-season-snail" },
  { viewSlug: "g1-jun-rainy-season", atomSlug: "g1-jun-rainy-season-earthworm" },
  { viewSlug: "g1-jun-rainy-season", atomSlug: "g1-jun-rainy-season-pillbug" },
  { viewSlug: "g1-jun-rainy-season", atomSlug: "g1-jun-rainy-season-frog" },
  { viewSlug: "g1-jun-rainy-season", atomSlug: "g1-jun-rainy-season-observation-steps" },
  { viewSlug: "g1-jun-rainy-season", atomSlug: "g1-jun-rainy-season-pitfalls" },
  { viewSlug: "g1-jun-rainy-season", atomSlug: "g1-jun-rainy-season-notebook" },

  // 夏至萤火虫段 links
  { viewSlug: "g1-jun-firefly", atomSlug: "g1-jun-firefly-window" },
  { viewSlug: "g1-jun-firefly", atomSlug: "g1-jun-firefly-spot-binjiang" },
  { viewSlug: "g1-jun-firefly", atomSlug: "g1-jun-firefly-spot-botanical" },
  { viewSlug: "g1-jun-firefly", atomSlug: "g1-jun-firefly-spot-qingpu" },
  { viewSlug: "g1-jun-firefly", atomSlug: "g1-jun-firefly-method" },
  { viewSlug: "g1-jun-firefly", atomSlug: "g1-jun-firefly-backup" },
  { viewSlug: "g1-jun-firefly", atomSlug: "g1-jun-firefly-sources" },
  { viewSlug: "g1-jun-firefly", atomSlug: "g1-jun-firefly-notebook" },
];

export const G1_JUN_ATOM_SEED = {
  stageSlug: G1_JUN_STAGE_SLUG,
  slugPrefix: "g1-jun-",
  atoms: G1_JUN_ATOMS,
  curatedViews: G1_JUN_CURATED_VIEWS,
  viewAtomLinks: G1_JUN_VIEW_ATOM_LINKS,
};
