import { describe, it, expect } from "vitest";
import type { QuestionnaireAnswers } from "@/lib/types";
import { satDimension } from "../dimensions/sat";
import { makeSchool } from "./helpers/make-school";

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

describe("satDimension.compute — excellent", () => {
  // Excellent threshold: satScore >= sat75th + (sat75th - sat25th) * 0.5
  // With defaults (sat25th=1400, sat75th=1500): threshold = 1500 + 50 = 1550
  it("SAT far above 75th → excellent", () => {
    const result = satDimension.compute(
      makeAnswers({ satScore: 1560 }),
      makeSchool({ sat25th: 1400, sat75th: 1500 }),
    );
    expect(result.severity).toBe("excellent");
    expect(result.action).toContain("75 分位");
  });

  it("SAT exactly at excellent threshold → excellent (inclusive)", () => {
    const result = satDimension.compute(
      makeAnswers({ satScore: 1550 }),
      makeSchool({ sat25th: 1400, sat75th: 1500 }),
    );
    expect(result.severity).toBe("excellent");
  });

  it("SAT just below excellent threshold → green (not excellent)", () => {
    const result = satDimension.compute(
      makeAnswers({ satScore: 1549 }),
      makeSchool({ sat25th: 1400, sat75th: 1500 }),
    );
    expect(result.severity).toBe("green");
  });
});

describe("satDimension.compute — test-free school", () => {
  it("test-free school → no-data with 不要求 copy", () => {
    const result = satDimension.compute(
      makeAnswers({ satScore: 1450 }),
      makeSchool({ testPolicy: "free", sat25th: null, sat75th: null }),
    );
    expect(result.severity).toBe("no-data");
    expect(result.action).toContain("非必须");
    expect(result.action).not.toContain("补上");
    expect(result.action).not.toContain("数据库");
  });

  it("test-free school with populated scores → still no-data (scores irrelevant)", () => {
    const result = satDimension.compute(
      makeAnswers({ satScore: 1450 }),
      makeSchool({ testPolicy: "free", sat25th: 1200, sat75th: 1400 }),
    );
    expect(result.severity).toBe("no-data");
    expect(result.action).toContain("非必须");
  });

  it("test-free school + student has no score → no-data test-free (not student-missing)", () => {
    const result = satDimension.compute(
      makeAnswers({ satScore: undefined }),
      makeSchool({ testPolicy: "free" }),
    );
    expect(result.severity).toBe("no-data");
    expect(result.action).toContain("非必须");
  });
});

describe("satDimension.compute — severity", () => {
  it("SAT above sat75th but below excellent → green", () => {
    const result = satDimension.compute(
      makeAnswers({ satScore: 1520 }),
      makeSchool({ sat25th: 1400, sat75th: 1500 }),
    );
    expect(result.severity).toBe("green");
    expect(result.current).toBe(1520);
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
  it("student has no SAT score → no-data (student-missing text)", () => {
    const result = satDimension.compute(
      makeAnswers({ satScore: undefined }),
      makeSchool(),
    );
    expect(result.severity).toBe("no-data");
    expect(result.current).toBe(null);
    expect(result.target).toBe(null);
    // Student-facing copy — must NOT blame the database. M3.5 #9 regression.
    expect(result.action).toContain("补上");
    expect(result.action).not.toContain("数据库");
  });

  // M3.5 #9: school-side DB gap (missing percentile bands) must not ask the
  // student to fill SAT again — they may have filled it, or this may be a
  // school without published bands. Flag the DB gap instead.
  it("school missing sat25th → no-data (school-missing-data text, names the school)", () => {
    const result = satDimension.compute(
      makeAnswers({ satScore: 1450 }),
      makeSchool({ name: "Cornell University", sat25th: null, sat75th: 1500 }),
    );
    expect(result.severity).toBe("no-data");
    expect(result.action).toContain("暂无");
    expect(result.action).toContain("Cornell University");
    expect(result.action).not.toContain("补上");
  });

  it("school missing sat75th → no-data (school-missing-data text, names the school)", () => {
    const result = satDimension.compute(
      makeAnswers({ satScore: 1450 }),
      makeSchool({ name: "Cornell University", sat25th: 1400, sat75th: null }),
    );
    expect(result.severity).toBe("no-data");
    expect(result.action).toContain("暂无");
    expect(result.action).toContain("Cornell University");
    expect(result.action).not.toContain("补上");
  });

  // Edge case: both student and school missing. Student-missing wins because
  // the user-facing fix is actionable (fill the form) while we can't tell
  // them to wait on DB data when they don't even have a score yet.
  it("both student and school missing → no-data (student-missing wins)", () => {
    const result = satDimension.compute(
      makeAnswers({ satScore: undefined }),
      makeSchool({ sat25th: null, sat75th: null }),
    );
    expect(result.severity).toBe("no-data");
    expect(result.action).toContain("补上");
    expect(result.action).not.toContain("数据库");
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
