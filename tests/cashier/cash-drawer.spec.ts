import fs from "node:fs";
import path from "node:path";
import { test } from "@tests/fixtures/authed-page";
import { expect, type Page } from "@playwright/test";

/** Dashboard calls read the staff JWT from sessionStorage, like a real login. */
async function signIn(page: Page) {
  const state = JSON.parse(
    fs.readFileSync(path.resolve(process.cwd(), "tests/.auth/admin.json"), "utf8"),
  ) as {
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
}

type Close = {
  id: string;
  date: string;
  expected: number;
  counted: number;
  variance: number;
  countedBy: number;
  note: string;
};

// Use an isolated test day so this UI check never overwrites a real close.
const TEST_DAY = "2026-11-23";

test("cash drawer saves the typed amount for the selected day without saving an empty count", async ({
  page,
}) => {
  await signIn(page);
  let close: Close = {
    id: "CD-1",
    date: TEST_DAY,
    expected: 830,
    counted: 0,
    variance: -830,
    countedBy: 8,
    note: "",
  };
  let savedPayload: unknown = null;

  await page.route("**/payment-verification/admin/cash-drawer?date=*", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        date: TEST_DAY,
        close,
        expected: close.expected,
        payments: [],
      }),
    });
  });

  await page.route("**/payment-verification/admin/cash-drawer/close", async (route) => {
    savedPayload = route.request().postDataJSON();
    const body = savedPayload as { date: string; countedAmount: number; note?: string };
    close = {
      ...close,
      id: "CD-2",
      counted: body.countedAmount,
      variance: Math.round((body.countedAmount - close.expected) * 100) / 100,
      note: body.note ?? "",
    };
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(close),
    });
  });

  await page.goto("/dashboard?tab=payment-verification");
  await expect(page.getByText("Cash drawer", { exact: true })).toBeVisible({ timeout: 15000 });
  await page.locator("#drawer-date").fill(TEST_DAY);
  await expect(page.locator("#drawer-date")).toHaveValue(TEST_DAY);

  const input = page.locator("#drawer-counted");
  const button = page.getByRole("button", { name: /^(Close|Update) cash drawer$/ });

  // An empty input must never be saved as zero.
  await input.fill("");
  await expect(button).toBeDisabled();

  await input.fill("812.75");
  await page.locator("#drawer-note").fill("counted at closing");
  await expect(button).toBeEnabled();
  await button.click();

  await expect
    .poll(() => savedPayload)
    .toEqual({
      date: TEST_DAY,
      countedAmount: 812.75,
      note: "counted at closing",
    });
  await expect(page.getByText("Cash drawer updated.")).toBeVisible();
  await expect(input).toHaveValue("812.75");
  await expect(page.getByRole("button", { name: "Update cash drawer" })).toBeVisible();
});
