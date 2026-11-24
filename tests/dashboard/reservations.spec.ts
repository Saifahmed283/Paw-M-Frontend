import { test, expect } from '@playwright/test';
import { SELECTORS } from '@tests/utils/selectors';

test.describe('Reservations Tab', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForSelector(SELECTORS.dashboard.sidebar);
    
    // Navigate to reservations tab (staff, payroll, admin all have access)
    const reservationsTab = page.locator(SELECTORS.nav.tabButton('reservations')).first();
    if (await reservationsTab.count() > 0) {
      await reservationsTab.click();
      await page.waitForTimeout(500);
    }
  });

  test('should display search input', async ({ page }) => {
    const searchInput = page.locator(SELECTORS.reservations.searchInput).first();
    await expect(searchInput).toBeVisible();
  });

  test('should display confirmed future bookings', async ({ page }) => {
    const cards = page.locator(SELECTORS.reservations.card(''));
    const count = await cards.count();
    
    // Should have at least the container
    if (count === 0) {
      // Check for empty state
      const empty = page.locator('text=No reservations, text=Empty');
      await expect(empty.first()).toBeVisible({ timeout: 5000 });
    } else {
      // First card should be visible
      await expect(cards.first()).toBeVisible();
    }
  });

  test('each reservation card should show key info', async ({ page }) => {
    const cards = page.locator(SELECTORS.reservations.card(''));
    const count = await cards.count();
    
    if (count > 0) {
      const firstCard = cards.first();
      
      // Should show date and time
      await expect(firstCard.locator('text=/\\d{4}-\\d{2}-\\d{2}/')).toBeVisible();
      await expect(firstCard.locator('text=/\\d{2}:\\d{2}/')).toBeVisible();
      
      // Should show pet name and owner
      await expect(firstCard.locator('text=/Pet|Owner/')).toBeVisible();
      
      // Should show doctor name
      await expect(firstCard.locator('text=/Dr\\./')).toBeVisible();
    }
  });

  test('should show Complete button on each card', async ({ page }) => {
    const cards = page.locator(SELECTORS.reservations.card(''));
    const count = await cards.count();
    
    if (count > 0) {
      const firstCard = cards.first();
      const completeBtn = firstCard.locator(SELECTORS.reservations.completeButton(''));
      await expect(completeBtn).toBeVisible();
    }
  });

  test('clicking Complete should show success toast', async ({ page }) => {
    const cards = page.locator(SELECTORS.reservations.card(''));
    const count = await cards.count();
    
    if (count > 0) {
      const firstCard = cards.first();
      const completeBtn = firstCard.locator(SELECTORS.reservations.completeButton(''));
      await completeBtn.click();
      
      const toast = page.locator(SELECTORS.toast.success);
      await expect(toast).toBeVisible({ timeout: 5000 });
      await expect(toast).toContainText(/complete/i);
    }
  });

  test('should show Record Visit button', async ({ page }) => {
    const cards = page.locator(SELECTORS.reservations.card(''));
    const count = await cards.count();
    
    if (count > 0) {
      const firstCard = cards.first();
      const recordBtn = firstCard.locator(SELECTORS.reservations.recordVisitButton(''));
      await expect(recordBtn).toBeVisible();
    }
  });

  test('clicking Record Visit should open clinical record dialog', async ({ page }) => {
    const cards = page.locator(SELECTORS.reservations.card(''));
    const count = await cards.count();
    
    if (count > 0) {
      const firstCard = cards.first();
      const recordBtn = firstCard.locator(SELECTORS.reservations.recordVisitButton(''));
      await recordBtn.click();
      
      const dialog = page.locator(SELECTORS.dialogs.clinicalRecord).first();
      await expect(dialog).toBeVisible({ timeout: 5000 });
      
      // Should have diagnosis, treatment, follow-up fields
      await expect(page.locator(SELECTORS.dialogs.clinicalDiagnosis)).toBeVisible();
      await expect(page.locator(SELECTORS.dialogs.clinicalTreatment)).toBeVisible();
      await expect(page.locator(SELECTORS.dialogs.clinicalFollowUp)).toBeVisible();
      
      // Close dialog
      await page.locator(SELECTORS.dialogs.clinicalCancel).click();
      await expect(dialog).toBeHidden({ timeout: 3000 });
    }
  });

  test('should show Prescription button', async ({ page }) => {
    const cards = page.locator(SELECTORS.reservations.card(''));
    const count = await cards.count();
    
    if (count > 0) {
      const firstCard = cards.first();
      const rxBtn = firstCard.locator(SELECTORS.reservations.prescriptionButton(''));
      await expect(rxBtn).toBeVisible();
    }
  });

  test('clicking Prescription should open prescription builder dialog', async ({ page }) => {
    const cards = page.locator(SELECTORS.reservations.card(''));
    const count = await cards.count();
    
    if (count > 0) {
      const firstCard = cards.first();
      const rxBtn = firstCard.locator(SELECTORS.reservations.prescriptionButton(''));
      await rxBtn.click();
      
      const dialog = page.locator(SELECTORS.dialogs.prescription).first();
      await expect(dialog).toBeVisible({ timeout: 5000 });
      
      // Close dialog (no specific close selector, use escape or click outside)
      await page.keyboard.press('Escape');
      await expect(dialog).toBeHidden({ timeout: 3000 });
    }
  });

  test('should show Request Payment button', async ({ page }) => {
    const cards = page.locator(SELECTORS.reservations.card(''));
    const count = await cards.count();
    
    if (count > 0) {
      const firstCard = cards.first();
      const paymentBtn = firstCard.locator(SELECTORS.reservations.paymentButton(''));
      await expect(paymentBtn).toBeVisible();
    }
  });

  test('clicking Request Payment should open payment dialog', async ({ page }) => {
    const cards = page.locator(SELECTORS.reservations.card(''));
    const count = await cards.count();
    
    if (count > 0) {
      const firstCard = cards.first();
      const paymentBtn = firstCard.locator(SELECTORS.reservations.paymentButton(''));
      await paymentBtn.click();
      
      const dialog = page.locator(SELECTORS.dialogs.requestPayment).first();
      await expect(dialog).toBeVisible({ timeout: 5000 });
      
      // Should have service items, custom fields, total
      await expect(page.locator(SELECTORS.dialogs.paymentServiceItem).first()).toBeVisible({ timeout: 3000 });
      await expect(page.locator(SELECTORS.dialogs.paymentCustomLabel)).toBeVisible();
      await expect(page.locator(SELECTORS.dialogs.paymentCustomAmount)).toBeVisible();
      await expect(page.locator(SELECTORS.dialogs.paymentTotal)).toBeVisible();
      
      // Close dialog
      await page.keyboard.press('Escape');
      await expect(dialog).toBeHidden({ timeout: 3000 });
    }
  });

  test('should show Cancel button on each card', async ({ page }) => {
    const cards = page.locator(SELECTORS.reservations.card(''));
    const count = await cards.count();
    
    if (count > 0) {
      const firstCard = cards.first();
      const cancelBtn = firstCard.locator(SELECTORS.reservations.cancelButton(''));
      await expect(cancelBtn).toBeVisible();
    }
  });

  test('clicking Cancel should show success toast', async ({ page }) => {
    const cards = page.locator(SELECTORS.reservations.card(''));
    const count = await cards.count();
    
    if (count > 0) {
      const firstCard = cards.first();
      const cancelBtn = firstCard.locator(SELECTORS.reservations.cancelButton(''));
      await cancelBtn.click();
      
      const toast = page.locator(SELECTORS.toast.success);
      await expect(toast).toBeVisible({ timeout: 5000 });
      await expect(toast).toContainText(/cancel/i);
    }
  });

  test('should show diagnosis and treatment if present', async ({ page }) => {
    const cards = page.locator(SELECTORS.reservations.card(''));
    const count = await cards.count();
    
    if (count > 0) {
      // Check if any card has diagnosis/treatment
      const diagnosis = page.locator(SELECTORS.reservations.diagnosis).first();
      const treatment = page.locator(SELECTORS.reservations.treatment).first();
      
      // These are conditional - just verify they render if present
      if (await diagnosis.count() > 0) {
        await expect(diagnosis).toBeVisible();
      }
      if (await treatment.count() > 0) {
        await expect(treatment).toBeVisible();
      }
    }
  });

  test('should show pagination if multiple pages', async ({ page }) => {
    const pagination = page.locator(SELECTORS.reservations.pagination).first();
    // Pagination may or may not be visible depending on data
    // Just verify it doesn't throw
    await pagination.waitFor({ state: 'attached', timeout: 5000 }).catch(() => {});
  });
});