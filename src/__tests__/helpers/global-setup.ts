import { execSync } from "node:child_process";
import { existsSync, unlinkSync } from "node:fs";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { schools } from "../../../prisma/schools-data";
import { TEST_DB_PATH, TEST_DB_URL } from "./test-db";

// Vitest globalSetup: runs ONCE before the whole test suite, in the main
// vitest process. Provisions an isolated SQLite database under os.tmpdir(),
// applies the Prisma schema via `prisma db push`, and seeds the school
// catalogue so integration tests can run against a clean, known state.
//
// Individual test files open their own PrismaClient pointed at TEST_DB_URL
// so they don't share connection state with this setup run.
export default async function setup(): Promise<() => Promise<void>> {
  // Remove any leftover from a previous run (e.g. crashed suite)
  if (existsSync(TEST_DB_PATH)) {
    try {
      unlinkSync(TEST_DB_PATH);
    } catch {
      /* ignore */
    }
  }

  // Apply Prisma schema to the temp database via the Prisma CLI. We pass
  // DATABASE_URL through env so prisma.config.ts resolves it at runtime;
  // `--accept-data-loss` is safe here because the DB is empty.
  try {
    execSync("npx prisma db push --accept-data-loss", {
      env: { ...process.env, DATABASE_URL: TEST_DB_URL },
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
  const adapter = new PrismaBetterSqlite3({ url: TEST_DB_URL });
  const prisma = new PrismaClient({ adapter });
  try {
    for (const school of schools) {
      await prisma.school.create({ data: school });
    }
  } finally {
    await prisma.$disconnect();
  }

  return async () => {
    // Teardown: drop the temp database to keep os.tmpdir() tidy.
    if (existsSync(TEST_DB_PATH)) {
      try {
        unlinkSync(TEST_DB_PATH);
      } catch {
        /* ignore */
      }
    }
  };
}
