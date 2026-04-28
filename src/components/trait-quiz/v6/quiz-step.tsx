"use client";

/**
 * Per-question step: stem + helper + Likert input + nav buttons (V8 mockup).
 */

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

export function QuizStep({ onSubmit, onExit }: QuizStepProps) {
  const { state, answer, next, prev, submit, isComplete } = useTraitQuizV6();
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

  const handleNext = () => {
    if (!canAdvance) return;
    if (isLastQuestion && isComplete()) {
      submit();
      onSubmit();
    } else {
      next();
    }
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

      <LikertOptions
        value={currentValue}
        onChange={(v) => answer(question.id, v)}
      />

      <nav className="flex justify-between items-center pt-6 mt-2 border-t border-vela-border">
        <button
          type="button"
          onClick={prev}
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
