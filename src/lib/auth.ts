import { storageGet, storageRemove, storageSet } from "@/lib/storage";
import { api } from "@/lib/api";

const SESSION_KEY = "paw-m:admin-session";
const LOCK_KEY = "paw-m:admin-attempts";

export const SESSION_TTL_MS = 8 * 60 * 60 * 1000;
export const MAX_ATTEMPTS = 5;
export const LOCKOUT_MS = 10 * 60 * 1000;
export const MIN_USERNAME = 3;
export const MIN_PASSWORD = 6;

type Session = {
  username: string;
  token: string;
  expiresAt: number;
};

type AttemptRecord = {
  count: number;
  lockedUntil: number;
};

function randomHex(bytes: number): string {
  const buf = new Uint8Array(bytes);
  if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
    crypto.getRandomValues(buf);
  } else {
    for (let i = 0; i < buf.length; i++) {
      buf[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(buf)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

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
  await api.post("/auth/register", { username: name, password });
}

/** Sign in with staff credentials; opens a session on success. */
export async function login(username: string, password: string): Promise<boolean> {
  if (isLocked()) return false;
  try {
    const r = await api.post<{ ok: boolean }>("/auth/login", {
      username: username.trim(),
      password,
    });
    if (!r.ok) {
      recordFailedAttempt();
      return false;
    }
    clearAttempts();
    const session: Session = {
      username: username.trim(),
      token: randomHex(24),
      expiresAt: Date.now() + SESSION_TTL_MS,
    };
    storageSet("session", SESSION_KEY, JSON.stringify(session));
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
  await api.put("/auth/credentials", {
    currentPassword,
    newUsername: newUsername?.trim() || undefined,
    newPassword,
  });
}

function readAttempts(): AttemptRecord {
  const raw = storageGet("local", LOCK_KEY);
  if (!raw) return { count: 0, lockedUntil: 0 };
  try {
    const parsed = JSON.parse(raw) as AttemptRecord;
    return parsed && typeof parsed.count === "number" ? parsed : { count: 0, lockedUntil: 0 };
  } catch {
    return { count: 0, lockedUntil: 0 };
  }
}

export function isLocked(): boolean {
  return readAttempts().lockedUntil > Date.now();
}

export function remainingLockMs(): number {
  return Math.max(0, readAttempts().lockedUntil - Date.now());
}

function recordFailedAttempt() {
  const attempts = readAttempts();
  const count = attempts.count + 1;
  const lockedUntil = count >= MAX_ATTEMPTS ? Date.now() + LOCKOUT_MS : attempts.lockedUntil;
  storageSet("local", LOCK_KEY, JSON.stringify({ count, lockedUntil }));
}

function clearAttempts() {
  storageRemove("local", LOCK_KEY);
}

export function currentUsername(): string {
  const raw = storageGet("session", SESSION_KEY);
  if (!raw) return "";
  try {
    const parsed = JSON.parse(raw) as Session;
    return typeof parsed.username === "string" ? parsed.username : "";
  } catch {
    return "";
  }
}

export function isAuthed(): boolean {
  const raw = storageGet("session", SESSION_KEY);
  if (!raw) return false;
  try {
    const parsed = JSON.parse(raw) as Session;
    return parsed && typeof parsed.expiresAt === "number" && parsed.expiresAt > Date.now();
  } catch {
    return false;
  }
}

export function logout(): void {
  storageRemove("session", SESSION_KEY);
}
