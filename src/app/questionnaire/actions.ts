"use server";

import { prisma } from "@/lib/prisma";
import { questionnaireSchema, canonicalizeAnswers } from "@/lib/types";
import type { QuestionnaireAnswers } from "@/lib/types";
import { normalizeChineseGpa } from "@/lib/gap";
import type { Prisma } from "@prisma/client";

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

  try {
    // 5–6. Upsert Student + create QuestionnaireResult atomically.
    // Wrapping in $transaction ensures that if the QR insert fails,
    // the student write is rolled back too.
    const { studentId } = await prisma.$transaction(async (tx) => {
      const existingStudent = await tx.student.findFirst({
        where: {
          name: data.childName,
        },
      });

      let sid: string;

      // Resolve normalizedGPA once per submission. Both update and create
      // paths must agree on this value or the DB row will contradict what
      // the gap engine reports at read time.
      const normalizedGPA = computeNormalizedGpa(
        data.gpaType,
        data.gpaPercentage,
        data.classRank,
      );

      const studentData = {
        gradeLevel: data.currentGrade,
        schoolSystem: data.schoolSystem,
        gpaPercentage: data.gpaPercentage,
        classRank: data.classRank,
        normalizedGPA,
        satScore: data.satScore,
        actScore: data.actScore,
        toeflScore: data.toeflScore,
        ieltsScore: data.ieltsScore,
        scienceGPA: data.scienceGPA,
        targetMajor: data.targetMajor,
      };

      if (existingStudent) {
        await tx.student.update({
          where: { id: existingStudent.id },
          data: studentData,
        });
        sid = existingStudent.id;
      } else {
        const student = await tx.student.create({
          data: {
            name: data.childName,
            ...studentData,
          },
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

    return { success: true, studentId };
  } catch (error) {
    console.error("Questionnaire submission failed:", error);
    return { success: false, error: "数据保存失败，请稍后重试" };
  }
}
