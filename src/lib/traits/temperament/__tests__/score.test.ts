/**
 * Tests for classify() — the 4-class temperament classification function.
 *
 * Spec: research notes Section 4 + 4.2 (8 fixture cases).
 *
 * Algorithm (Section 4.1):
 *   1. variance guard: σ < 0.5 across all 30 raw answers → lowVariance = true
 *   2. core composite = sum of 5 core dims toward attention pole / 25
 *   3. classify by core first, then by intensity within high-core branch:
 *      - core ≤ 0.30 → 灵活型
 *      - core ≥ 0.70:
 *          - intensity ≥ 3.5 → 慎重型
 *          - intensity < 3.5 → 慢热型 (Thomas & Chess slow-to-warm phenotype)
 *      - core in [0.55, 0.70) AND intensity < 3.5 → 慢热型
 *      - else → 平衡型
 *   4. hysteresis: |intensity - 3.5| < 0.2 → confidence = 'low'
 *   5. variance guard fires only on 平衡型 branch (extreme uniform carries signal)
 *
 * Returns { type, confidence: 'high' | 'low', rawCore, rawIntensity }.
 */
import { describe, expect, it } from "vitest";
import {
  CLASSIFICATION_CONFIG,
  classify,
  computeCore,
  type ClassifyInput,
  type ClassifyResult,
  type TraitType,
} from "../score";

// Helper to build a full 9-dim score with sensible defaults (3 = midpoint)
function makeScores(
  partial: Partial<ClassifyInput["scores"]> = {},
): ClassifyInput["scores"] {
  return {
    activityLevel: 3,
    rhythmicity: 3,
    approach: 3,
    adaptability: 3,
    intensity: 3,
    threshold: 3,
    mood: 3,
    distractibility: 3,
    persistence: 3,
    ...partial,
  };
}

// Helper for the 30 raw answers (defaults to varied so variance guard does NOT fire)
function makeRawAnswers(values?: number[]): number[] {
  if (values) return values;
  // 30 answers with σ > 0.5 (so we don't accidentally trip variance guard)
  return [1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5];
}

