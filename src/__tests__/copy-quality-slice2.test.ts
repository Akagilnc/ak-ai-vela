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

// ---------------------------------------------------------------------------
// sat/act:yellow — no overclaimed causal "大幅提升录取率"
// Moving from 25-75th percentile to above 75th helps, but "大幅提升录取率"
// is not supportable across 26 schools with different selectivity profiles.
// At highly selective test-optional schools, standardized tests have diminishing
// marginal impact above baseline. Replace with scoped language.
// ---------------------------------------------------------------------------
describe("yellow recommendations: no overclaimed causal claim", () => {
  it("sat:yellow should not claim '大幅提升录取率'", () => {
    const text = RECOMMENDATIONS["sat:yellow"](baseCtx);
    expect(text).not.toContain("大幅提升录取率");
  });

  it("act:yellow should not claim '大幅提升录取率'", () => {
    const text = RECOMMENDATIONS["act:yellow"](baseCtx);
    expect(text).not.toContain("大幅提升录取率");
  });
});

// ---------------------------------------------------------------------------
// sat:red — no section-level prescription without section-level data
// The system collects total SAT score, not per-section (Math vs EBRW).
// Prescribing "数学或阅读" is fabricated specificity — the report doesn't
// know which section is weak. ACT:red correctly uses the generic "薄弱科目".
// ---------------------------------------------------------------------------
describe("sat:red: no section-prescription without section data", () => {
  it("sat:red should not prescribe '数学或阅读薄弱模块' (section unknown)", () => {
    const ctx = { ...baseCtx, current: 1350, target: { min: 1450, max: 1560 } };
    const text = RECOMMENDATIONS["sat:red"](ctx);
    expect(text).not.toContain("数学或阅读薄弱模块");
  });
});

// ---------------------------------------------------------------------------
// sat/act:red fallback — "最低录取范围" misrepresents 25th percentile
// The 25th percentile is not a hard floor; schools accept students below it.
// Framing it as "最低录取范围" overstates it as an absolute cutoff.
// ---------------------------------------------------------------------------
describe("red fallback: no false-floor '最低录取范围'", () => {
  it("sat:red fallback should not claim '最低录取范围'", () => {
    // Trigger the fallback by passing gap = 0 (edge: no positive gap to show)
    const ctx = { ...baseCtx, current: 1400, target: { min: 1400, max: 1550 } };
    const text = RECOMMENDATIONS["sat:red"](ctx);
    expect(text).not.toContain("最低录取范围");
  });

  it("act:red fallback should not claim '最低录取范围'", () => {
    const ctx = { ...baseCtx, current: 30, target: { min: 30, max: 35 } };
    const text = RECOMMENDATIONS["act:red"](ctx);
    expect(text).not.toContain("最低录取范围");
  });
});

// ---------------------------------------------------------------------------
// sat/act:green — "活动" should be "课外活动" for consistency with gpa:green
// gpa:green explicitly says "课外活动"; sat:green and act:green should match.
// Internal terminology split creates reader confusion when viewing the full
// report (all three dimensions appear on the same page).
// ---------------------------------------------------------------------------
describe("green recommendations: '课外活动' terminology consistent", () => {
  it("sat:green should say '课外活动' not just '活动'", () => {
    const text = RECOMMENDATIONS["sat:green"](baseCtx);
    expect(text).toContain("课外活动");
  });

  it("act:green should say '课外活动' not just '活动'", () => {
    const text = RECOMMENDATIONS["act:green"](baseCtx);
    expect(text).toContain("课外活动");
  });
});

// ---------------------------------------------------------------------------
// prevet:excellent — should include "/ pre-vet" qualifier consistent with
// all other prevet levels (green/yellow/red/no-data all reference "pre-vet").
// Omitting it at the excellent level creates asymmetry within the dimension.
// ---------------------------------------------------------------------------
describe("prevet:excellent: terminology matches other prevet levels", () => {
  it("prevet:excellent should reference 'pre-vet' (consistent with green/yellow/red)", () => {
    const text = RECOMMENDATIONS["prevet-experience:excellent"](baseCtx);
    expect(text).toContain("pre-vet");
  });
});

