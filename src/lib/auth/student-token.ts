/**
 * HMAC-signed studentId token, stored in an HttpOnly cookie.
 *
 * Why this exists:
 *   The R3 fix (`actions.ts`) replaced name-based lookup with
 *   `findUnique({ where: { id: studentId } })`. The studentId was passed
 *   from the client. Adversarial review (cross-model, R5) flagged this
 *   as IDOR (Insecure Direct Object Reference): anyone with a leaked
 *   `?studentId=X` URL could submit a form and silently overwrite X's
 *   profile, since the server had no auth/ownership check.
 *
 * Fix:
 *   The server signs the studentId with HMAC-SHA256 on first submit,
 *   sets it as an HttpOnly cookie. On subsequent submits, the server
 *   reads the cookie and verifies the HMAC before trusting the id.
 *   The client never sees or sends the raw studentId — the cookie is
 *   the only path. URL leakage is no longer a write capability.
 *
 * This is MVP-scoped: it doesn't replace a real auth/user model.
 * It just closes the trust-boundary hole that the studentId migration
 * opened. When this app gets a real auth model (post 100-user MVP),
 * Student should hang off User and ownership checks should join through
 * the user table — that supersedes this token.
 */

import { createHmac, timingSafeEqual } from "crypto";

const ALGO = "sha256";

/**
 * The cookie name used to store the HMAC-signed studentId. Exported so
 * read-side and write-side consumers can't drift (R1 PR review, gemini).
 */
export const STUDENT_COOKIE_NAME = "vela-student-token";

/**
 * Resolved signing secret. Cached after first resolution (R1 PR review,
 * gemini): pre-fix, env-var lookups + branch checks ran on every call.
 *
 * Resolution defers to first use rather than module load. Module-load
 * resolution would block `next build` (Next.js imports server modules
 * during page data collection with NODE_ENV=production but no env vars
 * in the build environment). The R6 probe in `actions.ts` calls
 * `signStudentToken("__probe__")` BEFORE any DB write, so a misconfigured
 * production fails on the FIRST request — not at boot, but before any
 * data corruption can occur. That's the closest we can get to fail-fast
 * without breaking the Next.js build phase.
 */
let cachedSecret: string | null = null;

function getSecret(): string {
  if (cachedSecret !== null) return cachedSecret;

  const fromEnv = process.env.STUDENT_TOKEN_SECRET;
  if (fromEnv && fromEnv.length >= 32) {
    cachedSecret = fromEnv;
    return cachedSecret;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "STUDENT_TOKEN_SECRET env var is required in production " +
        "(must be at least 32 chars). See .env.example.",
    );
  }

  // Dev/test fallback. Warn loudly so it's not silent.
  // eslint-disable-next-line no-console
  console.warn(
    "[student-token] STUDENT_TOKEN_SECRET not set — using insecure dev default. " +
      "Set the env var before deploying.",
  );
  cachedSecret = "dev-only-insecure-secret-do-not-use-in-production-______________";
  return cachedSecret;
}

/**
 * Sign a studentId. Returns `${studentId}.${hmacHex}` — the studentId is
 * cleartext (the secret is the HMAC key, not the id), so a verifier can
 * extract the id directly from the token after verification.
 */
export function signStudentToken(studentId: string): string {
  if (!studentId || typeof studentId !== "string") {
    throw new Error("signStudentToken: studentId must be a non-empty string");
  }
  const mac = createHmac(ALGO, getSecret()).update(studentId).digest("hex");
  return `${studentId}.${mac}`;
}

/**
 * Verify a token. Returns the studentId if valid, null otherwise.
 *
 * Constant-time HMAC comparison via `timingSafeEqual` — prevents timing
 * attacks where an attacker could measure response time to learn the
 * correct prefix of a forged HMAC.
 */
export function verifyStudentToken(token: string | undefined | null): string | null {
  if (!token || typeof token !== "string") return null;

  const sep = token.lastIndexOf(".");
  if (sep <= 0 || sep >= token.length - 1) return null;

  const studentId = token.slice(0, sep);
  const providedMac = token.slice(sep + 1);

  if (!studentId || !providedMac) return null;

  const expectedMac = createHmac(ALGO, getSecret()).update(studentId).digest("hex");

  // Length check before timingSafeEqual (which throws on length mismatch).
  if (providedMac.length !== expectedMac.length) return null;

  try {
    const a = Buffer.from(providedMac, "hex");
    const b = Buffer.from(expectedMac, "hex");
    if (a.length !== b.length) return null;
    return timingSafeEqual(a, b) ? studentId : null;
  } catch {
    return null;
  }
}
