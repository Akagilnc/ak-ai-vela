// ACT dimension. Parallels SAT — compares student actScore against school
// act25th/act75th with identical severity logic.
//
// Severity:
//   - green:  actScore ≥ act75th
//   - yellow: act25th ≤ actScore < act75th
//   - red:    actScore < act25th

import type { School } from "@prisma/client";
import type { GapResult, QuestionnaireAnswers } from "@/lib/types";
import type { Dimension } from "../types";
import { getRecommendation } from "../recommendations";

const ID = "act";
const LABEL = "ACT";

// Mirror of sat.ts buildNoData — see that file for the reason-tag rationale.
// M3.5 #9.
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

export const actDimension: Dimension = {
  id: ID,
  label: LABEL,
  prevetOnly: false,

  appliesTo() {
    return true;
  },

  compute(answers: QuestionnaireAnswers, school: School): GapResult {
    const actScore = answers.actScore ?? null;
    const act25th = school.act25th;
    const act75th = school.act75th;

    // Test-free school: ACT scores are irrelevant.
    if (school.testPolicy === "free") {
      return buildNoData(school, "test-free", actScore);
    }

    // Student-missing wins over school-missing for the same reason as sat.ts.
    if (actScore == null) {
      return buildNoData(school, "missing-data", actScore);
    }
    if (act25th == null || act75th == null) {
      return buildNoData(school, "school-missing-data", actScore);
    }

    const target = { min: act25th, max: act75th };
    // Excellent threshold: far above 75th percentile (half the IQR above 75th).
    // Cap at 36 (ACT ceiling) so excellent is always reachable for a max-score student.
    const excellentThreshold = Math.min(act75th + (act75th - act25th) * 0.5, 36);
    let severity: GapResult["severity"];
    if (actScore >= excellentThreshold) {
      severity = "excellent";
    } else if (actScore >= act75th) {
      severity = "green";
    } else if (actScore >= act25th) {
      severity = "yellow";
    } else {
      severity = "red";
    }

    return {
      dimension: ID,
      label: LABEL,
      current: actScore,
      target,
      normalized: null,
      severity,
      action: getRecommendation(ID, severity, {
        current: actScore,
        target,
        schoolName: school.name,
      }),
    };
  },
};
