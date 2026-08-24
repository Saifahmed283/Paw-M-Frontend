import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { api } from "@/lib/api";
import {
  changeCredentials,
  currentRole,
  currentUsername,
  hasMinRole,
  isAuthConfigured,
  isAuthed,
  isLocked,
  login,
  logout,
  register,
} from "@/lib/auth";

vi.mock("@/lib/api", () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

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
  vi.mocked(api.get).mockReset();
  vi.mocked(api.post).mockReset();
  vi.mocked(api.put).mockReset();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("auth", () => {
  it("allows first-run registration, then signs in", async () => {
    vi.mocked(api.get).mockResolvedValue({ configured: false });
    expect(await isAuthConfigured()).toBe(false);

    vi.mocked(api.post).mockResolvedValue({ configured: true });
    await register("admin", "staffpass");

    vi.mocked(api.get).mockResolvedValue({ configured: true });
    expect(await isAuthConfigured()).toBe(true);

    vi.mocked(api.post).mockResolvedValue({ ok: false });
    expect(await login("admin", "wrongpass")).toBe(false);

    vi.mocked(api.post).mockResolvedValue({ ok: true });
    expect(await login("admin", "staffpass")).toBe(true);
  });

  it("rejects a username or password that is too short", async () => {
    await expect(register("ab", "staffpass")).rejects.toThrow("at least 3");
    await expect(register("admin", "12345")).rejects.toThrow("at least 6");
    expect(api.post).not.toHaveBeenCalled();
  });

  it("login sends the credentials to the API", async () => {
    vi.mocked(api.post).mockResolvedValue({ ok: true });
    await login("Admin ", "staffpass");
    expect(api.post).toHaveBeenCalledWith("/auth/login", {
      username: "Admin",
      password: "staffpass",
    });
  });

  it("stores the username and role in the session and exposes them", async () => {
    vi.mocked(api.post).mockResolvedValue({ ok: true, role: "admin" });
    expect(await login("admin", "staffpass")).toBe(true);
    expect(isAuthed()).toBe(true);
    expect(currentUsername()).toBe("admin");
    expect(currentRole()).toBe("admin");
    expect(hasMinRole("payroll")).toBe(true);
  });

  it("defaults role to 'staff' when not returned by the API", async () => {
    vi.mocked(api.post).mockResolvedValue({ ok: true });
    expect(await login("admin", "staffpass")).toBe(true);
    expect(currentRole()).toBe("staff");
    expect(hasMinRole("admin")).toBe(false);
  });

  it("locks after MAX_ATTEMPTS failed attempts", async () => {
    vi.mocked(api.post).mockResolvedValue({ ok: false });
    for (let i = 0; i < 5; i++) {
      await login("admin", "wrong");
    }
    expect(isLocked()).toBe(true);
    vi.mocked(api.post).mockResolvedValue({ ok: true });
    expect(await login("admin", "staffpass")).toBe(false);
  });

  it("logout clears the session", async () => {
    vi.mocked(api.post).mockResolvedValue({ ok: true });
    await login("admin", "staffpass");
    expect(isAuthed()).toBe(true);
    logout();
    expect(isAuthed()).toBe(false);
  });

  it("changeCredentials forwards the new values", async () => {
    vi.mocked(api.put).mockResolvedValue({ configured: true });
    await changeCredentials({
      currentPassword: "staffpass",
      newUsername: "doctor",
      newPassword: "newpass1",
    });
    expect(api.put).toHaveBeenCalledWith("/auth/credentials", {
      currentPassword: "staffpass",
      newUsername: "doctor",
      newPassword: "newpass1",
    });
  });
});
