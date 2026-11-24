import {
  openDashboardTab,
  resetWorkSession,
  test,
  waitForDashboard,
} from "@tests/fixtures/authed-page";
import { expect } from "@playwright/test";
import { SELECTORS } from "@tests/utils/selectors";

function latestSuccessToast(page: import("@playwright/test").Page) {
  return page.locator('[data-sonner-toast][data-type="success"]').last();
}

test.describe("Shift Banner", () => {
  test.beforeEach(async ({ page }) => {
    await resetWorkSession(page);
    await page.goto("/dashboard");
    await waitForDashboard(page);
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
    await page.getByTestId("check-in-btn").click();
    await expect(page.getByTestId("check-out-btn")).toBeVisible({ timeout: 10000 });

    const toast = latestSuccessToast(page);
    await expect(toast).toBeVisible({ timeout: 10000 });
    await expect(toast).toContainText(/checked in|check in|started/i);
  });

  test("clicking Check Out should show success toast and switch to Check In", async ({ page }) => {
    await page.getByTestId("check-in-btn").click();
    await expect(page.getByTestId("check-out-btn")).toBeVisible({ timeout: 10000 });

    await page.getByTestId("check-out-btn").click();
    await expect(page.getByTestId("check-in-btn")).toBeVisible({ timeout: 10000 });

    const toast = latestSuccessToast(page);
    await expect(toast).toBeVisible({ timeout: 10000 });
    await expect(toast).toContainText(/check.?out|ended/i);
  });

  test("should display status orb indicating shift state", async ({ page }) => {
    const statusOrb = page.locator(SELECTORS.shiftBanner.statusOrb).first();
    await expect(statusOrb).toBeVisible();
    const className = (await statusOrb.getAttribute("class")) ?? "";
    expect(className).toMatch(/bg-(success|amber)/);
  });

  test("should display session time when checked in", async ({ page }) => {
    await page.getByTestId("check-in-btn").click();
    await expect(page.getByTestId("check-out-btn")).toBeVisible({ timeout: 10000 });

    const sessionTime = page.getByTestId("session-time");
    await expect(sessionTime).toBeVisible();
    expect(await sessionTime.textContent()).toMatch(/\d/);
  });

  test("status orb should change color based on shift state", async ({ page }) => {
    const statusOrb = page.locator(SELECTORS.shiftBanner.statusOrb).first();
    const initialClass = (await statusOrb.getAttribute("class")) ?? "";
    expect(initialClass).toMatch(/bg-amber/);

    await page.getByTestId("check-in-btn").click();
    await expect(page.getByTestId("check-out-btn")).toBeVisible({ timeout: 10000 });

    const checkedInClass = (await statusOrb.getAttribute("class")) ?? "";
    expect(checkedInClass).not.toBe(initialClass);
    expect(checkedInClass).toMatch(/bg-success/);
  });

  test("should persist shift state across page refresh", async ({ page }) => {
    await page.getByTestId("check-in-btn").click();
    await expect(page.getByTestId("check-out-btn")).toBeVisible({ timeout: 10000 });

    await page.reload();
    await waitForDashboard(page);
    await expect(page.getByTestId("check-out-btn")).toBeVisible({ timeout: 10000 });
  });

  test("should be visible on all dashboard tabs", async ({ page }) => {
    for (const tab of ["overview", "requests", "reservations"]) {
      await openDashboardTab(page, tab);
      await expect(page.locator(SELECTORS.shiftBanner.container).first()).toBeVisible();
    }
  });
});
