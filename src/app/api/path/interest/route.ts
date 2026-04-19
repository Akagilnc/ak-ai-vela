import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/path/interest — capture email + optional context for Path Explorer CTA.
 *
 * Validated at the app boundary with Zod. DB trusts this layer.
 * Idempotent: upsert keyed by (email, sourcePath) so double-submits, retries,
 * and WeChat network replays all converge on one row. Defense-in-depth: email
 * trimmed + lower-cased, Zod `detail` scrubbed in prod, Prisma errors caught.
 *
 * Known gaps deferred to v0.5+: rate limiting, honeypot, CSRF, captcha.
 */

const bodySchema = z.object({
  email: z.string().email().max(254),
  budgetRange: z
    .enum(["<50k", "50-100k", "100-200k", "200k+"])
    .nullable()
    .optional(),
  childGrade: z
    .enum(["G4", "G5", "G6", "G7", "G8"])
    .nullable()
    .optional(),
  sourcePath: z.string().max(200).default("/path"),
});

const isProd = process.env.NODE_ENV === "production";

/**
 * Canonicalize sourcePath so `/path`, `/path `, `/path?x=1`, `/path#anchor`
 * all collapse to the same key — otherwise the @@unique(email, sourcePath)
 * dedup is trivially bypassed by URL drift.
 */
function canonicalSourcePath(raw: string): string {
  const trimmed = raw.trim();
  const qIdx = trimmed.indexOf("?");
  const hIdx = trimmed.indexOf("#");
  const cut =
    qIdx === -1 && hIdx === -1
      ? trimmed
      : trimmed.slice(0, Math.min(...[qIdx, hIdx].filter((i) => i !== -1)));
  return cut.replace(/\/+$/g, "") || "/";
}

export async function POST(request: Request) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_json" },
      { status: 400 },
    );
  }

  const parsed = bodySchema.safeParse(raw);
  if (!parsed.success) {
    // In prod, scrub Zod's internal error shape (schema field names, enum options,
    // constraints) from client response — useful telemetry for attackers probing
    // the endpoint. In dev, keep it verbose so developers can iterate.
    return NextResponse.json(
      {
        ok: false,
        error: "invalid_payload",
        ...(isProd ? {} : { detail: parsed.error.issues }),
      },
      { status: 400 },
    );
  }
  const payload = parsed.data;

  const normalizedEmail = payload.email.trim().toLowerCase();
  const normalizedSourcePath = canonicalSourcePath(payload.sourcePath);
  const userAgent = request.headers.get("user-agent") ?? null;

  try {
    const row = await prisma.pathInterest.upsert({
      where: {
        email_sourcePath: {
          email: normalizedEmail,
          sourcePath: normalizedSourcePath,
        },
      },
      update: {
        budgetRange: payload.budgetRange ?? null,
        childGrade: payload.childGrade ?? null,
        userAgent,
      },
      create: {
        email: normalizedEmail,
        budgetRange: payload.budgetRange ?? null,
        childGrade: payload.childGrade ?? null,
        sourcePath: normalizedSourcePath,
        userAgent,
      },
    });

    return NextResponse.json({ ok: true, id: row.id }, { status: 201 });
  } catch (error) {
    // Structured error — client can distinguish "retry" from "permanent failure"
    // without us leaking Prisma internals. Log only the error code + message so
    // we don't stream the user's email (embedded in Prisma P2002 `meta`) to
    // stderr, which could land in CI / container log aggregators.
    if (!isProd) {
      const code = error instanceof Error ? error.name : "unknown";
      const msg = error instanceof Error ? error.message.split("\n")[0] : "unknown";
      console.error(`[api/path/interest] write failed: ${code} — ${msg}`);
    }
    return NextResponse.json(
      { ok: false, error: "write_failed", retryable: true },
      { status: 503 },
    );
  }
}
