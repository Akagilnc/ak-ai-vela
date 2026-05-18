import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { existsSync, unlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { PrismaClient, Prisma } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { afterAll, describe, expect, it } from "vitest";

import { G1_MAY_ATOM_SEED } from "../../docs/research/data/g1-may-atoms";

const testDbPath = path.join(tmpdir(), `vela-seed-reset-${randomUUID()}.db`);
const testDbUrl = `file:${testDbPath}`;
const commandEnv = {
  ...process.env,
  DATABASE_URL: testDbUrl,
  RUST_LOG: "info",
};

let prisma: PrismaClient | undefined;

function run(command: string, args: string[]) {
  execFileSync(command, args, {
    cwd: process.cwd(),
    env: commandEnv,
    stdio: "pipe",
  });
}

function db() {
  if (!prisma) {
    const adapter = new PrismaBetterSqlite3({ url: testDbUrl });
    prisma = new PrismaClient({ adapter });
  }
  return prisma;
}

async function expectSeededProseBlocks(slug: string) {
  const expectedView = G1_MAY_ATOM_SEED.curatedViews.find((view) => view.slug === slug);
  if (!expectedView) throw new Error(`${slug} curated view must exist in seed`);
  const actualView = await db().pathCuratedView.findUniqueOrThrow({
    where: { slug },
  });

  expect(actualView.proseBlocks).toEqual(expectedView.proseBlocks);
}

async function expectAllSeededProseBlocks() {
  for (const view of G1_MAY_ATOM_SEED.curatedViews) {
    await expectSeededProseBlocks(view.slug);
  }
}

describe("prisma seed script --reset", () => {
  afterAll(async () => {
    await prisma?.$disconnect();
    for (const suffix of ["", "-journal", "-wal", "-shm"]) {
      const file = `${testDbPath}${suffix}`;
      if (existsSync(file)) unlinkSync(file);
    }
  });

  it("clears atom FK leaves before stages and reseeds atom explorer rows", async () => {
    run("npx", ["prisma", "db", "push", "--accept-data-loss"]);
    run("npx", ["tsx", "prisma/seed.ts"]);

    expect(await db().pathAtom.count()).toBe(G1_MAY_ATOM_SEED.atoms.length);
    expect(await db().pathCuratedView.count()).toBe(
      G1_MAY_ATOM_SEED.curatedViews.length,
    );
    expect(await db().pathCuratedViewAtom.count()).toBe(
      G1_MAY_ATOM_SEED.viewAtomLinks.length,
    );
    await expectAllSeededProseBlocks();

    await db().pathCuratedView.updateMany({
      where: {
        slug: { in: G1_MAY_ATOM_SEED.curatedViews.map((view) => view.slug) },
      },
      data: {
        proseBlocks: [
          { key: "stale", label: "Stale authored prose", value: "Stale value" },
        ] as Prisma.InputJsonValue,
      },
    });

    const stage = await db().pathStage.findUniqueOrThrow({
      where: { slug: G1_MAY_ATOM_SEED.stageSlug },
    });
    const staleAtom = await db().pathAtom.create({
      data: {
        slug: "g1-may-stale-path-atom",
        title: "Stale path atom",
        body: "This row was removed from the seed.",
        stageId: stage.id,
        gradeFrom: 1,
        gradeTo: 3,
        interests: ["nature"] as Prisma.InputJsonValue,
        scheduleKind: "ALWAYS_ON",
        windowType: null,
        cadenceRole: "ONE_SHOT",
        frictionLevel: 0,
        setting: "OUTDOOR",
        displayOrder: 999,
      },
    });
    const staleView = await db().pathCuratedView.create({
      data: {
        slug: "g1-may-stale-curated-view",
        title: "Stale curated view",
        stageId: stage.id,
        month: 5,
        leadLine: "Removed lead line",
        whySpecial: "Removed why special",
        heart: "Removed heart",
        output: null,
        serendipity: null,
        defaultTightRatio: 50,
        frictionCeilingDefault: 3,
        displayOrder: 999,
      },
    });
    await db().pathCuratedViewAtom.create({
      data: {
        curatedViewId: staleView.id,
        atomId: staleAtom.id,
      },
    });
    const futureAtom = await db().pathAtom.create({
      data: {
        slug: "g1-june-future-atom",
        title: "Future month atom",
        body: "This row belongs to a different monthly seed.",
        stageId: stage.id,
        gradeFrom: 1,
        gradeTo: 3,
        interests: ["nature"] as Prisma.InputJsonValue,
        scheduleKind: "ALWAYS_ON",
        windowType: null,
        cadenceRole: "ONE_SHOT",
        frictionLevel: 0,
        setting: "OUTDOOR",
        displayOrder: 1000,
      },
    });
    const sharedMayAtom = await db().pathAtom.findUniqueOrThrow({
      where: { slug: "g1-may-observation-notebook" },
    });
    const futureView = await db().pathCuratedView.create({
      data: {
        slug: "g1-june-future-view",
        title: "Future month curated view",
        stageId: stage.id,
        month: 6,
        leadLine: "Future lead line",
        whySpecial: "Future why special",
        heart: "Future heart",
        output: null,
        serendipity: null,
        defaultTightRatio: 50,
        frictionCeilingDefault: 3,
        displayOrder: 1000,
      },
    });
    await db().pathCuratedViewAtom.create({
      data: {
        curatedViewId: futureView.id,
        atomId: futureAtom.id,
      },
    });
    await db().pathCuratedViewAtom.create({
      data: {
        curatedViewId: futureView.id,
        atomId: sharedMayAtom.id,
      },
    });

    expect(await db().pathCuratedViewAtom.count()).toBe(
      G1_MAY_ATOM_SEED.viewAtomLinks.length + 3,
    );

    run("npx", ["tsx", "prisma/seed.ts"]);

    expect(
      await db().pathCuratedView.findUnique({
        where: { slug: "g1-may-stale-curated-view" },
      }),
    ).toBeNull();
    expect(
      await db().pathAtom.findUnique({
        where: { slug: "g1-may-stale-path-atom" },
      }),
    ).toBeNull();
    expect(
      await db().pathCuratedView.findUnique({
        where: { slug: "g1-june-future-view" },
      }),
    ).not.toBeNull();
    expect(
      await db().pathAtom.findUnique({ where: { slug: "g1-june-future-atom" } }),
    ).not.toBeNull();
    expect(
      await db().pathCuratedViewAtom.findUnique({
        where: {
          curatedViewId_atomId: {
            curatedViewId: futureView.id,
            atomId: sharedMayAtom.id,
          },
        },
      }),
    ).not.toBeNull();
    expect(await db().pathCuratedViewAtom.count()).toBe(
      G1_MAY_ATOM_SEED.viewAtomLinks.length + 2,
    );
    await expectAllSeededProseBlocks();

    expect(() => run("npx", ["tsx", "prisma/seed.ts", "--reset"])).not.toThrow();

    expect(await db().pathAtom.count()).toBe(G1_MAY_ATOM_SEED.atoms.length);
    expect(await db().pathCuratedView.count()).toBe(
      G1_MAY_ATOM_SEED.curatedViews.length,
    );
    expect(await db().pathCuratedViewAtom.count()).toBe(
      G1_MAY_ATOM_SEED.viewAtomLinks.length,
    );
    await expectAllSeededProseBlocks();
  }, 60_000);
});
