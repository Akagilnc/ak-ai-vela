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

    if (actScore == null || act25th == null || act75th == null) {
      return {
        dimension: ID,
        label: LABEL,
        current: actScore,
        target: null,
        normalized: null,
        severity: "no-data",
        action: getRecommendation(ID, "no-data", {
          current: actScore,
          target: null,
          schoolName: school.name,
        }),
      };
    }

    const target = { min: act25th, max: act75th };
    let severity: GapResult["severity"];
    if (actScore >= act75th) {
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
