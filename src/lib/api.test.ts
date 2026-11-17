import { describe, it, expect, vi, beforeEach } from "vitest";

const { tokens, fetchMock } = vi.hoisted(() => ({
  tokens: { staff: null as string | null, client: null as string | null },
  fetchMock: vi.fn(),
}));

vi.mock("./auth", () => ({
  getSessionToken: () => tokens.staff,
  SESSION_KEY: "paw-m:admin-session",
}));

vi.mock("./client-auth", () => ({
  getClientToken: () => tokens.client,
  CLIENT_SESSION_KEY: "paw-m:client-session",
}));

vi.mock("./storage", () => ({ storageRemove: vi.fn() }));

import { api } from "./api";

function authHeader(): string | null {
  const init = fetchMock.mock.calls.at(-1)?.[1] as RequestInit | undefined;
  return (init?.headers as Headers)?.get("Authorization") ?? null;
}

describe("api token selection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    tokens.staff = null;
    tokens.client = null;
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      headers: { get: () => null },
      json: async () => ({}),
    });
  });

  it("uses the client token for storefront order placement", async () => {
    tokens.staff = "staff-jwt";
    tokens.client = "client-token";
    await api.post("/orders", { source: "store", items: [] }, { auth: "client" });
    expect(authHeader()).toBe("Bearer client-token");
  });

  it("uses the staff token for counter/POS order placement", async () => {
    tokens.staff = "staff-jwt";
    tokens.client = "client-token";
    await api.post("/orders", { source: "pos", items: [] }, { auth: "staff" });
    expect(authHeader()).toBe("Bearer staff-jwt");
  });

  it("sends no token for anonymous guest checkout", async () => {
    await api.post("/orders", { source: "store", items: [] }, { auth: "client" });
    expect(authHeader()).toBeNull();
  });

  it("prefers the client token for client-owned reads", async () => {
    tokens.staff = "staff-jwt";
    tokens.client = "client-token";
    await api.get("/me");
    expect(authHeader()).toBe("Bearer client-token");
  });

  it("prefers the staff token for dashboard reads", async () => {
    tokens.staff = "staff-jwt";
    tokens.client = "client-token";
    await api.get("/orders");
    expect(authHeader()).toBe("Bearer staff-jwt");
  });
});
