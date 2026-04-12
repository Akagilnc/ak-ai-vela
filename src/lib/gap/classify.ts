// Tier classification for gap analysis results.
//
// Classifies schools into match / reach / possible tiers based on the
// proportion of positive (excellent + green) vs negative (red) results
// among comparable dimensions (excludes no-data from the denominator).
//
// This fixes two issues found by Codex outside voice:
//   1. Absolute green count penalizes test-free schools (fewer comparable dims)
//   2. Same threshold treats 3-dim and 4-dim students differently
//
// Sort within each tier: positive desc, red asc, no-data asc, school.id tie-breaker.

import type { School } from "@prisma/client";
import type { GapResult } from "@/lib/types";

export type SchoolTier = "match" | "reach" | "possible";

export type ClassifiedSchool = {
  schoolId: string;
  school: School;
  tier: SchoolTier;
  results: GapResult[];
  positiveCount: number;
  redCount: number;
  noDataCount: number;
};

export type ClassifiedResult = {
  match: ClassifiedSchool[];
  reach: ClassifiedSchool[];
  possible: ClassifiedSchool[];
};

function countSeverities(results: GapResult[]) {
  let positiveCount = 0; // excellent + green
  let redCount = 0;
  let noDataCount = 0;

  for (const r of results) {
    if (r.severity === "excellent" || r.severity === "green") positiveCount++;
    else if (r.severity === "red") redCount++;
    else if (r.severity === "no-data") noDataCount++;
    // yellow is neither positive nor negative
  }

  const comparable = results.length - noDataCount;
  return { positiveCount, redCount, noDataCount, comparable };
}

function tierSort(a: ClassifiedSchool, b: ClassifiedSchool): number {
  // Primary: positive count desc
  if (a.positiveCount !== b.positiveCount) return b.positiveCount - a.positiveCount;
  // Secondary: red count asc
  if (a.redCount !== b.redCount) return a.redCount - b.redCount;
  // Tertiary: no-data count asc
  if (a.noDataCount !== b.noDataCount) return a.noDataCount - b.noDataCount;
  // Tie-breaker: school.id codepoint (matching engine convention)
  return a.schoolId < b.schoolId ? -1 : a.schoolId > b.schoolId ? 1 : 0;
}

export function classifySchools(
  allResults: Map<string, GapResult[]>,
  schools: School[],
): ClassifiedResult {
  const schoolMap = new Map(schools.map((s) => [s.id, s]));

  const match: ClassifiedSchool[] = [];
  const reach: ClassifiedSchool[] = [];
  const possible: ClassifiedSchool[] = [];

  for (const [schoolId, results] of allResults) {
    const school = schoolMap.get(schoolId);
    if (!school) continue;

    const { positiveCount, redCount, noDataCount, comparable } = countSeverities(results);

    let tier: SchoolTier;
    if (comparable === 0) {
      // All dimensions are no-data — can't classify
      tier = "possible";
    } else {
      const positiveRatio = positiveCount / comparable;
      const redRatio = redCount / comparable;

      if (positiveRatio >= 0.6) {
        tier = "match";
      } else if (redRatio >= 0.5) {
        tier = "reach";
      } else {
        tier = "possible";
      }
    }

    const entry: ClassifiedSchool = {
      schoolId,
      school,
      tier,
      results,
      positiveCount,
      redCount,
      noDataCount,
    };

    if (tier === "match") match.push(entry);
    else if (tier === "reach") reach.push(entry);
    else possible.push(entry);
  }

  match.sort(tierSort);
  reach.sort(tierSort);
  possible.sort(tierSort);

  return { match, reach, possible };
}
