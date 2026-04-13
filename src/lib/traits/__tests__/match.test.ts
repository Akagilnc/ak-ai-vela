import { describe, it, expect } from "vitest";
import { matchRoute, foldInterest, foldResource } from "../match";
import type { TraitAnswers } from "../types";

// Helper to build a complete TraitAnswers with overrides
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

describe("foldInterest", () => {
  it("maps animal-science to animal", () => {
    expect(foldInterest("animal-science")).toBe("animal");
  });

  it("keeps stem as stem", () => {
    expect(foldInterest("stem")).toBe("stem");
  });

  it("keeps humanities as humanities", () => {
    expect(foldInterest("humanities")).toBe("humanities");
  });

  it("keeps exploring as exploring", () => {
    expect(foldInterest("exploring")).toBe("exploring");
  });
});

describe("foldResource", () => {
  it("maps high to high", () => {
    expect(foldResource("high")).toBe("high");
  });

  it("maps medium to std", () => {
    expect(foldResource("medium")).toBe("std");
  });

  it("maps limited to std", () => {
    expect(foldResource("limited")).toBe("std");
  });
});

describe("matchRoute", () => {
  // All 12 route combinations
  const routeCombinations: Array<{
    ageGroup: TraitAnswers["ageGroup"];
    interest: TraitAnswers["interest"];
    resourceLevel: TraitAnswers["resourceLevel"];
    expectedRouteId: string;
  }> = [
    // lower age group
    { ageGroup: "lower", interest: "animal-science", resourceLevel: "high", expectedRouteId: "lower-animal-high" },
    { ageGroup: "lower", interest: "animal-science", resourceLevel: "medium", expectedRouteId: "lower-animal-std" },
    { ageGroup: "lower", interest: "stem", resourceLevel: "high", expectedRouteId: "lower-stem-high" },
    { ageGroup: "lower", interest: "stem", resourceLevel: "limited", expectedRouteId: "lower-stem-std" },
    // upper age group
    { ageGroup: "upper", interest: "humanities", resourceLevel: "high", expectedRouteId: "upper-humanities-high" },
    { ageGroup: "upper", interest: "humanities", resourceLevel: "medium", expectedRouteId: "upper-humanities-std" },
    { ageGroup: "upper", interest: "exploring", resourceLevel: "high", expectedRouteId: "upper-exploring-high" },
    { ageGroup: "upper", interest: "exploring", resourceLevel: "limited", expectedRouteId: "upper-exploring-std" },
    // middle-school age group
    { ageGroup: "middle-school", interest: "animal-science", resourceLevel: "high", expectedRouteId: "middle-school-animal-high" },
    { ageGroup: "middle-school", interest: "stem", resourceLevel: "medium", expectedRouteId: "middle-school-stem-std" },
    { ageGroup: "middle-school", interest: "humanities", resourceLevel: "limited", expectedRouteId: "middle-school-humanities-std" },
    { ageGroup: "middle-school", interest: "exploring", resourceLevel: "high", expectedRouteId: "middle-school-exploring-high" },
  ];

  it.each(routeCombinations)(
    "returns $expectedRouteId for ageGroup=$ageGroup, interest=$interest, resource=$resourceLevel",
    ({ ageGroup, interest, resourceLevel, expectedRouteId }) => {
      const answers = makeAnswers({ ageGroup, interest, resourceLevel });
      expect(matchRoute(answers)).toBe(expectedRouteId);
    }
  );

  it("returns the same routeId regardless of modifier values", () => {
    const base = makeAnswers();
    const withDifferentModifiers = makeAnswers({
      learningDrive: "companion",
      driveDetail: "dialogue-learner",
      socialStyle: "solo",
      socialDetail: "content-solo",
      englishLevel: "weak",
      parentStyle: "hands-off",
    });
    expect(matchRoute(base)).toBe(matchRoute(withDifferentModifiers));
  });

  it("produces exactly 24 unique route IDs across all combinations", () => {
    const allRouteIds = new Set<string>();
    const ageGroups: TraitAnswers["ageGroup"][] = ["lower", "upper", "middle-school"];
    const interests: TraitAnswers["interest"][] = ["animal-science", "stem", "humanities", "exploring"];
    const resources: TraitAnswers["resourceLevel"][] = ["high", "medium", "limited"];

    for (const ageGroup of ageGroups) {
      for (const interest of interests) {
        for (const resourceLevel of resources) {
          allRouteIds.add(matchRoute(makeAnswers({ ageGroup, interest, resourceLevel })));
        }
      }
    }

    // 3 ages × 4 interests × 2 resource folds = 24 unique route IDs
    expect(allRouteIds.size).toBe(24);
  });
});
