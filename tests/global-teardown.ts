import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import type { FullConfig } from "@playwright/test";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3001/api";
const SESSION_COOKIE = "paw-m-session";

type Booking = { id: string; ownerName?: string; petName?: string };
type Order = { id: string; customerName?: string };
type Payment = { id: string; title?: string };
type Client = { id: string; fullName?: string };
type Product = { id: string; name?: string };

async function apiRequest(method: string, path: string, token: string, data?: unknown) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  });
  return { ok: res.ok, json: () => res.json(), text: () => res.text() };
}

function tokenFromAdminState(): string | undefined {
  const statePath = path.join(__dirname, ".auth/admin.json");
  if (!fs.existsSync(statePath)) return undefined;
  try {
    const state = JSON.parse(fs.readFileSync(statePath, "utf8")) as {
      cookies: { name: string; value: string }[];
    };
    return state.cookies.find((cookie) => cookie.name === SESSION_COOKIE)?.value;
  } catch {
    return undefined;
  }
}

function isUsableToken(token: string | undefined): boolean {
  if (!token) return false;
  try {
    const payloadPart = token.split(".")[1];
    if (!payloadPart) return false;
    const payload = JSON.parse(Buffer.from(payloadPart, "base64url").toString("utf8")) as {
      exp?: number;
    };
    return typeof payload.exp === "number" && payload.exp * 1000 > Date.now() + 60_000;
  } catch {
    return false;
  }
}

async function getAdminToken(): Promise<string | null> {
  const existing = tokenFromAdminState();
  if (isUsableToken(existing)) return existing!;

  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "technical-support", password: "TS@pawm2026" }),
  });
  if (!res.ok) return null;
  const body = (await res.json()) as { token?: string };
  return body.token ?? null;
}

async function cleanupTestData(token: string) {
  console.log("🧹 Cleaning up test data...");

  try {
    const bookingsRes = await apiRequest("GET", "/bookings?limit=200", token);
    if (bookingsRes.ok) {
      const { data: bookings } = await bookingsRes.json();
      const testBookings = (bookings as Booking[]).filter(
        (b) => b.ownerName?.startsWith("Test Owner") || b.petName?.startsWith("Test Pet"),
      );
      for (const booking of testBookings) {
        await apiRequest("DELETE", `/bookings/${booking.id}`, token);
      }
      console.log(`  ✓ Deleted ${testBookings.length} test bookings`);
    }
  } catch (e) {
    console.log("  ⚠ Failed to clean bookings:", e);
  }

  try {
    const ordersRes = await apiRequest("GET", "/orders?limit=200", token);
    if (ordersRes.ok) {
      const { data: orders } = await ordersRes.json();
      const testOrders = (orders as Order[]).filter((o) =>
        o.customerName?.startsWith("Test Customer"),
      );
      for (const order of testOrders) {
        await apiRequest("DELETE", `/orders/${order.id}`, token);
      }
      console.log(`  ✓ Deleted ${testOrders.length} test orders`);
    }
  } catch (e) {
    console.log("  ⚠ Failed to clean orders:", e);
  }

  try {
    const paymentsRes = await apiRequest("GET", "/payments?limit=200", token);
    if (paymentsRes.ok) {
      const { data: payments } = await paymentsRes.json();
      const testPayments = (payments as Payment[]).filter((p) => p.title?.includes("Test"));
      for (const payment of testPayments) {
        await apiRequest("DELETE", `/payments/${payment.id}`, token);
      }
      console.log(`  ✓ Deleted ${testPayments.length} test payments`);
    }
  } catch (e) {
    console.log("  ⚠ Failed to clean payments:", e);
  }

  try {
    const clientsRes = await apiRequest("GET", "/clients?limit=200", token);
    if (clientsRes.ok) {
      const { data: clients } = await clientsRes.json();
      const testClients = (clients as Client[]).filter((c) =>
        c.fullName?.startsWith("Test Client"),
      );
      for (const client of testClients) {
        await apiRequest("DELETE", `/clients/${client.id}`, token);
      }
      console.log(`  ✓ Deleted ${testClients.length} test clients`);
    }
  } catch (e) {
    console.log("  ⚠ Failed to clean clients:", e);
  }

  try {
    const productsRes = await apiRequest("GET", "/products?limit=200", token);
    if (productsRes.ok) {
      const { data: products } = await productsRes.json();
      const testProducts = (products as Product[]).filter((p) =>
        p.name?.startsWith("Test Product"),
      );
      for (const product of testProducts) {
        await apiRequest("DELETE", `/products/${product.id}`, token);
      }
      console.log(`  ✓ Deleted ${testProducts.length} test products`);
    }
  } catch (e) {
    console.log("  ⚠ Failed to clean products:", e);
  }
}

export default async function globalTeardown(_config: FullConfig) {
  console.log("🧹 Starting global teardown...");

  if (process.env.CI) {
    console.log("ℹ Skipping cleanup in CI to preserve test artifacts");
    return;
  }

  const token = await getAdminToken();
  if (!token) {
    console.log("⚠ Could not get admin token, skipping cleanup");
    return;
  }

  await cleanupTestData(token);
  console.log("✅ Global teardown complete");
}