describe("classify — 8 fixture cases from research notes Section 4.2", () => {
  it("case 1 — 灵活型 pure: (rhy=5, app=1, ada=5, int=1, moo=5) → 灵活型, high", () => {
    const result = classify({
      scores: makeScores({
        rhythmicity: 5, approach: 1, adaptability: 5, intensity: 1, mood: 5,
      }),
      allRawAnswers: makeRawAnswers(),
    });
    expect(result.type).toBe("灵活型");
    expect(result.confidence).toBe("high");
    expect(result.rawCore).toBeCloseTo(0.08, 2);
  });

  it("case 2 — 慎重型 pure: (1,5,1,5,1) → 慎重型, high", () => {
    const result = classify({
      scores: makeScores({
        rhythmicity: 1, approach: 5, adaptability: 1, intensity: 5, mood: 1,
      }),
      allRawAnswers: makeRawAnswers(),
    });
    expect(result.type).toBe("慎重型");
    expect(result.confidence).toBe("high");
    expect(result.rawCore).toBeCloseTo(0.88, 2);
  });

  it("case 3 — 慢热型 pure: (1,5,1,2,1) → 慢热型, high", () => {
    const result = classify({
      scores: makeScores({
        rhythmicity: 1, approach: 5, adaptability: 1, intensity: 2, mood: 1,
      }),
      allRawAnswers: makeRawAnswers(),
    });
    expect(result.type).toBe("慢热型");
    expect(result.confidence).toBe("high");
    expect(result.rawCore).toBeCloseTo(0.76, 2);
  });

  it("case 4 — 中位 σ=0: (3,3,3,3,3) all-3 → 平衡型, low (variance guard)", () => {
    const result = classify({
      scores: makeScores(), // all 3
      allRawAnswers: Array(30).fill(3), // σ = 0
    });
    expect(result.type).toBe("平衡型");
    expect(result.confidence).toBe("low");
  });

  it("case 5 — R1#2 reproducer: (1,4,1,3,2) → 慢热型, high", () => {
    const result = classify({
      scores: makeScores({
        rhythmicity: 1, approach: 4, adaptability: 1, intensity: 3, mood: 2,
      }),
      allRawAnswers: makeRawAnswers(),
    });
    expect(result.type).toBe("慢热型");
    expect(result.confidence).toBe("high");
    expect(result.rawCore).toBeCloseTo(0.72, 2);
  });

  it("case 6 — hysteresis edge: intensity=3.5 → confidence=low", () => {
    const result = classify({
      scores: makeScores({
        rhythmicity: 1, approach: 4, adaptability: 1, intensity: 3.5, mood: 2,
      }),
      allRawAnswers: makeRawAnswers(),
    });
    expect(result.type).toBe("慎重型"); // high core (0.74) + intensity >= 3.5
    expect(result.confidence).toBe("low"); // hysteresis triggered
  });

  it("case 7 — variance guard with non-zero sigma below threshold", () => {
    // 5-dim core same as case 4 (平衡型), but raw answers σ ≈ 0.18 (still < 0.5)
    const rawAnswers = [...Array(29).fill(3), 4]; // σ ≈ 0.18
    const result = classify({
      scores: makeScores(),
      allRawAnswers: rawAnswers,
    });
    expect(result.type).toBe("平衡型");
    expect(result.confidence).toBe("low");
  });

  it("case 8a — boundary mid-zone vs high-zone: (1,4,2,4,2) → 慎重型, high", () => {
    const result = classify({
      scores: makeScores({
        rhythmicity: 1, approach: 4, adaptability: 2, intensity: 4, mood: 2,
      }),
      allRawAnswers: makeRawAnswers(),
    });
    expect(result.type).toBe("慎重型");
    expect(result.confidence).toBe("high");
    expect(result.rawCore).toBeCloseTo(0.72, 2);
  });

  it("case 8b — mid-zone with high intensity → 平衡型 (not 慢热型, since intensity ≥ 3.5)", () => {
    const result = classify({
      scores: makeScores({
        rhythmicity: 1, approach: 4, adaptability: 2, intensity: 4, mood: 3,
      }),
      allRawAnswers: makeRawAnswers(),
    });
    expect(result.type).toBe("平衡型");
    expect(result.rawCore).toBeCloseTo(0.68, 2);
  });

  it("case 9a — high-core 慎重型 with high intensity: (1,5,1,5,2) → 慎重型, high", () => {
    const result = classify({
      scores: makeScores({
        rhythmicity: 1, approach: 5, adaptability: 1, intensity: 5, mood: 2,
      }),
      allRawAnswers: makeRawAnswers(),
    });
    expect(result.type).toBe("慎重型");
    expect(result.confidence).toBe("high");
    expect(result.rawCore).toBeCloseTo(0.84, 2);
  });

  it("mid-zone slow-warm with hysteresis: core=0.696 + intensity=3.4 → 慢热型, low (covers slowWarm branch hysteresis)", () => {
    const result = classify({
      scores: makeScores({
        rhythmicity: 1, approach: 4, adaptability: 2, intensity: 3.4, mood: 2,
      }),
      allRawAnswers: makeRawAnswers(),
    });
    expect(result.type).toBe("慢热型");
    expect(result.confidence).toBe("low"); // |3.4 - 3.5| = 0.1 < 0.2 = band/2
    expect(result.rawCore).toBeCloseTo(0.696, 3);
  });

  it("case 9b — high-core slow-warm phenotype: (1,5,1,2,2) → 慢热型 (Thomas & Chess)", () => {
    const result = classify({
      scores: makeScores({
        rhythmicity: 1, approach: 5, adaptability: 1, intensity: 2, mood: 2,
      }),
      allRawAnswers: makeRawAnswers(),
    });
    expect(result.type).toBe("慢热型");
    expect(result.confidence).toBe("high");
    expect(result.rawCore).toBeCloseTo(0.72, 2);
  });
});

