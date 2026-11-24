import { test, expect } from '@playwright/test';
import { SELECTORS } from '@tests/utils/selectors';

test.describe('Shift Banner', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForSelector(SELECTORS.dashboard.sidebar);
  });

  test('should display shift banner on dashboard', async ({ page }) => {
    const banner = page.locator(SELECTORS.shiftBanner.container).first();
    await expect(banner).toBeVisible();
  });

  test('should show Check In button when no active session', async ({ page }) => {
    const checkInBtn = page.locator(SELECTORS.shiftBanner.checkInButton).first();
    await expect(checkInBtn).toBeVisible();
    
    const checkOutBtn = page.locator(SELECTORS.shiftBanner.checkOutButton).first();
    await expect(checkOutBtn).toBeHidden();
  });

  test('Check In button should be clickable', async ({ page }) => {
    const checkInBtn = page.locator(SELECTORS.shiftBanner.checkInButton).first();
    await expect(checkInBtn).toBeEnabled();
  });

  test('clicking Check In should show success toast and switch to Check Out', async ({ page }) => {
    const checkInBtn = page.locator(SELECTORS.shiftBanner.checkInButton).first();
    
    if (await checkInBtn.isEnabled()) {
      await checkInBtn.click();
      
      // Should show success toast
      const toast = page.locator(SELECTORS.toast.success);
      await expect(toast).toBeVisible({ timeout: 10000 });
      await expect(toast).toContainText(/check.?in|started/i);
      
      // Should now show Check Out button
      const checkOutBtn = page.locator(SELECTORS.shiftBanner.checkOutButton).first();
      await expect(checkOutBtn).toBeVisible({ timeout: 5000 });
    }
  });

  test('clicking Check Out should show success toast and switch to Check In', async ({ page }) => {
    // First check in if not already
    const checkInBtn = page.locator(SELECTORS.shiftBanner.checkInButton).first();
    const checkOutBtn = page.locator(SELECTORS.shiftBanner.checkOutButton).first();
    
    if (await checkInBtn.isVisible() && await checkInBtn.isEnabled()) {
      await checkInBtn.click();
      await page.waitForTimeout(1000);
    }
    
    // Now click check out
    if (await checkOutBtn.isVisible() && await checkOutBtn.isEnabled()) {
      await checkOutBtn.click();
      
      // Should show success toast
      const toast = page.locator(SELECTORS.toast.success);
      await expect(toast).toBeVisible({ timeout: 10000 });
      await expect(toast).toContainText(/check.?out|ended/i);
      
      // Should now show Check In button again
      await expect(checkInBtn).toBeVisible({ timeout: 5000 });
    }
  });

  test('should display status orb indicating shift state', async ({ page }) => {
    const statusOrb = page.locator(SELECTORS.shiftBanner.statusOrb).first();
    await expect(statusOrb).toBeVisible();
    
    // Should have a color indicator (green for active, gray for inactive)
    const orbElement = statusOrb.locator('[class*="bg-"], [class*="text-"]');
    await expect(orbElement.first()).toBeVisible();
  });

  test('should display session time when checked in', async ({ page }) => {
    const checkInBtn = page.locator(SELECTORS.shiftBanner.checkInButton).first();
    const checkOutBtn = page.locator(SELECTORS.shiftBanner.checkOutButton).first();
    
    if (await checkInBtn.isVisible() && await checkInBtn.isEnabled()) {
      await checkInBtn.click();
      await page.waitForTimeout(1000);
    }
    
    if (await checkOutBtn.isVisible()) {
      const sessionTime = page.locator(SELECTORS.shiftBanner.sessionTime).first();
      await expect(sessionTime).toBeVisible({ timeout: 5000 });
      
      // Should show time format (e.g., "2h 30m" or similar)
      const timeText = await sessionTime.textContent();
      expect(timeText).toMatch(/\d/);
    }
  });

  test('status orb should change color based on shift state', async ({ page }) => {
    const statusOrb = page.locator(SELECTORS.shiftBanner.statusOrb).first();
    const checkInBtn = page.locator(SELECTORS.shiftBanner.checkInButton).first();
    const checkOutBtn = page.locator(SELECTORS.shiftBanner.checkOutButton).first();
    
    // Initial state (checked out) - should be gray/idle
    const initialClass = await statusOrb.getAttribute('class');
    
    if (await checkInBtn.isVisible() && await checkInBtn.isEnabled()) {
      await checkInBtn.click();
      await page.waitForTimeout(1000);
      
      // Checked in - should be green/active
      const checkedInClass = await statusOrb.getAttribute('class');
      expect(checkedInClass).not.toBe(initialClass);
    }
  });

  test('should persist shift state across page refresh', async ({ page }) => {
    const checkInBtn = page.locator(SELECTORS.shiftBanner.checkInButton).first();
    const checkOutBtn = page.locator(SELECTORS.shiftBanner.checkOutButton).first();
    
    // Check in if not already
    if (await checkInBtn.isVisible() && await checkInBtn.isEnabled()) {
      await checkInBtn.click();
      await page.waitForTimeout(1000);
    }
    
    // Refresh page
    await page.reload();
    await page.waitForSelector(SELECTORS.dashboard.sidebar);
    
    // Should still show Check Out (shift still active)
    await expect(checkOutBtn).toBeVisible({ timeout: 10000 });
  });

  test('should be visible on all dashboard tabs', async ({ page }) => {
    const tabs = ['overview', 'requests', 'reservations'];
    
    for (const tab of tabs) {
      const tabButton = page.locator(SELECTORS.nav.tabButton(tab)).first();
      if (await tabButton.count() > 0) {
        await tabButton.click();
        await page.waitForTimeout(300);
        
        const banner = page.locator(SELECTORS.shiftBanner.container).first();
        await expect(banner).toBeVisible();
      }
    }
  });
});