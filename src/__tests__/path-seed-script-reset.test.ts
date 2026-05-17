import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { existsSync, unlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { PrismaClient } from "@prisma/client";
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

    expect(() => run("npx", ["tsx", "prisma/seed.ts", "--reset"])).not.toThrow();

    expect(await db().pathAtom.count()).toBe(G1_MAY_ATOM_SEED.atoms.length);
    expect(await db().pathCuratedView.count()).toBe(
      G1_MAY_ATOM_SEED.curatedViews.length,
    );
    expect(await db().pathCuratedViewAtom.count()).toBe(
      G1_MAY_ATOM_SEED.viewAtomLinks.length,
    );
  });
});
