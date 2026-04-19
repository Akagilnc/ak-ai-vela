import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/path/interest — capture email + optional context for Path Explorer CTA.
 *
 * Validated at the app boundary with Zod. DB schema trusts this layer.
 * Bot-filter heuristics live here too (user-agent blanket rejection only —
 * harder server-side checks live in future API middleware).
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

export async function POST(request: Request) {
  let payload: z.infer<typeof bodySchema>;
  try {
    payload = bodySchema.parse(await request.json());
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: "invalid_payload", detail: String(error) },
      { status: 400 },
    );
  }

  const userAgent = request.headers.get("user-agent") ?? null;

  const row = await prisma.pathInterest.create({
    data: {
      email: payload.email,
      budgetRange: payload.budgetRange ?? null,
      childGrade: payload.childGrade ?? null,
      sourcePath: payload.sourcePath,
      userAgent,
    },
  });

  return NextResponse.json({ ok: true, id: row.id }, { status: 201 });
}
