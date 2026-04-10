import { describe, it, expect } from "vitest";
import { normalizeChineseGpa } from "../normalize";

describe("normalizeChineseGpa", () => {
  describe("percentage path (CEO plan midpoint table)", () => {
    it("95 → 3.95 (top bucket boundary)", () => {
      expect(normalizeChineseGpa(95, null)).toBe(3.95);
    });

    it("94 → 3.8 (one below top boundary)", () => {
      expect(normalizeChineseGpa(94, null)).toBe(3.8);
    });

    it("90 → 3.8 (3.7-3.9 bucket boundary)", () => {
      expect(normalizeChineseGpa(90, null)).toBe(3.8);
    });

    it("89 → 3.6 (one below 3.7-3.9 boundary)", () => {
      expect(normalizeChineseGpa(89, null)).toBe(3.6);
    });

    it("85 → 3.6 (3.5-3.7 bucket boundary)", () => {
      expect(normalizeChineseGpa(85, null)).toBe(3.6);
    });

    it("84 → 3.25 (one below 3.5-3.7 boundary)", () => {
      expect(normalizeChineseGpa(84, null)).toBe(3.25);
    });

    it("80 → 3.25 (3.0-3.5 bucket boundary)", () => {
      expect(normalizeChineseGpa(80, null)).toBe(3.25);
    });

    it("79 → 2.5 (one below 3.0-3.5 boundary)", () => {
      expect(normalizeChineseGpa(79, null)).toBe(2.5);
    });

    it("75 → 2.5 (clearly below)", () => {
      expect(normalizeChineseGpa(75, null)).toBe(2.5);
    });

    it("100 → 3.95 (max)", () => {
      expect(normalizeChineseGpa(100, null)).toBe(3.95);
    });

    it("0 → 2.5 (min valid)", () => {
      expect(normalizeChineseGpa(0, null)).toBe(2.5);
    });
  });

  describe("invalid percentage guards", () => {
    it("negative percentage → null (explicit guard)", () => {
      expect(normalizeChineseGpa(-5, null)).toBe(null);
    });

    it("percentage > 100 → null (explicit guard)", () => {
      expect(normalizeChineseGpa(105, null)).toBe(null);
    });

    it("NaN → null", () => {
      expect(normalizeChineseGpa(Number.NaN, null)).toBe(null);
    });

    it("Infinity → null", () => {
      expect(normalizeChineseGpa(Number.POSITIVE_INFINITY, null)).toBe(null);
    });
  });

  describe("classRank fallback", () => {
    it("'5/200' (top 2.5%) → 3.95", () => {
      expect(normalizeChineseGpa(null, "5/200")).toBe(3.95);
    });

    it("'20/200' (top 10%) → 3.8", () => {
      expect(normalizeChineseGpa(null, "20/200")).toBe(3.8);
    });

    it("'50/200' (top 25%) → 3.6", () => {
      expect(normalizeChineseGpa(null, "50/200")).toBe(3.6);
    });

    it("'100/200' (top 50%) → 3.25", () => {
      expect(normalizeChineseGpa(null, "100/200")).toBe(3.25);
    });

    it("'150/200' (top 75%, percentile 0.25) → 2.5", () => {
      expect(normalizeChineseGpa(null, "150/200")).toBe(2.5);
    });

    it("'1/1000' → 3.95", () => {
      expect(normalizeChineseGpa(null, "1/1000")).toBe(3.95);
    });
  });

  describe("classRank parse guards", () => {
    it("'abc' → null", () => {
      expect(normalizeChineseGpa(null, "abc")).toBe(null);
    });

    it("inverted '200/5' (rank > total) → null", () => {
      expect(normalizeChineseGpa(null, "200/5")).toBe(null);
    });

    it("zero total '5/0' → null", () => {
      expect(normalizeChineseGpa(null, "5/0")).toBe(null);
    });

    it("empty string → null", () => {
      expect(normalizeChineseGpa(null, "")).toBe(null);
    });

    it("missing numerator '/200' → null", () => {
      expect(normalizeChineseGpa(null, "/200")).toBe(null);
    });

    it("negative rank '-5/200' → null", () => {
      expect(normalizeChineseGpa(null, "-5/200")).toBe(null);
    });

    it("whitespace around numbers '  5  /  200  ' → parses to 3.95", () => {
      expect(normalizeChineseGpa(null, "  5  /  200  ")).toBe(3.95);
    });
  });

  describe("precedence and missing data", () => {
    it("both present → prefers percentage", () => {
      // percentage=90 → 3.8 (not the classRank value)
      expect(normalizeChineseGpa(90, "199/200")).toBe(3.8);
    });

    it("neither present → null", () => {
      expect(normalizeChineseGpa(null, null)).toBe(null);
    });

    it("both undefined → null", () => {
      expect(normalizeChineseGpa(undefined, undefined)).toBe(null);
    });

    it("percentage null, classRank undefined → null", () => {
      expect(normalizeChineseGpa(null, undefined)).toBe(null);
    });
  });
});
