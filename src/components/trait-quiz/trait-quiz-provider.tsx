"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import type { ReactNode } from "react";
import type { TraitAnswers } from "@/lib/traits/types";
import { QUESTIONS, FIRST_QUESTION_ID, buildQuestionFlow, TOTAL_TRAIT_QUESTIONS } from "@/lib/traits/questions";
import { matchRoute } from "@/lib/traits/match";
import { generatePortrait } from "@/lib/traits/portraits";
import { generateInsight } from "@/lib/traits/insights";

// ── State ──────────────────────────────────────────────────────────
type QuizState = {
  answers: Partial<TraitAnswers>;
  currentQuestionId: string;
  questionFlow: string[];
  // "quiz" | "insight" | "complete"
  phase: "quiz" | "insight" | "complete";
  hasDraft: boolean;
};

type QuizAction =
  | { type: "ANSWER"; questionId: string; key: keyof TraitAnswers; value: string }
  | { type: "BACK" }
  | { type: "DISMISS_INSIGHT" }
  | { type: "RESTORE_DRAFT"; answers: Partial<TraitAnswers>; questionId: string }
  | { type: "RESTART" };

const STORAGE_KEY = "vela-trait-quiz-draft";
// Show insight card after Q3 (interestDetail answered)
const INSIGHT_AFTER_QUESTION_INDEX = 2; // 0-based: ageGroup(0), interest(1), interestDetail(2)

function reducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case "ANSWER": {
      const newAnswers = { ...state.answers, [action.key]: action.value };
      const newFlow = buildQuestionFlow(newAnswers);
      const currentIndex = newFlow.indexOf(action.questionId);

      // Check if we should show insight card
      if (currentIndex === INSIGHT_AFTER_QUESTION_INDEX && newAnswers.interest && newAnswers.interestDetail) {
        return {
          ...state,
          answers: newAnswers,
          questionFlow: newFlow,
          phase: "insight",
          hasDraft: true,
        };
      }

      // Check if this was the last question
      const nextIndex = currentIndex + 1;
      if (nextIndex >= newFlow.length) {
        return {
          ...state,
          answers: newAnswers,
          questionFlow: newFlow,
          phase: "complete",
          hasDraft: false,
        };
      }

      return {
        ...state,
        answers: newAnswers,
        currentQuestionId: newFlow[nextIndex],
        questionFlow: newFlow,
        hasDraft: true,
      };
    }

    case "BACK": {
      const currentIndex = state.questionFlow.indexOf(state.currentQuestionId);
      if (currentIndex <= 0) return state;

      const prevId = state.questionFlow[currentIndex - 1];
      const prevQ = QUESTIONS[prevId];
      if (!prevQ) return state;

      // Reset downstream answers when going back across branch point
      const newAnswers = { ...state.answers };
      // Remove answers for current question and any downstream
      for (let i = currentIndex; i < state.questionFlow.length; i++) {
        const qId = state.questionFlow[i];
        const q = QUESTIONS[qId];
        if (q) delete newAnswers[q.key];
      }

      const newFlow = buildQuestionFlow(newAnswers);
      return {
        ...state,
        answers: newAnswers,
        currentQuestionId: prevId,
        questionFlow: newFlow,
        hasDraft: true,
      };
    }

    case "DISMISS_INSIGHT": {
      // After insight card, continue to next question
      const currentIndex = state.questionFlow.indexOf(state.currentQuestionId);
      const nextId = state.questionFlow[currentIndex + 1];
      if (!nextId) return { ...state, phase: "complete" };
      return {
        ...state,
        currentQuestionId: nextId,
        phase: "quiz",
      };
    }

    case "RESTORE_DRAFT": {
      const flow = buildQuestionFlow(action.answers);
      // Validate questionId exists in the computed flow; fallback to first question
      const validId = flow.includes(action.questionId) ? action.questionId : FIRST_QUESTION_ID;
      return {
        answers: flow.includes(action.questionId) ? action.answers : {},
        currentQuestionId: validId,
        questionFlow: flow.includes(action.questionId) ? flow : buildQuestionFlow({}),
        phase: "quiz",
        hasDraft: true,
      };
    }

    case "RESTART": {
      const flow = buildQuestionFlow({});
      return {
        answers: {},
        currentQuestionId: FIRST_QUESTION_ID,
        questionFlow: flow,
        phase: "quiz",
        hasDraft: false,
      };
    }

    default:
      return state;
  }
}

