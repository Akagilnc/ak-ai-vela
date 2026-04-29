"use client";

/**
 * Per-question step: stem + helper + Likert input + nav buttons (V8 mockup).
 *
 * Auto-advance behavior (per user feedback 2026-04-29):
 *   - First-time pick on a question → auto-advance after 250ms (lets user
 *     see the selected state register, then moves on).
 *   - Changing an existing answer (re-pick after coming back via 上一题)
 *     → does NOT auto-advance. User came back deliberately to revise.
 *   - Last question → never auto-advances (would auto-submit, surprising).
 *     User must explicitly tap "提交".
 *   - Bottom 上一题 / 下一题 nav remains (manual override always available).
 */

import { useRef } from "react";
import { useTraitQuizV6 } from "./quiz-provider";
import { LikertOptions } from "./likert-options";
import { DimProgress } from "./dim-progress";
import {
  DIMENSION_LIST,
  DIMENSION_META,
} from "@/lib/traits/temperament/dimensions";
import { QUESTIONS, QUESTIONS_BY_DIM } from "@/lib/traits/temperament/questions";

interface QuizStepProps {
  onSubmit: () => void;
  onExit: () => void;
}

const AUTO_ADVANCE_DELAY_MS = 250;

export function QuizStep({ onSubmit, onExit }: QuizStepProps) {
  const { state, answer, next, prev, submit, isComplete } = useTraitQuizV6();
  // Track which question id is currently auto-advance pending (avoid double-fire)
  const pendingAdvanceRef = useRef<string | null>(null);

  const question = QUESTIONS[state.currentIndex];
  if (!question) return null;

  const currentValue = state.answers[question.id];
  const isLastQuestion = state.currentIndex === QUESTIONS.length - 1;
  const canAdvance = currentValue !== undefined;

  // Determine if this is the FIRST question of a new dim → show transition banner
  const dim = DIMENSION_META[question.dimensionId];
  const dimQuestions = QUESTIONS_BY_DIM[question.dimensionId];
  const isDimFirstQuestion = dimQuestions[0]?.id === question.id;
  const dimIndex = DIMENSION_LIST.findIndex((d) => d.id === dim.id);
  // First question overall doesn't show transition banner (they just started)
  const showTransition = isDimFirstQuestion && state.currentIndex > 0;

  const handleAnswer = (value: number) => {
    const wasFirstPick = currentValue === undefined;
    answer(question.id, value);

    // Auto-advance: only on FIRST pick + not last question + not already pending
    if (
      wasFirstPick &&
      !isLastQuestion &&
      pendingAdvanceRef.current !== question.id
    ) {
      pendingAdvanceRef.current = question.id;
      setTimeout(() => {
        // Re-check: user might have hit 上一题 in the 250ms window
        if (pendingAdvanceRef.current === question.id) {
          next();
          pendingAdvanceRef.current = null;
        }
      }, AUTO_ADVANCE_DELAY_MS);
    }
  };

  const handleNext = () => {
    if (!canAdvance) return;
    if (isLastQuestion && isComplete()) {
      submit();
      onSubmit();
    } else {
      next();
    }
  };

  const handlePrev = () => {
    // Cancel any pending auto-advance if user navigates manually
    pendingAdvanceRef.current = null;
    prev();
  };

  const answeredCount = Object.keys(state.answers).length;

  return (
    <div className="flex flex-col gap-4 pb-12">
      {/* Header: logo + 退出 */}
      <header className="flex justify-between items-center mb-2">
        <span className="text-[20px] font-display font-semibold text-vela-primary tracking-tight">
          Vela
        </span>
        <button
          type="button"
          onClick={onExit}
          className="text-vela-text-2 text-sm hover:text-vela-primary min-h-[44px] px-3"
        >
          退出
        </button>
      </header>

      <DimProgress
        currentIndex={state.currentIndex}
        totalQuestions={state.totalQuestions}
        answeredCount={answeredCount}
      />

      {showTransition && (
        <div
          className="bg-vela-primary/[0.06] border border-vela-primary/20 rounded-md py-[14px] px-4 mb-2 text-sm text-vela-primary leading-relaxed"
          role="region"
          aria-label="维度切换提示"
        >
          接下来 {dimQuestions.length} 题关于
          <strong className="font-display font-semibold mx-1">
            {dim.displayLabel}
          </strong>
          。
        </div>
      )}

      <section className="mb-2">
        <p className="font-display text-[24px] leading-[1.45] font-medium tracking-tight text-vela-heading">
          {question.prompt}
        </p>
        <p className="mt-2 text-vela-text-2 text-sm leading-relaxed">
          想想最近几次的真实情况。如果情况不一样，按更常见的那次选。
        </p>
      </section>

      <LikertOptions value={currentValue} onChange={handleAnswer} />

      <nav className="flex justify-between items-center pt-6 mt-2 border-t border-vela-border">
        <button
          type="button"
          onClick={handlePrev}
          disabled={state.currentIndex === 0}
          className="bg-transparent border-none text-vela-text-2 font-medium text-sm cursor-pointer hover:text-vela-primary disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] px-3"
        >
          ← 上一题
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={!canAdvance}
          className={[
            "rounded-md px-6 font-semibold text-[15px] min-h-[48px]",
            canAdvance
              ? "bg-vela-primary text-white hover:bg-vela-primary-dark"
              : "bg-vela-border text-vela-muted cursor-not-allowed",
          ].join(" ")}
        >
          {isLastQuestion ? "提交" : "下一题"} →
        </button>
      </nav>
    </div>
  );
}
