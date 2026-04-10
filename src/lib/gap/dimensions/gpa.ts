// GPA dimension. Applies to all students regardless of targetMajor.
//
// Branching is driven by `answers.gpaType` (not `schoolSystem`):
//   - "percentage"   → use gpaPercentage, pass through normalizeChineseGpa
//   - "rank"         → use classRank (handled inside normalizeChineseGpa)
//   - "international"→ no-data with Phase 2 prompt (IB/AP mapping TBD)
//   - "unknown"      → no-data with generic prompt
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
  reason: "international" | "unknown" | "missing-data",
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
    // Branch on gpaType first.
    if (answers.gpaType === "international") {
      return buildNoData(school, "international", null);
    }
    if (answers.gpaType === "unknown") {
      return buildNoData(school, "unknown", null);
    }

    // Percentage / rank path: pass both to the normalizer, which enforces
    // precedence (percentage wins when present). If neither field has a
    // usable value, normalizer returns null → no-data.
    const normalized = normalizeChineseGpa(
      answers.gpaPercentage ?? null,
      answers.classRank ?? null,
    );

    if (normalized == null) {
      // Capture whichever raw value was present for the report's "current"
      // field. Prefer percentage; fall back to null (rank is a string, not
      // a number, so we can't show it in the numeric current slot).
      return buildNoData(school, "missing-data", answers.gpaPercentage ?? null);
    }

    // School-side data check.
    if (school.avgGPA == null) {
      return buildNoData(school, "missing-data", answers.gpaPercentage ?? null);
    }

    // Compute severity.
    const target = { min: school.avgGPA, max: school.avgGPA };
    let severity: GapResult["severity"];
    if (normalized >= school.avgGPA) {
      severity = "green";
    } else if (normalized >= school.avgGPA - YELLOW_GAP) {
      severity = "yellow";
    } else {
      severity = "red";
    }

    return {
      dimension: ID,
      label: LABEL,
      current: answers.gpaPercentage ?? null,
      target,
      normalized,
      severity,
      action: getRecommendation(ID, severity, {
        current: answers.gpaPercentage ?? null,
        target,
        schoolName: school.name,
      }),
    };
  },
};
