import { execSync } from "node:child_process";
import { existsSync, unlinkSync } from "node:fs";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { tmpdir } from "node:os";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { schools } from "../../../prisma/schools-data";

// Vitest globalSetup: runs ONCE in the main vitest process before any
// worker forks. Provisions an isolated SQLite database under os.tmpdir(),
// applies the Prisma schema via `prisma db push`, and seeds the school
// catalogue so integration tests can run against a clean, known state.
//
// The DB path is generated with a per-run UUID so concurrent vitest runs
// on the same machine (watch mode + manual run, parallel CI jobs) don't
// collide on a single shared DB file. We publish the resulting URL via
// the VELA_TEST_DB_URL env var; worker processes inherit it when they
// fork, and src/__tests__/helpers/test-db.ts reads it back so every test
// file's PrismaClient points at the same DB this setup seeded.
export default async function setup(): Promise<() => Promise<void>> {
  const testDbPath = path.join(tmpdir(), `vela-vitest-${randomUUID()}.db`);
  const testDbUrl = `file:${testDbPath}`;
  process.env.VELA_TEST_DB_URL = testDbUrl;

  // Remove any leftover from a previous run (e.g. crashed suite). Fail fast
  // if we can't clean up — running against a stale DB would silently mask
  // schema drift or stale seed rows.
  if (existsSync(testDbPath)) {
    try {
      unlinkSync(testDbPath);
    } catch (err) {
      throw new Error(
        `Failed to remove stale vitest DB at ${testDbPath}: ${err instanceof Error ? err.message : String(err)}`
      );
    }
  }

  // Apply Prisma schema to the temp database via the Prisma CLI. We pass
  // DATABASE_URL through env so prisma.config.ts resolves it at runtime;
  // `--accept-data-loss` is safe here because the DB is empty.
  try {
    execSync("npx prisma db push --accept-data-loss", {
      env: { ...process.env, DATABASE_URL: testDbUrl },
      stdio: "pipe",
    });
  } catch (e) {
    const err = e as { stderr?: Buffer; stdout?: Buffer };
    const stderr = err.stderr?.toString() ?? "";
    const stdout = err.stdout?.toString() ?? "";
    throw new Error(
      `prisma db push failed during vitest globalSetup:\n${stdout}\n${stderr}`
    );
  }

  // Seed schools so integration tests see the same catalogue as production.
  const adapter = new PrismaBetterSqlite3({ url: testDbUrl });
  const prisma = new PrismaClient({ adapter });
  try {
    for (const school of schools) {
      await prisma.school.create({ data: school });
    }
  } finally {
    await prisma.$disconnect();
  }

  return async () => {
    // Teardown: drop the temp database to keep os.tmpdir() tidy. Surface
    // failures so leaked files don't quietly accumulate across runs.
    if (existsSync(testDbPath)) {
      try {
        unlinkSync(testDbPath);
      } catch (err) {
        throw new Error(
          `Failed to remove vitest DB during teardown at ${testDbPath}: ${err instanceof Error ? err.message : String(err)}`
        );
      }
    }
  };
}
