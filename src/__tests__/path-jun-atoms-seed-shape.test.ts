import { describe, expect, it } from "vitest";
import { readFileSync } from "fs";
import path from "path";
import {
  G1_JUN_ATOM_SEED,
} from "../../docs/research/data/g1-jun-atoms";
import {
  PATH_INTEREST_TAGS,
} from "../../docs/research/data/g1-may-atoms";

const SOURCE_MD = readFileSync(
  path.resolve(__dirname, "../../docs/research/path-explorer-sample-g1-jun.md"),
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
  "g1-jun-baseline": 4,
  "g1-jun-dragon-boat": 7,
  "g1-jun-rainy-season": 7,
  "g1-jun-firefly": 8,
};

const EXPECTED_CURATED_PROSE_KEYS: Record<string, string[]> = {
  "g1-jun-baseline": ["leadLine", "timeBudget", "output", "heart"],
  "g1-jun-dragon-boat": [
    "leadLine",
    "precondition",
    "timeBudget",
    "output",
    "pitfalls",
    "heart",
  ],
  "g1-jun-rainy-season": [
    "leadLine",
    "precondition",
    "time",
    "whySpecial",
    "output",
    "heart",
  ],
  "g1-jun-firefly": [
    "leadLine",
    "precondition",
    "time",
    "whySpecial",
    "output",
    "heart",
  ],
};

const EXPECTED_CURATED_PROSE_SNIPPETS: Record<string, string[]> = {
  "g1-jun-dragon-boat": [
    "家里有基本出行 planning 能力，没特别要求。",
    "端午期间长途奔波容易被堵在路上。江浙短途出行需避开高速 6/19 早 + 6/21 晚两次出行峰值。",
  ],
  "g1-jun-rainy-season": [
    "家附近有任何绿化（小区内花坛 / 楼下绿地 / 社区公园即可）。完全 0 门槛。",
    "一次 15-30 分钟。可以拆成一周 2-3 次，每次 15 分钟。",
  ],
  "g1-jun-firefly": [
    "夜间出行心理准备（不怕黑、能遵守安静不亮光的指令）。",
    "1 个夜晚 · 出发到回家约 4 小时（市区点）/ 6 小时（远郊）。",
    "萤火虫给孩子的不是知识，是\"季节性的稀缺\"。一年只能看一次的东西，比每天都能看的更让她记住。\"等一年再来\"的体验本身就是教育。",
  ],
};

const EXPECTED_CURATED_PROSE_SOURCE_RANGES: Record<
  string,
  Record<string, readonly [start: string, end: string]>
