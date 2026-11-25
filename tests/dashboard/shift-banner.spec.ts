import {
  openDashboardTab,
  resetWorkSession,
  test,
  waitForDashboard,
} from "@tests/fixtures/authed-page";
import { expect, type Page } from "@playwright/test";
import { SELECTORS } from "@tests/utils/selectors";

/**
 * Sonner toasts stack, so match by text instead of relying on render order.
 * The banner shows the toast only after a full clinic refresh, which can be
 * slow on a cold first run — allow enough time for that refresh to finish.
 */
function successToastMatching(page: Page, pattern: RegExp) {
  return page
    .locator('[data-sonner-toast][data-type="success"]')
    .filter({ hasText: pattern })
    .first();
}

/** The CTA re-renders on a timer; a DOM click avoids the detach/retry loop. */
async function clickShiftButton(page: Page, testId: "check-in-btn" | "check-out-btn") {
  const button = page.getByTestId(testId);
  await button.evaluate((el) => (el as HTMLElement).click());
}

/** Make each test start from the same visible checked-out state. */
async function ensureCheckedOut(page: Page) {
  const checkOut = page.getByTestId("check-out-btn");
  if (await checkOut.isVisible().catch(() => false)) {
    await clickShiftButton(page, "check-out-btn");
  }
  await expect(page.getByTestId("check-in-btn")).toBeVisible({ timeout: 10_000 });
  await expect(checkOut).toHaveCount(0);
}

const TOAST_TIMEOUT = 30_000;

test.describe("Shift Banner", () => {
  test.beforeEach(async ({ page }) => {
    await resetWorkSession(page);
    await page.goto("/dashboard");
    await waitForDashboard(page);
    await ensureCheckedOut(page);
  });

  test.afterEach(async ({ page }) => {
    await resetWorkSession(page);
  });

  test("should display shift banner on dashboard", async ({ page }) => {
    await expect(page.locator(SELECTORS.shiftBanner.container).first()).toBeVisible();
  });

  test("should show Check In button when no active session", async ({ page }) => {
    await expect(page.getByTestId("check-in-btn")).toBeVisible();
    await expect(page.getByTestId("check-out-btn")).toHaveCount(0);
  });

  test("Check In button should be clickable", async ({ page }) => {
    await expect(page.getByTestId("check-in-btn")).toBeEnabled();
  });

  test("clicking Check In should show success toast and switch to Check Out", async ({ page }) => {
    const toastVisible = expect(
      successToastMatching(page, /checked in|check in|started/i),
    ).toBeVisible({
      timeout: TOAST_TIMEOUT,
    });
    await clickShiftButton(page, "check-in-btn");
    await expect(page.getByTestId("check-out-btn")).toBeVisible({ timeout: 10_000 });
    await toastVisible;
  });

  test("clicking Check Out should show success toast and switch to Check In", async ({ page }) => {
    await clickShiftButton(page, "check-in-btn");
    await expect(page.getByTestId("check-out-btn")).toBeVisible({ timeout: 10_000 });

    const toastVisible = expect(successToastMatching(page, /check.?out|ended/i)).toBeVisible({
      timeout: TOAST_TIMEOUT,
    });
    await clickShiftButton(page, "check-out-btn");
    await expect(page.getByTestId("check-in-btn")).toBeVisible({ timeout: 10_000 });
    await toastVisible;
  });

  test("should display status orb indicating shift state", async ({ page }) => {
    const statusOrb = page.locator(SELECTORS.shiftBanner.statusOrb).first();
    await expect(statusOrb).toBeVisible();
    const className = (await statusOrb.getAttribute("class")) ?? "";
    expect(className).toMatch(/bg-(success|amber)/);
  });

  test("should display session time when checked in", async ({ page }) => {
    await clickShiftButton(page, "check-in-btn");
    await expect(page.getByTestId("check-out-btn")).toBeVisible({ timeout: 10_000 });

    const sessionTime = page.getByTestId("session-time");
    await expect(sessionTime).toBeVisible();
    expect(await sessionTime.textContent()).toMatch(/\d/);
  });

  test("status orb should change color based on shift state", async ({ page }) => {
    const statusOrb = page.locator(SELECTORS.shiftBanner.statusOrb).first();
    const initialClass = (await statusOrb.getAttribute("class")) ?? "";
    expect(initialClass).toMatch(/bg-amber/);

    await clickShiftButton(page, "check-in-btn");
    await expect(page.getByTestId("check-out-btn")).toBeVisible({ timeout: 10_000 });

    await expect
      .poll(async () => (await statusOrb.getAttribute("class")) ?? "")
      .toMatch(/bg-success/);
  });

  test("should persist shift state across page refresh", async ({ page }) => {
    await clickShiftButton(page, "check-in-btn");
    await expect(page.getByTestId("check-out-btn")).toBeVisible({ timeout: 10_000 });

    await page.reload();
    await waitForDashboard(page);
    await expect(page.getByTestId("check-out-btn")).toBeVisible({ timeout: 10_000 });
  });

  test("should be visible on all dashboard tabs", async ({ page }) => {
    for (const tab of ["overview", "requests", "reservations"]) {
      await openDashboardTab(page, tab);
      await expect(page.locator(SELECTORS.shiftBanner.container).first()).toBeVisible();
    }
  });
});
