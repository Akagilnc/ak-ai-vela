import { describe, it, expect } from "vitest";
import { generatePortrait } from "../portraits";
import type { TraitAnswers } from "../types";

function makeAnswers(overrides: Partial<TraitAnswers> = {}): TraitAnswers {
  return {
    ageGroup: "lower",
    interest: "animal-science",
    interestDetail: "caring",
    learningDrive: "self-driven",
    driveDetail: "deep-focus",
    socialStyle: "team",
    socialDetail: "leader",
    englishLevel: "average",
    resourceLevel: "medium",
    parentStyle: "proactive",
    ...overrides,
  };
}

describe("generatePortrait", () => {
  it("returns a title and description", () => {
    const result = generatePortrait(makeAnswers());
    expect(result.title).toBeTruthy();
    expect(result.description).toBeTruthy();
    expect(typeof result.title).toBe("string");
    expect(typeof result.description).toBe("string");
  });

  it("title is under 10 Chinese characters", () => {
    const result = generatePortrait(makeAnswers());
    // Chinese chars are typically 1 char each in string length
    expect(result.title.length).toBeLessThanOrEqual(10);
  });

  it("description is under 100 characters", () => {
    const result = generatePortrait(makeAnswers());
    expect(result.description.length).toBeLessThanOrEqual(100);
  });

  it("different interest + interestDetail produce different titles", () => {
    const animal = generatePortrait(makeAnswers({ interest: "animal-science", interestDetail: "caring" }));
    const stem = generatePortrait(makeAnswers({ interest: "stem", interestDetail: "builder" }));
    const humanities = generatePortrait(makeAnswers({ interest: "humanities", interestDetail: "visual" }));
    const exploring = generatePortrait(makeAnswers({ interest: "exploring", interestDetail: "physical" }));

    const titles = new Set([animal.title, stem.title, humanities.title, exploring.title]);
    expect(titles.size).toBe(4);
  });

  it("different learningDrive affects description", () => {
    const selfDriven = generatePortrait(makeAnswers({ learningDrive: "self-driven", driveDetail: "deep-focus" }));
    const companion = generatePortrait(makeAnswers({ learningDrive: "companion", driveDetail: "dialogue-learner" }));
    expect(selfDriven.description).not.toBe(companion.description);
  });

  it("covers all 12 interest+detail combinations with unique titles", () => {
    const combos: Array<{ interest: TraitAnswers["interest"]; interestDetail: TraitAnswers["interestDetail"] }> = [
      { interest: "animal-science", interestDetail: "caring" },
      { interest: "animal-science", interestDetail: "science" },
      { interest: "animal-science", interestDetail: "career" },
      { interest: "stem", interestDetail: "builder" },
      { interest: "stem", interestDetail: "digital" },
      { interest: "stem", interestDetail: "experiment" },
      { interest: "humanities", interestDetail: "visual" },
      { interest: "humanities", interestDetail: "narrative" },
      { interest: "humanities", interestDetail: "performing" },
      { interest: "exploring", interestDetail: "physical" },
      { interest: "exploring", interestDetail: "screen" },
      { interest: "exploring", interestDetail: "quiet" },
    ];

    const titles = combos.map((c) => generatePortrait(makeAnswers(c)).title);
    const unique = new Set(titles);
    expect(unique.size).toBe(12);
  });
});
