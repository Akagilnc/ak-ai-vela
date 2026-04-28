"use client";

/**
 * Trait quiz v0.6 state machine provider.
 *
 * Spec: research notes Section 6 + V8 mockup
 *
 * State: { currentIndex, answers, phase: 'idle'|'filling'|'complete', totalQuestions }
 * Persistence: localStorage 'vela:trait-quiz:v6:draft' (purged on reset)
 * v0.5 → v0.6 migration: ignore v0.5 keys, purge them on reset
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import { QUESTIONS } from "@/lib/traits/temperament/questions";

export const V6_DRAFT_KEY = "vela:trait-quiz:v6:draft";

// v0.5 keys to purge on v0.6 reset (per test plan §6.5 migration matrix)
const V0_5_LEGACY_KEYS = ["vela-trait-quiz-draft", "vela-trait-result"];

export type QuizPhase = "idle" | "filling" | "complete";

export interface QuizState {
  currentIndex: number;
  answers: Record<string, number>; // questionId → 1-5
  phase: QuizPhase;
  totalQuestions: number;
}

type QuizAction =
  | { type: "ANSWER"; questionId: string; value: number }
  | { type: "NEXT" }
  | { type: "PREV" }
  | { type: "SUBMIT" }
  | {
      type: "RESTORE";
      answers: Record<string, number>;
      currentIndex: number;
    }
  | { type: "RESET" };

const initialState: QuizState = {
  currentIndex: 0,
  answers: {},
  phase: "idle",
  totalQuestions: QUESTIONS.length,
};

function reducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case "ANSWER": {
      const next = { ...state.answers, [action.questionId]: action.value };
      return { ...state, answers: next, phase: "filling" };
    }
    case "NEXT": {
      const currentQ = QUESTIONS[state.currentIndex];
      // Block advance if current question unanswered
      if (currentQ === undefined || state.answers[currentQ.id] === undefined) {
        return state;
      }
      const nextIndex = Math.min(
        state.currentIndex + 1,
        QUESTIONS.length - 1,
      );
      return { ...state, currentIndex: nextIndex };
    }
    case "PREV": {
      const prevIndex = Math.max(0, state.currentIndex - 1);
      return { ...state, currentIndex: prevIndex };
    }
    case "SUBMIT": {
      const allAnswered = QUESTIONS.every(
        (q) => state.answers[q.id] !== undefined,
      );
      if (!allAnswered) return state;
      return { ...state, phase: "complete" };
    }
    case "RESTORE": {
      return {
        ...state,
        answers: action.answers,
        currentIndex: action.currentIndex,
        phase: "filling",
      };
    }
    case "RESET":
      return initialState;
  }
}

interface QuizContextValue {
  state: QuizState;
  answer: (questionId: string, value: number) => void;
  next: () => void;
  prev: () => void;
  submit: () => void;
  restoreDraft: (
    answers: Record<string, number>,
    currentIndex: number,
  ) => void;
  reset: () => void;
  isComplete: () => boolean;
}

const QuizContext = createContext<QuizContextValue | null>(null);

export function TraitQuizV6Provider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Persist draft to localStorage on state change (defensive try/catch for
  // private browsing / disabled storage). When the quiz reaches `complete`,
  // we PURGE the draft instead of writing — otherwise getDraftIfExists()
  // would resurface a finished session as a "filled to halfway" prompt
  // (Codex PR #33 R1 P2).
  useEffect(() => {
    if (state.phase === "idle") return; // don't persist empty initial state
    if (state.phase === "complete") {
      try {
        localStorage.removeItem(V6_DRAFT_KEY);
      } catch {
        /* noop */
      }
      return;
    }
    try {
      localStorage.setItem(
        V6_DRAFT_KEY,
        JSON.stringify({
          answers: state.answers,
          currentIndex: state.currentIndex,
          timestamp: Date.now(),
        }),
      );
    } catch {
      // private mode / disabled — silent fallback, in-memory state still works
    }
  }, [state.answers, state.currentIndex, state.phase]);

  const answer = useCallback((questionId: string, value: number) => {
    dispatch({ type: "ANSWER", questionId, value });
  }, []);

  const next = useCallback(() => dispatch({ type: "NEXT" }), []);
  const prev = useCallback(() => dispatch({ type: "PREV" }), []);
  const submit = useCallback(() => dispatch({ type: "SUBMIT" }), []);

  const restoreDraft = useCallback(
    (answers: Record<string, number>, currentIndex: number) => {
      dispatch({ type: "RESTORE", answers, currentIndex });
    },
    [],
  );

  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
    try {
      localStorage.removeItem(V6_DRAFT_KEY);
      // Purge v0.5 legacy keys on reset (slice 6 migration policy)
      for (const key of V0_5_LEGACY_KEYS) {
        localStorage.removeItem(key);
      }
    } catch {
      /* noop */
    }
  }, []);

  const isComplete = useCallback(
    () => QUESTIONS.every((q) => state.answers[q.id] !== undefined),
    [state.answers],
  );

  const value = useMemo<QuizContextValue>(
    () => ({
      state,
      answer,
      next,
      prev,
      submit,
      restoreDraft,
      reset,
      isComplete,
    }),
    [state, answer, next, prev, submit, restoreDraft, reset, isComplete],
  );

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
}

export function useTraitQuizV6() {
  const ctx = useContext(QuizContext);
  if (!ctx) {
    throw new Error("useTraitQuizV6 must be used within TraitQuizV6Provider");
  }
  return ctx;
}

/**
 * Detect if a v0.6 draft exists with at least one answer.
 * Validates shape — corrupted / tampered drafts are silently dropped.
 * Slice 4 quiz UI calls this on mount to decide whether to show resume banner.
 */
export function getDraftIfExists(): {
  answers: Record<string, number>;
  currentIndex: number;
} | null {
  try {
    const raw = localStorage.getItem(V6_DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;

    // Defensive validation — corrupted/tampered/older draft shapes return null
    // (silently fall back to "no draft" rather than crashing the UI).
    if (
      !parsed ||
      typeof parsed !== "object" ||
      !("answers" in parsed) ||
      !("currentIndex" in parsed)
    ) {
      return null;
    }
    const draft = parsed as {
      answers: unknown;
      currentIndex: unknown;
    };
    if (
      typeof draft.answers !== "object" ||
      draft.answers === null ||
      typeof draft.currentIndex !== "number" ||
      !Number.isInteger(draft.currentIndex) ||
      draft.currentIndex < 0
    ) {
      return null;
    }
    const validQuestionIds = new Set(QUESTIONS.map((q) => q.id));
    const answers = draft.answers as Record<string, unknown>;
    const cleanAnswers: Record<string, number> = {};
    for (const [key, val] of Object.entries(answers)) {
      if (!validQuestionIds.has(key)) continue; // drop unknown question ids
      if (
        typeof val !== "number" ||
        !Number.isFinite(val) ||
        val < 1 ||
        val > 5
      ) {
        return null; // invalid answer value → drop entire draft
      }
      cleanAnswers[key] = val;
    }
    if (Object.keys(cleanAnswers).length === 0) return null;
    const safeIndex = Math.min(
      draft.currentIndex,
      QUESTIONS.length - 1,
    );
    return { answers: cleanAnswers, currentIndex: safeIndex };
  } catch {
    return null;
  }
}
