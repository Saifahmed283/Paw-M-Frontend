import { openDashboardTab, test } from "@tests/fixtures/authed-page";
import { expect, type Page } from "@playwright/test";

const DAY = "2026-11-24";

function withdrawal(overrides: Record<string, unknown> = {}) {
  return {
    id: "CW-1",
    date: DAY,
    amount: 75,
    note: "Transport to supplier",
    status: "pending",
    requestedBy: 7,
    requesterUsername: "cashier",
    employeeId: "EMP-1",
    employeeName: "Cashier One",
    workSessionId: "WS-1",
    reviewNote: "",
    reviewedBy: null,
    reviewerUsername: null,
    reviewedAt: null,
    createdAt: `${DAY}T10:00:00.000Z`,
    ...overrides,
  };
}

function workDay(view: "admin" | "staff") {
  return {
    date: DAY,
    view,
    scopeEmployeeId: view === "staff" ? "EMP-1" : null,
    session: null,
    sessions: [],
    staff: [
      {
        id: "EMP-1",
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
        custody: null,
        sessions: [],
        shiftCount: 1,
        firstCheckIn: `${DAY}T08:00:00.000Z`,
        lastCheckOut: `${DAY}T16:00:00.000Z`,
        hours: 8,
        ordersCount: 1,
        revenue: 120,
        cashCollected: 120,
        activityCount: 1,
        logs: [
          {
            id: "LOG-1",
            action: "follow_up_system",
            target: "",
            detail: "Follow up system",
            count: 4,
            createdAt: `${DAY}T10:00:00.000Z`,
          },
        ],
      },
    ],
    bookings: [
      {
        id: "BK-1",
        date: DAY,
        time: "09:00",
        ownerName: "Olivia",
        petName: "Milo",
        animalType: "dog",
        doctorName: "Dr. Smith",
        status: "pending",
        archived: false,
      },
    ],
    orders: [
      {
        id: "ORD-1",
        customerName: "Olivia",
        total: 120,
        paymentMethod: "cash",
        paymentStatus: "paid",
        status: "pending",
        archived: false,
        items: [{ name: "Shampoo", qty: 1 }],
      },
    ],
    payments: [
      {
        id: "PAY-1",
        title: "Manual payment",
        amount: 120,
        method: "cash",
        status: "paid",
        notes: "",
        items: [],
      },
    ],
    logs: [
      {
        id: "LOG-1",
        action: "follow_up_system",
        target: "",
        detail: "Follow up system",
        createdAt: `${DAY}T10:00:00.000Z`,
      },
    ],
    finance: {
      byMethod: [
        { method: "cash", collected: 120, pending: 0, refunded: 0, net: 120 },
        { method: "fawry", collected: 0, pending: 0, refunded: 0, net: 0 },
        { method: "instapay", collected: 0, pending: 0, refunded: 0, net: 0 },
      ],
      byKind: [],
      items: [{ kind: "product", label: "Shampoo", count: 1, amount: 120 }],
      totals: { sales: 120, orders: 120, products: 120, payments: 120, pending: 0, refunded: 0 },
      counts: { payments: 1, paidPayments: 1, orders: 1, verifications: 0 },
      cashDrawer: { expected: 830, counted: 830, variance: 0, note: "", countedBy: "Admin" },
      openingAmount: 100,
    },
    withdrawals: [],
  };
}

async function mockWorkDayRoutes(
  page: Page,
  view: "admin" | "staff",
  rows: Record<string, unknown>[],
) {
  await page.route("**/api/work-days", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([
        {
          date: DAY,
          bookings: 1,
          orders: 1,
          payments: 1,
          revenue: 120,
          paymentsTotal: 120,
          session: null,
        },
      ]),
    });
  });

  await page.route(`**/api/work-days/${DAY}`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(workDay(view)),
    });
  });

  await page.route("**/api/cash-withdrawals**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        date: DAY,
        available: 830,
        expected: 830,
        counted: 830,
        openingAmount: 100,
        reserved: 0,
        close: null,
        withdrawals: rows,
      }),
    });
  });
}

test.describe("workday withdrawal review", () => {
  test("admin approves a pending withdrawal after reviewing the note", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== "admin", "admin only");
    const rows = [withdrawal()];
    await mockWorkDayRoutes(page, "admin", rows);
    await page.route("**/api/cash-withdrawals/CW-1/approve", async (route) => {
      rows[0] = withdrawal({ status: "approved", reviewNote: "Verified", reviewedBy: 7 });
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ withdrawal: rows[0], available: 755 }),
      });
    });

    await openDashboardTab(page, "workdays");
    await page.getByTestId(`workday-folder-${DAY}`).click();

    const card = page.getByTestId("withdrawal-card");
    await expect(card).toContainText("Transport to supplier");
    await expect(page.getByTestId("withdrawal-submit")).toHaveCount(0);
    await card.getByTestId("withdrawal-review-note-CW-1").fill("Verified");
    await card.getByTestId("withdrawal-approve-CW-1").click();
    await expect(card.getByTestId("withdrawal-row-CW-1")).toContainText("Approved");
  });
});

test.describe("staff workday view", () => {
  test.use({ storageState: "tests/.auth/staff.json" });

  test("shows only the signed-in staff scope and lets them request cash", async ({
    page,
  }, testInfo) => {
    test.skip(!["staff", "mobile-staff"].includes(testInfo.project.name), "staff only");
    const rows: Record<string, unknown>[] = [];
    await mockWorkDayRoutes(page, "staff", rows);
    await page.route("**/api/cash-withdrawals", async (route) => {
      if (route.request().method() === "POST") {
        const body = JSON.parse(route.request().postData() ?? "{}") as {
          amount: number;
          note: string;
        };
        rows.push(withdrawal({ id: "CW-2", amount: body.amount, note: body.note }));
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify({ withdrawal: rows[0], available: 755 }),
        });
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          date: DAY,
          available: 830,
          expected: 830,
          counted: 830,
          openingAmount: 100,
          reserved: 0,
          close: null,
          withdrawals: rows,
        }),
      });
    });

    await openDashboardTab(page, "workdays");
    await page.getByTestId(`workday-folder-${DAY}`).click();

    await expect(page.getByTestId("workday-my-summary")).toBeVisible();
    await expect(page.getByTestId("workday-sales")).toBeVisible();
    await expect(page.getByTestId("workday-finance")).toHaveCount(0);
    await expect(page.getByTestId("workday-appointments")).toHaveCount(0);
    await expect(page.getByTestId("workday-payments")).toHaveCount(0);
    await expect(page.getByTestId("workday-activity")).toHaveCount(0);
    await expect(page.getByTestId("workday-staff-EMP-2")).toHaveCount(0);
    await expect(page.getByTestId("workday-staff-EMP-1")).toContainText("Actions: 1");
    await expect(page.getByTestId("workday-staff-EMP-1")).not.toContainText("×4");

    const card = page.getByTestId("withdrawal-card");
    await card.getByTestId("withdrawal-amount").fill("75");
    await card.getByTestId("withdrawal-note").fill("Transport to supplier");
    await card.getByTestId("withdrawal-submit").click();
    await expect(card.getByTestId("withdrawal-row-CW-2")).toContainText("75");
    await expect(card.getByTestId("withdrawal-approve-CW-2")).toHaveCount(0);
  });
});
