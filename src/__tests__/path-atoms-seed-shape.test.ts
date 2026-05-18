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

const EXPECTED_VIEW_ATOM_COUNTS: Record<string, number> = {
  "g1-may-baseline": 6,
  "g1-may-labor-holiday": 6,
  "g1-may-lixia-solar-term": 7,
  "g1-may-dongtan-migration-tail": 5,
  "g1-may-neighborhood-ecology": 4,
};

function atomBody(slug: string): string {
  const atom = G1_MAY_ATOM_SEED.atoms.find((item) => item.slug === slug);
  if (!atom) throw new Error(`${slug} atom must exist`);
  return atom.body;
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
    const combined = G1_MAY_ATOM_SEED.atoms
      .map((atom) => `${atom.title}\n${atom.body}`)
      .join("\n\n");

    expect(combined).not.toContain("兴趣对得上才进贴身");
    expect(combined).not.toContain("失败友好 backup");
    expect(combined).not.toContain("样板自检");
    expect(combined).not.toContain("authoring 单元");
    expect(combined).not.toContain("Day 3 authoring");
    expect(combined).not.toContain("Vela ship");
    expect(combined).not.toContain("图源 Day");
    expect(combined).not.toContain("CC 授权");
    expect(combined).not.toContain("[图：");
  });

  it("keeps source citations scoped to the authored neighborhood ecology atom", () => {
    const sourceBearingAtomSlugs = G1_MAY_ATOM_SEED.atoms
      .filter((atom) => atom.body.includes("**Sources**"))
      .map((atom) => atom.slug);

    expect(sourceBearingAtomSlugs).toEqual(["g1-may-neighborhood-bird-sounds"]);
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

  it("keeps Dongtan rich parent prose in atom bodies instead of compressed notes", () => {
    const main = atomBody("g1-may-dongtan-birding-main");

    for (const bird of [
      "反嘴鹬",
      "黑翅长脚鹬",
      "金眶鸻",
      "黑腹滨鹬",
      "红嘴鸥",
    ]) {
      expectCopiedSnippet(main, bird);
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
      "**周一查**：[上海观鸟会 shwbs.org]",
      "**有带队跟团**：带望远镜（没有也行，用手机最大变焦）+ 防晒 + 防蚊喷雾 + 水 + 零食。",
      "**无带队自行去**：崇明东滩南六公路入口，[dongtan.cn](https://www.dongtan.cn) 查当日开放时间。",
      "**现场**：**不求看到多少种**。能认出上面表里任意 1-2 种 + 看到一次\"一群飞起\"或\"一次进食\"，就已经值了。",
      "**拍摄指引**：现场拍 5-10 张照片 + 2-3 段 15 秒视频足够。",
      "**回家本子**：记 1-2 种观察到的鸟 + 日期 + 天气 + 简单印象句。",
      "**产出**：迁徙季最后一次观察记录。portfolio 多 1 条独特的 season-specific 素材（文字 + 视觉 + 文件时间戳）。",
      "**避坑**：5 月中旬后基本看不到春季候鸟，别白跑。",
      'G1 去东滩 carry 一定挫败风险（远 + 天气依赖 + 鸟靠运气）。预先和孩子说好 "如果今天运气不好看不到鸟，我们 plan B"，挫败感就降一半。',
      '**重要心法**（backup 设计哲学）：**预设"失败友好" 的 2-3 个 backup**，家长敢带孩子出门。',
      '一次成功记忆 × 几次"退一步也 OK"记忆 = 她长期对"自然探索"不抗拒。',
      "**心法**：自然有档期。错过这次等半年。这条经验她会记很久。",
    ]) {
      expectCopiedSnippet(main, snippet);
    }

    expect(atomBody("g1-may-dongping-forest-backup")).toContain(
      "崇明岛内 [东平国家森林公园](http://www.dpforest.com)",
    );
    expect(atomBody("g1-may-chenshan-botanical-backup")).toContain(
      "[辰山植物园](http://www.csnbgsh.cn)",
    );
    expect(atomBody("g1-may-dongtan-century-park-backup")).toContain(
      "[世纪公园](http://www.centurypark.com.cn)",
    );
    expect(atomBody("g1-may-dongtan-sheshan-backup")).toContain(
      "[佘山国家森林公园](http://www.shfestival.com/sheshan)",
    );
  });

  it("keeps neighborhood species, how-to, pitfalls, and heart in atom bodies", () => {
    const combined = [
      "g1-may-neighborhood-ant-trail",
      "g1-may-neighborhood-butterfly-tracking",
      "g1-may-neighborhood-pillbug-exploration",
      "g1-may-neighborhood-bird-sounds",
    ]
      .map(atomBody)
      .join("\n\n");

    expect(SOURCE_MD).toContain("**Sources**（Day 3 authoring 补全）：");
    expect(combined).toContain("**Sources**：");

    for (const species of ["菜粉蝶", "玉带凤蝶", "家蚁", "西瓜虫", "树麻雀"]) {
      expectCopiedSnippet(combined, species);
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
      '**产出**：本子上的 "家门口生物 count"——一个月累积能记 10-20 种。',
      "**别用昆虫盒装回家**",
      "**别用杀虫剂 / 驱蚊液喷她的观察对象**。",
      "**别强求\"记住拉丁名\"**。",
      '长期下来，她对"自然"的语言会从"我在公园里看到过"变成"我家楼下的麻雀今年比去年少"。',
      "这是城市 G1 孩子的**唯一低成本、高频次、可持续的自然连接方式**。",
      "- [图鉴] 《身边的昆虫》（科普出版社）/ 《中国鸟类野外手册》（湖南教育出版社，G2-G3 用）",
      "- iNaturalist APP 里\"上海\" 区域的 top observed species list",
    ]) {
      expectCopiedSnippet(combined, snippet);
    }
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
