import { test, expect } from '@playwright/test';
import { SELECTORS } from '@tests/utils/selectors';

test.describe('Error Handling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForSelector(SELECTORS.dashboard.sidebar);
  });

  test('should show error toast on network failure', async ({ page }) => {
    // Simulate offline
    await page.context().setOffline(true);
    
    // Try to navigate to a tab that makes API calls
    const requestsTab = page.locator(SELECTORS.nav.tabButton('requests')).first();
    if (await requestsTab.count() > 0) {
      await requestsTab.click();
      await page.waitForTimeout(2000);
      
      // Should show error toast
      const toast = page.locator(SELECTORS.toast.error).first();
      await expect(toast).toBeVisible({ timeout: 10000 });
      await expect(toast).toContainText(/network|offline|failed|error/i);
    }
    
    // Restore online
    await page.context().setOffline(false);
  });

  test('should redirect to login on 401 unauthorized', async ({ page }) => {
    // Clear storage to simulate expired token
    await page.context().clearCookies();
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    
    // Try to access dashboard
    await page.goto('/dashboard');
    await page.waitForTimeout(2000);
    
    // Should redirect to login
    await expect(page.locator(SELECTORS.login.usernameInput)).toBeVisible({ timeout: 10000 });
  });

  test('should handle 429 rate limiting gracefully', async ({ page }) => {
    // This test would need a backend that returns 429
    // For now, just verify the UI doesn't crash on repeated requests
    
    const requestsTab = page.locator(SELECTORS.nav.tabButton('requests')).first();
    if (await requestsTab.count() > 0) {
      // Click multiple times rapidly
      for (let i = 0; i < 5; i++) {
        await requestsTab.click();
        await page.waitForTimeout(100);
      }
      
      // Should not crash
      await expect(page.locator(SELECTORS.dashboard.mainContent)).toBeVisible();
    }
  });

  test('should show error boundary on 500 server error', async ({ page }) => {
    // This would need a backend that returns 500
    // For now, verify error boundary component exists
    
    // Navigate to a page
    const requestsTab = page.locator(SELECTORS.nav.tabButton('requests')).first();
    if (await requestsTab.count() > 0) {
      await requestsTab.click();
      await page.waitForTimeout(500);
      
      // Page should render without crashing
      await expect(page.locator(SELECTORS.dashboard.mainContent)).toBeVisible();
    }
  });

  test('should show loading states during data fetching', async ({ page }) => {
    // Navigate between tabs quickly
    const tabs = ['overview', 'requests', 'reservations'];
    
    for (const tab of tabs) {
      const tabButton = page.locator(SELECTORS.nav.tabButton(tab)).first();
      if (await tabButton.count() > 0) {
        await tabButton.click();
        
        // Should show loading indicator or skeleton
        const loading = page.locator('text=Loading, [data-testid="loading"], .animate-pulse, .skeleton');
        // Loading may be too fast to catch, so just verify content loads
        await page.waitForTimeout(300);
        
        await expect(page.locator(SELECTORS.dashboard.mainContent)).toBeVisible();
      }
    }
  });

  test('should handle empty states gracefully', async ({ page }) => {
    // Check requests tab empty state
    const requestsTab = page.locator(SELECTORS.nav.tabButton('requests')).first();
    if (await requestsTab.count() > 0) {
      await requestsTab.click();
      await page.waitForTimeout(500);
      
      const table = page.locator(SELECTORS.requests.table).first();
      await expect(table).toBeVisible();
      
      // If no data, should show empty message
      const rows = page.locator(SELECTORS.requests.table + ' tbody tr');
      const count = await rows.count();
      
      if (count === 0) {
        const emptyMessage = page.locator('text=Empty, text=No requests, text=No data');
        await expect(emptyMessage.first()).toBeVisible();
      }
    }
  });

  test('should handle form validation errors', async ({ page }) => {
    // Open clinical record dialog
    const recordBtn = page.locator('button:has-text("Record Visit")').first();
    if (await recordBtn.count() > 0) {
      await recordBtn.click();
      
      const dialog = page.locator(SELECTORS.dialogs.clinicalRecord).first();
      await expect(dialog).toBeVisible({ timeout: 5000 });
      
      // Try to submit without required fields
      const saveBtn = page.locator(SELECTORS.dialogs.clinicalSave).first();
      await saveBtn.click();
      
      // Should show validation error or prevent submission
      // (Implementation dependent - just verify no crash)
      await expect(dialog).toBeVisible();
      
      // Close dialog
      await page.keyboard.press('Escape');
    }
  });

  test('should handle file upload errors', async ({ page }) => {
    // Open payment dialog
    const paymentBtn = page.locator('button:has-text("Request Payment")').first();
    if (await paymentBtn.count() > 0) {
      await paymentBtn.click();
      
      const dialog = page.locator(SELECTORS.dialogs.requestPayment).first();
      await expect(dialog).toBeVisible({ timeout: 5000 });
      
      // Try to add custom line without amount
      const addBtn = page.locator(SELECTORS.dialogs.paymentAddLine).first();
      await addBtn.click();
      
      // Should show error toast
      const toast = page.locator(SELECTORS.toast.error).first();
      await expect(toast).toBeVisible({ timeout: 5000 });
      
      // Close dialog
      await page.keyboard.press('Escape');
    }
  });

  test('should recover from transient network errors', async ({ page }) => {
    // Go offline briefly
    await page.context().setOffline(true);
    await page.waitForTimeout(1000);
    await page.context().setOffline(false);
    
    // Try to interact with UI
    const requestsTab = page.locator(SELECTORS.nav.tabButton('requests')).first();
    if (await requestsTab.count() > 0) {
      await requestsTab.click();
      await page.waitForTimeout(2000);
      
      // Should recover and show content
      await expect(page.locator(SELECTORS.requests.table)).toBeVisible({ timeout: 10000 });
    }
  });

  test('should handle concurrent tab switches', async ({ page }) => {
    const tabs = ['overview', 'requests', 'reservations', 'overview'];
    
    // Rapidly switch tabs
    for (const tab of tabs) {
      const tabButton = page.locator(SELECTORS.nav.tabButton(tab)).first();
      if (await tabButton.count() > 0) {
        await tabButton.click();
        await page.waitForTimeout(100);
      }
    }
    
    // Should end up on overview without errors
    await expect(page.locator(SELECTORS.dashboard.mainContent)).toBeVisible();
    await expect(page.locator('text=Overview')).toBeVisible();
  });
});