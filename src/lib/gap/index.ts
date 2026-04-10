// Public API for the M3 Gap Analysis engine.
//
// Consumers (M4 report UI, actions.ts, dump page) MUST import from
// "@/lib/gap" only — never from internal paths like "@/lib/gap/dimensions".
// This keeps the internal file layout refactorable without touching
// consumer code.

export { analyzeStudentVsSchool, analyzeStudentVsAllSchools } from "./engine";
export { normalizeChineseGpa } from "./normalize";
export { getRecommendation } from "./recommendations";
export { ALL_DIMENSIONS_META } from "./dimensions";
export type { Dimension } from "./types";
export type { RecommendationContext } from "./recommendations";
// Re-export for convenience so consumers don't need to import from two places.
export type { GapResult, GapSeverity } from "@/lib/types";
