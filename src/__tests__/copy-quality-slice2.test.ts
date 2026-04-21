/**
 * Copy quality — Slice 2: Gap recommendations
 *
 * Tests assert the DESIRED state. They fail against the current copy,
 * and pass once the copy is fixed.
 *
 * Three quality standards (content-quality-three-standards learning):
 *   1. Data correct — what we promise must be real
 *   2. Reasoning valid — every claim has a causal chain
 *   3. No AI slop — zero-information sentences removed
 */

import { describe, it, expect } from "vitest";
import { RECOMMENDATIONS } from "@/lib/gap/recommendations";
import type { RecommendationContext } from "@/lib/gap/recommendations";

const baseCtx: RecommendationContext = {
  current: 100,
  target: { min: 90, max: 110 },
  schoolName: "MIT",
};

const schoolMissingCtx: RecommendationContext = {
  ...baseCtx,
  reason: "school-missing-data",
};

const internationalCtx: RecommendationContext = {
  ...baseCtx,
  reason: "international",
};

// ---------------------------------------------------------------------------
// Excellent copies: no AI-slop meta-label tail "这是你的优势项"
// The student already knows it's excellent — the label adds zero information.
// Replace with actionable copy specific to each dimension.
// ---------------------------------------------------------------------------
describe("excellent recommendations (no AI-slop tail)", () => {
  it("gpa:excellent should not end with '，这是你的优势项'", () => {
    const text = RECOMMENDATIONS["gpa:excellent"](baseCtx);
    expect(text).not.toMatch(/，这是你的优势项$/);
  });

  it("sat:excellent should not end with '，这是你的优势项'", () => {
    const text = RECOMMENDATIONS["sat:excellent"](baseCtx);
    expect(text).not.toMatch(/，这是你的优势项$/);
  });

  it("act:excellent should not end with '，这是你的优势项'", () => {
    const text = RECOMMENDATIONS["act:excellent"](baseCtx);
    expect(text).not.toMatch(/，这是你的优势项$/);
  });
});

// ---------------------------------------------------------------------------
// Excellent copies: dimension-specific content
// GPA (long-term academic record) should be meaningfully different from
// standardized test scores (single-event metric). A reviewer who swaps
// gpa:excellent and sat:excellent labels should immediately notice.
// ---------------------------------------------------------------------------
describe("excellent recommendations (dimension-specific)", () => {
  it("gpa:excellent should be distinct from sat:excellent", () => {
    const gpa = RECOMMENDATIONS["gpa:excellent"](baseCtx);
    const sat = RECOMMENDATIONS["sat:excellent"](baseCtx);
    expect(gpa).not.toEqual(sat);
  });

  it("gpa:excellent should reference GPA or academic performance specifically", () => {
    const text = RECOMMENDATIONS["gpa:excellent"](baseCtx);
    expect(text).toMatch(/GPA|成绩|学业/);
  });

  it("sat:excellent should reference SAT test score context specifically", () => {
    const text = RECOMMENDATIONS["sat:excellent"](baseCtx);
    expect(text).toMatch(/SAT/);
  });

  it("act:excellent should reference ACT test score context specifically", () => {
    const text = RECOMMENDATIONS["act:excellent"](baseCtx);
    expect(text).toMatch(/ACT/);
  });
});

// ---------------------------------------------------------------------------
// school-missing-data: no backend jargon
// "数据库" is an internal engineering term — users should not see it.
// "后续版本补齐" is a roadmap promise that the app cannot keep precisely.
// Both damage trust when exposed in user-facing copy.
// ---------------------------------------------------------------------------
describe("school-missing-data: no backend jargon in rendered copy", () => {
  it("gpa school-missing should not expose '数据库'", () => {
    expect(RECOMMENDATIONS["gpa:no-data"](schoolMissingCtx)).not.toContain(
      "数据库",
    );
  });

  it("gpa school-missing should not promise '后续版本补齐'", () => {
    expect(RECOMMENDATIONS["gpa:no-data"](schoolMissingCtx)).not.toContain(
      "后续版本",
    );
  });

  it("sat school-missing should not expose '数据库'", () => {
    expect(RECOMMENDATIONS["sat:no-data"](schoolMissingCtx)).not.toContain(
      "数据库",
    );
  });

  it("sat school-missing should not promise '后续版本补齐'", () => {
    expect(RECOMMENDATIONS["sat:no-data"](schoolMissingCtx)).not.toContain(
      "后续版本",
    );
  });

  it("act school-missing should not expose '数据库'", () => {
    expect(RECOMMENDATIONS["act:no-data"](schoolMissingCtx)).not.toContain(
      "数据库",
    );
  });

  it("act school-missing should not promise '后续版本补齐'", () => {
    expect(RECOMMENDATIONS["act:no-data"](schoolMissingCtx)).not.toContain(
      "后续版本",
    );
  });
});

