import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { isAuthed, isLocked, isPinConfigured, logout, setPin, unlock, verifyPin } from "@/lib/auth";

class MemoryStorage {
  store = new Map<string, string>();
  getItem(key: string) {
    return this.store.get(key) ?? null;
  }
  setItem(key: string, value: string) {
    this.store.set(key, String(value));
  }
  removeItem(key: string) {
    this.store.delete(key);
  }
  clear() {
    this.store.clear();
  }
}

let local: MemoryStorage;
let session: MemoryStorage;

beforeEach(() => {
  local = new MemoryStorage();
  session = new MemoryStorage();
  vi.stubGlobal("window", {
    localStorage: local,
    sessionStorage: session,
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("auth", () => {
  it("allows first-run PIN setup", async () => {
    expect(isPinConfigured()).toBe(false);
    await setPin("", "1234");
    expect(isPinConfigured()).toBe(true);
    expect(await verifyPin("1234")).toBe(true);
    expect(await verifyPin("9999")).toBe(false);
  });

  it("rejects setting a PIN shorter than 4 chars", async () => {
    await expect(setPin("", "12")).rejects.toThrow("at least 4");
  });

  it("rejects a change when the current PIN is wrong", async () => {
    await setPin("", "1234");
    await expect(setPin("0000", "5678")).rejects.toThrow("incorrect");
    expect(await verifyPin("1234")).toBe(true);
  });

  it("changes the PIN when the current PIN matches", async () => {
    await setPin("", "1234");
    await setPin("1234", "5678");
    expect(await verifyPin("1234")).toBe(false);
    expect(await verifyPin("5678")).toBe(true);
  });

  it("unlock only succeeds with the correct PIN and opens a session", async () => {
    await setPin("", "1234");
    expect(await unlock("9999")).toBe(false);
    expect(isAuthed()).toBe(false);
    expect(await unlock("1234")).toBe(true);
    expect(isAuthed()).toBe(true);
  });

  it("locks after MAX_ATTEMPTS failed attempts", async () => {
    await setPin("", "1234");
    for (let i = 0; i < 5; i++) {
      await unlock("0000");
    }
    expect(isLocked()).toBe(true);
    expect(await unlock("1234")).toBe(false);
  });

  it("logout clears the session", async () => {
    await setPin("", "1234");
    await unlock("1234");
    expect(isAuthed()).toBe(true);
    logout();
    expect(isAuthed()).toBe(false);
  });

  it("hashes the PIN with a salt (not stored plaintext)", async () => {
    await setPin("", "1234");
    const stored = local.getItem("pawcare:admin-pin");
    expect(stored).not.toContain("1234");
    expect(stored!).toContain("hash");
    expect(stored!).toContain("salt");
  });
});
