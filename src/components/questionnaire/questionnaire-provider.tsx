"use client";

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import type { QuestionnaireDraft } from "@/lib/types";

// --- Draft persistence ---

const STORAGE_KEY = "vela-questionnaire-draft";
const DRAFT_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const DEBOUNCE_MS = 300;

export type DraftInfo = {
  currentStep: number;
  data: QuestionnaireDraft;
  savedAt: string; // ISO string
};

function loadDraft(): DraftInfo | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DraftInfo;
    // Reject drafts with invalid or missing savedAt
    const savedTime = new Date(parsed.savedAt).getTime();
    if (Number.isNaN(savedTime)) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    // Reject drafts older than 7 days
    if (Date.now() - savedTime > DRAFT_MAX_AGE_MS) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    // Schema version check: reject if schemaVersion doesn't match
    if (parsed.data?.schemaVersion != null && parsed.data.schemaVersion !== 1) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    // Corrupt JSON, clear it
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
    console.warn("Cleared corrupt questionnaire draft from localStorage");
    return null;
  }
}

export function saveDraft(info: DraftInfo): boolean {
  if (typeof window === "undefined") return false;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(info));
    return true;
  } catch (e) {
    if (e instanceof DOMException && e.name === "QuotaExceededError") {
      console.warn("localStorage quota exceeded, draft not saved");
    }
    return false;
  }
}

export function clearDraft(): void {
  if (typeof window === "undefined") return;
  try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
}

export { loadDraft };

// --- Reducer ---

// Fields that belong to international schools only
const INTERNATIONAL_FIELDS = ["curriculumType", "ibDiploma", "apCourses"] as const;
// Fields that belong to public/private schools only
const PUBLIC_PRIVATE_FIELDS = ["gpaPercentage", "classRank"] as const;

type Action =
  | { type: "SET_FIELD"; field: string; value: unknown }
  | { type: "SET_FIELDS"; fields: Partial<QuestionnaireDraft> }
  | { type: "SET_STEP"; step: number }
  | { type: "RESTORE_DRAFT"; draft: DraftInfo }
  | { type: "CLEAR" }
  | { type: "SET_ARRAY_ITEM"; field: string; index: number; value: unknown }
  | { type: "ADD_ARRAY_ITEM"; field: string; value: unknown }
  | { type: "REMOVE_ARRAY_ITEM"; field: string; index: number }
  | { type: "MARK_SAVED"; savedAt: string };

type State = {
  data: QuestionnaireDraft;
  currentStep: number;
  isDirty: boolean;
  lastSavedAt: string | null;
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_FIELD": {
      const newData = { ...state.data, [action.field]: action.value };

      // Conditional field cleanup when schoolSystem changes
      if (action.field === "schoolSystem") {
        const system = action.value as string;
        if (system === "international") {
          for (const f of PUBLIC_PRIVATE_FIELDS) {
            delete newData[f];
          }
        } else if (system === "public" || system === "private") {
          for (const f of INTERNATIONAL_FIELDS) {
            delete newData[f];
          }
        }
      }

      return { ...state, data: newData, isDirty: true };
    }
    case "SET_FIELDS":
      return { ...state, data: { ...state.data, ...action.fields }, isDirty: true };
    case "SET_STEP":
      return { ...state, currentStep: action.step, isDirty: true };
    case "RESTORE_DRAFT":
      return {
        data: action.draft.data,
        currentStep: action.draft.currentStep,
        isDirty: false,
        lastSavedAt: action.draft.savedAt,
      };
    case "CLEAR":
      return {
        data: { schemaVersion: 1 },
        currentStep: 1,
        isDirty: false,
        lastSavedAt: null,
      };
    case "SET_ARRAY_ITEM": {
      const arr = [...((state.data[action.field as keyof QuestionnaireDraft] as unknown[]) || [])];
      arr[action.index] = action.value;
      return { ...state, data: { ...state.data, [action.field]: arr }, isDirty: true };
    }
    case "ADD_ARRAY_ITEM": {
      const arr = [...((state.data[action.field as keyof QuestionnaireDraft] as unknown[]) || [])];
      arr.push(action.value);
      return { ...state, data: { ...state.data, [action.field]: arr }, isDirty: true };
    }
    case "REMOVE_ARRAY_ITEM": {
      const arr = [...((state.data[action.field as keyof QuestionnaireDraft] as unknown[]) || [])];
      arr.splice(action.index, 1);
      return { ...state, data: { ...state.data, [action.field]: arr }, isDirty: true };
    }
    case "MARK_SAVED":
      return { ...state, isDirty: false, lastSavedAt: action.savedAt };
    default:
      return state;
  }
}

