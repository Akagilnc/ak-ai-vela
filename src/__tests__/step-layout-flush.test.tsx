// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { useEffect } from "react";

// --- localStorage mock ---
// Node 25+ with --webstorage enabled installs a native localStorage on
// globalThis before vitest's jsdom env runs, and because "localStorage" in
// global is already true, populateGlobal skips it and never wires jsdom's
// Storage through. The native one ends up broken ("localstorage-file
// provided without a valid path"). Override with a pure in-memory mock
// BEFORE importing the provider so saveDraft/loadDraft hit this storage.
const STORAGE_KEY = "vela-questionnaire-draft";
const storage: Record<string, string> = {};
const localStorageMock = {
  getItem: (key: string): string | null => storage[key] ?? null,
  setItem: (key: string, value: string) => {
    storage[key] = value;
  },
  removeItem: (key: string) => {
    delete storage[key];
  },
  clear: () => {
    Object.keys(storage).forEach((k) => delete storage[k]);
  },
  get length() {
    return Object.keys(storage).length;
  },
  key: (index: number) => Object.keys(storage)[index] ?? null,
};
Object.defineProperty(globalThis, "localStorage", {
  value: localStorageMock,
  writable: true,
  configurable: true,
});

// Mock next/navigation so StepLayout can useRouter() under jsdom
const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock, replace: vi.fn(), back: vi.fn() }),
}));

// Mock field-hint to avoid deep import chains
vi.mock("@/components/questionnaire/field-hint", () => ({
  FieldHint: ({ hint }: { hint: string }) => <span>{hint}</span>,
}));

import {
  QuestionnaireProvider,
  useQuestionnaire,
} from "@/components/questionnaire/questionnaire-provider";
import { StepLayout } from "@/components/questionnaire/step-layout";

// Helper: read currentStep from the persisted draft
function readPersistedStep(): number | null {
  const raw = localStorageMock.getItem(STORAGE_KEY);
  if (!raw) return null;
  const parsed = JSON.parse(raw) as { currentStep: number };
  return parsed.currentStep;
}

// Tiny seed component that sets initial state via useEffect, then forces
// the step. useEffect runs after the provider has mounted AND the state
// updates are scheduled inside React's normal flow (as opposed to
// queueMicrotask which can run outside any act() boundary and never drive
// the provider's debounce effect).
function SeedState({ step }: { step: number }) {
  const { setField, setStep } = useQuestionnaire();
  useEffect(() => {
    setField("childName", "测试学生");
    setStep(step);
    // Only seed once per mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

describe("StepLayout flushSave ordering (P2.2)", () => {
  beforeEach(() => {
    localStorageMock.clear();
    pushMock.mockClear();
  });

  it("handleNext persists the NEXT step, not the current step", async () => {
    // User is on step 3. handleNext should write currentStep=4 to the
    // draft BEFORE navigating away, so a reload lands the user on step 4.
    render(
      <QuestionnaireProvider>
        <SeedState step={3} />
        <StepLayout step={3} title="Step 3">
          <div>step 3 content</div>
        </StepLayout>
      </QuestionnaireProvider>,
    );

    // Let the SeedState's queueMicrotask + provider debounce (300ms) settle
    await act(async () => {
      await new Promise((r) => setTimeout(r, 400));
    });

    // Sanity: draft should reflect the seeded state
    expect(readPersistedStep()).toBe(3);

    // Click next
    const nextBtn = screen.getByRole("button", { name: /下一步/ });
    await act(async () => {
      nextBtn.click();
    });

    // The critical assertion: draft must show currentStep=4 IMMEDIATELY
    // after click (before any debounce). The bug was that flushSave ran
    // with the stale stateRef (currentStep=3) before setStep dispatched.
    expect(readPersistedStep()).toBe(4);
    expect(pushMock).toHaveBeenCalledWith("/questionnaire/step/4");
  });

  it("handlePrev persists the PREVIOUS step, not the current step", async () => {
    render(
      <QuestionnaireProvider>
        <SeedState step={5} />
        <StepLayout step={5} title="Step 5">
          <div>step 5 content</div>
        </StepLayout>
      </QuestionnaireProvider>,
    );

    await act(async () => {
      await new Promise((r) => setTimeout(r, 400));
    });

    expect(readPersistedStep()).toBe(5);

    const prevBtn = screen.getByRole("button", { name: /上一步/ });
    await act(async () => {
      prevBtn.click();
    });

    expect(readPersistedStep()).toBe(4);
    expect(pushMock).toHaveBeenCalledWith("/questionnaire/step/4");
  });
});
