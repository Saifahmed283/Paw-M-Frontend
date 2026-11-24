import fs from "node:fs";
import path from "node:path";
import { test, expect, type Page } from "@playwright/test";

async function signIn(page: Page) {
  const state = JSON.parse(
    fs.readFileSync(path.resolve(process.cwd(), "tests/.auth/admin.json"), "utf8"),
  ) as { cookies: { name: string; value: string }[] };
  const token = state.cookies.find((c) => c.name === "paw-m-session")?.value;
  if (!token) throw new Error("No admin token in tests/.auth/admin.json — run global setup");

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
}

async function currentSearch(page: Page) {
  return new URL(page.url()).searchParams;
}

test("dashboard tabs stay in sync with the address bar", async ({ page }) => {
  await signIn(page);
  await page.goto("/dashboard");

  // A bare /dashboard is normalised to the default tab.
  await expect(page).toHaveURL(/\/dashboard\?tab=overview/);

  await page.getByTestId("nav-payment-verification").click();
  await expect(page).toHaveURL(/\/dashboard\?tab=payment-verification/);
  await expect(page.getByText("Payment verification queue").first()).toBeVisible();

  // Reloading a deep link must reopen the same tab.
  await page.reload();
  await expect(page).toHaveURL(/\/dashboard\?tab=payment-verification/);
  await expect(page.getByText("Payment verification queue").first()).toBeVisible();

  // Browser back/forward must switch panels too.
  await page.getByTestId("nav-finance").click();
  await expect(page).toHaveURL(/\/dashboard\?tab=finance/);
  await page.goBack();
  await expect(page).toHaveURL(/\/dashboard\?tab=payment-verification/);
  await expect(page.getByText("Payment verification queue").first()).toBeVisible();
});

test("in-app navigation carries the focused record into the URL", async ({ page }) => {
  await signIn(page);
  await page.goto("/dashboard?tab=overview");
  // Wait for the dashboard shell (and its event listener) to mount.
  await expect(page.getByTestId("nav-payment-verification")).toBeVisible();

  await page.evaluate(() => {
    window.dispatchEvent(
      new CustomEvent("pawm:dashboard-navigate", {
        detail: { tabId: "payment-verification", recordId: "ORD-1" },
      }),
    );
  });

  await expect
    .poll(async () => {
      const params = await currentSearch(page);
      return { tab: params.get("tab"), record: params.get("record") };
    })
    .toEqual({ tab: "payment-verification", record: "ORD-1" });
  await expect(page.getByText(/showing verification for order/i)).toBeVisible();
});
