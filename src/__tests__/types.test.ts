import { describe, it, expect } from "vitest";
import { questionnaireSchema, canonicalizeAnswers, stepSchemas } from "@/lib/types";

// Minimal valid base for most tests
const validBase = {
  childName: "Test Student",
  birthYear: 2010,
  currentGrade: 9,
  schoolSystem: "public" as const,
  gpaType: "percentage" as const,
  gpaPercentage: 88,
};

const internationalBase = {
  ...validBase,
  schoolSystem: "international" as const,
  gpaType: "international" as const,
  curriculumType: "IB" as const,
};

describe("questionnaireSchema", () => {
  it("validates a minimal valid questionnaire (public school)", () => {
    const result = questionnaireSchema.safeParse(validBase);
    expect(result.success).toBe(true);
  });

  it("validates a minimal valid questionnaire (international school)", () => {
    const result = questionnaireSchema.safeParse(internationalBase);
    expect(result.success).toBe(true);
  });

  it("rejects missing required fields", () => {
    const result = questionnaireSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("defaults schemaVersion to 1", () => {
    const result = questionnaireSchema.safeParse(validBase);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.schemaVersion).toBe(1);
    }
  });

  // Conditional validation: international school requires curriculumType
  it("requires curriculumType for international schools", () => {
    const result = questionnaireSchema.safeParse({
      ...validBase,
      schoolSystem: "international",
      gpaType: "international",
      // curriculumType missing
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path.join("."));
      expect(paths).toContain("curriculumType");
    }
  });

  it("does NOT require curriculumType for public schools", () => {
    const result = questionnaireSchema.safeParse(validBase);
    expect(result.success).toBe(true);
  });

  // Conditional validation: public/private requires gpaPercentage or classRank
  it("requires gpaPercentage or classRank for public schools", () => {
    const result = questionnaireSchema.safeParse({
      ...validBase,
      gpaPercentage: undefined, // remove it
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path.join("."));
      expect(paths).toContain("gpaPercentage");
    }
  });

  it("accepts classRank alone for public schools", () => {
    const result = questionnaireSchema.safeParse({
      ...validBase,
      gpaPercentage: undefined,
      classRank: "5/200",
    });
    expect(result.success).toBe(true);
  });

  it("accepts gpaPercentage alone for public schools", () => {
    const result = questionnaireSchema.safeParse(validBase);
    expect(result.success).toBe(true);
  });

  it("does NOT require gpa/rank for international schools", () => {
    const result = questionnaireSchema.safeParse(internationalBase);
    expect(result.success).toBe(true);
  });

  it("does NOT require gpa/rank for homeschool", () => {
    const result = questionnaireSchema.safeParse({
      ...validBase,
      schoolSystem: "homeschool",
      gpaPercentage: undefined,
    });
    expect(result.success).toBe(true);
  });

  // biggestConcern limits
  it("enforces biggestConcern max 200 chars", () => {
    const result = questionnaireSchema.safeParse({
      ...validBase,
      biggestConcern: "a".repeat(201),
    });
    expect(result.success).toBe(false);
  });

  it("accepts biggestConcern at exactly 200 chars", () => {
    const result = questionnaireSchema.safeParse({
      ...validBase,
      biggestConcern: "a".repeat(200),
    });
    expect(result.success).toBe(true);
  });

  // SAT score range
  it("validates SAT score range", () => {
    expect(
      questionnaireSchema.safeParse({ ...validBase, satScore: 1600 }).success
    ).toBe(true);
    expect(
      questionnaireSchema.safeParse({ ...validBase, satScore: 400 }).success
    ).toBe(true);
    expect(
      questionnaireSchema.safeParse({ ...validBase, satScore: 1601 }).success
    ).toBe(false);
    expect(
      questionnaireSchema.safeParse({ ...validBase, satScore: 399 }).success
    ).toBe(false);
  });

  // Activities array
  it("validates activities array", () => {
    expect(
      questionnaireSchema.safeParse({
        ...validBase,
        activities: [{ name: "Piano", type: "arts" }],
      }).success
    ).toBe(true);

    // Empty array is valid
    expect(
      questionnaireSchema.safeParse({ ...validBase, activities: [] }).success
    ).toBe(true);

    // Missing required 'name' field
    expect(
      questionnaireSchema.safeParse({
        ...validBase,
        activities: [{ type: "arts" }],
      }).success
    ).toBe(false);

    // Missing required 'type' field
    expect(
      questionnaireSchema.safeParse({
        ...validBase,
        activities: [{ name: "Piano" }],
      }).success
    ).toBe(false);
  });

  // animalExperience array
  it("validates animalExperience array", () => {
    expect(
      questionnaireSchema.safeParse({
        ...validBase,
        animalExperience: [{ type: "volunteer", organization: "Local shelter" }],
      }).success
    ).toBe(true);

    expect(
      questionnaireSchema.safeParse({ ...validBase, animalExperience: [] }).success
    ).toBe(true);

    expect(
      questionnaireSchema.safeParse({
        ...validBase,
        animalExperience: [{ organization: "Shelter" }],
      }).success
    ).toBe(false);
  });

  // budgetRange enum
  it("validates budgetRange enum", () => {
    for (const value of [
      "under-30k",
      "30k-50k",
      "50k-70k",
      "70k-100k",
      "over-100k",
      "flexible",
    ]) {
      expect(
        questionnaireSchema.safeParse({ ...validBase, budgetRange: value }).success
      ).toBe(true);
    }

    expect(
      questionnaireSchema.safeParse({ ...validBase, budgetRange: "free" }).success
    ).toBe(false);
  });

  // gpaType enum includes "international"
  it("accepts international gpaType", () => {
    const result = questionnaireSchema.safeParse({
      ...internationalBase,
      gpaType: "international",
    });
    expect(result.success).toBe(true);
  });

  // Full valid submission with all fields
  it("validates a complete submission with all fields", () => {
    const result = questionnaireSchema.safeParse({
      childName: "张小明",
      birthYear: 2008,
      currentGrade: 11,
      gender: "male",
      schoolSystem: "international",
      schoolName: "北京某国际学校",
      schoolCity: "北京",
      gpaType: "international",
      curriculumType: "IB",
      ibDiploma: true,
      apCourses: ["Biology", "Chemistry"],
      scienceGPA: 92,
      satScore: 1420,
      toeflScore: 105,
      activities: [
        { name: "生物奥赛", type: "academic", hoursPerWeek: 5, durationMonths: 12 },
      ],
      animalExperience: [
        { type: "volunteer", organization: "Local shelter", hours: 100 },
      ],
      budgetRange: "50k-70k",
      needFinancialAid: true,
      targetMajor: "pre-vet",
      preferredRegion: "Northeast",
      biggestConcern: "担心 GPA 不够高",
    });
    expect(result.success).toBe(true);
  });
});

