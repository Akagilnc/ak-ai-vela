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

  it("every insight is under 35 Chinese characters", () => {
    // 35-char ceiling is the mid-quiz insight card's line-wrap budget.
    // Every key is checked — spot-checking builder only (the old assertion)
    // let science and experiment silently drift to 32 chars after the
    // Slice 1 de-slop round (pre-landing review on feat/trait-v05-deslop
    // caught it). All 12 must pass, not just one representative.
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
    for (const [i, d] of combos) {
      const insight = generateInsight(i, d);
      expect(insight.length, `${i}:${d} → ${insight}`).toBeLessThanOrEqual(35);
    }
  });
});
