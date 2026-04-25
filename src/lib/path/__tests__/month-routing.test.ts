import { describe, it, expect } from "vitest";
import { resolveMonth, monthSeason, pillRange } from "../month-routing";

// ─────────────────────────────────────────────────────────────────────────────
// resolveMonth
// ─────────────────────────────────────────────────────────────────────────────
//
// Three-arg signature makes the function deterministic under test:
//   resolveMonth(rawParam, availableMonths, currentMonth?)
// currentMonth defaults to new Date().getMonth() + 1 in production.

describe("resolveMonth — no param (default routing)", () => {
  it("returns null when no data exists", () => {
    expect(resolveMonth(undefined, [], 5)).toBeNull();
  });

  it("returns current month when it has data", () => {
    expect(resolveMonth(undefined, [5, 6], 5)).toBe(5);
    expect(resolveMonth(undefined, [5, 6], 6)).toBe(6);
  });

  it("falls back to most-recent month when current month has no data", () => {
    // current = 4 (April), only 5 available → return 5
    expect(resolveMonth(undefined, [5], 4)).toBe(5);
    // current = 7, available [5, 6] → return 6 (highest)
    expect(resolveMonth(undefined, [5, 6], 7)).toBe(6);
  });

  it("returns the only available month regardless of current month", () => {
    expect(resolveMonth(undefined, [5], 1)).toBe(5);
    expect(resolveMonth(undefined, [5], 12)).toBe(5);
  });
});

describe("resolveMonth — explicit param", () => {
  it("returns the requested month when available", () => {
    expect(resolveMonth("5", [5, 6], 1)).toBe(5);
    expect(resolveMonth("6", [5, 6], 1)).toBe(6);
  });

  it("returns null when requested month has no data", () => {
    expect(resolveMonth("7", [5, 6], 1)).toBeNull();
    expect(resolveMonth("1", [5, 6], 1)).toBeNull();
  });

  it("returns null for out-of-range month numbers", () => {
    expect(resolveMonth("0", [5, 6], 1)).toBeNull();
    expect(resolveMonth("13", [5, 6], 1)).toBeNull();
  });

  it("returns null for non-numeric strings", () => {
    expect(resolveMonth("abc", [5, 6], 1)).toBeNull();
    expect(resolveMonth("", [5, 6], 1)).toBeNull();
    expect(resolveMonth("  ", [5, 6], 1)).toBeNull();
  });

  it("returns null for decimal strings (only integers allowed)", () => {
    // "5.5" looks like 5 to parseInt — we want strict rejection
    expect(resolveMonth("5.5", [5, 6], 1)).toBeNull();
    expect(resolveMonth("6.0", [5, 6], 1)).toBeNull();
  });

  it("handles edge months 1 and 12 when available", () => {
    expect(resolveMonth("1", [1, 12], 6)).toBe(1);
    expect(resolveMonth("12", [1, 12], 6)).toBe(12);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// monthSeason
// ─────────────────────────────────────────────────────────────────────────────

describe("monthSeason", () => {
  it("returns the correct Chinese season label for May", () => {
    expect(monthSeason(5)).toBe("春末夏初");
  });

  it("returns the correct label for June", () => {
    expect(monthSeason(6)).toBe("初夏");
  });

  it("covers all 12 months without throwing", () => {
    for (let m = 1; m <= 12; m++) {
      expect(typeof monthSeason(m)).toBe("string");
      expect(monthSeason(m).length).toBeGreaterThan(0);
    }
  });

  it("returns a fallback string for out-of-range input", () => {
    // Should not throw; returns something displayable
    expect(typeof monthSeason(0)).toBe("string");
    expect(typeof monthSeason(13)).toBe("string");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// pillRange
// ─────────────────────────────────────────────────────────────────────────────
//
// pillRange(availableMonths) returns the month numbers to render in the
// horizontal pill row. Always includes all available months plus a 2-wide
// ghost buffer on each side, clamped to [1, 12]. Minimum width = 4 pills
// so the row never looks empty.

describe("pillRange", () => {
  it("includes available months in the range", () => {
    const range = pillRange([5]);
    expect(range).toContain(5);
  });

  it("adds ghost buffer of 2 on each side", () => {
    const range = pillRange([5]);
    // Buffer left: 3, 4; buffer right: 6, 7
    expect(range).toContain(3);
    expect(range).toContain(4);
    expect(range).toContain(6);
    expect(range).toContain(7);
  });

  it("clamps to valid months [1, 12]", () => {
    const range = pillRange([1]);
    expect(range.every((m) => m >= 1 && m <= 12)).toBe(true);
    const rangeHigh = pillRange([12]);
    expect(rangeHigh.every((m) => m >= 1 && m <= 12)).toBe(true);
  });

  it("returns a sorted, deduplicated range", () => {
    const range = pillRange([5, 6]);
    expect(range).toEqual([...range].sort((a, b) => a - b));
    expect(new Set(range).size).toBe(range.length);
  });

  it("returns at least 4 pills even for a single month", () => {
    expect(pillRange([5]).length).toBeGreaterThanOrEqual(4);
  });

  it("extends range to MIN_PILLS when buffer is clipped by calendar boundaries", () => {
    // month 1: natural buffer gives [1,2,3] = 3 pills → must extend to ≥ 4
    expect(pillRange([1]).length).toBeGreaterThanOrEqual(4);
    expect(pillRange([1])).toContain(1);
    // month 12: natural buffer gives [10,11,12] = 3 pills → must extend to ≥ 4
    expect(pillRange([12]).length).toBeGreaterThanOrEqual(4);
    expect(pillRange([12])).toContain(12);
  });

  it("returns empty array for empty input", () => {
    expect(pillRange([])).toEqual([]);
  });

  it("merges two available months with overlapping buffers correctly", () => {
    // [5, 6] with buffer 2 each side: 3..8 → 6 pills
    const range = pillRange([5, 6]);
    expect(range).toEqual([3, 4, 5, 6, 7, 8]);
  });
});
