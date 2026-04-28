/**
 * Thomas & Chess 1956 NYU Longitudinal Study — 9 temperament dimensions.
 *
 * Spec: ~/.gstack/projects/Akagilnc-ak-ai-vela/akagilnc-main-research-trait-v06-phase1-20260429.md
 *
 * Per-dim metadata:
 *   - id: stable schema key (used in score URL encoding, score.ts, etc.)
 *   - name: standard Chinese academic name (per 中文心理学规范译法)
 *   - displayLabel: consumer-facing UI label (may differ from name to soften
 *     academic terminology — e.g. "趋避性" → "对新事物反应")
 *   - attentionPole: 'low' | 'high' — which end is the "harder management"
 *     pole. BSQ-derived; every dim has a direction (no 'neutral'). Used by
 *     the 3-level color scale: deviation toward attention pole = gold/orange,
 *     away from it = forest green.
 *   - isCore: whether this dim participates in 4-class classification.
 *     5 core dims (rhythmicity / approach / adaptability / intensity / mood)
 *     follow Thomas & Chess "easy / difficult" cluster definition.
 */

export type DimensionId =
  | "activityLevel"
  | "rhythmicity"
  | "approach"
  | "adaptability"
  | "intensity"
  | "threshold"
  | "mood"
  | "distractibility"
  | "persistence";

export type AttentionPole = "low" | "high";

export interface DimensionMeta {
  id: DimensionId;
  name: string;
  displayLabel: string;
  attentionPole: AttentionPole;
  isCore: boolean;
}

export const DIMENSION_LIST: readonly DimensionMeta[] = [
  {
    id: "activityLevel",
    name: "活动水平",
    displayLabel: "活动水平",
    attentionPole: "high", // 高 = 活动量大，需更多 outlet
    isCore: false,
  },
  {
    id: "rhythmicity",
    name: "规律性",
    displayLabel: "规律性",
    attentionPole: "low", // 低 = 作息不固定
    isCore: true,
  },
  {
    id: "approach",
    name: "趋避性",
    displayLabel: "对新事物反应", // 学术名"趋避性"对家长不直觉，UI 用更具体说法
    attentionPole: "high", // 高 = 退缩（withdrawal）
    isCore: true,
  },
  {
    id: "adaptability",
    name: "适应性",
    displayLabel: "适应性",
    attentionPole: "low", // 低 = 慢热
    isCore: true,
  },
  {
    id: "intensity",
    name: "反应强度",
    displayLabel: "反应强度",
    attentionPole: "high", // 高 = 情绪外显强
    isCore: true,
  },
  {
    id: "threshold",
    name: "反应阈值",
    displayLabel: "反应阈值",
    attentionPole: "low", // 低 = 敏感
    isCore: false,
  },
  {
    id: "mood",
    name: "情绪本质",
    displayLabel: "情绪本质",
    attentionPole: "low", // 低 = 默认负面
    isCore: true,
  },
  {
    id: "distractibility",
    name: "注意分散度",
    displayLabel: "注意分散度",
    attentionPole: "high", // 高 = 易被外界拉走
    isCore: false,
  },
  {
    id: "persistence",
    name: "注意广度和坚持性",
    displayLabel: "坚持性", // 学术全名 "注意广度和坚持性" 太长，UI 简写
    attentionPole: "low", // 低 = 不持续
    isCore: false,
  },
] as const;

export const DIMENSION_META: Record<DimensionId, DimensionMeta> =
  DIMENSION_LIST.reduce(
    (acc, dim) => {
      acc[dim.id] = dim;
      return acc;
    },
    {} as Record<DimensionId, DimensionMeta>,
  );
