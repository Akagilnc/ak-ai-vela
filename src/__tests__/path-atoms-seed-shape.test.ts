import { describe, expect, it } from "vitest";
import { readFileSync } from "fs";
import path from "path";
import {
  G1_MAY_ATOM_SEED,
  PATH_INTEREST_TAGS,
} from "../../docs/research/data/g1-may-atoms";

const SOURCE_MD = readFileSync(
  path.resolve(__dirname, "../../docs/research/path-explorer-sample-g1-may.md"),
  "utf8",
);

const SCHEDULE_KINDS = ["ALWAYS_ON", "WINDOW"] as const;
const WINDOW_TYPES = ["SOLAR_TERM", "HOLIDAY", "SEASON_WINDOW", null] as const;
const CADENCE_ROLES = [
  "ONE_SHOT",
  "LIGHT_RECURRING",
  "ANNUAL_RITUAL",
] as const;
const SETTINGS = ["OUTDOOR", "INDOOR", "EITHER"] as const;
const INTERESTS = PATH_INTEREST_TAGS;
const USER_FACING_VIEW_SCALAR_KEYS = [
  "leadLine",
  "whySpecial",
  "heart",
  "output",
  "serendipity",
] as const;

const EXPECTED_VIEW_ATOM_COUNTS: Record<string, number> = {
  "g1-may-baseline": 6,
  "g1-may-labor-holiday": 6,
  "g1-may-lixia-solar-term": 7,
  "g1-may-dongtan-migration-tail": 5,
  "g1-may-neighborhood-ecology": 4,
};

const EXPECTED_CURATED_PROSE_KEYS: Record<string, string[]> = {
  "g1-may-baseline": ["leadLine", "timeBudget", "output", "heart"],
  "g1-may-labor-holiday": [
    "leadLine",
    "precondition",
    "timeBudget",
    "output",
    "pitfalls",
    "heart",
  ],
  "g1-may-lixia-solar-term": [
    "leadLine",
    "precondition",
    "time",
    "whySpecial",
    "output",
    "heart",
  ],
  "g1-may-dongtan-migration-tail": [
    "leadLine",
    "precondition",
    "time",
    "whySpecial",
    "prepGuide",
    "howTo",
    "output",
    "pitfalls",
    "backupPlan",
    "backupHeart",
    "heart",
  ],
  "g1-may-neighborhood-ecology": [
    "leadLine",
    "precondition",
    "time",
    "whySpecial",
    "speciesGuide",
    "howTo",
    "output",
    "pitfalls",
    "heart",
    "sources",
  ],
};

const EXPECTED_CURATED_PROSE_SNIPPETS: Record<string, string[]> = {
  "g1-may-labor-holiday": [
    "家里有基本出行 planning 能力，没特别要求。",
    "5/1-3 上海各场馆人流峰值。提前预约票 + 尽量挪到 5/4 或 5/5。",
  ],
  "g1-may-lixia-solar-term": [
    "无。",
    "1-2 小时，不占 weekend 半天。",
  ],
  "g1-may-dongtan-migration-tail": [
    "**可能看到的候鸟（春末 5 月上中旬典型 5 种）**",
    "1. **周一查**：微信里搜“上海观鸟会”公众号",
    "6. **回家本子**：记 1-2 种观察到的鸟 + 日期 + 天气 + 简单印象句。",
    "**完全不去崇明 backup**（出门前天气预报糟糕直接放弃）：",
  ],
  "g1-may-neighborhood-ecology": [
    "家附近有任何绿化（小区内花坛 / 楼下绿地 / 社区公园即可）。完全 0 门槛。",
    "一次 15-30 分钟。可以拆成一周 2-3 次，每次 15 分钟。",
    "**5 种家门口可见的初夏生物**（带辨识特征）",
  ],
};

const EXPECTED_CURATED_PROSE_SOURCE_RANGES: Record<
  string,
  Record<string, readonly [start: string, end: string]>
