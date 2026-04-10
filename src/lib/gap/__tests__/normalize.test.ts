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

    // Sub-80 buckets added in PR #7 Round 3 (Gemini: 2.5 floor was too
    // optimistic for very low scores). New buckets: 70-79 → 2.8, 60-69 → 2.3,
    // <60 → 1.8. Rationale: in the Chinese education system 60% is the
    // pass line and <60% is failing — mapping those to a 2.5 GPA hid the
    // real gap for pre-vet applicants who need 3.0+ for every target.
    it("79 → 2.8 (one below 3.0-3.5 boundary, into 70-79 bucket)", () => {
      expect(normalizeChineseGpa(79, null)).toBe(2.8);
    });

    it("75 → 2.8 (70-79 bucket interior)", () => {
      expect(normalizeChineseGpa(75, null)).toBe(2.8);
    });

    it("70 → 2.8 (70-79 bucket lower boundary)", () => {
      expect(normalizeChineseGpa(70, null)).toBe(2.8);
    });

    it("69 → 2.3 (one below 70 boundary, into 60-69 bucket)", () => {
      expect(normalizeChineseGpa(69, null)).toBe(2.3);
    });

    it("60 → 2.3 (60-69 bucket lower boundary)", () => {
      expect(normalizeChineseGpa(60, null)).toBe(2.3);
    });

    it("59 → 1.8 (one below 60 boundary, failing territory)", () => {
      expect(normalizeChineseGpa(59, null)).toBe(1.8);
    });

    it("40 → 1.8 (deep failing)", () => {
      expect(normalizeChineseGpa(40, null)).toBe(1.8);
    });

    it("100 → 3.95 (max)", () => {
      expect(normalizeChineseGpa(100, null)).toBe(3.95);
    });

    it("0 → 1.8 (min valid, floor)", () => {
      expect(normalizeChineseGpa(0, null)).toBe(1.8);
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

    // PR #7 Round 3: rank path also got sub-bucket extension mirroring
    // the percentage path. New rank buckets:
    //   percentile >= 0.3  → 2.8  (top 70%)
    //   percentile >= 0.15 → 2.3  (top 85%)
    //   percentile <  0.15 → 1.8  (bottom 15%)
    it("'150/200' (percentile 0.255, top 75%) → 2.3", () => {
      // (200 - 150 + 1) / 200 = 0.255, lands in [0.15, 0.3) → 2.3
      expect(normalizeChineseGpa(null, "150/200")).toBe(2.3);
    });

    it("'140/200' (percentile 0.305) → 2.8 boundary", () => {
      // (200 - 140 + 1) / 200 = 0.305, lands in [0.3, 0.5) → 2.8
      expect(normalizeChineseGpa(null, "140/200")).toBe(2.8);
    });

    it("'170/200' (percentile 0.155) → 2.3 boundary", () => {
      // (200 - 170 + 1) / 200 = 0.155, lands in [0.15, 0.3) → 2.3
      expect(normalizeChineseGpa(null, "170/200")).toBe(2.3);
    });

    it("'190/200' (percentile 0.055, bottom 5%) → 1.8", () => {
      // (200 - 190 + 1) / 200 = 0.055, lands in [0, 0.15) → 1.8
      expect(normalizeChineseGpa(null, "190/200")).toBe(1.8);
    });

    it("'1/1000' → 3.95", () => {
      expect(normalizeChineseGpa(null, "1/1000")).toBe(3.95);
    });
  });

  // Regression fence for the small-class rank percentile bug flagged by
  // Codex, Gemini, and Copilot independently on PR #7. The old formula was
  // `percentile = 1 - rank/total`, which underestimates small classes:
  //   rank 1/1  → percentile 0 (!)  → bucket 2.5 (worst)
  //   rank 1/5  → percentile 0.8   → bucket 3.6
  //   rank 1/10 → percentile 0.9   → bucket 3.8
  // A first-place student in any small class was systematically downgraded.
  // The fix is to use an inclusive rank: `(total - rank + 1) / total`, which
  // maps rank 1 to percentile 1.0 regardless of class size, and never
  // changes existing large-class results (off by at most 1/total, well
  // inside every bucket boundary we test above).
  describe("classRank small-class edge cases (PR #7 rank formula regression)", () => {
    it("'1/1' → 3.95 (first in class of one is top bucket, not bottom)", () => {
      expect(normalizeChineseGpa(null, "1/1")).toBe(3.95);
    });

    it("'1/5' → 3.95 (first in class of five)", () => {
      expect(normalizeChineseGpa(null, "1/5")).toBe(3.95);
    });

    it("'1/10' → 3.95 (first in class of ten)", () => {
      expect(normalizeChineseGpa(null, "1/10")).toBe(3.95);
    });

    it("'2/10' → 3.8 (second in ten, inclusive top 20%)", () => {
      expect(normalizeChineseGpa(null, "2/10")).toBe(3.8);
    });

    it("'5/10' → 3.25 (median, inclusive top 60%)", () => {
      expect(normalizeChineseGpa(null, "5/10")).toBe(3.25);
    });

    it("'10/10' → 1.8 (last in class of ten, percentile 0.1 < 0.15 floor)", () => {
      // (10 - 10 + 1) / 10 = 0.1, new floor bucket
      expect(normalizeChineseGpa(null, "10/10")).toBe(1.8);
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
