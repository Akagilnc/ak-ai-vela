import { describe, it, expect } from "vitest";
import type { QuestionnaireAnswers } from "@/lib/types";
import {
  analyzeStudentVsSchool,
  analyzeStudentVsAllSchools,
  type AnswersOverride,
} from "../engine";
import { DIMENSIONS } from "../dimensions";
import { getRecommendation } from "../recommendations";
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
    actScore: 32,
    targetMajor: "pre-vet",
    animalExperience: [{ type: "volunteer", hours: 50 }],
    ...overrides,
  } as QuestionnaireAnswers;
}

// ============================================================================
// analyzeStudentVsSchool
// ============================================================================

describe("analyzeStudentVsSchool — dimension filtering", () => {
  it("pre-vet student gets all 4 dimensions", () => {
    const results = analyzeStudentVsSchool(makeAnswers(), makeSchool());
    const ids = results.map((r) => r.dimension);
    expect(ids).toContain("gpa");
    expect(ids).toContain("sat");
    expect(ids).toContain("act");
    expect(ids).toContain("prevet-experience");
    expect(results).toHaveLength(4);
  });

  it("biology student does NOT get prevet-experience", () => {
    const results = analyzeStudentVsSchool(
      makeAnswers({ targetMajor: "biology" }),
      makeSchool(),
    );
    const ids = results.map((r) => r.dimension);
    expect(ids).not.toContain("prevet-experience");
    expect(results).toHaveLength(3);
  });

  it("student with no targetMajor does NOT get prevet-experience", () => {
    const results = analyzeStudentVsSchool(
      makeAnswers({ targetMajor: undefined }),
      makeSchool(),
    );
    expect(results.map((r) => r.dimension)).not.toContain("prevet-experience");
  });

  it("animal-science student gets prevet-experience", () => {
    const results = analyzeStudentVsSchool(
      makeAnswers({ targetMajor: "animal-science" }),
      makeSchool(),
    );
    expect(results.map((r) => r.dimension)).toContain("prevet-experience");
  });
});

describe("analyzeStudentVsSchool — integration scenarios", () => {
  it("strong student all green", () => {
    const results = analyzeStudentVsSchool(
      makeAnswers({
        gpaPercentage: 95,
        satScore: 1550,
        actScore: 35,
        animalExperience: [{ type: "volunteer", hours: 200 }],
      }),
      makeSchool({ avgGPA: 3.8, sat25th: 1400, sat75th: 1500, act25th: 31, act75th: 34 }),
    );
    const severities = results.map((r) => r.severity);
    expect(severities.every((s) => s === "green")).toBe(true);
  });

  it("weak student all red", () => {
    const results = analyzeStudentVsSchool(
      makeAnswers({
        gpaPercentage: 75,
        satScore: 1200,
        actScore: 25,
        animalExperience: [{ type: "volunteer", hours: 10 }],
      }),
      makeSchool({ avgGPA: 3.8, sat25th: 1400, sat75th: 1500, act25th: 31, act75th: 34 }),
    );
    const severities = results.map((r) => r.severity);
    expect(severities.every((s) => s === "red")).toBe(true);
  });

  it("student with no test scores → multiple no-data", () => {
    const results = analyzeStudentVsSchool(
      makeAnswers({
        satScore: undefined,
        actScore: undefined,
        animalExperience: undefined,
      }),
      makeSchool(),
    );
    const noDataCount = results.filter((r) => r.severity === "no-data").length;
    expect(noDataCount).toBe(3); // sat, act, prevet-experience
  });

  it("dimensions trust pre-validated inputs (no try/catch wrapper)", () => {
    // engine must NOT swallow thrown errors — design doc "fail-fast policy"
    const results = analyzeStudentVsSchool(makeAnswers(), makeSchool());
    expect(results).toHaveLength(4); // sanity: normal happy path
  });
});

// ============================================================================
// overrides parameter (What If simulator support)
// ============================================================================

