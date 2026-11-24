# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cross-cutting\error-handling.spec.ts >> Error Handling >> should show error boundary on 500 server error
- Location: tests\cross-cutting\error-handling.spec.ts:63:3

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
  2   | import { SELECTORS } from '@tests/utils/selectors';
  3   | 
  4   | test.describe('Error Handling', () => {
  5   |   test.beforeEach(async ({ page }) => {
  6   |     await page.goto('/dashboard');
> 7   |     await page.waitForSelector(SELECTORS.dashboard.sidebar);
      |                ^ TimeoutError: page.waitForSelector: Timeout 10000ms exceeded.
  8   |   });
  9   | 
  10  |   test('should show error toast on network failure', async ({ page }) => {
  11  |     // Simulate offline
  12  |     await page.context().setOffline(true);
  13  |     
  14  |     // Try to navigate to a tab that makes API calls
  15  |     const requestsTab = page.locator(SELECTORS.nav.tabButton('requests')).first();
  16  |     if (await requestsTab.count() > 0) {
  17  |       await requestsTab.click();
  18  |       await page.waitForTimeout(2000);
  19  |       
  20  |       // Should show error toast
  21  |       const toast = page.locator(SELECTORS.toast.error).first();
  22  |       await expect(toast).toBeVisible({ timeout: 10000 });
  23  |       await expect(toast).toContainText(/network|offline|failed|error/i);
  24  |     }
  25  |     
  26  |     // Restore online
  27  |     await page.context().setOffline(false);
  28  |   });
  29  | 
  30  |   test('should redirect to login on 401 unauthorized', async ({ page }) => {
  31  |     // Clear storage to simulate expired token
  32  |     await page.context().clearCookies();
  33  |     await page.evaluate(() => {
  34  |       localStorage.clear();
  35  |       sessionStorage.clear();
  36  |     });
  37  |     
  38  |     // Try to access dashboard
  39  |     await page.goto('/dashboard');
  40  |     await page.waitForTimeout(2000);
  41  |     
  42  |     // Should redirect to login
  43  |     await expect(page.locator(SELECTORS.login.usernameInput)).toBeVisible({ timeout: 10000 });
  44  |   });
  45  | 
  46  |   test('should handle 429 rate limiting gracefully', async ({ page }) => {
  47  |     // This test would need a backend that returns 429
  48  |     // For now, just verify the UI doesn't crash on repeated requests
  49  |     
  50  |     const requestsTab = page.locator(SELECTORS.nav.tabButton('requests')).first();
  51  |     if (await requestsTab.count() > 0) {
  52  |       // Click multiple times rapidly
  53  |       for (let i = 0; i < 5; i++) {
  54  |         await requestsTab.click();
  55  |         await page.waitForTimeout(100);
  56  |       }
  57  |       
  58  |       // Should not crash
  59  |       await expect(page.locator(SELECTORS.dashboard.mainContent)).toBeVisible();
  60  |     }
  61  |   });
  62  | 
  63  |   test('should show error boundary on 500 server error', async ({ page }) => {
  64  |     // This would need a backend that returns 500
  65  |     // For now, verify error boundary component exists
  66  |     
  67  |     // Navigate to a page
  68  |     const requestsTab = page.locator(SELECTORS.nav.tabButton('requests')).first();
  69  |     if (await requestsTab.count() > 0) {
  70  |       await requestsTab.click();
  71  |       await page.waitForTimeout(500);
  72  |       
  73  |       // Page should render without crashing
  74  |       await expect(page.locator(SELECTORS.dashboard.mainContent)).toBeVisible();
  75  |     }
  76  |   });
  77  | 
  78  |   test('should show loading states during data fetching', async ({ page }) => {
  79  |     // Navigate between tabs quickly
  80  |     const tabs = ['overview', 'requests', 'reservations'];
  81  |     
  82  |     for (const tab of tabs) {
  83  |       const tabButton = page.locator(SELECTORS.nav.tabButton(tab)).first();
  84  |       if (await tabButton.count() > 0) {
  85  |         await tabButton.click();
  86  |         
  87  |         // Should show loading indicator or skeleton
  88  |         const loading = page.locator('text=Loading, [data-testid="loading"], .animate-pulse, .skeleton');
  89  |         // Loading may be too fast to catch, so just verify content loads
  90  |         await page.waitForTimeout(300);
  91  |         
  92  |         await expect(page.locator(SELECTORS.dashboard.mainContent)).toBeVisible();
  93  |       }
  94  |     }
  95  |   });
  96  | 
  97  |   test('should handle empty states gracefully', async ({ page }) => {
  98  |     // Check requests tab empty state
  99  |     const requestsTab = page.locator(SELECTORS.nav.tabButton('requests')).first();
  100 |     if (await requestsTab.count() > 0) {
  101 |       await requestsTab.click();
  102 |       await page.waitForTimeout(500);
  103 |       
  104 |       const table = page.locator(SELECTORS.requests.table).first();
  105 |       await expect(table).toBeVisible();
  106 |       
  107 |       // If no data, should show empty message
```