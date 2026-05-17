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

const EXPECTED_VIEW_ATOM_COUNTS: Record<string, number> = {
  "g1-may-baseline": 6,
  "g1-may-labor-holiday": 6,
  "g1-may-lixia-solar-term": 7,
  "g1-may-dongtan-migration-tail": 5,
  "g1-may-neighborhood-ecology": 4,
};

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

  it("keeps every atom inside the allowed single-valued tag vocabulary", () => {
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
      expect(atom.interests, `${atom.slug}.interests`).toEqual(["nature"]);
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
