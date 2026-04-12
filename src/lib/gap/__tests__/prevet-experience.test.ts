import { describe, it, expect } from "vitest";
import type { QuestionnaireAnswers } from "@/lib/types";
import { prevetExperienceDimension } from "../dimensions/prevet-experience";
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
    targetMajor: "pre-vet",
    ...overrides,
  } as QuestionnaireAnswers;
}

describe("prevetExperienceDimension — metadata", () => {
  it("has id 'prevet-experience'", () => {
    expect(prevetExperienceDimension.id).toBe("prevet-experience");
  });

  it("is prevet-only", () => {
    expect(prevetExperienceDimension.prevetOnly).toBe(true);
  });
});

describe("prevetExperienceDimension.appliesTo", () => {
  it("true for pre-vet major", () => {
    expect(
      prevetExperienceDimension.appliesTo(makeAnswers({ targetMajor: "pre-vet" })),
    ).toBe(true);
  });

  it("true for animal-science major", () => {
    expect(
      prevetExperienceDimension.appliesTo(
        makeAnswers({ targetMajor: "animal-science" }),
      ),
    ).toBe(true);
  });

  it("false for biology major", () => {
    expect(
      prevetExperienceDimension.appliesTo(makeAnswers({ targetMajor: "biology" })),
    ).toBe(false);
  });

  it("false for 'other' major", () => {
    expect(
      prevetExperienceDimension.appliesTo(makeAnswers({ targetMajor: "other" })),
    ).toBe(false);
  });

  it("false when targetMajor is undefined", () => {
    expect(
      prevetExperienceDimension.appliesTo(
        makeAnswers({ targetMajor: undefined }),
      ),
    ).toBe(false);
  });
});

describe("prevetExperienceDimension.compute — excellent", () => {
  // Excellent threshold: totalHours >= 150
  it("≥150 hours → excellent", () => {
    const result = prevetExperienceDimension.compute(
      makeAnswers({
        animalExperience: [{ type: "volunteer", hours: 160 }],
      }),
      makeSchool(),
    );
    expect(result.severity).toBe("excellent");
    expect(result.action).toContain("远超");
  });

  it("exactly 150 hours → excellent (inclusive)", () => {
    const result = prevetExperienceDimension.compute(
      makeAnswers({
        animalExperience: [{ type: "volunteer", hours: 150 }],
      }),
      makeSchool(),
    );
    expect(result.severity).toBe("excellent");
  });

  it("149 hours → green (not excellent)", () => {
    const result = prevetExperienceDimension.compute(
      makeAnswers({
        animalExperience: [{ type: "volunteer", hours: 149 }],
      }),
      makeSchool(),
    );
    expect(result.severity).toBe("green");
  });
});

describe("prevetExperienceDimension.compute — severity", () => {
  it("100 ≤ hours < 150 → green", () => {
    const result = prevetExperienceDimension.compute(
      makeAnswers({
        animalExperience: [{ type: "volunteer", hours: 120 }],
      }),
      makeSchool(),
    );
    expect(result.severity).toBe("green");
    expect(result.current).toBe(120);
    expect(result.target).toEqual({ min: 40, max: 100 });
  });

  it("exactly 100 hours → green (inclusive)", () => {
    const result = prevetExperienceDimension.compute(
      makeAnswers({
        animalExperience: [{ type: "volunteer", hours: 100 }],
      }),
      makeSchool(),
    );
    expect(result.severity).toBe("green");
  });

  it("40 ≤ hours < 100 → yellow", () => {
    const result = prevetExperienceDimension.compute(
      makeAnswers({
        animalExperience: [{ type: "volunteer", hours: 60 }],
      }),
      makeSchool(),
    );
    expect(result.severity).toBe("yellow");
  });

  it("exactly 40 hours → yellow (inclusive bottom)", () => {
    const result = prevetExperienceDimension.compute(
      makeAnswers({
        animalExperience: [{ type: "volunteer", hours: 40 }],
      }),
      makeSchool(),
    );
    expect(result.severity).toBe("yellow");
  });

  it("<40 hours → red", () => {
    const result = prevetExperienceDimension.compute(
      makeAnswers({
        animalExperience: [{ type: "volunteer", hours: 20 }],
      }),
      makeSchool(),
    );
    expect(result.severity).toBe("red");
  });

  it("sums to yellow across multiple entries (total in [40, 100))", () => {
    const result = prevetExperienceDimension.compute(
      makeAnswers({
        animalExperience: [
          { type: "volunteer", hours: 20 },
          { type: "shadowing", hours: 25 },
          { type: "internship", hours: 10 },
        ],
      }),
      makeSchool(),
    );
    // 20+25+10 = 55 → yellow
    expect(result.severity).toBe("yellow");
    expect(result.current).toBe(55);
  });

  it("sums to green across multiple entries (total ≥ 100)", () => {
    const result = prevetExperienceDimension.compute(
      makeAnswers({
        animalExperience: [
          { type: "volunteer", hours: 30 },
          { type: "shadowing", hours: 45 },
          { type: "internship", hours: 30 },
        ],
      }),
      makeSchool(),
    );
    // 30+45+30 = 105 → green
    expect(result.severity).toBe("green");
    expect(result.current).toBe(105);
  });

  it("entries with null hours contribute 0", () => {
    const result = prevetExperienceDimension.compute(
      makeAnswers({
        animalExperience: [
          { type: "volunteer", hours: 50 },
          { type: "shadowing" }, // hours undefined
        ],
      }),
      makeSchool(),
    );
    expect(result.severity).toBe("yellow"); // 50 + 0 = 50
    expect(result.current).toBe(50);
  });
});

describe("prevetExperienceDimension.compute — no-data", () => {
  it("animalExperience undefined → no-data", () => {
    const result = prevetExperienceDimension.compute(
      makeAnswers({ animalExperience: undefined }),
      makeSchool(),
    );
    expect(result.severity).toBe("no-data");
    expect(result.current).toBe(null);
    expect(result.target).toBe(null);
    expect(result.action).toBeTruthy();
  });

  it("animalExperience empty array → no-data", () => {
    const result = prevetExperienceDimension.compute(
      makeAnswers({ animalExperience: [] }),
      makeSchool(),
    );
    expect(result.severity).toBe("no-data");
  });
});

describe("prevetExperienceDimension.compute — invariants", () => {
  it("result.dimension always 'prevet-experience'", () => {
    const result = prevetExperienceDimension.compute(
      makeAnswers({ animalExperience: [{ type: "volunteer", hours: 50 }] }),
      makeSchool(),
    );
    expect(result.dimension).toBe("prevet-experience");
  });

  it("result.normalized is always null", () => {
    const result = prevetExperienceDimension.compute(
      makeAnswers({ animalExperience: [{ type: "volunteer", hours: 50 }] }),
      makeSchool(),
    );
    expect(result.normalized).toBe(null);
  });
});
