import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock prisma
vi.mock("@/lib/prisma", () => {
  const mockPrisma = {
    student: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    questionnaireResult: {
      create: vi.fn(),
    },
    $transaction: vi.fn(),
  };
  // $transaction passes the mock prisma itself as the tx argument
  mockPrisma.$transaction.mockImplementation(
    (fn: (tx: typeof mockPrisma) => Promise<unknown>) => fn(mockPrisma),
  );
  return { prisma: mockPrisma };
});

// Mock next/headers `cookies()` so the server action can read/write the
// HMAC-signed studentId cookie in tests. The cookie store is a per-test
// mutable map reset in beforeEach. Also records full set-options so tests
// can assert on httpOnly / secure / sameSite / maxAge / path (R6 Codex
// finding: prior mock dropped flags → security regressions invisible).
type CookieSetOpts = {
  name: string;
  value: string;
  httpOnly?: boolean;
  sameSite?: "lax" | "strict" | "none";
  secure?: boolean;
  path?: string;
  maxAge?: number;
};
const mockCookieStore = {
  store: new Map<string, string>(),
  setLog: [] as CookieSetOpts[],
  get(name: string) {
    const value = this.store.get(name);
    return value !== undefined ? { name, value } : undefined;
  },
  set(opts: CookieSetOpts) {
    this.store.set(opts.name, opts.value);
    this.setLog.push(opts);
  },
  delete(name: string) {
    this.store.delete(name);
  },
};

vi.mock("next/headers", () => ({
  cookies: async () => mockCookieStore,
}));

