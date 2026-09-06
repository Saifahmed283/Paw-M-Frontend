import { authHeaders } from "@/lib/client-auth";

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

async function apiFetch(path: string, init?: RequestInit): Promise<unknown> {
  const normalizedPath = path.startsWith("/api/") ? path.slice(4) : path;

  const headers = new Headers({
    "Content-Type": "application/json",
    ...authHeaders(),
    ...(init?.headers ?? {}),
  });

  const res = await fetch(`${API_BASE}${normalizedPath}`, {
    ...init,
    headers,
    credentials: "include",
  });
  if (!res.ok) {
    const text = await res.text();
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
