import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import fs from "fs";
import path from "path";
import os from "os";
import Database from "better-sqlite3";

describe("backupDatabase", () => {
  let tmpDir: string;
  let originalCwd: () => string;

  let originalDatabaseUrl: string | undefined;

  beforeEach(() => {
    // Create an isolated temp directory so we never touch the real prisma/ dir
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "vela-backup-test-"));
    // Override process.cwd() so getDbPath() resolves inside tmpDir
    originalCwd = process.cwd;
    process.cwd = () => tmpDir;
    // Clear DATABASE_URL so getDbPath() uses the cwd fallback
    originalDatabaseUrl = process.env.DATABASE_URL;
    delete process.env.DATABASE_URL;
  });

  afterEach(() => {
    process.cwd = originalCwd;
    // Restore DATABASE_URL
    if (originalDatabaseUrl !== undefined) {
      process.env.DATABASE_URL = originalDatabaseUrl;
    }
    // Clean up temp directory
    fs.rmSync(tmpDir, { recursive: true, force: true });
    // Reset module cache so each test gets fresh module-level constants
    vi.resetModules();
  });

  it("returns null when database file does not exist", async () => {
    const { backupDatabase } = await import("@/lib/backup");
    const result = backupDatabase();
    expect(result).toBeNull();
  });

  it("copies the database and returns the backup path when DB exists", async () => {
    // Set up a real SQLite database
    const prismaDir = path.join(tmpDir, "prisma");
    fs.mkdirSync(prismaDir, { recursive: true });
    const dbPath = path.join(prismaDir, "dev.db");
    const db = new Database(dbPath);
    db.exec("CREATE TABLE test (id INTEGER PRIMARY KEY, value TEXT)");
    db.exec("INSERT INTO test VALUES (1, 'hello')");
    db.close();

    const { backupDatabase } = await import("@/lib/backup");
    const result = backupDatabase();

    expect(result).not.toBeNull();
    expect(result!).toContain(path.join(tmpDir, "prisma", "backups", "dev-"));
    expect(result!).toMatch(/\.db$/);

    // Verify backup is a valid SQLite database with the same data
    expect(fs.existsSync(result!)).toBe(true);
    const backupDb = new Database(result!);
    const rows = backupDb.prepare("SELECT value FROM test WHERE id = 1").all();
    expect(rows).toEqual([{ value: "hello" }]);
    backupDb.close();
  });

  it("creates the backups directory if it does not exist", async () => {
    const prismaDir = path.join(tmpDir, "prisma");
    fs.mkdirSync(prismaDir, { recursive: true });
    const db = new Database(path.join(prismaDir, "dev.db"));
    db.exec("CREATE TABLE t (id INTEGER)");
    db.close();

    const backupsDir = path.join(prismaDir, "backups");
    expect(fs.existsSync(backupsDir)).toBe(false);

    const { backupDatabase } = await import("@/lib/backup");
    backupDatabase();

    expect(fs.existsSync(backupsDir)).toBe(true);
  });

  it("cleans old backups keeping only the 5 most recent", async () => {
    const prismaDir = path.join(tmpDir, "prisma");
    const backupsDir = path.join(prismaDir, "backups");
    fs.mkdirSync(backupsDir, { recursive: true });
    const db = new Database(path.join(prismaDir, "dev.db"));
    db.exec("CREATE TABLE t (id INTEGER)");
    db.close();

    // Create 6 existing backup files with sortable timestamps
    const existingBackups = [
      "dev-2025-01-01T00-00-00-000Z.db",
      "dev-2025-01-02T00-00-00-000Z.db",
      "dev-2025-01-03T00-00-00-000Z.db",
      "dev-2025-01-04T00-00-00-000Z.db",
      "dev-2025-01-05T00-00-00-000Z.db",
      "dev-2025-01-06T00-00-00-000Z.db",
    ];
    for (const name of existingBackups) {
      fs.writeFileSync(path.join(backupsDir, name), "old");
    }

    const { backupDatabase } = await import("@/lib/backup");
    backupDatabase(); // This adds a 7th backup, then cleans down to 5

    const remaining = fs
      .readdirSync(backupsDir)
      .filter((f) => f.startsWith("dev-") && f.endsWith(".db"))
      .sort();

    // 5 kept: the newest 5 out of 7 total (6 existing + 1 new)
    expect(remaining.length).toBe(5);
    // The two oldest should have been removed
    expect(remaining).not.toContain("dev-2025-01-01T00-00-00-000Z.db");
    expect(remaining).not.toContain("dev-2025-01-02T00-00-00-000Z.db");
  });

  it("does not delete anything when total backups <= 5", async () => {
    const prismaDir = path.join(tmpDir, "prisma");
    const backupsDir = path.join(prismaDir, "backups");
    fs.mkdirSync(backupsDir, { recursive: true });
    const db = new Database(path.join(prismaDir, "dev.db"));
    db.exec("CREATE TABLE t (id INTEGER)");
    db.close();

    // Create 3 existing backups
    const existingBackups = [
      "dev-2025-01-01T00-00-00-000Z.db",
      "dev-2025-01-02T00-00-00-000Z.db",
      "dev-2025-01-03T00-00-00-000Z.db",
    ];
    for (const name of existingBackups) {
      fs.writeFileSync(path.join(backupsDir, name), "old");
    }

    const { backupDatabase } = await import("@/lib/backup");
    backupDatabase(); // Adds a 4th -- still <= 5, nothing deleted

    const remaining = fs
      .readdirSync(backupsDir)
      .filter((f) => f.startsWith("dev-") && f.endsWith(".db"));

    expect(remaining.length).toBe(4);
  });

  it("ignores non-backup files in the backups directory during cleanup", async () => {
    const prismaDir = path.join(tmpDir, "prisma");
    const backupsDir = path.join(prismaDir, "backups");
    fs.mkdirSync(backupsDir, { recursive: true });
    const db = new Database(path.join(prismaDir, "dev.db"));
    db.exec("CREATE TABLE t (id INTEGER)");
    db.close();

    // Create 6 real backups + 2 unrelated files
    const existingBackups = [
      "dev-2025-01-01T00-00-00-000Z.db",
      "dev-2025-01-02T00-00-00-000Z.db",
      "dev-2025-01-03T00-00-00-000Z.db",
      "dev-2025-01-04T00-00-00-000Z.db",
      "dev-2025-01-05T00-00-00-000Z.db",
      "dev-2025-01-06T00-00-00-000Z.db",
    ];
    for (const name of existingBackups) {
      fs.writeFileSync(path.join(backupsDir, name), "old");
    }
    // Non-matching files that should be left alone
    fs.writeFileSync(path.join(backupsDir, "notes.txt"), "keep me");
    fs.writeFileSync(path.join(backupsDir, "schema.db"), "not a backup");

    const { backupDatabase } = await import("@/lib/backup");
    backupDatabase();

    // Non-matching files should survive
    expect(fs.existsSync(path.join(backupsDir, "notes.txt"))).toBe(true);
    expect(fs.existsSync(path.join(backupsDir, "schema.db"))).toBe(true);
  });
});
