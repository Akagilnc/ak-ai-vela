// @vitest-environment jsdom
/**
 * Tests for v0.6 trait quiz provider state machine.
 *
 * Spec: V8 mockup + research notes Section 1 + design doc 4-class flow
 *
 * State:
 *   - currentIndex: 0..29 (which question we're on)
 *   - answers: Record<questionId, 1-5> (sparse during fill)
 *   - phase: 'idle' | 'filling' | 'complete'
 *
 * Actions:
 *   - answer(questionId, value): record answer, auto-advance NOT used
 *     (per design doc 2026-04-29: 'manual next' to confirm selection)
 *   - next(): advance to next question
 *   - prev(): go back to previous
 *   - submit(): when all 30 answered, transition to 'complete'
 *   - restoreDraft(answers, currentIndex)
 *   - reset()
 *
 * Persistence: localStorage key 'vela:trait-quiz:v6:draft'
 */
import { describe, expect, it, beforeEach, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import {
  TraitQuizV6Provider,
  useTraitQuizV6,
  V6_DRAFT_KEY,
} from "../quiz-provider";
import { QUESTIONS } from "@/lib/traits/temperament/questions";
import type { ReactNode } from "react";

function wrapper({ children }: { children: ReactNode }) {
  return <TraitQuizV6Provider>{children}</TraitQuizV6Provider>;
}

beforeEach(() => {
  // Clear all localStorage between tests
  localStorage.clear();
});

describe("TraitQuizV6Provider — initial state", () => {
  it("starts at index 0, no answers, phase=idle", () => {
    const { result } = renderHook(() => useTraitQuizV6(), { wrapper });
    expect(result.current.state.currentIndex).toBe(0);
    expect(result.current.state.answers).toEqual({});
    expect(result.current.state.phase).toBe("idle");
  });

  it("exposes total question count", () => {
    const { result } = renderHook(() => useTraitQuizV6(), { wrapper });
    expect(result.current.state.totalQuestions).toBe(QUESTIONS.length);
  });
});

describe("answer + next flow", () => {
  it("answer() records value and stays at same index (no auto-advance)", () => {
    const { result } = renderHook(() => useTraitQuizV6(), { wrapper });
    const firstQuestion = QUESTIONS[0];
    act(() => {
      result.current.answer(firstQuestion.id, 4);
    });
    expect(result.current.state.answers[firstQuestion.id]).toBe(4);
    expect(result.current.state.currentIndex).toBe(0);
    expect(result.current.state.phase).toBe("filling");
  });

  it("next() advances index when current question is answered", () => {
    const { result } = renderHook(() => useTraitQuizV6(), { wrapper });
    act(() => {
      result.current.answer(QUESTIONS[0].id, 3);
    });
    act(() => {
      result.current.next();
    });
    expect(result.current.state.currentIndex).toBe(1);
  });

  it("next() does not advance when current question unanswered", () => {
    const { result } = renderHook(() => useTraitQuizV6(), { wrapper });
    act(() => {
      result.current.next();
    });
    expect(result.current.state.currentIndex).toBe(0); // blocked
  });

  it("prev() goes back if index > 0", () => {
    const { result } = renderHook(() => useTraitQuizV6(), { wrapper });
    act(() => {
      result.current.answer(QUESTIONS[0].id, 3);
      result.current.next();
    });
    expect(result.current.state.currentIndex).toBe(1);
    act(() => {
      result.current.prev();
    });
    expect(result.current.state.currentIndex).toBe(0);
  });

  it("prev() at index 0 stays at 0", () => {
    const { result } = renderHook(() => useTraitQuizV6(), { wrapper });
    act(() => {
      result.current.prev();
    });
    expect(result.current.state.currentIndex).toBe(0);
  });

  it("answer can update existing answer (re-pick)", () => {
    const { result } = renderHook(() => useTraitQuizV6(), { wrapper });
    act(() => {
      result.current.answer(QUESTIONS[0].id, 3);
    });
    act(() => {
      result.current.answer(QUESTIONS[0].id, 5);
    });
    expect(result.current.state.answers[QUESTIONS[0].id]).toBe(5);
  });
});

describe("submit + complete flow", () => {
  it("isComplete() true only when all 30 answered", () => {
    const { result } = renderHook(() => useTraitQuizV6(), { wrapper });
    expect(result.current.isComplete()).toBe(false);
    act(() => {
      // Answer all but last
      for (let i = 0; i < QUESTIONS.length - 1; i++) {
        result.current.answer(QUESTIONS[i].id, 3);
      }
    });
    expect(result.current.isComplete()).toBe(false);
    act(() => {
      result.current.answer(QUESTIONS[QUESTIONS.length - 1].id, 3);
    });
    expect(result.current.isComplete()).toBe(true);
  });

  it("submit() transitions phase to 'complete' if all answered", () => {
    const { result } = renderHook(() => useTraitQuizV6(), { wrapper });
    act(() => {
      for (const q of QUESTIONS) {
        result.current.answer(q.id, 3);
      }
      result.current.submit();
    });
    expect(result.current.state.phase).toBe("complete");
  });

  it("submit() refuses if any unanswered", () => {
    const { result } = renderHook(() => useTraitQuizV6(), { wrapper });
    act(() => {
      result.current.answer(QUESTIONS[0].id, 3);
      result.current.submit();
    });
    expect(result.current.state.phase).toBe("filling");
  });
});

describe("draft persistence", () => {
  it("saves draft to localStorage on answer", () => {
    const { result } = renderHook(() => useTraitQuizV6(), { wrapper });
    act(() => {
      result.current.answer(QUESTIONS[0].id, 4);
    });
    const raw = localStorage.getItem(V6_DRAFT_KEY);
    expect(raw).not.toBeNull();
    const draft = JSON.parse(raw!);
    expect(draft.answers[QUESTIONS[0].id]).toBe(4);
    expect(draft.currentIndex).toBe(0);
  });

  it("restoreDraft replays answers and currentIndex", () => {
    const { result } = renderHook(() => useTraitQuizV6(), { wrapper });
    const partial = { [QUESTIONS[0].id]: 4, [QUESTIONS[1].id]: 3 };
    act(() => {
      result.current.restoreDraft(partial, 2);
    });
    expect(result.current.state.answers).toEqual(partial);
    expect(result.current.state.currentIndex).toBe(2);
    expect(result.current.state.phase).toBe("filling");
  });

  it("reset clears state and removes draft", () => {
    const { result } = renderHook(() => useTraitQuizV6(), { wrapper });
    act(() => {
      result.current.answer(QUESTIONS[0].id, 4);
    });
    expect(localStorage.getItem(V6_DRAFT_KEY)).not.toBeNull();
    act(() => {
      result.current.reset();
    });
    expect(result.current.state.currentIndex).toBe(0);
    expect(result.current.state.answers).toEqual({});
    expect(result.current.state.phase).toBe("idle");
    expect(localStorage.getItem(V6_DRAFT_KEY)).toBeNull();
  });

  it("draft load fails silently when localStorage unavailable", () => {
    // Simulate disabled localStorage by overriding setItem to throw
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = vi.fn(() => {
      throw new Error("private mode");
    });

    const { result } = renderHook(() => useTraitQuizV6(), { wrapper });
    act(() => {
      result.current.answer(QUESTIONS[0].id, 3);
    });
    // Should not throw; answers in memory state still updated
    expect(result.current.state.answers[QUESTIONS[0].id]).toBe(3);

    Storage.prototype.setItem = originalSetItem;
  });
});

describe("v0.5 → v0.6 migration", () => {
  it("ignores v0.5 draft key 'vela-trait-quiz-draft' on init", () => {
    // Plant a fake v0.5 draft
    localStorage.setItem(
      "vela-trait-quiz-draft",
      JSON.stringify({
        answers: { ageGroup: "lower" },
        questionId: "interest",
        timestamp: Date.now(),
      }),
    );
    const { result } = renderHook(() => useTraitQuizV6(), { wrapper });
    // V6 starts fresh, doesn't pick up v0.5 draft
    expect(result.current.state.answers).toEqual({});
    expect(result.current.state.currentIndex).toBe(0);
  });

  it("purges v0.5 draft keys when v0.6 reset is called", () => {
    localStorage.setItem("vela-trait-quiz-draft", "{}");
    localStorage.setItem("vela-trait-result", "{}");
    const { result } = renderHook(() => useTraitQuizV6(), { wrapper });
    act(() => {
      result.current.reset();
    });
    expect(localStorage.getItem("vela-trait-quiz-draft")).toBeNull();
    expect(localStorage.getItem("vela-trait-result")).toBeNull();
  });
});
