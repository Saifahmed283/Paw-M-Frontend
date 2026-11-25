import { test } from "@tests/fixtures/test-data";
import { expect } from "@playwright/test";
import { SELECTORS } from "@tests/utils/selectors";

test.describe("Booking CRUD Lifecycle", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForSelector(SELECTORS.dashboard.sidebar);
  });

  test("should create booking via API and appear in Requests tab", async ({
    page,
    testBooking,
  }) => {
    test.skip(!testBooking, "Test booking not created");

    // Navigate to requests tab
    const requestsTab = page.locator(SELECTORS.nav.tabButton("requests")).first();
    await requestsTab.click();
    await page.waitForTimeout(500);

    // Should find the test booking in the table
    const rows = page.locator(SELECTORS.requests.table + " tbody tr");
    const count = await rows.count();

    let found = false;
    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);
      const text = await row.textContent();
      if (text?.includes(testBooking.ownerName) || text?.includes(testBooking.petName)) {
        found = true;

        // Verify it shows as pending
        const statusBadge = row.locator(SELECTORS.requests.statusBadge(""));
        await expect(statusBadge).toContainText(/pending/i);
        break;
      }
    }

    expect(found).toBeTruthy();
  });

  test("should confirm booking and move to Reservations tab", async ({
    page,
    testBooking,
    adminToken,
  }) => {
    test.skip(!testBooking, "Test booking not created");

    const { createApiRequest, setBookingStatus } = await import("../../fixtures/api-helpers");
    const apiRequest = await createApiRequest(adminToken);

    // Confirm via API
    await setBookingStatus(apiRequest, adminToken, testBooking.id, "confirmed");
    await apiRequest.dispose();

    // Navigate to requests tab
    const requestsTab = page.locator(SELECTORS.nav.tabButton("requests")).first();
    await requestsTab.click();
    await page.waitForTimeout(500);

    // Booking should no longer be in pending requests
    const rows = page.locator(SELECTORS.requests.table + " tbody tr");
    const count = await rows.count();

    let foundInPending = false;
    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);
      const text = await row.textContent();
      if (text?.includes(testBooking.ownerName)) {
        foundInPending = true;
        break;
      }
    }

    expect(foundInPending).toBeFalsy();

    // Navigate to reservations tab
    const reservationsTab = page.locator(SELECTORS.nav.tabButton("reservations")).first();
    await reservationsTab.click();
    await page.waitForTimeout(500);

    // Should find it in reservations
    const cards = page.locator(SELECTORS.reservations.card(""));
    const cardCount = await cards.count();

    let foundInReservations = false;
    for (let i = 0; i < cardCount; i++) {
      const card = cards.nth(i);
      const text = await card.textContent();
      if (text?.includes(testBooking.ownerName) || text?.includes(testBooking.petName)) {
        foundInReservations = true;
        break;
      }
    }

    expect(foundInReservations).toBeTruthy();
  });

  test("should complete booking from Reservations tab", async ({
    page,
    testBooking,
    adminToken,
  }) => {
    test.skip(!testBooking, "Test booking not created");

    const { createApiRequest, setBookingStatus } = await import("../../fixtures/api-helpers");
    const apiRequest = await createApiRequest(adminToken);

    // First confirm
    await setBookingStatus(apiRequest, adminToken, testBooking.id, "confirmed");

    // Navigate to reservations
    const reservationsTab = page.locator(SELECTORS.nav.tabButton("reservations")).first();
    await reservationsTab.click();
    await page.waitForTimeout(500);

    // Find and click Complete
    const cards = page.locator(SELECTORS.reservations.card(""));
    const count = await cards.count();

    for (let i = 0; i < count; i++) {
      const card = cards.nth(i);
      const text = await card.textContent();
      if (text?.includes(testBooking.ownerName)) {
        const completeBtn = card.locator(SELECTORS.reservations.completeButton(""));
        await completeBtn.click();

        const toast = page.locator(SELECTORS.toast.success);
        await expect(toast).toBeVisible({ timeout: 5000 });
        await expect(toast).toContainText(/complete/i);
        break;
      }
    }

    await apiRequest.dispose();
  });

  test("completed booking should show Archive button", async ({
    page,
    testBooking,
    adminToken,
  }) => {
    test.skip(!testBooking, "Test booking not created");

    const { createApiRequest, setBookingStatus } = await import("../../fixtures/api-helpers");
    const apiRequest = await createApiRequest(adminToken);

    // Confirm and complete
    await setBookingStatus(apiRequest, adminToken, testBooking.id, "confirmed");
    await setBookingStatus(apiRequest, adminToken, testBooking.id, "completed");
    await apiRequest.dispose();

    // Navigate to requests tab (completed bookings appear there with archive option)
    const requestsTab = page.locator(SELECTORS.nav.tabButton("requests")).first();
    await requestsTab.click();
    await page.waitForTimeout(500);

    // Find the completed booking
    const rows = page.locator(SELECTORS.requests.table + " tbody tr");
    const count = await rows.count();

    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);
      const text = await row.textContent();
      if (text?.includes(testBooking.ownerName)) {
        // Should have Archive button
        const archiveBtn = row.locator(
          'button[aria-label*="Archive"], button:has([data-lucide="archive"])',
        );
        await expect(archiveBtn).toBeVisible();

        // Should have Delete button
        const deleteBtn = row.locator(
          'button[aria-label*="Delete"], button:has([data-lucide="trash"])',
        );
        await expect(deleteBtn).toBeVisible();
        break;
      }
    }
  });

  test("should archive booking", async ({ page, testBooking, adminToken }) => {
    test.skip(!testBooking, "Test booking not created");

    const { createApiRequest, setBookingStatus, archiveBooking } =
      await import("../../fixtures/api-helpers");
    const apiRequest = await createApiRequest(adminToken);

    // Confirm, complete, then archive via API
    await setBookingStatus(apiRequest, adminToken, testBooking.id, "confirmed");
    await setBookingStatus(apiRequest, adminToken, testBooking.id, "completed");

    const archiveRes = await apiRequest.patch(`/bookings/${testBooking.id}/archive`, {
      data: { archived: true },
    });
    expect(archiveRes.ok()).toBeTruthy();

    await apiRequest.dispose();

    // Navigate to requests tab - should not appear
    const requestsTab = page.locator(SELECTORS.nav.tabButton("requests")).first();
    await requestsTab.click();
    await page.waitForTimeout(500);

    const rows = page.locator(SELECTORS.requests.table + " tbody tr");
    const count = await rows.count();

    let foundInRequests = false;
    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);
      const text = await row.textContent();
      if (text?.includes(testBooking.ownerName)) {
        foundInRequests = true;
        break;
      }
    }

    expect(foundInRequests).toBeFalsy();

    // Navigate to archive tab
    const archiveTab = page.locator(SELECTORS.nav.tabButton("archive")).first();
    if ((await archiveTab.count()) > 0) {
      await archiveTab.click();
      await page.waitForTimeout(500);

      // Should find it in archive
      const archiveRows = page.locator("table tbody tr");
      const archiveCount = await archiveRows.count();

      let foundInArchive = false;
      for (let i = 0; i < archiveCount; i++) {
        const row = archiveRows.nth(i);
        const text = await row.textContent();
        if (text?.includes(testBooking.ownerName)) {
          foundInArchive = true;
          break;
        }
      }

      expect(foundInArchive).toBeTruthy();
    }
  });

  test("should delete booking", async ({ page, testBooking, adminToken }) => {
    test.skip(!testBooking, "Test booking not created");

    const { createApiRequest, deleteTestBooking } = await import("../../fixtures/api-helpers");
    const apiRequest = await createApiRequest(adminToken);

    // Delete via API
    await deleteTestBooking(apiRequest, adminToken, testBooking.id);
    await apiRequest.dispose();

    // Navigate to requests tab - should not appear
    const requestsTab = page.locator(SELECTORS.nav.tabButton("requests")).first();
    await requestsTab.click();
    await page.waitForTimeout(500);

    const rows = page.locator(SELECTORS.requests.table + " tbody tr");
    const count = await rows.count();

    let found = false;
    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);
      const text = await row.textContent();
      if (text?.includes(testBooking.ownerName)) {
        found = true;
        break;
      }
    }

    expect(found).toBeFalsy();
  });

  test("should filter bookings by status in Requests tab", async ({
    page,
    testBooking,
    adminToken,
  }) => {
    test.skip(!testBooking, "Test booking not created");

    const { createApiRequest, setBookingStatus } = await import("../../fixtures/api-helpers");
    const apiRequest = await createApiRequest(adminToken);

    // Create second booking and confirm it
    const booking2 = await (
      await import("../../fixtures/api-helpers")
    ).createTestBooking(apiRequest, adminToken, {
      status: "pending",
      ownerName: `Test Owner 2 ${Date.now()}`,
      petName: `Test Pet 2 ${Date.now()}`,
    });
    await setBookingStatus(apiRequest, adminToken, booking2.id, "confirmed");

    await apiRequest.dispose();

    // Navigate to requests tab
    const requestsTab = page.locator(SELECTORS.nav.tabButton("requests")).first();
    await requestsTab.click();
    await page.waitForTimeout(500);

    // Filter by Pending
    const pendingFilter = page.locator(SELECTORS.requests.statusOption("pending")).first();
    await pendingFilter.click();
    await page.waitForTimeout(500);

    // Should only show pending (testBooking)
    const rows = page.locator(SELECTORS.requests.table + " tbody tr");
    const count = await rows.count();

    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);
      const statusBadge = row.locator(SELECTORS.requests.statusBadge(""));
      await expect(statusBadge).toContainText(/pending/i);
    }

    // Filter by Confirmed
    const confirmedFilter = page.locator(SELECTORS.requests.statusOption("confirmed")).first();
    await confirmedFilter.click();
    await page.waitForTimeout(500);

    // Should only show confirmed (booking2)
    const confirmedRows = page.locator(SELECTORS.requests.table + " tbody tr");
    const confirmedCount = await confirmedRows.count();

    for (let i = 0; i < confirmedCount; i++) {
      const row = confirmedRows.nth(i);
      const statusBadge = row.locator(SELECTORS.requests.statusBadge(""));
      await expect(statusBadge).toContainText(/confirmed/i);
    }

    // Cleanup
    const apiRequest2 = await createApiRequest(adminToken);
    await (
      await import("../../fixtures/api-helpers")
    ).deleteTestBooking(apiRequest2, adminToken, booking2.id);
    await apiRequest2.dispose();
  });
});

