import { test, expect } from '@playwright/test';
import { SELECTORS } from '@tests/utils/selectors';

test.describe('Overview Tab', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForSelector(SELECTORS.dashboard.sidebar);
    // Ensure we're on overview tab
    await page.goto('/dashboard');
    await page.waitForTimeout(500);
  });

  test('should display stats cards with correct labels', async ({ page }) => {
    const statsContainer = page.locator(SELECTORS.overview.statsCards).first();
    await expect(statsContainer).toBeVisible();
    
    // Check for the four stat cards
    const labels = ['Pending', 'Confirmed', 'Completed', 'Doctors'];
    for (const label of labels) {
      const card = page.locator(`text=${label}`).first();
      await expect(card).toBeVisible({ timeout: 5000 });
    }
  });

  test('should display today\'s appointments section', async ({ page }) => {
    const todaySection = page.locator(SELECTORS.overview.todayAppointments).first();
    await expect(todaySection).toBeVisible();
    
    // Should have a title
    await expect(page.locator('text=Today')).toBeVisible();
  });

  test('should display recent activity section', async ({ page }) => {
    const recentSection = page.locator(SELECTORS.overview.recentActivity).first();
    await expect(recentSection).toBeVisible();
    
    // Should have a title
    await expect(page.locator('text=Recent')).toBeVisible();
  });

  test('should show empty state when no appointments today', async ({ page }) => {
    const todaySection = page.locator(SELECTORS.overview.todayAppointments).first();
    // Either shows appointments or empty message
    const hasAppointments = await page.locator(SELECTORS.overview.appointmentItem).count() > 0;
    const hasEmptyMessage = await page.locator('text=No appointments').count() > 0 ||
                           await page.locator('text=No data').count() > 0;
    
    expect(hasAppointments || hasEmptyMessage).toBeTruthy();
  });

  test('complete button should show toast when clicked', async ({ page }) => {
    const completeBtn = page.locator(SELECTORS.overview.completeButton).first();
    
    if (await completeBtn.count() > 0) {
      await completeBtn.click();
      
      // Should show success toast
      const toast = page.locator(SELECTORS.toast.success);
      await expect(toast).toBeVisible({ timeout: 5000 });
      await expect(toast).toContainText(/complete|completed/i);
    }
  });

  test('recent activity table should render', async ({ page }) => {
    const table = page.locator(SELECTORS.overview.recentTable).first();
    await expect(table).toBeVisible();
    
    // Table should have headers
    await expect(page.locator('th:has-text("Owner")')).toBeVisible();
    await expect(page.locator('th:has-text("Pet")')).toBeVisible();
    await expect(page.locator('th:has-text("Date")')).toBeVisible();
    await expect(page.locator('th:has-text("Status")')).toBeVisible();
  });
});

test.describe('Overview - Role specific', () => {
  test('staff should see overview as first tab', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForSelector(SELECTORS.dashboard.sidebar);
    
    // Overview should be active by default for staff
    const activeTab = page.locator(SELECTORS.nav.activeTab).first();
    await expect(activeTab).toContainText('Overview');
  });
});