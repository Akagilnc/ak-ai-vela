"use client";

/**
 * Trait quiz v0.6 — landing + 30-question flow + draft resume.
 *
 * Replaces v0.5's branching quiz. New flow:
 *   1. Welcome screen ("基于 Thomas & Chess 1956 9 维气质模型")
 *   2. Draft resume banner if v0.6 draft exists
 *   3. 30-question Likert flow with sequential per-dim ordering
 *   4. On submit → /trait-quiz/result?score=ABC123
 *
 * v0.5 → v0.6 migration: ignore old keys (`vela-trait-quiz-draft`,
 * `vela-trait-result`) on init; purge them when reset is called.
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  TraitQuizV6Provider,
  useTraitQuizV6,
  getDraftIfExists,
} from "@/components/trait-quiz/v6/quiz-provider";
import { QuizStep } from "@/components/trait-quiz/v6/quiz-step";
import {
  computeDimScores,
  QUESTIONS,
} from "@/lib/traits/temperament/questions";
import {
  encodeScore,
  quantizeDimScores,
} from "@/lib/traits/temperament/score-encoding";
import { classify, CLASSIFICATION_CONFIG } from "@/lib/traits/temperament/score";

function QuizContent({ onSubmitDone }: { onSubmitDone: (url: string) => void }) {
  const { state, restoreDraft, reset } = useTraitQuizV6();
  const [draftPrompt, setDraftPrompt] = useState<
    { answers: Record<string, number>; currentIndex: number } | null
  >(null);
  const [draftChecked, setDraftChecked] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (draftChecked) return;
    setDraftChecked(true);
    const draft = getDraftIfExists();
    if (draft) setDraftPrompt(draft);
  }, [draftChecked]);

  // Watch for completion → encode score URL → navigate
  useEffect(() => {
    if (state.phase !== "complete") return;
    try {
      // Compute dim scores from raw answers
      const dimScores = computeDimScores(state.answers);
      // Quantize for URL roundtrip safety (Slice 2 invariant)
      const quantized = quantizeDimScores(dimScores);
      // Live classify (with allRawAnswers) to compute lowConfidenceFlag
      const liveResult = classify({
        scores: quantized,
        allRawAnswers: Object.values(state.answers),
        config: CLASSIFICATION_CONFIG,
      });
      // Encode URL with classification metadata
      const score = encodeScore({
        schemaVersion: 1,
        cutoffVersion: 1,
        dims: quantized,
        lowConfidenceFlag: liveResult.confidence === "low",
      });
      onSubmitDone(`/trait-quiz/result?score=${score}`);
    } catch (err) {
      // Should be unreachable since computeDimScores validates 1-5 and
      // encodeScore validates dims. Defense-in-depth: surface error to user
      // instead of stranding them on the spinner indefinitely.
      console.error("trait-quiz v0.6 encode failed", err);
      setSubmitError(err instanceof Error ? err.message : "submit failed");
    }
  }, [state.phase, state.answers, onSubmitDone]);

  // Submit error state — let user retry or reset
  if (submitError) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 animate-fade-in text-center px-4">
        <div className="w-16 h-16 rounded-full bg-trait-strong-from/10 grid place-items-center text-2xl text-trait-strong-text">
          !
        </div>
        <h3 className="font-display text-[20px] text-vela-heading font-semibold">
          生成画像出错了
        </h3>
        <p className="text-sm text-vela-text-1 max-w-[300px] leading-relaxed">
          填的内容好像有点问题。重新填一遍通常能解决。
        </p>
        <button
          type="button"
          onClick={() => {
            reset();
            setSubmitError(null);
          }}
          className="min-h-[48px] px-8 bg-vela-primary text-white rounded-lg font-semibold"
        >
          重新测一次
        </button>
      </div>
    );
  }

  // Draft resume banner
  if (draftPrompt) {
    const filled = Object.keys(draftPrompt.answers).length;
    return (
      <div className="flex-1 flex items-center justify-center animate-fade-in">
        <div className="bg-vela-surface border border-vela-border rounded-xl p-6 max-w-sm text-left w-full">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-2 h-2 rounded-full bg-trait-notable-text shrink-0" />
            <h3 className="font-display font-semibold text-base text-vela-heading">
              你之前填到一半
            </h3>
          </div>
          <p className="text-sm text-vela-text-1 leading-relaxed mb-4">
            上次填到第 {filled} 题（共 {QUESTIONS.length} 题）。继续填还是从头开始？
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                restoreDraft(draftPrompt.answers, draftPrompt.currentIndex);
                setDraftPrompt(null);
              }}
              className="flex-1 min-h-[44px] px-4 py-2.5 bg-vela-primary text-white rounded-lg font-semibold text-sm hover:bg-vela-primary-dark"
            >
              继续填
            </button>
            <button
              type="button"
              onClick={() => {
                reset();
                setDraftPrompt(null);
              }}
              className="flex-1 min-h-[44px] px-4 py-2.5 border border-vela-primary text-vela-primary rounded-lg font-semibold text-sm hover:bg-vela-primary/5"
            >
              从头开始
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading state during submit → result navigation
  if (state.phase === "complete") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 animate-fade-in">
        <div className="w-12 h-12 border-[3px] border-vela-primary/15 border-t-vela-primary rounded-full animate-spin" />
        <p className="text-vela-text-2 text-sm">正在生成画像...</p>
      </div>
    );
  }

  // Default: quiz step
  return <QuizStep onSubmit={() => {}} onExit={() => reset()} />;
}

function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center gap-8 px-2">
      <div className="w-20 h-20 bg-vela-primary rounded-full flex items-center justify-center shadow-md">
        <span className="font-display text-3xl text-white font-bold">气</span>
      </div>
      <div>
        <h1 className="text-[28px] font-display font-semibold text-vela-heading leading-tight">
          基于行为观察<br />识别孩子的气质
        </h1>
      </div>
      <p className="text-[15px] text-vela-text-1 max-w-[320px] leading-relaxed">
        回答 {QUESTIONS.length} 道关于孩子日常表现的题，得到 9 维气质画像 + 综合类型解读。
      </p>
      <button
        type="button"
        onClick={onStart}
        className="min-h-[48px] px-12 py-3.5 bg-vela-primary text-white rounded-lg text-base font-semibold hover:bg-vela-primary-dark active:scale-[0.98] transition"
      >
        开始测评
      </button>
      <p className="text-sm text-vela-text-2">
        {QUESTIONS.length} 道题 · 约 8-12 分钟
      </p>
      <p className="text-[11px] text-vela-muted leading-[1.5] max-w-[300px] mt-auto">
        基于 Thomas &amp; Chess 1956 NYU 9 维气质模型
      </p>
    </div>
  );
}

export default function TraitQuizPage() {
  const router = useRouter();
  const [started, setStarted] = useState(false);

  if (!started) {
    return (
      <main className="min-h-[100dvh] bg-background">
        <div className="max-w-[480px] mx-auto px-4 py-6 min-h-[100dvh] flex flex-col">
          <WelcomeScreen onStart={() => setStarted(true)} />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[100dvh] bg-background">
      <div className="max-w-[480px] mx-auto px-4 pb-6 min-h-[100dvh] flex flex-col">
        <TraitQuizV6Provider>
          <QuizContent onSubmitDone={(url) => router.push(url)} />
        </TraitQuizV6Provider>
      </div>
    </main>
  );
}
