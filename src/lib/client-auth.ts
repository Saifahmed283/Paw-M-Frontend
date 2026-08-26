import { api } from "@/lib/api";
import { storageGet, storageRemove, storageSet } from "@/lib/storage";

const CLIENT_SESSION_KEY = "paw-m:client-session";

export type ClientAccount = {
  id: string;
  email: string;
  fullName: string;
  phone: string;
};

type ClientSession = { token: string; client: ClientAccount };

function readSession(): ClientSession | null {
  const raw = storageGet("session", CLIENT_SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ClientSession;
  } catch {
    return null;
  }
}

export function currentClient(): ClientAccount | null {
  return readSession()?.client ?? null;
}

export function clientIsAuthed(): boolean {
  return Boolean(readSession()?.token);
}

function getClientToken(): string | null {
  return readSession()?.token ?? null;
}

export function authHeaders(): Record<string, string> {
  const token = getClientToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function requestClientVerification(input: {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}) {
  await api.post("/client-auth/register", input);
}

export async function verifyClientEmail(email: string, code: string) {
  const session = await api.post<ClientSession>("/client-auth/verify", { email, code });
  storageSet("session", CLIENT_SESSION_KEY, JSON.stringify(session));
  return session.client;
}

export async function loginClient(email: string, password: string) {
  const session = await api.post<ClientSession>("/client-auth/login", { email, password });
  storageSet("session", CLIENT_SESSION_KEY, JSON.stringify(session));
  return session.client;
}

export async function logoutClient() {
  const token = getClientToken();
  if (token) {
    try {
      await api.post("/client-auth/logout", { token });
    } catch {
      // Ignore network errors during logout
    }
  }
  storageRemove("session", CLIENT_SESSION_KEY);
}

export { CLIENT_SESSION_KEY };
