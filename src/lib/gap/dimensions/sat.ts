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

    // No-data if student or school lacks the required fields.
    if (satScore == null || sat25th == null || sat75th == null) {
      return {
        dimension: ID,
        label: LABEL,
        current: satScore,
        target: null,
        normalized: null,
        severity: "no-data",
        action: getRecommendation(ID, "no-data", {
          current: satScore,
          target: null,
          schoolName: school.name,
        }),
      };
    }

    const target = { min: sat25th, max: sat75th };
    let severity: GapResult["severity"];
    if (satScore >= sat75th) {
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
