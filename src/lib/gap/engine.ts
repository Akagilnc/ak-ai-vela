// M3 Gap Analysis Engine — orchestrator.
//
// Responsibilities:
//   1. Merge overrides into base answers (for What If simulator).
//   2. Filter dimensions by `appliesTo(mergedAnswers)`.
//   3. Call each surviving dimension's `compute(mergedAnswers, school)`.
//   4. Return GapResult[] (per school) or Map<schoolId, GapResult[]>.
//
// Merge semantics (see design doc "mergeOverrides" and outside-voice
// Finding 2):
//   - undefined override values are SKIPPED (do not wipe base).
//   - null override values ARE applied (explicit "clear this field").
//   - Any other value replaces the base at that key.
//   - Shallow merge — nested arrays (activities, animalExperience) are
//     replaced wholesale.
//
// Fail-fast: dimensions are expected to handle missing student/school
// data by returning `severity: "no-data"`. A thrown exception from
// `compute` propagates upward; the engine does NOT wrap with try/catch.
// This keeps dimension bugs visible instead of silently surfacing as
// no-data results.

import type { School } from "@prisma/client";
import type { GapResult, QuestionnaireAnswers } from "@/lib/types";
import { DIMENSIONS } from "./dimensions";

function mergeOverrides(
  base: QuestionnaireAnswers,
  overrides: Partial<QuestionnaireAnswers> | undefined,
): QuestionnaireAnswers {
  if (!overrides) return base;
  const cleaned: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(overrides)) {
    if (value !== undefined) cleaned[key] = value;
  }
  return { ...base, ...cleaned } as QuestionnaireAnswers;
}

export function analyzeStudentVsSchool(
  baseAnswers: QuestionnaireAnswers,
  school: School,
  overrides?: Partial<QuestionnaireAnswers>,
): GapResult[] {
  const answers = mergeOverrides(baseAnswers, overrides);

  return DIMENSIONS
    .filter((dim) => dim.appliesTo(answers))
    .map((dim) => dim.compute(answers, school));
}

export function analyzeStudentVsAllSchools(
  baseAnswers: QuestionnaireAnswers,
  schools: School[],
  overrides?: Partial<QuestionnaireAnswers>,
): Map<string, GapResult[]> {
  // Sort by school.id so Map iteration order is deterministic regardless
  // of caller input order. Without this, two different caller orderings
  // produce two different iteration orders and the "deep equal" test only
  // catches same-reference runs. Per plan-eng-review outside-voice Finding 4.
  const sorted = [...schools].sort((a, b) => a.id.localeCompare(b.id));

  const result = new Map<string, GapResult[]>();
  for (const school of sorted) {
    result.set(school.id, analyzeStudentVsSchool(baseAnswers, school, overrides));
  }
  return result;
}
