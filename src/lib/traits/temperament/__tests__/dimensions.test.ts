/**
 * Tests for the 9 Thomas & Chess temperament dimensions metadata.
 *
 * Spec: ~/.gstack/projects/Akagilnc-ak-ai-vela/akagilnc-main-research-trait-v06-phase1-20260429.md
 *
 * Each dimension carries:
 *   - id: stable schema key (snake_case-like camelCase)
 *   - name: standard Chinese academic name
 *   - displayLabel: consumer-facing UI label (may differ from name)
 *   - attentionPole: 'low' | 'high' — which end is the "harder management" pole
 *   - isCore: whether this dim participates in 4-class classification
 */
import { describe, expect, it } from "vitest";
import {
  DIMENSION_LIST,
  DIMENSION_META,
  getAttentionLevel,
  type AttentionLevel,
  type DimensionId,
  type DimensionMeta,
} from "../dimensions";

describe("DIMENSION_META — 9 Thomas & Chess temperament dimensions", () => {
  it("exposes exactly 9 dimensions", () => {
    expect(DIMENSION_LIST).toHaveLength(9);
  });

  it("each dimension has unique id", () => {
    const ids = DIMENSION_LIST.map((d) => d.id);
    expect(new Set(ids).size).toBe(9);
  });

  it("dimension ids match the canonical schema keys", () => {
    expect(DIMENSION_LIST.map((d) => d.id).sort()).toEqual(
      [
        "activityLevel",
        "adaptability",
        "approach",
        "distractibility",
        "intensity",
        "mood",
        "persistence",
        "rhythmicity",
        "threshold",
      ].sort(),
    );
  });

  it("dimension ORDER is locked (slice 2 score-encoding bit packing depends on this)", () => {
    // dim0..dim8 positions are baked into score URL byte layout (research §4.5.2).
    // Reordering would silently break URL backward-compat. Always append new
    // dims to the END of DIMENSION_LIST.
    expect(DIMENSION_LIST.map((d) => d.id)).toEqual([
      "activityLevel",
      "rhythmicity",
      "approach",
      "adaptability",
      "intensity",
      "threshold",
      "mood",
      "distractibility",
      "persistence",
    ]);
  });

  it("each dimension carries non-empty Chinese name and displayLabel", () => {
    for (const dim of DIMENSION_LIST) {
      expect(dim.name).toMatch(/[一-龥]/); // contains at least one Chinese char
      expect(dim.displayLabel).toMatch(/[一-龥]/);
      expect(dim.name.length).toBeGreaterThan(0);
      expect(dim.displayLabel.length).toBeGreaterThan(0);
    }
  });
});

describe("attentionPole mapping (locked by Phase 1 BSQ research)", () => {
  // Per research notes Section 2 + R1 cross-review verification:
  // BSQ standardized scoring: every dim has a "harder management" direction,
  // no 'neutral' allowed.
  const expectedPoles: Record<DimensionId, "low" | "high"> = {
    activityLevel: "high", // high activity = needs more outlet
    rhythmicity: "low", // low = irregular biorhythms
    approach: "high", // high = withdrawal
    adaptability: "low", // low = slow to adapt
    intensity: "high", // high = strong reactions
    threshold: "low", // low = sensory sensitive
    mood: "low", // low = negative baseline
    distractibility: "high", // high = easily distracted
    persistence: "low", // low = doesn't persist
  };

  it.each(Object.entries(expectedPoles))(
    "%s has attentionPole = %s",
    (id, expectedPole) => {
      const meta = DIMENSION_META[id as DimensionId];
      expect(meta.attentionPole).toBe(expectedPole);
    },
  );

  it("no dimension has attentionPole === 'neutral'", () => {
    // Runtime backstop in case of any 'as any' bypass in implementation —
    // the type system already prevents 'neutral', but explicit check guards
    // against accidental coercion.
    for (const dim of DIMENSION_LIST) {
      expect(String(dim.attentionPole)).not.toBe("neutral");
    }
  });
});

describe("isCore mapping (5 core dims used by classify)", () => {
  // Per research notes Section 4: classify() composite uses these 5
  const expectedCore: DimensionId[] = [
    "rhythmicity",
    "approach",
    "adaptability",
    "intensity",
    "mood",
  ];

  it("exactly 5 dimensions are isCore=true", () => {
    const cores = DIMENSION_LIST.filter((d) => d.isCore);
    expect(cores).toHaveLength(5);
    expect(cores.map((d) => d.id).sort()).toEqual(expectedCore.sort());
  });

  it("the other 4 dimensions are isCore=false", () => {
    const nonCores = DIMENSION_LIST.filter((d) => !d.isCore);
    expect(nonCores).toHaveLength(4);
    expect(nonCores.map((d) => d.id).sort()).toEqual(
      ["activityLevel", "threshold", "distractibility", "persistence"].sort(),
    );
  });
});

describe("DIMENSION_META lookup matches DIMENSION_LIST", () => {
  it("every dim in DIMENSION_LIST has matching DIMENSION_META entry", () => {
    for (const dim of DIMENSION_LIST) {
      expect(DIMENSION_META[dim.id]).toBe(dim);
    }
  });

  it("every key in DIMENSION_META appears in DIMENSION_LIST", () => {
    const listIds = new Set(DIMENSION_LIST.map((d) => d.id));
    for (const key of Object.keys(DIMENSION_META)) {
      expect(listIds.has(key as DimensionId)).toBe(true);
    }
  });
});

describe("getAttentionLevel — 3-level color band per dim", () => {
  const high = DIMENSION_META.activityLevel; // attentionPole='high'
  const low = DIMENSION_META.rhythmicity; // attentionPole='low'

  it("attentionPole='high': score 1-2 = easy", () => {
    expect(getAttentionLevel(high, 1)).toBe("easy");
    expect(getAttentionLevel(high, 2)).toBe("easy");
  });
  it("attentionPole='high': score 3-4 = notable", () => {
    expect(getAttentionLevel(high, 3)).toBe("notable");
    expect(getAttentionLevel(high, 4)).toBe("notable");
  });
  it("attentionPole='high': score 5 = strong", () => {
    expect(getAttentionLevel(high, 5)).toBe("strong");
  });

  it("attentionPole='low': score 4-5 = easy", () => {
    expect(getAttentionLevel(low, 4)).toBe("easy");
    expect(getAttentionLevel(low, 5)).toBe("easy");
  });
  it("attentionPole='low': score 2-3 = notable", () => {
    expect(getAttentionLevel(low, 2)).toBe("notable");
    expect(getAttentionLevel(low, 3)).toBe("notable");
  });
  it("attentionPole='low': score 1 = strong", () => {
    expect(getAttentionLevel(low, 1)).toBe("strong");
  });

  it("returns AttentionLevel union type", () => {
    const valid: AttentionLevel[] = ["easy", "notable", "strong"];
    expect(valid).toContain(getAttentionLevel(high, 3));
  });
});

describe("DimensionMeta type shape (compile-time)", () => {
  it("DimensionMeta shape locked at compile time", () => {
    // Compile-time check only; runtime asserts attentionPole union.
    const meta: DimensionMeta = {
      id: "activityLevel",
      name: "活动水平",
      displayLabel: "活动水平",
      attentionPole: "high",
      isCore: false,
    };
    expect(meta.attentionPole).toBe("high");
  });
});
