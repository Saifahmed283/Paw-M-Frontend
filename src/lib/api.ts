const API_BASE =
  (typeof import.meta !== "undefined" &&
    (import.meta as { env?: Record<string, string | undefined> }).env?.["VITE_API_URL"]) ||
  "http://localhost:3001/api";

import { storageGet } from "@/lib/storage";
import { SESSION_KEY } from "@/lib/storage";

const CLIENT_SESSION_KEY = "paw-m:client-session";

async function apiFetch(path: string, init?: RequestInit): Promise<unknown> {
  const normalizedPath = path.startsWith("/api/") ? path.slice(4) : path;
  // Get session from storage
  const sessionJson = storageGet("session", SESSION_KEY);
  const session = sessionJson ? JSON.parse(sessionJson) : null;
  const clientSessionJson = storageGet("session", CLIENT_SESSION_KEY);
  const clientSession = clientSessionJson ? JSON.parse(clientSessionJson) : null;

  // Prepare headers
  const headers = new Headers({
    "Content-Type": "application/json",
    ...(init?.headers ?? {}),
  });

  // Add auth headers if session exists
  if (session?.id && session?.role) {
    headers.set("x-user-id", String(session.id));
    headers.set("x-user-role", session.role);
  }
  if (clientSession?.token) headers.set("x-client-session", clientSession.token);

  const res = await fetch(`${API_BASE}${normalizedPath}`, {
    ...init,
    headers,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }
  if (res.status === 204) return undefined;
  return res.json();
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
