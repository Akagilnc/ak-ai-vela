"use client";

import { useRouter } from "next/navigation";
import { STEP_META, TOTAL_STEPS } from "@/lib/types";

type ProgressStepperProps = {
  currentStep: number;
  completedSteps: number[];
};

export function ProgressStepper({ currentStep, completedSteps }: ProgressStepperProps) {
  const router = useRouter();

  // Review mode: currentStep > TOTAL_STEPS
  const isReview = currentStep > TOTAL_STEPS;

  const handleStepClick = (step: number) => {
    if (completedSteps.includes(step)) {
      router.push(`/questionnaire/step/${step}`);
    }
  };

  return (
    <nav role="navigation" aria-label="问卷进度" className="w-full">
      {/* Desktop: numbered circles with connecting lines */}
      <div className="hidden lg:block">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {STEP_META.map(({ step, label }, i) => {
            const isCompleted = completedSteps.includes(step);
            const isCurrent = step === currentStep;
            const isClickable = isCompleted && !isCurrent;
            const isLast = i === STEP_META.length - 1;

            return (
              <div key={step} className="flex items-center flex-1 last:flex-initial">
                {/* Step circle + label */}
                <button
                  type="button"
                  onClick={() => handleStepClick(step)}
                  disabled={!isClickable}
                  aria-current={isCurrent ? "step" : undefined}
                  aria-label={isCompleted ? `已完成: ${label}` : label}
                  className={`flex flex-col items-center gap-1.5 min-h-[44px] transition-colors ${
                    isClickable
                      ? "cursor-pointer group"
                      : "cursor-default"
                  }`}
                >
                  {/* Circle */}
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                      isCompleted
                        ? "bg-vela-primary text-white group-hover:bg-vela-primary-dark"
                        : isCurrent
                          ? "bg-vela-secondary text-vela-heading ring-2 ring-vela-secondary/30 ring-offset-2 ring-offset-vela-bg"
                          : "bg-vela-border/60 text-vela-muted"
                    }`}
                  >
                    {isCompleted ? "✓" : step}
                  </span>
                  {/* Label */}
                  <span
                    className={`text-xs whitespace-nowrap ${
                      isCompleted
                        ? "text-vela-primary group-hover:text-vela-primary-dark"
                        : isCurrent
                          ? "text-vela-heading font-medium"
                          : "text-vela-muted"
                    }`}
                  >
                    {label}
                  </span>
                </button>

                {/* Connecting line */}
                {!isLast && (
                  <div className="flex-1 mx-1 mb-5">
                    <div
                      className={`h-0.5 w-full rounded ${
                        isCompleted ? "bg-vela-primary" : "bg-vela-border"
                      }`}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Tablet: compact circles with thin lines, no labels */}
      <div className="hidden md:block lg:hidden">
        <div className="flex items-center justify-center gap-0">
          {STEP_META.map(({ step, label }, i) => {
            const isCompleted = completedSteps.includes(step);
            const isCurrent = step === currentStep;
            const isClickable = isCompleted && !isCurrent;
            const isLast = i === STEP_META.length - 1;

            return (
              <div key={step} className="flex items-center">
                <button
                  type="button"
                  onClick={() => handleStepClick(step)}
                  disabled={!isClickable}
                  title={label}
                  aria-current={isCurrent ? "step" : undefined}
                  aria-label={isCompleted ? `已完成: ${label}` : label}
                  className={`min-w-[44px] min-h-[44px] flex items-center justify-center ${
                    isClickable ? "cursor-pointer group" : "cursor-default"
                  }`}
                >
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                      isCompleted
                        ? "bg-vela-primary text-white group-hover:bg-vela-primary-dark"
                        : isCurrent
                          ? "bg-vela-secondary text-vela-heading"
                          : "bg-vela-border/60 text-vela-muted"
                    }`}
                  >
                    {isCompleted ? "✓" : step}
                  </span>
                </button>
                {!isLast && (
                  <div
                    className={`w-4 h-0.5 rounded ${
                      isCompleted ? "bg-vela-primary" : "bg-vela-border"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile: progress bar + text */}
      <div className="flex md:hidden flex-col items-center gap-2">
        {/* Mini progress bar */}
        <div className="w-full max-w-xs h-1.5 bg-vela-border/40 rounded-full overflow-hidden">
          <div
            className="h-full bg-vela-primary rounded-full transition-all duration-300"
            style={{
              width: isReview
                ? "100%"
                : `${(Math.max(0, currentStep - 1) / TOTAL_STEPS) * 100}%`,
            }}
          />
        </div>
        {/* Text label */}
        <p className="text-sm text-vela-text-secondary">
          {isReview
            ? "总览确认"
            : `${currentStep} / ${TOTAL_STEPS} · ${STEP_META[currentStep - 1]?.label ?? ""}`}
        </p>
      </div>
    </nav>
  );
}
