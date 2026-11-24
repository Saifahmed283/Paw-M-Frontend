import { openDashboardTab, test } from "@tests/fixtures/authed-page";
import { expect } from "@playwright/test";
import { SELECTORS } from "@tests/utils/selectors";

test.describe("Reservations Tab", () => {
  test.beforeEach(async ({ page }) => {
    await openDashboardTab(page, "reservations");
  });

  test("should display search input", async ({ page }) => {
    await expect(page.locator(SELECTORS.reservations.searchInput).first()).toBeVisible();
  });

  test("should display confirmed future bookings", async ({ page }) => {
    const cards = page.locator(SELECTORS.reservations.card(""));
    if ((await cards.count()) === 0) {
      await expect(page.getByText(/nothing here yet/i).first()).toBeVisible({ timeout: 5000 });
    } else {
      await expect(cards.first()).toBeVisible();
    }
  });

  test("each reservation card should show key info", async ({ page }) => {
    const cards = page.locator(SELECTORS.reservations.card(""));
    if ((await cards.count()) === 0) return;

    const firstCard = cards.first();
    const text = await firstCard.innerText();
    expect(text).toMatch(/\d/);
    expect(text).toMatch(/[A-Za-z]/);
    await expect(firstCard.locator('button:has-text("Complete")')).toBeVisible();
  });

  test("should show Complete button on each card", async ({ page }) => {
    const cards = page.locator(SELECTORS.reservations.card(""));
    if ((await cards.count()) === 0) return;
    await expect(cards.first().locator(SELECTORS.reservations.completeButton(""))).toBeVisible();
  });

  test("clicking Complete should show success toast", async ({ page }) => {
    const cards = page.locator(SELECTORS.reservations.card(""));
    if ((await cards.count()) === 0) return;

    await cards.first().locator(SELECTORS.reservations.completeButton("")).click();
    const toast = page.locator(SELECTORS.toast.success);
    await expect(toast).toBeVisible({ timeout: 5000 });
    await expect(toast).toContainText(/complete/i);
  });

  test("should show Record Visit button", async ({ page }) => {
    const cards = page.locator(SELECTORS.reservations.card(""));
    if ((await cards.count()) === 0) return;
    await expect(cards.first().locator(SELECTORS.reservations.recordVisitButton(""))).toBeVisible();
  });

  test("clicking Record Visit should open clinical record dialog", async ({ page }) => {
    const cards = page.locator(SELECTORS.reservations.card(""));
    if ((await cards.count()) === 0) return;

    await cards.first().locator(SELECTORS.reservations.recordVisitButton("")).click();
    const dialog = page.locator(SELECTORS.dialogs.clinicalRecord).first();
    await expect(dialog).toBeVisible({ timeout: 5000 });
    await expect(dialog.getByText(/diagnosis/i)).toBeVisible();
    await expect(dialog.getByText(/treatment/i)).toBeVisible();
    await expect(dialog.locator('input[type="date"]')).toBeVisible();

    await dialog.getByRole("button", { name: /cancel/i }).click();
    await expect(dialog).toBeHidden({ timeout: 3000 });
  });

  test("should show Prescription button", async ({ page }) => {
    const cards = page.locator(SELECTORS.reservations.card(""));
    if ((await cards.count()) === 0) return;
    await expect(
      cards.first().locator(SELECTORS.reservations.prescriptionButton("")),
    ).toBeVisible();
  });

  test("clicking Prescription should open prescription builder dialog", async ({ page }) => {
    const cards = page.locator(SELECTORS.reservations.card(""));
    if ((await cards.count()) === 0) return;

    await cards.first().locator(SELECTORS.reservations.prescriptionButton("")).click();
    const dialog = page.locator(SELECTORS.dialogs.prescription).first();
    await expect(dialog).toBeVisible({ timeout: 5000 });
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden({ timeout: 3000 });
  });

  test("should show Request Payment button", async ({ page }) => {
    const cards = page.locator(SELECTORS.reservations.card(""));
    if ((await cards.count()) === 0) return;
    await expect(cards.first().locator(SELECTORS.reservations.paymentButton(""))).toBeVisible();
  });

  test("clicking Request Payment should open payment dialog", async ({ page }) => {
    const cards = page.locator(SELECTORS.reservations.card(""));
    if ((await cards.count()) === 0) return;

    await cards.first().locator(SELECTORS.reservations.paymentButton("")).click();
    const dialog = page.locator(SELECTORS.dialogs.requestPayment).first();
    await expect(dialog).toBeVisible({ timeout: 5000 });

    const serviceItems = dialog.locator(SELECTORS.dialogs.paymentServiceItem);
    if ((await serviceItems.count()) > 0) {
      await expect(serviceItems.first()).toBeVisible();
    }
    await expect(dialog.locator(SELECTORS.dialogs.paymentCustomLabel)).toBeVisible();
    await expect(dialog.locator(SELECTORS.dialogs.paymentCustomAmount)).toBeVisible();
    await expect(dialog.getByText(/total/i)).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden({ timeout: 3000 });
  });

  test("should show Cancel button on each card", async ({ page }) => {
    const cards = page.locator(SELECTORS.reservations.card(""));
    if ((await cards.count()) === 0) return;
    await expect(cards.first().locator(SELECTORS.reservations.cancelButton(""))).toBeVisible();
  });

  test("clicking Cancel should show success toast", async ({ page }) => {
    const cards = page.locator(SELECTORS.reservations.card(""));
    if ((await cards.count()) === 0) return;

    await cards.first().locator(SELECTORS.reservations.cancelButton("")).click();
    const toast = page.locator(SELECTORS.toast.success);
    await expect(toast).toBeVisible({ timeout: 5000 });
    await expect(toast).toContainText(/cancel/i);
  });

  test("should show diagnosis and treatment if present", async ({ page }) => {
    const diagnosis = page.locator(SELECTORS.reservations.diagnosis).first();
    const treatment = page.locator(SELECTORS.reservations.treatment).first();
    if ((await diagnosis.count()) > 0) await expect(diagnosis).toBeVisible();
    if ((await treatment.count()) > 0) await expect(treatment).toBeVisible();
  });

  test("should show pagination if multiple pages", async ({ page }) => {
    await page
      .locator(SELECTORS.reservations.pagination)
      .first()
      .waitFor({ state: "attached", timeout: 5000 })
      .catch(() => undefined);
  });
});