describe("classify — variance guard policy", () => {
  it("variance guard does NOT downgrade 灵活型 confidence (extreme uniform carries signal)", () => {
    const result = classify({
      scores: makeScores({
        rhythmicity: 5, approach: 1, adaptability: 5, intensity: 1, mood: 5,
      }),
      allRawAnswers: Array(30).fill(1), // σ = 0
    });
    expect(result.type).toBe("灵活型");
    expect(result.confidence).toBe("high"); // intentionally not downgraded
  });

  it("variance guard does NOT downgrade 慎重型 confidence", () => {
    const result = classify({
      scores: makeScores({
        rhythmicity: 1, approach: 5, adaptability: 1, intensity: 5, mood: 1,
      }),
      allRawAnswers: Array(30).fill(5), // σ = 0
    });
    expect(result.type).toBe("慎重型");
    expect(result.confidence).toBe("high");
  });

  it("variance guard fires for 平衡型 only", () => {
    const result = classify({
      scores: makeScores(), // all 3 → 平衡型
      allRawAnswers: Array(30).fill(3),
    });
    expect(result.type).toBe("平衡型");
    expect(result.confidence).toBe("low");
  });

  it("normal variance (σ ≥ 0.5) does not trigger guard for 平衡型", () => {
    const result = classify({
      scores: makeScores(),
      allRawAnswers: makeRawAnswers(), // σ > 1 (well-distributed)
    });
    expect(result.type).toBe("平衡型");
    expect(result.confidence).toBe("high");
  });
});

describe("classify — return shape", () => {
  it("returns { type, confidence, rawCore, rawIntensity }", () => {
    const result: ClassifyResult = classify({
      scores: makeScores(),
      allRawAnswers: makeRawAnswers(),
    });
    expect(result).toEqual(
      expect.objectContaining({
        type: expect.any(String),
        confidence: expect.stringMatching(/^(high|low)$/),
        rawCore: expect.any(Number),
        rawIntensity: expect.any(Number),
      }),
    );
  });

  it("type is one of the 4 valid trait types", () => {
    const validTypes: TraitType[] = ["灵活型", "慎重型", "慢热型", "平衡型"];
    const result = classify({
      scores: makeScores(),
      allRawAnswers: makeRawAnswers(),
    });
    expect(validTypes).toContain(result.type);
  });
});

describe("computeCore — 5-dim composite math", () => {
  it("all-3 → core = 0.48", () => {
    const core = computeCore(makeScores());
    expect(core).toBeCloseTo(0.48, 2);
  });

  it("灵活型 pure (rhy=5, app=1, ada=5, int=1, moo=5) → 0.08", () => {
    const core = computeCore(
      makeScores({
        rhythmicity: 5, approach: 1, adaptability: 5, intensity: 1, mood: 5,
      }),
    );
    expect(core).toBeCloseTo(0.08, 2);
  });

  it("ignores non-core dims (activityLevel/threshold/distractibility/persistence)", () => {
    const a = computeCore(
      makeScores({ activityLevel: 1, threshold: 1, distractibility: 1, persistence: 1 }),
    );
    const b = computeCore(
      makeScores({ activityLevel: 5, threshold: 5, distractibility: 5, persistence: 5 }),
    );
    expect(a).toBeCloseTo(b, 6);
  });
});

describe("CLASSIFICATION_CONFIG — locked cutoff values", () => {
  it("cutoffs match Phase 1 spec", () => {
    expect(CLASSIFICATION_CONFIG.cutoffs.easy).toBe(0.3);
    expect(CLASSIFICATION_CONFIG.cutoffs.slowWarm).toBe(0.55);
    expect(CLASSIFICATION_CONFIG.cutoffs.cautious).toBe(0.7);
    expect(CLASSIFICATION_CONFIG.cutoffs.intensityHigh).toBe(3.5);
    expect(CLASSIFICATION_CONFIG.cutoffs.intensityHysteresisBand).toBe(0.4);
    expect(CLASSIFICATION_CONFIG.cutoffs.varianceMin).toBe(0.5);
  });

  it("5 core dim ids match expected", () => {
    expect(CLASSIFICATION_CONFIG.coreDims.map((d) => d.key).sort()).toEqual(
      ["adaptability", "approach", "intensity", "mood", "rhythmicity"].sort(),
    );
  });
});
