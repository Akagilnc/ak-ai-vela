// Hardcoded recommendation templates keyed by `${dimensionId}:${severity}`.
//
// Why hardcoded and not LLM-generated:
//   - Deterministic: mom reads the same report twice and gets the same words.
//   - Offline: no network, no API key, no latency.
//   - Reviewable: all user-facing copy lives in one file so the founder can
//     audit tone in a single PR review instead of chasing strings across
//     seven dimension modules.
//   - Enforced by convention: dimension modules MUST call getRecommendation()
//     rather than inline strings (see ../types.ts Dimension contract note).
//
// Template keys are enumerated by the "recommendation coverage invariant"
// test in engine.test.ts — every (dimensionId, severity) combination must
// resolve to a non-empty string.

import type { GapSeverity } from "@/lib/types";

export interface RecommendationContext {
  current: number | null;
  target: { min: number; max: number } | null;
  schoolName: string;
  // Optional sub-case identifier. Used by dimensions that have multiple
  // no-data paths with different action prompts:
  //   - "international"       — student reports an IB/AP/A-Level system
  //                             we can't yet normalize (Phase 2 TBD)
  //   - "unknown"              — student explicitly picked "not sure"
  //   - "missing-data"         — student-side field is empty
  //   - "school-missing-data"  — database lacks the school-side field the
  //                              dimension needs (e.g. avgGPA, sat25th)
  //
  // The split between "missing-data" and "school-missing-data" matters
  // because the action is different: student-missing asks the user to
  // fill the form, school-missing flags a DB gap on our side and must
  // NOT blame the student. M3.5 #9 regression fence.
  reason?: "international" | "unknown" | "missing-data" | "school-missing-data" | "test-free";
}

type RecommendationFn = (ctx: RecommendationContext) => string;

export const RECOMMENDATIONS: Record<string, RecommendationFn> = {
  // ============================================================
  // GPA
  // ============================================================
  "gpa:excellent": () => "GPA 远超目标，这是你的优势项",
  "gpa:green": () => "GPA 已达目标范围，保持稳定即可",
  "gpa:yellow": (ctx) =>
    `GPA 接近 ${ctx.schoolName} 平均线，下学期重点提升 0.3-0.5 分，优先冲弱势科目`,
  "gpa:red": (ctx) =>
    `GPA 与 ${ctx.schoolName} 差距较大，建议下学期重点补强主科并考虑升学规划调整`,
  "gpa:no-data": (ctx) => {
    if (ctx.reason === "international") {
      return "国际课程成绩换算将在 Phase 2 支持，当前请补充等效百分制估算（可用学校 report card 的总评分）";
    }
    if (ctx.reason === "school-missing-data") {
      return `当前数据库暂缺 ${ctx.schoolName} 的 GPA 平均值，无法精确对比，我们会在后续版本补齐`;
    }
    return "补上百分制成绩或年级排名可以让报告更准";
  },

  // ============================================================
  // SAT
  // ============================================================
  "sat:excellent": () => "SAT 分数远超学校 75 分位，这是你的优势项",
  "sat:green": () => "SAT 分数已进入学校 75 分位以上，建议保持",
  "sat:yellow": (ctx) =>
    `SAT 分数在 ${ctx.schoolName} 25-75 分位区间，冲击 75 分位以上可大幅提升录取率`,
  "sat:red": (ctx) => {
    const gap =
      ctx.target && ctx.current != null ? ctx.target.min - ctx.current : null;
    return gap != null && gap > 0
      ? `SAT 距离 ${ctx.schoolName} 25 分位还差 ${gap} 分，建议集中补强数学或阅读薄弱模块`
      : `SAT 需要进一步提升以达到 ${ctx.schoolName} 最低录取范围`;
  },
  "sat:no-data": (ctx) => {
    if (ctx.reason === "test-free") {
      return "该校不要求 SAT 考试成绩，不影响你的申请";
    }
    if (ctx.reason === "school-missing-data") {
      return `当前数据库暂缺 ${ctx.schoolName} 的 SAT 分数段，无法精确对比，我们会在后续版本补齐`;
    }
    return "补上 SAT 或 ACT 分数可以让报告更准";
  },

  // ============================================================
  // ACT
  // ============================================================
  "act:excellent": () => "ACT 分数远超学校 75 分位，这是你的优势项",
  "act:green": () => "ACT 分数已进入学校 75 分位以上，建议保持",
  "act:yellow": (ctx) =>
    `ACT 分数在 ${ctx.schoolName} 25-75 分位区间，冲击 75 分位以上可大幅提升录取率`,
  "act:red": (ctx) => {
    const gap =
      ctx.target && ctx.current != null ? ctx.target.min - ctx.current : null;
    return gap != null && gap > 0
      ? `ACT 距离 ${ctx.schoolName} 25 分位还差 ${gap} 分，建议集中补强薄弱科目`
      : `ACT 需要进一步提升以达到 ${ctx.schoolName} 最低录取范围`;
  },
  "act:no-data": (ctx) => {
    if (ctx.reason === "test-free") {
      return "该校不要求 ACT 考试成绩，不影响你的申请";
    }
    if (ctx.reason === "school-missing-data") {
      return `当前数据库暂缺 ${ctx.schoolName} 的 ACT 分数段，无法精确对比，我们会在后续版本补齐`;
    }
    return "补上 ACT 或 SAT 分数可以让报告更准";
  },

  // ============================================================
  // Pre-vet Experience (animal hours)
  // ============================================================
  "prevet-experience:excellent": () =>
    "动科经历远超门槛，是申请中的亮眼加分项",
  "prevet-experience:green": () =>
    "动科 / pre-vet 相关经历时长充足（≥100 小时），是申请中的明显加分项",
  "prevet-experience:yellow": () =>
    "动科相关经历已达 40 小时，建议继续累积到 100 小时以强化 pre-vet 申请",
  "prevet-experience:red": () =>
    "动科相关经历不足 40 小时，pre-vet 申请中这是关键信号，建议尽快安排 shadowing 或实习",
  "prevet-experience:no-data": () =>
    "补上动科 / pre-vet 相关经历（volunteer / shadowing / 实习）可以让报告更准",
};

// Returns the rendered recommendation string, or null if no template matches.
// Null (rather than empty string) matches GapResult.action type and makes
// missing-template bugs visible in UI rendering.
//
// `severity` is typed as `GapSeverity` (not `string`) so that typos in
// dimension authors' calls become compile-time errors instead of runtime
// nulls. Per PR #7 Copilot review.
export function getRecommendation(
  dimensionId: string,
  severity: GapSeverity,
  ctx: RecommendationContext,
): string | null {
  const key = `${dimensionId}:${severity}`;
  const fn = RECOMMENDATIONS[key];
  return fn ? fn(ctx) : null;
}
