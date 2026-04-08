import { describe, it, expect } from "vitest";
import { questionnaireSchema } from "@/lib/types";

describe("questionnaireSchema", () => {
  it("validates a minimal valid questionnaire", () => {
    const result = questionnaireSchema.safeParse({
      childName: "Test Student",
      birthYear: 2010,
      currentGrade: 9,
      schoolSystem: "public",
      gpaType: "percentage",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing required fields", () => {
    const result = questionnaireSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("enforces biggestConcern max 200 chars", () => {
    const result = questionnaireSchema.safeParse({
      childName: "Test",
      birthYear: 2010,
      currentGrade: 9,
      schoolSystem: "public",
      gpaType: "percentage",
      biggestConcern: "a".repeat(201),
    });
    expect(result.success).toBe(false);
  });

  it("accepts biggestConcern at exactly 200 chars", () => {
    const result = questionnaireSchema.safeParse({
      childName: "Test",
      birthYear: 2010,
      currentGrade: 9,
      schoolSystem: "public",
      gpaType: "percentage",
      biggestConcern: "a".repeat(200),
    });
    expect(result.success).toBe(true);
  });

  it("validates SAT score range", () => {
    const base = {
      childName: "Test",
      birthYear: 2010,
      currentGrade: 9,
      schoolSystem: "public",
      gpaType: "percentage",
    };

    expect(
      questionnaireSchema.safeParse({ ...base, satScore: 1600 }).success
    ).toBe(true);
    expect(
      questionnaireSchema.safeParse({ ...base, satScore: 400 }).success
    ).toBe(true);
    expect(
      questionnaireSchema.safeParse({ ...base, satScore: 1601 }).success
    ).toBe(false);
    expect(
      questionnaireSchema.safeParse({ ...base, satScore: 399 }).success
    ).toBe(false);
  });
});
