"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { StepPageWrapper } from "@/components/questionnaire/step-page-wrapper";
import { Step1Basics } from "@/components/questionnaire/steps/step-1-basics";
import { Step2School } from "@/components/questionnaire/steps/step-2-school";
import { Step3Academics } from "@/components/questionnaire/steps/step-3-academics";
import { Step4Tests } from "@/components/questionnaire/steps/step-4-tests";
import { Step5Activities } from "@/components/questionnaire/steps/step-5-activities";
import { Step6Experience } from "@/components/questionnaire/steps/step-6-experience";
import { Step7Finances } from "@/components/questionnaire/steps/step-7-finances";
import { Step8Goals } from "@/components/questionnaire/steps/step-8-goals";
import { TOTAL_STEPS } from "@/lib/types";

const STEP_COMPONENTS: Record<number, React.ComponentType> = {
  1: Step1Basics,
  2: Step2School,
  3: Step3Academics,
  4: Step4Tests,
  5: Step5Activities,
  6: Step6Experience,
  7: Step7Finances,
  8: Step8Goals,
};

export default function StepPage() {
  const params = useParams();
  const router = useRouter();
  const stepParam = params.step as string;
  const step = Number(stepParam);

  // Redirect invalid step params
  useEffect(() => {
    if (isNaN(step) || step < 1 || step > TOTAL_STEPS || !Number.isInteger(step)) {
      router.replace("/questionnaire/step/1");
    }
  }, [step, router]);

  if (isNaN(step) || step < 1 || step > TOTAL_STEPS) {
    return null;
  }

  const StepComponent = STEP_COMPONENTS[step];

  return (
    <StepPageWrapper step={step}>
      <StepComponent />
    </StepPageWrapper>
  );
}
