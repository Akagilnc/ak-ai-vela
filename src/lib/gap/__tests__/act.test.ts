import { describe, it, expect } from "vitest";
import type { QuestionnaireAnswers } from "@/lib/types";
import { actDimension } from "../dimensions/act";
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
    actScore: 32,
    ...overrides,
  } as QuestionnaireAnswers;
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

describe("actDimension.compute — excellent", () => {
  // Excellent threshold: actScore >= act75th + (act75th - act25th) * 0.5
  // With defaults (act25th=31, act75th=34): threshold = 34 + 1.5 = 35.5 → 36
  it("ACT far above 75th → excellent", () => {
    const result = actDimension.compute(
      makeAnswers({ actScore: 36 }),
      makeSchool({ act25th: 31, act75th: 34 }),
    );
    expect(result.severity).toBe("excellent");
    expect(result.action).toContain("75 分位");
  });

  it("ACT just below excellent threshold → green", () => {
    const result = actDimension.compute(
      makeAnswers({ actScore: 35 }),
      makeSchool({ act25th: 31, act75th: 34 }),
    );
    expect(result.severity).toBe("green");
  });
});

describe("actDimension.compute — test-free school", () => {
  it("test-free school → no-data with 非必须 copy", () => {
    const result = actDimension.compute(
      makeAnswers({ actScore: 32 }),
      makeSchool({ testPolicy: "free", act25th: null, act75th: null }),
    );
    expect(result.severity).toBe("no-data");
    expect(result.action).toContain("非必须");
    expect(result.action).not.toContain("补上");
  });

  it("test-free school with populated scores → still no-data", () => {
    const result = actDimension.compute(
      makeAnswers({ actScore: 32 }),
      makeSchool({ testPolicy: "free", act25th: 28, act75th: 33 }),
    );
    expect(result.severity).toBe("no-data");
    expect(result.action).toContain("非必须");
  });
});

describe("actDimension.compute — severity", () => {
  it("ACT above act75th but below excellent → green", () => {
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
  it("student has no ACT score → no-data (student-missing text)", () => {
    const result = actDimension.compute(
      makeAnswers({ actScore: undefined }),
      makeSchool(),
    );
    expect(result.severity).toBe("no-data");
    expect(result.current).toBe(null);
    expect(result.target).toBe(null);
    expect(result.action).toContain("补上");
    expect(result.action).not.toContain("数据库");
  });

  // M3.5 #9: mirror SAT — school-side DB gap must not blame the student.
  it("school missing act25th → no-data (school-missing-data text, names the school)", () => {
    const result = actDimension.compute(
      makeAnswers({ actScore: 32 }),
      makeSchool({ name: "Cornell University", act25th: null }),
    );
    expect(result.severity).toBe("no-data");
    expect(result.action).toContain("暂无");
    expect(result.action).toContain("Cornell University");
    expect(result.action).not.toContain("补上");
  });

  it("school missing act75th → no-data (school-missing-data text, names the school)", () => {
    const result = actDimension.compute(
      makeAnswers({ actScore: 32 }),
      makeSchool({ name: "Cornell University", act75th: null }),
    );
    expect(result.severity).toBe("no-data");
    expect(result.action).toContain("暂无");
    expect(result.action).toContain("Cornell University");
    expect(result.action).not.toContain("补上");
  });

  it("both student and school missing → no-data (student-missing wins)", () => {
    const result = actDimension.compute(
      makeAnswers({ actScore: undefined }),
      makeSchool({ act25th: null, act75th: null }),
    );
    expect(result.severity).toBe("no-data");
    expect(result.action).toContain("补上");
    expect(result.action).not.toContain("数据库");
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
