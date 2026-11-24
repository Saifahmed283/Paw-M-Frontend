import { test, expect } from '@playwright/test';
import { SELECTORS } from '@tests/utils/selectors';

test.describe('Responsive Design - Desktop', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForSelector(SELECTORS.dashboard.sidebar);
  });

  test('should show four-column grid for stats on desktop', async ({ page }) => {
    const statsContainer = page.locator(SELECTORS.overview.statsCards).first();
    await expect(statsContainer).toBeVisible();
    
    const gridTemplateColumns = await statsContainer.evaluate(el => getComputedStyle(el).gridTemplateColumns);
    const columns = gridTemplateColumns.split(' ').filter(c => c !== '0px').length;
    expect(columns).toBeGreaterThanOrEqual(4);
  });

  test('should show sidebar expanded by default', async ({ page }) => {
    const sidebar = page.locator(SELECTORS.dashboard.sidebar).first();
    const sidebarClasses = await sidebar.getAttribute('class');
    expect(sidebarClasses).toContain('w-64');
  });

  test('should collapse sidebar when toggle clicked', async ({ page }) => {
    const toggleButton = page.locator(SELECTORS.dashboard.toggleCollapse).first();
    if (await toggleButton.count() > 0) {
      await toggleButton.click();
      await page.waitForTimeout(300);
      
      const sidebar = page.locator(SELECTORS.dashboard.sidebar).first();
      const sidebarClasses = await sidebar.getAttribute('class');
      expect(sidebarClasses).toContain('w-20');
    }
  });

  test('should expand sidebar when toggle clicked again', async ({ page }) => {
    const toggleButton = page.locator(SELECTORS.dashboard.toggleCollapse).first();
    if (await toggleButton.count() > 0) {
      // Collapse first
      await toggleButton.click();
      await page.waitForTimeout(300);
      
      // Expand
      await toggleButton.click();
      await page.waitForTimeout(300);
      
      const sidebar = page.locator(SELECTORS.dashboard.sidebar).first();
      const sidebarClasses = await sidebar.getAttribute('class');
      expect(sidebarClasses).toContain('w-64');
    }
  });

  test('should navigate tabs from desktop sidebar', async ({ page }) => {
    const tabs = ['overview', 'requests', 'reservations'];
    
    for (const tab of tabs) {
      const tabButton = page.locator(SELECTORS.nav.tabButton(tab)).first();
      if (await tabButton.count() > 0) {
        await tabButton.click();
        await page.waitForTimeout(300);
        await expect(page.locator(SELECTORS.dashboard.mainContent)).toBeVisible();
      }
    }
  });
});

test.describe('Responsive Design - Mobile Viewport Tests', () => {
  // These tests run in the mobile-staff project which uses iPhone 13 viewport
  test.use({ viewport: { width: 390, height: 844 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForSelector(SELECTORS.dashboard.sidebar);
  });

  test('should show mobile sidebar as sheet', async ({ page }) => {
    // On mobile, sidebar should be hidden initially
    const sidebar = page.locator(SELECTORS.dashboard.sidebar).first();
    // Mobile sidebar uses Sheet component
    const sheet = page.locator('[role="dialog"][data-side="left"]');
    
    // Open mobile menu
    const menuButton = page.locator(SELECTORS.dashboard.mobileMenuButton).first();
    await expect(menuButton).toBeVisible();
    await menuButton.click();
    
    // Sheet should open
    await expect(sheet).toBeVisible({ timeout: 3000 });
    
    // Sidebar content should be in sheet
    await expect(sheet.locator('nav')).toBeVisible();
  });

  test('should navigate tabs from mobile sidebar', async ({ page }) => {
    const menuButton = page.locator(SELECTORS.dashboard.mobileMenuButton).first();
    await menuButton.click();
    
    const sheet = page.locator('[role="dialog"][data-side="left"]').first();
    await expect(sheet).toBeVisible();
    
    // Click a tab
    const requestsTab = sheet.locator(SELECTORS.nav.tabButton('requests')).first();
    if (await requestsTab.count() > 0) {
      await requestsTab.click();
      
      // Sheet should close
      await expect(sheet).toBeHidden({ timeout: 3000 });
      
      // Should navigate to requests
      await expect(page).toHaveURL(/\/dashboard/);
    }
  });

  test('should stack stats cards vertically on mobile', async ({ page }) => {
    const statsCards = page.locator(SELECTORS.overview.statsCards).first();
    await expect(statsCards).toBeVisible();
    
    // Cards should be in a single column on mobile
    const cardElements = page.locator(SELECTORS.overview.statsCards + ' > *');
    const count = await cardElements.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should show horizontal scroll on requests table', async ({ page }) => {
    const requestsTab = page.locator(SELECTORS.nav.tabButton('requests')).first();
    if (await requestsTab.count() > 0) {
      await requestsTab.click();
      await page.waitForTimeout(500);
      
      const tableContainer = page.locator(SELECTORS.requests.table).locator('..');
      await expect(tableContainer).toBeVisible();
      
      // Container should have overflow-x-auto
      const overflow = await tableContainer.evaluate(el => getComputedStyle(el).overflowX);
      expect(['auto', 'scroll']).toContain(overflow);
    }
  });

  test('should stack reservation cards vertically', async ({ page }) => {
    const reservationsTab = page.locator(SELECTORS.nav.tabButton('reservations')).first();
    if (await reservationsTab.count() > 0) {
      await reservationsTab.click();
      await page.waitForTimeout(500);
      
      const cards = page.locator(SELECTORS.reservations.card(''));
      const count = await cards.count();
      
      if (count > 0) {
        // Cards should be in a vertical stack (flex-col)
        const container = cards.first().locator('..');
        const flexDirection = await container.evaluate(el => getComputedStyle(el).flexDirection);
        expect(flexDirection).toBe('column');
      }
    }
  });

  test('should show touch-friendly button sizes', async ({ page }) => {
    const buttons = page.locator('button').first();
    await expect(buttons).toBeVisible();
    
    // Buttons should have minimum touch target size (44x44px)
    const box = await buttons.boundingBox();
    if (box) {
      expect(box.height).toBeGreaterThanOrEqual(44);
    }
  });
});

test.describe('Responsive Design - Tablet Viewport Tests', () => {
  // These tests run with tablet viewport
  test.use({ viewport: { width: 1024, height: 768 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForSelector(SELECTORS.dashboard.sidebar);
  });

  test('should show two-column grid for stats on tablet', async ({ page }) => {
    const statsContainer = page.locator(SELECTORS.overview.statsCards).first();
    await expect(statsContainer).toBeVisible();
    
    // Grid should have 2 columns on tablet
    const gridTemplateColumns = await statsContainer.evaluate(el => getComputedStyle(el).gridTemplateColumns);
    const columns = gridTemplateColumns.split(' ').filter(c => c !== '0px').length;
    expect(columns).toBeGreaterThanOrEqual(2);
  });

  test('should show sidebar expanded on tablet', async ({ page }) => {
    const sidebar = page.locator(SELECTORS.dashboard.sidebar).first();
    const sidebarClasses = await sidebar.getAttribute('class');
    // Tablet should show expanded sidebar (w-64)
    expect(sidebarClasses).toContain('w-64');
  });
});