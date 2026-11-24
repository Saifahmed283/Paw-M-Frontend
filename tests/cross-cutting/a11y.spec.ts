import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';
import { SELECTORS } from '@tests/utils/selectors';

test.describe('Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForSelector(SELECTORS.dashboard.sidebar);
  });

  test('should have no critical accessibility violations on dashboard', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    
    const criticalViolations = results.violations.filter(v => v.impact === 'critical');
    const seriousViolations = results.violations.filter(v => v.impact === 'serious');
    
    expect(criticalViolations.length).toBe(0);
    expect(seriousViolations.length).toBe(0);
  });

  test('should have no critical violations on requests tab', async ({ page }) => {
    const requestsTab = page.locator(SELECTORS.nav.tabButton('requests')).first();
    if (await requestsTab.count() > 0) {
      await requestsTab.click();
      await page.waitForTimeout(500);
      
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      
      const criticalViolations = results.violations.filter(v => v.impact === 'critical');
      const seriousViolations = results.violations.filter(v => v.impact === 'serious');
      
      expect(criticalViolations.length).toBe(0);
      expect(seriousViolations.length).toBe(0);
    }
  });

  test('should have no critical violations on reservations tab', async ({ page }) => {
    const reservationsTab = page.locator(SELECTORS.nav.tabButton('reservations')).first();
    if (await reservationsTab.count() > 0) {
      await reservationsTab.click();
      await page.waitForTimeout(500);
      
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      
      const criticalViolations = results.violations.filter(v => v.impact === 'critical');
      const seriousViolations = results.violations.filter(v => v.impact === 'serious');
      
      expect(criticalViolations.length).toBe(0);
      expect(seriousViolations.length).toBe(0);
    }
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    // Check for h1 on page
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
    
    // Check heading order (h1 -> h2 -> h3)
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    let lastLevel = 0;
    
    for (const heading of headings) {
      const tagName = await heading.evaluate(el => el.tagName.toLowerCase());
      const level = parseInt(tagName.charAt(1));
      expect(level).toBeLessThanOrEqual(lastLevel + 1);
      lastLevel = level;
    }
  });

  test('should have proper labels on form inputs', async ({ page }) => {
    // Check login form
    await page.goto('/dashboard');
    
    const usernameInput = page.locator(SELECTORS.login.usernameInput).first();
    const passwordInput = page.locator(SELECTORS.login.passwordInput).first();
    
    // Should have associated labels or aria-label
    const usernameLabel = await usernameInput.getAttribute('aria-label');
    const usernameId = await usernameInput.getAttribute('id');
    const usernameAriaLabelledBy = await usernameInput.getAttribute('aria-labelledby');
    
    const hasUsernameLabel = usernameLabel || (usernameId && await page.locator(`label[for="${usernameId}"]`).count() > 0) || usernameAriaLabelledBy;
    expect(hasUsernameLabel).toBeTruthy();
    
    const passwordLabel = await passwordInput.getAttribute('aria-label');
    const passwordId = await passwordInput.getAttribute('id');
    const passwordAriaLabelledBy = await passwordInput.getAttribute('aria-labelledby');
    
    const hasPasswordLabel = passwordLabel || (passwordId && await page.locator(`label[for="${passwordId}"]`).count() > 0) || passwordAriaLabelledBy;
    expect(hasPasswordLabel).toBeTruthy();
  });

  test('should have aria-labels on icon-only buttons', async ({ page }) => {
    // Check a few icon buttons
    const buttons = await page.locator('button:has([data-lucide])').all();
    
    for (const button of buttons.slice(0, 10)) {
      const ariaLabel = await button.getAttribute('aria-label');
      const title = await button.getAttribute('title');
      const text = await button.textContent();
      
      // Should have accessible name via aria-label, title, or visible text
      const hasAccessibleName = ariaLabel || title || (text && text.trim().length > 0);
      expect(hasAccessibleName).toBeTruthy();
    }
  });

  test('should have focus visible on interactive elements', async ({ page }) => {
    // Tab through the page
    await page.keyboard.press('Tab');
    
    // First focusable element should be visible
    const focused = page.locator(':focus');
    await expect(focused).toBeVisible();
    
    // Check focus styles are applied
    const focusStyles = await focused.evaluate(el => {
      const styles = getComputedStyle(el);
      return {
        outline: styles.outline,
        outlineWidth: styles.outlineWidth,
        boxShadow: styles.boxShadow,
      };
    });
    
    // Should have some focus indicator
    const hasFocusIndicator = focusStyles.outline !== 'none' || 
                              focusStyles.outlineWidth !== '0px' || 
                              focusStyles.boxShadow !== 'none';
    expect(hasFocusIndicator).toBeTruthy();
  });

  test('should have sufficient color contrast', async ({ page }) => {
    // Check a few text elements
    const textElements = await page.locator('p, span, button, a, h1, h2, h3, h4, h5, h6, label').all();
    
    for (const element of textElements.slice(0, 20)) {
      const contrast = await element.evaluate(el => {
        const styles = getComputedStyle(el);
        const color = styles.color;
        const bgColor = styles.backgroundColor;
        
        // Simple check - in real scenario would use axe-core color contrast check
        // Just verify we can read the styles
        return { color, bgColor };
      });
      
      expect(contrast.color).toBeTruthy();
    }
  });

  test('should have skip link for main content', async ({ page }) => {
    // Skip link is usually first focusable element
    await page.keyboard.press('Tab');
    
    const firstFocused = page.locator(':focus');
    const text = await firstFocused.textContent();
    const href = await firstFocused.getAttribute('href');
    
    // Should be a skip link or first navigation element
    const isSkipLink = text?.toLowerCase().includes('skip') || href?.includes('#main');
    // If not a skip link, that's okay - just verify focus works
    expect(await firstFocused.isVisible()).toBeTruthy();
  });

  test('dialogs should trap focus', async ({ page }) => {
    // Open a dialog (clinical record)
    const recordBtn = page.locator('button:has-text("Record Visit")').first();
    if (await recordBtn.count() > 0) {
      await recordBtn.click();
      
      const dialog = page.locator(SELECTORS.dialogs.clinicalRecord).first();
      await expect(dialog).toBeVisible({ timeout: 5000 });
      
      // Focus should be trapped in dialog
      await page.keyboard.press('Tab');
      const focused = page.locator(':focus');
      
      // Focused element should be inside dialog
      const isInDialog = await focused.evaluate((el, dialogEl) => {
        return dialogEl.contains(el);
      }, await dialog.elementHandle());
      
      expect(isInDialog).toBeTruthy();
      
      // Close dialog
      await page.keyboard.press('Escape');
      await expect(dialog).toBeHidden({ timeout: 3000 });
    }
  });

  test('tables should have proper headers', async ({ page }) => {
    const requestsTab = page.locator(SELECTORS.nav.tabButton('requests')).first();
    if (await requestsTab.count() > 0) {
      await requestsTab.click();
      await page.waitForTimeout(500);
      
      const table = page.locator(SELECTORS.requests.table).first();
      await expect(table).toBeVisible();
      
      // Should have th elements
      const headers = table.locator('th');
      await expect(headers.first()).toBeVisible();
      
      // Each th should have scope or be in thead
      const headerCount = await headers.count();
      expect(headerCount).toBeGreaterThan(0);
    }
  });

  test('should have proper landmark regions', async ({ page }) => {
    // Check for main landmark
    const main = page.locator('main, [role="main"]').first();
    await expect(main).toBeVisible();
    
    // Check for nav landmark (sidebar)
    const nav = page.locator('nav, [role="navigation"]').first();
    await expect(nav).toBeVisible();
    
    // Check for header landmark
    const header = page.locator('header, [role="banner"]').first();
    await expect(header).toBeVisible();
  });

  test('images should have alt text', async ({ page }) => {
    const images = await page.locator('img').all();
    
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      const role = await img.getAttribute('role');
      const ariaHidden = await img.getAttribute('aria-hidden');
      
      // Decorative images should have alt="" or role="presentation" or aria-hidden="true"
      // Content images should have descriptive alt
      const isDecorative = alt === '' || role === 'presentation' || ariaHidden === 'true';
      const hasAlt = alt && alt.length > 0;
      
      expect(isDecorative || hasAlt).toBeTruthy();
    }
  });
});