import { describe, it, expect } from "vitest";

// Test the radar chart geometry functions independently
// (extracted logic from the component for testability)

const SIDES = 5;
const SIZE = 240;
const CENTER = SIZE / 2;
const RADIUS = 90;

function polarToCartesian(
  angle: number,
  radius: number
): [number, number] {
  const rad = ((angle - 90) * Math.PI) / 180;
  return [CENTER + radius * Math.cos(rad), CENTER + radius * Math.sin(rad)];
}

function getAngles(): number[] {
  return Array.from({ length: SIDES }, (_, i) => (360 / SIDES) * i);
}

describe("RadarChart geometry", () => {
  it("generates correct number of angles", () => {
    const angles = getAngles();
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
    const angles = getAngles();
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
    const angles = getAngles();
    for (const a of angles) {
      const [x, y] = polarToCartesian(a, RADIUS);
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThanOrEqual(SIZE);
      expect(y).toBeGreaterThanOrEqual(0);
      expect(y).toBeLessThanOrEqual(SIZE);
    }
  });
});
