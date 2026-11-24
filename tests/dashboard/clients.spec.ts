import fs from "node:fs";
import path from "node:path";
import { openDashboardTab, test } from "@tests/fixtures/authed-page";
import { expect } from "@playwright/test";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3001/api";

test("admin can add a client manually from the clients tab", async ({ page }) => {
  test.skip(
    test.info().project.name !== "admin",
    "client creation requires the admin test session",
  );

  const state = JSON.parse(
    fs.readFileSync(path.resolve(process.cwd(), "tests/.auth/admin.json"), "utf8"),
  ) as { cookies: { name: string; value: string }[] };
  const token = state.cookies.find((cookie) => cookie.name === "paw-m-session")?.value;
  if (!token) throw new Error("No admin token in tests/.auth/admin.json — run global setup");

  const stamp = Date.now();
  const name = `Manual E2E Client ${stamp}`;
  const email = `manual-${stamp}@example.com`;
  let createdId: string | null = null;

  try {
    await openDashboardTab(page, "clients");
    await page.getByTestId("client-create-button").click();
    await page.getByTestId("client-create-name").fill(name);
    await page.getByTestId("client-create-email").fill(email);
    await page.getByTestId("client-create-phone").fill("+201234567890");
    await page.getByTestId("client-create-password").fill("temporary123");
    await page.getByTestId("client-create-submit").click();

    await expect(page.locator('[data-sonner-toast][data-type="success"]').last()).toBeVisible();
    const row = page.locator('[data-testid^="client-row-"]').filter({ hasText: name });
    await expect(row).toBeVisible();
    createdId = (await row.getAttribute("data-testid"))?.replace("client-row-", "") ?? null;
    expect(createdId).toBeTruthy();
  } finally {
    if (createdId) {
      await page.request.delete(`${API_BASE_URL}/clients/${createdId}`, {
        headers: { Authorization: `Bearer ${token}`, "x-pawm-e2e": "1" },
      });
    }
  }
});
