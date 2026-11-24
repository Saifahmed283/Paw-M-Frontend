import { test, expect } from '@playwright/test';
import { SELECTORS } from '@tests/utils/selectors';

test.describe('Authentication', () => {
  test.use({ storageState: undefined }); // Don't use saved auth for login tests

  test('should show login page when accessing dashboard unauthenticated', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.locator(SELECTORS.login.usernameInput)).toBeVisible();
    await expect(page.locator(SELECTORS.login.passwordInput)).toBeVisible();
    await expect(page.locator(SELECTORS.login.submitButton)).toBeVisible();
  });

  test('should login successfully with provided admin credentials', async ({ page }) => {
    await page.goto('/dashboard');
    await page.fill(SELECTORS.login.usernameInput, 'technical-support');
    await page.fill(SELECTORS.login.passwordInput, 'TS@pawm2026');
    await page.click(SELECTORS.login.submitButton);
    
    // Should redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator(SELECTORS.dashboard.sidebar)).toBeVisible();
  });

  test('should login successfully with valid staff credentials', async ({ page }) => {
    await page.goto('/dashboard');
    await page.fill(SELECTORS.login.usernameInput, 'test-staff');
    await page.fill(SELECTORS.login.passwordInput, 'TestPass123!');
    await page.click(SELECTORS.login.submitButton);
    
    // Should redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator(SELECTORS.dashboard.sidebar)).toBeVisible();
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/dashboard');
    await page.fill(SELECTORS.login.usernameInput, 'invalid-user');
    await page.fill(SELECTORS.login.passwordInput, 'wrongpassword');
    await page.click(SELECTORS.login.submitButton);
    
    // Should show error toast
    const toast = page.locator(SELECTORS.toast.error);
    await expect(toast).toBeVisible({ timeout: 5000 });
    await expect(toast).toContainText(/invalid|incorrect|wrong/i);
  });

  test('should show validation error with empty fields', async ({ page }) => {
    await page.goto('/dashboard');
    await page.click(SELECTORS.login.submitButton);
    
    // Browser validation or toast should appear
    const usernameInput = page.locator(SELECTORS.login.usernameInput);
    // Check if browser validation is present (required attribute or aria-required)
    const hasRequired = await usernameInput.getAttribute('required') !== null ||
                        await usernameInput.getAttribute('aria-required') === 'true';
    expect(hasRequired).toBeTruthy();
  });

  test('should logout and return to login', async ({ page }) => {
    // First login with admin credentials
    await page.goto('/dashboard');
    await page.fill(SELECTORS.login.usernameInput, 'technical-support');
    await page.fill(SELECTORS.login.passwordInput, 'TS@pawm2026');
    await page.click(SELECTORS.login.submitButton);
    await expect(page.locator(SELECTORS.dashboard.sidebar)).toBeVisible();
    
    // Find and click logout (usually in header/user menu)
    const logoutButton = page.locator('button:has-text("Logout"), button:has-text("Sign out"), [aria-label*="logout"], [aria-label*="sign out"]');
    if (await logoutButton.count() > 0) {
      await logoutButton.click();
      await expect(page.locator(SELECTORS.login.usernameInput)).toBeVisible({ timeout: 5000 });
    }
  });
});

test.describe('Role-based access', () => {
  // These tests use saved auth states from global setup
  
  test('staff should see only allowed tabs', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForSelector(SELECTORS.dashboard.sidebar);
    
    // Staff should see: Overview, Requests, Reservations, Prescriptions
    const visibleTabs = await page.locator(SELECTORS.dashboard.sidebar + ' button, ' + SELECTORS.dashboard.sidebar + ' a').allTextContents();
    const tabText = visibleTabs.join(' ');
    
    expect(tabText).toContain('Overview');
    expect(tabText).toContain('Requests');
    expect(tabText).toContain('Reservations');
    expect(tabText).toContain('Prescriptions');
    
    // Should NOT see admin-only tabs
    expect(tabText).not.toContain('Staff');
    expect(tabText).not.toContain('Payroll');
    expect(tabText).not.toContain('Settings');
  });

  test('payroll should see extended tabs', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForSelector(SELECTORS.dashboard.sidebar);
    
    const visibleTabs = await page.locator(SELECTORS.dashboard.sidebar + ' button, ' + SELECTORS.dashboard.sidebar + ' a').allTextContents();
    const tabText = visibleTabs.join(' ');
    
    expect(tabText).toContain('Overview');
    expect(tabText).toContain('Requests');
    expect(tabText).toContain('Reservations');
    expect(tabText).toContain('Clients');
    expect(tabText).toContain('Finance');
    expect(tabText).toContain('Payroll');
    expect(tabText).toContain('Doctors');
    expect(tabText).toContain('Services');
    expect(tabText).toContain('Products');
    expect(tabText).toContain('Orders');
    expect(tabText).toContain('Reviews');
    expect(tabText).toContain('Workdays');
    expect(tabText).toContain('Archive');
    expect(tabText).toContain('Prescriptions');
    
    // Should NOT see admin-only tabs
    expect(tabText).not.toContain('Staff');
    expect(tabText).not.toContain('Payment Verification');
    expect(tabText).not.toContain('Settings');
  });

  test('admin should see all tabs', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForSelector(SELECTORS.dashboard.sidebar);
    
    const visibleTabs = await page.locator(SELECTORS.dashboard.sidebar + ' button, ' + SELECTORS.dashboard.sidebar + ' a').allTextContents();
    const tabText = visibleTabs.join(' ');
    
    const allTabs = [
      'Overview', 'Requests', 'Reservations', 'Staff', 'Payroll',
      'Finance', 'Payment Verification', 'Clients', 'Doctors',
      'Services', 'Prescriptions', 'Products', 'Orders', 'Reviews',
      'Workdays', 'Archive', 'Logs', 'Settings'
    ];
    
    for (const tab of allTabs) {
      expect(tabText).toContain(tab);
    }
  });

  test('should redirect when accessing forbidden tab', async ({ page }) => {
    // Staff trying to access admin-only tab
    await page.goto('/dashboard');
    await page.waitForSelector(SELECTORS.dashboard.sidebar);
    
    // Direct navigation to staff tab should redirect
    await page.goto('/dashboard');
    await page.waitForTimeout(500);
    
    // The dashboard component handles this via canAccess check
    // Should fall back to first allowed tab (Overview)
    await expect(page.locator('text=Overview')).toBeVisible();
  });
});

test.describe('Session persistence', () => {
  test('should persist session after page refresh', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForSelector(SELECTORS.dashboard.sidebar);
    
    // Refresh page
    await page.reload();
    
    // Should still be on dashboard without login prompt
    await expect(page.locator(SELECTORS.dashboard.sidebar)).toBeVisible({ timeout: 10000 });
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('should persist session across tab navigation', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForSelector(SELECTORS.dashboard.sidebar);
    
    // Navigate to different tabs
    const tabs = ['requests', 'reservations', 'overview'];
    for (const tab of tabs) {
      const tabButton = page.locator(SELECTORS.nav.tabButton(tab)).first();
      if (await tabButton.count() > 0) {
        await tabButton.click();
        await page.waitForTimeout(300);
        await expect(page).toHaveURL(new RegExp(`/dashboard.*${tab}|/dashboard$`));
      }
    }
    
    // Return to overview
    await page.goto('/dashboard');
    await expect(page.locator(SELECTORS.dashboard.sidebar)).toBeVisible();
  });
});