// ── Context ────────────────────────────────────────────────────────
type QuizContextValue = {
  state: QuizState;
  currentQuestion: (typeof QUESTIONS)[string] | null;
  currentIndex: number;
  totalQuestions: number;
  insightText: string | null;
  answer: (questionId: string, key: keyof TraitAnswers, value: string) => void;
  goBack: () => void;
  dismissInsight: () => void;
  restoreDraft: (answers: Partial<TraitAnswers>, questionId: string) => void;
  restart: () => void;
  // Result helpers
  routeId: string | null;
  portrait: { title: string; description: string } | null;
};

const QuizContext = createContext<QuizContextValue | null>(null);

export function useTraitQuiz() {
  const ctx = useContext(QuizContext);
  if (!ctx) throw new Error("useTraitQuiz must be used within TraitQuizProvider");
  return ctx;
}

// ── Provider ───────────────────────────────────────────────────────
export function TraitQuizProvider({ children }: { children: ReactNode }) {
  const initialFlow = buildQuestionFlow({});
  const [state, dispatch] = useReducer(reducer, {
    answers: {},
    currentQuestionId: FIRST_QUESTION_ID,
    questionFlow: initialFlow,
    phase: "quiz",
    hasDraft: false,
  });

  // Save draft to localStorage
  useEffect(() => {
    if (!state.hasDraft) return;
    try {
      const draft = {
        answers: state.answers,
        questionId: state.currentQuestionId,
        timestamp: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch {
      // localStorage full or private browsing — silent fallback
    }
  }, [state.answers, state.currentQuestionId, state.hasDraft]);

  const answer = useCallback((questionId: string, key: keyof TraitAnswers, value: string) => {
    dispatch({ type: "ANSWER", questionId, key, value });
  }, []);

  const goBack = useCallback(() => {
    dispatch({ type: "BACK" });
  }, []);

  const dismissInsight = useCallback(() => {
    dispatch({ type: "DISMISS_INSIGHT" });
  }, []);

  const restoreDraft = useCallback((answers: Partial<TraitAnswers>, questionId: string) => {
    dispatch({ type: "RESTORE_DRAFT", answers, questionId });
  }, []);

  const restart = useCallback(() => {
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* noop */ }
    dispatch({ type: "RESTART" });
  }, []);

  const currentQuestion = QUESTIONS[state.currentQuestionId] ?? null;
  const currentIndex = state.questionFlow.indexOf(state.currentQuestionId);

  const insightText = useMemo(() => {
    if (state.answers.interest && state.answers.interestDetail) {
      return generateInsight(state.answers.interest, state.answers.interestDetail);
    }
    return null;
  }, [state.answers.interest, state.answers.interestDetail]);

  const routeId = useMemo(() => {
    if (state.phase !== "complete") return null;
    try {
      return matchRoute(state.answers as TraitAnswers);
    } catch {
      return null;
    }
  }, [state.phase, state.answers]);

  const portrait = useMemo(() => {
    if (state.phase !== "complete") return null;
    try {
      return generatePortrait(state.answers as TraitAnswers);
    } catch {
      return null;
    }
  }, [state.phase, state.answers]);

  const value = useMemo<QuizContextValue>(() => ({
    state,
    currentQuestion,
    currentIndex,
    totalQuestions: TOTAL_TRAIT_QUESTIONS,
    insightText,
    answer,
    goBack,
    dismissInsight,
    restoreDraft,
    restart,
    routeId,
    portrait,
  }), [state, currentQuestion, currentIndex, insightText, answer, goBack, dismissInsight, restoreDraft, restart, routeId, portrait]);

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
}

// Export storage key for draft checking
export { STORAGE_KEY };
