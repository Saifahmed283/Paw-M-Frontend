# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth\login.spec.ts >> Authentication >> should login successfully with provided admin credentials
- Location: tests\auth\login.spec.ts:14:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('[data-testid="dashboard-sidebar"], aside.bg-\\[var\\(--navy-900\\)\\]')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" locator('[data-testid="dashboard-sidebar"], aside.bg-\\[var\\(--navy-900\\)\\]') with timeout 5000ms
  - waiting for locator('[data-testid="dashboard-sidebar"], aside.bg-\\[var\\(--navy-900\\)\\]')

```

```yaml
- main:
  - complementary:
    - img "Paw-M"
    - paragraph: Staff portal
    - heading "Care behind every credential." [level=2]
    - paragraph: A considered workspace for the people who make it happen.
    - text: Secure access Clear records Care first
  - button "Back to site"
  - heading "Staff sign-in" [level=1]
  - paragraph: Restricted area. Sign in with your staff credentials to continue.
  - text: Username
  - textbox "e.g. admin"
  - text: Password
  - textbox "••••••••"
  - button "Show password"
  - button "Sign in"
  - paragraph: Can't sign in? Contact your administrator.
- region "Notifications alt+T"
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | import { SELECTORS } from '@tests/utils/selectors';
  3   | 
  4   | test.describe('Authentication', () => {
  5   |   test.use({ storageState: undefined }); // Don't use saved auth for login tests
  6   | 
  7   |   test('should show login page when accessing dashboard unauthenticated', async ({ page }) => {
  8   |     await page.goto('/dashboard');
  9   |     await expect(page.locator(SELECTORS.login.usernameInput)).toBeVisible();
  10  |     await expect(page.locator(SELECTORS.login.passwordInput)).toBeVisible();
  11  |     await expect(page.locator(SELECTORS.login.submitButton)).toBeVisible();
  12  |   });
  13  | 
  14  |   test('should login successfully with provided admin credentials', async ({ page }) => {
  15  |     await page.goto('/dashboard');
  16  |     await page.fill(SELECTORS.login.usernameInput, 'technical-support');
  17  |     await page.fill(SELECTORS.login.passwordInput, 'TS@pawm2026');
  18  |     await page.click(SELECTORS.login.submitButton);
  19  |     
  20  |     // Should redirect to dashboard
  21  |     await expect(page).toHaveURL(/\/dashboard/);
> 22  |     await expect(page.locator(SELECTORS.dashboard.sidebar)).toBeVisible();
      |                                                             ^ Error: expect(locator).toBeVisible() failed
  23  |   });
  24  | 
  25  |   test('should login successfully with valid staff credentials', async ({ page }) => {
  26  |     await page.goto('/dashboard');
  27  |     await page.fill(SELECTORS.login.usernameInput, 'test-staff');
  28  |     await page.fill(SELECTORS.login.passwordInput, 'TestPass123!');
  29  |     await page.click(SELECTORS.login.submitButton);
  30  |     
  31  |     // Should redirect to dashboard
  32  |     await expect(page).toHaveURL(/\/dashboard/);
  33  |     await expect(page.locator(SELECTORS.dashboard.sidebar)).toBeVisible();
  34  |   });
  35  | 
  36  |   test('should show error with invalid credentials', async ({ page }) => {
  37  |     await page.goto('/dashboard');
  38  |     await page.fill(SELECTORS.login.usernameInput, 'invalid-user');
  39  |     await page.fill(SELECTORS.login.passwordInput, 'wrongpassword');
  40  |     await page.click(SELECTORS.login.submitButton);
  41  |     
  42  |     // Should show error toast
  43  |     const toast = page.locator(SELECTORS.toast.error);
  44  |     await expect(toast).toBeVisible({ timeout: 5000 });
  45  |     await expect(toast).toContainText(/invalid|incorrect|wrong/i);
  46  |   });
  47  | 
  48  |   test('should show validation error with empty fields', async ({ page }) => {
  49  |     await page.goto('/dashboard');
  50  |     await page.click(SELECTORS.login.submitButton);
  51  |     
  52  |     // Browser validation or toast should appear
  53  |     const usernameInput = page.locator(SELECTORS.login.usernameInput);
  54  |     // Check if browser validation is present (required attribute or aria-required)
  55  |     const hasRequired = await usernameInput.getAttribute('required') !== null ||
  56  |                         await usernameInput.getAttribute('aria-required') === 'true';
  57  |     expect(hasRequired).toBeTruthy();
  58  |   });
  59  | 
  60  |   test('should logout and return to login', async ({ page }) => {
  61  |     // First login with admin credentials
  62  |     await page.goto('/dashboard');
  63  |     await page.fill(SELECTORS.login.usernameInput, 'technical-support');
  64  |     await page.fill(SELECTORS.login.passwordInput, 'TS@pawm2026');
  65  |     await page.click(SELECTORS.login.submitButton);
  66  |     await expect(page.locator(SELECTORS.dashboard.sidebar)).toBeVisible();
  67  |     
  68  |     // Find and click logout (usually in header/user menu)
  69  |     const logoutButton = page.locator('button:has-text("Logout"), button:has-text("Sign out"), [aria-label*="logout"], [aria-label*="sign out"]');
  70  |     if (await logoutButton.count() > 0) {
  71  |       await logoutButton.click();
  72  |       await expect(page.locator(SELECTORS.login.usernameInput)).toBeVisible({ timeout: 5000 });
  73  |     }
  74  |   });
  75  | });
  76  | 
  77  | test.describe('Role-based access', () => {
  78  |   // These tests use saved auth states from global setup
  79  |   
  80  |   test('staff should see only allowed tabs', async ({ page }) => {
  81  |     await page.goto('/dashboard');
  82  |     await page.waitForSelector(SELECTORS.dashboard.sidebar);
  83  |     
  84  |     // Staff should see: Overview, Requests, Reservations, Prescriptions
  85  |     const visibleTabs = await page.locator(SELECTORS.dashboard.sidebar + ' button, ' + SELECTORS.dashboard.sidebar + ' a').allTextContents();
  86  |     const tabText = visibleTabs.join(' ');
  87  |     
  88  |     expect(tabText).toContain('Overview');
  89  |     expect(tabText).toContain('Requests');
  90  |     expect(tabText).toContain('Reservations');
  91  |     expect(tabText).toContain('Prescriptions');
  92  |     
  93  |     // Should NOT see admin-only tabs
  94  |     expect(tabText).not.toContain('Staff');
  95  |     expect(tabText).not.toContain('Payroll');
  96  |     expect(tabText).not.toContain('Settings');
  97  |   });
  98  | 
  99  |   test('payroll should see extended tabs', async ({ page }) => {
  100 |     await page.goto('/dashboard');
  101 |     await page.waitForSelector(SELECTORS.dashboard.sidebar);
  102 |     
  103 |     const visibleTabs = await page.locator(SELECTORS.dashboard.sidebar + ' button, ' + SELECTORS.dashboard.sidebar + ' a').allTextContents();
  104 |     const tabText = visibleTabs.join(' ');
  105 |     
  106 |     expect(tabText).toContain('Overview');
  107 |     expect(tabText).toContain('Requests');
  108 |     expect(tabText).toContain('Reservations');
  109 |     expect(tabText).toContain('Clients');
  110 |     expect(tabText).toContain('Finance');
  111 |     expect(tabText).toContain('Payroll');
  112 |     expect(tabText).toContain('Doctors');
  113 |     expect(tabText).toContain('Services');
  114 |     expect(tabText).toContain('Products');
  115 |     expect(tabText).toContain('Orders');
  116 |     expect(tabText).toContain('Reviews');
  117 |     expect(tabText).toContain('Workdays');
  118 |     expect(tabText).toContain('Archive');
  119 |     expect(tabText).toContain('Prescriptions');
  120 |     
  121 |     // Should NOT see admin-only tabs
  122 |     expect(tabText).not.toContain('Staff');
```