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
 * Get the signing secret. In production, the env var MUST be set.
 * In dev/test, fall back to a banner-warned constant so local dev works
 * without setup, but production deploys without the env var refuse to
 * boot (defense against accidentally shipping the dev secret).
 */
function getSecret(): string {
  const secret = process.env.STUDENT_TOKEN_SECRET;
  if (secret && secret.length >= 32) return secret;

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
  return "dev-only-insecure-secret-do-not-use-in-production-______________";
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
