const API_BASE =
  (typeof import.meta !== "undefined" &&
    (import.meta as { env?: Record<string, string | undefined> }).env?.["VITE_API_URL"]) ||
  "http://localhost:3001/api";

async function apiFetch(path: string, init?: RequestInit): Promise<unknown> {
  const normalizedPath = path.startsWith("/api/") ? path.slice(4) : path;

  const headers = new Headers({
    "Content-Type": "application/json",
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
