"use client";

/**
 * 9-segment progress bar + dim eyebrow + question count (V8 mockup).
 */

import {
  DIMENSION_LIST,
  type DimensionMeta,
} from "@/lib/traits/temperament/dimensions";
import { QUESTIONS_BY_DIM } from "@/lib/traits/temperament/questions";

interface DimProgressProps {
  /** Currently displayed question index (0..total-1) */
  currentIndex: number;
  /** Total number of questions across all dims */
  totalQuestions: number;
  /** Number of answers so far */
  answeredCount: number;
}

export function DimProgress({
  currentIndex,
  totalQuestions,
  answeredCount,
}: DimProgressProps) {
  // Determine which dim the current question belongs to
  let cumulativeIndex = 0;
  let currentDim: DimensionMeta = DIMENSION_LIST[0];
  let currentDimIndex = 0;
  let currentDimProgressFraction = 0;
  for (let i = 0; i < DIMENSION_LIST.length; i++) {
    const dim = DIMENSION_LIST[i];
    const dimQuestions = QUESTIONS_BY_DIM[dim.id];
    const start = cumulativeIndex;
    const end = cumulativeIndex + dimQuestions.length;
    if (currentIndex >= start && currentIndex < end) {
      currentDim = dim;
      currentDimIndex = i;
      currentDimProgressFraction = (currentIndex - start + 1) / dimQuestions.length;
      break;
    }
    cumulativeIndex = end;
  }

  return (
    <div className="mb-8">
      <div className="flex justify-between items-baseline mb-2">
        <span className="text-[12px] font-bold tracking-[0.10em] uppercase text-vela-primary">
          维度 {currentDimIndex + 1} / 9 · {currentDim.displayLabel}
        </span>
        <span className="font-mono text-[13px] text-vela-text-2 font-medium">
          {answeredCount}
          <span className="text-vela-muted"> / {totalQuestions}</span>
        </span>
      </div>

      <div
        className="grid grid-cols-9 gap-[4px] h-[6px]"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={9}
        aria-valuenow={currentDimIndex + 1}
        aria-label={`进度：第 ${currentDimIndex + 1} 个维度，共 9 个`}
      >
        {DIMENSION_LIST.map((_dim, i) => {
          const isDone = i < currentDimIndex;
          const isActive = i === currentDimIndex;
          return (
            <div
              key={i}
              className={[
                "rounded-full overflow-hidden relative",
                isDone
                  ? "bg-vela-primary"
                  : "bg-vela-primary/10",
              ].join(" ")}
            >
              {isActive && (
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-vela-primary to-vela-primary-light rounded-full"
                  style={{ width: `${currentDimProgressFraction * 100}%` }}
                />
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-2 text-xs text-vela-text-2">
        已完成 <strong className="text-vela-primary font-semibold">{currentDimIndex} / 9 个维度</strong>
        {currentDimIndex < 9 ? `，正在评估"${currentDim.displayLabel}"` : "，准备生成画像"}
      </p>
    </div>
  );
}
