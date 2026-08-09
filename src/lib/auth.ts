import { storageGet, storageRemove, storageSet } from "@/lib/storage";

const PIN_KEY = "pawcare:admin-pin";
const SESSION_KEY = "pawcare:admin-session";
const LOCK_KEY = "pawcare:admin-attempts";

export const SESSION_TTL_MS = 8 * 60 * 60 * 1000;
export const MAX_ATTEMPTS = 5;
export const LOCKOUT_MS = 10 * 60 * 1000;

export type PinRecord = {
  salt: string;
  hash: string;
};

type Session = {
  token: string;
  expiresAt: number;
};

type AttemptRecord = {
  count: number;
  lockedUntil: number;
};

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

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

export async function hashPin(pin: string, salt: string): Promise<string> {
  return sha256Hex(`${salt}:${pin}`);
}

function readRecord(): PinRecord | null {
  const raw = storageGet("local", PIN_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as PinRecord;
    return typeof parsed.salt === "string" && typeof parsed.hash === "string" ? parsed : null;
  } catch {
    return null;
  }
}

export function isPinConfigured(): boolean {
  return readRecord() !== null;
}

/** Set the PIN on first run, or change it when `currentPin` matches. */
export async function setPin(currentPin: string, newPin: string): Promise<void> {
  const normalized = newPin.trim();
  if (normalized.length < 4) throw new Error("PIN must be at least 4 characters.");

  const record = readRecord();
  if (record) {
    const current = currentPin.trim();
    if ((await hashPin(current, record.salt)) !== record.hash) {
      throw new Error("Current PIN is incorrect.");
    }
  }

  const salt = randomHex(16);
  const next: PinRecord = { salt, hash: await hashPin(normalized, salt) };
  storageSet("local", PIN_KEY, JSON.stringify(next));
}

export async function verifyPin(pin: string): Promise<boolean> {
  const record = readRecord();
  if (!record) return false;
  const normalized = pin.trim();
  return (await hashPin(normalized, record.salt)) === record.hash;
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

export async function unlock(pin: string): Promise<boolean> {
  if (isLocked()) return false;
  const ok = await verifyPin(pin);
  if (!ok) {
    recordFailedAttempt();
    return false;
  }
  clearAttempts();
  const session: Session = { token: randomHex(24), expiresAt: Date.now() + SESSION_TTL_MS };
  storageSet("session", SESSION_KEY, JSON.stringify(session));
  return true;
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
