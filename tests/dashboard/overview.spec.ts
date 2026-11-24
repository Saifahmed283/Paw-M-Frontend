import { openDashboardTab, test, waitForDashboard } from "@tests/fixtures/authed-page";
import { expect } from "@playwright/test";
import { SELECTORS } from "@tests/utils/selectors";

test.describe("Overview Tab", () => {
  test.beforeEach(async ({ page }) => {
    await openDashboardTab(page, "overview");
  });

  test("should display stats cards with correct labels", async ({ page }) => {
    const statsContainer = page.getByTestId("overview-stats");
    await expect(statsContainer).toBeVisible();

    const labels = [
      "Pending requests",
      "Confirmed reservations",
      "Completed visits",
      "Active doctors",
    ];
    for (const label of labels) {
      await expect(statsContainer.getByText(label, { exact: true })).toBeVisible();
    }
  });

  test("should display today's appointments section", async ({ page }) => {
    const todaySection = page.getByTestId("today-appointments");
    await expect(todaySection).toBeVisible();
    await expect(todaySection.getByRole("heading", { name: /today/i })).toBeVisible();
  });

  test("should display recent activity section", async ({ page }) => {
    const recentSection = page.getByTestId("recent-activity");
    await expect(recentSection).toBeVisible();
    await expect(recentSection.getByRole("heading", { name: /recent requests/i })).toBeVisible();
    await expect(recentSection.getByText(/latest booking requests/i)).toBeVisible();
  });

  test("should show empty state when no appointments today", async ({ page }) => {
    const todaySection = page.getByTestId("today-appointments");
    const hasAppointments = (await todaySection.getByTestId("today-appointment").count()) > 0;
    const hasEmptyMessage = await todaySection.getByText(/nothing scheduled today/i).isVisible();

    expect(hasAppointments || hasEmptyMessage).toBeTruthy();
  });

  test("complete button should show toast when clicked", async ({ page }) => {
    const completeBtn = page
      .getByTestId("today-appointments")
      .getByRole("button", { name: /^complete$/i })
      .first();

    if ((await completeBtn.count()) > 0) {
      await completeBtn.click();

      const toast = page.locator(SELECTORS.toast.success);
      await expect(toast).toBeVisible({ timeout: 5000 });
      await expect(toast).toContainText(/complete|completed/i);
    }
  });

  test("recent activity table should render when requests exist", async ({ page }) => {
    const recentSection = page.getByTestId("recent-activity");
    const table = recentSection.locator("table").first();

    if ((await table.count()) > 0) {
      await expect(table).toBeVisible();
      const firstRow = table.locator("tbody tr").first();
      await expect(firstRow).toBeVisible();
      expect(await firstRow.locator("td").count()).toBeGreaterThanOrEqual(4);
    } else {
      await expect(recentSection.getByText(/nothing here yet/i)).toBeVisible();
    }
  });
});

test.describe("Overview - Role specific", () => {
  test("staff should see overview as first tab", async ({ page }) => {
    // A fresh /dashboard visit should be normalised to the overview tab.
    await page.goto("/dashboard");
    await waitForDashboard(page);
    await expect(page).toHaveURL(/[?&]tab=overview/);
  });
});
