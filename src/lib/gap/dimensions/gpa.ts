// GPA dimension. Applies to all students regardless of targetMajor.
//
// Branching is driven by `answers.gpaType` (the user-declared source of
// truth), NOT by whether fields happen to be populated:
//   - "percentage"   → read gpaPercentage only; classRank is ignored even
//                      if present (it's stale form state, not authoritative)
//   - "rank"         → read classRank only; gpaPercentage is ignored even
//                      if present (same reason)
//   - "international"→ no-data with Phase 2 prompt (IB/AP mapping TBD)
//   - "unknown"      → no-data with generic prompt
//
// Why gpaType and not field presence: the Step 3 form does NOT clear
// inactive fields when the user switches gpaType, so payloads routinely
// carry both `gpaPercentage` and `classRank`. If we fell back on field
// presence (or on normalizeChineseGpa's internal percentage-wins
// precedence), a user who declared "rank" could have their severity
// silently flipped by a stale percentage they no longer considered
// authoritative. See PR #7 Codex P1 + Copilot review.
//
// Severity thresholds:
//   - green:  normalized ≥ school.avgGPA
//   - yellow: avgGPA - 0.3 ≤ normalized < avgGPA (inclusive bottom)
//   - red:    normalized < avgGPA - 0.3

import type { School } from "@prisma/client";
import type { GapResult, QuestionnaireAnswers } from "@/lib/types";
import type { Dimension } from "../types";
import { normalizeChineseGpa } from "../normalize";
import { getRecommendation } from "../recommendations";

const ID = "gpa";
const LABEL = "GPA";
const YELLOW_GAP = 0.3;

function buildNoData(
  school: School,
  reason: "international" | "unknown" | "missing-data" | "school-missing-data",
  current: number | null,
): GapResult {
  return {
    dimension: ID,
    label: LABEL,
    current,
    target: null,
    normalized: null,
    severity: "no-data",
    action: getRecommendation(ID, "no-data", {
      current,
      target: null,
      schoolName: school.name,
      reason,
    }),
  };
}

export const gpaDimension: Dimension = {
  id: ID,
  label: LABEL,
  prevetOnly: false,

  appliesTo() {
    return true;
  },

  compute(answers: QuestionnaireAnswers, school: School): GapResult {
    // Branch on gpaType first — the user-declared source of truth.
    if (answers.gpaType === "international") {
      return buildNoData(school, "international", null);
    }
    if (answers.gpaType === "unknown") {
      return buildNoData(school, "unknown", null);
    }

    // At this point gpaType is "percentage" or "rank". Select EXACTLY
    // one input field based on the declared type — pass null for the
    // other so stale form state cannot override the user's intent.
    let normalized: number | null;
    let currentNumeric: number | null;
    if (answers.gpaType === "percentage") {
      normalized = normalizeChineseGpa(answers.gpaPercentage ?? null, null);
      currentNumeric = answers.gpaPercentage ?? null;
    } else {
      // gpaType === "rank"
      normalized = normalizeChineseGpa(null, answers.classRank ?? null);
      // Rank is a string, not a number — no numeric value for the "current"
      // slot. Report surfaces the rank string separately via answers.classRank.
      currentNumeric = null;
    }

    if (normalized == null) {
      return buildNoData(school, "missing-data", currentNumeric);
    }

    // School-side data check. Distinguish from student-missing above so
    // the action text flags a DB gap instead of asking the student to
    // re-submit data they already provided. M3.5 #9.
    if (school.avgGPA == null) {
      return buildNoData(school, "school-missing-data", currentNumeric);
    }

    // Compute severity.
    const target = { min: school.avgGPA, max: school.avgGPA };
    let severity: GapResult["severity"];
    if (normalized >= school.avgGPA + YELLOW_GAP) {
      // Excellent: well above average (same margin as yellow uses below)
      severity = "excellent";
    } else if (normalized >= school.avgGPA) {
      severity = "green";
    } else if (normalized >= school.avgGPA - YELLOW_GAP) {
      severity = "yellow";
    } else {
      severity = "red";
    }

    return {
      dimension: ID,
      label: LABEL,
      current: currentNumeric,
      target,
      normalized,
      severity,
      action: getRecommendation(ID, severity, {
        current: currentNumeric,
        target,
        schoolName: school.name,
      }),
    };
  },
};
