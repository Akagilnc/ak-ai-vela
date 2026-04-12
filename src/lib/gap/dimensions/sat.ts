// SAT dimension. Compares student satScore against school sat25th/sat75th.
//
// Severity:
//   - green:  satScore ≥ sat75th
//   - yellow: sat25th ≤ satScore < sat75th
//   - red:    satScore < sat25th
//
// `normalized` is always null — SAT is a raw score, no normalization needed.

import type { School } from "@prisma/client";
import type { GapResult, QuestionnaireAnswers } from "@/lib/types";
import type { Dimension } from "../types";
import { getRecommendation } from "../recommendations";

const ID = "sat";
const LABEL = "SAT";

// Split out the no-data construction so the student-side and school-side
// branches stay single-line at the call sites. The `reason` argument is
// how the template picker in recommendations.ts chooses between the
// student-facing "fill the form" copy and the DB-gap copy. M3.5 #9.
function buildNoData(
  school: School,
  reason: "missing-data" | "school-missing-data" | "test-free",
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

export const satDimension: Dimension = {
  id: ID,
  label: LABEL,
  prevetOnly: false,

  appliesTo() {
    return true;
  },

  compute(answers: QuestionnaireAnswers, school: School): GapResult {
    const satScore = answers.satScore ?? null;
    const sat25th = school.sat25th;
    const sat75th = school.sat75th;

    // Test-free school: SAT scores are irrelevant regardless of whether
    // the student or school has data. Fires before any other check.
    if (school.testPolicy === "free") {
      return buildNoData(school, "test-free", satScore);
    }

    // Student-side first: if the student hasn't submitted a score, tell
    // them to fill it in. This branch wins even when both student and
    // school are missing, because the user-actionable fix is to fill
    // the form — we can't ask them to wait on DB data they never had.
    if (satScore == null) {
      return buildNoData(school, "missing-data", satScore);
    }
    // School-side: student filled in a score but our DB lacks the
    // percentile bands. Flag the DB gap, do NOT blame the student.
    if (sat25th == null || sat75th == null) {
      return buildNoData(school, "school-missing-data", satScore);
    }

    const target = { min: sat25th, max: sat75th };
    // Excellent threshold: far above 75th percentile (half the IQR above 75th)
    const excellentThreshold = sat75th + (sat75th - sat25th) * 0.5;
    let severity: GapResult["severity"];
    if (satScore >= excellentThreshold) {
      severity = "excellent";
    } else if (satScore >= sat75th) {
      severity = "green";
    } else if (satScore >= sat25th) {
      severity = "yellow";
    } else {
      severity = "red";
    }

    return {
      dimension: ID,
      label: LABEL,
      current: satScore,
      target,
      normalized: null,
      severity,
      action: getRecommendation(ID, severity, {
        current: satScore,
        target,
        schoolName: school.name,
      }),
    };
  },
};
