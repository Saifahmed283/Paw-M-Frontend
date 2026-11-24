# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: dashboard\shift-banner.spec.ts >> Shift Banner >> clicking Check In should show success toast and switch to Check Out
- Location: tests\dashboard\shift-banner.spec.ts:28:3

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
  4   | test.describe('Shift Banner', () => {
  5   |   test.beforeEach(async ({ page }) => {
  6   |     await page.goto('/dashboard');
> 7   |     await page.waitForSelector(SELECTORS.dashboard.sidebar);
      |                ^ TimeoutError: page.waitForSelector: Timeout 10000ms exceeded.
  8   |   });
  9   | 
  10  |   test('should display shift banner on dashboard', async ({ page }) => {
  11  |     const banner = page.locator(SELECTORS.shiftBanner.container).first();
  12  |     await expect(banner).toBeVisible();
  13  |   });
  14  | 
  15  |   test('should show Check In button when no active session', async ({ page }) => {
  16  |     const checkInBtn = page.locator(SELECTORS.shiftBanner.checkInButton).first();
  17  |     await expect(checkInBtn).toBeVisible();
  18  |     
  19  |     const checkOutBtn = page.locator(SELECTORS.shiftBanner.checkOutButton).first();
  20  |     await expect(checkOutBtn).toBeHidden();
  21  |   });
  22  | 
  23  |   test('Check In button should be clickable', async ({ page }) => {
  24  |     const checkInBtn = page.locator(SELECTORS.shiftBanner.checkInButton).first();
  25  |     await expect(checkInBtn).toBeEnabled();
  26  |   });
  27  | 
  28  |   test('clicking Check In should show success toast and switch to Check Out', async ({ page }) => {
  29  |     const checkInBtn = page.locator(SELECTORS.shiftBanner.checkInButton).first();
  30  |     
  31  |     if (await checkInBtn.isEnabled()) {
  32  |       await checkInBtn.click();
  33  |       
  34  |       // Should show success toast
  35  |       const toast = page.locator(SELECTORS.toast.success);
  36  |       await expect(toast).toBeVisible({ timeout: 10000 });
  37  |       await expect(toast).toContainText(/check.?in|started/i);
  38  |       
  39  |       // Should now show Check Out button
  40  |       const checkOutBtn = page.locator(SELECTORS.shiftBanner.checkOutButton).first();
  41  |       await expect(checkOutBtn).toBeVisible({ timeout: 5000 });
  42  |     }
  43  |   });
  44  | 
  45  |   test('clicking Check Out should show success toast and switch to Check In', async ({ page }) => {
  46  |     // First check in if not already
  47  |     const checkInBtn = page.locator(SELECTORS.shiftBanner.checkInButton).first();
  48  |     const checkOutBtn = page.locator(SELECTORS.shiftBanner.checkOutButton).first();
  49  |     
  50  |     if (await checkInBtn.isVisible() && await checkInBtn.isEnabled()) {
  51  |       await checkInBtn.click();
  52  |       await page.waitForTimeout(1000);
  53  |     }
  54  |     
  55  |     // Now click check out
  56  |     if (await checkOutBtn.isVisible() && await checkOutBtn.isEnabled()) {
  57  |       await checkOutBtn.click();
  58  |       
  59  |       // Should show success toast
  60  |       const toast = page.locator(SELECTORS.toast.success);
  61  |       await expect(toast).toBeVisible({ timeout: 10000 });
  62  |       await expect(toast).toContainText(/check.?out|ended/i);
  63  |       
  64  |       // Should now show Check In button again
  65  |       await expect(checkInBtn).toBeVisible({ timeout: 5000 });
  66  |     }
  67  |   });
  68  | 
  69  |   test('should display status orb indicating shift state', async ({ page }) => {
  70  |     const statusOrb = page.locator(SELECTORS.shiftBanner.statusOrb).first();
  71  |     await expect(statusOrb).toBeVisible();
  72  |     
  73  |     // Should have a color indicator (green for active, gray for inactive)
  74  |     const orbElement = statusOrb.locator('[class*="bg-"], [class*="text-"]');
  75  |     await expect(orbElement.first()).toBeVisible();
  76  |   });
  77  | 
  78  |   test('should display session time when checked in', async ({ page }) => {
  79  |     const checkInBtn = page.locator(SELECTORS.shiftBanner.checkInButton).first();
  80  |     const checkOutBtn = page.locator(SELECTORS.shiftBanner.checkOutButton).first();
  81  |     
  82  |     if (await checkInBtn.isVisible() && await checkInBtn.isEnabled()) {
  83  |       await checkInBtn.click();
  84  |       await page.waitForTimeout(1000);
  85  |     }
  86  |     
  87  |     if (await checkOutBtn.isVisible()) {
  88  |       const sessionTime = page.locator(SELECTORS.shiftBanner.sessionTime).first();
  89  |       await expect(sessionTime).toBeVisible({ timeout: 5000 });
  90  |       
  91  |       // Should show time format (e.g., "2h 30m" or similar)
  92  |       const timeText = await sessionTime.textContent();
  93  |       expect(timeText).toMatch(/\d/);
  94  |     }
  95  |   });
  96  | 
  97  |   test('status orb should change color based on shift state', async ({ page }) => {
  98  |     const statusOrb = page.locator(SELECTORS.shiftBanner.statusOrb).first();
  99  |     const checkInBtn = page.locator(SELECTORS.shiftBanner.checkInButton).first();
  100 |     const checkOutBtn = page.locator(SELECTORS.shiftBanner.checkOutButton).first();
  101 |     
  102 |     // Initial state (checked out) - should be gray/idle
  103 |     const initialClass = await statusOrb.getAttribute('class');
  104 |     
  105 |     if (await checkInBtn.isVisible() && await checkInBtn.isEnabled()) {
  106 |       await checkInBtn.click();
  107 |       await page.waitForTimeout(1000);
```