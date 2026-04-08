"use client";

import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useQuestionnaire } from "./questionnaire-provider";
import { TOTAL_STEPS } from "@/lib/types";
import type { ReactNode } from "react";

type StepLayoutProps = {
  step: number;
  title: string;
  subtitle?: string;
  children: ReactNode;
  onValidate?: () => boolean; // Returns true if step is valid
  extraTopPadding?: boolean; // Step 7 needs extra breathing room
};

export function StepLayout({
  step,
  title,
  subtitle,
  children,
  onValidate,
  extraTopPadding = false,
}: StepLayoutProps) {
  const router = useRouter();
  const { flushSave, setStep, lastSavedAt } = useQuestionnaire();

  const savedTimeStr = useMemo(() => {
    if (!lastSavedAt) return null;
    try {
      const d = new Date(lastSavedAt);
      return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
    } catch {
      return null;
    }
  }, [lastSavedAt]);

  const handleNext = () => {
    if (onValidate && !onValidate()) return;

    // Flush save before navigation (race condition guard)
    flushSave();

    if (step < TOTAL_STEPS) {
      setStep(step + 1);
      router.push(`/questionnaire/step/${step + 1}`);
    } else {
      // Last step, go to review
      router.push("/questionnaire/review");
    }
  };

  const handlePrev = () => {
    // Flush save before navigation
    flushSave();

    if (step > 1) {
      setStep(step - 1);
      router.push(`/questionnaire/step/${step - 1}`);
    }
  };

  return (
    <div
      className={`w-full max-w-lg mx-auto ${extraTopPadding ? "pt-12" : "pt-8"}`}
    >
      {/* Step title */}
      <h2 className="text-2xl font-bold text-vela-heading font-display">
        {title}
      </h2>
      {subtitle && (
        <p className="text-base text-vela-muted mt-1">{subtitle}</p>
      )}

      {/* Form fields */}
      <div className="mt-6 space-y-5">
        {children}
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between mt-8 pb-8">
        {step > 1 ? (
          <button
            type="button"
            onClick={handlePrev}
            className="min-h-[44px] px-6 py-2 text-sm text-vela-text-secondary border border-vela-border rounded-md hover:bg-vela-surface transition-colors"
          >
            ← 上一步
          </button>
        ) : (
          <div />
        )}
        <button
          type="button"
          onClick={handleNext}
          className="min-h-[44px] px-6 py-2 text-sm font-medium text-white bg-vela-primary rounded-md hover:bg-vela-primary-dark transition-colors"
        >
          {step < TOTAL_STEPS ? "下一步 →" : "查看总览 →"}
        </button>
      </div>

      {/* Auto-save indicator */}
      {savedTimeStr && (
        <p className="text-xs text-vela-muted text-center pb-4">
          已自动保存 · {savedTimeStr}
        </p>
      )}
    </div>
  );
}
