import { openDashboardTab, test } from "@tests/fixtures/authed-page";
import { expect } from "@playwright/test";

const DAY = "2026-11-24";

function log(index: number) {
  return {
    id: `LOG-${index}`,
    action: "cash_received",
    target: `ORD-${index}`,
    detail: `Cash received ${index}`,
    createdAt: `2026-11-24T08:${String(index).padStart(2, "0")}:00.000Z`,
  };
}

test("workday detail shows provider totals, staff hours, and paginated activity", async ({
  page,
}) => {
  await page.route("**/api/work-days", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([
        {
          date: DAY,
          bookings: 1,
          orders: 2,
          payments: 3,
          revenue: 830,
          paymentsTotal: 830,
          session: { id: "WS-1", startedAt: `${DAY}T08:00:00.000Z`, endedAt: null },
        },
      ]),
    });
  });

  await page.route(`**/api/work-days/${DAY}`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        date: DAY,
        session: {
          id: "WS-1",
          date: DAY,
          startedAt: `${DAY}T08:00:00.000Z`,
          endedAt: `${DAY}T16:00:00.000Z`,
          createdAt: `${DAY}T08:00:00.000Z`,
        },
        sessions: [],
        staff: [
          {
            id: "WS-1",
            date: DAY,
            startedAt: `${DAY}T08:00:00.000Z`,
            endedAt: `${DAY}T16:00:00.000Z`,
            createdAt: `${DAY}T08:00:00.000Z`,
            employee: {
              id: "EMP-1",
              fullName: "Cashier One",
              role: "staff",
              email: "cashier@example.com",
            },
            custody: { hasDrawer: true, openingAmount: 100 },
            hours: 8,
            ordersCount: 2,
            revenue: 830,
            activityCount: 12,
            logs: Array.from({ length: 12 }, (_, i) => log(i + 1)),
          },
        ],
        bookings: [],
        orders: [],
        payments: [],
        logs: Array.from({ length: 12 }, (_, i) => log(i + 1)),
        finance: {
          byMethod: [
            { method: "cash", collected: 430, pending: 0, refunded: 0, net: 430 },
            { method: "fawry", collected: 200, pending: 0, refunded: 0, net: 200 },
            { method: "instapay", collected: 200, pending: 0, refunded: 0, net: 200 },
          ],
          byKind: [{ kind: "order", count: 2, collected: 830 }],
          items: [{ kind: "product", label: "Shampoo", count: 2, amount: 200 }],
          totals: {
            sales: 830,
            orders: 830,
            products: 200,
            payments: 830,
            pending: 0,
            refunded: 0,
          },
          counts: { payments: 2, paidPayments: 2, orders: 2, verifications: 2 },
          cashDrawer: { expected: 830, counted: 830, variance: 0, note: "", countedBy: "Admin" },
          openingAmount: 100,
        },
      }),
    });
  });

  await openDashboardTab(page, "workdays");
  await page.getByTestId("workday-folder-2026-11-24").click();

  await expect(page.getByTestId("workday-finance-cash")).toContainText("430");
  await expect(page.getByTestId("workday-finance-fawry")).toContainText("200");
  await expect(page.getByTestId("workday-finance-instapay")).toContainText("200");
  await expect(page.getByTestId("workday-finance-drawer")).toContainText("830");
  await expect(page.getByTestId("workday-staff-WS-1")).toContainText("Cashier One");
  await expect(page.getByTestId("workday-staff-WS-1")).toContainText("8.00");

  const activityPager = page.getByTestId("workday-activity-pagination");
  await expect(activityPager).toBeVisible();
  await expect(page.getByTestId("workday-activity-page-info")).toContainText("of 12");
  await expect(page.locator('[data-testid^="workday-log-"]')).toHaveCount(10);
  await activityPager.getByRole("button", { name: /next/i }).click();
  await expect(page.locator('[data-testid^="workday-log-"]').first()).toHaveAttribute(
    "data-testid",
    "workday-log-LOG-11",
  );
});
