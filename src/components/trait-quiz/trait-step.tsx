"use client";

import { useState } from "react";
import { useTraitQuiz } from "./trait-quiz-provider";

export function TraitStep() {
  const { currentQuestion, currentIndex, answer, goBack } = useTraitQuiz();
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [fading, setFading] = useState(false);

  if (!currentQuestion) return null;

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    // 300ms delay with selected state, then auto-advance
    setTimeout(() => {
      setFading(true);
      setTimeout(() => {
        answer(currentQuestion.id, currentQuestion.key, value);
        setSelectedValue(null);
        setFading(false);
      }, 200); // fade-out duration
    }, 300);
  };

  const handleBack = () => {
    setFading(true);
    setTimeout(() => {
      goBack();
      setSelectedValue(null);
      setFading(false);
    }, 200);
  };

  return (
    <div className={`flex-1 flex flex-col transition-opacity duration-200 ${fading ? "opacity-0" : "opacity-100"}`}>
      {/* Back button */}
      {currentIndex > 0 && (
        <button
          type="button"
          onClick={handleBack}
          className="self-start mb-4 min-h-[44px] px-3 py-2 text-sm text-vela-text-secondary hover:text-vela-primary transition-colors"
          aria-label="返回上一题"
        >
          ← 返回
        </button>
      )}

      {/* Question */}
      <h2 className="text-[22px] font-display font-medium text-vela-heading leading-snug mb-2">
        {currentQuestion.title}
      </h2>
      {currentQuestion.subtitle && (
        <p className="text-sm text-vela-text-secondary mb-6">{currentQuestion.subtitle}</p>
      )}
      {!currentQuestion.subtitle && <div className="mb-6" />}

      {/* Options */}
      <div className="flex flex-col gap-3" role="radiogroup" aria-label={currentQuestion.title}>
        {currentQuestion.options.map((opt) => {
          const isSelected = selectedValue === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => handleSelect(opt.value)}
              disabled={selectedValue !== null}
              className={`
                w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-200
                text-[15px] leading-relaxed
                ${isSelected
                  ? "border-vela-primary bg-white shadow-[0_0_0_1px_var(--color-vela-primary)]"
                  : "border-vela-border bg-vela-surface hover:border-vela-primary hover:bg-white"
                }
                ${selectedValue !== null && !isSelected ? "opacity-60" : ""}
                disabled:cursor-default
              `}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
