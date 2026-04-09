"use client";

import { useEffect, useMemo, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ProgressStepper } from "./progress-stepper";
import { useQuestionnaire } from "./questionnaire-provider";
import { TOTAL_STEPS } from "@/lib/types";

type StepPageWrapperProps = {
  step: number;
  children: ReactNode;
};

export function StepPageWrapper({ step, children }: StepPageWrapperProps) {
  const router = useRouter();
  const { currentStep, setStep } = useQuestionnaire();

  // Validate step parameter
  useEffect(() => {
    if (step < 1 || step > TOTAL_STEPS || !Number.isInteger(step)) {
      router.replace("/questionnaire/step/1");
    }
  }, [step, router]);

  // Sync the step with context
  useEffect(() => {
    if (step !== currentStep && step >= 1 && step <= TOTAL_STEPS) {
      setStep(step);
    }
  }, [step, currentStep, setStep]);

  // Compute completed steps (all steps before current)
  const completedSteps = useMemo(() => {
    const completed: number[] = [];
    for (let i = 1; i < step; i++) {
      completed.push(i);
    }
    return completed;
  }, [step]);

  if (step < 1 || step > TOTAL_STEPS) {
    return null; // Will redirect
  }

  return (
    <div className="space-y-6">
      <ProgressStepper currentStep={step} completedSteps={completedSteps} />
      {children}
    </div>
  );
}
