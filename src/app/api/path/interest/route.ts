import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { canonicalSourcePath } from "@/lib/path/canonical-source";

/**
 * POST /api/path/interest — capture email + optional context for Path Explorer CTA.
 *
 * Validated at the app boundary with Zod. DB trusts this layer.
 * Idempotent: create-then-update-on-conflict keyed by (email, sourcePath)
 * so double-submits, retries, and WeChat network replays all converge on
 * one row. Defense-in-depth: email trimmed + lower-cased, Zod `detail`
 * scrubbed in prod, Prisma errors caught.
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

  const updateData = {
    budgetRange: payload.budgetRange ?? null,
    childGrade: payload.childGrade ?? null,
    userAgent,
  };
  const whereCompositeKey = {
    email_sourcePath: {
      email: normalizedEmail,
      sourcePath: normalizedSourcePath,
    },
  };

  // R1 review fix (Gemini): Prisma 7 + better-sqlite3 adapter has a known
  // bug where `upsert` with a composite unique key (@@unique([email,
  // sourcePath])) compiles to SQL that the adapter can't execute. We sidestep
  // by trying create first and catching the P2002 unique-constraint error
  // to fall through to update. This keeps the semantic atomicity (DB
  // enforces the unique key) and gets us correct 201/200 status codes for
  // create vs update, without the broken `upsert` codepath.
  try {
    const row = await prisma.pathInterest.create({
      data: {
        email: normalizedEmail,
        sourcePath: normalizedSourcePath,
        ...updateData,
      },
    });
    return NextResponse.json({ ok: true, id: row.id }, { status: 201 });
  } catch (error) {
    const codeField = (error as { code?: unknown })?.code;
    const isUniqueConflict =
      codeField === "P2002" ||
      (error instanceof Error &&
        /UNIQUE\s+constraint\s+failed/i.test(error.message));
    if (isUniqueConflict) {
      try {
        const row = await prisma.pathInterest.update({
          where: whereCompositeKey,
          data: updateData,
        });
        return NextResponse.json({ ok: true, id: row.id }, { status: 200 });
      } catch (updateError) {
        return handleWriteFailure(updateError);
      }
    }
    return handleWriteFailure(error);
  }
}

/**
 * Shared failure handler for both the create path and the update fallback.
 * Structured response lets the client distinguish "retry" from "permanent
 * failure" without leaking Prisma internals. Log only the error class +
 * Prisma code — never `.message` — because Prisma can echo the query
 * object (including the user's email, embedded in P2002 `meta`) into stderr,
 * which could land in CI / container log aggregators.
 */
function handleWriteFailure(error: unknown) {
  if (!isProd) {
    const name = error instanceof Error ? error.name : "unknown";
    const codeField = (error as { code?: unknown })?.code;
    const prismaCode =
      typeof codeField === "string" ? ` ${codeField}` : "";
    console.error(`[api/path/interest] write failed: ${name}${prismaCode}`);
  }
  return NextResponse.json(
    { ok: false, error: "write_failed", retryable: true },
    { status: 503 },
  );
}
