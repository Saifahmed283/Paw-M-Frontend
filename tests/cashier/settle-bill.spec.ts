import fs from "node:fs";
import path from "node:path";
import { test, expect, type APIRequestContext, type Page } from "@playwright/test";

/** Seed the staff session from the shared auth file, like a real login. */
async function signIn(page: Page): Promise<string> {
  const state = JSON.parse(
    fs.readFileSync(path.resolve(process.cwd(), "tests/.auth/admin.json"), "utf8"),
  ) as { cookies: { name: string; value: string }[] };
  const token = state.cookies.find((c) => c.name === "paw-m-session")?.value;
  if (!token) throw new Error("No staff token in tests/.auth/admin.json — run global setup");

  await page.addInitScript(
    ([t]) => {
      sessionStorage.setItem(
        "paw-m:admin-session",
        JSON.stringify({
          username: "technical-support",
          role: "admin",
          expiresAt: Date.now() + 8 * 60 * 60 * 1000,
          token: t,
        }),
      );
    },
    [token],
  );
  return token;
}

/** Start a fresh shift and answer the custody gate so the till is usable. */
async function openTill(page: Page, request: APIRequestContext, token: string) {
  const api = process.env.API_BASE_URL ?? "http://localhost:3001/api";
  const headers = { Authorization: `Bearer ${token}` };
  await request.post(`${api}/work-session/check-out`, { headers });
  await request.post(`${api}/work-session/check-in`, { headers });

  await page.goto("/cashier");
  const gate = page.getByRole("heading", { name: /cash custody & handover/i });
  await expect(gate).toBeVisible({ timeout: 15000 });
  await page.getByRole("button", { name: /^no drawer$/i }).click();
  await page.getByRole("button", { name: /confirm & open till/i }).click();
  await expect(gate).toBeHidden({ timeout: 10000 });
}

const testProduct = {
  id: "TEST-PRODUCT-1",
  name: "Playwright test product",
  description: "",
  price: 100,
  image: "",
  category: "",
  stock: 20,
  featured: false,
  barcode: null,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

test("cashier has no settle-bill panel or pending-payment queue in the cart", async ({
  page,
  request,
}) => {
  const token = await signIn(page);
  await page.route("**/products?limit=200&page=*", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        data: [testProduct],
        pagination: { page: 1, limit: 200, total: 1, pages: 1 },
      }),
    });
  });
  // An unpaid payment used to appear as a "Settle bill" card inside the till.
  await page.route("**/payments?limit=200&page=*", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        data: [
          {
            id: "PAY-TEST-PENDING",
            title: "Unpaid clinic visit",
            amount: 250,
            method: "cash",
            status: "unpaid",
            date: "2026-11-24",
            kind: "visit",
            items: [],
            client: null,
          },
        ],
        pagination: { page: 1, limit: 200, total: 1, pages: 1 },
      }),
    });
  });

  await openTill(page, request, token);
  await expect(page.getByRole("button", { name: /settle bill/i })).toHaveCount(0);
  await expect(page.getByText("Unpaid clinic visit")).toHaveCount(0);
  await expect(page.getByText(/payment requests/i)).toHaveCount(0);
});

test("completing a proof-method sale clears the cart immediately and queues verification", async ({
  page,
  request,
}) => {
  const token = await signIn(page);
  let orderPayload: Record<string, unknown> | null = null;

  await page.route("**/products?limit=200&page=*", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        data: [testProduct],
        pagination: { page: 1, limit: 200, total: 1, pages: 1 },
      }),
    });
  });
  await page.route("**/api/orders", async (route) => {
    if (route.request().method() !== "POST") return route.continue();
    orderPayload = route.request().postDataJSON() as Record<string, unknown>;
    await route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({
        id: "ORD-PLAYWRIGHT",
        paymentMethod: "fawry",
        paymentStatus: "unpaid",
        status: "pending",
      }),
    });
  });

  await openTill(page, request, token);
  await page.getByRole("tab", { name: /quick add/i }).click();
  await page.getByRole("button", { name: /playwright test product/i }).click();
  await page.locator("#cashier-customer-name").fill("Playwright Customer");
  await page.locator("#cashier-customer-phone").fill("01012345678");
  // Fawry is a proof method: the sale stays unpaid until admin verification.
  await page.locator('button[title="Fawry"]').click();
  await expect(page.getByText(/pending verification/i)).toBeVisible();

  await page.getByRole("button", { name: /complete sale/i }).click();

  // No interstitial: the cart is emptied and the form is ready for the next sale.
  await expect.poll(() => orderPayload).not.toBeNull();
  expect(orderPayload).toMatchObject({
    customerName: "Playwright Customer",
    paymentMethod: "fawry",
    cashReceived: false,
    source: "pos",
  });
  await expect(page.getByText(/sale complete/i)).toBeVisible();
  await expect(page.getByRole("button", { name: /^new sale$/i })).toHaveCount(0);
  await expect(page.getByText(/^ORD-PLAYWRIGHT$/)).toHaveCount(0);
  await expect(page.getByText(/cart is empty/i).first()).toBeVisible();
  await expect(page.locator("#cashier-customer-name")).toHaveValue("");
});

test("verification queue remains admin-reviewable at end of day", async ({ page }) => {
  await signIn(page);
  // Deterministic submitted row — live data may already have been reviewed.
  await page.route("**/payment-verification/admin/submissions*", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        submissions: [
          {
            id: "PV-PLAYWRIGHT",
            orderId: "ORD-PLAYWRIGHT",
            paymentId: null,
            customerName: "Playwright Customer",
            phone: "01012345678",
            total: 100,
            method: "fawry",
            amount: 100,
            source: "customer_transfer",
            customerRef: "",
            senderName: "",
            transferredAt: null,
            evidenceKey: "",
            note: "",
            decision: "submitted",
            bankTransactionReference: null,
            reviewerId: null,
            reviewerUsername: null,
            reviewedAt: null,
            createdAt: "2026-11-24T00:00:00.000Z",
          },
        ],
        total: 1,
      }),
    });
  });
  await page.goto("/dashboard?tab=payment-verification");
  await expect(page.getByText(/payment verification queue/i).first()).toBeVisible({
    timeout: 15000,
  });

  // Earlier reviews may have cleared the default "Submitted" filter.
  await page.getByLabel("Status").selectOption("all");
  const firstRow = page.getByRole("table").first().locator("tbody tr").first();
  await expect(firstRow).toBeVisible({ timeout: 15000 });
  await expect(firstRow.getByRole("button", { name: /approve/i })).toBeVisible();
  await expect(firstRow.getByRole("button", { name: /reject/i })).toBeVisible();
  await expect(page.getByRole("option", { name: /all statuses/i })).toBeAttached();
});
