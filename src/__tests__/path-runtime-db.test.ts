import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { existsSync, unlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { Prisma, PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

const testDbPath = path.join(tmpdir(), `vela-runtime-db-${randomUUID()}.db`);
const testDbUrl = `file:${testDbPath}`;
const poisonDbPath = path.join(tmpdir(), `vela-runtime-poison-${randomUUID()}.db`);
const poisonDbUrl = `file:${poisonDbPath}`;
let originalDatabaseUrl: string | undefined;
let originalVelaTestDbUrl: string | undefined;
let appPrisma: PrismaClient | undefined;

const runtimeProseBlocks = [
  {
    key: "leadLine",
    label: "触发条件",
    value: "每年 5/1-5 假期。",
  },
  {
    key: "precondition",
    label: "前置",
    value: "家里有基本出行 planning 能力，没特别要求。",
  },
  {
    key: "timeBudget",
    label: "时间预算",
    value: "5 天里用 1-2 天做 nature-themed 活动。",
  },
  {
    key: "output",
    label: "产出",
    value: "一次 mini-trip，照片若干 + 观察本上 1-2 页新地方的记录。",
  },
  {
    key: "pitfalls",
    label: "避坑",
    value: "提前预约票 + 尽量挪到 5/4 或 5/5",
  },
  {
    key: "heart",
    label: "心法",
    value: "劳动节不是冲刺日程，是改变节奏的机会。",
  },
];

function clearAppPrismaSingleton() {
  const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
  delete globalForPrisma.prisma;
}

describe("Path overview runtime DB baseline", () => {
  beforeAll(async () => {
    originalDatabaseUrl = process.env.DATABASE_URL;
    originalVelaTestDbUrl = process.env.VELA_TEST_DB_URL;
    process.env.DATABASE_URL = poisonDbUrl;
    process.env.VELA_TEST_DB_URL = testDbUrl;

    execFileSync("npx", ["prisma", "db", "push", "--accept-data-loss"], {
      env: { ...process.env, DATABASE_URL: testDbUrl, RUST_LOG: "info" },
      stdio: "pipe",
    });

    const adapter = new PrismaBetterSqlite3({ url: testDbUrl });
    const setupPrisma = new PrismaClient({ adapter });
    try {
      const stage = await setupPrisma.pathStage.create({
        data: {
          slug: "g1-to-g3-foundation",
          title: "G1-G3 Foundation",
          description: "Runtime DB smoke seed",
          gradeFrom: 1,
          gradeTo: 3,
          orderIndex: 1,
        },
      });
      await setupPrisma.pathCuratedView.create({
        data: {
          slug: "g1-may-labor-holiday",
          title: "劳动节小出行",
          stageId: stage.id,
          month: 5,
          leadLine: "每年 5/1-5 假期。",
          whySpecial: null,
          heart: null,
          output: null,
          serendipity: null,
          proseBlocks: runtimeProseBlocks as Prisma.InputJsonValue,
          defaultTightRatio: 50,
          frictionCeilingDefault: 3,
          displayOrder: 1,
        },
      });
    } finally {
      await setupPrisma.$disconnect();
    }

    vi.resetModules();
    clearAppPrismaSingleton();
  }, 60_000);

  afterAll(async () => {
    await appPrisma?.$disconnect();
    clearAppPrismaSingleton();

    if (originalDatabaseUrl === undefined) {
      delete process.env.DATABASE_URL;
    } else {
      process.env.DATABASE_URL = originalDatabaseUrl;
    }
    if (originalVelaTestDbUrl === undefined) {
      delete process.env.VELA_TEST_DB_URL;
    } else {
      process.env.VELA_TEST_DB_URL = originalVelaTestDbUrl;
    }

    for (const suffix of ["", "-journal", "-wal", "-shm"]) {
      const file = `${testDbPath}${suffix}`;
      if (existsSync(file)) unlinkSync(file);
    }
    for (const suffix of ["", "-journal", "-wal", "-shm"]) {
      const file = `${poisonDbPath}${suffix}`;
      if (existsSync(file)) unlinkSync(file);
    }
  });

  it("uses the isolated VELA_TEST_DB_URL before ambient DATABASE_URL in test mode", async () => {
    const { prisma } = await import("@/lib/prisma");
    appPrisma = prisma;

    const stage = await prisma.pathStage.findFirst({
      where: { slug: "g1-to-g3-foundation" },
    });

    expect(stage?.slug).toBe("g1-to-g3-foundation");
  });

  it("can load curated prose blocks through the app route query", async () => {
    const { prisma } = await import("@/lib/prisma");
    const { loadCuratedView } = await import("@/lib/path/curated-view-query");
    appPrisma = prisma;

    const view = await loadCuratedView("g1-may-labor-holiday");

    expect(view?.proseBlocks).toEqual(runtimeProseBlocks);
  });
});
