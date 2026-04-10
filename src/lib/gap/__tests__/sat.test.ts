import { describe, it, expect } from "vitest";
import type { School } from "@prisma/client";
import type { QuestionnaireAnswers } from "@/lib/types";
import { satDimension } from "../dimensions/sat";

function makeAnswers(overrides: Partial<QuestionnaireAnswers> = {}): QuestionnaireAnswers {
  return {
    schemaVersion: 1,
    childName: "Test Child",
    birthYear: 2008,
    currentGrade: 10,
    schoolSystem: "public",
    gpaType: "percentage",
    gpaPercentage: 90,
    satScore: 1450,
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

describe("satDimension — metadata", () => {
  it("has id 'sat'", () => {
    expect(satDimension.id).toBe("sat");
  });
  it("is not prevet-only", () => {
    expect(satDimension.prevetOnly).toBe(false);
  });
  it("appliesTo returns true for any student", () => {
    expect(satDimension.appliesTo(makeAnswers())).toBe(true);
  });
});

describe("satDimension.compute — severity", () => {
  it("SAT above sat75th → green", () => {
    const result = satDimension.compute(
      makeAnswers({ satScore: 1550 }),
      makeSchool({ sat25th: 1400, sat75th: 1500 }),
    );
    expect(result.severity).toBe("green");
    expect(result.current).toBe(1550);
    expect(result.target).toEqual({ min: 1400, max: 1500 });
  });

  it("SAT exactly sat75th → green (inclusive)", () => {
    const result = satDimension.compute(
      makeAnswers({ satScore: 1500 }),
      makeSchool({ sat25th: 1400, sat75th: 1500 }),
    );
    expect(result.severity).toBe("green");
  });

  it("SAT within [sat25th, sat75th) → yellow", () => {
    const result = satDimension.compute(
      makeAnswers({ satScore: 1450 }),
      makeSchool({ sat25th: 1400, sat75th: 1500 }),
    );
    expect(result.severity).toBe("yellow");
  });

  it("SAT exactly sat25th → yellow (inclusive bottom)", () => {
    const result = satDimension.compute(
      makeAnswers({ satScore: 1400 }),
      makeSchool({ sat25th: 1400, sat75th: 1500 }),
    );
    expect(result.severity).toBe("yellow");
  });

  it("SAT below sat25th → red", () => {
    const result = satDimension.compute(
      makeAnswers({ satScore: 1300 }),
      makeSchool({ sat25th: 1400, sat75th: 1500 }),
    );
    expect(result.severity).toBe("red");
  });
});

describe("satDimension.compute — no-data", () => {
  it("student has no SAT score → no-data", () => {
    const result = satDimension.compute(
      makeAnswers({ satScore: undefined }),
      makeSchool(),
    );
    expect(result.severity).toBe("no-data");
    expect(result.current).toBe(null);
    expect(result.target).toBe(null);
    expect(result.action).toBeTruthy();
  });

  it("school missing sat25th → no-data", () => {
    const result = satDimension.compute(
      makeAnswers({ satScore: 1450 }),
      makeSchool({ sat25th: null, sat75th: 1500 }),
    );
    expect(result.severity).toBe("no-data");
  });

  it("school missing sat75th → no-data", () => {
    const result = satDimension.compute(
      makeAnswers({ satScore: 1450 }),
      makeSchool({ sat25th: 1400, sat75th: null }),
    );
    expect(result.severity).toBe("no-data");
  });
});

describe("satDimension.compute — invariants", () => {
  it("result.dimension always 'sat'", () => {
    const result = satDimension.compute(makeAnswers(), makeSchool());
    expect(result.dimension).toBe("sat");
  });

  it("result.normalized is always null (SAT doesn't normalize)", () => {
    const result = satDimension.compute(makeAnswers(), makeSchool());
    expect(result.normalized).toBe(null);
  });

  it("red path with gap info renders gap in action", () => {
    const result = satDimension.compute(
      makeAnswers({ satScore: 1200 }),
      makeSchool({ sat25th: 1400, sat75th: 1500 }),
    );
    expect(result.severity).toBe("red");
    expect(result.action).toMatch(/200/); // 1400 - 1200 = 200
  });
});
