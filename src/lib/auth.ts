import { SESSION_KEY, storageGet, storageRemove, storageSet } from "@/lib/storage";
import { api } from "@/lib/api";

export { SESSION_KEY } from "@/lib/storage";

export const SESSION_TTL_MS = 8 * 60 * 60 * 1000;
export const MIN_USERNAME = 3;
export const MIN_PASSWORD = 6;

type Session = {
  username: string;
  role: string;
  expiresAt: number;
  token?: string;
};

export async function isAuthConfigured(): Promise<boolean> {
  try {
    const r = await api.get<{ configured: boolean }>("/auth/config");
    return r.configured;
  } catch {
    return false;
  }
}

/** Create the staff account on first run. Throws if one already exists. */
export async function register(username: string, password: string): Promise<void> {
  const name = username.trim();
  if (name.length < MIN_USERNAME) {
    throw new Error(`Username must be at least ${MIN_USERNAME} characters.`);
  }
  if (password.length < MIN_PASSWORD) {
    throw new Error(`Password must be at least ${MIN_PASSWORD} characters.`);
  }
  const r = await api.post<{ configured: boolean; role?: string; token?: string }>(
    "/auth/register",
    { username: name, password },
  );
  saveSession(name, r.role ?? "staff", r.token);
}

function saveSession(username: string, role: string, token?: string): void {
  const session: Session = {
    username,
    role,
    expiresAt: Date.now() + SESSION_TTL_MS,
  };
  if (token) session.token = token;
  storageSet("session", SESSION_KEY, JSON.stringify(session));
}

/** Sign in with staff credentials; opens a session on success. */
export async function login(username: string, password: string): Promise<boolean> {
  try {
    const r = await api.post<{ ok: boolean; role?: string; token?: string }>("/auth/login", {
      username: username.trim(),
      password,
    });
    if (!r.ok) {
      return false;
    }
    saveSession(username.trim(), r.role ?? "staff", r.token);
    return true;
  } catch {
    return false;
  }
}

/** Change the staff username and/or password. Throws if the current password is wrong. */
export async function changeCredentials(input: {
  currentPassword: string;
  newUsername?: string;
  newPassword?: string;
}): Promise<void> {
  const { currentPassword, newUsername, newPassword } = input;
  if (newUsername !== undefined && newUsername.trim().length < MIN_USERNAME) {
    throw new Error(`Username must be at least ${MIN_USERNAME} characters.`);
  }
  if (newPassword !== undefined && newPassword.length < MIN_PASSWORD) {
    throw new Error(`Password must be at least ${MIN_PASSWORD} characters.`);
  }
  const r = await api.put<{ configured: boolean; token?: string }>("/auth/credentials", {
    currentPassword,
    newUsername: newUsername?.trim() || undefined,
    newPassword,
  });
  // A successful credential change rotates the JWT — persist the refreshed token.
  if (r.token) {
    const session = readSession();
    if (session) saveSession(newUsername?.trim() || session.username, session.role, r.token);
  }
}

/** @deprecated Lockout removed — always returns false */
export function isLocked(): boolean {
  return false;
}

/** @deprecated Lockout removed — always returns 0 */
export function remainingLockMs(): number {
  return 0;
}

function readSession(): Session | null {
  const raw = storageGet("session", SESSION_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<Session>;
    if (
      parsed &&
      typeof parsed.username === "string" &&
      typeof parsed.expiresAt === "number" &&
      parsed.expiresAt > Date.now()
    ) {
      return parsed as Session;
    }
    return null;
  } catch {
    return null;
  }
}

export function currentUsername(): string {
  return readSession()?.username ?? "";
}

export function currentRole(): string {
  return readSession()?.role ?? "staff";
}

export function hasMinRole(minRole: string): boolean {
  const order = ["staff", "payroll", "admin"];
  return order.indexOf(currentRole()) >= order.indexOf(minRole);
}

export function isAuthed(): boolean {
  return readSession() !== null;
}

/** The staff JWT for the current session, if any (used as a Bearer token). */
export function getSessionToken(): string {
  return readSession()?.token ?? "";
}

export async function logout(): Promise<void> {
  try {
    await api.post("/auth/logout");
  } catch {
    // Cookie may already be cleared server-side
  }
  storageRemove("session", SESSION_KEY);
}
