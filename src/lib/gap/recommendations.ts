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
  "gpa:excellent": () => "GPA 远超学校平均线，申请文书里可以把成绩作为支撑点主动突出",
  "gpa:green": () => "GPA 已达目标范围，主科可以收尾，精力转向课外活动和文书",
  "gpa:yellow": (ctx) =>
    `GPA 接近 ${ctx.schoolName} 平均线，下学期重点提升 0.3-0.5 分，优先冲弱势科目`,
  "gpa:red": (ctx) =>
    `GPA 与 ${ctx.schoolName} 差距较大，建议下学期优先提升主科，同时在目标校列表中补充 GPA 匹配度更高的学校`,
  "gpa:no-data": (ctx) => {
    if (ctx.reason === "international") {
      return "国际课程成绩暂不支持换算，可以在备注里填入等效百分制估算（参考学校 report card 的总评分）";
    }
    if (ctx.reason === "school-missing-data") {
      return `暂无 ${ctx.schoolName} 的 GPA 参考数据，这项跳过，其余维度的报告不受影响`;
    }
    return "补上百分制成绩可以让报告更准";
  },

  // ============================================================
  // SAT
  // ============================================================
  "sat:excellent": () => "SAT 超过学校 75 分位线，标化成绩不是软肋，精力可以放在活动和文书",
  "sat:green": () => "SAT 已进学校 75 分位以上，标化可以收尾，精力转向活动和文书",
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
      // "test-free" reason must only be set for schools with a genuine
      // test-blind / test-free policy (not test-optional). If you expand
      // this to cover test-optional schools, the copy below will mislead.
      return "该校 SAT 成绩非必须，跳过这一维度的对比";
    }
    if (ctx.reason === "school-missing-data") {
      return `暂无 ${ctx.schoolName} 的 SAT 分数段参考，这项跳过，其余维度的报告不受影响`;
    }
    return "补上 SAT 或 ACT 分数可以让报告更准";
  },

  // ============================================================
  // ACT
  // ============================================================
  "act:excellent": () => "ACT 超过学校 75 分位线，标化成绩不是软肋，精力可以放在活动和文书",
  "act:green": () => "ACT 已进学校 75 分位以上，标化可以收尾，精力转向活动和文书",
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
      // Same constraint as SAT test-free: only bind this reason to
      // genuinely test-blind schools, not test-optional ones.
      return "该校 ACT 成绩非必须，跳过这一维度的对比";
    }
    if (ctx.reason === "school-missing-data") {
      return `暂无 ${ctx.schoolName} 的 ACT 分数段参考，这项跳过，其余维度的报告不受影响`;
    }
    return "补上 ACT 或 SAT 分数可以让报告更准";
  },

  // ============================================================
  // Pre-vet Experience (animal hours)
  // ============================================================
  "prevet-experience:excellent": () =>
    "动科经历远超录取门槛，申请文书里值得专门辟一节来写",
  "prevet-experience:green": () =>
    "动科 / pre-vet 相关经历达 100 小时以上，已满足主流 pre-vet 项目的基本要求",
  "prevet-experience:yellow": () =>
    "动科相关经历已达 40 小时，主流兽医学院申请建议达到 100 小时以上，继续累积来强化 pre-vet 申请",
  "prevet-experience:red": () =>
    "动科相关经历不足 40 小时，pre-vet 申请竞争力弱，建议尽快安排 shadowing 或实习",
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
