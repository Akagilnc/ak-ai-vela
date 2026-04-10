import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock prisma
vi.mock("@/lib/prisma", () => ({
  prisma: {
    student: {
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    questionnaireResult: {
      create: vi.fn(),
    },
  },
}));

import { submitQuestionnaire } from "@/app/questionnaire/actions";
import { prisma } from "@/lib/prisma";

const validPayload = {
  schemaVersion: 1,
  childName: "张小明",
  birthYear: 2008,
  currentGrade: 11,
  schoolSystem: "international",
  gpaType: "international",
  curriculumType: "IB",
  satScore: 1420,
  toeflScore: 105,
};

describe("submitQuestionnaire server action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns error for invalid JSON", async () => {
    const result = await submitQuestionnaire("not json{{{");
    expect(result.success).toBe(false);
    expect(result.error).toBe("提交数据格式错误");
  });

  it("returns field errors for invalid data", async () => {
    const result = await submitQuestionnaire(JSON.stringify({}));
    expect(result.success).toBe(false);
    expect(result.fieldErrors).toBeDefined();
  });

  it("creates new student and questionnaire result", async () => {
    vi.mocked(prisma.student.findFirst).mockResolvedValue(null);
    vi.mocked(prisma.student.create).mockResolvedValue({
      id: "student-1",
      name: "张小明",
      createdAt: new Date(),
      updatedAt: new Date(),
      gradeLevel: 11,
      schoolSystem: "international",
      gpaPercentage: null,
      classRank: null,
      normalizedGPA: null,
      gpaPercentile: null,
      satScore: 1420,
      actScore: null,
      toeflScore: 105,
      ieltsScore: null,
      scienceGPA: null,
      targetMajor: null,
      targetSchools: null,
    });
    vi.mocked(prisma.questionnaireResult.create).mockResolvedValue({
      id: "qr-1",
      submittedAt: new Date(),
      studentId: "student-1",
      answers: validPayload,
    });

    const result = await submitQuestionnaire(JSON.stringify(validPayload));
    expect(result.success).toBe(true);
    expect(result.studentId).toBe("student-1");
    expect(prisma.student.create).toHaveBeenCalledOnce();
    expect(prisma.questionnaireResult.create).toHaveBeenCalledOnce();
  });

  it("upserts existing student (append QuestionnaireResult)", async () => {
    vi.mocked(prisma.student.findFirst).mockResolvedValue({
      id: "existing-student",
      name: "张小明",
      createdAt: new Date(),
      updatedAt: new Date(),
      gradeLevel: 10,
      schoolSystem: "public",
      gpaPercentage: 85,
      classRank: null,
      normalizedGPA: 3.4,
      gpaPercentile: null,
      satScore: null,
      actScore: null,
      toeflScore: null,
      ieltsScore: null,
      scienceGPA: null,
      targetMajor: null,
      targetSchools: null,
    });
    vi.mocked(prisma.student.update).mockResolvedValue({
      id: "existing-student",
      name: "张小明",
      createdAt: new Date(),
      updatedAt: new Date(),
      gradeLevel: 11,
      schoolSystem: "international",
      gpaPercentage: null,
      classRank: null,
      normalizedGPA: null,
      gpaPercentile: null,
      satScore: 1420,
      actScore: null,
      toeflScore: 105,
      ieltsScore: null,
      scienceGPA: null,
      targetMajor: null,
      targetSchools: null,
    });
    vi.mocked(prisma.questionnaireResult.create).mockResolvedValue({
      id: "qr-2",
      submittedAt: new Date(),
      studentId: "existing-student",
      answers: validPayload,
    });

    const result = await submitQuestionnaire(JSON.stringify(validPayload));
    expect(result.success).toBe(true);
    expect(result.studentId).toBe("existing-student");
    expect(prisma.student.update).toHaveBeenCalledOnce();
    expect(prisma.student.create).not.toHaveBeenCalled();
    expect(prisma.questionnaireResult.create).toHaveBeenCalledOnce();
  });

  it("canonicalizes data before validation (strips stale fields)", async () => {
    // Send international student with public fields that should be stripped
    const dirtyPayload = {
      ...validPayload,
      gpaPercentage: 88, // should be stripped for international
      classRank: "5/200", // should be stripped for international
    };

    vi.mocked(prisma.student.findFirst).mockResolvedValue(null);
    vi.mocked(prisma.student.create).mockResolvedValue({
      id: "s1",
      name: "张小明",
      createdAt: new Date(),
      updatedAt: new Date(),
      gradeLevel: 11,
      schoolSystem: "international",
      gpaPercentage: null,
      classRank: null,
      normalizedGPA: null,
      gpaPercentile: null,
      satScore: 1420,
      actScore: null,
      toeflScore: 105,
      ieltsScore: null,
      scienceGPA: null,
      targetMajor: null,
      targetSchools: null,
    });
    vi.mocked(prisma.questionnaireResult.create).mockResolvedValue({
      id: "qr-1",
      submittedAt: new Date(),
      studentId: "s1",
      answers: {},
    });

    const result = await submitQuestionnaire(JSON.stringify(dirtyPayload));
    expect(result.success).toBe(true);

    // The student create should have gpaPercentage as null
    // (because canonicalize strips it for international)
    const createCall = vi.mocked(prisma.student.create).mock.calls[0][0];
    expect(createCall.data.gpaPercentage).toBeUndefined();
  });

  it("returns error when prisma throws", async () => {
    vi.mocked(prisma.student.findFirst).mockRejectedValue(new Error("DB down"));

    const result = await submitQuestionnaire(JSON.stringify(validPayload));
    expect(result.success).toBe(false);
    expect(result.error).toBe("数据保存失败，请稍后重试");
  });

  it("validates conditional rules (public school needs gpa or rank)", async () => {
    const publicNoGpa = {
      schemaVersion: 1,
      childName: "Test",
      birthYear: 2010,
      currentGrade: 9,
      schoolSystem: "public",
      gpaType: "percentage",
      // no gpaPercentage, no classRank
    };
    const result = await submitQuestionnaire(JSON.stringify(publicNoGpa));
    expect(result.success).toBe(false);
    expect(result.fieldErrors?.gpaPercentage).toBeDefined();
  });

  // Regression fences for the GPA double-path bug fixed in M3 (design doc
  // Finding 12). Without these, someone could silently revert actions.ts
  // to the old `gpaPercentage / 25` math and no test would catch it.
  it("persists normalizedGPA via @/lib/gap midpoint table for percentage", async () => {
    const percentagePayload = {
      schemaVersion: 1,
      childName: "GPA Test Child",
      birthYear: 2008,
      currentGrade: 11,
      schoolSystem: "public",
      gpaType: "percentage",
      gpaPercentage: 90,
    };

    vi.mocked(prisma.student.findFirst).mockResolvedValue(null);
    vi.mocked(prisma.student.create).mockResolvedValue({
      id: "gpa-student",
      name: "GPA Test Child",
      createdAt: new Date(),
      updatedAt: new Date(),
      gradeLevel: 11,
      schoolSystem: "public",
      gpaPercentage: 90,
      classRank: null,
      normalizedGPA: 3.8,
      gpaPercentile: null,
      satScore: null,
      actScore: null,
      toeflScore: null,
      ieltsScore: null,
      scienceGPA: null,
      targetMajor: null,
      targetSchools: null,
    });
    vi.mocked(prisma.questionnaireResult.create).mockResolvedValue({
      id: "qr-gpa",
      submittedAt: new Date(),
      studentId: "gpa-student",
      answers: percentagePayload,
    });

    await submitQuestionnaire(JSON.stringify(percentagePayload));
    const createCall = vi.mocked(prisma.student.create).mock.calls[0][0];
    // CEO plan midpoint: 90% → 3.8 (NOT 90/25 = 3.6 from pre-M3 math)
    expect(createCall.data.normalizedGPA).toBe(3.8);
  });

  it("persists normalizedGPA from classRank when percentage missing", async () => {
    const rankPayload = {
      schemaVersion: 1,
      childName: "Rank Test Child",
      birthYear: 2008,
      currentGrade: 11,
      schoolSystem: "public",
      gpaType: "rank",
      classRank: "5/200",
    };

    vi.mocked(prisma.student.findFirst).mockResolvedValue(null);
    vi.mocked(prisma.student.create).mockResolvedValue({
      id: "rank-student",
      name: "Rank Test Child",
      createdAt: new Date(),
      updatedAt: new Date(),
      gradeLevel: 11,
      schoolSystem: "public",
      gpaPercentage: null,
      classRank: "5/200",
      normalizedGPA: 3.95,
      gpaPercentile: null,
      satScore: null,
      actScore: null,
      toeflScore: null,
      ieltsScore: null,
      scienceGPA: null,
      targetMajor: null,
      targetSchools: null,
    });
    vi.mocked(prisma.questionnaireResult.create).mockResolvedValue({
      id: "qr-rank",
      submittedAt: new Date(),
      studentId: "rank-student",
      answers: rankPayload,
    });

    await submitQuestionnaire(JSON.stringify(rankPayload));
    const createCall = vi.mocked(prisma.student.create).mock.calls[0][0];
    // Rank 5/200 → top 2.5% → 3.95 (pre-M3 math ignored rank entirely → null)
    expect(createCall.data.normalizedGPA).toBe(3.95);
  });
});
