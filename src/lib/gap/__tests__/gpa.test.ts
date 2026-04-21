import { describe, it, expect } from "vitest";
import type { QuestionnaireAnswers } from "@/lib/types";
import { gpaDimension } from "../dimensions/gpa";
import { makeSchool } from "./helpers/make-school";

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

describe("gpaDimension.compute — excellent", () => {
  // Excellent threshold: normalized >= school.avgGPA + 0.3
  it("normalized well above avgGPA → excellent", () => {
    // 95 → 3.95, school 3.5 → gap = +0.45 > 0.3 → excellent
    const result = gpaDimension.compute(
      makeAnswers({ gpaPercentage: 95 }),
      makeSchool({ avgGPA: 3.5 }),
    );
    expect(result.severity).toBe("excellent");
    expect(result.action).toContain("远超");
  });

  it("normalized exactly 0.3 above → excellent (inclusive)", () => {
    // 90 → 3.8, school 3.5 → gap = +0.3 exactly → excellent
    const result = gpaDimension.compute(
      makeAnswers({ gpaPercentage: 90 }),
      makeSchool({ avgGPA: 3.5 }),
    );
    expect(result.severity).toBe("excellent");
  });

  it("normalized just under 0.3 above → green (not excellent)", () => {
    // 90 → 3.8, school 3.55 → gap = +0.25 < 0.3 → green
    const result = gpaDimension.compute(
      makeAnswers({ gpaPercentage: 90 }),
      makeSchool({ avgGPA: 3.55 }),
    );
    expect(result.severity).toBe("green");
  });

  // Regression: avgGPA at or above normalize ceiling means excellent is
  // unreachable. A 95% student (3.95) at a 4.0 avgGPA school is BELOW
  // the school's target — must NOT be excellent. Codex local review P1.
  it("avgGPA >= ceiling → excellent not possible, student below target → yellow/red", () => {
    // 95 → 3.95, school 4.0 → 3.95 < 4.0 → yellow (gap = 0.05 < 0.3)
    const result = gpaDimension.compute(
      makeAnswers({ gpaPercentage: 95 }),
      makeSchool({ avgGPA: 4.0 }),
    );
    expect(result.severity).not.toBe("excellent");
    expect(result.severity).toBe("yellow");
  });

  it("avgGPA === ceiling → excellent not possible, student at target → green", () => {
    // 95 → 3.95, school 3.95 → threshold min(4.25, 3.95) = 3.95, but 3.95 > 3.95 is false
    const result = gpaDimension.compute(
      makeAnswers({ gpaPercentage: 95 }),
      makeSchool({ avgGPA: 3.95 }),
    );
    expect(result.severity).not.toBe("excellent");
    expect(result.severity).toBe("green");
  });
});

describe("gpaDimension.compute — percentage path severity", () => {
  it("normalized at ceiling with high avgGPA → excellent (threshold capped at 3.95)", () => {
    // 95 → 3.95, school 3.8 → excellent threshold = min(3.8+0.3, 3.95) = 3.95
    // 3.95 >= 3.95 → excellent
    const result = gpaDimension.compute(
      makeAnswers({ gpaPercentage: 95 }),
      makeSchool({ avgGPA: 3.8 }),
    );
    expect(result.severity).toBe("excellent");
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
    // 79 → 2.8 (70-79 bucket, PR #7 Round 3 sub-80 extension), school 3.8,
    // gap = 1.0 > 0.3 → red. Flagged by Copilot Round 3 — the old `79 → 2.5`
    // comment was stale from before the Gemini sub-80 bucket extension.
    const result = gpaDimension.compute(
      makeAnswers({ gpaPercentage: 79 }),
      makeSchool({ avgGPA: 3.8 }),
    );
    expect(result.severity).toBe("red");
  });
});

// ---------------- Severity: rank path ----------------

describe("gpaDimension.compute — rank path severity", () => {
  it("gpaType rank with top percentile → uses classRank → excellent (ceiling cap)", () => {
    // rank 5/200 → 3.95 (ceiling), school 3.8 → threshold min(4.1, 3.95) = 3.95 → excellent
    const result = gpaDimension.compute(
      makeAnswers({
        gpaType: "rank",
        gpaPercentage: undefined,
        classRank: "5/200",
      }),
      makeSchool({ avgGPA: 3.8 }),
    );
    expect(result.severity).toBe("excellent");
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
  it("gpaType international → no-data: references 百分制 switch path, not nonexistent 备注 field", () => {
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
    // Regression fence: questionnaire has no notes/备注 field.
    // Recovery copy must point to the real exit ramp (switch gpaType to 百分制).
    expect(result.action).not.toContain("备注");
    expect(result.action).toContain("百分制");
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

  it("gpaType percentage but gpaPercentage null → no-data (student-missing text)", () => {
    const result = gpaDimension.compute(
      makeAnswers({
        gpaType: "percentage",
        gpaPercentage: undefined,
      }),
      makeSchool(),
    );
    expect(result.severity).toBe("no-data");
    // Student-facing copy asks the user to fill in the form field. Must NOT
    // blame the database. M3.5 #9 regression fence.
    expect(result.action).toContain("补上");
    expect(result.action).not.toContain("数据库");
  });

  it("gpaType rank but classRank null → no-data: references 年级排名, not 百分制", () => {
    const result = gpaDimension.compute(
      makeAnswers({
        gpaType: "rank",
        gpaPercentage: undefined,
        classRank: undefined,
      }),
      makeSchool(),
    );
    expect(result.severity).toBe("no-data");
    expect(result.action).toContain("补上");
    expect(result.action).not.toContain("数据库");
    // Regression fence: rank students must be directed to fill 年级排名,
    // not 百分制 — those are different form fields on Step 3.
    expect(result.action).toContain("年级排名");
    expect(result.action).not.toContain("百分制");
  });

  // M3.5 #9: school-side missing data must NOT ask the student to fill
  // anything — they already did. Flag it as a data-quality issue on our
  // side instead. Closes https://github.com/Akagilnc/ak-ai-vela/issues/9
  it("school avgGPA null → no-data (school-missing-data text, names the school)", () => {
    const result = gpaDimension.compute(
      makeAnswers({ gpaPercentage: 90 }),
      makeSchool({ name: "Cornell University", avgGPA: null }),
    );
    expect(result.severity).toBe("no-data");
    expect(result.target).toBe(null);
    // School-facing copy: flags data gap, does NOT ask student to re-fill.
    expect(result.action).toContain("暂无");
    expect(result.action).toContain("Cornell University");
    expect(result.action).not.toContain("补上");
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
    // Rank path → 3.95 → excellent (ceiling cap). Pre-fix: percentage path → 3.6 → yellow.
    expect(result.normalized).toBe(3.95);
    expect(result.severity).toBe("excellent");
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
