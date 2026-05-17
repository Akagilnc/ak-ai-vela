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

describe("G1 May atom seed", () => {
  it("exports the curated May atom pool and five curated views", () => {
    expect(G1_MAY_ATOM_SEED.stageSlug).toBe("g1-to-g3-foundation");
    expect(G1_MAY_ATOM_SEED.atoms.length).toBeGreaterThanOrEqual(26);
    expect(G1_MAY_ATOM_SEED.atoms.length).toBeLessThanOrEqual(30);
    expect(G1_MAY_ATOM_SEED.curatedViews).toHaveLength(5);

    const viewSlugs = G1_MAY_ATOM_SEED.curatedViews.map((view) => view.slug);
    expect(new Set(viewSlugs).size).toBe(viewSlugs.length);
    expect(viewSlugs).toEqual(Object.keys(EXPECTED_VIEW_ATOM_COUNTS));
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
    expect(combined).not.toContain("**Sources**");
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
      "**可能看到的候鸟（春末 5 月上中旬典型 5 种）**",
      "**周一查**：[上海观鸟会 shwbs.org]",
      "**拍摄指引**：现场拍 5-10 张照片 + 2-3 段 15 秒视频足够。",
      "**产出**：迁徙季最后一次观察记录。portfolio 多 1 条独特的 season-specific 素材（文字 + 视觉 + 文件时间戳）。",
      "**避坑**：5 月中旬后基本看不到春季候鸟，别白跑。",
      'G1 去东滩 carry 一定挫败风险（远 + 天气依赖 + 鸟靠运气）。预先和孩子说好 "如果今天运气不好看不到鸟，我们 plan B"，挫败感就降一半。',
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

    for (const species of ["菜粉蝶", "玉带凤蝶", "家蚁", "西瓜虫", "树麻雀"]) {
      expectCopiedSnippet(combined, species);
    }

    for (const snippet of [
      "**5 种家门口可见的初夏生物**（带辨识特征）",
      "**蚁道观察**（15 分钟）",
      "**蝴蝶追踪**（20 分钟）",
      "**潮虫探险**（10 分钟）",
      "**楼下鸟声**（5 分钟）",
      "**别用昆虫盒装回家**",
      '长期下来，她对"自然"的语言会从"我在公园里看到过"变成"我家楼下的麻雀今年比去年少"。',
      "这是城市 G1 孩子的**唯一低成本、高频次、可持续的自然连接方式**。",
    ]) {
      expectCopiedSnippet(combined, snippet);
    }
  });

  it("derives multi-value atom interests from the MD tags instead of hardcoding nature", () => {
    const interestsBySlug = new Map(
      G1_MAY_ATOM_SEED.atoms.map((atom) => [atom.slug, atom.interests]),
    );

    expect(SOURCE_MD).toContain("| 观察本记录 | G1-G12 | 跨兴趣底盘 |");
    expect(interestsBySlug.get("g1-may-observation-notebook")).toEqual([
      "foundation",
    ]);
    expect(SOURCE_MD).toContain(
      "| 《博物》5 月号阅读 | G1-G12 | 自然+文化 |",
    );
    expect(interestsBySlug.get("g1-may-bowu-may-reading")).toEqual([
      "nature",
      "culture",
    ]);
    expect(SOURCE_MD).toContain("| 立夏·斗蛋 | G1-G6 | 文化 |");
    expect(interestsBySlug.get("g1-may-lixia-egg-battle")).toEqual([
      "culture",
    ]);
    expect(SOURCE_MD).toContain(
      "| 立夏·采新绿书签 | G1-G12 | 自然+手作 |",
    );
    expect(interestsBySlug.get("g1-may-lixia-green-bookmark")).toEqual([
      "nature",
      "craft",
    ]);
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
