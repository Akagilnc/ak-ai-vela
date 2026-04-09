import { describe, it, expect } from "vitest";
import { countMissingImportant } from "@/lib/review-rules";
import type { QuestionnaireDraft } from "@/lib/types";

// P3: the review-page "缺少 N 项重要信息" warning must respect schoolSystem.
// International schools don't have a GPA percentage at all — requiring one
// produces a false-positive that makes users distrust the report.

describe("countMissingImportant (P3 — schoolSystem branching)", () => {
  it("international school: GPA is not required, curriculumType fills that slot", () => {
    const draft: QuestionnaireDraft = {
      schoolSystem: "international",
      curriculumType: "IB",
      satScore: 1450,
      toeflScore: 105,
    };
    expect(countMissingImportant(draft)).toBe(0);
  });

  it("international school WITHOUT curriculumType flags it as missing", () => {
    const draft: QuestionnaireDraft = {
      schoolSystem: "international",
      satScore: 1450,
      toeflScore: 105,
      // curriculumType missing
    };
    expect(countMissingImportant(draft)).toBe(1);
  });

  it("public school: requires gpaPercentage OR classRank", () => {
    // Neither present → 1 missing
    const without: QuestionnaireDraft = {
      schoolSystem: "public",
      satScore: 1450,
      toeflScore: 105,
    };
    expect(countMissingImportant(without)).toBe(1);

    // gpaPercentage present → 0
    const withGpa: QuestionnaireDraft = {
      schoolSystem: "public",
      gpaPercentage: 92,
      satScore: 1450,
      toeflScore: 105,
    };
    expect(countMissingImportant(withGpa)).toBe(0);

    // classRank present → 0
    const withRank: QuestionnaireDraft = {
      schoolSystem: "public",
      classRank: "5/200",
      satScore: 1450,
      toeflScore: 105,
    };
    expect(countMissingImportant(withRank)).toBe(0);
  });

  it("private school: same rule as public", () => {
    const withRank: QuestionnaireDraft = {
      schoolSystem: "private",
      classRank: "10/180",
      satScore: 1450,
      toeflScore: 105,
    };
    expect(countMissingImportant(withRank)).toBe(0);

    const without: QuestionnaireDraft = {
      schoolSystem: "private",
      satScore: 1450,
      toeflScore: 105,
    };
    expect(countMissingImportant(without)).toBe(1);
  });

  it("homeschool: no GPA/curriculum slot, only test scores matter", () => {
    const draft: QuestionnaireDraft = {
      schoolSystem: "homeschool",
      satScore: 1450,
      toeflScore: 105,
    };
    expect(countMissingImportant(draft)).toBe(0);

    // Missing test scores → 2 missing (SAT/ACT pair + TOEFL/IELTS pair)
    const noTests: QuestionnaireDraft = {
      schoolSystem: "homeschool",
    };
    expect(countMissingImportant(noTests)).toBe(2);
  });

  it("other: same as homeschool, only test scores matter", () => {
    const draft: QuestionnaireDraft = {
      schoolSystem: "other",
      actScore: 32,
      ieltsScore: 7.5,
    };
    expect(countMissingImportant(draft)).toBe(0);
  });

  it("test-score pairs: one of each pair is enough", () => {
    // ACT fills SAT/ACT pair, IELTS fills TOEFL/IELTS pair
    const draft: QuestionnaireDraft = {
      schoolSystem: "public",
      gpaPercentage: 92,
      actScore: 32,
      ieltsScore: 7.5,
    };
    expect(countMissingImportant(draft)).toBe(0);
  });

  it("treats legitimate 0 values as present, not missing (nullish check, not falsy)", () => {
    // This rule checks slot EMPTINESS (null/undefined), not value VALIDITY.
    // Zod is responsible for rejecting out-of-range inputs upstream; here
    // we only care that the user filled something in. Use values that are
    // actually valid per Zod:
    //   - gpaPercentage: 0 is a legal floor
    //   - satScore: Zod requires 400-1600, so use the lower boundary
    //   - toeflScore: Zod allows 0-120, so 0 is legal
    const draft: QuestionnaireDraft = {
      schoolSystem: "public",
      gpaPercentage: 0,
      satScore: 400,
      toeflScore: 0,
    };
    expect(countMissingImportant(draft)).toBe(0);
  });

  it("missing schoolSystem: falls back to test-score-only check (conservative)", () => {
    // If we don't know the school system, don't flag GPA/curriculum —
    // only flag test scores (which all pathways need).
    const draft: QuestionnaireDraft = {
      satScore: 1450,
      toeflScore: 105,
    };
    expect(countMissingImportant(draft)).toBe(0);
  });
});
