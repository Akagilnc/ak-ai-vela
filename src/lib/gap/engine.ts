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
//   - null override values ARE applied as "clear this field" — the key
//     is removed from the merged object so dimensions see it as missing.
//   - Any other value replaces the base at that key.
//   - Shallow merge — nested arrays (activities, animalExperience) are
//     replaced wholesale.
//
// Overrides type: `AnswersOverride` allows null ONLY on the subset of
// fields the What If simulator actually clears — score/experience fields
// (see ClearableKey below). Contract fields like `childName`, `gpaType`,
// `schoolSystem`, and `targetMajor` deliberately reject null because
// clearing them either violates the Zod schema or silently flips which
// code path the engine takes (e.g. setting `gpaType = null` would wipe
// the caller's explicit "use percentage" / "use rank" decision).
//
// `Partial<QuestionnaireAnswers>` alone would forbid null everywhere,
// forcing tests to write `null as unknown as number` for legitimate
// "clear this score" cases. The intersection below gets both: concrete
// contract types for identity fields, and `T | null` for clearables.
// Per PR #7 Codex/Copilot review (P1 permissive-null finding).
//
// Fail-fast: dimensions are expected to handle missing student/school
// data by returning `severity: "no-data"`. A thrown exception from
// `compute` propagates upward; the engine does NOT wrap with try/catch.
// This keeps dimension bugs visible instead of silently surfacing as
// no-data results.

import type { School } from "@prisma/client";
import type { GapResult, QuestionnaireAnswers } from "@/lib/types";
import { DIMENSIONS } from "./dimensions";

// Fields the What If simulator may clear with `null`. Must stay in sync
// with the UI — if a new simulator control lets the user wipe a field,
// add it here.
type ClearableKey =
  | "gpaPercentage"
  | "classRank"
  | "scienceGPA"
  | "satScore"
  | "actScore"
  | "toeflScore"
  | "ieltsScore"
  | "activities"
  | "animalExperience";

// Override type for the What If simulator. `null` means "explicit clear"
// and is resolved inside mergeOverrides by deleting the key (only allowed
// on ClearableKey fields). `undefined` means "skip this key, keep the
// base value" and is allowed on every field.
export type AnswersOverride =
  & {
      [K in Exclude<keyof QuestionnaireAnswers, ClearableKey>]?: QuestionnaireAnswers[K];
    }
  & {
      [K in ClearableKey]?: QuestionnaireAnswers[K] | null;
    };

function mergeOverrides(
  base: QuestionnaireAnswers,
  overrides: AnswersOverride | undefined,
): QuestionnaireAnswers {
  if (!overrides) return base;
  const merged: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(overrides)) {
    if (value === undefined) continue; // skip: keep base value
    if (value === null) {
      // Explicit clear — remove the key entirely so dimensions read it
      // as missing (undefined), which maps to their no-data branches.
      delete merged[key];
    } else {
      merged[key] = value;
    }
  }
  return merged as QuestionnaireAnswers;
}

export function analyzeStudentVsSchool(
  baseAnswers: QuestionnaireAnswers,
  school: School,
  overrides?: AnswersOverride,
): GapResult[] {
  const answers = mergeOverrides(baseAnswers, overrides);

  return DIMENSIONS
    .filter((dim) => dim.appliesTo(answers))
    .map((dim) => dim.compute(answers, school));
}

export function analyzeStudentVsAllSchools(
  baseAnswers: QuestionnaireAnswers,
  schools: School[],
  overrides?: AnswersOverride,
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
