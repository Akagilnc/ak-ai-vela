"use server";

import { prisma } from "@/lib/prisma";
import { questionnaireSchema, canonicalizeAnswers } from "@/lib/types";
import type { Prisma } from "@prisma/client";

export type SubmitResult = {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
  studentId?: string;
};

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
    // 5. Upsert Student by childName + birthYear
    const existingStudent = await prisma.student.findFirst({
      where: {
        name: data.childName,
        // birthYear is not directly on Student, but we check gradeLevel + name
        // For MVP: upsert by name (single user, single child)
      },
    });

    let studentId: string;

    if (existingStudent) {
      // Update existing student with latest data
      await prisma.student.update({
        where: { id: existingStudent.id },
        data: {
          gradeLevel: data.currentGrade,
          schoolSystem: data.schoolSystem,
          gpaPercentage: data.gpaPercentage,
          classRank: data.classRank,
          normalizedGPA: data.gpaPercentage != null ? data.gpaPercentage / 25 : null, // rough 100→4.0
          satScore: data.satScore,
          actScore: data.actScore,
          toeflScore: data.toeflScore,
          ieltsScore: data.ieltsScore,
          scienceGPA: data.scienceGPA,
          targetMajor: data.targetMajor,
        },
      });
      studentId = existingStudent.id;
    } else {
      // Create new student
      const student = await prisma.student.create({
        data: {
          name: data.childName,
          gradeLevel: data.currentGrade,
          schoolSystem: data.schoolSystem,
          gpaPercentage: data.gpaPercentage,
          classRank: data.classRank,
          normalizedGPA: data.gpaPercentage != null ? data.gpaPercentage / 25 : null,
          satScore: data.satScore,
          actScore: data.actScore,
          toeflScore: data.toeflScore,
          ieltsScore: data.ieltsScore,
          scienceGPA: data.scienceGPA,
          targetMajor: data.targetMajor,
        },
      });
      studentId = student.id;
    }

    // 6. Create QuestionnaireResult (always append, for growth tracking)
    await prisma.questionnaireResult.create({
      data: {
        studentId,
        answers: data as unknown as Prisma.InputJsonValue,
      },
    });

    return { success: true, studentId };
  } catch (error) {
    console.error("Questionnaire submission failed:", error);
    return { success: false, error: "数据保存失败，请稍后重试" };
  }
}
