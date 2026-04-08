import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "prisma", "dev.db");
const BACKUP_DIR = path.join(process.cwd(), "prisma", "backups");

export function backupDatabase(): string | null {
  if (!fs.existsSync(DB_PATH)) {
    console.log("[backup] No database file found, skipping backup");
    return null;
  }

  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupPath = path.join(BACKUP_DIR, `dev-${timestamp}.db`);

  fs.copyFileSync(DB_PATH, backupPath);
  console.log(`[backup] Database backed up to ${backupPath}`);

  cleanOldBackups(5);

  return backupPath;
}

function cleanOldBackups(keep: number) {
  const files = fs
    .readdirSync(BACKUP_DIR)
    .filter((f) => f.startsWith("dev-") && f.endsWith(".db"))
    .sort()
    .reverse();

  for (const file of files.slice(keep)) {
    fs.unlinkSync(path.join(BACKUP_DIR, file));
    console.log(`[backup] Removed old backup: ${file}`);
  }
}
