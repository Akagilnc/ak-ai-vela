// Pre-vet Experience dimension. Only applies to pre-vet and animal-science
// majors — returns false from appliesTo for other majors so the engine
// skips it entirely.
//
// Computes total animal hours by summing `hours` across all entries in
// `animalExperience[]`. Entries with null/undefined hours contribute 0
// (not dropped from the list) — this matches the design doc intent that
// a student filling an entry without hours has still signaled activity.
//
// Severity thresholds (founder-set, refined post-陪课):
//   - green:  total ≥ 100 hours
//   - yellow: 40 ≤ total < 100 hours
//   - red:    total < 40 hours
//   - no-data: animalExperience null/undefined/empty array

import type { School } from "@prisma/client";
import type { GapResult, QuestionnaireAnswers } from "@/lib/types";
import type { Dimension } from "../types";
import { getRecommendation } from "../recommendations";

const ID = "prevet-experience";
const LABEL = "动科 / Pre-vet 经历";
const GREEN_THRESHOLD = 100;
const YELLOW_THRESHOLD = 40;

export const prevetExperienceDimension: Dimension = {
  id: ID,
  label: LABEL,
  prevetOnly: true,

  appliesTo(answers: QuestionnaireAnswers) {
    return (
      answers.targetMajor === "pre-vet" ||
      answers.targetMajor === "animal-science"
    );
  },

  compute(answers: QuestionnaireAnswers, school: School): GapResult {
    const entries = answers.animalExperience;

    if (!entries || entries.length === 0) {
      return {
        dimension: ID,
        label: LABEL,
        current: null,
        target: null,
        normalized: null,
        severity: "no-data",
        action: getRecommendation(ID, "no-data", {
          current: null,
          target: null,
          schoolName: school.name,
        }),
      };
    }

    // Sum hours across entries. Missing hours count as 0 (see module comment).
    const totalHours = entries.reduce(
      (sum, entry) => sum + (entry.hours ?? 0),
      0,
    );

    const target = { min: YELLOW_THRESHOLD, max: GREEN_THRESHOLD };
    let severity: GapResult["severity"];
    if (totalHours >= GREEN_THRESHOLD) {
      severity = "green";
    } else if (totalHours >= YELLOW_THRESHOLD) {
      severity = "yellow";
    } else {
      severity = "red";
    }

    return {
      dimension: ID,
      label: LABEL,
      current: totalHours,
      target,
      normalized: null,
      severity,
      action: getRecommendation(ID, severity, {
        current: totalHours,
        target,
        schoolName: school.name,
      }),
    };
  },
};
