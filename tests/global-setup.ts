import fs from "fs";
import path from "path";
import { randomBytes } from "crypto";
import { fileURLToPath } from "url";
import type { FullConfig } from "@playwright/test";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3001/api";
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:5173";

const SESSION_COOKIE = "paw-m-session";
const CSRF_COOKIE = "paw-m-csrf-token";
/** Readable by the seeded init script, which copies the token into sessionStorage. */
const TEST_SESSION_COOKIE = "paw-m-test-session";
const TOKEN_TTL_MS = 8 * 60 * 60 * 1000;
const TOKEN_REFRESH_MARGIN_MS = 5 * 60 * 1000;

const TEST_USERS = [
  {
    username: "technical-support",
    password: "TS@pawm2026",
    role: "admin" as const,
    file: ".auth/admin.json",
  },
  {
    username: "test-staff",
    password: "TestPass123!",
    role: "staff" as const,
    file: ".auth/staff.json",
  },
  {
    username: "test-payroll",
    password: "TestPass123!",
    role: "payroll" as const,
    file: ".auth/payroll.json",
  },
];

type Role = (typeof TEST_USERS)[number]["role"];

type Cookie = {
  name: string;
  value: string;
  domain: string;
  path: string;
  expires: number;
  httpOnly: boolean;
  secure: boolean;
  sameSite: "Lax" | "Strict" | "None";
};

type StorageState = {
  cookies: Cookie[];
  origins: { origin: string; localStorage: { name: string; value: string }[] }[];
};

type ResolvedUser = { token: string; role: Role; reused: boolean };

function cookieValue(state: StorageState | null, name: string): string | undefined {
  return state?.cookies.find((cookie) => cookie.name === name)?.value;
}

function readStorageState(storagePath: string): StorageState | null {
  if (!fs.existsSync(storagePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(storagePath, "utf8")) as StorageState;
  } catch {
    return null;
  }
}

function tokenPayload(token: string): { exp?: number; role?: string; username?: string } | null {
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    return JSON.parse(Buffer.from(part, "base64url").toString("utf8"));
  } catch {
    return null;
  }
}

function isUnexpiredToken(token: string | undefined): boolean {
  if (!token) return false;
  const exp = tokenPayload(token)?.exp;
  return typeof exp === "number" && exp * 1000 > Date.now() + TOKEN_REFRESH_MARGIN_MS;
}

/** A signed JWT is not enough: the account may have been deleted since it was issued. */
async function isUsableToken(token: string | undefined, username: string): Promise<boolean> {
  if (!isUnexpiredToken(token)) return false;
  try {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return false;
    const me = (await res.json()) as { authenticated?: boolean; username?: string };
    return me.authenticated === true && me.username === username;
  } catch {
    return false;
  }
}

async function login(username: string, password: string): Promise<{ token: string; role: Role }> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (res.status === 429) {
    throw new Error(
      `Login rate limit hit while signing in as ${username}. Wait for the rate-limit window to reset.`,
    );
  }
  if (!res.ok) {
    throw new Error(`Could not sign in as ${username}: ${res.status} ${await res.text()}`);
  }

  const body = (await res.json()) as { token?: string; role?: Role; ok?: boolean };
  if (!body.ok || !body.token) {
    throw new Error(`Could not sign in as ${username}: credentials rejected`);
  }
  return { token: body.token, role: body.role ?? "staff" };
}

async function createAccount(adminToken: string, user: (typeof TEST_USERS)[number]): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/auth/accounts`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify({ username: user.username, password: user.password, role: user.role }),
  });
  if (!res.ok && res.status !== 409) {
    throw new Error(`Could not provision ${user.username}: ${res.status} ${await res.text()}`);
  }
}

async function resolveUser(
  user: (typeof TEST_USERS)[number],
  adminToken: string | undefined,
): Promise<ResolvedUser> {
  const storagePath = path.join(__dirname, user.file);
  const existing = readStorageState(storagePath);
  const existingToken = cookieValue(existing, SESSION_COOKIE);

  if (await isUsableToken(existingToken, user.username)) {
    const payload = tokenPayload(existingToken!);
    console.log(`  ✓ Reusing valid session for ${user.username}`);
    return {
      token: existingToken!,
      role: (payload?.role as Role | undefined) ?? user.role,
      reused: true,
    };
  }

  console.log(`  Refreshing session for ${user.username}...`);
  try {
    const signedIn = await login(user.username, user.password);
    return { ...signedIn, reused: false };
  } catch (error) {
    if (user.role === "admin" || !adminToken) throw error;
    console.log(`  Provisioning missing test user ${user.username}...`);
    await createAccount(adminToken, user);
    const signedIn = await login(user.username, user.password);
    return { ...signedIn, reused: false };
  }
}

function buildStorageState(
  user: (typeof TEST_USERS)[number],
  session: ResolvedUser,
  existing: StorageState | null,
): StorageState {
  const domain = new URL(BASE_URL).hostname;
  const expires = Math.floor((Date.now() + TOKEN_TTL_MS) / 1000);
  const cookieBase = { domain, path: "/", expires, secure: false, sameSite: "Lax" as const };
  const keptCookies = (existing?.cookies ?? []).filter(
    (cookie) =>
      ![SESSION_COOKIE, CSRF_COOKIE, TEST_SESSION_COOKIE].includes(cookie.name) &&
      cookie.domain === domain,
  );

  return {
    cookies: [
      ...keptCookies,
      { ...cookieBase, name: SESSION_COOKIE, value: session.token, httpOnly: true },
      {
        ...cookieBase,
        name: CSRF_COOKIE,
        value: cookieValue(existing, CSRF_COOKIE) ?? randomBytes(32).toString("hex"),
        httpOnly: false,
      },
      {
        ...cookieBase,
        name: TEST_SESSION_COOKIE,
        value: encodeURIComponent(
          JSON.stringify({ username: user.username, role: session.role, token: session.token }),
        ),
        httpOnly: false,
      },
    ],
    origins: existing?.origins?.length
      ? existing.origins
      : [{ origin: BASE_URL, localStorage: [{ name: "paw-m:lang", value: "en" }] }],
  };
}

export default async function globalSetup(_config: FullConfig) {
  console.log("🚀 Starting global setup...");
  console.log(`   API: ${API_BASE_URL}`);
  console.log(`   Frontend: ${BASE_URL}`);

  const authDir = path.join(__dirname, ".auth");
  fs.mkdirSync(authDir, { recursive: true });

  const [admin, ...otherUsers] = TEST_USERS;
  const adminSession = await resolveUser(admin, undefined);
  const sessions = [adminSession];
  for (const user of otherUsers) {
    sessions.push(await resolveUser(user, adminSession.token));
  }

  TEST_USERS.forEach((user, index) => {
    const storagePath = path.join(__dirname, user.file);
    const state = buildStorageState(user, sessions[index]!, readStorageState(storagePath));
    fs.writeFileSync(storagePath, `${JSON.stringify(state, null, 2)}\n`);
    console.log(`✓ Saved auth state for ${user.username} to ${user.file}`);
  });

  // Playwright's storageState cannot carry sessionStorage, so the shared init
  // script copies the token from the readable test cookie into the app session.
  console.log("✅ Global setup complete");
}
