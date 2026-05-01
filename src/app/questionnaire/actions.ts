"use server";

import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { questionnaireSchema, canonicalizeAnswers } from "@/lib/types";
import type { QuestionnaireAnswers } from "@/lib/types";
import { normalizeChineseGpa } from "@/lib/gap";
import {
  signStudentToken,
  verifyStudentToken,
  STUDENT_COOKIE_NAME,
} from "@/lib/auth/student-token";
import type { Prisma } from "@prisma/client";

const STUDENT_COOKIE_MAX_AGE_S = 60 * 60 * 24 * 90; // 90 days

export type SubmitResult = {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
  studentId?: string;
};

// Compute the DB-persisted normalizedGPA per the gpaType contract.
// Mirrors the gap engine's gpa dimension so that what we write at
// submission time matches what the engine reports at read time.
//
// Critical: branch on `gpaType`, not on field presence. The Step 3 form
// does not clear inactive fields when the user switches gpaType, so a
// payload can carry a stale `gpaPercentage` alongside `gpaType: "rank"`.
// If we fell back on presence (or on normalizeChineseGpa's internal
// percentage-wins precedence), the DB row would silently disagree with
// the engine. See PR #7 Codex P1 + Copilot review.
function computeNormalizedGpa(
  gpaType: QuestionnaireAnswers["gpaType"],
  gpaPercentage: number | null | undefined,
  classRank: string | null | undefined,
): number | null {
  if (gpaType === "percentage") {
    return normalizeChineseGpa(gpaPercentage ?? null, null);
  }
  if (gpaType === "rank") {
    return normalizeChineseGpa(null, classRank ?? null);
  }
  // "international" / "unknown": gap engine returns no-data for these,
  // so the persisted value must also be null to keep write/read aligned.
  return null;
}

/**
 * Normalize undefined → null for optional fields. Prisma's update treats
 * `undefined` as "leave column as-is", so an absent SAT score in a fresh
 * submission silently keeps the old DB value instead of clearing it.
 * Adversarial review (R5, Codex P1) flagged this as silent data corruption.
 *
 * For create, undefined is fine — Prisma uses the column default. We use
 * null explicitly to make the contract identical for both paths.
 */
function nullishify<T>(v: T | undefined): T | null {
  return v === undefined ? null : v;
}

export async function submitQuestionnaire(rawJson: string): Promise<SubmitResult> {
  // 1. Parse JSON
  let rawData: Record<string, unknown>;
  try {
    rawData = JSON.parse(rawJson);
  } catch {
    return { success: false, error: "提交数据格式错误" };
  }

  // 2. Canonicalize: strip stale conditional fields
  const canonicalized = canonicalizeAnswers(rawData);

  // 3. Ensure schemaVersion
  canonicalized.schemaVersion = 1;

  // 4. Validate with Zod
  const result = questionnaireSchema.safeParse(canonicalized);
  if (!result.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const key = issue.path.join(".");
      fieldErrors[key] = issue.message;
    }
    return { success: false, error: "请检查填写内容", fieldErrors };
  }

  const data = result.data;

  // 5. Server-side studentId trust boundary.
  //    Read the HMAC-signed cookie set on prior submit. The client never
  //    sees or sends raw studentId — so a leaked /complete?studentId=X URL
  //    is not a write capability. Adversarial review (R5) flagged the
  //    prior client-supplied param as IDOR. See lib/auth/student-token.ts.
  const cookieStore = await cookies();
  const trustedStudentId = verifyStudentToken(
    cookieStore.get(STUDENT_COOKIE_NAME)?.value,
  );

  // 5a. Validate the signing secret BEFORE any DB write. R6 finding (Codex):
  //     pre-fix, signStudentToken() was only called AFTER prisma.$transaction
  //     committed Student + QuestionnaireResult. If the secret was missing or
  //     misconfigured in prod (signStudentToken throws), the DB rows were
  //     already committed but the cookie was never set → the client retried
  //     and created duplicates on every attempt. Fail fast: do a dry sign of
  //     a probe value so the env-var check fires before we touch the DB.
  try {
    signStudentToken("__probe__");
  } catch (e) {
    console.error("Questionnaire submission blocked: token secret invalid:", e);
    return { success: false, error: "服务暂时不可用，请稍后重试" };
  }

  try {
    // 6–7. Upsert Student + create QuestionnaireResult atomically.
    //      Wrapping in $transaction ensures that if the QR insert fails,
    //      the student write is rolled back too.
    const { studentId: resultStudentId } = await prisma.$transaction(async (tx) => {
      // Trust the HMAC-verified studentId. If absent or invalid, create
      // a new student. If present but the row's name doesn't match the
      // submitted childName, treat as a different student (don't clobber).
      // The mismatch case covers shared-device / multi-tab scenarios where
      // the cookie survives but the user is filling out a different kid's
      // form. Adversarial R5 finding.
      const existingStudent = trustedStudentId
        ? await tx.student.findUnique({ where: { id: trustedStudentId } })
        : null;

      const useExisting =
        existingStudent !== null && existingStudent.name === data.childName;

      let sid: string;

      // Resolve normalizedGPA once per submission. Both update and create
      // paths must agree on this value or the DB row will contradict what
      // the gap engine reports at read time.
      const normalizedGPA = computeNormalizedGpa(
        data.gpaType,
        data.gpaPercentage,
        data.classRank,
      );

      // Normalize undefined → null so Prisma update actually clears
      // optional fields when the user removes them in the form.
      // Without this, a removed SAT score silently keeps the old DB value.
      const studentData = {
        name: data.childName,
        gradeLevel: nullishify(data.currentGrade),
        schoolSystem: nullishify(data.schoolSystem),
        gpaPercentage: nullishify(data.gpaPercentage),
        classRank: nullishify(data.classRank),
        normalizedGPA,
        satScore: nullishify(data.satScore),
        actScore: nullishify(data.actScore),
        toeflScore: nullishify(data.toeflScore),
        ieltsScore: nullishify(data.ieltsScore),
        scienceGPA: nullishify(data.scienceGPA),
        targetMajor: nullishify(data.targetMajor),
      };

      if (useExisting) {
        await tx.student.update({
          where: { id: existingStudent!.id },
          data: studentData,
        });
        sid = existingStudent!.id;
      } else {
        const student = await tx.student.create({
          data: studentData,
        });
        sid = student.id;
      }

      // Create QuestionnaireResult (always append, for growth tracking)
      await tx.questionnaireResult.create({
        data: {
          studentId: sid,
          answers: data as unknown as Prisma.InputJsonValue,
        },
      });

      return { studentId: sid };
    });

    // 8. Set / refresh the HMAC-signed cookie on success. HttpOnly so
    //    JavaScript can't read it (defense against XSS-stealing the id);
    //    SameSite=Lax so it ships on top-level navigations to /complete.
    cookieStore.set({
      name: STUDENT_COOKIE_NAME,
      value: signStudentToken(resultStudentId),
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: STUDENT_COOKIE_MAX_AGE_S,
    });

    return { success: true, studentId: resultStudentId };
  } catch (error) {
    console.error("Questionnaire submission failed:", error);
    return { success: false, error: "数据保存失败，请稍后重试" };
  }
}

/**
 * Server action invoked by the "重新开始" UI to clear the student token.
 * Use this when the user explicitly starts a new student record on the
 * same device (e.g., second child). Without this, the cookie would carry
 * over and the next submission would attempt to update the prior student.
 */
export async function clearStudentSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(STUDENT_COOKIE_NAME);
}
