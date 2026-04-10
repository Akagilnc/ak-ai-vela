import { describe, it, expect } from "vitest";
import type { School } from "@prisma/client";
import type { QuestionnaireAnswers } from "@/lib/types";
import { actDimension } from "../dimensions/act";

function makeAnswers(overrides: Partial<QuestionnaireAnswers> = {}): QuestionnaireAnswers {
  return {
    schemaVersion: 1,
    childName: "Test Child",
    birthYear: 2008,
    currentGrade: 10,
    schoolSystem: "public",
    gpaType: "percentage",
    gpaPercentage: 90,
    actScore: 32,
    ...overrides,
  } as QuestionnaireAnswers;
}

function makeSchool(overrides: Partial<School> = {}): School {
  return {
    id: "school-1",
    slug: "test-u",
    name: "Test University",
    nameCn: "测试大学",
    city: "Test City",
    state: "CA",
    country: "USA",
    type: "public",
    avgGPA: 3.8,
    sat25th: 1400,
    sat75th: 1500,
    act25th: 31,
    act75th: 34,
    medianSAT: null,
    medianACT: null,
    acceptanceRate: null,
    internationalAcceptRate: null,
    estimatedAnnualCost: null,
    englishRequirements: null,
    hasAnimalScience: true,
    hasPreVet: true,
    needBlind: false,
    radarAcceptance: null,
    radarInternational: null,
    radarSAT: null,
    radarCost: null,
    radarAid: null,
    ...overrides,
  } as unknown as School;
}

describe("actDimension — metadata", () => {
  it("has id 'act'", () => {
    expect(actDimension.id).toBe("act");
  });
  it("is not prevet-only", () => {
    expect(actDimension.prevetOnly).toBe(false);
  });
  it("appliesTo returns true for any student", () => {
    expect(actDimension.appliesTo(makeAnswers())).toBe(true);
  });
});

describe("actDimension.compute — severity", () => {
  it("ACT above act75th → green", () => {
    const result = actDimension.compute(
      makeAnswers({ actScore: 35 }),
      makeSchool({ act25th: 31, act75th: 34 }),
    );
    expect(result.severity).toBe("green");
    expect(result.current).toBe(35);
    expect(result.target).toEqual({ min: 31, max: 34 });
  });

  it("ACT exactly act75th → green (inclusive)", () => {
    const result = actDimension.compute(
      makeAnswers({ actScore: 34 }),
      makeSchool({ act25th: 31, act75th: 34 }),
    );
    expect(result.severity).toBe("green");
  });

  it("ACT within [act25th, act75th) → yellow", () => {
    const result = actDimension.compute(
      makeAnswers({ actScore: 32 }),
      makeSchool({ act25th: 31, act75th: 34 }),
    );
    expect(result.severity).toBe("yellow");
  });

  it("ACT exactly act25th → yellow (inclusive bottom)", () => {
    const result = actDimension.compute(
      makeAnswers({ actScore: 31 }),
      makeSchool({ act25th: 31, act75th: 34 }),
    );
    expect(result.severity).toBe("yellow");
  });

  it("ACT below act25th → red", () => {
    const result = actDimension.compute(
      makeAnswers({ actScore: 28 }),
      makeSchool({ act25th: 31, act75th: 34 }),
    );
    expect(result.severity).toBe("red");
  });
});

describe("actDimension.compute — no-data", () => {
  it("student has no ACT score → no-data", () => {
    const result = actDimension.compute(
      makeAnswers({ actScore: undefined }),
      makeSchool(),
    );
    expect(result.severity).toBe("no-data");
    expect(result.current).toBe(null);
    expect(result.target).toBe(null);
    expect(result.action).toBeTruthy();
  });

  it("school missing act25th → no-data", () => {
    const result = actDimension.compute(
      makeAnswers({ actScore: 32 }),
      makeSchool({ act25th: null }),
    );
    expect(result.severity).toBe("no-data");
  });

  it("school missing act75th → no-data", () => {
    const result = actDimension.compute(
      makeAnswers({ actScore: 32 }),
      makeSchool({ act75th: null }),
    );
    expect(result.severity).toBe("no-data");
  });
});

describe("actDimension.compute — invariants", () => {
  it("result.dimension always 'act'", () => {
    const result = actDimension.compute(makeAnswers(), makeSchool());
    expect(result.dimension).toBe("act");
  });

  it("result.normalized is always null", () => {
    const result = actDimension.compute(makeAnswers(), makeSchool());
    expect(result.normalized).toBe(null);
  });

  it("red path with gap info renders gap in action", () => {
    const result = actDimension.compute(
      makeAnswers({ actScore: 25 }),
      makeSchool({ act25th: 31, act75th: 34 }),
    );
    expect(result.severity).toBe("red");
    expect(result.action).toMatch(/6/); // 31 - 25 = 6
  });
});
