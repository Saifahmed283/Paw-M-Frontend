/**
 * Safe localStorage / sessionStorage accessors that never throw.
 * Storage can be unavailable (private mode, sandboxed iframes, SSR), so every
 * read/write is wrapped in try/catch.
 */

export const SESSION_KEY = "paw-m:admin-session";

function storage(kind: "local" | "session"): Storage | null {
  try {
    return kind === "local" ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
}

export function storageGet(kind: "local" | "session", key: string): string | null {
  try {
    return storage(kind)?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

export function storageSet(kind: "local" | "session", key: string, value: string): void {
  try {
    storage(kind)?.setItem(key, value);
  } catch {
    /* noop */
  }
}

export function storageRemove(kind: "local" | "session", key: string): void {
  try {
    storage(kind)?.removeItem(key);
  } catch {
    /* noop */
  }
}
