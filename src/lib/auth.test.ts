import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { api } from "@/lib/api";
import {
  changeCredentials,
  currentRole,
  currentUsername,
  hasMinRole,
  isAuthed,
  isLocked,
  login,
  logout,
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
  it("rejects bad credentials and accepts good ones", async () => {
    vi.mocked(api.post).mockResolvedValue({ ok: false });
    expect(await login("admin", "wrongpass")).toBe(false);

    vi.mocked(api.post).mockResolvedValue({ ok: true, role: "admin" });
    expect(await login("admin", "staffpass")).toBe(true);
  });

  it("propagates API failures so the gate can tell them from bad credentials", async () => {
    // login() rethrows whatever the transport raised; the dashboard gate reads
    // `.status` off an ApiError to pick the right message.
    vi.mocked(api.post).mockRejectedValue({ name: "ApiError", status: 400, message: "API 400" });
    await expect(login("admin", "")).rejects.toMatchObject({ status: 400 });

    vi.mocked(api.post).mockRejectedValue({
      name: "ApiError",
      status: 429,
      message: "API 429",
      retryAfterMinutes: 7,
    });
    await expect(login("admin", "staffpass")).rejects.toMatchObject({
      status: 429,
      retryAfterMinutes: 7,
    });

    // A plain network failure is not an ApiError but must still reject, never
    // resolve to false (which the gate would render as "invalid credentials").
    vi.mocked(api.post).mockRejectedValue(new TypeError("Failed to fetch"));
    await expect(login("admin", "staffpass")).rejects.toBeInstanceOf(TypeError);

    expect(isAuthed()).toBe(false);
  });

  it("login sends the credentials to the API", async () => {
    vi.mocked(api.post).mockResolvedValue({ ok: true, role: "staff" });
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

  it("allows unlimited login attempts without lockout", async () => {
    vi.mocked(api.post).mockResolvedValue({ ok: false });
    for (let i = 0; i < 10; i++) {
      expect(await login("admin", "wrong")).toBe(false);
      expect(isLocked()).toBe(false);
    }
    vi.mocked(api.post).mockResolvedValue({ ok: true, role: "staff" });
    expect(await login("admin", "staffpass")).toBe(true);
  });

  it("logout calls the API and clears the session", async () => {
    vi.mocked(api.post).mockResolvedValue({ ok: true, role: "admin" });
    await login("admin", "staffpass");
    expect(isAuthed()).toBe(true);

    vi.mocked(api.post).mockResolvedValue({ ok: true });
    await logout();
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