test.describe("Booking UI Interactions", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForSelector(SELECTORS.dashboard.sidebar);
  });

  test("clicking Confirm on pending booking shows toast", async ({
    page,
    testBooking,
    adminToken,
  }) => {
    test.skip(!testBooking, "Test booking not created");

    const requestsTab = page.locator(SELECTORS.nav.tabButton("requests")).first();
    await requestsTab.click();
    await page.waitForTimeout(500);

    const rows = page.locator(SELECTORS.requests.table + " tbody tr");
    const count = await rows.count();

    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);
      const text = await row.textContent();
      if (text?.includes(testBooking.ownerName)) {
        const confirmBtn = row.locator('button:has-text("Confirm")');
        await confirmBtn.click();

        const toast = page.locator(SELECTORS.toast.success);
        await expect(toast).toBeVisible({ timeout: 5000 });
        await expect(toast).toContainText(/confirm/i);
        break;
      }
    }
  });

  test("clicking Cancel on pending booking shows toast", async ({
    page,
    testBooking,
    adminToken,
  }) => {
    test.skip(!testBooking, "Test booking not created");

    const { createApiRequest, setBookingStatus } = await import("../../fixtures/api-helpers");
    const apiRequest = await createApiRequest(adminToken);

    // Need a fresh pending booking
    const booking2 = await (
      await import("../../fixtures/api-helpers")
    ).createTestBooking(apiRequest, adminToken, {
      status: "pending",
      ownerName: `Test Owner Cancel ${Date.now()}`,
      petName: `Test Pet Cancel ${Date.now()}`,
    });

    await apiRequest.dispose();

    const requestsTab = page.locator(SELECTORS.nav.tabButton("requests")).first();
    await requestsTab.click();
    await page.waitForTimeout(500);

    const rows = page.locator(SELECTORS.requests.table + " tbody tr");
    const count = await rows.count();

    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);
      const text = await row.textContent();
      if (text?.includes(booking2.ownerName)) {
        const cancelBtn = row.locator('button:has-text("Cancel")');
        await cancelBtn.click();

        const toast = page.locator(SELECTORS.toast.success);
        await expect(toast).toBeVisible({ timeout: 5000 });
        await expect(toast).toContainText(/cancel/i);
        break;
      }
    }

    // Cleanup
    const apiRequest2 = await createApiRequest(adminToken);
    await (
      await import("../../fixtures/api-helpers")
    ).deleteTestBooking(apiRequest2, adminToken, booking2.id);
    await apiRequest2.dispose();
  });
});
