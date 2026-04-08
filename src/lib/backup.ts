import fs from "fs";
import path from "path";
import Database from "better-sqlite3";

function getDbPath(): string {
  const url = process.env.DATABASE_URL;
  if (url) return path.resolve(url.replace(/^file:/, ""));
  return path.join(process.cwd(), "prisma", "dev.db");
}

export function backupDatabase(): string | null {
  const dbPath = getDbPath();
  const backupDir = path.join(path.dirname(dbPath), "backups");

  if (!fs.existsSync(dbPath)) {
    console.log("[backup] No database file found, skipping backup");
    return null;
  }

  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupPath = path.join(backupDir, `dev-${timestamp}.db`);

  // Use SQLite VACUUM INTO for a consistent snapshot (safe during writes)
  const db = new Database(dbPath, { readonly: true });
  try {
    db.exec(`VACUUM INTO '${backupPath.replace(/'/g, "''")}'`);
  } finally {
    db.close();
  }
  console.log(`[backup] Database backed up to ${backupPath}`);

  cleanOldBackups(backupDir, 5);

  return backupPath;
}

function cleanOldBackups(backupDir: string, keep: number) {
  const files = fs
    .readdirSync(backupDir)
    .filter((f) => f.startsWith("dev-") && f.endsWith(".db"))
    .sort()
    .reverse();

  for (const file of files.slice(keep)) {
    fs.unlinkSync(path.join(backupDir, file));
    console.log(`[backup] Removed old backup: ${file}`);
  }
}
