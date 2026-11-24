import { test, expect } from '@playwright/test';
import { SELECTORS } from '@tests/utils/selectors';

test.describe('Requests Tab', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForSelector(SELECTORS.dashboard.sidebar);
    
    // Navigate to requests tab
    const requestsTab = page.locator(SELECTORS.nav.tabButton('requests')).first();
    if (await requestsTab.count() > 0) {
      await requestsTab.click();
      await page.waitForTimeout(500);
    }
  });

  test('should display search input', async ({ page }) => {
    const searchInput = page.locator(SELECTORS.requests.searchInput).first();
    await expect(searchInput).toBeVisible();
  });

  test('should display status filter tabs', async ({ page }) => {
    const statusFilter = page.locator(SELECTORS.requests.statusFilter).first();
    await expect(statusFilter).toBeVisible();
    
    // Check for status options
    const statuses = ['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'];
    for (const status of statuses) {
      const option = page.locator(SELECTORS.requests.statusOption(status.toLowerCase())).first();
      await expect(option).toBeVisible({ timeout: 3000 });
    }
  });

  test('should display requests table', async ({ page }) => {
    const table = page.locator(SELECTORS.requests.table).first();
    await expect(table).toBeVisible();
    
    // Check headers
    await expect(page.locator('th:has-text("Owner")')).toBeVisible();
    await expect(page.locator('th:has-text("Pet")')).toBeVisible();
    await expect(page.locator('th:has-text("Doctor")')).toBeVisible();
    await expect(page.locator('th:has-text("Date")')).toBeVisible();
    await expect(page.locator('th:has-text("Time")')).toBeVisible();
    await expect(page.locator('th:has-text("Status")')).toBeVisible();
    await expect(page.locator('th:has-text("Actions")')).toBeVisible();
  });

  test('should filter by search query', async ({ page }) => {
    const searchInput = page.locator(SELECTORS.requests.searchInput).first();
    
    // Type in search
    await searchInput.fill('Test');
    await page.waitForTimeout(500);
    
    // Table should update (either show filtered results or empty state)
    const rows = page.locator(SELECTORS.requests.table + ' tbody tr');
    // Either filtered results or empty state
    await expect(rows.first()).toBeVisible({ timeout: 5000 });
  });

  test('should filter by status', async ({ page }) => {
    // Click Pending filter
    const pendingFilter = page.locator(SELECTORS.requests.statusOption('pending')).first();
    if (await pendingFilter.count() > 0) {
      await pendingFilter.click();
      await page.waitForTimeout(500);
      
      // All visible rows should have pending status
      const statusBadges = page.locator(SELECTORS.requests.statusBadge(''));
      const count = await statusBadges.count();
      
      for (let i = 0; i < count; i++) {
        const badge = statusBadges.nth(i);
        await expect(badge).toContainText(/pending/i);
      }
    }
  });

  test('should show pagination controls', async ({ page }) => {
    const pagination = page.locator(SELECTORS.requests.pagination).first();
    await expect(pagination).toBeVisible();
    
    // Should have page info
    const pageInfo = page.locator(SELECTORS.requests.pageInfo).first();
    await expect(pageInfo).toBeVisible();
  });

  test('pending request should show Confirm and Cancel buttons', async ({ page }) => {
    // Find a pending row
    const rows = page.locator(SELECTORS.requests.table + ' tbody tr');
    const count = await rows.count();
    
    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);
      const statusBadge = row.locator(SELECTORS.requests.statusBadge(''));
      
      if (await statusBadge.count() > 0) {
        const statusText = await statusBadge.textContent();
        if (statusText?.toLowerCase().includes('pending')) {
          // Should have Confirm button
          const confirmBtn = row.locator('button:has-text("Confirm")');
          await expect(confirmBtn).toBeVisible();
          
          // Should have Cancel button
          const cancelBtn = row.locator('button:has-text("Cancel")');
          await expect(cancelBtn).toBeVisible();
          
          // Should have Delete button
          const deleteBtn = row.locator('button[aria-label*="Delete"], button:has([data-lucide="trash"])');
          await expect(deleteBtn).toBeVisible();
          
          break;
        }
      }
    }
  });

  test('confirmed request should show Cancel button', async ({ page }) => {
    const rows = page.locator(SELECTORS.requests.table + ' tbody tr');
    const count = await rows.count();
    
    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);
      const statusBadge = row.locator(SELECTORS.requests.statusBadge(''));
      
      if (await statusBadge.count() > 0) {
        const statusText = await statusBadge.textContent();
        if (statusText?.toLowerCase().includes('confirmed')) {
          // Should NOT have Confirm button
          const confirmBtn = row.locator('button:has-text("Confirm")');
          await expect(confirmBtn).toHaveCount(0);
          
          // Should have Cancel button
          const cancelBtn = row.locator('button:has-text("Cancel")');
          await expect(cancelBtn).toBeVisible();
          
          break;
        }
      }
    }
  });

  test('completed request should show Archive and Delete buttons', async ({ page }) => {
    const rows = page.locator(SELECTORS.requests.table + ' tbody tr');
    const count = await rows.count();
    
    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);
      const statusBadge = row.locator(SELECTORS.requests.statusBadge(''));
      
      if (await statusBadge.count() > 0) {
        const statusText = await statusBadge.textContent();
        if (statusText?.toLowerCase().includes('completed')) {
          // Should have Archive button
          const archiveBtn = row.locator('button[aria-label*="Archive"], button:has([data-lucide="archive"])');
          await expect(archiveBtn).toBeVisible();
          
          // Should have Delete button
          const deleteBtn = row.locator('button[aria-label*="Delete"], button:has([data-lucide="trash"])');
          await expect(deleteBtn).toBeVisible();
          
          break;
        }
      }
    }
  });

  test('clicking Confirm should show success toast', async ({ page }) => {
    const rows = page.locator(SELECTORS.requests.table + ' tbody tr');
    const count = await rows.count();
    
    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);
      const statusBadge = row.locator(SELECTORS.requests.statusBadge(''));
      
      if (await statusBadge.count() > 0) {
        const statusText = await statusBadge.textContent();
        if (statusText?.toLowerCase().includes('pending')) {
          const confirmBtn = row.locator('button:has-text("Confirm")');
          await confirmBtn.click();
          
          // Should show success toast
          const toast = page.locator(SELECTORS.toast.success);
          await expect(toast).toBeVisible({ timeout: 5000 });
          await expect(toast).toContainText(/confirm/i);
          
          break;
        }
      }
    }
  });

  test('clicking Cancel should show success toast', async ({ page }) => {
    const rows = page.locator(SELECTORS.requests.table + ' tbody tr');
    const count = await rows.count();
    
    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);
      const statusBadge = row.locator(SELECTORS.requests.statusBadge(''));
      
      if (await statusBadge.count() > 0) {
        const statusText = await statusBadge.textContent();
        if (statusText?.toLowerCase().includes('pending') || statusText?.toLowerCase().includes('confirmed')) {
          const cancelBtn = row.locator('button:has-text("Cancel")');
          await cancelBtn.click();
          
          // Should show success toast
          const toast = page.locator(SELECTORS.toast.success);
          await expect(toast).toBeVisible({ timeout: 5000 });
          await expect(toast).toContainText(/cancel/i);
          
          break;
        }
      }
    }
  });

  test('clicking Archive should show success toast', async ({ page }) => {
    const rows = page.locator(SELECTORS.requests.table + ' tbody tr');
    const count = await rows.count();
    
    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);
      const statusBadge = row.locator(SELECTORS.requests.statusBadge(''));
      
      if (await statusBadge.count() > 0) {
        const statusText = await statusBadge.textContent();
        if (statusText?.toLowerCase().includes('completed') || statusText?.toLowerCase().includes('cancelled')) {
          const archiveBtn = row.locator('button[aria-label*="Archive"], button:has([data-lucide="archive"])');
          await archiveBtn.click();
          
          // Should show success toast
          const toast = page.locator(SELECTORS.toast.success);
          await expect(toast).toBeVisible({ timeout: 5000 });
          await expect(toast).toContainText(/archiv/i);
          
          break;
        }
      }
    }
  });

  test('clicking Delete should show success toast', async ({ page }) => {
    const rows = page.locator(SELECTORS.requests.table + ' tbody tr');
    const count = await rows.count();
    
    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);
      const deleteBtn = row.locator('button[aria-label*="Delete"], button:has([data-lucide="trash"])');
      
      if (await deleteBtn.count() > 0) {
        await deleteBtn.click();
        
        // Should show success toast
        const toast = page.locator(SELECTORS.toast.success);
        await expect(toast).toBeVisible({ timeout: 5000 });
        await expect(toast).toContainText(/delet/i);
        
        break;
      }
    }
  });
});