// --- Context ---

type QuestionnaireContextType = {
  data: QuestionnaireDraft;
  currentStep: number;
  lastSavedAt: string | null;
  setField: (field: string, value: unknown) => void;
  setFields: (fields: Partial<QuestionnaireDraft>) => void;
  setStep: (step: number) => void;
  setArrayItem: (field: string, index: number, value: unknown) => void;
  addArrayItem: (field: string, value: unknown) => void;
  removeArrayItem: (field: string, index: number) => void;
  clearAll: () => void;
  // `overrides.currentStep` lets callers persist a forward-looking step
  // number before dispatching the corresponding setStep, so a navigation
  // flush writes the draft at the target step instead of the stale one.
  flushSave: (overrides?: { currentStep?: number }) => void;
};

const QuestionnaireContext = createContext<QuestionnaireContextType | null>(null);

export function useQuestionnaire(): QuestionnaireContextType {
  const ctx = useContext(QuestionnaireContext);
  if (!ctx) {
    throw new Error("useQuestionnaire must be used within QuestionnaireProvider");
  }
  return ctx;
}

// --- Provider ---

export function QuestionnaireProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    data: { schemaVersion: 1 },
    currentStep: 1,
    isDirty: false,
    lastSavedAt: null,
  });

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  // Restore draft from localStorage on mount
  useEffect(() => {
    const saved = loadDraft();
    if (saved) {
      dispatch({ type: "RESTORE_DRAFT", draft: saved });
    }
  }, []);

  // Flush: cancel pending debounce, save immediately.
  // `overrides.currentStep` is for navigation flows where the caller already
  // knows the next step (e.g. handleNext clicking to step N+1) but hasn't
  // dispatched setStep yet — without the override, stateRef.current.currentStep
  // still points at the current step and the saved draft lags a step behind.
  const flushSave = useCallback(
    (overrides?: { currentStep?: number }) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
      const s = stateRef.current;
      const now = new Date().toISOString();
      const ok = saveDraft({
        currentStep: overrides?.currentStep ?? s.currentStep,
        data: s.data,
        savedAt: now,
      });
      if (ok) {
        dispatch({ type: "MARK_SAVED", savedAt: now });
      }
    },
    [],
  );

  // Debounced save on dirty changes
  useEffect(() => {
    if (!state.isDirty) return;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      const now = new Date().toISOString();
      const ok = saveDraft({
        currentStep: stateRef.current.currentStep,
        data: stateRef.current.data,
        savedAt: now,
      });
      if (ok) {
        dispatch({ type: "MARK_SAVED", savedAt: now });
      }
      debounceRef.current = null;
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [state.data, state.isDirty]);

  const setField = useCallback((field: string, value: unknown) => {
    dispatch({ type: "SET_FIELD", field, value });
  }, []);

  const setFields = useCallback((fields: Partial<QuestionnaireDraft>) => {
    dispatch({ type: "SET_FIELDS", fields });
  }, []);

  const setStep = useCallback((step: number) => {
    dispatch({ type: "SET_STEP", step });
  }, []);

  const setArrayItem = useCallback((field: string, index: number, value: unknown) => {
    dispatch({ type: "SET_ARRAY_ITEM", field, index, value });
  }, []);

  const addArrayItem = useCallback((field: string, value: unknown) => {
    dispatch({ type: "ADD_ARRAY_ITEM", field, value });
  }, []);

  const removeArrayItem = useCallback((field: string, index: number) => {
    dispatch({ type: "REMOVE_ARRAY_ITEM", field, index });
  }, []);

  const clearAll = useCallback(() => {
    clearDraft();
    dispatch({ type: "CLEAR" });
  }, []);

  return (
    <QuestionnaireContext.Provider
      value={{
        data: state.data,
        currentStep: state.currentStep,
        lastSavedAt: state.lastSavedAt,
        setField,
        setFields,
        setStep,
        setArrayItem,
        addArrayItem,
        removeArrayItem,
        clearAll,
        flushSave,
      }}
    >
      {children}
    </QuestionnaireContext.Provider>
  );
}
