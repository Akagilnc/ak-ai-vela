"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TraitQuizProvider, useTraitQuiz, STORAGE_KEY } from "@/components/trait-quiz/trait-quiz-provider";
import { TraitProgress } from "@/components/trait-quiz/trait-progress";
import { TraitStep } from "@/components/trait-quiz/trait-step";
import { TraitInsight } from "@/components/trait-quiz/trait-insight";
import { matchRoute } from "@/lib/traits/match";
import type { TraitAnswers } from "@/lib/traits/types";

const RESULT_STORAGE_KEY = "vela-trait-result";

function QuizContent() {
  const router = useRouter();
  const { state, restoreDraft, restart } = useTraitQuiz();
  const [showDraftPrompt, setShowDraftPrompt] = useState(false);
  const [draftChecked, setDraftChecked] = useState(false);

  // Check for saved draft on mount
  useEffect(() => {
    if (draftChecked) return;
    setDraftChecked(true);
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const draft = JSON.parse(raw) as {
        answers: Partial<TraitAnswers>;
        questionId: string;
        timestamp: number;
      };
      // Only show prompt if draft has at least one answer
      if (draft.answers && Object.keys(draft.answers).length > 0) {
        setShowDraftPrompt(true);
      }
    } catch {
      // Invalid draft — ignore
    }
  }, [draftChecked]);

  // Navigate to result page when quiz completes
  useEffect(() => {
    if (state.phase === "complete") {
      const routeId = state.answers.ageGroup && state.answers.interest && state.answers.resourceLevel
        ? matchRoute(state.answers as TraitAnswers)
        : null;
      if (routeId) {
        // Store answers in localStorage for result page
        try {
          localStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(state.answers));
          localStorage.removeItem(STORAGE_KEY);
        } catch { /* noop */ }
        router.push(`/trait-quiz/result/${routeId}`);
      }
    }
  }, [state.phase, state.answers, router]);

  // Draft recovery prompt
  if (showDraftPrompt) {
    let draftQuestionNum = 1;
    let draftAnswers: Partial<TraitAnswers> = {};
    let draftQuestionId = "ageGroup";
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const draft = JSON.parse(raw ?? "{}");
      draftAnswers = draft.answers ?? {};
      draftQuestionId = draft.questionId ?? "ageGroup";
      draftQuestionNum = Object.keys(draftAnswers).length + 1;
    } catch { /* localStorage unavailable or invalid draft */ }

    return (
      <div className="flex-1 flex items-center justify-center animate-fade-in">
        <div className="bg-vela-surface rounded-xl p-6 max-w-sm text-center">
          <p className="text-vela-heading font-medium mb-4">
            你上次答到了第 {Math.min(draftQuestionNum, 10)} 题，继续？
          </p>
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => {
                restoreDraft(draftAnswers, draftQuestionId);
                setShowDraftPrompt(false);
              }}
              className="min-h-[44px] px-6 py-3 bg-vela-primary text-white rounded-lg font-medium hover:bg-vela-primary-dark transition-colors"
            >
              继续测评
            </button>
            <button
              type="button"
              onClick={() => {
                restart();
                setShowDraftPrompt(false);
              }}
              className="min-h-[44px] px-6 py-3 text-vela-text-secondary hover:text-vela-primary transition-colors"
            >
              重新开始
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Insight card
  if (state.phase === "insight") {
    return <TraitInsight />;
  }

  // Loading state while navigating to result page
  // Without this, the quiz renders the last question while router.push is in flight,
  // and users tap the option again thinking it didn't register.
  if (state.phase === "complete") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 animate-fade-in">
        <div className="w-12 h-12 border-4 border-vela-border border-t-vela-primary rounded-full animate-spin" />
        <p className="text-vela-text-secondary text-sm">正在生成画像...</p>
      </div>
    );
  }

  // Quiz questions
  return (
    <>
      <TraitProgress />
      <TraitStep />
    </>
  );
}

function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center gap-8">
      <div className="w-20 h-20 bg-vela-primary rounded-full flex items-center justify-center">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
        </svg>
      </div>
      <div>
        <h1 className="text-[28px] font-display font-semibold text-vela-heading leading-tight">
          发现孩子的<br />成长路线
        </h1>
      </div>
      <p className="text-[15px] text-vela-text-secondary max-w-[320px] leading-relaxed">
        回答 10 个问题，了解孩子的兴趣和成长特点，拿到分阶段活动建议。
      </p>
      <button
        type="button"
        onClick={onStart}
        className="min-h-[44px] px-12 py-3.5 bg-vela-primary text-white rounded-lg text-base font-semibold hover:bg-vela-primary-dark transition-colors active:scale-[0.98]"
      >
        开始测评
      </button>
      <p className="text-sm text-vela-text-secondary">
        10 个问题 · 约 2 分钟
      </p>
    </div>
  );
}

export default function TraitQuizPage() {
  const [started, setStarted] = useState(false);

  if (!started) {
    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-[480px] mx-auto px-5 py-6 min-h-screen flex flex-col">
          <WelcomeScreen onStart={() => setStarted(true)} />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-[480px] mx-auto px-5 py-6 min-h-screen flex flex-col">
        <TraitQuizProvider>
          <QuizContent />
        </TraitQuizProvider>
      </div>
    </main>
  );
}
