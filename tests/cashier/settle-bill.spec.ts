import fs from "node:fs";
import path from "node:path";
import { test, expect, type Page } from "@playwright/test";

/** Sign in the same way staff do: the SPA reads the session from sessionStorage. */
async function signIn(page: Page) {
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
  await page.waitForLoadState("domcontentloaded");
  // Let the route hydrate and the payment queries resolve.
  await page.waitForTimeout(1500);
}

test("Settle bill opens the verification queue from the cashier", async ({ page }) => {
  await signIn(page);

  // A fresh shift asks for cash custody first; answering unlocks the till.
  if (await page.getByRole("heading", { name: /cash custody & handover/i }).isVisible()) {
    await page.getByRole("button", { name: /^no drawer$/i }).click();
    await page.getByRole("button", { name: /confirm & open till/i }).click();
    await expect(page.getByRole("heading", { name: /cash custody & handover/i })).toBeHidden({
      timeout: 10000,
    });
  }

  const settleButtons = page.getByRole("button", { name: /settle bill/i });
  if ((await settleButtons.count()) === 0) {
    test.skip(true, "no unpaid payment requests to settle");
  }
  await settleButtons.first().click();

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText(/settled via order verification/i)).toBeVisible();
  const queue = dialog.getByRole("button", { name: /open verification queue/i });
  await expect(queue).toBeVisible();

  await queue.click();
  await expect(page).toHaveURL(/\/dashboard\?tab=payment-verification/);
  await expect(page.getByText(/payment verification queue/i).first()).toBeVisible({
    timeout: 15000,
  });
  // The clicked bill must actually have a review row waiting in the queue.
  await expect(page.getByText(/showing verification for order/i)).toBeVisible();
  await expect(page.getByRole("table").first().locator("tbody tr").first()).toBeVisible({
    timeout: 15000,
  });
});

test("verification queue shows actionable bank transfers", async ({ page }) => {
  await signIn(page);
  await page.goto("/dashboard?tab=payment-verification");
  await expect(page.getByText(/payment verification queue/i).first()).toBeVisible({
    timeout: 15000,
  });

  const firstRow = page.getByRole("table").first().locator("tbody tr").first();
  await expect(firstRow).toBeVisible({ timeout: 15000 });
  await expect(firstRow.getByRole("button", { name: /approve/i })).toBeVisible();
  await expect(firstRow.getByRole("button", { name: /reject/i })).toBeVisible();
  await expect(page.getByRole("option", { name: /all statuses/i })).toBeAttached();
});
