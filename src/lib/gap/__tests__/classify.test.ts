import { describe, it, expect } from "vitest";
import type { GapResult } from "@/lib/types";
import { classifySchools } from "../classify";
import { makeSchool } from "./helpers/make-school";

// Helper to create a GapResult with a given severity
function gap(severity: GapResult["severity"], dimension = "gpa"): GapResult {
  return {
    dimension,
    label: dimension.toUpperCase(),
    current: null,
    target: null,
    normalized: null,
    severity,
    action: null,
  };
}

describe("classifySchools — tier classification", () => {
  it("all-green school → match (100% positive)", () => {
    const school = makeSchool({ id: "s1" });
    const results = new Map([["s1", [gap("green"), gap("green"), gap("green")]]]);
    const { match, reach, possible } = classifySchools(results, [school]);
    expect(match).toHaveLength(1);
    expect(match[0].tier).toBe("match");
    expect(reach).toHaveLength(0);
    expect(possible).toHaveLength(0);
  });

  it("excellent + green mix → match (both count as positive)", () => {
    const school = makeSchool({ id: "s1" });
    const results = new Map([["s1", [gap("excellent"), gap("green"), gap("yellow")]]]);
    const { match } = classifySchools(results, [school]);
    // 2 positive out of 3 comparable = 67% >= 60%
    expect(match).toHaveLength(1);
  });

  it("test-free school: 2 green + 2 no-data → match (2/2 comparable = 100%)", () => {
    const school = makeSchool({ id: "ucd" });
    const results = new Map([["ucd", [
      gap("green", "gpa"),
      gap("no-data", "sat"),
      gap("no-data", "act"),
      gap("green", "prevet-experience"),
    ]]]);
    const { match } = classifySchools(results, [school]);
    expect(match).toHaveLength(1);
    expect(match[0].schoolId).toBe("ucd");
  });

  it("non-prevet 3 dims all green → match (3/3 = 100%)", () => {
    const school = makeSchool({ id: "s1" });
    const results = new Map([["s1", [gap("green"), gap("green"), gap("green")]]]);
    const { match } = classifySchools(results, [school]);
    expect(match).toHaveLength(1);
  });

  it("2 red out of 3 comparable → reach (67% red >= 50%)", () => {
    const school = makeSchool({ id: "s1" });
    const results = new Map([["s1", [gap("red"), gap("red"), gap("green")]]]);
    const { match, reach } = classifySchools(results, [school]);
    expect(match).toHaveLength(0);
    expect(reach).toHaveLength(1);
    expect(reach[0].tier).toBe("reach");
  });

  it("mixed results → possible", () => {
    const school = makeSchool({ id: "s1" });
    // 1 green, 1 yellow, 1 red out of 3: positive=33% < 60%, red=33% < 50%
    const results = new Map([["s1", [gap("green"), gap("yellow"), gap("red")]]]);
    const { possible } = classifySchools(results, [school]);
    expect(possible).toHaveLength(1);
  });

  it("all no-data (comparable === 0) → possible", () => {
    const school = makeSchool({ id: "s1" });
    const results = new Map([["s1", [gap("no-data"), gap("no-data")]]]);
    const { possible } = classifySchools(results, [school]);
    expect(possible).toHaveLength(1);
  });
});

describe("classifySchools — sort stability", () => {
  it("within tier: higher positive count first", () => {
    const s1 = makeSchool({ id: "s1" });
    const s2 = makeSchool({ id: "s2" });
    const results = new Map([
      ["s1", [gap("green"), gap("green"), gap("yellow")]],    // 2 positive
      ["s2", [gap("green"), gap("green"), gap("green")]],     // 3 positive
    ]);
    const { match } = classifySchools(results, [s1, s2]);
    expect(match[0].schoolId).toBe("s2"); // 3 positive first
    expect(match[1].schoolId).toBe("s1");
  });

  it("tie-breaker uses school.id codepoint", () => {
    const s1 = makeSchool({ id: "aaa" });
    const s2 = makeSchool({ id: "bbb" });
    const results = new Map([
      ["bbb", [gap("green"), gap("green"), gap("green")]],
      ["aaa", [gap("green"), gap("green"), gap("green")]],
    ]);
    const { match } = classifySchools(results, [s1, s2]);
    expect(match[0].schoolId).toBe("aaa"); // alphabetically first
    expect(match[1].schoolId).toBe("bbb");
  });
});
