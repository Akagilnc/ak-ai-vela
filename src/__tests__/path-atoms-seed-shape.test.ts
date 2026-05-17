import { describe, expect, it } from "vitest";
import { readFileSync } from "fs";
import path from "path";
import { G1_MAY_ATOM_SEED } from "../../docs/research/data/g1-may-atoms";

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
const INTERESTS = [
  "nature",
  "culture",
  "craft",
  "foundation",
  "birding",
  "flower",
] as const;

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
      expect(main, `Dongtan main atom must keep ${bird}`).toContain(bird);
    }

    expect(main).toContain("**可能看到的候鸟（春末 5 月上中旬典型 5 种）**");
    expect(main).toContain("**周一查**：[上海观鸟会 shwbs.org]");
    expect(main).toContain("**拍摄指引**：现场拍 5-10 张照片 + 2-3 段 15 秒视频足够。");
    expect(main).toContain("**避坑**：5 月中旬后基本看不到春季候鸟，别白跑。");

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

  it("keeps neighborhood species, how-to, pitfalls, and sources in atom bodies", () => {
    const combined = [
      "g1-may-neighborhood-ant-trail",
      "g1-may-neighborhood-butterfly-tracking",
      "g1-may-neighborhood-pillbug-exploration",
      "g1-may-neighborhood-bird-sounds",
    ]
      .map(atomBody)
      .join("\n\n");

    for (const species of ["菜粉蝶", "玉带凤蝶", "家蚁", "西瓜虫", "树麻雀"]) {
      expect(combined, `neighborhood atoms must keep ${species}`).toContain(
        species,
      );
    }

    expect(combined).toContain("**5 种家门口可见的初夏生物**（带辨识特征）");
    expect(combined).toContain("**蚁道观察**（15 分钟）");
    expect(combined).toContain("**蝴蝶追踪**（20 分钟）");
    expect(combined).toContain("**潮虫探险**（10 分钟）");
    expect(combined).toContain("**楼下鸟声**（5 分钟）");
    expect(combined).toContain("**别用昆虫盒装回家**");
    expect(combined).toContain("**Sources**（Day 3 authoring 补全）");
  });

  it("derives multi-value atom interests from the MD tags instead of hardcoding nature", () => {
    const interestsBySlug = new Map(
      G1_MAY_ATOM_SEED.atoms.map((atom) => [atom.slug, atom.interests]),
    );

    expect(interestsBySlug.get("g1-may-observation-notebook")).toEqual([
      "foundation",
    ]);
    expect(interestsBySlug.get("g1-may-bowu-may-reading")).toEqual([
      "nature",
      "culture",
    ]);
    expect(interestsBySlug.get("g1-may-lixia-egg-battle")).toEqual([
      "culture",
    ]);
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