> = {
  "g1-may-baseline": {
    leadLine: ["5 月春末夏初，天气刚好。", "周末 routine 2-3 次小 action 保持观察本在用。"],
    timeBudget: ["一个月 3-5 次 weekend 半天。", "留一半以上给别的。"],
    output: ["本子多 1-3 页图文；", "视频 1-2 期。"],
    heart: ['5 月是过渡月，不追求"做什么大事"。', "你能坚持 4 月的 routine 就是胜利。"],
  },
  "g1-may-labor-holiday": {
    leadLine: ["每年 5/1-5 假期。", "5/5（周二）。"],
    precondition: [
      "家里有基本出行 planning 能力，没特别要求。",
      "家里有基本出行 planning 能力，没特别要求。",
    ],
    timeBudget: [
      "5 天里用 **1-2 天** 做 nature-themed 活动，",
      "不要 5 天全排 Vela。",
    ],
    output: ["一次 mini-trip，", "观察本上 1-2 页新地方的记录。"],
    pitfalls: ["5/1-3 上海各场馆人流峰值。", "尽量挪到 5/4 或 5/5。"],
    heart: ['劳动节不是"冲刺日程"，', "不在于多。"],
  },
  "g1-may-lixia-solar-term": {
    leadLine: ["每年 5 月上旬立夏节气。", "刚好在劳动节假期内。"],
    precondition: ["无。", "无。"],
    time: ["1-2 小时，不占 weekend 半天。", "1-2 小时，不占 weekend 半天。"],
    whySpecial: [
      "立夏是 culture + nature 双触发点",
      "一年 24 节气是她和自然对表的锚点。",
    ],
    output: [
      "节气 log 1 页 + 家里 1 个 artifact",
      "这是 portfolio 里不刻意的 serendipity。",
    ],
    heart: ["节气不是传统文化 performance，", '不只是"放假 / 上学"。'],
  },
  "g1-may-dongtan-migration-tail": {
    leadLine: [
      "每年 5 月上中旬，春季候鸟最后一批离开上海。",
      "基本看不到了。",
    ],
    precondition: [
      "至少 1 次场馆观察经验（有\"安静看动物\"的习惯）。",
      "改用佘山 / 世纪公园 + 望远镜替代。",
    ],
    time: ["半天，6-8 小时含往返交通。", "半天，6-8 小时含往返交通。"],
    whySpecial: [
      "春季鸟类迁徙主季是 3-4 月，",
      '这是她第一次理解"自然有档期"的机会。',
    ],
    prepGuide: [
      "**可能看到的候鸟（春末 5 月上中旬典型 5 种）**",
      "不求 5 种全看到，能认出 1-2 种就是这一次的收获。",
    ],
    howTo: [
      "1. **周一查**：微信里搜“上海观鸟会”公众号，看 5/1-15 有没有家庭公开带队活动。",
      "文件夹里挑的那 1-2 张照片可以打印出来贴在本子旁边。",
    ],
    output: [
      "迁徙季最后一次观察记录。",
      "portfolio 多 1 条独特的 season-specific 素材（文字 + 视觉 + 文件时间戳）。",
    ],
    pitfalls: ["5 月中旬后基本看不到春季候鸟，别白跑。", "宁可 5/10 前去。"],
    backupPlan: [
      'G1 去东滩 carry 一定挫败风险（远 + 天气依赖 + 鸟靠运气）。预先和孩子说好 "如果今天运气不好看不到鸟，我们 plan B"，挫败感就降一半。',
      "- [佘山国家森林公园](https://english.shanghai.gov.cn/en-Parks/20231205/685f847c133a4b39878345651f1d179f.html)（松江，5 月林下植物 + 昆虫多）",
    ],
    backupHeart: [
      '提前准备 2-3 个"退一步也 OK"的替代方案，',
      '这个基线比"每次都看到鸟"更重要。',
    ],
    heart: ["自然有档期。错过这次等半年。", "这条经验她会记很久。"],
  },
  "g1-may-neighborhood-ecology": {
    leadLine: [
      "每年 5 月下旬起（上海大致 5/20 后），",
      "第一批初夏物种开始在城市绿化 / 小区 / 公园大量出现。",
    ],
    precondition: [
      "家附近有任何绿化（小区内花坛 / 楼下绿地 / 社区公园即可）。",
      "完全 0 门槛。",
    ],
    time: ["一次 15-30 分钟。", "可以拆成一周 2-3 次，每次 15 分钟。"],
    whySpecial: [
      "前面几张卡（场馆 / 东滩 / 节气）都有某种",
      "低门槛、高频次，是月度 baseline 的支撑面。",
    ],
    speciesGuide: [
      "**5 种家门口可见的初夏生物**（带辨识特征）",
      "不是只有东滩才有鸟 |",
    ],
    howTo: [
      "1. **蚁道观察**（15 分钟）：选一段有蚂蚁活动的人行道砖缝",
      "她能分出 2 种就够。",
    ],
    output: [
      '本子上的 "家门口生物 count"——一个月累积能记 10-20 种。',
      "这个数字她自己看着会长骄傲。",
    ],
    pitfalls: [
      "- **别用昆虫盒装回家**。",
      '中文名 / 她起的外号 / "那种会飞的蓝蝴蝶" 都行。',
    ],
    heart: ["自然不只在远方的保护区。", "家门口生态是 daily baseline。"],
    sources: [
      "- [图鉴] 《身边的昆虫》（科普出版社）/ 《中国鸟类野外手册》（湖南教育出版社，G2-G3 用）",
      '- iNaturalist APP 里"上海" 区域的 top observed species list',
    ],
  },
};

