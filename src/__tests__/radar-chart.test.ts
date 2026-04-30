import { describe, it, expect } from "vitest";
import {
  SIZE,
  CENTER,
  RADIUS,
  polarToCartesian,
  getAngles,
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
