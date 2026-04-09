import path from "node:path";
import { tmpdir } from "node:os";

// Vitest globalSetup provisions the test DB in the main process and writes
// its URL to VELA_TEST_DB_URL before any worker forks, so workers inherit
// the same path via the environment. A unique per-run suffix (set in
// globalSetup) prevents concurrent vitest runs on the same machine — e.g.
// watch mode + a manual run, or parallel CI jobs — from colliding on a
// single shared DB file.
//
// Do NOT compute the suffix here: this module is imported by worker
// processes whose PID != the main process PID, so any per-process value
// generated at import time would diverge from what globalSetup wrote.
//
// The fallback path is only used by non-vitest callers (standalone
// scripts, IDE tooling) and is intentionally predictable.
const FALLBACK_PATH = path.join(tmpdir(), "vela-vitest-fallback.db");
const FALLBACK_URL = `file:${FALLBACK_PATH}`;

export const TEST_DB_URL = process.env.VELA_TEST_DB_URL ?? FALLBACK_URL;
export const TEST_DB_PATH = TEST_DB_URL.replace(/^file:/, "");
