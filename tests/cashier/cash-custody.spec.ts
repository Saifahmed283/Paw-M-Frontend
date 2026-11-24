import fs from "node:fs";
import path from "node:path";
import { test, expect, type Page } from "@playwright/test";

/**
 * The SPA reads its staff session from sessionStorage, while the shared auth
 * files only carry cookies. Seed the same token the auth files use into
 * sessionStorage so the cashier sees an authenticated staff member.
 */
async function signIn(page: Page): Promise<string> {
  const authFile = path.resolve(process.cwd(), "tests", ".auth", "admin.json");
  const state = JSON.parse(fs.readFileSync(authFile, "utf8")) as {
    cookies: { name: string; value: string }[];
  };
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
  await page.goto("/cashier");
  await expect(page.getByRole("heading", { name: /staff sign-in/i })).toBeHidden({
    timeout: 15000,
  });
  return token;
}

test.describe("Cashier — cash custody & handover", () => {
  test.beforeEach(async ({ page, request }) => {
    const token = await signIn(page);
    // Every test gets a fresh shift so the custody gate is guaranteed to be
    // unanswered; no test can skip because a previous one declared custody.
    const api = process.env.API_BASE_URL ?? "http://localhost:3001/api";
    const headers = { Authorization: `Bearer ${token}` };
    await request.post(`${api}/work-session/check-out`, { headers });
    await request.post(`${api}/work-session/check-in`, { headers });
    await page.goto("/cashier");
    await expect(page.getByRole("heading", { name: /cash custody & handover/i })).toBeVisible({
      timeout: 10000,
    });
  });

  test("required gate blocks the till until the handover is answered", async ({ page }) => {
    const gate = page.getByRole("heading", { name: /cash custody & handover/i });
    if (await gate.isVisible()) {
      await expect(page.getByText(/add products/i)).toBeHidden();
      await page.getByRole("button", { name: /^no drawer$/i }).click();
      await page.getByRole("button", { name: /confirm & open till/i }).click();
    }
    await expect(gate).toBeHidden({ timeout: 10000 });
    await expect(page.getByText(/add products/i)).toBeVisible({ timeout: 10000 });
  });

  test("a drawer requires a valid amount before the till unlocks", async ({ page }) => {
    const gate = page.getByRole("heading", { name: /cash custody & handover/i });
    if (!(await gate.isVisible())) {
      test.skip(true, "custody was already declared for this shift");
    }
    await page.getByRole("button", { name: /yes, i have a drawer/i }).click();
    const submit = page.getByRole("button", { name: /confirm & open till/i });
    await submit.click();
    await expect(page.getByText(/enter a valid amount/i)).toBeVisible();
    await page.locator("#cashier-custody-amount").fill("12.34");
    await submit.click();
    await expect(gate).toBeHidden({ timeout: 10000 });
    await expect(page.getByText(/add products/i)).toBeVisible({ timeout: 10000 });
  });

  test("does not ask again after a reload within the same shift", async ({ page }) => {
    const gate = page.getByRole("heading", { name: /cash custody & handover/i });
    if (await gate.isVisible()) {
      await page.getByRole("button", { name: /^no drawer$/i }).click();
      await page.getByRole("button", { name: /confirm & open till/i }).click();
      await expect(gate).toBeHidden({ timeout: 10000 });
    }
    await page.reload();
    await expect(gate).toBeHidden({ timeout: 10000 });
    await expect(page.getByText(/add products/i)).toBeVisible({ timeout: 10000 });
  });
});
