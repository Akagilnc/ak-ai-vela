/**
 * 4-class temperament classification — Thomas & Chess simplified for v0.6.
 *
 * Spec: research notes Section 4 + 4.2 (8 fixture cases).
 *
 * Algorithm:
 *   1. variance guard: σ < varianceMin across 30 raw answers → lowVariance flag
 *   2. core composite = sum of 5 core dims toward attention pole, normalized 0-1
 *   3. classify by core first, then differentiate within high-core branch:
 *      - core ≤ easy (0.30) → 灵活型
 *      - core ≥ cautious (0.70):
 *          - intensity ≥ intensityHigh (3.5) → 慎重型
 *          - intensity < intensityHigh → 慢热型 (Thomas & Chess slow-warm phenotype)
 *      - core in [slowWarm (0.55), cautious) AND intensity < intensityHigh → 慢热型
 *      - else → 平衡型
 *   4. hysteresis: |intensity - intensityHigh| < band/2 → confidence = 'low'
 *   5. variance guard fires only on 平衡型 (extreme uniform carries signal)
 *
 * No normative data. Cutoffs are empirical placeholders; cutoffVersion=1.
 * After 30+ real fills, percentile re-cal triggers cutoffVersion bump.
 */

import type { DimensionId } from "./dimensions";

export type TraitType = "灵活型" | "慎重型" | "慢热型" | "平衡型";

export type Confidence = "high" | "low";

/**
 * 9-dim Likert score (1-5 scale). 1 = "完全不像她", 5 = "非常像她".
 * Encoded as average across the per-dim question count (3-4 questions).
 *
 * Note: `approach` is encoded with high = withdrawal (hard pole). Score input
 * already follows this convention (题目 raw answer 用 approach 语义但 dim
 * normalize 时已 reverse — see Section 1 & Section 9 of research notes).
 */
export type DimScores = Record<DimensionId, number>;

export interface ClassifyInput {
  scores: DimScores;
  /** All 30 raw 1-5 likert answers (used by variance guard). */
  allRawAnswers: number[];
}

export interface ClassifyResult {
  type: TraitType;
  confidence: Confidence;
  rawCore: number; // 0-1 normalized
  rawIntensity: number; // 1-5 raw
}

interface CoreDimSpec {
  key: DimensionId;
  /** true = high score is the "hard pole" (e.g. approach: 5=withdrawal) */
  highIsHardPole: boolean;
}

interface CutoffSet {
  easy: number;
  slowWarm: number;
  cautious: number;
  intensityHigh: number;
  intensityHysteresisBand: number;
  varianceMin: number;
}

interface ClassificationConfig {
  coreDims: readonly CoreDimSpec[];
  differentiator: DimensionId;
  cutoffs: CutoffSet;
}

/**
 * Locked v1 (cutoffVersion=1) configuration. After ship + 30+ fills, future
 * cutoff re-cal MUST add a new entry to cutoffHistory in score-encoding.ts,
 * never mutate this object directly.
 */
export const CLASSIFICATION_CONFIG: ClassificationConfig = {
  coreDims: [
    { key: "rhythmicity", highIsHardPole: false },
    { key: "approach", highIsHardPole: true },
    { key: "adaptability", highIsHardPole: false },
    { key: "intensity", highIsHardPole: true },
    { key: "mood", highIsHardPole: false },
  ],
  differentiator: "intensity",
  cutoffs: {
    easy: 0.3,
    slowWarm: 0.55,
    cautious: 0.7,
    intensityHigh: 3.5,
    intensityHysteresisBand: 0.4,
    varianceMin: 0.5,
  },
} as const;

/**
 * Compute the 5-dim core composite, normalized 0-1.
 * 1.0 = max difficulty pole; 0.0 = max easy pole.
 */
export function computeCore(scores: DimScores, config = CLASSIFICATION_CONFIG): number {
  let sum = 0;
  for (const { key, highIsHardPole } of config.coreDims) {
    const v = scores[key];
    sum += highIsHardPole ? v : 5 - v;
  }
  return sum / 25; // 5 dims × max contribution 5 = 25
}

function stddev(arr: number[]): number {
  if (arr.length === 0) return 0;
  const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
  const variance =
    arr.reduce((acc, x) => acc + (x - mean) ** 2, 0) / arr.length;
  return Math.sqrt(variance);
}

export function classify(input: ClassifyInput): ClassifyResult {
  const { scores, allRawAnswers } = input;
  const cfg = CLASSIFICATION_CONFIG;

  const variance = stddev(allRawAnswers);
  const lowVariance = variance < cfg.cutoffs.varianceMin;

  const core = computeCore(scores, cfg);
  const intensity = scores.intensity;

  const inHysteresis =
    Math.abs(intensity - cfg.cutoffs.intensityHigh) <
    cfg.cutoffs.intensityHysteresisBand / 2;

  let type: TraitType;
  let confidence: Confidence = "high";

  if (core <= cfg.cutoffs.easy) {
    type = "灵活型";
  } else if (core >= cfg.cutoffs.cautious) {
    // High-core: 慎重 vs 慢热 by intensity (Thomas & Chess phenotype split)
    type = intensity >= cfg.cutoffs.intensityHigh ? "慎重型" : "慢热型";
    if (inHysteresis) confidence = "low";
  } else if (
    core >= cfg.cutoffs.slowWarm &&
    intensity < cfg.cutoffs.intensityHigh
  ) {
    type = "慢热型";
    if (inHysteresis) confidence = "low";
  } else {
    type = "平衡型";
    // Variance guard fires ONLY on 平衡型 — extreme uniform (all-1 or all-5)
    // carries signal even at σ=0; only mid-uniform (all-3) is noise.
    if (lowVariance) confidence = "low";
  }

  return { type, confidence, rawCore: core, rawIntensity: intensity };
}
