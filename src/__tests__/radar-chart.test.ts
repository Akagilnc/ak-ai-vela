import { describe, it, expect } from "vitest";
import {
  SIZE,
  CENTER,
  RADIUS,
  polarToCartesian,
  getAngles,
  buildRadarDimensions,
  type RadarSchoolInput,
} from "../app/schools/[id]/radar-utils";

describe("RadarChart geometry", () => {
  it("generates correct number of angles", () => {
    const angles = getAngles(5);
    expect(angles).toHaveLength(5);
    expect(angles[0]).toBe(0);
    expect(angles[1]).toBe(72);
    expect(angles[4]).toBe(288);
  });

  it("first point is at top center (0 degrees = top)", () => {
    const [x, y] = polarToCartesian(0, RADIUS);
    expect(x).toBeCloseTo(CENTER);
    expect(y).toBeCloseTo(CENTER - RADIUS);
  });

  it("zero value produces point at center", () => {
    const angles = getAngles(5);
    const point = polarToCartesian(angles[0], (0 / 100) * RADIUS);
    expect(point[0]).toBeCloseTo(CENTER);
    expect(point[1]).toBeCloseTo(CENTER);
  });

  it("100 value produces point at max radius", () => {
    const [x, y] = polarToCartesian(0, (100 / 100) * RADIUS);
    expect(x).toBeCloseTo(CENTER);
    expect(y).toBeCloseTo(CENTER - RADIUS);
  });

  it("50 value produces point at half radius", () => {
    const [x, y] = polarToCartesian(0, (50 / 100) * RADIUS);
    expect(x).toBeCloseTo(CENTER);
    expect(y).toBeCloseTo(CENTER - RADIUS / 2);
  });

  it("all points are within SVG bounds", () => {
    const angles = getAngles(5);
    for (const a of angles) {
      const [x, y] = polarToCartesian(a, RADIUS);
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThanOrEqual(SIZE);
      expect(y).toBeGreaterThanOrEqual(0);
      expect(y).toBeLessThanOrEqual(SIZE);
    }
  });

  it("generates 4-dim radar for test-free schools (SAT skipped)", () => {
    const angles = getAngles(4);
    expect(angles).toHaveLength(4);
    expect(angles[0]).toBe(0);
    expect(angles[1]).toBe(90);
    expect(angles[2]).toBe(180);
    expect(angles[3]).toBe(270);
  });

  it("4-dim points are within SVG bounds", () => {
    const angles = getAngles(4);
    for (const a of angles) {
      const [x, y] = polarToCartesian(a, RADIUS);
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThanOrEqual(SIZE);
      expect(y).toBeGreaterThanOrEqual(0);
      expect(y).toBeLessThanOrEqual(SIZE);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// buildRadarDimensions — skipSat branches.
// The helper is the single source of truth for "should the chart show SAT".
// Cross-model review (Subagent A + outside voice) flagged that the previous
// commit claimed "skipSat for test-free schools" but never actually tested
// the branch logic. These tests fence each branch.
// ─────────────────────────────────────────────────────────────────────────────

const baseSchool: RadarSchoolInput = {
  testPolicy: "required",
  radarAcceptance: 60,
  radarInternational: 70,
  radarSAT: 80,
  radarCost: 50,
  radarAid: 65,
};

describe("buildRadarDimensions — skipSat branches", () => {
  it("includes SAT for testPolicy=required with SAT data (5 dims)", () => {
    const dims = buildRadarDimensions(baseSchool);
    expect(dims).toHaveLength(5);
    expect(dims.map((d) => d.label)).toContain("SAT");
  });

  it("includes SAT for testPolicy=optional with SAT data (5 dims)", () => {
    const dims = buildRadarDimensions({ ...baseSchool, testPolicy: "optional" });
    expect(dims).toHaveLength(5);
    expect(dims.map((d) => d.label)).toContain("SAT");
  });

  it("skips SAT when testPolicy=free (4 dims, no SAT axis)", () => {
    const dims = buildRadarDimensions({ ...baseSchool, testPolicy: "free" });
    expect(dims).toHaveLength(4);
    expect(dims.map((d) => d.label)).not.toContain("SAT");
  });

  it("skips SAT when testPolicy=blind (4 dims, no SAT axis)", () => {
    const dims = buildRadarDimensions({ ...baseSchool, testPolicy: "blind" });
    expect(dims).toHaveLength(4);
    expect(dims.map((d) => d.label)).not.toContain("SAT");
  });

  it("skips SAT when radarSAT is null even if testPolicy=required", () => {
    const dims = buildRadarDimensions({ ...baseSchool, radarSAT: null });
    expect(dims).toHaveLength(4);
    expect(dims.map((d) => d.label)).not.toContain("SAT");
  });

  it("preserves clockwise order: 录取, 国际生, [SAT,] 费用, 奖学金", () => {
    const fiveDim = buildRadarDimensions(baseSchool).map((d) => d.label);
    expect(fiveDim).toEqual(["录取", "国际生", "SAT", "费用", "奖学金"]);

    const fourDim = buildRadarDimensions({ ...baseSchool, testPolicy: "free" }).map(
      (d) => d.label,
    );
    expect(fourDim).toEqual(["录取", "国际生", "费用", "奖学金"]);
  });

  it("each dim carries its own legendLabel (no fragile mapping ladder)", () => {
    const dims = buildRadarDimensions(baseSchool);
    const byLabel = Object.fromEntries(dims.map((d) => [d.label, d.legendLabel]));
    expect(byLabel).toEqual({
      "录取": "录取友好度",
      "国际生": "国际生友好度",
      "SAT": "SAT 竞争力",
      "费用": "费用可负担度",
      "奖学金": "奖学金力度",
    });
  });

  it("null radar fields default to 0 (not undefined / NaN)", () => {
    const dims = buildRadarDimensions({
      testPolicy: "required",
      radarAcceptance: null,
      radarInternational: null,
      radarSAT: 80, // present so SAT is included
      radarCost: null,
      radarAid: null,
    });
    expect(dims).toHaveLength(5);
    for (const d of dims) {
      expect(typeof d.value).toBe("number");
      expect(Number.isNaN(d.value)).toBe(false);
    }
    // Non-SAT dims should be 0; SAT should be 80.
    const valByLabel = Object.fromEntries(dims.map((d) => [d.label, d.value]));
    expect(valByLabel["录取"]).toBe(0);
    expect(valByLabel["国际生"]).toBe(0);
    expect(valByLabel["SAT"]).toBe(80);
    expect(valByLabel["费用"]).toBe(0);
    expect(valByLabel["奖学金"]).toBe(0);
  });
});
