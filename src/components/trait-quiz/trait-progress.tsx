"use client";

import { useTraitQuiz } from "./trait-quiz-provider";

export function TraitProgress() {
  const { currentIndex, totalQuestions } = useTraitQuiz();
  const progress = ((currentIndex + 1) / totalQuestions) * 100;

  return (
    <div className="mb-8">
      <div
        className="h-1 bg-vela-border rounded-full overflow-hidden"
        role="progressbar"
        aria-label={`第 ${currentIndex + 1} 题，共 ${totalQuestions} 题`}
        aria-valuenow={currentIndex + 1}
        aria-valuemin={1}
        aria-valuemax={totalQuestions}
      >
        <div
          className="h-full bg-vela-secondary rounded-full transition-all duration-400 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-sm text-vela-text-secondary mt-2">
        第 {currentIndex + 1} 题，共 {totalQuestions} 题
      </p>
    </div>
  );
}