describe("canonicalizeAnswers", () => {
  it("removes public/private fields when schoolSystem is international", () => {
    const result = canonicalizeAnswers({
      schoolSystem: "international",
      gpaPercentage: 88,
      classRank: "5/200",
      curriculumType: "IB",
    });
    expect(result.gpaPercentage).toBeUndefined();
    expect(result.classRank).toBeUndefined();
    expect(result.curriculumType).toBe("IB");
  });

  it("removes international fields when schoolSystem is public", () => {
    const result = canonicalizeAnswers({
      schoolSystem: "public",
      curriculumType: "IB",
      ibDiploma: true,
      apCourses: ["Bio"],
      gpaPercentage: 88,
    });
    expect(result.curriculumType).toBeUndefined();
    expect(result.ibDiploma).toBeUndefined();
    expect(result.apCourses).toBeUndefined();
    expect(result.gpaPercentage).toBe(88);
  });

  it("removes international fields when schoolSystem is private", () => {
    const result = canonicalizeAnswers({
      schoolSystem: "private",
      curriculumType: "AP",
      gpaPercentage: 90,
    });
    expect(result.curriculumType).toBeUndefined();
    expect(result.gpaPercentage).toBe(90);
  });

  it("keeps all fields for homeschool", () => {
    const input = {
      schoolSystem: "homeschool",
      gpaPercentage: 88,
      curriculumType: "AP",
      ibDiploma: false,
    };
    const result = canonicalizeAnswers(input);
    expect(result.gpaPercentage).toBe(88);
    expect(result.curriculumType).toBe("AP");
    expect(result.ibDiploma).toBe(false);
  });

  it("keeps all fields for other", () => {
    const input = {
      schoolSystem: "other",
      gpaPercentage: 88,
      classRank: "3/100",
      curriculumType: "A-Level",
    };
    const result = canonicalizeAnswers(input);
    expect(result.gpaPercentage).toBe(88);
    expect(result.classRank).toBe("3/100");
    expect(result.curriculumType).toBe("A-Level");
  });
});

describe("stepSchemas", () => {
  it("step 1 requires childName, birthYear, currentGrade", () => {
    const schema = stepSchemas[1];
    expect(schema.safeParse({}).success).toBe(false);
    expect(
      schema.safeParse({
        childName: "Test",
        birthYear: 2010,
        currentGrade: 9,
      }).success
    ).toBe(true);
  });

  it("step 2 requires schoolSystem", () => {
    const schema = stepSchemas[2];
    expect(schema.safeParse({}).success).toBe(false);
    expect(
      schema.safeParse({ schoolSystem: "public" }).success
    ).toBe(true);
  });

  it("step 4 validates score ranges", () => {
    const schema = stepSchemas[4];
    // Empty is fine (all optional)
    expect(schema.safeParse({}).success).toBe(true);
    // Valid SAT
    expect(schema.safeParse({ satScore: 1400 }).success).toBe(true);
    // Invalid SAT
    expect(schema.safeParse({ satScore: 0 }).success).toBe(false);
  });

  it("step 7 accepts empty (all optional)", () => {
    const schema = stepSchemas[7];
    expect(schema.safeParse({}).success).toBe(true);
  });

  it("step 8 rejects biggestConcern over 200 chars", () => {
    const schema = stepSchemas[8];
    expect(
      schema.safeParse({ biggestConcern: "a".repeat(201) }).success
    ).toBe(false);
    expect(
      schema.safeParse({ biggestConcern: "a".repeat(200) }).success
    ).toBe(true);
  });
});