// ---------------------------------------------------------------------------
// sat/act:excellent — "活动" should be "课外活动" (same as sat/act:green)
// Round 1 fixed green but missed excellent — same-shape bug.
// All four green/excellent cases redirect effort to extracurriculars;
// terminology should be uniform across the dimension's upper tiers.
// ---------------------------------------------------------------------------
describe("excellent recommendations: '课外活动' terminology consistent", () => {
  it("sat:excellent should say '课外活动' not just '活动'", () => {
    const text = RECOMMENDATIONS["sat:excellent"](baseCtx);
    expect(text).toContain("课外活动");
  });

  it("act:excellent should say '课外活动' not just '活动'", () => {
    const text = RECOMMENDATIONS["act:excellent"](baseCtx);
    expect(text).toContain("课外活动");
  });
});

// ---------------------------------------------------------------------------
// prevet:yellow and prevet:red — must include "/ pre-vet" qualifier
// Round 1 fixed excellent/green but missed yellow and red.
// All four prevet severity levels should use consistent "动科 / pre-vet 相关经历"
// so the dimension label is immediately recognisable across the full report.
// ---------------------------------------------------------------------------
describe("prevet yellow/red: '/ pre-vet' qualifier consistent with excellent/green", () => {
  it("prevet:yellow should reference 'pre-vet'", () => {
    const text = RECOMMENDATIONS["prevet-experience:yellow"](baseCtx);
    expect(text).toContain("pre-vet");
  });

  it("prevet:red should reference 'pre-vet'", () => {
    const text = RECOMMENDATIONS["prevet-experience:red"](baseCtx);
    expect(text).toContain("pre-vet");
  });
});

// ---------------------------------------------------------------------------
// sat/act:no-data/free — no internal "维度" jargon in user copy
// "跳过这一维度的对比" exposes the internal dimension taxonomy to parents
// who think in terms of test scores, not report "dimensions".
// ---------------------------------------------------------------------------
describe("test-free no-data: no internal '维度' jargon", () => {
  const testFreeCtx2: RecommendationContext = { ...baseCtx, reason: "test-free" };

  it("sat test-free should not say '这一维度'", () => {
    expect(RECOMMENDATIONS["sat:no-data"](testFreeCtx2)).not.toContain("这一维度");
  });

  it("act test-free should not say '这一维度'", () => {
    expect(RECOMMENDATIONS["act:no-data"](testFreeCtx2)).not.toContain("这一维度");
  });
});

// ---------------------------------------------------------------------------
// sat/act:yellow — "劣势" misframes the 25-75th percentile range
// Being in the 25-75th range is not a "劣势" (disadvantage) — it is a
// competitive but not top-tier position. "劣势" implies weakness where
// the student is actually in the normal admission window.
// ---------------------------------------------------------------------------
describe("yellow recommendations: no '劣势' misframing", () => {
  it("sat:yellow should not use '劣势' (25-75th percentile is not a disadvantage)", () => {
    const text = RECOMMENDATIONS["sat:yellow"](baseCtx);
    expect(text).not.toContain("劣势");
  });

  it("act:yellow should not use '劣势'", () => {
    const text = RECOMMENDATIONS["act:yellow"](baseCtx);
    expect(text).not.toContain("劣势");
  });
});

// ---------------------------------------------------------------------------
// prevet:green — no false external "基本要求" claim
// "已满足主流 pre-vet 项目的基本要求" asserts an external documented
// requirement standard. Undergraduate pre-vet tracks do not have a
// gated animal-hours admission requirement; the 100h threshold is an
// internal product benchmark. Replace with a claim the report can own:
// the hours are enough to write about in a college application essay.
// ---------------------------------------------------------------------------
describe("prevet:green: no false external requirement claim", () => {
  it("prevet:green should not claim '已满足...基本要求' (no such documented standard)", () => {
    const text = RECOMMENDATIONS["prevet-experience:green"](baseCtx);
    expect(text).not.toContain("已满足");
  });
});