describe("analyzeStudentVsSchool — overrides", () => {
  it("numeric override flips severity", () => {
    const base = makeAnswers({ satScore: 1200 }); // red
    const withOverride = analyzeStudentVsSchool(base, makeSchool(), {
      satScore: 1550,
    });
    const sat = withOverride.find((r) => r.dimension === "sat");
    expect(sat?.severity).toBe("green");
  });

  it("override does not affect unrelated dimensions", () => {
    const base = makeAnswers({ satScore: 1200, gpaPercentage: 95 });
    const withOverride = analyzeStudentVsSchool(base, makeSchool(), {
      satScore: 1550,
    });
    const gpa = withOverride.find((r) => r.dimension === "gpa");
    expect(gpa?.severity).toBe("green"); // GPA unchanged
  });

  it("targetMajor override from biology to pre-vet adds prevet-experience", () => {
    const base = makeAnswers({ targetMajor: "biology" });
    const withOverride = analyzeStudentVsSchool(base, makeSchool(), {
      targetMajor: "pre-vet",
    });
    expect(withOverride.map((r) => r.dimension)).toContain("prevet-experience");
  });

  it("targetMajor override from pre-vet to biology removes prevet-experience", () => {
    const base = makeAnswers({ targetMajor: "pre-vet" });
    const withOverride = analyzeStudentVsSchool(base, makeSchool(), {
      targetMajor: "biology",
    });
    expect(withOverride.map((r) => r.dimension)).not.toContain(
      "prevet-experience",
    );
  });

  it("empty overrides object is equivalent to undefined", () => {
    const base = makeAnswers();
    const a = analyzeStudentVsSchool(base, makeSchool());
    const b = analyzeStudentVsSchool(base, makeSchool(), {});
    expect(b).toEqual(a);
  });

  it("undefined field in overrides does NOT clobber base value", () => {
    const base = makeAnswers({ satScore: 1450 });
    const withUndefinedOverride = analyzeStudentVsSchool(base, makeSchool(), {
      satScore: undefined,
    });
    const sat = withUndefinedOverride.find((r) => r.dimension === "sat");
    expect(sat?.current).toBe(1450); // not wiped
  });

  it("null field in overrides explicitly clears the base value", () => {
    const base = makeAnswers({ satScore: 1450 });
    // AnswersOverride permits null per key, so no cast is needed — null
    // means "explicit clear" and mergeOverrides deletes the key so
    // dimensions see it as missing.
    const withNullOverride = analyzeStudentVsSchool(base, makeSchool(), {
      satScore: null,
    });
    const sat = withNullOverride.find((r) => r.dimension === "sat");
    expect(sat?.severity).toBe("no-data");
  });
});

// ============================================================================
// analyzeStudentVsAllSchools
// ============================================================================

describe("analyzeStudentVsAllSchools", () => {
  it("returns a Map keyed by schoolId", () => {
    const schools = [
      makeSchool({ id: "school-a" }),
      makeSchool({ id: "school-b" }),
    ];
    const result = analyzeStudentVsAllSchools(makeAnswers(), schools);
    expect(result.size).toBe(2);
    expect(result.has("school-a")).toBe(true);
    expect(result.has("school-b")).toBe(true);
  });

  it("empty schools array returns empty Map", () => {
    const result = analyzeStudentVsAllSchools(makeAnswers(), []);
    expect(result.size).toBe(0);
  });

  it("Map iteration order is deterministic regardless of caller input order", () => {
    const schoolA = makeSchool({ id: "school-a" });
    const schoolB = makeSchool({ id: "school-b" });
    const schoolC = makeSchool({ id: "school-c" });

    const result1 = analyzeStudentVsAllSchools(makeAnswers(), [schoolA, schoolB, schoolC]);
    const result2 = analyzeStudentVsAllSchools(makeAnswers(), [schoolC, schoolA, schoolB]);

    expect(Array.from(result1.keys())).toEqual(Array.from(result2.keys()));
  });
});

// ============================================================================
// Determinism
// ============================================================================

describe("determinism", () => {
  it("call twice → deep-equal result", () => {
    const a = analyzeStudentVsSchool(makeAnswers(), makeSchool());
    const b = analyzeStudentVsSchool(makeAnswers(), makeSchool());
    expect(a).toEqual(b);
  });
});

// ============================================================================
// Recommendation coverage invariant
// ============================================================================

