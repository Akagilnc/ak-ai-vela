import path from "node:path";
import { tmpdir } from "node:os";

// Shared temp SQLite path used by both the vitest globalSetup (which
// provisions + seeds the DB) and by individual integration tests (which
// open it read-only). Deterministic path so every test file can create its
// own PrismaClient without IPC.
export const TEST_DB_PATH = path.join(tmpdir(), "vela-vitest.db");
export const TEST_DB_URL = `file:${TEST_DB_PATH}`;
