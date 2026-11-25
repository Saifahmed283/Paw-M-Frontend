import { openDashboardTab, test } from "@tests/fixtures/authed-page";
import { expect } from "@playwright/test";
import { SELECTORS } from "@tests/utils/selectors";

test.describe("Requests Tab", () => {
  test.beforeEach(async ({ page }) => {
    await openDashboardTab(page, "requests");
  });

  test("should display search input", async ({ page }) => {
    const searchInput = page.locator(SELECTORS.requests.searchInput).first();
    await expect(searchInput).toBeVisible();
  });

  test("should display status filter tabs", async ({ page }) => {
    await expect(page.locator(SELECTORS.requests.statusFilter).first()).toBeVisible();

    for (const status of ["All", "Pending", "Confirmed", "Completed", "Cancelled"]) {
      await expect(page.getByRole("radio", { name: status, exact: true })).toBeVisible();
    }
  });

  test("should display requests table", async ({ page }) => {
    const table = page.locator(SELECTORS.requests.table).first();
    await expect(table).toBeVisible();

    for (const header of [
      "Owner",
      "Pet",
      /Veterinarian|Doctor/i,
      "Date",
      "Time",
      "Status",
      "Actions",
    ]) {
      await expect(table.locator("th", { hasText: header })).toBeVisible();
    }
  });

  test("should filter by search query", async ({ page }) => {
    const searchInput = page.locator(SELECTORS.requests.searchInput).first();
    await searchInput.fill("Test");

    const rows = page.locator(SELECTORS.requests.table + " tbody tr");
    await expect(rows.first()).toBeVisible({ timeout: 5000 });
  });

  test("should filter by status", async ({ page }) => {
    // The tab strip re-renders while clinic data streams in; a DOM click avoids
    // Playwright retrying against a detached Radix toggle item.
    await page
      .getByRole("radio", { name: "Pending", exact: true })
      .evaluate((el) => (el as HTMLElement).click());

    const statusBadges = page.locator(SELECTORS.requests.statusBadge(""));
    const count = await statusBadges.count();
    for (let i = 0; i < count; i++) {
      await expect(statusBadges.nth(i)).toContainText(/pending/i);
    }
  });

  test("should show pagination controls", async ({ page }) => {
    await expect(page.locator(SELECTORS.requests.pagination).first()).toBeVisible();
    await expect(page.locator(SELECTORS.requests.pageInfo).first()).toBeVisible();
  });

  test("pending request should show Confirm and Cancel buttons", async ({ page }) => {
    const rows = page.locator(SELECTORS.requests.table + " tbody tr");
    const count = await rows.count();

    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);
      const statusBadge = row.locator(SELECTORS.requests.statusBadge(""));
      if ((await statusBadge.count()) === 0) continue;
      const statusText = await statusBadge.textContent();
      if (!statusText?.toLowerCase().includes("pending")) continue;

      await expect(row.getByRole("button", { name: "Confirm" })).toBeVisible();
      await expect(row.getByRole("button", { name: "Cancel" })).toBeVisible();
      await expect(row.locator('button[aria-label*="Delete"]')).toBeVisible();
      break;
    }
  });

  test("confirmed request should show Cancel button", async ({ page }) => {
    const rows = page.locator(SELECTORS.requests.table + " tbody tr");
    const count = await rows.count();

    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);
      const statusBadge = row.locator(SELECTORS.requests.statusBadge(""));
      if ((await statusBadge.count()) === 0) continue;
      const statusText = await statusBadge.textContent();
      if (!statusText?.toLowerCase().includes("confirmed")) continue;

      await expect(row.getByRole("button", { name: "Confirm" })).toHaveCount(0);
      await expect(row.getByRole("button", { name: "Cancel" })).toBeVisible();
      break;
    }
  });

  test("completed request should show Archive and Delete buttons", async ({ page }) => {
    const rows = page.locator(SELECTORS.requests.table + " tbody tr");
    const count = await rows.count();

    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);
      const statusBadge = row.locator(SELECTORS.requests.statusBadge(""));
      if ((await statusBadge.count()) === 0) continue;
      const statusText = await statusBadge.textContent();
      if (!statusText?.toLowerCase().includes("completed")) continue;

      await expect(row.locator('button[aria-label*="Archive"]')).toBeVisible();
      await expect(row.locator('button[aria-label*="Delete"]')).toBeVisible();
      break;
    }
  });

  test("clicking Confirm should show success toast", async ({ page }) => {
    const rows = page.locator(SELECTORS.requests.table + " tbody tr");
    const count = await rows.count();

    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);
      const statusBadge = row.locator(SELECTORS.requests.statusBadge(""));
      if ((await statusBadge.count()) === 0) continue;
      const statusText = await statusBadge.textContent();
      if (!statusText?.toLowerCase().includes("pending")) continue;

      await row.getByRole("button", { name: "Confirm" }).click();
      const toast = page.locator(SELECTORS.toast.success);
      await expect(toast).toBeVisible({ timeout: 5000 });
      await expect(toast).toContainText(/confirm/i);
      break;
    }
  });

  test("clicking Cancel should show success toast", async ({ page }) => {
    const rows = page.locator(SELECTORS.requests.table + " tbody tr");
    const count = await rows.count();

    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);
      const statusBadge = row.locator(SELECTORS.requests.statusBadge(""));
      if ((await statusBadge.count()) === 0) continue;
      const statusText = await statusBadge.textContent();
      if (!/pending|confirmed/i.test(statusText ?? "")) continue;

      await row.getByRole("button", { name: "Cancel" }).click();
      const toast = page.locator(SELECTORS.toast.success);
      await expect(toast).toBeVisible({ timeout: 5000 });
      await expect(toast).toContainText(/cancel/i);
      break;
    }
  });

  test("clicking Archive should show success toast", async ({ page }) => {
    const rows = page.locator(SELECTORS.requests.table + " tbody tr");
    const count = await rows.count();

    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);
      const statusBadge = row.locator(SELECTORS.requests.statusBadge(""));
      if ((await statusBadge.count()) === 0) continue;
      const statusText = await statusBadge.textContent();
      if (!/completed|cancelled/i.test(statusText ?? "")) continue;

      await row.locator('button[aria-label*="Archive"]').click();
      const toast = page.locator(SELECTORS.toast.success);
      await expect(toast).toBeVisible({ timeout: 5000 });
      await expect(toast).toContainText(/archiv/i);
      break;
    }
  });

  test("clicking Delete should show success toast", async ({ page }) => {
    const rows = page.locator(SELECTORS.requests.table + " tbody tr");
    const count = await rows.count();

    for (let i = 0; i < count; i++) {
      const deleteBtn = rows.nth(i).locator('button[aria-label*="Delete"]');
      if ((await deleteBtn.count()) === 0) continue;

      await deleteBtn.click();
      const toast = page.locator(SELECTORS.toast.success);
      await expect(toast).toBeVisible({ timeout: 5000 });
      await expect(toast).toContainText(/delet/i);
      break;
    }
  });
});
