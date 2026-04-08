"use client";

import { useRouter } from "next/navigation";
import { STEP_META, TOTAL_STEPS } from "@/lib/types";

type ProgressStepperProps = {
  currentStep: number;
  completedSteps: number[];
};

export function ProgressStepper({ currentStep, completedSteps }: ProgressStepperProps) {
  const router = useRouter();

  const handleStepClick = (step: number) => {
    // Only allow clicking completed steps
    if (completedSteps.includes(step)) {
      router.push(`/questionnaire/step/${step}`);
    }
  };

  return (
    <nav role="navigation" aria-label="问卷进度" className="w-full">
      {/* Desktop: full bar with labels */}
      <div className="hidden lg:flex items-center justify-between gap-1">
        {STEP_META.map(({ step, label }) => {
          const isCompleted = completedSteps.includes(step);
          const isCurrent = step === currentStep;
          const isFuture = !isCompleted && !isCurrent;

          return (
            <button
              key={step}
              type="button"
              onClick={() => handleStepClick(step)}
              disabled={isFuture}
              aria-current={isCurrent ? "step" : undefined}
              aria-label={isCompleted ? `已完成: ${label}` : label}
              className={`flex items-center gap-1.5 text-sm min-h-[44px] py-2 transition-colors ${
                isCompleted
                  ? "text-vela-primary cursor-pointer hover:text-vela-primary-dark"
                  : isCurrent
                    ? "text-vela-heading font-medium cursor-default"
                    : "text-vela-muted cursor-default"
              }`}
            >
              {isCompleted ? (
                <span className="text-vela-primary text-base">✓</span>
              ) : isCurrent ? (
                <span className="w-2.5 h-2.5 rounded-full bg-vela-secondary inline-block" />
              ) : (
                <span className="w-2.5 h-2.5 rounded-full bg-vela-border inline-block" />
              )}
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      {/* Tablet: dots only, no labels */}
      <div className="hidden md:flex lg:hidden items-center justify-center gap-3">
        {STEP_META.map(({ step, label }) => {
          const isCompleted = completedSteps.includes(step);
          const isCurrent = step === currentStep;
          const isFuture = !isCompleted && !isCurrent;

          return (
            <button
              key={step}
              type="button"
              onClick={() => handleStepClick(step)}
              disabled={isFuture}
              title={label}
              aria-current={isCurrent ? "step" : undefined}
              aria-label={isCompleted ? `已完成: ${label}` : label}
              className={`min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors ${
                isCompleted
                  ? "text-vela-primary cursor-pointer"
                  : isCurrent
                    ? "cursor-default"
                    : "cursor-default"
              }`}
            >
              {isCompleted ? (
                <span className="text-vela-primary text-sm">✓</span>
              ) : isCurrent ? (
                <span className="w-3 h-3 rounded-full bg-vela-secondary inline-block" />
              ) : (
                <span className="w-3 h-3 rounded-full bg-vela-border inline-block" />
              )}
            </button>
          );
        })}
      </div>

      {/* Mobile: single line "3/8 · 学业情况" */}
      <div className="flex md:hidden justify-center">
        <p className="text-sm text-vela-text-secondary">
          {currentStep}/{TOTAL_STEPS} · {STEP_META[currentStep - 1]?.label}
        </p>
      </div>
    </nav>
  );
}