const PARENT_FACING_SOURCE_MD = SOURCE_MD.replaceAll(
  '（**不写**"反正顺路/又不亏"那种）',
  "",
)
  .replaceAll("| 图 | 中文名 | 辨识特征 | 难度 |", "| 中文名 | 辨识特征 | 难度 |")
  .replaceAll(
    "| 图 | 物种 | 家门口哪看 | 怎么让 G1 记住 |",
    "| 物种 | 家门口哪看 | 怎么让 G1 记住 |",
  )
  .replaceAll("|---|---|---|---|", "|---|---|---|")
  .replaceAll(
    "_(Vela ship 时图片直接内嵌到卡里，家长不用自己去查。图源 Day 3 authoring 时确定：Wikipedia CC 或 iNaturalist CC 授权照片优先。)_\n\n",
    "",
  )
  .replaceAll("_(Vela ship 时图片内嵌在卡里)_\n\n", "")
  .replace(/^\| `\[图：[^\]]+\]` \| /gm, "| ");

function atomBody(slug: string): string {
  const atom = G1_MAY_ATOM_SEED.atoms.find((item) => item.slug === slug);
  if (!atom) throw new Error(`${slug} atom must exist`);
  return atom.body;
}

function viewProse(slug: string): string {
  const view = G1_MAY_ATOM_SEED.curatedViews.find((item) => item.slug === slug);
  if (!view) throw new Error(`${slug} view must exist`);
  return view.proseBlocks.map((block) => `${block.label}\n${block.value}`).join("\n\n");
}

function viewProseBlock(slug: string, key: string) {
  const view = G1_MAY_ATOM_SEED.curatedViews.find((item) => item.slug === slug);
  if (!view) throw new Error(`${slug} view must exist`);
  const block = view.proseBlocks.find((item) => item.key === key);
  if (!block) throw new Error(`${slug}.${key} prose block must exist`);
  return block;
}

function sourceRange(start: string, end: string): string {
  const startIndex = PARENT_FACING_SOURCE_MD.indexOf(start);
  expect(startIndex, `${start} must exist in sanitized source MD`).toBeGreaterThanOrEqual(
    0,
  );
  const endIndex = PARENT_FACING_SOURCE_MD.indexOf(end, startIndex);
  expect(endIndex, `${end} must exist after ${start}`).toBeGreaterThanOrEqual(0);
  return PARENT_FACING_SOURCE_MD.slice(startIndex, endIndex + end.length).trim();
}

function expectProseBlockEqualsSourceRange(
  slug: string,
  key: string,
  start: string,
  end: string,
): void {
  expect(viewProseBlock(slug, key).value).toBe(sourceRange(start, end));
}

function expectCopiedSnippet(target: string, snippet: string): void {
  expect(SOURCE_MD, `${snippet} must exist in source MD`).toContain(snippet);
  expect(target, `${snippet} must be copied into atom body`).toContain(snippet);
}

function expectTaggedFromSource(
  interestsBySlug: Map<string, readonly string[]>,
  slug: string,
  sourceRow: string,
  expectedInterests: readonly string[],
): void {
  expect(SOURCE_MD, `${slug} source row`).toContain(sourceRow);
  expect(interestsBySlug.get(slug), `${slug}.interests`).toEqual(
    expectedInterests,
  );
}

