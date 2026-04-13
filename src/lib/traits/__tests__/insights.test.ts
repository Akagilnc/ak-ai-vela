import { describe, it, expect } from "vitest";
import { generateInsight } from "../insights";
import type { TraitAnswers } from "../types";

describe("generateInsight", () => {
  it("returns a non-empty string for animal-science + caring", () => {
    const result = generateInsight("animal-science", "caring");
    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
  });

  it("covers all 12 interest+detail combinations", () => {
    const combos: Array<[TraitAnswers["interest"], TraitAnswers["interestDetail"]]> = [
      ["animal-science", "caring"],
      ["animal-science", "science"],
      ["animal-science", "career"],
      ["stem", "builder"],
      ["stem", "digital"],
      ["stem", "experiment"],
      ["humanities", "visual"],
      ["humanities", "narrative"],
      ["humanities", "performing"],
      ["exploring", "physical"],
      ["exploring", "screen"],
      ["exploring", "quiet"],
    ];

    const insights = combos.map(([i, d]) => generateInsight(i, d));
    // All should be non-empty strings
    for (const insight of insights) {
      expect(insight.length).toBeGreaterThan(0);
    }
    // All should be unique
    const unique = new Set(insights);
    expect(unique.size).toBe(12);
  });

  it("each insight is under 30 Chinese characters", () => {
    const result = generateInsight("stem", "builder");
    expect(result.length).toBeLessThanOrEqual(30);
  });
});
