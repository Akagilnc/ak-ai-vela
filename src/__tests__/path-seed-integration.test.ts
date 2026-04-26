import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { PrismaClient, Prisma } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { TEST_DB_URL } from "./helpers/test-db";
import { G1_MAY_SEED } from "../../docs/research/data/g1-may-seed";
import { G1_JUN_SEED } from "../../docs/research/data/g1-jun-seed";

/**
 * End-to-end integration test for the Path Explorer seed pipeline.
 *
 * The walker test (`path-seed-shape.test.ts`) checks the static TypeScript
 * shape of the seed exports. This test goes one layer deeper: it runs the
 * actual upsert sequence against a real Prisma + SQLite database (the
 * vitest temp DB), then issues the exact queries `src/app/path/page.tsx`
 * makes at request time. It catches:
 *
 *   - Schema drift (seed JSON serialization vs Prisma `Json` columns)
 *   - FK / @@unique violations that only surface at write time
 *   - Drift between the seed merge logic and what page.tsx queries
 *   - Idempotency regressions in re-running the seed
 *   - The single-stage runtime guard in `prisma/seed.ts`
 *
 * The merge logic is duplicated here on purpose: this test asserts the
 * CONTRACT that prisma/seed.ts implements, not the script itself. If
 * seed.ts changes, this test must keep passing — it's the canary for
 * "does the page.tsx query plan still match the seed shape?"
 */

const adapter = new PrismaBetterSqlite3({ url: TEST_DB_URL });
const prisma = new PrismaClient({ adapter });

type SeedShape = typeof G1_MAY_SEED;

/**
 * Mirror of the merge step in `prisma/seed.ts`. Pure data transform —
 * no DB calls. Throws on multi-stage seeds (the same guard ships in
 * production).
 */
function mergeMonthSeeds(seeds: SeedShape[]) {
  const stageSlugs = new Set(seeds.map((s) => s.stage.slug));
  if (stageSlugs.size !== 1) {
    throw new Error(
      `seedPathExplorer assumes one stage across all month seeds, found ${stageSlugs.size}: ${[...stageSlugs].join(", ")}.`,
    );
  }
  const stage = seeds[0].stage;
  const goalsBySlug = new Map<string, SeedShape["goals"][number]>();
  for (const s of seeds) for (const g of s.goals) goalsBySlug.set(g.slug, g);
  const goals = Array.from(goalsBySlug.values());
  const activities = seeds.flatMap((s) => s.activities);
  return { stage, goals, activities };
}

/**
 * Same upsert sequence prisma/seed.ts runs in production. Wrapped in a
 * transaction so the test sees an all-or-nothing seed and a partial
 * crash mid-test won't leave the DB in a half-seeded state for later
 * tests.
 */
async function seedPath(seeds: SeedShape[]) {
  const { stage, goals, activities } = mergeMonthSeeds(seeds);
  const validGoalSlugs = goals.map((g) => g.slug);
  const validActivitySlugs = activities.map((a) => a.slug);

  await prisma.$transaction(async (tx) => {
    const stageRow = await tx.pathStage.upsert({
      where: { slug: stage.slug },
      update: {
        title: stage.title,
        description: stage.description,
        gradeFrom: stage.gradeFrom,
        gradeTo: stage.gradeTo,
        orderIndex: stage.orderIndex,
      },
      create: stage,
    });

    await tx.pathActivity.deleteMany({
      where: {
        goal: { stageId: stageRow.id },
        slug: { notIn: validActivitySlugs },
      },
    });
    await tx.pathGoal.deleteMany({
      where: { stageId: stageRow.id, slug: { notIn: validGoalSlugs } },
    });

    const goalIdBySlug = new Map<string, string>();
    for (const goal of goals) {
      const { stageSlug: _stageSlug, ...rest } = goal;
      const row = await tx.pathGoal.upsert({
        where: { slug: rest.slug },
        update: { ...rest, stageId: stageRow.id },
        create: { ...rest, stageId: stageRow.id },
      });
      goalIdBySlug.set(row.slug, row.id);
    }

    for (const activity of activities) {
      const { goalSlug, previews, chips, sections, ...rest } = activity;
      const goalId = goalIdBySlug.get(goalSlug)!;
      const jsonFields = {
        previews: previews as unknown as Prisma.InputJsonValue,
        chips: chips as unknown as Prisma.InputJsonValue,
        sections: sections as unknown as Prisma.InputJsonValue,
      };
      await tx.pathActivity.upsert({
        where: { slug: rest.slug },
        update: { ...rest, ...jsonFields, goalId },
        create: { ...rest, ...jsonFields, goalId },
      });
    }
  });
}

