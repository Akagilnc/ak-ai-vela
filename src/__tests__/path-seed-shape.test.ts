import { describe, it, expect } from "vitest";
import { existsSync } from "fs";
import path from "path";
import { G1_MAY_SEED } from "../../docs/research/data/g1-may-seed";
import { G1_JUN_SEED } from "../../docs/research/data/g1-jun-seed";

/**
 * Static-shape invariants for Path Explorer seed data.
 *
 * These tests run without a DB — they validate the source-of-truth TS
 * exports BEFORE prisma/seed.ts touches them. Any drift between the seed
 * file and the data contract fails here, not silently at db:seed time.
 *
 * Cross-month invariants (slug uniqueness, month integrity) live here so
 * adding a new month seed forces this file to be updated together.
 */

const ALL_SEEDS = [G1_MAY_SEED, G1_JUN_SEED];
const ASSETS_DIR = path.resolve(__dirname, "../../public/assets/img");

describe("Path seed — per-month shape (May, June)", () => {
  for (const seed of ALL_SEEDS) {
    const monthLabel = seed.activities[0]?.month ?? "unknown";

    describe(`month ${monthLabel}`, () => {
      it("has at least one baseline activity", () => {
        const baselines = seed.activities.filter((a) => a.cardType === "baseline");
        expect(baselines.length).toBeGreaterThanOrEqual(1);
      });

      it("every activity uses the same month number", () => {
        const months = new Set(seed.activities.map((a) => a.month));
        expect(months.size).toBe(1);
      });

      it("month is in [1, 12]", () => {
        const m = seed.activities[0].month;
        expect(m).toBeGreaterThanOrEqual(1);
        expect(m).toBeLessThanOrEqual(12);
      });

      it("every activity slug is unique within the month", () => {
        const slugs = seed.activities.map((a) => a.slug);
        expect(new Set(slugs).size).toBe(slugs.length);
      });

      it("every activity has displayOrder, kicker, title, summary", () => {
        for (const a of seed.activities) {
          expect(typeof a.displayOrder).toBe("number");
          expect(a.kicker).toBeTruthy();
          expect(a.title).toBeTruthy();
          expect(a.summary).toBeTruthy();
        }
      });

      it("every goal slug referenced by an activity exists in seed.goals", () => {
        const goalSlugs = new Set(seed.goals.map((g) => g.slug));
        for (const a of seed.activities) {
          expect(goalSlugs.has(a.goalSlug)).toBe(true);
        }
      });

      it("every goal references a stageSlug that matches seed.stage", () => {
        for (const g of seed.goals) {
          expect(g.stageSlug).toBe(seed.stage.slug);
        }
      });

      it("every preview filename (if any) exists under public/assets/img/", () => {
        for (const a of seed.activities) {
          for (const f of a.previews) {
            const full = path.join(ASSETS_DIR, f);
            expect(existsSync(full), `preview missing: ${f} (in ${a.slug})`).toBe(true);
          }
        }
      });
    });
  }
});

describe("Path seed — cross-month invariants", () => {
  it("activity slugs are globally unique across all month seeds", () => {
    const allSlugs = ALL_SEEDS.flatMap((s) => s.activities.map((a) => a.slug));
    expect(new Set(allSlugs).size).toBe(allSlugs.length);
  });

  it("goals re-exported across month seeds have identical content", () => {
    // Goals can be shared across months (e.g. an annual G1-G3 goal that
    // parents both May and June activities). When the same slug appears
    // in multiple seeds, the rows must be byte-identical so prisma upsert
    // is order-insensitive.
    const goalsBySlug = new Map<string, unknown>();
    for (const seed of ALL_SEEDS) {
      for (const g of seed.goals) {
        const prev = goalsBySlug.get(g.slug);
        if (prev === undefined) {
          goalsBySlug.set(g.slug, g);
        } else {
          expect(g).toEqual(prev);
        }
      }
    }
  });

  it("all months together cover at least May and June", () => {
    const months = new Set(
      ALL_SEEDS.flatMap((s) => s.activities.map((a) => a.month)),
    );
    expect(months.has(5)).toBe(true);
    expect(months.has(6)).toBe(true);
  });

  it("all month seeds reference the same stage (G1-G3 in v0.2)", () => {
    const stageSlugs = new Set(ALL_SEEDS.map((s) => s.stage.slug));
    expect(stageSlugs.size).toBe(1);
    expect(stageSlugs.has("g1-to-g3-foundation")).toBe(true);
  });
});
