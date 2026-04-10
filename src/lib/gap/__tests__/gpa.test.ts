import { describe, it, expect } from "vitest";
import type { School } from "@prisma/client";
import type { QuestionnaireAnswers } from "@/lib/types";
import { gpaDimension } from "../dimensions/gpa";

// ---------------- Fixtures ----------------

function makeAnswers(overrides: Partial<QuestionnaireAnswers> = {}): QuestionnaireAnswers {
  return {
    schemaVersion: 1,
    childName: "Test Child",
    birthYear: 2008,
    currentGrade: 10,
    schoolSystem: "public",
    gpaType: "percentage",
    gpaPercentage: 90,
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

// ---------------- Dimension metadata ----------------

describe("gpaDimension — metadata", () => {
  it("has id 'gpa'", () => {
    expect(gpaDimension.id).toBe("gpa");
  });

  it("has a Chinese label", () => {
    expect(gpaDimension.label).toBeTruthy();
    expect(typeof gpaDimension.label).toBe("string");
  });

  it("is not prevet-only", () => {
    expect(gpaDimension.prevetOnly).toBe(false);
  });

  it("appliesTo returns true for any student (not pre-vet-gated)", () => {
    expect(gpaDimension.appliesTo(makeAnswers())).toBe(true);
    expect(
      gpaDimension.appliesTo(
        makeAnswers({ targetMajor: "biology" }),
      ),
    ).toBe(true);
  });
});

// ---------------- Severity: percentage path ----------------

describe("gpaDimension.compute — percentage path severity", () => {
  it("normalized > avgGPA → green", () => {
    // 95 → 3.95, school 3.8
    const result = gpaDimension.compute(
      makeAnswers({ gpaPercentage: 95 }),
      makeSchool({ avgGPA: 3.8 }),
    );
    expect(result.severity).toBe("green");
    expect(result.normalized).toBe(3.95);
    expect(result.current).toBe(95);
    expect(result.target).toEqual({ min: 3.8, max: 3.8 });
    expect(result.action).toBeTruthy();
  });

  it("normalized === avgGPA → green (exact boundary)", () => {
    // 90 → 3.8, school 3.8
    const result = gpaDimension.compute(
      makeAnswers({ gpaPercentage: 90 }),
      makeSchool({ avgGPA: 3.8 }),
    );
    expect(result.severity).toBe("green");
  });

  it("normalized within 0.3 below avgGPA → yellow", () => {
    // 85 → 3.6, school 3.8, gap = 0.2 < 0.3
    const result = gpaDimension.compute(
      makeAnswers({ gpaPercentage: 85 }),
      makeSchool({ avgGPA: 3.8 }),
    );
    expect(result.severity).toBe("yellow");
  });

  it("normalized exactly 0.3 below → yellow (inclusive bottom)", () => {
    // 84 → 3.25, school 3.55, gap = 0.3 exactly → still yellow
    const result = gpaDimension.compute(
      makeAnswers({ gpaPercentage: 84 }),
      makeSchool({ avgGPA: 3.55 }),
    );
    expect(result.severity).toBe("yellow");
  });

  it("normalized more than 0.3 below → red", () => {
    // 79 → 2.5, school 3.8, gap = 1.3
    const result = gpaDimension.compute(
      makeAnswers({ gpaPercentage: 79 }),
      makeSchool({ avgGPA: 3.8 }),
    );
    expect(result.severity).toBe("red");
  });
});

// ---------------- Severity: rank path ----------------

describe("gpaDimension.compute — rank path severity", () => {
  it("gpaType rank with top percentile → uses classRank", () => {
    // rank 5/200 → 2.5% → top 2.5% → percentile 0.975 → 3.95
    const result = gpaDimension.compute(
      makeAnswers({
        gpaType: "rank",
        gpaPercentage: undefined,
        classRank: "5/200",
      }),
      makeSchool({ avgGPA: 3.8 }),
    );
    expect(result.severity).toBe("green");
    expect(result.normalized).toBe(3.95);
  });

  it("gpaType rank with mid percentile → yellow/red", () => {
    // rank 50/200 → top 25% → 3.6, school 3.8 → yellow (0.2 gap)
    const result = gpaDimension.compute(
      makeAnswers({
        gpaType: "rank",
        gpaPercentage: undefined,
        classRank: "50/200",
      }),
      makeSchool({ avgGPA: 3.8 }),
    );
    expect(result.severity).toBe("yellow");
    expect(result.normalized).toBe(3.6);
  });
});

// ---------------- Severity: no-data cases ----------------

describe("gpaDimension.compute — no-data cases", () => {
  it("gpaType international → no-data with phase 2 prompt", () => {
    const result = gpaDimension.compute(
      makeAnswers({
        gpaType: "international",
        gpaPercentage: undefined,
      }),
      makeSchool(),
    );
    expect(result.severity).toBe("no-data");
    expect(result.current).toBe(null);
    expect(result.normalized).toBe(null);
    expect(result.target).toBe(null);
    expect(result.action).toContain("国际课程");
  });

  it("gpaType unknown → no-data with generic prompt", () => {
    const result = gpaDimension.compute(
      makeAnswers({
        gpaType: "unknown",
        gpaPercentage: undefined,
      }),
      makeSchool(),
    );
    expect(result.severity).toBe("no-data");
    expect(result.action).toContain("百分制");
  });

  it("gpaType percentage but gpaPercentage null → no-data", () => {
    const result = gpaDimension.compute(
      makeAnswers({
        gpaType: "percentage",
        gpaPercentage: undefined,
      }),
      makeSchool(),
    );
    expect(result.severity).toBe("no-data");
  });

  it("gpaType rank but classRank null → no-data", () => {
    const result = gpaDimension.compute(
      makeAnswers({
        gpaType: "rank",
        gpaPercentage: undefined,
        classRank: undefined,
      }),
      makeSchool(),
    );
    expect(result.severity).toBe("no-data");
  });

  it("school avgGPA null → no-data", () => {
    const result = gpaDimension.compute(
      makeAnswers({ gpaPercentage: 90 }),
      makeSchool({ avgGPA: null }),
    );
    expect(result.severity).toBe("no-data");
    expect(result.target).toBe(null);
  });
});

// ---------------- gpaType contract (regression fence for PR #7 review) ----------------
//
// Codex P1 + Copilot independently flagged that `compute()` was passing both
// gpaPercentage and classRank into normalizeChineseGpa(), which then preferred
// percentage whenever it was present. That let stale form fields (e.g. a
// percentage lingering after the user switched gpaType to "rank") silently
// override the user's declared intent — severity could flip from red to green
// based on a value the user no longer considered authoritative.
//
// These tests lock the fix: `compute()` must honor `answers.gpaType` as the
// single source of truth for which field to read, independent of whether
// other fields happen to be populated.

describe("gpaDimension.compute — gpaType contract", () => {
  it("gpaType='rank' with stale gpaPercentage → uses rank, ignores percentage", () => {
    const result = gpaDimension.compute(
      makeAnswers({
        gpaType: "rank",
        gpaPercentage: 85, // stale: should be ignored
        classRank: "5/200", // top 2.5% → 3.95
      }),
      makeSchool({ avgGPA: 3.8 }),
    );
    // Rank path → 3.95 → green. Pre-fix: percentage path → 3.6 → yellow.
    expect(result.normalized).toBe(3.95);
    expect(result.severity).toBe("green");
  });

  it("gpaType='percentage' with stale classRank → uses percentage, ignores rank", () => {
    const result = gpaDimension.compute(
      makeAnswers({
        gpaType: "percentage",
        gpaPercentage: 85, // → 3.6
        classRank: "5/200", // stale: should be ignored
      }),
      makeSchool({ avgGPA: 3.8 }),
    );
    expect(result.normalized).toBe(3.6);
    expect(result.severity).toBe("yellow");
  });

  it("gpaType='international' with stale percentage+rank → no-data, ignores both", () => {
    const result = gpaDimension.compute(
      makeAnswers({
        gpaType: "international",
        gpaPercentage: 95, // stale
        classRank: "5/200", // stale
      }),
      makeSchool({ avgGPA: 3.8 }),
    );
    expect(result.severity).toBe("no-data");
    expect(result.normalized).toBe(null);
    expect(result.action).toContain("国际课程");
  });

  it("gpaType='rank' with stale percentage but no rank → no-data (rank is the declared source)", () => {
    const result = gpaDimension.compute(
      makeAnswers({
        gpaType: "rank",
        gpaPercentage: 95, // stale: cannot substitute for declared source
        classRank: undefined,
      }),
      makeSchool({ avgGPA: 3.8 }),
    );
    expect(result.severity).toBe("no-data");
    expect(result.normalized).toBe(null);
  });
});

// ---------------- GapResult invariants ----------------

describe("gpaDimension.compute — invariants", () => {
  it("result.dimension always equals 'gpa'", () => {
    const result = gpaDimension.compute(makeAnswers(), makeSchool());
    expect(result.dimension).toBe("gpa");
  });

  it("result.label matches dimension.label", () => {
    const result = gpaDimension.compute(makeAnswers(), makeSchool());
    expect(result.label).toBe(gpaDimension.label);
  });

  it("non-null action on green path", () => {
    const result = gpaDimension.compute(
      makeAnswers({ gpaPercentage: 95 }),
      makeSchool({ avgGPA: 3.8 }),
    );
    expect(result.action).toBeTruthy();
  });
});
