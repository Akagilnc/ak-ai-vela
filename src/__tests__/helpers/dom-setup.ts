/**
 * jsdom 29 + vitest 4 quirk: localStorage exists as a stub but methods are
 * undefined. Polyfill with an in-memory implementation for component tests.
 *
 * This setup file is loaded for tests under src/components/** via vitest.config.
 */

class InMemoryStorage implements Storage {
  private store = new Map<string, string>();

  get length() {
    return this.store.size;
  }

  clear() {
    this.store.clear();
  }

  getItem(key: string): string | null {
    return this.store.has(key) ? this.store.get(key)! : null;
  }

  setItem(key: string, value: string) {
    this.store.set(key, String(value));
  }

  removeItem(key: string) {
    this.store.delete(key);
  }

  key(index: number): string | null {
    const keys = Array.from(this.store.keys());
    return keys[index] ?? null;
  }
}

if (typeof globalThis.localStorage === "undefined" || typeof globalThis.localStorage?.clear !== "function") {
  Object.defineProperty(globalThis, "localStorage", {
    value: new InMemoryStorage(),
    writable: true,
    configurable: true,
  });
}

if (typeof globalThis.sessionStorage === "undefined" || typeof globalThis.sessionStorage?.clear !== "function") {
  Object.defineProperty(globalThis, "sessionStorage", {
    value: new InMemoryStorage(),
    writable: true,
    configurable: true,
  });
}
