// Dimension interface for the M3 gap analysis engine.
//
// Each dimension is a standalone module under `./dimensions/`. The engine
// iterates the DIMENSIONS registry, filters by `appliesTo`, and calls
// `compute` to produce one GapResult per (dimension, school) pair.
//
// Invariants (see M3 design doc, "Dimension Interface" section):
//   1. `compute` must return a GapResult with `result.dimension === this.id`.
//   2. `compute` must populate `GapResult.action` via `getRecommendation()`
//      from `../recommendations.ts`; never inline recommendation strings.
//   3. Pre-vet-conditional dimensions return false from `appliesTo` when
//      `answers.targetMajor` is not in {pre-vet, animal-science}.

import type { School } from "@prisma/client";
import type { GapResult, QuestionnaireAnswers } from "@/lib/types";

export interface Dimension {
  // Stable machine identifier. Must match the key prefix in RECOMMENDATIONS.
  id: string;

  // Display label in Chinese (shown in the report UI and dump page).
  label: string;

  // True for dimensions that only apply to pre-vet / animal-science majors
  // (e.g. prevet-experience). The engine uses this flag as metadata; the
  // actual filtering happens via `appliesTo`.
  prevetOnly: boolean;

  // Returns false to skip this dimension for the given student.
  appliesTo(answers: QuestionnaireAnswers): boolean;

  // Pure function: given a student and a school, return a GapResult.
  // Must not mutate inputs. Must not call network/IO. Must not throw for
  // well-formed inputs; missing student or school data should emit a
  // `no-data` result instead.
  compute(answers: QuestionnaireAnswers, school: School): GapResult;
}
