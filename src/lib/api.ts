import { getSessionToken, SESSION_KEY as ADMIN_SESSION_KEY } from "@/lib/auth";
import { storageRemove } from "@/lib/storage";
import { getClientToken } from "@/lib/client-auth";

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

// Send the session that matches the request: the staff JWT takes precedence, so
// dashboard calls are authenticated even when the API runs on another origin and
// cross-site cookies are blocked. Falls back to the store customer's token.
function authHeaders(): Record<string, string> {
  const staffToken = getSessionToken();
  if (staffToken) return { Authorization: `Bearer ${staffToken}` };
  const clientToken = getClientToken();
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
  return match ? { "X-CSRF-Token": decodeURIComponent(match[1]) } : {};
}

async function apiFetch(path: string, init?: RequestInit): Promise<unknown> {
  const normalizedPath = path.startsWith("/api/") ? path.slice(4) : path;

  const headers = new Headers({
    "Content-Type": "application/json",
    ...authHeaders(),
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
    // If the staff JWT was rejected, drop the stale local session so the
    // dashboard falls back to the login gate (and stores a fresh token).
    if (
      res.status === 401 &&
      /Unauthorized — no session|Session expired|Invalid session|User not found/.test(text)
    ) {
      storageRemove("session", ADMIN_SESSION_KEY);
    }
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }
  if (res.status === 204) return undefined;
  const json = await res.json();
  if (
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
  post: <T = unknown>(path: string, body?: unknown) =>
    apiFetch(path, { method: "POST", body: JSON.stringify(body) }) as Promise<T>,
  patch: <T = unknown>(path: string, body?: unknown) =>
    apiFetch(path, { method: "PATCH", body: JSON.stringify(body) }) as Promise<T>,
  put: <T = unknown>(path: string, body: unknown) =>
    apiFetch(path, { method: "PUT", body: JSON.stringify(body) }) as Promise<T>,
  delete: (path: string) => apiFetch(path, { method: "DELETE" }),
};