describe("G1 May atom seed", () => {
  it("exports the curated May atom pool and five curated views", () => {
    expect(G1_MAY_ATOM_SEED.stageSlug).toBe("g1-to-g3-foundation");
    expect(G1_MAY_ATOM_SEED.slugPrefix).toBe("g1-may-");
    expect(G1_MAY_ATOM_SEED.atoms.length).toBeGreaterThanOrEqual(26);
    expect(G1_MAY_ATOM_SEED.atoms.length).toBeLessThanOrEqual(30);
    expect(G1_MAY_ATOM_SEED.curatedViews).toHaveLength(5);

    const viewSlugs = G1_MAY_ATOM_SEED.curatedViews.map((view) => view.slug);
    expect(new Set(viewSlugs).size).toBe(viewSlugs.length);
    expect(viewSlugs).toEqual(Object.keys(EXPECTED_VIEW_ATOM_COUNTS));
    expect(G1_MAY_ATOM_SEED.curatedViews.every((view) => view.month === 5)).toBe(
      true,
    );
  });

  it("keeps every atom inside the allowed tag vocabulary", () => {
    const slugs = G1_MAY_ATOM_SEED.atoms.map((atom) => atom.slug);
    expect(new Set(slugs).size).toBe(slugs.length);

    for (const atom of G1_MAY_ATOM_SEED.atoms) {
      expect(atom.title, `${atom.slug}.title`).toBeTruthy();
      expect(atom.body, `${atom.slug}.body`).toBeTruthy();
      expect(atom.gradeFrom, `${atom.slug}.gradeFrom`).toBeGreaterThanOrEqual(1);
      expect(atom.gradeTo, `${atom.slug}.gradeTo`).toBeLessThanOrEqual(12);
      expect(atom.gradeFrom, `${atom.slug}.grade span`).toBeLessThanOrEqual(
        atom.gradeTo,
      );
      expect(atom.interests.length, `${atom.slug}.interests`).toBeGreaterThan(0);
      expect(new Set(atom.interests).size, `${atom.slug}.interests`).toBe(
        atom.interests.length,
      );
      for (const interest of atom.interests) {
        expect(INTERESTS, `${atom.slug}.interest:${interest}`).toContain(
          interest,
        );
      }
      expect(SCHEDULE_KINDS, `${atom.slug}.scheduleKind`).toContain(
        atom.scheduleKind,
      );
      expect(WINDOW_TYPES, `${atom.slug}.windowType`).toContain(atom.windowType);
      expect(CADENCE_ROLES, `${atom.slug}.cadenceRole`).toContain(
        atom.cadenceRole,
      );
      expect(atom.frictionLevel, `${atom.slug}.frictionLevel`).toBeGreaterThanOrEqual(
        0,
      );
      expect(atom.frictionLevel, `${atom.slug}.frictionLevel`).toBeLessThanOrEqual(
        3,
      );
      expect(SETTINGS, `${atom.slug}.setting`).toContain(atom.setting);
      expect(Number.isInteger(atom.displayOrder), `${atom.slug}.displayOrder`).toBe(
        true,
      );
    }
  });

  it("does not leak internal authoring annotations into parent-facing atom bodies", () => {
    const combined = [
      ...G1_MAY_ATOM_SEED.atoms.map((atom) => `${atom.title}\n${atom.body}`),
      ...G1_MAY_ATOM_SEED.curatedViews.flatMap((view) => [
        view.title,
        ...view.proseBlocks.map((block) => `${block.label}\n${block.value}`),
        ...USER_FACING_VIEW_SCALAR_KEYS.flatMap((key) => {
          const value = view[key];
          return value ? [`${key}\n${value}`] : [];
        }),
      ]),
    ].join("\n\n");

    expect(combined).not.toContain("兴趣对得上才进贴身");
    expect(combined).not.toContain("偏自然观察的娃才进贴身");
    expect(combined).not.toContain("失败友好");
    expect(combined).not.toContain("backup 设计哲学");
    expect(combined).not.toContain("槽 =");
    expect(combined).not.toContain("家庭风格函数");
    expect(combined).not.toContain("无信号兜底");
    expect(combined).not.toContain("折腾天花板");
    expect(combined).not.toContain("探索席位");
    expect(combined).not.toContain("读数下的一种填法示例");
    expect(combined).not.toContain("可调旋钮");
    expect(combined).not.toContain("文案给家长");
    expect(combined).not.toContain("样板自检");
    expect(combined).not.toContain("authoring 单元");
    expect(combined).not.toContain("Day 3 authoring");
    expect(combined).not.toContain("Vela ship");
    expect(combined).not.toContain("图源 Day");
    expect(combined).not.toContain("CC 授权");
    expect(combined).not.toContain("[图：");
    expect(combined).not.toContain("**不写**");
    expect(combined).not.toContain("反正顺路");
    expect(combined).not.toContain("又不亏");
  });

  it("keeps source citations scoped to the authored neighborhood ecology prose block", () => {
    const sourceBearingAtomSlugs = G1_MAY_ATOM_SEED.atoms
      .filter((atom) => atom.body.includes("**Sources**"))
      .map((atom) => atom.slug);

    expect(sourceBearingAtomSlugs).toEqual([]);
    expect(viewProseBlock("g1-may-neighborhood-ecology", "sources").value).toContain(
      "iNaturalist APP",
    );
  });

  it("keeps museum routes, age adjustments, trivia, and source notes in atom bodies", () => {
    const naturalHistory = atomBody("g1-may-shanghai-natural-history-route");
    const oceanAquarium = atomBody("g1-may-shanghai-ocean-aquarium-route");

    for (const snippet of [
      "**上海自然博物馆 · G1-G3 推荐路线（90 分钟，按龄调档）**",
      "- **G1**：上面 4 步原样。每区停留短，重\"看到 + 有印象\"，不要求记名字。家长全程带。",
      "- **G2**：每区多停 5-10 min；生态万象让她**自己找** 1-2 种\"在东滩见过的\"，建立\"展陈 ↔ 野外\"对应。回家本子记 2-3 种。",
      "- **G3**：路线她**自己看导览图带路**；生命长河加一个\"挑一种最感兴趣的回家查它吃什么/活在哪个年代\"的小任务；探索中心选一个互动展深玩而不是走马观花。家长退到旁观。",
      "_[具体展区位置以自博当日导览图为准，展区会不定期更新 — 家长可提前 [snhm.org.cn](https://www.snhm.org.cn) 查当月特展]_",
      "Vela 是家长的 speaking-point teleprompter，不是 homework。",
    ]) {
      expectCopiedSnippet(naturalHistory, snippet);
    }

    for (const snippet of [
      "**上海海洋水族馆 · G1 推荐路线（90 分钟）**",
      "水下穿行感 = 很多 G1 第一次。",
      "2. **长江区（中国淡水）** — 15-20 min。中华鲟 / 扬子鳄这些本土物种，可以讲\"这些动物就住在离我们不远的长江\"。",
      "💬 **可以讲的小故事**（家长现场点开看，挑一个讲）",
      "中华鲟是\"活化石\"——这个家族 1.5 亿年前就在地球上，和恐龙生活在同一个时代，也熬过了恐龙灭绝后的漫长时间",
      "长江江豚被叫\"微笑天使\"，2022 年普查约 1200 多头，数量第一次回升",
      "企鹅不是\"北极动物\"——野生企鹅主要在南半球，北极没有",
      "- **G2**：长江区多停 5 min，让她自己找 1 种\"本土物种\"，说出它为什么和长江有关。",
      "- **G3**：她自己选 1 个展区查证 1 个问题，比如\"企鹅为什么不是北极动物\"，回家写 2 句。",
      "_[展区以馆当日实际开放为准，[sh-aquarium.com](https://www.sh-aquarium.com/zh/html/index.aspx) 查当日动线]_",
      "Vela 是家长的 speaking-point teleprompter，不是 homework。",
    ]) {
      expectCopiedSnippet(oceanAquarium, snippet);
    }
  });

  it("keeps Dongtan rich parent prose in curated prose blocks", () => {
    const prose = viewProse("g1-may-dongtan-migration-tail");

    for (const bird of [
      "反嘴鹬",
      "黑翅长脚鹬",
      "金眶鸻",
      "黑腹滨鹬",
      "红嘴鸥",
    ]) {
      expectCopiedSnippet(prose, bird);
    }

    for (const snippet of [
      "**前置**：至少 1 次场馆观察经验（有\"安静看动物\"的习惯）。G1 没有的话，改用佘山 / 世纪公园 + 望远镜替代。",
      "**时间**：半天，6-8 小时含往返交通。",
      "**为什么是这个时间窗**：春季鸟类迁徙主季是 3-4 月，但 5 月初还能赶上最后一批。",
      "**可能看到的候鸟（春末 5 月上中旬典型 5 种）**",
      '黑白相间，嘴长且向上翘，像"反"过来的针',
      "背黑、腹白、粉红色腿超长，远看像踩高跷",
      '小型鸻鹬，眼周金黄色环。G1 可能看不清细节，但"小圆身" 好认',
      "繁殖羽时腹部明显黑色斑，群体活动",
      "红色嘴、灰白身。常见种，5 月仍在尾声群",
      "不求 5 种全看到，能认出 1-2 种就是这一次的收获。",
      "**周一查**：微信里搜“上海观鸟会”公众号",
      "**有带队跟团**：带望远镜（没有也行，用手机最大变焦）+ 防晒 + 防蚊喷雾 + 水 + 零食。",
      "**无带队自行去**：崇明东滩南六公路入口，[dongtan.cn](https://www.dongtan.cn) 查当日开放时间。",
      "**现场**：**不求看到多少种**。能认出上面表里任意 1-2 种 + 看到一次\"一群飞起\"或\"一次进食\"，就已经值了。",
      "**拍摄指引**：现场拍 5-10 张照片 + 2-3 段 15 秒视频足够。",
      "**回家本子**：记 1-2 种观察到的鸟 + 日期 + 天气 + 简单印象句。",
      "**产出**：迁徙季最后一次观察记录。portfolio 多 1 条独特的 season-specific 素材（文字 + 视觉 + 文件时间戳）。",
      "**避坑**：5 月中旬后基本看不到春季候鸟，别白跑。",
      'G1 去东滩 carry 一定挫败风险（远 + 天气依赖 + 鸟靠运气）。预先和孩子说好 "如果今天运气不好看不到鸟，我们 plan B"，挫败感就降一半。',
      "**就近 backup（东滩同日）**：崇明岛内 [东平国家森林公园](https://www.dpslpark.net/)",
      "**完全不去崇明 backup**（出门前天气预报糟糕直接放弃）：",
      '**重要心法**：提前准备 2-3 个"退一步也 OK"的替代方案，家长才敢带孩子出门。',
      "**心法**：自然有档期。错过这次等半年。这条经验她会记很久。",
    ]) {
      const sourceSnippet = snippet
        .replace("**前置**：", "")
        .replace("**时间**：", "")
        .replace("**为什么是这个时间窗**：", "")
        .replace("**产出**：", "")
        .replace("**避坑**：", "")
        .replace("**重要心法**：", "")
        .replace("**心法**：", "");
      expect(SOURCE_MD, `${snippet} must exist in source MD`).toContain(sourceSnippet);
      expect(prose, `${snippet} must be copied into curated prose`).toContain(
        sourceSnippet,
      );
    }

    expectProseBlockEqualsSourceRange(
      "g1-may-dongtan-migration-tail",
      "prepGuide",
      "**可能看到的候鸟（春末 5 月上中旬典型 5 种）**",
      "不求 5 种全看到，能认出 1-2 种就是这一次的收获。",
    );
    expectProseBlockEqualsSourceRange(
      "g1-may-dongtan-migration-tail",
      "howTo",
      "1. **周一查**：微信里搜“上海观鸟会”公众号，看 5/1-15 有没有家庭公开带队活动。",
      "文件夹里挑的那 1-2 张照片可以打印出来贴在本子旁边。",
    );
    expectProseBlockEqualsSourceRange(
      "g1-may-dongtan-migration-tail",
      "pitfalls",
      "5 月中旬后基本看不到春季候鸟，别白跑。",
      "宁可 5/10 前去。",
    );
    expectProseBlockEqualsSourceRange(
      "g1-may-dongtan-migration-tail",
      "backupPlan",
      'G1 去东滩 carry 一定挫败风险（远 + 天气依赖 + 鸟靠运气）。预先和孩子说好 "如果今天运气不好看不到鸟，我们 plan B"，挫败感就降一半。',
      "- [佘山国家森林公园](https://english.shanghai.gov.cn/en-Parks/20231205/685f847c133a4b39878345651f1d179f.html)（松江，5 月林下植物 + 昆虫多）",
    );
    expectProseBlockEqualsSourceRange(
      "g1-may-dongtan-migration-tail",
      "backupHeart",
      '提前准备 2-3 个"退一步也 OK"的替代方案，',
      '这个基线比"每次都看到鸟"更重要。',
    );

    expect(atomBody("g1-may-dongtan-birding-main")).not.toContain(
      "2026-05-10 东滩",
    );

    expect(atomBody("g1-may-dongping-forest-backup")).toContain(
      "崇明岛内 [东平国家森林公园](https://www.dpslpark.net/)",
    );
    expect(atomBody("g1-may-chenshan-botanical-backup")).toContain(
      "[辰山植物园](https://www.csnbgsh.cn/)",
    );
    expect(atomBody("g1-may-dongtan-century-park-backup")).toContain(
      "[世纪公园](https://www.shanghai.gov.cn/nw4411/20240417/479731e035004c3e9a03dd6c5cfe3099.html)",
    );
    expect(atomBody("g1-may-dongtan-sheshan-backup")).toContain(
      "[佘山国家森林公园](https://english.shanghai.gov.cn/en-Parks/20231205/685f847c133a4b39878345651f1d179f.html)",
    );
  });

  it("keeps scalar curated prose blocks exact instead of substring-only", () => {
    for (const [slug, ranges] of Object.entries({
      "g1-may-baseline": [
        ["leadLine", "5 月春末夏初，天气刚好。", "周末 routine 2-3 次小 action 保持观察本在用。"],
        ["timeBudget", "一个月 3-5 次 weekend 半天。", "留一半以上给别的。"],
        ["output", "本子多 1-3 页图文；", "视频 1-2 期。"],
        ["heart", '5 月是过渡月，不追求"做什么大事"。', "你能坚持 4 月的 routine 就是胜利。"],
      ],
      "g1-may-labor-holiday": [
        ["leadLine", "每年 5/1-5 假期。", "5/5（周二）。"],
        ["precondition", "家里有基本出行 planning 能力，没特别要求。", "家里有基本出行 planning 能力，没特别要求。"],
        ["timeBudget", "5 天里用 **1-2 天** 做 nature-themed 活动，", "不要 5 天全排 Vela。"],
        ["output", "一次 mini-trip，", "观察本上 1-2 页新地方的记录。"],
        ["pitfalls", "5/1-3 上海各场馆人流峰值。", "尽量挪到 5/4 或 5/5。"],
        ["heart", '劳动节不是"冲刺日程"，', "不在于多。"],
      ],
      "g1-may-lixia-solar-term": [
        ["leadLine", "每年 5 月上旬立夏节气。", "刚好在劳动节假期内。"],
        ["precondition", "无。", "无。"],
        ["time", "1-2 小时，不占 weekend 半天。", "1-2 小时，不占 weekend 半天。"],
        ["whySpecial", "立夏是 culture + nature 双触发点", "一年 24 节气是她和自然对表的锚点。"],
        ["output", "节气 log 1 页 + 家里 1 个 artifact", "这是 portfolio 里不刻意的 serendipity。"],
        ["heart", "节气不是传统文化 performance，", '不只是"放假 / 上学"。'],
      ],
    })) {
      for (const [key, start, end] of ranges) {
        expectProseBlockEqualsSourceRange(slug, key, start, end);
      }
    }
  });

  it("keeps neighborhood species, how-to, pitfalls, and heart in curated prose", () => {
    const prose = viewProse("g1-may-neighborhood-ecology");
    const combined = [
      "g1-may-neighborhood-ant-trail",
      "g1-may-neighborhood-butterfly-tracking",
      "g1-may-neighborhood-pillbug-exploration",
      "g1-may-neighborhood-bird-sounds",
    ]
      .map(atomBody)
      .join("\n\n");

    expect(SOURCE_MD).toContain("**Sources**（Day 3 authoring 补全）：");
    expect(combined).not.toContain("**Sources**");
    expect(prose).toContain("iNaturalist APP");

    for (const species of ["菜粉蝶", "玉带凤蝶", "家蚁", "西瓜虫", "树麻雀"]) {
      expectCopiedSnippet(prose, species);
    }

    for (const snippet of [
      "**5 种家门口可见的初夏生物**（带辨识特征）",
      '小区花坛，任何开花植物 | "白色小蝴蝶"—— 她第一个认识的蝴蝶',
      '公园里，飞得高 | "大蝴蝶"—— 比菜粉蝶大 3 倍，她一眼能感觉出"不一样"',
      "任何人行道砖缝 | 带她看 **蚁道**（一队蚂蚁搬东西的路线）—— 社会性昆虫第一印象",
      '花盆底 / 落叶下 / 石头下 | "会缩成球的小灰虫"—— G1 最爱的触碰互动',
      '家楼下、街角、任何树上 | 最熟悉的鸟。重点是让她意识到"这也是鸟"—— 不是只有东滩才有鸟',
      "**蚁道观察**（15 分钟）",
      "**蝴蝶追踪**（20 分钟）",
      "**潮虫探险**（10 分钟）",
      "**楼下鸟声**（5 分钟）",
      '本子上的 "家门口生物 count"——一个月累积能记 10-20 种。',
      "**别用昆虫盒装回家**",
      "**别用杀虫剂 / 驱蚊液喷她的观察对象**。",
      "**别强求\"记住拉丁名\"**。",
      '长期下来，她对"自然"的语言会从"我在公园里看到过"变成"我家楼下的麻雀今年比去年少"。',
      "这是城市 G1 孩子的**唯一低成本、高频次、可持续的自然连接方式**。",
      "- [图鉴] 《身边的昆虫》（科普出版社）/ 《中国鸟类野外手册》（湖南教育出版社，G2-G3 用）",
      "- iNaturalist APP 里\"上海\" 区域的 top observed species list",
    ]) {
      expectCopiedSnippet(prose, snippet);
    }

    expectProseBlockEqualsSourceRange(
      "g1-may-neighborhood-ecology",
      "speciesGuide",
      "**5 种家门口可见的初夏生物**（带辨识特征）",
      "不是只有东滩才有鸟 |",
    );
    expectProseBlockEqualsSourceRange(
      "g1-may-neighborhood-ecology",
      "howTo",
      "1. **蚁道观察**（15 分钟）：选一段有蚂蚁活动的人行道砖缝",
      "她能分出 2 种就够。",
    );
    expectProseBlockEqualsSourceRange(
      "g1-may-neighborhood-ecology",
      "pitfalls",
      "- **别用昆虫盒装回家**。",
      '中文名 / 她起的外号 / "那种会飞的蓝蝴蝶" 都行。',
    );
    expectProseBlockEqualsSourceRange(
      "g1-may-neighborhood-ecology",
      "heart",
      "自然不只在远方的保护区。",
      "家门口生态是 daily baseline。",
    );
    expectProseBlockEqualsSourceRange(
      "g1-may-neighborhood-ecology",
      "sources",
      "- [图鉴] 《身边的昆虫》（科普出版社）/ 《中国鸟类野外手册》（湖南教育出版社，G2-G3 用）",
      '- iNaturalist APP 里"上海" 区域的 top observed species list',
    );

    expect(combined).toContain("**蚁道观察**（15 分钟）");
    expect(combined).toContain("**蝴蝶追踪**（20 分钟）");
    expect(combined).toContain("**潮虫探险**（10 分钟）");
    expect(combined).toContain("**楼下鸟声**（5 分钟）");
  });

  it("derives multi-value atom interests from the MD tags instead of hardcoding nature", () => {
    const interestsBySlug = new Map(
      G1_MAY_ATOM_SEED.atoms.map((atom) => [atom.slug, atom.interests]),
    );

    expectTaggedFromSource(
      interestsBySlug,
      "g1-may-observation-notebook",
      "| 观察本记录 | G1-G12 | 跨兴趣底盘 |",
      ["foundation"],
    );
    expectTaggedFromSource(
      interestsBySlug,
      "g1-may-bowu-may-reading",
      "| 《博物》5 月号阅读 | G1-G12 | 自然+文化 |",
      ["nature", "culture"],
    );
    expectTaggedFromSource(
      interestsBySlug,
      "g1-may-labor-dongtan-birding-day-trip",
      "| 崇明东滩观鸟（日返） | G1-G6 | 自然（窄·观鸟） |",
      ["nature", "birding"],
    );
    expectTaggedFromSource(
      interestsBySlug,
      "g1-may-labor-suzhou-taihu-wetland",
      "| 苏州太湖湿地公园 | G1-G3 | 自然（观鸟入门） |",
      ["nature", "birding"],
    );
    expectTaggedFromSource(
      interestsBySlug,
      "g1-may-lixia-egg-battle",
      "| 立夏·斗蛋 | G1-G6 | 文化 |",
      ["culture"],
    );
    expectTaggedFromSource(
      interestsBySlug,
      "g1-may-lixia-weighing",
      "| 立夏·秤人 | G1-G12 | 文化 |",
      ["culture"],
    );
    expectTaggedFromSource(
      interestsBySlug,
      "g1-may-lixia-green-bookmark",
      "| 立夏·采新绿书签 | G1-G12 | 自然+手作 |",
      ["nature", "craft"],
    );
    expectTaggedFromSource(
      interestsBySlug,
      "g1-may-lixia-observation-note",
      "| 立夏·观察本记录 | G1-G12 | 跨兴趣底盘 |",
      ["foundation"],
    );
    expectTaggedFromSource(
      interestsBySlug,
      "g1-may-lixia-solar-term-reading",
      "| 立夏·节气阅读 | G1-G12 | 文化 |",
      ["culture"],
    );
    expectTaggedFromSource(
      interestsBySlug,
      "g1-may-dongtan-birding-main",
      "| 东滩观鸟（主） | G1-G6（候鸟表难度列内置分档） | 自然·窄（纯观鸟） |",
      ["nature", "birding"],
    );
    expectTaggedFromSource(
      interestsBySlug,
      "g1-may-chenshan-botanical-backup",
      "| 辰山植物园（回程 backup） | G1-G3 | 自然·花 |",
      ["nature", "flower"],
    );
  });

  it("keeps every curated view usable and its prose verbatim from the source MD", () => {
    for (const view of G1_MAY_ATOM_SEED.curatedViews) {
      expect(view.title, `${view.slug}.title`).toBeTruthy();
      expect(view.month, `${view.slug}.month`).toBe(5);
      expect(view.whySpecial, `${view.slug}.whySpecial`).toBeTruthy();
      expect(view.heart, `${view.slug}.heart`).toBeTruthy();
      expect(view.defaultTightRatio, `${view.slug}.defaultTightRatio`).toBe(50);
      expect(view.frictionCeilingDefault, `${view.slug}.frictionCeilingDefault`).toBe(
        3,
      );

      for (const field of [
        "leadLine",
        "whySpecial",
        "heart",
        "output",
        "serendipity",
      ] as const) {
        const value = view[field];
        if (value == null || value === "") continue;
        expect(SOURCE_MD, `${view.slug}.${field} must be copied verbatim`).toContain(
          value,
        );
      }

      const proseBlocks = view.proseBlocks ?? [];
      const expectedProseKeys = EXPECTED_CURATED_PROSE_KEYS[view.slug];
      const expectedSourceRanges = EXPECTED_CURATED_PROSE_SOURCE_RANGES[view.slug];
      if (!expectedProseKeys) {
        throw new Error(`${view.slug} must declare expected prose block coverage`);
      }
      if (!expectedSourceRanges) {
        throw new Error(`${view.slug} must declare exact source ranges`);
      }
      expect(Object.keys(expectedSourceRanges), `${view.slug}.source ranges`).toEqual(
        expectedProseKeys,
      );
      expect(
        proseBlocks.map((block) => block.key),
        `${view.slug}.proseBlocks keys`,
      ).toEqual(expectedProseKeys);
      expect(proseBlocks.length, `${view.slug}.proseBlocks`).toBeGreaterThan(0);
      for (const block of proseBlocks) {
        const range = expectedSourceRanges[block.key];
        if (!range) throw new Error(`${view.slug}.${block.key} source range missing`);
        expect(block.label, `${view.slug}.${block.key}.label`).toBeTruthy();
        expect(block.value, `${view.slug}.${block.key}.value`).toBeTruthy();
        expect(block.value, `${view.slug}.${block.key} must be copied verbatim`).toBe(
          sourceRange(...range),
        );
      }

      for (const snippet of EXPECTED_CURATED_PROSE_SNIPPETS[view.slug] ?? []) {
        expect(
          proseBlocks.some((block) => block.value.includes(snippet)),
          `${view.slug} must preserve source snippet: ${snippet}`,
        ).toBe(true);
      }
    }
  });

  it("resolves every curated-view atom membership reference", () => {
    const atomSlugs = new Set(G1_MAY_ATOM_SEED.atoms.map((atom) => atom.slug));
    const viewSlugs = new Set(
      G1_MAY_ATOM_SEED.curatedViews.map((view) => view.slug),
    );

    for (const [viewSlug, count] of Object.entries(EXPECTED_VIEW_ATOM_COUNTS)) {
      const links = G1_MAY_ATOM_SEED.viewAtomLinks.filter(
        (link) => link.viewSlug === viewSlug,
      );
      expect(links, `${viewSlug}.links`).toHaveLength(count);
    }

    for (const link of G1_MAY_ATOM_SEED.viewAtomLinks) {
      expect(viewSlugs.has(link.viewSlug), `${link.viewSlug} view ref`).toBe(true);
      expect(atomSlugs.has(link.atomSlug), `${link.atomSlug} atom ref`).toBe(true);
    }
  });
});
