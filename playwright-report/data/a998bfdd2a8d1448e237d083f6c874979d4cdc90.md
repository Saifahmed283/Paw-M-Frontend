# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: dashboard\overview.spec.ts >> Overview Tab >> complete button should show toast when clicked
- Location: tests\dashboard\overview.spec.ts:51:3

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
  1  | import { test, expect } from '@playwright/test';
  2  | import { SELECTORS } from '@tests/utils/selectors';
  3  | 
  4  | test.describe('Overview Tab', () => {
  5  |   test.beforeEach(async ({ page }) => {
  6  |     await page.goto('/dashboard');
> 7  |     await page.waitForSelector(SELECTORS.dashboard.sidebar);
     |                ^ TimeoutError: page.waitForSelector: Timeout 10000ms exceeded.
  8  |     // Ensure we're on overview tab
  9  |     await page.goto('/dashboard');
  10 |     await page.waitForTimeout(500);
  11 |   });
  12 | 
  13 |   test('should display stats cards with correct labels', async ({ page }) => {
  14 |     const statsContainer = page.locator(SELECTORS.overview.statsCards).first();
  15 |     await expect(statsContainer).toBeVisible();
  16 |     
  17 |     // Check for the four stat cards
  18 |     const labels = ['Pending', 'Confirmed', 'Completed', 'Doctors'];
  19 |     for (const label of labels) {
  20 |       const card = page.locator(`text=${label}`).first();
  21 |       await expect(card).toBeVisible({ timeout: 5000 });
  22 |     }
  23 |   });
  24 | 
  25 |   test('should display today\'s appointments section', async ({ page }) => {
  26 |     const todaySection = page.locator(SELECTORS.overview.todayAppointments).first();
  27 |     await expect(todaySection).toBeVisible();
  28 |     
  29 |     // Should have a title
  30 |     await expect(page.locator('text=Today')).toBeVisible();
  31 |   });
  32 | 
  33 |   test('should display recent activity section', async ({ page }) => {
  34 |     const recentSection = page.locator(SELECTORS.overview.recentActivity).first();
  35 |     await expect(recentSection).toBeVisible();
  36 |     
  37 |     // Should have a title
  38 |     await expect(page.locator('text=Recent')).toBeVisible();
  39 |   });
  40 | 
  41 |   test('should show empty state when no appointments today', async ({ page }) => {
  42 |     const todaySection = page.locator(SELECTORS.overview.todayAppointments).first();
  43 |     // Either shows appointments or empty message
  44 |     const hasAppointments = await page.locator(SELECTORS.overview.appointmentItem).count() > 0;
  45 |     const hasEmptyMessage = await page.locator('text=No appointments').count() > 0 ||
  46 |                            await page.locator('text=No data').count() > 0;
  47 |     
  48 |     expect(hasAppointments || hasEmptyMessage).toBeTruthy();
  49 |   });
  50 | 
  51 |   test('complete button should show toast when clicked', async ({ page }) => {
  52 |     const completeBtn = page.locator(SELECTORS.overview.completeButton).first();
  53 |     
  54 |     if (await completeBtn.count() > 0) {
  55 |       await completeBtn.click();
  56 |       
  57 |       // Should show success toast
  58 |       const toast = page.locator(SELECTORS.toast.success);
  59 |       await expect(toast).toBeVisible({ timeout: 5000 });
  60 |       await expect(toast).toContainText(/complete|completed/i);
  61 |     }
  62 |   });
  63 | 
  64 |   test('recent activity table should render', async ({ page }) => {
  65 |     const table = page.locator(SELECTORS.overview.recentTable).first();
  66 |     await expect(table).toBeVisible();
  67 |     
  68 |     // Table should have headers
  69 |     await expect(page.locator('th:has-text("Owner")')).toBeVisible();
  70 |     await expect(page.locator('th:has-text("Pet")')).toBeVisible();
  71 |     await expect(page.locator('th:has-text("Date")')).toBeVisible();
  72 |     await expect(page.locator('th:has-text("Status")')).toBeVisible();
  73 |   });
  74 | });
  75 | 
  76 | test.describe('Overview - Role specific', () => {
  77 |   test('staff should see overview as first tab', async ({ page }) => {
  78 |     await page.goto('/dashboard');
  79 |     await page.waitForSelector(SELECTORS.dashboard.sidebar);
  80 |     
  81 |     // Overview should be active by default for staff
  82 |     const activeTab = page.locator(SELECTORS.nav.activeTab).first();
  83 |     await expect(activeTab).toContainText('Overview');
  84 |   });
  85 | });
```