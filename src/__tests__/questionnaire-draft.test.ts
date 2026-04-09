import { describe, it, expect, beforeEach } from "vitest";

const STORAGE_KEY = "vela-questionnaire-draft";

// Create a proper localStorage mock before importing modules
const storage: Record<string, string> = {};
const localStorageMock = {
  getItem: (key: string): string | null => storage[key] ?? null,
  setItem: (key: string, value: string) => { storage[key] = value; },
  removeItem: (key: string) => { delete storage[key]; },
  clear: () => { Object.keys(storage).forEach((k) => delete storage[k]); },
  get length() { return Object.keys(storage).length; },
  key: (index: number) => Object.keys(storage)[index] ?? null,
};

// Define on globalThis before module import
Object.defineProperty(globalThis, "window", {
  value: { localStorage: localStorageMock },
  writable: true,
});
Object.defineProperty(globalThis, "localStorage", {
  value: localStorageMock,
  writable: true,
});

// Now import the module (it will see our mocked window/localStorage)
const { loadDraft, clearDraft, saveDraft } = await import(
  "@/components/questionnaire/questionnaire-provider"
);

describe("questionnaire draft persistence", () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it("returns null when no draft exists", () => {
    expect(loadDraft()).toBeNull();
  });

  it("returns null for corrupt JSON", () => {
    localStorageMock.setItem(STORAGE_KEY, "not-json{{{");
    const result = loadDraft();
    expect(result).toBeNull();
    // Should have cleared the corrupt data
    expect(localStorageMock.getItem(STORAGE_KEY)).toBeNull();
  });

  it("returns null for expired draft (>7 days)", () => {
    const eightDaysAgo = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString();
    localStorageMock.setItem(
      STORAGE_KEY,
      JSON.stringify({
        currentStep: 3,
        data: { schemaVersion: 1, childName: "Test" },
        savedAt: eightDaysAgo,
      })
    );
    expect(loadDraft()).toBeNull();
  });

  it("returns draft within 7 days", () => {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const draft = {
      currentStep: 3,
      data: { schemaVersion: 1, childName: "张小明" },
      savedAt: oneHourAgo,
    };
    localStorageMock.setItem(STORAGE_KEY, JSON.stringify(draft));
    const result = loadDraft();
    expect(result).not.toBeNull();
    expect(result!.currentStep).toBe(3);
    expect(result!.data.childName).toBe("张小明");
  });

  it("rejects draft with wrong schemaVersion", () => {
    const now = new Date().toISOString();
    localStorageMock.setItem(
      STORAGE_KEY,
      JSON.stringify({
        currentStep: 1,
        data: { schemaVersion: 99 },
        savedAt: now,
      })
    );
    expect(loadDraft()).toBeNull();
  });

  it("accepts draft with schemaVersion 1", () => {
    const now = new Date().toISOString();
    localStorageMock.setItem(
      STORAGE_KEY,
      JSON.stringify({
        currentStep: 5,
        data: { schemaVersion: 1, childName: "Test" },
        savedAt: now,
      })
    );
    const result = loadDraft();
    expect(result).not.toBeNull();
    expect(result!.currentStep).toBe(5);
  });

  it("clearDraft removes the storage key", () => {
    localStorageMock.setItem(STORAGE_KEY, "something");
    clearDraft();
    expect(localStorageMock.getItem(STORAGE_KEY)).toBeNull();
  });

  it("returns null for invalid savedAt timestamp", () => {
    localStorageMock.setItem(
      STORAGE_KEY,
      JSON.stringify({
        currentStep: 2,
        data: { schemaVersion: 1, childName: "Test" },
        savedAt: "not-a-date",
      })
    );
    // Invalid savedAt should be treated as expired/invalid, not silently accepted
    expect(loadDraft()).toBeNull();
  });

  it("saveDraft returns true on success", () => {
    const info = {
      currentStep: 1,
      data: { schemaVersion: 1 as const, childName: "Test" },
      savedAt: new Date().toISOString(),
    };
    expect(saveDraft(info)).toBe(true);
  });

  it("saveDraft returns false on quota exceeded", () => {
    const origSetItem = localStorageMock.setItem;
    try {
      localStorageMock.setItem = () => {
        throw new DOMException("quota exceeded", "QuotaExceededError");
      };
      const info = {
        currentStep: 1,
        data: { schemaVersion: 1 as const, childName: "Test" },
        savedAt: new Date().toISOString(),
      };
      expect(saveDraft(info)).toBe(false);
    } finally {
      localStorageMock.setItem = origSetItem;
    }
  });

  it("returns null for empty savedAt", () => {
    localStorageMock.setItem(
      STORAGE_KEY,
      JSON.stringify({
        currentStep: 2,
        data: { schemaVersion: 1, childName: "Test" },
        savedAt: "",
      })
    );
    expect(loadDraft()).toBeNull();
  });
});
