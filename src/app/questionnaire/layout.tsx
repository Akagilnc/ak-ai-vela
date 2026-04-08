"use client";

import { QuestionnaireProvider } from "@/components/questionnaire/questionnaire-provider";
import type { ReactNode } from "react";

export default function QuestionnaireLayout({ children }: { children: ReactNode }) {
  return (
    <QuestionnaireProvider>
      <main className="flex-1 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1200px] mx-auto">
          {children}
        </div>
      </main>
    </QuestionnaireProvider>
  );
}