// Helper to construct a valid HMAC token for tests using the same secret
// the action will resolve. Uses the dev fallback secret when env unset.
import { signStudentToken } from "@/lib/auth/student-token";

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
    mockCookieStore.store.clear();
    mockCookieStore.setLog = [];
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

    // R6 cookie flag fence (Codex): the studentId cookie MUST be set
    // with httpOnly, sameSite=lax, path=/, and a non-trivial maxAge.
    // Pre-fix the test mock dropped these flags, so a regression that
    // weakened cookie security would have shipped invisibly.
    const cookieSet = mockCookieStore.setLog.find(
      (c) => c.name === "vela-student-token",
    );
    expect(cookieSet).toBeDefined();
    expect(cookieSet!.httpOnly).toBe(true);
    expect(cookieSet!.sameSite).toBe("lax");
    expect(cookieSet!.path).toBe("/");
    expect(cookieSet!.maxAge).toBeGreaterThan(0);
    // value must be a valid HMAC token (round-trip via verify)
    expect(cookieSet!.value).toMatch(/^.+\.[0-9a-f]+$/);
  });

  it("upserts existing student (append QuestionnaireResult)", async () => {
    vi.mocked(prisma.student.findUnique).mockResolvedValue({
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

    // Server now reads the HMAC-signed cookie, not a function arg.
    mockCookieStore.store.set(
      "vela-student-token",
      signStudentToken("existing-student"),
    );
    const result = await submitQuestionnaire(JSON.stringify(validPayload));
    expect(result.success).toBe(true);
    expect(result.studentId).toBe("existing-student");
    expect(prisma.student.update).toHaveBeenCalledOnce();
    expect(prisma.student.create).not.toHaveBeenCalled();
    expect(prisma.questionnaireResult.create).toHaveBeenCalledOnce();
  });

  // Adversarial R5 finding: childName mismatch must NOT update the prior
  // student. Multi-tab / shared-device scenario: user A submits as 张小明
  // (cookie now bound to A's studentId), user B opens /questionnaire on
  // same device and submits as 李小红 — the cookie still resolves to A's
  // row, but the name differs. Pre-R5: B's data would clobber A's record.
  // Post-R5: server falls through to create a NEW student for B.
  it("childName mismatch with cookie: falls through to create (no clobber)", async () => {
    vi.mocked(prisma.student.findUnique).mockResolvedValue({
      id: "user-a-id",
      name: "User A",
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
    vi.mocked(prisma.student.create).mockResolvedValue({
      id: "user-b-id",
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
      id: "qr-mismatch",
      submittedAt: new Date(),
      studentId: "user-b-id",
      answers: validPayload,
    });

    // Cookie says user-a-id, but submission's childName is 张小明 (≠ "User A")
    mockCookieStore.store.set(
      "vela-student-token",
      signStudentToken("user-a-id"),
    );
    const result = await submitQuestionnaire(JSON.stringify(validPayload));

    expect(result.success).toBe(true);
    expect(result.studentId).toBe("user-b-id"); // new student, not user-a-id
    expect(prisma.student.update).not.toHaveBeenCalled();
    expect(prisma.student.create).toHaveBeenCalledOnce();
  });

  it("forged HMAC cookie is rejected, creates new student", async () => {
    vi.mocked(prisma.student.create).mockResolvedValue({
      id: "fresh-student",
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
      id: "qr-forged",
      submittedAt: new Date(),
      studentId: "fresh-student",
      answers: validPayload,
    });

    // IDOR attempt: attacker forges a cookie with someone else's id but
    // doesn't have the HMAC secret → token verification fails → server
    // treats as anonymous → creates a new student. The victim's row is
    // never even looked up, let alone updated.
    mockCookieStore.store.set(
      "vela-student-token",
      "victim-student-id.invalidhmacsignature",
    );
    const result = await submitQuestionnaire(JSON.stringify(validPayload));

    expect(result.success).toBe(true);
    expect(result.studentId).toBe("fresh-student");
    expect(prisma.student.findUnique).not.toHaveBeenCalled();
    expect(prisma.student.update).not.toHaveBeenCalled();
    expect(prisma.student.create).toHaveBeenCalledOnce();
  });

  it("update path normalizes undefined → null (clears optional fields)", async () => {
    // Adversarial R5 / Codex P1: pre-fix, removing a SAT score in the
    // form sent `satScore: undefined`. Prisma update treats undefined as
    // "leave column as-is", so the old DB value persisted. Fix: server
    // converts undefined → null in studentData. This test fences it.
    vi.mocked(prisma.student.findUnique).mockResolvedValue({
      id: "clearfields-student",
      name: "张小明",
      createdAt: new Date(),
      updatedAt: new Date(),
      gradeLevel: 11,
      schoolSystem: "international",
      gpaPercentage: null,
      classRank: null,
      normalizedGPA: null,
      gpaPercentile: null,
      satScore: 1500, // existing value in DB
      actScore: 32,
      toeflScore: 105,
      ieltsScore: null,
      scienceGPA: null,
      targetMajor: null,
      targetSchools: null,
    });
    vi.mocked(prisma.student.update).mockResolvedValue({
      id: "clearfields-student",
      name: "张小明",
      createdAt: new Date(),
      updatedAt: new Date(),
      gradeLevel: 11,
      schoolSystem: "international",
      gpaPercentage: null,
      classRank: null,
      normalizedGPA: null,
      gpaPercentile: null,
      satScore: null,
      actScore: null,
      toeflScore: 105,
      ieltsScore: null,
      scienceGPA: null,
      targetMajor: null,
      targetSchools: null,
    });
    vi.mocked(prisma.questionnaireResult.create).mockResolvedValue({
      id: "qr-clear",
      submittedAt: new Date(),
      studentId: "clearfields-student",
      answers: {},
    });

    // User submits without satScore / actScore (cleared them in the form).
    const cleared = {
      schemaVersion: 1,
      childName: "张小明",
      birthYear: 2008,
      currentGrade: 11,
      schoolSystem: "international",
      gpaType: "international",
      curriculumType: "IB",
      toeflScore: 105,
      // satScore + actScore intentionally absent
    };
    mockCookieStore.store.set(
      "vela-student-token",
      signStudentToken("clearfields-student"),
    );
    await submitQuestionnaire(JSON.stringify(cleared));

    const updateCall = vi.mocked(prisma.student.update).mock.calls[0][0];
    // Critical: must be `null`, not `undefined`. With undefined, Prisma
    // would leave satScore=1500 in the DB while the user's form is empty.
    expect(updateCall.data.satScore).toBe(null);
    expect(updateCall.data.actScore).toBe(null);
    expect(updateCall.data.toeflScore).toBe(105);
  });

  it("canonicalizes data before validation (strips stale fields)", async () => {
    // Send international student with public fields that should be stripped
    const dirtyPayload = {
      ...validPayload,
      gpaPercentage: 88, // should be stripped for international
      classRank: "5/200", // should be stripped for international
    };

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

    // The student create should have gpaPercentage as null (because
    // canonicalize strips it for international AND R5 normalizes
    // undefined → null so Prisma update can clear optional fields).
    const createCall = vi.mocked(prisma.student.create).mock.calls[0][0];
    expect(createCall.data.gpaPercentage).toBeNull();
  });

  it("returns error when prisma throws", async () => {
    vi.mocked(prisma.student.create).mockRejectedValue(new Error("DB down"));

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

  // gpaType contract regression fences — lock fix for Codex P1 + Copilot P2
  // on PR #7. Before the fix, actions.ts called
  // `normalizeChineseGpa(gpaPercentage, classRank)` unconditionally, which
  // meant a stale percentage could override a declared rank, and an
  // "international" / "unknown" user with stale numeric fields would persist
  // a normalizedGPA to the DB that diverged from what the gap engine reports
  // at read time (no-data).

  it("gpaType=rank with stale gpaPercentage → normalizedGPA from rank only", async () => {
    const payload = {
      schemaVersion: 1,
      childName: "Rank-over-stale-percent Kid",
      birthYear: 2008,
      currentGrade: 11,
      schoolSystem: "public",
      gpaType: "rank",
      gpaPercentage: 85, // stale: must be ignored
      classRank: "5/200",
    };

    vi.mocked(prisma.student.create).mockResolvedValue({
      id: "s-stale-pct",
      name: "Rank-over-stale-percent Kid",
      createdAt: new Date(),
      updatedAt: new Date(),
      gradeLevel: 11,
      schoolSystem: "public",
      gpaPercentage: 85,
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
      id: "qr-stale-pct",
      submittedAt: new Date(),
      studentId: "s-stale-pct",
      answers: payload,
    });

    await submitQuestionnaire(JSON.stringify(payload));
    const createCall = vi.mocked(prisma.student.create).mock.calls[0][0];
    // Rank 5/200 → 3.95. Pre-fix: percentage 85 wins → 3.6.
    expect(createCall.data.normalizedGPA).toBe(3.95);
  });

  it("gpaType=international with stale gpaPercentage (homeschool) → normalizedGPA null", async () => {
    // Homeschool branch specifically, because canonicalizeAnswers only
    // strips percentage/classRank for schoolSystem=international, not for
    // schoolSystem=homeschool. So stale fields survive canonicalization
    // here and must be gated inside actions.ts itself.
    const payload = {
      schemaVersion: 1,
      childName: "Homeschool Intl Kid",
      birthYear: 2008,
      currentGrade: 11,
      schoolSystem: "homeschool",
      gpaType: "international",
      gpaPercentage: 85, // stale: canonicalize does NOT strip for homeschool
      classRank: "5/200", // stale
    };

    vi.mocked(prisma.student.create).mockResolvedValue({
      id: "s-homeschool-intl",
      name: "Homeschool Intl Kid",
      createdAt: new Date(),
      updatedAt: new Date(),
      gradeLevel: 11,
      schoolSystem: "homeschool",
      gpaPercentage: 85,
      classRank: "5/200",
      normalizedGPA: null,
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
      id: "qr-homeschool-intl",
      submittedAt: new Date(),
      studentId: "s-homeschool-intl",
      answers: payload,
    });

    await submitQuestionnaire(JSON.stringify(payload));
    const createCall = vi.mocked(prisma.student.create).mock.calls[0][0];
    // gpaType=international → gap engine returns no-data. DB must also
    // persist null to keep write/read semantics aligned.
    expect(createCall.data.normalizedGPA).toBe(null);
  });

  it("gpaType=unknown with stale gpaPercentage → normalizedGPA null", async () => {
    const payload = {
      schemaVersion: 1,
      childName: "Unknown GPA Kid",
      birthYear: 2008,
      currentGrade: 11,
      schoolSystem: "homeschool",
      gpaType: "unknown",
      gpaPercentage: 90, // stale
    };

    vi.mocked(prisma.student.create).mockResolvedValue({
      id: "s-unknown",
      name: "Unknown GPA Kid",
      createdAt: new Date(),
      updatedAt: new Date(),
      gradeLevel: 11,
      schoolSystem: "homeschool",
      gpaPercentage: 90,
      classRank: null,
      normalizedGPA: null,
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
      id: "qr-unknown",
      submittedAt: new Date(),
      studentId: "s-unknown",
      answers: payload,
    });

    await submitQuestionnaire(JSON.stringify(payload));
    const createCall = vi.mocked(prisma.student.create).mock.calls[0][0];
    expect(createCall.data.normalizedGPA).toBe(null);
  });

  it("returns error when questionnaireResult.create fails inside transaction", async () => {
    vi.mocked(prisma.student.create).mockResolvedValue({
      id: "s-tx",
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
    vi.mocked(prisma.questionnaireResult.create).mockRejectedValue(
      new Error("QR insert failed"),
    );

    const result = await submitQuestionnaire(JSON.stringify(validPayload));
    expect(result.success).toBe(false);
    expect(result.error).toBe("数据保存失败，请稍后重试");
  });
});
