# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cross-cutting\a11y.spec.ts >> Accessibility >> should have proper heading hierarchy
- Location: tests\cross-cutting\a11y.spec.ts:59:3

# Error details

```
TimeoutError: page.waitForSelector: Timeout 10000ms exceeded.
Call log:
  - waiting for locator('[data-testid="dashboard-sidebar"], aside.bg-\\[var\\(--navy-900\\)\\]') to be visible

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - main [ref=e2]:
    - generic [ref=e3]:
      - complementary [ref=e4]:
        - generic [ref=e5]:
          - img "Paw-M" [ref=e7]
          - paragraph [ref=e8]: Staff portal
          - heading "Care behind every credential." [level=2] [ref=e9]
          - paragraph [ref=e11]: A considered workspace for the people who make it happen.
        - generic [ref=e12]:
          - generic [ref=e13]: Secure access
          - generic [ref=e17]: Clear records
          - generic [ref=e24]: Care first
      - generic [ref=e29]:
        - button "Back to site" [ref=e30] [cursor=pointer]
        - heading "Staff sign-in" [level=1] [ref=e32]
        - paragraph [ref=e33]: Restricted area. Sign in with your staff credentials to continue.
        - generic [ref=e34]:
          - generic [ref=e35]:
            - generic [ref=e36]: Username
            - textbox "e.g. admin" [active] [ref=e38]
          - generic [ref=e39]:
            - generic [ref=e40]: Password
            - generic [ref=e41]:
              - textbox "••••••••" [ref=e42]
              - button "Show password" [ref=e43]
        - button "Sign in" [ref=e48] [cursor=pointer]
        - paragraph [ref=e49]: Can't sign in? Contact your administrator.
  - region "Notifications alt+T"
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | import { AxeBuilder } from '@axe-core/playwright';
  3   | import { SELECTORS } from '@tests/utils/selectors';
  4   | 
  5   | test.describe('Accessibility', () => {
  6   |   test.beforeEach(async ({ page }) => {
  7   |     await page.goto('/dashboard');
> 8   |     await page.waitForSelector(SELECTORS.dashboard.sidebar);
      |                ^ TimeoutError: page.waitForSelector: Timeout 10000ms exceeded.
  9   |   });
  10  | 
  11  |   test('should have no critical accessibility violations on dashboard', async ({ page }) => {
  12  |     const results = await new AxeBuilder({ page })
  13  |       .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
  14  |       .analyze();
  15  |     
  16  |     const criticalViolations = results.violations.filter(v => v.impact === 'critical');
  17  |     const seriousViolations = results.violations.filter(v => v.impact === 'serious');
  18  |     
  19  |     expect(criticalViolations.length).toBe(0);
  20  |     expect(seriousViolations.length).toBe(0);
  21  |   });
  22  | 
  23  |   test('should have no critical violations on requests tab', async ({ page }) => {
  24  |     const requestsTab = page.locator(SELECTORS.nav.tabButton('requests')).first();
  25  |     if (await requestsTab.count() > 0) {
  26  |       await requestsTab.click();
  27  |       await page.waitForTimeout(500);
  28  |       
  29  |       const results = await new AxeBuilder({ page })
  30  |         .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
  31  |         .analyze();
  32  |       
  33  |       const criticalViolations = results.violations.filter(v => v.impact === 'critical');
  34  |       const seriousViolations = results.violations.filter(v => v.impact === 'serious');
  35  |       
  36  |       expect(criticalViolations.length).toBe(0);
  37  |       expect(seriousViolations.length).toBe(0);
  38  |     }
  39  |   });
  40  | 
  41  |   test('should have no critical violations on reservations tab', async ({ page }) => {
  42  |     const reservationsTab = page.locator(SELECTORS.nav.tabButton('reservations')).first();
  43  |     if (await reservationsTab.count() > 0) {
  44  |       await reservationsTab.click();
  45  |       await page.waitForTimeout(500);
  46  |       
  47  |       const results = await new AxeBuilder({ page })
  48  |         .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
  49  |         .analyze();
  50  |       
  51  |       const criticalViolations = results.violations.filter(v => v.impact === 'critical');
  52  |       const seriousViolations = results.violations.filter(v => v.impact === 'serious');
  53  |       
  54  |       expect(criticalViolations.length).toBe(0);
  55  |       expect(seriousViolations.length).toBe(0);
  56  |     }
  57  |   });
  58  | 
  59  |   test('should have proper heading hierarchy', async ({ page }) => {
  60  |     // Check for h1 on page
  61  |     const h1 = page.locator('h1').first();
  62  |     await expect(h1).toBeVisible();
  63  |     
  64  |     // Check heading order (h1 -> h2 -> h3)
  65  |     const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
  66  |     let lastLevel = 0;
  67  |     
  68  |     for (const heading of headings) {
  69  |       const tagName = await heading.evaluate(el => el.tagName.toLowerCase());
  70  |       const level = parseInt(tagName.charAt(1));
  71  |       expect(level).toBeLessThanOrEqual(lastLevel + 1);
  72  |       lastLevel = level;
  73  |     }
  74  |   });
  75  | 
  76  |   test('should have proper labels on form inputs', async ({ page }) => {
  77  |     // Check login form
  78  |     await page.goto('/dashboard');
  79  |     
  80  |     const usernameInput = page.locator(SELECTORS.login.usernameInput).first();
  81  |     const passwordInput = page.locator(SELECTORS.login.passwordInput).first();
  82  |     
  83  |     // Should have associated labels or aria-label
  84  |     const usernameLabel = await usernameInput.getAttribute('aria-label');
  85  |     const usernameId = await usernameInput.getAttribute('id');
  86  |     const usernameAriaLabelledBy = await usernameInput.getAttribute('aria-labelledby');
  87  |     
  88  |     const hasUsernameLabel = usernameLabel || (usernameId && await page.locator(`label[for="${usernameId}"]`).count() > 0) || usernameAriaLabelledBy;
  89  |     expect(hasUsernameLabel).toBeTruthy();
  90  |     
  91  |     const passwordLabel = await passwordInput.getAttribute('aria-label');
  92  |     const passwordId = await passwordInput.getAttribute('id');
  93  |     const passwordAriaLabelledBy = await passwordInput.getAttribute('aria-labelledby');
  94  |     
  95  |     const hasPasswordLabel = passwordLabel || (passwordId && await page.locator(`label[for="${passwordId}"]`).count() > 0) || passwordAriaLabelledBy;
  96  |     expect(hasPasswordLabel).toBeTruthy();
  97  |   });
  98  | 
  99  |   test('should have aria-labels on icon-only buttons', async ({ page }) => {
  100 |     // Check a few icon buttons
  101 |     const buttons = await page.locator('button:has([data-lucide])').all();
  102 |     
  103 |     for (const button of buttons.slice(0, 10)) {
  104 |       const ariaLabel = await button.getAttribute('aria-label');
  105 |       const title = await button.getAttribute('title');
  106 |       const text = await button.textContent();
  107 |       
  108 |       // Should have accessible name via aria-label, title, or visible text
```