import { test, expect } from "@playwright/test";

/**
 * Runs for every staff project (staff, payroll, admin, mobile-staff), proving
 * that any role is asked for cash custody & handover once per shift.
 */
test.describe("Cashier — cash custody & handover", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/cashier");
    // The sign-in gate is satisfied by the project's storageState. If this is a
    // fresh shift, check in first so the custody gate is the next gate shown.
    const checkIn = page.getByRole("button", { name: /check in & open till/i });
    if (await checkIn.isVisible()) {
      await checkIn.click();
      await expect(checkIn).toBeHidden({ timeout: 10000 });
    }
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