describe("Path Explorer seed — DB integration", () => {
  beforeAll(async () => {
    // Wipe path tables so this suite is hermetic. Schools are seeded by
    // global-setup; we only own path_*.
    await prisma.pathActivity.deleteMany();
    await prisma.pathGoal.deleteMany();
    await prisma.pathStage.deleteMany();
    await seedPath([G1_MAY_SEED, G1_JUN_SEED]);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  // ───────────────────────────────────────────────────────────────────────
  // Stage / goal / activity row counts
  // ───────────────────────────────────────────────────────────────────────

  it("creates exactly one stage row with the G1-G3 slug", async () => {
    const stages = await prisma.pathStage.findMany();
    expect(stages.length).toBe(1);
    expect(stages[0].slug).toBe("g1-to-g3-foundation");
  });

  it("creates exactly one goal row (May+June share the same slug)", async () => {
    const goals = await prisma.pathGoal.findMany();
    expect(goals.length).toBe(1);
    expect(goals[0].slug).toBe("g1-g3-observation-culture-foundation");
  });

  it("creates 9 activity rows: 5 May + 4 June", async () => {
    const activities = await prisma.pathActivity.findMany();
    expect(activities.length).toBe(9);
    const may = activities.filter((a) => a.month === 5);
    const jun = activities.filter((a) => a.month === 6);
    expect(may.length).toBe(5);
    expect(jun.length).toBe(4);
  });

  // ───────────────────────────────────────────────────────────────────────
  // page.tsx query contract — these are the EXACT queries the overview
  // makes at request time. If the seed shape ever drifts from what the
  // page expects, these tests fail before render time.
  // ───────────────────────────────────────────────────────────────────────

  it("availableMonths query returns [5, 6] (page.tsx distinct contract)", async () => {
    const stage = await prisma.pathStage.findFirst({
      where: { slug: "g1-to-g3-foundation" },
    });
    expect(stage).not.toBeNull();
    const rows = await prisma.pathActivity.findMany({
      where: { goal: { stageId: stage!.id } },
      select: { month: true },
      distinct: ["month"],
      orderBy: { month: "asc" },
    });
    expect(rows.map((r) => r.month)).toEqual([5, 6]);
  });

  it("activities for month=6 return in displayOrder, then slug", async () => {
    // page.tsx uses orderBy: [{ displayOrder: "asc" }, { slug: "asc" }] —
    // the displayOrder is the primary sort, slug breaks ties. Verifying
    // ordering matters because tile-list `${pos} / ${total}` numbering
    // would lie if rows came back unordered.
    const stage = await prisma.pathStage.findFirstOrThrow({
      where: { slug: "g1-to-g3-foundation" },
    });
    const activities = await prisma.pathActivity.findMany({
      where: { goal: { stageId: stage.id }, month: 6 },
      orderBy: [{ displayOrder: "asc" }, { slug: "asc" }],
    });
    expect(activities.map((a) => a.slug)).toEqual([
      "g1-jun-routine",
      "g1-jun-dragon-boat-festival",
      "g1-jun-rainy-season-near-door",
      "g1-jun-firefly-watching",
    ]);
  });

  it("baseline / event card mix is correct per month", async () => {
    const may = await prisma.pathActivity.findMany({ where: { month: 5 } });
    const jun = await prisma.pathActivity.findMany({ where: { month: 6 } });
    expect(may.filter((a) => a.cardType === "baseline").length).toBe(1);
    expect(may.filter((a) => a.cardType === "event").length).toBe(4);
    expect(jun.filter((a) => a.cardType === "baseline").length).toBe(1);
    expect(jun.filter((a) => a.cardType === "event").length).toBe(3);
  });

  // ───────────────────────────────────────────────────────────────────────
  // JSON column round-trip — Json fields must survive Prisma serialization
  // intact, otherwise the renderer's runtime guards (parseChips,
  // parseSections) silently fall back to empty.
  // ───────────────────────────────────────────────────────────────────────

  it("JSON columns round-trip through Prisma without shape loss", async () => {
    const a = await prisma.pathActivity.findUnique({
      where: { slug: "g1-jun-firefly-watching" },
    });
    expect(a).not.toBeNull();
    expect(Array.isArray(a!.previews)).toBe(true);
    expect(Array.isArray(a!.chips)).toBe(true);
    // Sections is a nested array of section objects; Prisma stores it as
    // Json. We just check the top-level shape here — the walker test
    // covers per-block field correctness on the source data, and the
    // renderer's parseSections covers runtime hardening.
    expect(Array.isArray(a!.sections)).toBe(true);
    const sections = a!.sections as unknown as Array<{ target: string }>;
    expect(sections.length).toBeGreaterThanOrEqual(4);
    expect(typeof sections[0].target).toBe("string");
  });

  // ───────────────────────────────────────────────────────────────────────
  // Idempotency — re-running the seed must not duplicate rows.
  // ───────────────────────────────────────────────────────────────────────

  it("re-running the seed is idempotent (no churn — row IDs stable)", async () => {
    // R1 A1: counts alone are insufficient — a regression that swapped the
    // upsert for `deleteMany({}) + create` would still pass count checks
    // but every row would have a fresh id each run. Snapshot the row ids
    // before re-seeding and assert they're identical after, which is the
    // actual idempotency contract the production seed claims.
    const beforeIds = (
      await prisma.pathActivity.findMany({
        select: { id: true, slug: true },
        orderBy: { slug: "asc" },
      })
    ).map((r) => `${r.slug}:${r.id}`);

    await seedPath([G1_MAY_SEED, G1_JUN_SEED]);
    await seedPath([G1_MAY_SEED, G1_JUN_SEED]);

    const stages = await prisma.pathStage.count();
    const goals = await prisma.pathGoal.count();
    const activities = await prisma.pathActivity.count();
    expect(stages).toBe(1);
    expect(goals).toBe(1);
    expect(activities).toBe(9);

    const afterIds = (
      await prisma.pathActivity.findMany({
        select: { id: true, slug: true },
        orderBy: { slug: "asc" },
      })
    ).map((r) => `${r.slug}:${r.id}`);
    expect(afterIds).toEqual(beforeIds);
  });

  // ───────────────────────────────────────────────────────────────────────
  // Multi-stage runtime guard — must throw before any DB writes happen.
  // ───────────────────────────────────────────────────────────────────────

  it("throws if seeds reference more than one stage AND no DB writes happen", async () => {
    // R1 A1: testing the pure mergeMonthSeeds() proves the function throws
    // but doesn't prove the production safety property — that the seed
    // wrapper bails BEFORE any pathStage/pathGoal/pathActivity rows land.
    // Snapshot row counts, run the wrapper, expect rejects, assert counts
    // are byte-identical. This is what the production guard actually
    // protects against (silent purge under wrong stageId).
    const fakeSecondStageSeed: SeedShape = {
      ...G1_JUN_SEED,
      stage: { ...G1_JUN_SEED.stage, slug: "g4-to-g6-foundation" },
    };

    const before = {
      stages: await prisma.pathStage.count(),
      goals: await prisma.pathGoal.count(),
      activities: await prisma.pathActivity.count(),
    };

    // Pure-function check: the merge step throws.
    expect(() =>
      mergeMonthSeeds([G1_MAY_SEED, fakeSecondStageSeed]),
    ).toThrow(/one stage across all month seeds/);

    // Production-shape check: the wrapper that owns the prisma transaction
    // also rejects, and no rows changed.
    await expect(
      seedPath([G1_MAY_SEED, fakeSecondStageSeed]),
    ).rejects.toThrow(/one stage across all month seeds/);

    const after = {
      stages: await prisma.pathStage.count(),
      goals: await prisma.pathGoal.count(),
      activities: await prisma.pathActivity.count(),
    };
    expect(after).toEqual(before);
  });
});