// ---------------------------------------------------------------------------
// prevet:yellow — no scope confusion between undergrad app and DVM admission
// "主流兽医学院申请" (applying to vet school) is a different stage from
// the undergraduate college application this product tracks. The copy
// should frame 100h in the undergrad application context, not DVM context.
// ---------------------------------------------------------------------------
describe("prevet:yellow: no '兽医学院' DVM-admissions scope confusion", () => {
  it("prevet:yellow should not reference '兽医学院申请' (conflates undergrad with DVM)", () => {
    const text = RECOMMENDATIONS["prevet-experience:yellow"](baseCtx);
    expect(text).not.toContain("兽医学院申请");
  });
});

// ---------------------------------------------------------------------------
// no-data/school-missing: no "维度" internal jargon in reassurance sentence
// Round 2 fixed "跳过这一维度的对比" for test-free cases.
// The parallel reassurance "其余维度的报告不受影响" in school-missing cases
// has the same jargon problem — "维度" is internal taxonomy, not parent language.
// Replace with "其余项目的报告不受影响" across all three dimensions.
// ---------------------------------------------------------------------------
describe("no-data/school-missing: no '维度' jargon in reassurance", () => {
  it("gpa school-missing should say '其余项目' not '其余维度'", () => {
    expect(RECOMMENDATIONS["gpa:no-data"](schoolMissingCtx)).not.toContain("其余维度");
  });

  it("sat school-missing should say '其余项目' not '其余维度'", () => {
    expect(RECOMMENDATIONS["sat:no-data"](schoolMissingCtx)).not.toContain("其余维度");
  });

  it("act school-missing should say '其余项目' not '其余维度'", () => {
    expect(RECOMMENDATIONS["act:no-data"](schoolMissingCtx)).not.toContain("其余维度");
  });
});

// ---------------------------------------------------------------------------
// prevet:yellow — "有明显帮助" is an ungrounded effect claim
// Round 2 reframed prevet:yellow away from DVM scope confusion, but
// "对 pre-vet 方向的本科申请有明显帮助" still makes a vague effectiveness
// promise. Replace with a concrete mechanism: 100h can be cited as
// documented evidence in a college application essay.
// ---------------------------------------------------------------------------
describe("prevet:yellow: no vague '有明显帮助' effect claim", () => {
  it("prevet:yellow should not claim '有明显帮助' without specifying the mechanism", () => {
    const text = RECOMMENDATIONS["prevet-experience:yellow"](baseCtx);
    expect(text).not.toContain("有明显帮助");
  });
});

// ---------------------------------------------------------------------------
// prevet:red — no "竞争力弱" diagnostic label before the action
// gpa:red / sat:red / act:red all go straight to action ("建议下学期…"
// "建议集中补强…"). prevet:red alone inserts a mid-sentence assessment
// ("pre-vet 申请竞争力弱") before the action, creating structural
// inconsistency. The state (< 40 hours) already implies the diagnosis;
// the label adds no information and breaks tone parity.
// ---------------------------------------------------------------------------
describe("prevet:red: no diagnostic '竞争力弱' label (action-first like other red copies)", () => {
  it("prevet:red should not contain '竞争力弱' (diagnostic label inconsistent with other red copies)", () => {
    const text = RECOMMENDATIONS["prevet-experience:red"](baseCtx);
    expect(text).not.toContain("竞争力弱");
  });
});

// ---------------------------------------------------------------------------
// gpa:yellow — no hardcoded "0.3-0.5 分" delta
// The specific range is not derived from the actual gap. For a student 0.05
// below the average, "提升 0.3-0.5" over-prescribes effort. For a student
// 0.8 below, it under-prescribes. The number should be removed or derived.
// ---------------------------------------------------------------------------
describe("gpa:yellow: no false-precise hardcoded delta", () => {
  it("gpa:yellow should not prescribe a hardcoded '0.3-0.5 分' delta", () => {
    const text = RECOMMENDATIONS["gpa:yellow"](baseCtx);
    expect(text).not.toContain("0.3-0.5 分");
  });
});
