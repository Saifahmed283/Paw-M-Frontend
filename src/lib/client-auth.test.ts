import { describe, it, expect, vi, beforeEach } from "vitest";

const store: Record<string, string> = {};
vi.mock("./storage", () => ({
  storageGet: vi.fn((_scope: string, key: string) => store[key] ?? null),
  storageSet: vi.fn((_scope: string, key: string, value: string) => {
    store[key] = value;
  }),
  storageRemove: vi.fn((_scope: string, key: string) => {
    delete store[key];
  }),
}));

vi.mock("./api", () => ({
  api: {
    post: vi.fn(),
  },
}));

import { api } from "./api";
import {
  currentClient,
  clientIsAuthed,
  requestClientVerification,
  verifyClientEmail,
  loginClient,
  logoutClient,
  CLIENT_SESSION_KEY,
} from "./client-auth";

const mockClient = {
  id: "c-1",
  email: "client@test.com",
  fullName: "Test Client",
  phone: "01234567890",
};

const mockSession = {
  token: "tok-abc123",
  client: mockClient,
};

describe("client-auth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete store[`session:${CLIENT_SESSION_KEY}`];
  });

  it("currentClient returns null when no session", () => {
    expect(currentClient()).toBeNull();
  });

  it("clientIsAuthed returns false when no session", () => {
    expect(clientIsAuthed()).toBe(false);
  });

  it("requestClientVerification calls api.post", async () => {
    vi.mocked(api.post).mockResolvedValue(undefined);
    await requestClientVerification({
      fullName: "Test",
      email: "test@test.com",
      phone: "01234567890",
      password: "pass123",
    });
    expect(api.post).toHaveBeenCalledWith("/client-auth/register", {
      fullName: "Test",
      email: "test@test.com",
      phone: "01234567890",
      password: "pass123",
    });
  });

  it("verifyClientEmail stores session and returns client", async () => {
    vi.mocked(api.post).mockResolvedValue(mockSession);
    const client = await verifyClientEmail("client@test.com", "123456");
    expect(client).toEqual(mockClient);
    expect(api.post).toHaveBeenCalledWith("/client-auth/verify", {
      email: "client@test.com",
      code: "123456",
    });
  });

  it("loginClient stores session and returns client", async () => {
    vi.mocked(api.post).mockResolvedValue(mockSession);
    const client = await loginClient("client@test.com", "pass123");
    expect(client).toEqual(mockClient);
    expect(api.post).toHaveBeenCalledWith("/client-auth/login", {
      email: "client@test.com",
      password: "pass123",
    });
  });

  it("logoutClient clears session", async () => {
    store[`session:${CLIENT_SESSION_KEY}`] = JSON.stringify(mockSession);
    vi.mocked(api.post).mockResolvedValue(undefined);
    await logoutClient();
    expect(currentClient()).toBeNull();
    expect(clientIsAuthed()).toBe(false);
  });
});