> = {
  "g1-jun-baseline": {
    leadLine: ["六月是节气挤、雨水多的过渡月：", "每件事都不必大投入。"],
    timeBudget: ["4 个半天左右 · 端午一段 + 家门口若干 + 萤火虫一晚。", "留一半以上给别的。"],
    output: ["本子上 \"6 月观察清单\"——至少 1 个雨季动物 + 1 个夜观记录。", "两条就够。"],
    heart: ["六月节气密、家长容易想\"全都做\"。", "因为变化是孩子能在 1 周内自己看见的。"],
  },
  "g1-jun-dragon-boat": {
    leadLine: ["每年 6/19–6/21 端午节假期。", "6/21（周日）。"],
    precondition: [
      "家里有基本出行 planning 能力，没特别要求。",
      "家里有基本出行 planning 能力，没特别要求。",
    ],
    timeBudget: [
      "3 天小长假里用 **1 天** 做核心安排，",
      "不要 3 天全排满。",
    ],
    output: ["本子上画 艾 + 菖蒲 + 箬叶 3 种叶子的轮廓——", "记住\"形状不同\"就行。"],
    pitfalls: ["端午期间长途奔波容易被堵在路上。", "6/21 晚两次出行峰值。"],
    heart: ["节日仪式 = 一年一次的物候记忆锚点。", "这种气味记忆比\"端午是纪念屈原\"留得更久。"],
  },
  "g1-jun-rainy-season": {
    leadLine: ["2026 上海入梅常年平均 6 月 19 日前后", "入梅当天 + 1 周内黄金窗口。"],
    precondition: [
      "家附近有任何绿化（小区内花坛 / 楼下绿地 / 社区公园即可）。",
      "完全 0 门槛。",
    ],
    time: ["一次 15-30 分钟。", "可以拆成一周 2-3 次，每次 15 分钟。"],
    whySpecial: [
      "入梅当天 + 之后 1 周是黄金窗口——",
      "低门槛、高频次，是月度 baseline 的支撑面。",
    ],
    output: [
      "本子上 \"雨后清单\"——",
      "她对家门口物种数量会有自己的估计。",
    ],
    heart: ["“雨后第二天 7 点”是一个观察习惯 (routine)。", "这是观察习惯，不是知识点。"],
  },
  "g1-jun-firefly": {
    leadLine: [
      "夏至到 7 月中旬（2026 夏至 = 6/21）",
      "闷热无月光的夜晚最佳。",
    ],
    precondition: [
      "夜间出行心理准备（",
      "能遵守安静不亮光的指令）。",
    ],
    time: ["1 个夜晚 · 出发到回家约 4 小时", "/ 6 小时（远郊）。"],
    whySpecial: [
      "上海近郊萤火虫高峰在夏至到 7 月中旬（",
      "每年只开这一扇窗，错过等下一年。",
    ],
    output: [
      "本子上 1 页 \"6 月夏至看萤火虫\"——看到 / 没看到 都写。",
      "这是 portfolio 里\"自然没保证\"的诚实记录。",
    ],
    heart: ["萤火虫给孩子的不是知识，", "等一年再来\"的体验本身就是教育。"],
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
  .replaceAll(
    "| 图 | 物种 | 家门口哪看 | 怎么让 G1 记住 |",
    "| 物种 | 家门口哪看 | 怎么让 G1 记住 |",
  )
  .replaceAll("|---|---|---|---|", "|---|---|---|")
  .replace(/^\| `\[图：[^\]]+\]` \| /gm, "| ");

function atomBody(slug: string): string {
  const atom = G1_JUN_ATOM_SEED.atoms.find((item) => item.slug === slug);
  if (!atom) throw new Error(`${slug} atom must exist`);
  return atom.body;
}

function viewProse(slug: string): string {
  const view = G1_JUN_ATOM_SEED.curatedViews.find((item) => item.slug === slug);
  if (!view) throw new Error(`${slug} view must exist`);
  return view.proseBlocks.map((block) => `${block.label}\n${block.value}`).join("\n\n");
}

function viewProseBlock(slug: string, key: string) {
  const view = G1_JUN_ATOM_SEED.curatedViews.find((item) => item.slug === slug);
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

describe("G1 June atom seed shape and fidelity tests", () => {
  it("exports the curated June atom pool and four curated views", () => {
    expect(G1_JUN_ATOM_SEED.stageSlug).toBe("g1-to-g3-foundation");
    expect(G1_JUN_ATOM_SEED.slugPrefix).toBe("g1-jun-");
    expect(G1_JUN_ATOM_SEED.atoms.length).toBe(26);
    expect(G1_JUN_ATOM_SEED.curatedViews).toHaveLength(4);

    const viewSlugs = G1_JUN_ATOM_SEED.curatedViews.map((view) => view.slug);
    expect(new Set(viewSlugs).size).toBe(viewSlugs.length);
    expect(viewSlugs).toEqual(Object.keys(EXPECTED_VIEW_ATOM_COUNTS));
    expect(G1_JUN_ATOM_SEED.curatedViews.every((view) => view.month === 6)).toBe(
      true,
    );
  });

  it("keeps every June atom inside the allowed tag vocabulary", () => {
    const slugs = G1_JUN_ATOM_SEED.atoms.map((atom) => atom.slug);
    expect(new Set(slugs).size).toBe(slugs.length);

    for (const atom of G1_JUN_ATOM_SEED.atoms) {
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

  it("does not leak internal authoring annotations into parent-facing June atom bodies", () => {
    const combined = [
      ...G1_JUN_ATOM_SEED.atoms.map((atom) => `${atom.title}\n${atom.body}`),
      ...G1_JUN_ATOM_SEED.curatedViews.flatMap((view) => [
        view.title,
        ...view.proseBlocks.map((block) => `${block.label}\n${block.value}`),
        ...USER_FACING_VIEW_SCALAR_KEYS.flatMap((key) => {
          const value = view[key];
          return value ? [`${key}\n${value}`] : [];
        }),
      ]),
    ].join("\n\n");

    expect(combined).not.toContain("兴趣对得上才进贴身");
    expect(combined).not.toContain("失败友好");
    expect(combined).not.toContain("槽 =");
    expect(combined).not.toContain("家庭风格函数");
    expect(combined).not.toContain("无信号兜底");
    expect(combined).not.toContain("折腾天花板");
    expect(combined).not.toContain("探索席位");
    expect(combined).not.toContain("读数下的一种填法示例");
    expect(combined).not.toContain("可调旋钮");
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

  it("keeps rich parent prose in June atom bodies verbatim", () => {
    const juneEnd = atomBody("g1-jun-june-end-blank");
    const moxibustion = atomBody("g1-jun-dragon-boat-home-moxibustion");
    const herbId = atomBody("g1-jun-dragon-boat-herb-id");
    const zongziLeaf = atomBody("g1-jun-dragon-boat-zongzi-leaf");
    const rainySteps = atomBody("g1-jun-rainy-season-observation-steps");
    const rainyPitfalls = atomBody("g1-jun-rainy-season-pitfalls");
    const fireflyWindow = atomBody("g1-jun-firefly-window");
    const fireflyMethod = atomBody("g1-jun-firefly-method");
    const fireflyBackup = atomBody("g1-jun-firefly-backup");
    const fireflySources = atomBody("g1-jun-firefly-sources");

    expectCopiedSnippet(juneEnd, "上海公办小学一般 6/30 前后开始放暑假。");
    expectCopiedSnippet(juneEnd, "1. **留白第一**：六月最后一周不用赶活动");
    expectCopiedSnippet(moxibustion, "摸闻认新鲜草药 + 包 5 个粽子绑线");

    expectCopiedSnippet(herbId, "**端午草药 · 现场认 3 种**：");
    expectCopiedSnippet(herbId, "1. **艾草（Artemisia argyi）** —— 灰绿色绒毛叶");
    expectCopiedSnippet(herbId, "别让孩子接触粉末，也不要让她去闻。古方点额头是仪式感不是药用，**看图认识就行**。");

    expectCopiedSnippet(zongziLeaf, "**粽叶其实是箬竹叶（鲜叶 vs 干叶）**：");
    expectCopiedSnippet(zongziLeaf, "市售\"粽叶\"多数是干箬叶");

    expectCopiedSnippet(rainySteps, "1. 雨停后第二天**早上 7 点前**出门");
    expectCopiedSnippet(rainySteps, "3. **不抓不踩**。蜗牛壳薄，捏一下就死。");

    expectCopiedSnippet(rainyPitfalls, "- **防滑第一**：湿滑石板上别让她跑。");
    expectCopiedSnippet(rainyPitfalls, "被咬仍需就医清创）。看到立即拉开距离，**不要尝试抓或赶**。");
    expectCopiedSnippet(rainyPitfalls, "3 岁以下避免柠檬桉油（OLE / PMD）");

    expectCopiedSnippet(fireflyWindow, "夏至到 7 月中旬（约 2026/06/21 – 07/15）为高峰。");
    expectCopiedSnippet(fireflyWindow, "农历月中前后月光亮反而看不到，闷热无风雨的暗夜最佳。时段 19:30-22:00 最稳");

    expectCopiedSnippet(fireflyMethod, "1. **关闪光灯 / 关手机屏**。光会让萤火虫熄灯。");
    expectCopiedSnippet(fireflyMethod, "3. **不抓**。萤火虫寿命只有 1–2 周成虫期，抓一只就少一只。");

    expectCopiedSnippet(fireflyBackup, "BBC《地球脉动》\"夜的世界\"集");
    expectCopiedSnippet(fireflyBackup, "《虫师》动画第 8 话\"重穴\"");

    expectCopiedSnippet(fireflySources, "中国科学院昆明动物研究所 萤火虫保护科普");
  });

  it("derives multi-value June atom interests from the MD tags instead of hardcoding nature", () => {
    const interestsBySlug = new Map(
      G1_JUN_ATOM_SEED.atoms.map((atom) => [atom.slug, atom.interests]),
    );

    expectTaggedFromSource(
      interestsBySlug,
      "g1-jun-observation-notebook",
      "| 观察本 6 月记录 | G1-G12 | 跨兴趣底盘 |",
      ["foundation"],
    );
    expectTaggedFromSource(
      interestsBySlug,
      "g1-jun-bowu-jun-reading",
      "| 《博物》6 月号阅读 | G1-G12 | 自然+文化 |",
      ["nature", "culture"],
    );
    expectTaggedFromSource(
      interestsBySlug,
      "g1-jun-dragon-boat-minhang-pujiang",
      "| 闵行浦江郊野公园 | G1-G12 | 自然+文化 |",
      ["nature", "culture"],
    );
    expectTaggedFromSource(
      interestsBySlug,
      "g1-jun-dragon-boat-jiading-maoqiao",
      "| 嘉定毛桥集市 | G1-G3 | 文化+手作 |",
      ["culture", "craft"],
    );
    expectTaggedFromSource(
      interestsBySlug,
      "g1-jun-dragon-boat-zhejiang-bayberry",
      "| 江浙短途采杨梅 | G1-G3 | 自然 |",
      ["nature"],
    );
    expectTaggedFromSource(
      interestsBySlug,
      "g1-jun-dragon-boat-home-moxibustion",
      "| 家里搞艾草与粽叶 | G1-G12 | 文化+手作 |",
      ["nature", "craft"],
    );
    expectTaggedFromSource(
      interestsBySlug,
      "g1-jun-dragon-boat-herb-id",
      "| 端午草药识别 | G1-G12 | 文化 |",
      ["culture"],
    );
    expectTaggedFromSource(
      interestsBySlug,
      "g1-jun-dragon-boat-zongzi-leaf",
      "| 粽叶其实是箬竹叶 | G1-G12 | 自然+文化 |",
      ["nature", "culture"],
    );
    expectTaggedFromSource(
      interestsBySlug,
      "g1-jun-dragon-boat-notebook",
      "| 端午观察本记录 | G1-G12 | 跨兴趣底盘 |",
      ["foundation"],
    );
  });

  it("keeps every June curated view usable and its prose verbatim from the source MD", () => {
    for (const view of G1_JUN_ATOM_SEED.curatedViews) {
      expect(view.title, `${view.slug}.title`).toBeTruthy();
      expect(view.month, `${view.slug}.month`).toBe(6);
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

  it("resolves every June curated-view atom membership reference", () => {
    const atomSlugs = new Set(G1_JUN_ATOM_SEED.atoms.map((atom) => atom.slug));
    const viewSlugs = new Set(
      G1_JUN_ATOM_SEED.curatedViews.map((view) => view.slug),
    );

    for (const [viewSlug, count] of Object.entries(EXPECTED_VIEW_ATOM_COUNTS)) {
      const links = G1_JUN_ATOM_SEED.viewAtomLinks.filter(
        (link) => link.viewSlug === viewSlug,
      );
      expect(links, `${viewSlug}.links`).toHaveLength(count);
    }

    for (const link of G1_JUN_ATOM_SEED.viewAtomLinks) {
      expect(viewSlugs.has(link.viewSlug), `${link.viewSlug} view ref`).toBe(true);
      expect(atomSlugs.has(link.atomSlug), `${link.atomSlug} atom ref`).toBe(true);
    }
  });
});
