import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { existsSync, unlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

const testDbPath = path.join(tmpdir(), `vela-runtime-db-${randomUUID()}.db`);
const testDbUrl = `file:${testDbPath}`;
let originalDatabaseUrl: string | undefined;
let appPrisma: PrismaClient | undefined;

function clearAppPrismaSingleton() {
  const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
  delete globalForPrisma.prisma;
}

describe("Path overview runtime DB baseline", () => {
  beforeAll(async () => {
    originalDatabaseUrl = process.env.DATABASE_URL;
    process.env.DATABASE_URL = testDbUrl;

    execFileSync("npx", ["prisma", "db", "push", "--accept-data-loss"], {
      env: { ...process.env, DATABASE_URL: testDbUrl, RUST_LOG: "info" },
      stdio: "pipe",
    });

    const adapter = new PrismaBetterSqlite3({ url: testDbUrl });
    const setupPrisma = new PrismaClient({ adapter });
    try {
      await setupPrisma.pathStage.create({
        data: {
          slug: "g1-to-g3-foundation",
          title: "G1-G3 Foundation",
          description: "Runtime DB smoke seed",
          gradeFrom: 1,
          gradeTo: 3,
          orderIndex: 1,
        },
      });
    } finally {
      await setupPrisma.$disconnect();
    }

    vi.resetModules();
    clearAppPrismaSingleton();
  });

  afterAll(async () => {
    await appPrisma?.$disconnect();
    clearAppPrismaSingleton();

    if (originalDatabaseUrl === undefined) {
      delete process.env.DATABASE_URL;
    } else {
      process.env.DATABASE_URL = originalDatabaseUrl;
    }

    for (const suffix of ["", "-journal", "-wal", "-shm"]) {
      const file = `${testDbPath}${suffix}`;
      if (existsSync(file)) unlinkSync(file);
    }
  });

  it("can run the /path stage query through the app Prisma client", async () => {
    const { prisma } = await import("@/lib/prisma");
    appPrisma = prisma;

    const stage = await prisma.pathStage.findFirst({
      where: { slug: "g1-to-g3-foundation" },
    });

    expect(stage?.slug).toBe("g1-to-g3-foundation");
  });
});