// ---------------------------------------------------------------------------
// prevet-experience: no slop meta-label tails (same shape as "优势项")
// "是申请中的亮眼加分项" and "是申请中的明显加分项" are meta-labels, not action.
// The student already knows their hours are excellent/sufficient — they need
// to know what to DO with that fact, not be told it's a plus.
// ---------------------------------------------------------------------------
describe("prevet-experience excellent/green: no slop meta-label", () => {
  it("prevet-experience:excellent should not end with '加分项'", () => {
    const text = RECOMMENDATIONS["prevet-experience:excellent"](baseCtx);
    expect(text).not.toMatch(/加分项$/);
  });

  it("prevet-experience:green should not end with '加分项'", () => {
    const text = RECOMMENDATIONS["prevet-experience:green"](baseCtx);
    expect(text).not.toMatch(/加分项$/);
  });
});

// ---------------------------------------------------------------------------
// green copies: not pure restatement — must give a "where to put energy" hint
// ---------------------------------------------------------------------------
describe("green recommendations: not pure restatement", () => {
  it("gpa:green should not say only '保持稳定即可' with no direction", () => {
    const text = RECOMMENDATIONS["gpa:green"](baseCtx);
    // Must give at least a hint beyond "keep it up"
    expect(text).not.toBe("GPA 已达目标范围，保持稳定即可");
  });

  it("sat:green should not say only '建议保持' with no direction", () => {
    const text = RECOMMENDATIONS["sat:green"](baseCtx);
    expect(text).not.toMatch(/建议保持$/);
  });

  it("act:green should not say only '建议保持' with no direction", () => {
    const text = RECOMMENDATIONS["act:green"](baseCtx);
    expect(text).not.toMatch(/建议保持$/);
  });
});

// ---------------------------------------------------------------------------
// prevet:red — no meta-label "这是关键信号"
// ---------------------------------------------------------------------------
describe("prevet-experience:red: no meta-label", () => {
  it("should not contain '关键信号' (meta-description, zero information)", () => {
    const text = RECOMMENDATIONS["prevet-experience:red"](baseCtx);
    expect(text).not.toContain("关键信号");
  });
});

// ---------------------------------------------------------------------------
// gpa:red — no vague "升学规划调整"
// ---------------------------------------------------------------------------
describe("gpa:red: no vague action", () => {
  it("should not contain '考虑升学规划调整' (not executable)", () => {
    const text = RECOMMENDATIONS["gpa:red"]({
      ...baseCtx,
      schoolName: "MIT",
    });
    expect(text).not.toContain("考虑升学规划调整");
  });
});

// ---------------------------------------------------------------------------
// test-free no-data: "不影响你的申请" is false for test-optional schools
// Replace with copy scoped to what the report does, not what schools do
// ---------------------------------------------------------------------------
describe("test-free no-data: scoped to report, not application outcome", () => {
  const testFreeCtx: RecommendationContext = {
    ...baseCtx,
    reason: "test-free",
  };

  it("sat test-free should not claim '不影响你的申请'", () => {
    expect(RECOMMENDATIONS["sat:no-data"](testFreeCtx)).not.toContain(
      "不影响你的申请",
    );
  });

  it("act test-free should not claim '不影响你的申请'", () => {
    expect(RECOMMENDATIONS["act:no-data"](testFreeCtx)).not.toContain(
      "不影响你的申请",
    );
  });
});

// ---------------------------------------------------------------------------
// gpa:no-data default — "年级排名" is a dead end (system only accepts 百分制)
// ---------------------------------------------------------------------------
describe("gpa:no-data default: no misleading '年级排名'", () => {
  it("should not suggest '年级排名' as input option", () => {
    const text = RECOMMENDATIONS["gpa:no-data"](baseCtx);
    expect(text).not.toContain("年级排名");
  });
});

// ---------------------------------------------------------------------------
// international no-data: no roadmap leaks
// "Phase 2" is internal product planning language — it creates confusion and
// distrust when shown to users who have no context for what "Phase 2" means.
// ---------------------------------------------------------------------------
describe("international no-data: no roadmap leaks", () => {
  it("gpa international should not mention 'Phase'", () => {
    const text = RECOMMENDATIONS["gpa:no-data"](internationalCtx);
    expect(text).not.toContain("Phase");
  });

  it("gpa international should still give actionable guidance (mention estimate input)", () => {
    const text = RECOMMENDATIONS["gpa:no-data"](internationalCtx);
    // User needs to know what to do: fill in an equivalent score estimate
    expect(text).toMatch(/估算|填/);
  });
});
