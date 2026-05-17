import { describe, expect, it } from "vitest";

import {
  selectSlot,
  type ChildProfile,
  type SlotAtom,
  type SlotConfig,
} from "@/lib/path/curated-slot";

const config: SlotConfig = {
  tightRatio: 50,
  frictionCeiling: 3,
};

function atom(overrides: Partial<SlotAtom> & { slug: string }): SlotAtom {
  return {
    slug: overrides.slug,
    interests: overrides.interests ?? [],
    frictionLevel: overrides.frictionLevel ?? 1,
    cadenceRole: overrides.cadenceRole ?? "LIGHT_RECURRING",
    displayOrder: overrides.displayOrder ?? 1,
  };
}

function slugs(atoms: SlotAtom[]): string[] {
  return atoms.map((item) => item.slug);
}

describe("selectSlot", () => {
  it("drops atoms above the friction ceiling", () => {
    const result = selectSlot(
      [
        atom({ slug: "low-friction", frictionLevel: 1, displayOrder: 1 }),
        atom({ slug: "too-hard", frictionLevel: 4, displayOrder: 2 }),
        atom({ slug: "at-ceiling", frictionLevel: 3, displayOrder: 3 }),
      ],
      config,
    );

    expect(slugs([...result.tight, ...result.explore])).toEqual([
      "low-friction",
      "at-ceiling",
    ]);
  });

  it("orders no-signal profiles by displayOrder and still keeps explore non-empty", () => {
    const result = selectSlot(
      [
        atom({ slug: "third", frictionLevel: 2, displayOrder: 3 }),
        atom({ slug: "first", frictionLevel: 0, displayOrder: 1 }),
        atom({ slug: "second", frictionLevel: 3, displayOrder: 2 }),
        atom({ slug: "fourth", frictionLevel: 1, displayOrder: 4 }),
      ],
      config,
      {},
    );

    expect(slugs(result.tight)).toEqual(["first", "second"]);
    expect(slugs(result.explore)).toEqual(["third", "fourth"]);
  });

  it("promotes interest matches into tight and sorts explore by friction", () => {
    const profile: ChildProfile = { interests: ["animals"] };

    const result = selectSlot(
      [
        atom({
          slug: "weather",
          interests: ["weather"],
          frictionLevel: 3,
          displayOrder: 1,
        }),
        atom({ slug: "animal-care", interests: ["animals"], displayOrder: 4 }),
        atom({
          slug: "plants",
          interests: ["plants"],
          frictionLevel: 0,
          displayOrder: 2,
        }),
        atom({ slug: "animal-track", interests: ["animals"], displayOrder: 3 }),
      ],
      config,
      profile,
    );

    expect(slugs(result.tight)).toEqual(["animal-track", "animal-care"]);
    expect(slugs(result.explore)).toEqual(["plants", "weather"]);
  });

  it("splits a 50/50 ratio into the expected tight and explore counts", () => {
    const result = selectSlot(
      [
        atom({ slug: "one", displayOrder: 1 }),
        atom({ slug: "two", displayOrder: 2 }),
        atom({ slug: "three", displayOrder: 3 }),
        atom({ slug: "four", displayOrder: 4 }),
      ],
      config,
    );

    expect(result.tight).toHaveLength(2);
    expect(result.explore).toHaveLength(2);
  });

  it("clamps explore seats only when rounding would empty explore for 2+ eligible atoms", () => {
    const single = selectSlot(
      [atom({ slug: "only", displayOrder: 1 })],
      { tightRatio: 100, frictionCeiling: 3 },
    );

    expect(slugs(single.tight)).toEqual(["only"]);
    expect(single.explore).toEqual([]);

    const pair = selectSlot(
      [
        atom({ slug: "first", displayOrder: 1 }),
        atom({ slug: "second", displayOrder: 2 }),
      ],
      { tightRatio: 100, frictionCeiling: 3 },
    );

    expect(slugs(pair.tight)).toEqual(["first"]);
    expect(slugs(pair.explore)).toEqual(["second"]);
  });

  it("keeps tight empty when a low ratio floors to zero", () => {
    const result = selectSlot(
      [
        atom({ slug: "first", displayOrder: 1 }),
        atom({ slug: "second", displayOrder: 2 }),
        atom({ slug: "third", displayOrder: 3 }),
      ],
      { tightRatio: 1, frictionCeiling: 3 },
    );

    expect(result.tight).toEqual([]);
    expect(slugs(result.explore)).toEqual(["first", "second", "third"]);
  });

  it("does not drop or down-rank ANNUAL_RITUAL atoms merely for cadence", () => {
    const result = selectSlot(
      [
        atom({
          slug: "annual-anchor",
          cadenceRole: "ANNUAL_RITUAL",
          displayOrder: 1,
        }),
        atom({
          slug: "ordinary-card",
          cadenceRole: "LIGHT_RECURRING",
          displayOrder: 2,
        }),
      ],
      config,
    );

    expect(slugs(result.tight)).toEqual(["annual-anchor"]);
    expect(slugs(result.explore)).toEqual(["ordinary-card"]);
  });

  it("returns identical output for identical inputs", () => {
    const atoms = [
      atom({ slug: "animal-track", interests: ["animals"], displayOrder: 3 }),
      atom({ slug: "weather", interests: ["weather"], displayOrder: 1 }),
      atom({ slug: "plants", interests: ["plants"], displayOrder: 2 }),
      atom({ slug: "animal-care", interests: ["animals"], displayOrder: 4 }),
    ];
    const profile: ChildProfile = { interests: ["animals"] };

    const first = selectSlot(atoms, config, profile);
    const second = selectSlot(atoms, config, profile);

    expect(second).toEqual(first);
  });
});
