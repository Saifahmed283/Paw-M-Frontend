import { getSessionToken, SESSION_KEY as ADMIN_SESSION_KEY } from "@/lib/auth";
import { storageRemove } from "@/lib/storage";
import { CLIENT_SESSION_KEY, getClientToken } from "@/lib/client-auth";

const ENV_API_BASE =
  typeof import.meta !== "undefined"
    ? ((import.meta as { env?: Record<string, string | undefined> }).env?.["VITE_API_URL"] ?? "")
    : "";

// When VITE_API_URL is not set, derive the API origin from the page's own
// host so LAN access and port-forwarding to the app port work on a phone
// without hardcoding an IP. The backend runs on the sibling port 3001 for the
// Vite dev (5173) and preview (4173) ports. During SSR (no window) the
// backend is always local to the server process, so fall back to localhost.
function resolveApiBase(): string {
  if (ENV_API_BASE) return ENV_API_BASE;
  if (typeof window !== "undefined" && typeof window.location !== "undefined") {
    const { protocol, hostname, port } = window.location;
    const apiPort = port === "5173" || port === "4173" ? "3001" : port;
    return `${protocol}//${hostname}${apiPort ? `:${apiPort}` : ""}/api`;
  }
  return "http://localhost:3001/api";
}

const API_BASE = resolveApiBase();

export type PaginatedResult<T> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
};

// Carries the HTTP status so callers (notably the React Query retry policy) can
// distinguish a transient server fault from a client error that will never
// succeed on a retry, such as a 429 once the rate-limit budget is spent.
export class ApiError extends Error {
  readonly status: number;
  /** Minutes until a rate-limited window resets, from the RateLimit-Reset header. */
  readonly retryAfterMinutes?: number;

  constructor(status: number, message: string, retryAfterMinutes?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    if (retryAfterMinutes !== undefined) this.retryAfterMinutes = retryAfterMinutes;
  }
}

// Pick the session that matches the request. Staff and client sessions are
// different token formats and authenticate against different endpoints, so a
// staff JWT sent to a client route (or vice versa) is rejected with 401. Client
// routes must therefore prefer the client token whenever one exists; staff
// routes keep their previous behaviour (staff first, then client fallback).
function isClientRoute(path: string, method: string): boolean {
  const p = path.startsWith("/api/") ? path.slice(4) : path;
  if (p === "/me" || p.startsWith("/me/")) return true;
  if (p.startsWith("/client-auth")) return true;
  if (p.startsWith("/pets") && method === "POST") return true;
  // Booking creation and order placement/proof are client actions. The same
  // paths are read/managed with staff tokens for the dashboard (GET/PATCH/etc).
  if (p === "/bookings" && method === "POST") return true;
  if (p.startsWith("/orders") && method === "POST") return true;
  if (p.startsWith("/bookings/") && p.endsWith("/clinical")) return true;
  return false;
}

type AuthMode = "staff" | "client";

function authHeaders(path: string, method: string, authMode?: AuthMode): Record<string, string> {
  const staffToken = getSessionToken();
  const clientToken = getClientToken();
  // Shared endpoints (notably POST /orders) need an explicit choice: the
  // storefront checks out as a client/guest, while the cashier creates the same
  // order at the counter with a staff session and POS price overrides.
  if (authMode === "staff") return staffToken ? { Authorization: `Bearer ${staffToken}` } : {};
  if (authMode === "client" || isClientRoute(path, method)) {
    return clientToken ? { Authorization: `Bearer ${clientToken}` } : {};
  }
  if (staffToken) return { Authorization: `Bearer ${staffToken}` };
  return clientToken ? { Authorization: `Bearer ${clientToken}` } : {};
}

const CSRF_COOKIE = "paw-m-csrf-token";

// Same-origin deployments receive a readable double-submit CSRF cookie with
// the staff session; echo it back so cookie-authenticated state changes pass
// backend verification. Cross-origin deployments cannot read the API origin's
// cookie, so they rely on the Bearer token path and send no header.
function csrfHeaders(): Record<string, string> {
  if (typeof document === "undefined") return {};
  const match = document.cookie.match(new RegExp(`(?:^|; )${CSRF_COOKIE}=([^;]+)`));
  return match ? { "X-CSRF-Token": decodeURIComponent(match[1] ?? "") } : {};
}

async function apiFetch(
  path: string,
  init?: RequestInit,
  unwrapPagination = true,
  authMode?: AuthMode,
): Promise<unknown> {
  const normalizedPath = path.startsWith("/api/") ? path.slice(4) : path;

  const headers = new Headers({
    "Content-Type": "application/json",
    ...authHeaders(normalizedPath, init?.method ?? "GET", authMode),
    ...csrfHeaders(),
    ...(init?.headers ?? {}),
  });

  const res = await fetch(`${API_BASE}${normalizedPath}`, {
    ...init,
    headers,
    credentials: "include",
  });
  if (!res.ok) {
    const text = await res.text();
    // If a session was rejected, drop the stale local token so the UI falls
    // back to its login gate instead of retrying with the same bad token.
    if (res.status === 401) {
      if (/Unauthorized — no session|Session expired|Invalid session|User not found/.test(text)) {
        storageRemove("session", ADMIN_SESSION_KEY);
      }
      if (/client session|Client account not found|Account suspended/i.test(text)) {
        storageRemove("session", CLIENT_SESSION_KEY);
      }
    }
    // RateLimit-Reset is the number of seconds until the window resets.
    const resetHeader = res.headers.get("RateLimit-Reset");
    const resetSeconds = resetHeader ? Number(resetHeader) : Number.NaN;
    const retryAfterMinutes = Number.isFinite(resetSeconds)
      ? Math.max(1, Math.ceil(resetSeconds / 60))
      : undefined;
    throw new ApiError(
      res.status,
      `API ${res.status}: ${text || res.statusText}`,
      retryAfterMinutes,
    );
  }
  if (res.status === 204) return undefined;
  const json = await res.json();
  if (
    unwrapPagination &&
    json &&
    typeof json === "object" &&
    "data" in json &&
    "pagination" in json &&
    Array.isArray(json.data)
  ) {
    return json.data;
  }
  return json;
}

export const api = {
  get: <T = unknown>(path: string, init?: RequestInit) => apiFetch(path, init) as Promise<T>,
  getPage: <T = unknown>(path: string) =>
    apiFetch(path, undefined, false) as Promise<PaginatedResult<T>>,
  post: <T = unknown>(path: string, body?: unknown, options?: { auth?: AuthMode }) =>
    apiFetch(path, { method: "POST", body: JSON.stringify(body) }, true, options?.auth) as Promise<T>,
  patch: <T = unknown>(path: string, body?: unknown) =>
    apiFetch(path, { method: "PATCH", body: JSON.stringify(body) }) as Promise<T>,
  put: <T = unknown>(path: string, body: unknown) =>
    apiFetch(path, { method: "PUT", body: JSON.stringify(body) }) as Promise<T>,
  delete: (path: string) => apiFetch(path, { method: "DELETE" }),
};