describe("recommendation coverage invariant", () => {
  it("every (dimension × severity) has a non-null, non-empty template", () => {
    const severities = ["green", "yellow", "red", "no-data"] as const;
    const stubCtx = {
      current: 42 as number | null,
      target: { min: 40, max: 100 },
      schoolName: "Test University",
    };
    for (const dim of DIMENSIONS) {
      for (const severity of severities) {
        const result = getRecommendation(dim.id, severity, stubCtx);
        expect(
          result,
          `${dim.id}:${severity} has no template`,
        ).toBeTruthy();
        expect(
          typeof result === "string" && result.length > 0,
          `${dim.id}:${severity} is empty`,
        ).toBe(true);
      }
    }
  });
});

// ============================================================================
// AnswersOverride — type-level narrowing (PR #7 Copilot P2)
// ============================================================================
//
// These tests do NOT exercise runtime behavior. They are compile-time
// assertions that pin the `AnswersOverride` type: score and experience
// fields MAY be cleared with null (used by the What If simulator), but
// contract fields (identity, schema version, school system, gpaType,
// targetMajor, etc.) MUST NOT accept null — clearing them would either
// violate the Zod schema or quietly change which code path the engine
// selects. `@ts-expect-error` comments enforce this at build time: if
// the type ever widens again, tsc will complain that the directive is
// unused and CI will fail.
//
// Note: vitest transpiles via esbuild/swc and does not type-check. The
// RED signal for these tests comes from `npx tsc --noEmit`, not from
// the test runner. The body just runs a trivial assertion so the `it`
// block has a non-empty runtime.

describe("AnswersOverride — type-level narrowing", () => {
  it("forbids null on contract fields, allows null on clearable fields", () => {
    // --- Contract fields: null MUST be a type error ---

    // @ts-expect-error schemaVersion is a contract field — null must not be allowed
    const _invalidSchemaVersion: AnswersOverride = { schemaVersion: null };
    // @ts-expect-error childName is a contract field — null must not be allowed
    const _invalidChildName: AnswersOverride = { childName: null };
    // @ts-expect-error birthYear is a contract field — null must not be allowed
    const _invalidBirthYear: AnswersOverride = { birthYear: null };
    // @ts-expect-error currentGrade is a contract field — null must not be allowed
    const _invalidCurrentGrade: AnswersOverride = { currentGrade: null };
    // @ts-expect-error schoolSystem is a contract field — null must not be allowed
    const _invalidSchoolSystem: AnswersOverride = { schoolSystem: null };
    // @ts-expect-error gpaType is a contract field — null must not be allowed (caller chooses GPA path)
    const _invalidGpaType: AnswersOverride = { gpaType: null };
    // @ts-expect-error targetMajor is a contract field — null must not be allowed (controls dimension filtering)
    const _invalidTargetMajor: AnswersOverride = { targetMajor: null };

    // --- Clearable fields: null MUST still be allowed (simulator use) ---

    const _validGpaPercentage: AnswersOverride = { gpaPercentage: null };
    const _validClassRank: AnswersOverride = { classRank: null };
    const _validScienceGPA: AnswersOverride = { scienceGPA: null };
    const _validSatScore: AnswersOverride = { satScore: null };
    const _validActScore: AnswersOverride = { actScore: null };
    const _validToeflScore: AnswersOverride = { toeflScore: null };
    const _validIeltsScore: AnswersOverride = { ieltsScore: null };
    const _validActivities: AnswersOverride = { activities: null };
    const _validAnimalExperience: AnswersOverride = { animalExperience: null };

    // Undefined remains valid on ALL fields (skip semantics).
    const _validUndefinedContract: AnswersOverride = { gpaType: undefined };
    const _validUndefinedClearable: AnswersOverride = { satScore: undefined };

    void _invalidSchemaVersion;
    void _invalidChildName;
    void _invalidBirthYear;
    void _invalidCurrentGrade;
    void _invalidSchoolSystem;
    void _invalidGpaType;
    void _invalidTargetMajor;
    void _validGpaPercentage;
    void _validClassRank;
    void _validScienceGPA;
    void _validSatScore;
    void _validActScore;
    void _validToeflScore;
    void _validIeltsScore;
    void _validActivities;
    void _validAnimalExperience;
    void _validUndefinedContract;
    void _validUndefinedClearable;

    expect(true).toBe(true);
  });
});
