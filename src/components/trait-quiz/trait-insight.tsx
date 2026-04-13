"use client";

import { useTraitQuiz } from "./trait-quiz-provider";

export function TraitInsight() {
  const { insightText, dismissInsight } = useTraitQuiz();

  if (!insightText) return null;

  return (
    <div
      className="flex-1 flex flex-col items-center justify-center animate-fade-in"
      role="status"
      aria-live="polite"
    >
      <div className="w-full max-w-sm bg-white border-l-4 border-vela-primary rounded-xl p-6">
        <p className="font-display text-xl text-vela-heading leading-relaxed mb-4">
          {insightText}
        </p>
        <p className="text-sm text-vela-text-secondary mb-6">
          接下来几个问题帮我们更深入了解学习方式
        </p>
        <button
          type="button"
          onClick={dismissInsight}
          className="min-h-[44px] px-6 py-3 bg-vela-primary text-white rounded-lg font-medium hover:bg-vela-primary-dark transition-colors"
        >
          继续 →
        </button>
      </div>
    </div>
  );
}
