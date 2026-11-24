/* eslint-disable react-hooks/rules-of-hooks, @typescript-eslint/no-explicit-any */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test as base, type Page, type APIRequestContext } from "./authed-page";
import {
  createTestBooking,
  deleteTestBooking,
  setBookingStatus,
  createTestClient,
  deleteTestClient,
  createTestProduct,
  createTestOrder,
  loginUser,
  TEST_USERS,
} from "./api-helpers";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3001/api";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AUTH_FILES: Record<"admin" | "staff" | "payroll", string> = {
  admin: ".auth/admin.json",
  staff: ".auth/staff.json",
  payroll: ".auth/payroll.json",
};
const tokenCache = new Map<string, string>();

function isUsableToken(token: string | undefined): boolean {
  if (!token) return false;
  try {
    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString("utf8"));
    return typeof payload.exp === "number" && payload.exp * 1000 > Date.now() + 60_000;
  } catch {
    return false;
  }
}

function storedToken(role: keyof typeof AUTH_FILES): string | undefined {
  const statePath = path.join(__dirname, "..", AUTH_FILES[role]);
  if (!fs.existsSync(statePath)) return undefined;
  try {
    const state = JSON.parse(fs.readFileSync(statePath, "utf8")) as {
      cookies: { name: string; value: string }[];
    };
    return state.cookies.find((cookie) => cookie.name === "paw-m-session")?.value;
  } catch {
    return undefined;
  }
}

async function resolveToken(
  request: APIRequestContext,
  role: keyof typeof AUTH_FILES,
  username: string,
  password: string,
): Promise<string> {
  const cached = tokenCache.get(role);
  if (isUsableToken(cached)) return cached!;

  const stored = storedToken(role);
  if (isUsableToken(stored)) {
    tokenCache.set(role, stored!);
    return stored!;
  }

  const token = await loginUser(request, username, password);
  if (!token) throw new Error(`Could not sign in as ${username} for API fixtures`);
  tokenCache.set(role, token);
  return token;
}

interface TestFixtures {
  adminToken: string;
  staffToken: string;
  payrollToken: string;
  testBooking: { id: string; [key: string]: any } | null;
  testClient: { id: string; [key: string]: any } | null;
  testProduct: { id: string; [key: string]: any } | null;
  testOrder: { id: string; [key: string]: any } | null;
}

export const test = base.extend<TestFixtures>({
  // Reuse the setup session instead of logging in on every test (avoids 429s).
  adminToken: async ({ request }, use) => {
    await use(await resolveToken(request, "admin", "technical-support", "TS@pawm2026"));
  },

  staffToken: async ({ request }, use) => {
    await use(await resolveToken(request, "staff", "test-staff", "TestPass123!"));
  },

  payrollToken: async ({ request }, use) => {
    await use(await resolveToken(request, "payroll", "test-payroll", "TestPass123!"));
  },

  // Create a test booking for each test
  testBooking: async ({ adminToken }, use) => {
    if (!adminToken) {
      await use(null);
      return;
    }

    const request =
      (await (global as any).playwrightRequest?.fetch?.(API_BASE_URL)) ||
      (await import("@playwright/test")).request;

    // Create a fresh request context
    const apiRequest = await (
      await import("@playwright/test")
    ).request.newContext({
      baseURL: API_BASE_URL,
      extraHTTPHeaders: { Authorization: `Bearer ${adminToken}` },
    });

    let booking = null;
    try {
      booking = await createTestBooking(apiRequest, adminToken, { status: "pending" });
      await use(booking);
    } finally {
      if (booking?.id) {
        await deleteTestBooking(apiRequest, adminToken, booking.id);
      }
      await apiRequest.dispose();
    }
  },

  // Create a test client
  testClient: async ({ adminToken }, use) => {
    if (!adminToken) {
      await use(null);
      return;
    }

    const apiRequest = await (
      await import("@playwright/test")
    ).request.newContext({
      baseURL: API_BASE_URL,
      extraHTTPHeaders: { Authorization: `Bearer ${adminToken}` },
    });

    let client = null;
    try {
      client = await createTestClient(apiRequest, adminToken);
      await use(client);
    } finally {
      if (client?.id) {
        await deleteTestClient(apiRequest, adminToken, client.id);
      }
      await apiRequest.dispose();
    }
  },

  // Create a test product
  testProduct: async ({ adminToken }, use) => {
    if (!adminToken) {
      await use(null);
      return;
    }

    const apiRequest = await (
      await import("@playwright/test")
    ).request.newContext({
      baseURL: API_BASE_URL,
      extraHTTPHeaders: { Authorization: `Bearer ${adminToken}` },
    });

    let product = null;
    try {
      product = await createTestProduct(apiRequest, adminToken);
      await use(product);
    } finally {
      if (product?.id) {
        await apiRequest.delete(`/products/${product.id}`, {
          headers: { Authorization: `Bearer ${adminToken}` },
        });
      }
      await apiRequest.dispose();
    }
  },

  // Create a test order
  testOrder: async ({ adminToken }, use) => {
    if (!adminToken) {
      await use(null);
      return;
    }

    const apiRequest = await (
      await import("@playwright/test")
    ).request.newContext({
      baseURL: API_BASE_URL,
      extraHTTPHeaders: { Authorization: `Bearer ${adminToken}` },
    });

    let order = null;
    try {
      order = await createTestOrder(apiRequest, adminToken);
      await use(order);
    } finally {
      if (order?.id) {
        await apiRequest.delete(`/orders/${order.id}`, {
          headers: { Authorization: `Bearer ${adminToken}` },
        });
      }
      await apiRequest.dispose();
    }
  },
});

// Helper to create API request context with auth
export async function createApiRequest(token: string): Promise<APIRequestContext> {
  const { request } = await import("@playwright/test");
  return request.newContext({
    baseURL: API_BASE_URL,
    extraHTTPHeaders: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

export { TEST_USERS };
