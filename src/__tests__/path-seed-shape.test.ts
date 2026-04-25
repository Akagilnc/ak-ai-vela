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

// ─────────────────────────────────────────────────────────────────────────────
// Block-shape walker — recursive runtime field check per discriminator.
// Catches drift like {name, desc, difficulty} where {zh, trait, level} is the
// declared shape, which Slice 2 R1 found AFTER review (because TS type-check
// was bypassed by `as Prisma.InputJsonValue` in prisma/seed.ts and Vitest
// doesn't typecheck). Pure runtime walk → no esbuild dependency.
// ─────────────────────────────────────────────────────────────────────────────

type AnyBlock = { type: string; [key: string]: unknown };

function expectStringArray(arr: unknown, ctx: string) {
  expect(Array.isArray(arr), `${ctx} must be array`).toBe(true);
  for (const item of arr as unknown[]) {
    expect(typeof item, `${ctx} item must be string`).toBe("string");
  }
}

function validateBlock(block: AnyBlock, ctx: string): void {
  switch (block.type) {
    case "paragraph":
      expect(typeof block.html, `${ctx} paragraph.html`).toBe("string");
      break;
    case "triad":
      expect(Array.isArray(block.items), `${ctx} triad.items`).toBe(true);
      for (const it of block.items as Array<Record<string, unknown>>) {
        for (const k of ["tag", "title", "freq", "html"]) {
          expect(typeof it[k], `${ctx} triad.items[].${k}`).toBe("string");
        }
      }
      break;
    case "callout":
      expect(["output", "heart", "warn"], `${ctx} callout.variant`).toContain(
        block.variant,
      );
      expect(typeof block.lbl, `${ctx} callout.lbl`).toBe("string");
      expect(typeof block.html, `${ctx} callout.html`).toBe("string");
      break;
    case "callout-trio":
      expect(Array.isArray(block.items), `${ctx} callout-trio.items`).toBe(true);
      for (const it of block.items as Array<Record<string, unknown>>) {
        expect(["output", "heart", "warn"]).toContain(it.variant);
        expect(typeof it.lbl).toBe("string");
        expect(typeof it.html).toBe("string");
      }
      break;
    case "path-opts":
      expect(Array.isArray(block.opts), `${ctx} path-opts.opts`).toBe(true);
      for (const o of block.opts as Array<Record<string, unknown>>) {
        for (const k of ["letter", "label", "effort"]) {
          expect(typeof o[k], `${ctx} path-opts[].${k}`).toBe("string");
        }
        expect(["low", "med", "no"], `${ctx} path-opts[].effortKey`).toContain(
          o.effortKey,
        );
      }
      break;
    case "list-bullets":
    case "list-check":
    case "steps":
      expectStringArray(block.items, `${ctx} ${block.type}.items`);
      break;
    case "id-table":
      expect(Array.isArray(block.rows), `${ctx} id-table.rows`).toBe(true);
      for (const row of block.rows as Array<Record<string, unknown>>) {
        for (const k of ["photo", "zh", "trait"]) {
          expect(typeof row[k], `${ctx} id-table.rows[].${k}`).toBe("string");
        }
        expect(["易", "中", "难"], `${ctx} id-table.rows[].level`).toContain(
          row.level,
        );
      }
      break;
    case "sources":
      expect(typeof block.title, `${ctx} sources.title`).toBe("string");
      expectStringArray(block.items, `${ctx} sources.items`);
      break;
    case "trivia":
      expect(typeof block.label, `${ctx} trivia.label`).toBe("string");
      expect(typeof block.head, `${ctx} trivia.head`).toBe("string");
      expectStringArray(block.lines, `${ctx} trivia.lines`);
      break;
    case "route":
      expect(Array.isArray(block.steps), `${ctx} route.steps`).toBe(true);
      break;
    case "philosophy":
      expect(typeof block.lbl, `${ctx} philosophy.lbl`).toBe("string");
      expect(typeof block.html, `${ctx} philosophy.html`).toBe("string");
      break;
    case "aside-note":
      expect(typeof block.html, `${ctx} aside-note.html`).toBe("string");
      break;
    case "photo-row":
      expect(Array.isArray(block.photos), `${ctx} photo-row.photos`).toBe(true);
      break;
    case "sub-block":
      expect(Array.isArray(block.blocks), `${ctx} sub-block.blocks`).toBe(true);
      for (const child of block.blocks as AnyBlock[]) {
        validateBlock(child, `${ctx} > sub-block`);
      }
      break;
    default:
      throw new Error(`${ctx} unknown block type: "${block.type}"`);
  }
}

describe("Path seed — block shape (recursive)", () => {
  for (const seed of ALL_SEEDS) {
    const monthLabel = seed.activities[0]?.month ?? "?";
    describe(`month ${monthLabel}`, () => {
      for (const a of seed.activities) {
        it(`${a.slug}: every block in every section matches its declared shape`, () => {
          for (let si = 0; si < a.sections.length; si++) {
            const sec = a.sections[si];
            for (let bi = 0; bi < sec.blocks.length; bi++) {
              validateBlock(
                sec.blocks[bi] as unknown as AnyBlock,
                `${a.slug} §${si + 1}[${bi}]`,
              );
            }
          }
        });
      }
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
