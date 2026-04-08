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

  it("validates activities array", () => {
    const base = {
      childName: "Test",
      birthYear: 2010,
      currentGrade: 9,
      schoolSystem: "public",
      gpaType: "percentage",
    };

    // Valid activity
    expect(
      questionnaireSchema.safeParse({
        ...base,
        activities: [{ name: "Piano", type: "arts" }],
      }).success
    ).toBe(true);

    // Empty array is valid
    expect(
      questionnaireSchema.safeParse({ ...base, activities: [] }).success
    ).toBe(true);

    // Missing required 'name' field
    expect(
      questionnaireSchema.safeParse({
        ...base,
        activities: [{ type: "arts" }],
      }).success
    ).toBe(false);

    // Missing required 'type' field
    expect(
      questionnaireSchema.safeParse({
        ...base,
        activities: [{ name: "Piano" }],
      }).success
    ).toBe(false);
  });

  it("validates animalExperience array", () => {
    const base = {
      childName: "Test",
      birthYear: 2010,
      currentGrade: 9,
      schoolSystem: "public",
      gpaType: "percentage",
    };

    // Valid experience
    expect(
      questionnaireSchema.safeParse({
        ...base,
        animalExperience: [{ type: "volunteer", organization: "Local shelter" }],
      }).success
    ).toBe(true);

    // Empty array is valid
    expect(
      questionnaireSchema.safeParse({ ...base, animalExperience: [] }).success
    ).toBe(true);

    // Missing required 'type' field
    expect(
      questionnaireSchema.safeParse({
        ...base,
        animalExperience: [{ organization: "Shelter" }],
      }).success
    ).toBe(false);
  });

  it("validates budgetRange enum", () => {
    const base = {
      childName: "Test",
      birthYear: 2010,
      currentGrade: 9,
      schoolSystem: "public",
      gpaType: "percentage",
    };

    // All valid enum values
    for (const value of [
      "under-30k",
      "30k-50k",
      "50k-70k",
      "70k-100k",
      "over-100k",
      "flexible",
    ]) {
      expect(
        questionnaireSchema.safeParse({ ...base, budgetRange: value }).success
      ).toBe(true);
    }

    // Invalid enum value
    expect(
      questionnaireSchema.safeParse({ ...base, budgetRange: "free" }).success
    ).toBe(false);
  });
});
