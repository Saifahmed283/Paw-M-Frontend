# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: dashboard\requests.spec.ts >> Requests Tab >> should show pagination controls
- Location: tests\dashboard\requests.spec.ts:79:3

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
  4   | test.describe('Requests Tab', () => {
  5   |   test.beforeEach(async ({ page }) => {
  6   |     await page.goto('/dashboard');
> 7   |     await page.waitForSelector(SELECTORS.dashboard.sidebar);
      |                ^ TimeoutError: page.waitForSelector: Timeout 10000ms exceeded.
  8   |     
  9   |     // Navigate to requests tab
  10  |     const requestsTab = page.locator(SELECTORS.nav.tabButton('requests')).first();
  11  |     if (await requestsTab.count() > 0) {
  12  |       await requestsTab.click();
  13  |       await page.waitForTimeout(500);
  14  |     }
  15  |   });
  16  | 
  17  |   test('should display search input', async ({ page }) => {
  18  |     const searchInput = page.locator(SELECTORS.requests.searchInput).first();
  19  |     await expect(searchInput).toBeVisible();
  20  |   });
  21  | 
  22  |   test('should display status filter tabs', async ({ page }) => {
  23  |     const statusFilter = page.locator(SELECTORS.requests.statusFilter).first();
  24  |     await expect(statusFilter).toBeVisible();
  25  |     
  26  |     // Check for status options
  27  |     const statuses = ['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'];
  28  |     for (const status of statuses) {
  29  |       const option = page.locator(SELECTORS.requests.statusOption(status.toLowerCase())).first();
  30  |       await expect(option).toBeVisible({ timeout: 3000 });
  31  |     }
  32  |   });
  33  | 
  34  |   test('should display requests table', async ({ page }) => {
  35  |     const table = page.locator(SELECTORS.requests.table).first();
  36  |     await expect(table).toBeVisible();
  37  |     
  38  |     // Check headers
  39  |     await expect(page.locator('th:has-text("Owner")')).toBeVisible();
  40  |     await expect(page.locator('th:has-text("Pet")')).toBeVisible();
  41  |     await expect(page.locator('th:has-text("Doctor")')).toBeVisible();
  42  |     await expect(page.locator('th:has-text("Date")')).toBeVisible();
  43  |     await expect(page.locator('th:has-text("Time")')).toBeVisible();
  44  |     await expect(page.locator('th:has-text("Status")')).toBeVisible();
  45  |     await expect(page.locator('th:has-text("Actions")')).toBeVisible();
  46  |   });
  47  | 
  48  |   test('should filter by search query', async ({ page }) => {
  49  |     const searchInput = page.locator(SELECTORS.requests.searchInput).first();
  50  |     
  51  |     // Type in search
  52  |     await searchInput.fill('Test');
  53  |     await page.waitForTimeout(500);
  54  |     
  55  |     // Table should update (either show filtered results or empty state)
  56  |     const rows = page.locator(SELECTORS.requests.table + ' tbody tr');
  57  |     // Either filtered results or empty state
  58  |     await expect(rows.first()).toBeVisible({ timeout: 5000 });
  59  |   });
  60  | 
  61  |   test('should filter by status', async ({ page }) => {
  62  |     // Click Pending filter
  63  |     const pendingFilter = page.locator(SELECTORS.requests.statusOption('pending')).first();
  64  |     if (await pendingFilter.count() > 0) {
  65  |       await pendingFilter.click();
  66  |       await page.waitForTimeout(500);
  67  |       
  68  |       // All visible rows should have pending status
  69  |       const statusBadges = page.locator(SELECTORS.requests.statusBadge(''));
  70  |       const count = await statusBadges.count();
  71  |       
  72  |       for (let i = 0; i < count; i++) {
  73  |         const badge = statusBadges.nth(i);
  74  |         await expect(badge).toContainText(/pending/i);
  75  |       }
  76  |     }
  77  |   });
  78  | 
  79  |   test('should show pagination controls', async ({ page }) => {
  80  |     const pagination = page.locator(SELECTORS.requests.pagination).first();
  81  |     await expect(pagination).toBeVisible();
  82  |     
  83  |     // Should have page info
  84  |     const pageInfo = page.locator(SELECTORS.requests.pageInfo).first();
  85  |     await expect(pageInfo).toBeVisible();
  86  |   });
  87  | 
  88  |   test('pending request should show Confirm and Cancel buttons', async ({ page }) => {
  89  |     // Find a pending row
  90  |     const rows = page.locator(SELECTORS.requests.table + ' tbody tr');
  91  |     const count = await rows.count();
  92  |     
  93  |     for (let i = 0; i < count; i++) {
  94  |       const row = rows.nth(i);
  95  |       const statusBadge = row.locator(SELECTORS.requests.statusBadge(''));
  96  |       
  97  |       if (await statusBadge.count() > 0) {
  98  |         const statusText = await statusBadge.textContent();
  99  |         if (statusText?.toLowerCase().includes('pending')) {
  100 |           // Should have Confirm button
  101 |           const confirmBtn = row.locator('button:has-text("Confirm")');
  102 |           await expect(confirmBtn).toBeVisible();
  103 |           
  104 |           // Should have Cancel button
  105 |           const cancelBtn = row.locator('button:has-text("Cancel")');
  106 |           await expect(cancelBtn).toBeVisible();
  107 |           
```